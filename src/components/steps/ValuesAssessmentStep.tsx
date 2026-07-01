import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle2, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateAssessmentCode,
  launchValuesAssessment,
  getValuesResults,
  getValuesReportUrl,
} from '@/lib/apiClient';
import type { AssessmentQuestion } from '@/data/valuesAssessment';

/**
 * IMX (InnerMetrix) Values Assessment — embedded via iframe.
 *
 * All traffic goes through the FastAPI backend; the browser never talks to
 * IMX directly. The backend keeps assessment codes idempotent per user, so
 * refreshing the page reuses the existing code instead of generating a new
 * one and never restarts the assessment.
 */

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const CHECK_COOLDOWN_S = 30;

type Phase = 'loading' | 'error' | 'in_progress' | 'completed';

interface ValuesAssessmentStepProps {
  contactId?: string;
  email?: string;
  /** Called when the backend confirms the assessment is completed. */
  onCompleted?: () => void;
}

const startTimeKey = (code: string) => `cb_imx_start_${code}`;

const ValuesAssessmentStep = ({ contactId, email, onCompleted }: ValuesAssessmentStepProps) => {
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

  // Load / resume — idempotent generate + launch.
  useEffect(() => {
    if (!contactId) {
      setPhase('error');
      setErrorMsg('You must be signed in to start the assessment.');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setPhase('loading');
        const codeRes = await generateAssessmentCode(contactId, email);
        if (cancelled) return;
        setCode(codeRes.code);

        if (codeRes.completed) {
          setReportUrl(getValuesReportUrl(codeRes.code));
          setPhase('completed');
          notifyCompleted();
          return;
        }

        // Launch (or resume) the values assessment.
        let launchUrl = codeRes.assessment_url ?? '';
        if (!launchUrl) {
          const launch = await launchValuesAssessment(codeRes.code);
          if (cancelled) return;
          launchUrl = launch.assessment_url;
        }
        setAssessmentUrl(launchUrl);

        // Persist / restore the launch timestamp so the 5-min window survives refresh.
        let startedAt = 0;
        try {
          const raw = localStorage.getItem(startTimeKey(codeRes.code));
          startedAt = raw ? Number(raw) : 0;
        } catch { /* ignore */ }
        if (!startedAt || Number.isNaN(startedAt)) {
          startedAt = Date.now();
          try { localStorage.setItem(startTimeKey(codeRes.code), String(startedAt)); } catch { /* ignore */ }
        }
        const elapsed = Date.now() - startedAt;
        if (elapsed >= FIVE_MINUTES_MS) {
          setElapsedReady(true);
        } else {
          const t = window.setTimeout(() => setElapsedReady(true), FIVE_MINUTES_MS - elapsed);
          return () => window.clearTimeout(t);
        }
        setPhase('in_progress');
      } catch (e) {
        if (cancelled) return;
        setPhase('error');
        setErrorMsg(e instanceof Error ? e.message : 'Failed to load the assessment.');
      }
    })();
    return () => { cancelled = true; };
  }, [contactId, email, notifyCompleted]);

  // Ensure phase flips to in_progress once we have the url (async race guard).
  useEffect(() => {
    if (assessmentUrl && phase === 'loading') setPhase('in_progress');
  }, [assessmentUrl, phase]);

  // Cooldown ticker for the Check Status button.
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
      if (res.completed) {
        setReportUrl(res.report_url || getValuesReportUrl(code));
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
// Backwards-compat exports.
//
// The legacy drag-and-drop implementation exposed `buildInitialAssessment` and
// `computeScores`; some callers still import them. With IMX the backend owns
// scoring, so these become no-ops that keep old imports type-safe until every
// caller migrates.
// ---------------------------------------------------------------------------

export function buildInitialAssessment(): AssessmentQuestion[] {
  return [];
}

export function computeScores(_questions: AssessmentQuestion[]): Record<string, number> {
  return {};
}
