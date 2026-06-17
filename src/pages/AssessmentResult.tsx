import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from '@/lib/router-compat';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowLeft, Loader2, Award, TrendingUp, Activity, Minus, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import { getAssessmentResult, type AssessmentResultResponse } from '@/lib/apiClient';
import {
  DRIVER_COLORS,
  DRIVER_LABELS,
  getExplanation,
  getScoreLevel,
  type DriverKey,
  type ScoreLevel,
} from '@/data/valuesAssessment';

const DRIVER_ORDER: DriverKey[] = [
  'aesthetic',
  'economic',
  'individualistic',
  'political',
  'altruistic',
  'regulatory',
  'theoretical',
];

const LEVEL_BADGE: Record<ScoreLevel, { label: string; cls: string; icon: typeof Award }> = {
  dominant: { label: 'Dominant', cls: 'bg-primary text-primary-foreground', icon: Award },
  high: { label: 'High', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', icon: TrendingUp },
  moderate: { label: 'Moderate', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300', icon: Activity },
  low: { label: 'Low', cls: 'bg-muted text-muted-foreground', icon: Minus },
};

const AssessmentResult = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cid = params.get('cid') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AssessmentResultResponse | null>(null);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cid) {
      setError('Missing required "cid" query parameter.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getAssessmentResult(cid)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load assessment results.');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [cid]);

  const chartData = useMemo(() => {
    const scores = data?.values_assessment?.scores ?? data?.scores ?? {};
    return DRIVER_ORDER.map((key) => ({
      key,
      name: DRIVER_LABELS[key],
      value: Number(scores[key] ?? 0),
      color: DRIVER_COLORS[key],
    }));
  }, [data]);

  const maxScore = useMemo(() => Math.max(100, ...chartData.map((c) => c.value)), [chartData]);

  const rawName = [data?.firstName, data?.lastName].filter(Boolean).join(' ').trim()
    || (data?.name ?? '').trim();
  const applicantName = rawName || 'Applicant';
  const hasName = !!rawName;

  const handleDownloadPdf = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const node = reportRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const imgWidth = pageWidth - margin * 2;
      const ratio = imgWidth / canvas.width;
      const fullImgHeight = canvas.height * ratio;
      const usablePageHeight = pageHeight - margin * 2;

      if (fullImgHeight <= usablePageHeight) {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, fullImgHeight);
      } else {
        // Slice the source canvas vertically so nothing gets cropped.
        const sliceHeightPx = Math.floor(usablePageHeight / ratio);
        let sY = 0;
        while (sY < canvas.height) {
          const h = Math.min(sliceHeightPx, canvas.height - sY);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = h;
          const ctx = sliceCanvas.getContext('2d');
          if (!ctx) break;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(canvas, 0, sY, canvas.width, h, 0, 0, canvas.width, h);
          const sliceData = sliceCanvas.toDataURL('image/png');
          pdf.addImage(sliceData, 'PNG', margin, margin, imgWidth, h * ratio);
          sY += h;
          if (sY < canvas.height) pdf.addPage();
        }
      }
      const safeName = applicantName.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'assessment';
      pdf.save(`${safeName}_assessment_results.pdf`);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setDownloading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto" />
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary">
              Values Assessment
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && data && (
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2 disabled:opacity-60"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? 'Preparing…' : 'Download PDF'}
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="btn-outline text-sm px-4 py-2 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      </header>


      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {loading && (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading assessment results…</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-card rounded-2xl border border-destructive/30 shadow-sm p-8 text-center">
            <p className="text-sm font-semibold text-destructive">Could not load results</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <div ref={reportRef}>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 mb-6">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Results</p>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Assessment Results for <span className="text-primary">{applicantName}</span>
                  </h1>
                </div>
                {data.email && (
                  <p className="text-sm text-muted-foreground">{data.email}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                The chart below shows the candidate's relative score across the seven core value drivers.
                Higher values indicate stronger motivators. See the table for a tailored interpretation.
              </p>

              <p className="mt-6 text-lg font-heading font-semibold text-foreground">
                Applicant: <span className="text-primary">{applicantName}</span>
              </p>


              <div className="mt-3 h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 12, right: 12, bottom: 4, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      domain={[0, maxScore]}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((d) => (
                        <Cell key={d.key} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">Driver interpretation</h2>
              <p className="text-sm text-muted-foreground mb-5">
                {hasName && data.firstName ? `Hi ${data.firstName}! Here's` : hasName ? `Hi ${applicantName.split(' ')[0]}! Here's` : 'Here is'} the interpretation of the assessment results.
              </p>

              <div className="space-y-3">
                {chartData.map((d) => {
                  const level = getScoreLevel(d.value);
                  const badge = LEVEL_BADGE[level];
                  const Icon = badge.icon;
                  const description = getExplanation(d.key, d.value);
                  return (
                    <div
                      key={d.key}
                      className="rounded-xl border border-border bg-background p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="sm:w-56 shrink-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-sm"
                            style={{ background: d.color }}
                            aria-hidden
                          />
                          <h3 className="font-heading text-base font-semibold text-foreground">{d.name}</h3>
                        </div>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-foreground tabular-nums">{d.value}</span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}
                          >
                            <Icon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        )}
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentResult;
