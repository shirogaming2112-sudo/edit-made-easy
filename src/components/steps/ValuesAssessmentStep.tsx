import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle2, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateValuesCode,
  launchValuesAssessment,
  getValuesResults,
  getValuesReportUrl,
  isValuesResultCompleted,
} from '@/lib/apiClient';
import type { AssessmentQuestion } from '@/data/valuesAssessment';

/**
 * IMX (InnerMetrix) Values Assessment — embedded via iframe.
 *
 * All traffic goes through the FastAPI backend; the browser never talks to
 * IMX directly. The backend `/generate_codes` endpoint does NOT persist per-
 * user linkage, so we cache the generated code in `localStorage` keyed by
 * `contactId` and reuse it on refresh instead of generating a new one.
 */

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const CHECK_COOLDOWN_S = 30;

type Phase = 'loading' | 'error' | 'in_progress' | 'completed';

interface ValuesAssessmentStepProps {
  contactId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  /** Called when the backend confirms the assessment is completed. */
  onCompleted?: () => void;
}

const codeCacheKey = (contactId: string) => `cb_imx_values_code_${contactId}`;
const startTimeKey = (code: string) => `cb_imx_start_${code}`;

const readCachedCode = (contactId: string): string => {
  try {
    return localStorage.getItem(codeCacheKey(contactId)) ?? '';
  } catch {
    return '';
  }
};

const writeCachedCode = (contactId: string, code: string) => {
  try {
    localStorage.setItem(codeCacheKey(contactId), code);
  } catch { /* ignore */ }
};

/** Derive fname/lname from an email local-part when the caller didn't pass names. */
const deriveNames = (email?: string): { fname: string; lname: string } => {
  const local = (email ?? '').split('@')[0] ?? '';
  const parts = local.split(/[._-]+/).filter(Boolean);
  const fname = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : 'Applicant';
  const lname = parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1) : 'User';
  return { fname, lname };
};

const ValuesAssessmentStep = ({
  contactId,
  email,
  firstName,
  lastName,
  onCompleted,
}: ValuesAssessmentStepProps) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [assessmentUrl, setAssessmentUrl] = useState<string>('');
  const [reportUrl, setReportUrl] = useState<string>('');
  const [elapsedReady, setElapsedReady] = useState<boolean>(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notCompleteMsg, setNotCompleteMsg] = useState<string>('');
  const completedNotifiedRef = useRef(false);

  const notifyCompleted = useCallback(() => {
    if (completedNotifiedRef.current) return;
    completedNotifiedRef.current = true;
    onCompleted?.();
  }, [onCompleted]);

  useEffect(() => {
    if (!contactId) {
      setPhase('error');
      setErrorMsg('You must be signed in to start the assessment.');
      return;
    }
    let cancelled = false;
    let timerId: number | undefined;

    (async () => {
      try {
        setPhase('loading');

        // 1. Reuse or generate the values code, cached per user.
        let currentCode = readCachedCode(contactId);
        if (!currentCode) {
          currentCode = await generateValuesCode();
          if (cancelled) return;
          writeCachedCode(contactId, currentCode);
        }
        setCode(currentCode);

        // 2. Optimistically check if the assessment is already completed
        //    (e.g. user came back after finishing in another tab).
        try {
          const existing = await getValuesResults(currentCode);
          if (cancelled) return;
          if (isValuesResultCompleted(existing)) {
            setReportUrl(getValuesReportUrl(currentCode));
            setPhase('completed');
            notifyCompleted();
            return;
          }
        } catch { /* not yet started — continue */ }

        // 3. Launch (or resume) the values assessment.
        const derived = deriveNames(email);
        const fname = (firstName && firstName.trim()) || derived.fname;
        const lname = (lastName && lastName.trim()) || derived.lname;
        const launch = await launchValuesAssessment({
          code: currentCode,
          fname,
          lname,
          email: email ?? '',
        });
        if (cancelled) return;
        setAssessmentUrl(launch.assessment_url);

        // 4. Persist the launch timestamp so the 5-min window survives refresh.
        let startedAt = 0;
        try {
          const raw = localStorage.getItem(startTimeKey(currentCode));
          startedAt = raw ? Number(raw) : 0;
        } catch { /* ignore */ }
        if (!startedAt || Number.isNaN(startedAt)) {
          startedAt = Date.now();
          try { localStorage.setItem(startTimeKey(currentCode), String(startedAt)); } catch { /* ignore */ }
        }
        const elapsed = Date.now() - startedAt;
        if (elapsed >= FIVE_MINUTES_MS) {
          setElapsedReady(true);
        } else {
          timerId = window.setTimeout(() => setElapsedReady(true), FIVE_MINUTES_MS - elapsed);
        }
        setPhase('in_progress');
      } catch (e) {
        if (cancelled) return;
        setPhase('error');
        setErrorMsg(e instanceof Error ? e.message : 'Failed to load the assessment.');
      }
    })();

    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [contactId, email, firstName, lastName, notifyCompleted]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  const handleCheckStatus = async () => {
    if (!code || checking || cooldown > 0) return;
    setChecking(true);
    setNotCompleteMsg('');
    try {
      const res = await getValuesResults(code);
      if (isValuesResultCompleted(res)) {
        setReportUrl(getValuesReportUrl(code));
        setPhase('completed');
        notifyCompleted();
        toast.success('Assessment completed. You may continue.');
      } else {
        setNotCompleteMsg(
          'Your assessment is not yet complete. Please finish the assessment before continuing, then try again.',
        );
        setCooldown(CHECK_COOLDOWN_S);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to check status.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground">Values Assessment</p>
        <p className="text-sm text-muted-foreground mt-1">
          Please complete the embedded assessment below. Your progress is saved automatically —
          if you close the page you can return later and pick up where you left off.
        </p>
      </div>

      {phase === 'loading' && (
        <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm">Preparing your assessment…</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
          <p className="text-sm font-semibold text-destructive">Could not load the assessment</p>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
        </div>
      )}

      {phase === 'in_progress' && assessmentUrl && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <iframe
              src={assessmentUrl}
              title="Values Assessment"
              className="w-full h-[70vh] min-h-[520px] border-0"
              allow="fullscreen; clipboard-write"
            />
          </div>

          {!elapsedReady ? (
            <p className="text-xs text-muted-foreground text-center">
              The Continue button will appear here once you have had time to complete the assessment.
              Please finish it in the frame above.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={checking || cooldown > 0}
                className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {cooldown > 0
                  ? `Check Again (${cooldown}s)`
                  : checking
                    ? 'Checking…'
                    : 'Check Assessment Status'}
              </button>
              {notCompleteMsg && (
                <p className="text-sm text-amber-700 dark:text-amber-300 text-center max-w-md">
                  {notCompleteMsg}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {phase === 'completed' && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Assessment completed</p>
              <p className="text-sm text-muted-foreground">
                Thank you — your responses have been recorded. You may continue.
              </p>
            </div>
          </div>
          {reportUrl && (
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline inline-flex items-center gap-2 text-sm px-4 py-2 sm:ml-auto"
            >
              <Download className="w-4 h-4" /> Download report
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ValuesAssessmentStep;

// ---------------------------------------------------------------------------
// Backwards-compat exports for the legacy drag-and-drop callers. IMX owns
// scoring now, so these are no-ops kept only for type-safe imports.
// ---------------------------------------------------------------------------

export function buildInitialAssessment(): AssessmentQuestion[] {
  return [];
}

export function computeScores(_questions: AssessmentQuestion[]): Record<string, number> {
  return {};
}
