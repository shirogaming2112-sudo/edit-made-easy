import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { LogOut, Search, Download, FileText, User, Upload, Star, RefreshCw, BarChart3, ChevronLeft, ChevronRight, Users, Settings as SettingsIcon } from 'lucide-react';
import SettingsPanel from '@/components/admin/SettingsPanel';
import jsPDF from 'jspdf';
import Logo from '@/components/Logo';
import page1Bg from '@/assets/resume-page1-bg.png';
import page2Bg from '@/assets/resume-page2-bg.png';
import Footer from '@/components/Footer';
import { MOCK_APPLICANTS, type MockApplicant } from '@/data/mockApplicants';
import type { SelectedSkill } from '@/types/application';
import { getApplicants, getDashboard, getDashboardByEmail } from '@/lib/apiClient';
import { toast } from 'sonner';

const PROFICIENCY_DOTS: Record<SelectedSkill['proficiency'], number> = {
  'No Experience': 1,
  Basic: 2,
  Intermediate: 3,
  Proficient: 4,
  Expert: 5,
};
const PROFICIENCY_STARS = PROFICIENCY_DOTS;

interface ApplicantState {
  enabledSkills: Record<string, boolean>; // keyed by skill name
  enabledTools: Record<string, boolean>; // keyed by tool name
  photoDataUrl: string | null;
}

const buildEmptyApplicant = (id: string, name: string, email: string): MockApplicant => {
  const [firstName, ...rest] = (name || email.split('@')[0] || 'Applicant').split(' ');
  return {
    id,
    firstName: firstName || 'Applicant',
    lastName: rest.join(' '),
    email,
    role: 'Cyberbacker',
    location: '',
    photoUrl: null,
    about: '',
    skills: [],
    tools: [],
    experiences: [],
  };
};

interface PageCacheEntry {
  applicants: MockApplicant[];
  startAfter: string;
  hasMore: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [applicants, setApplicants] = useState<MockApplicant[]>(MOCK_APPLICANTS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_APPLICANTS[0]?.id ?? '');
  const [loadingList, setLoadingList] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;
  const [hasMore, setHasMore] = useState(false);
  const pageCacheRef = useRef<Record<number, PageCacheEntry>>({});
  const startAfterByPageRef = useRef<Record<number, string>>({});
  const [stateMap, setStateMap] = useState<Record<string, ApplicantState>>(() => {
    const initial: Record<string, ApplicantState> = {};
    MOCK_APPLICANTS.forEach((a) => {
      initial[a.id] = {
        enabledSkills: Object.fromEntries(a.skills.map((s) => [s.skill, true])),
        enabledTools: Object.fromEntries(a.tools.map((t) => [t, true])),
        photoDataUrl: null,
      };
    });
    return initial;
  });
  const photoInputRef = useRef<HTMLInputElement>(null);

  const ensureState = (id: string, a: MockApplicant) => {
    setStateMap((m) =>
      m[id]
        ? m
        : {
            ...m,
            [id]: {
              enabledSkills: Object.fromEntries(a.skills.map((s) => [s.skill, true])),
              enabledTools: Object.fromEntries(a.tools.map((t) => [t, true])),
              photoDataUrl: null,
            },
          },
    );
  };

  const applyPage = (targetPage: number, entry: PageCacheEntry) => {
    setApplicants(entry.applicants);
    entry.applicants.forEach((a) => ensureState(a.id, a));
    setSelectedId((prev) =>
      entry.applicants.find((m) => m.id === prev) ? prev : entry.applicants[0]?.id ?? '',
    );
    setHasMore(entry.hasMore);
    startAfterByPageRef.current[targetPage] = entry.startAfter;
  };

  const fetchApplicants = async (targetPage = page, { background = false } = {}) => {
    const cached = pageCacheRef.current[targetPage];
    if (cached && background) {
      applyPage(targetPage, cached);
    }
    if (!cached) setLoadingList(true);
    try {
      const cursor = targetPage > 1 ? startAfterByPageRef.current[targetPage - 1] || '' : '';
      const res = await getApplicants(targetPage, PAGE_SIZE, cursor);
      if (res?.data?.length) {
        const mapped = res.data.map((a) => buildEmptyApplicant(a.id, a.name, a.email));
        const startAfter = res.start_after ?? mapped[mapped.length - 1]?.id ?? '';
        const more = res.has_more ?? (res.data.length === PAGE_SIZE);
        const entry: PageCacheEntry = { applicants: mapped, startAfter, hasMore: more };
        // If cursor changed vs cached, invalidate later pages.
        if (cached && cached.startAfter !== startAfter) {
          Object.keys(pageCacheRef.current)
            .map(Number)
            .filter((p) => p > targetPage)
            .forEach((p) => {
              delete pageCacheRef.current[p];
              delete startAfterByPageRef.current[p];
            });
        }
        pageCacheRef.current[targetPage] = entry;
        applyPage(targetPage, entry);
        if (!background) {
          toast.success(`Loaded ${res.count} applicant${res.count === 1 ? '' : 's'} (page ${targetPage})`);
        }
      } else if (!cached) {
        setHasMore(false);
        toast.message('No applicants returned from API');
      }
    } catch (e) {
      if (!background) toast.error(e instanceof Error ? e.message : 'Failed to load applicants');
    } finally {
      setLoadingList(false);
    }
  };

  const refreshCurrentPage = () => {
    delete pageCacheRef.current[page];
    void fetchApplicants(page);
  };

  useEffect(() => {
    // Always refetch on page change so the list reflects the latest backend data;
    // cache provides instant render while the background refresh runs.
    void fetchApplicants(page, { background: !!pageCacheRef.current[page] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Fetch full applicant detail when selection changes (best-effort).
  useEffect(() => {
    if (!selectedId || selectedId.startsWith('app-')) return;
    let cancelled = false;
    (async () => {
      try {
        const d = await getDashboard(selectedId);
        if (cancelled) return;
        const pi = d.personal_info || {};
        const sk = (d.skills?.items || []) as Array<{ skill?: string; category?: string; proficiency?: string }>;
        const tl = (d.tools || []) as Array<{ tool?: string }>;
        const we = (d.work_experience || []) as Array<Record<string, unknown>>;
        setApplicants((list) =>
          list.map((a) =>
            a.id === selectedId
              ? {
                  ...a,
                  firstName: pi.first_name || a.firstName,
                  lastName: pi.last_name || a.lastName,
                  email: d.email || a.email,
                  location:
                    [pi.city, pi.barangay, pi.street].filter(Boolean).join(', ') || a.location,
                  about: d.skills?.value_proposition || a.about,
                  skills: sk
                    .filter((s) => s && s.skill)
                    .map((s) => ({
                      skill: String(s.skill),
                      category: String(s.category || ''),
                      proficiency: (s.proficiency as SelectedSkill['proficiency']) || 'Proficient',
                    })),
                  tools: tl.filter((t) => t && t.tool).map((t) => String(t.tool)),
                  experiences: we.map((e, i) => ({
                    id: String(e.id ?? `we-${i}`),
                    title: String(e.title ?? ''),
                    employer: String(e.employer ?? ''),
                    location: String(e.location ?? ''),
                    startDate: String(e.startDate ?? e.start_date ?? ''),
                    endDate: String(e.endDate ?? e.end_date ?? ''),
                    currentlyWorking: Boolean(e.currentlyWorking ?? e.currently_working ?? false),
                    responsibilities: String(e.responsibilities ?? ''),
                    toolsPlatforms: String(e.toolsPlatforms ?? e.tools_platforms ?? ''),
                  })),
                }
              : a,
          ),
        );
        // Initialise toggles for all skills/tools as enabled.
        setStateMap((m) => ({
          ...m,
          [selectedId]: {
            enabledSkills: Object.fromEntries(sk.filter((s) => s.skill).map((s) => [String(s.skill), true])),
            enabledTools: Object.fromEntries(tl.filter((t) => t.tool).map((t) => [String(t.tool), true])),
            photoDataUrl: m[selectedId]?.photoDataUrl ?? null,
          },
        }));
      } catch (e) {
        console.warn('getDashboard failed', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleSearchEmail = async () => {
    const q = query.trim();
    if (!q) return;
    // Plain in-memory filter for non-email lookups happens automatically via `filtered`.
    if (!/\S+@\S+\.\S+/.test(q)) {
      toast.message('Enter a full email address to look up an applicant outside the loaded pages.');
      return;
    }
    setSearching(true);
    try {
      const d = await getDashboardByEmail(q);
      if (!d?.id) {
        toast.error('No applicant found for that email.');
        return;
      }
      const pi = d.personal_info || {};
      const name = [pi.first_name, pi.last_name].filter(Boolean).join(' ') || d.email;
      const stub = buildEmptyApplicant(d.id, name, d.email);
      // Replace the list with the matched applicant and reset pagination.
      pageCacheRef.current = {};
      startAfterByPageRef.current = {};
      setApplicants([stub]);
      ensureState(d.id, stub);
      setPage(1);
      setHasMore(false);
      setSelectedId(d.id);
      setQuery('');
      toast.success(`Found ${name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applicants;
    return applicants.filter((a) =>
      `${a.firstName} ${a.lastName} ${a.email} ${a.role} ${a.location}`.toLowerCase().includes(q),
    );
  }, [query, applicants]);

  const applicant = applicants.find((a) => a.id === selectedId) ?? applicants[0];
  const state = stateMap[applicant?.id] ?? {
    enabledSkills: {},
    enabledTools: {},
    photoDataUrl: null,
  };

  const toggleSkill = (skill: string) => {
    setStateMap((m) => ({
      ...m,
      [applicant.id]: {
        ...m[applicant.id],
        enabledSkills: { ...m[applicant.id].enabledSkills, [skill]: !m[applicant.id].enabledSkills[skill] },
      },
    }));
  };

  const toggleTool = (tool: string) => {
    setStateMap((m) => ({
      ...m,
      [applicant.id]: {
        ...m[applicant.id],
        enabledTools: { ...m[applicant.id].enabledTools, [tool]: !m[applicant.id].enabledTools[tool] },
      },
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setStateMap((m) => ({
        ...m,
        [applicant.id]: { ...m[applicant.id], photoDataUrl: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
  };

  const generateResume = async () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const [page1DataUrl, page2DataUrl] = await Promise.all([
        loadImageAsDataUrl(page1Bg),
        loadImageAsDataUrl(page2Bg),
      ]);
      drawResume(doc, applicant, state, page1DataUrl, page2DataUrl);
      const filename = `${applicant.firstName}_${applicant.lastName}_Resume.pdf`.replace(/\s+/g, '_');
      doc.save(filename);
      toast.success('Resume generated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate resume');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-auto" variant="black" />
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary">
              Admin
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-outline text-sm px-4 py-2 inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search applicants, manage their resume content, and generate downloadable resumes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Applicants list */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-fit">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email, role..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') void handleSearchEmail(); }}
                  className="form-input pl-9"
                />
              </div>
              <button
                type="button"
                onClick={() => void handleSearchEmail()}
                disabled={searching || !query.trim()}
                className="btn-primary text-sm px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Look up applicant by email"
              >
                {searching ? '...' : 'Search'}
              </button>
            </div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs text-muted-foreground">
                {filtered.length} applicant{filtered.length === 1 ? '' : 's'}
              </p>
              <button
                onClick={refreshCurrentPage}
                disabled={loadingList}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingList ? 'animate-spin' : ''}`} />
                {loadingList ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    a.id === selectedId
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm font-semibold leading-tight">
                    {a.firstName} {a.lastName}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      a.id === selectedId ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}
                  >
                    {a.role} · {a.email}
                  </p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground italic p-3">No applicants found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={loadingList || page <= 1}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-xs text-muted-foreground">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loadingList || !hasMore}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Detail panel */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                  {state.photoDataUrl ? (
                    <img src={state.photoDataUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {applicant.firstName} {applicant.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{applicant.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{applicant.location}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="btn-outline text-sm inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
                <button
                  onClick={() =>
                    navigate(`/assessment-result?cid=${encodeURIComponent(applicant.id)}`)
                  }
                  className="btn-outline text-sm inline-flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" /> View Assessment
                </button>
                <button
                  onClick={generateResume}
                  className="btn-primary text-sm inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Generate Resume PDF
                </button>
              </div>
            </div>

            <section className="mb-6">
              <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                About
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{applicant.about}</p>
            </section>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">
                  Core Skills
                </h3>
                <span className="text-xs text-muted-foreground">
                  Toggle to include/exclude on resume
                </span>
              </div>
              <div className="space-y-2">
                {applicant.skills.map((s) => {
                  const enabled = state.enabledSkills[s.skill];
                  return (
                    <label
                      key={s.skill}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        enabled
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border bg-muted/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => toggleSkill(s.skill)}
                          className="w-4 h-4 accent-primary shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{s.skill}</p>
                          <p className="text-xs text-muted-foreground">{s.proficiency}</p>
                        </div>
                      </div>
                      <StarRating count={PROFICIENCY_STARS[s.proficiency]} />
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">
                  Tools
                </h3>
                <span className="text-xs text-muted-foreground">
                  Toggle to include/exclude on resume
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {applicant.tools.map((t) => {
                  const enabled = state.enabledTools[t];
                  return (
                    <label
                      key={t}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        enabled
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border bg-muted/40 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleTool(t)}
                        className="w-4 h-4 accent-primary shrink-0"
                      />
                      <span className="text-sm font-medium text-foreground">{t}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide mb-3 inline-flex items-center gap-2">
                <FileText className="w-4 h-4" /> Experience
              </h3>
              {applicant.experiences.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No experience added.</p>
              ) : (
                <div className="space-y-3">
                  {applicant.experiences.map((e) => (
                    <div key={e.id} className="border border-border rounded-xl p-4">
                      <p className="text-sm font-semibold text-foreground">
                        {e.title} — {e.startDate}
                        {e.endDate || e.currentlyWorking ? `–${e.currentlyWorking ? 'Present' : e.endDate}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {e.employer}
                        {e.location ? ` · ${e.location}` : ''}
                      </p>
                      {e.responsibilities && (
                        <p className="text-sm text-foreground mt-2 whitespace-pre-line leading-relaxed">
                          {e.responsibilities}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 shrink-0">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground/40'}`}
      />
    ))}
  </div>
);

// ============================================================================
// PDF GENERATION
// ============================================================================

function drawResume(
  doc: jsPDF,
  applicant: MockApplicant,
  state: ApplicantState,
  page1Bg: string | null,
  page2Bg: string | null,
) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  // Left panel widths come from the background art:
  // page1 background: blue panel covers ~27% of width
  // page2 background (used for all pages): blue strip covers ~30% of width
  const leftWPage1 = pageW * 0.27;
  const leftWPage2 = pageW * 0.30;
  // Push content well clear of the blue strip on every page so text never
  // overlaps the background. Use the wider page2 strip + generous padding.
  const rightX = leftWPage2 + 40;
  const rightW = pageW - rightX - 48;
  const topMargin = 80;
  const bottomLimit = pageH - 70;

  // ---- chrome (called for every page): just paints the bg image full-bleed ----
  const drawChrome = (pageIndex: number) => {
    // Use page2 background for ALL pages per design update
    const bg = page2Bg;
    if (bg) {
      try {
        doc.addImage(bg, 'PNG', 0, 0, pageW, pageH);
      } catch {
        // ignore
      }
    }

    if (pageIndex === 0) {
      drawLeftPanelHeader();
    } else {
      // Continuation header on left strip
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      const cx = leftWPage2 / 2;
      doc.text(`${applicant.firstName} ${applicant.lastName}`, cx, 70, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(applicant.role, cx, 88, { align: 'center' });
      doc.setFontSize(9);
      doc.setTextColor(220, 230, 245);
      doc.text(`Page ${pageIndex + 1}`, cx, pageH - 30, { align: 'center' });
    }
  };

  const drawLeftPanelHeader = () => {
    // Photo box position aligned to the artwork on page1Bg
    const photoX = pageW * 0.035;
    const photoY = pageH * 0.07;
    const photoW = leftWPage1 - photoX * 2;
    const photoH = photoW;
    if (state.photoDataUrl) {
      try {
        const fmt = state.photoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(state.photoDataUrl, fmt, photoX, photoY, photoW, photoH);
      } catch {
        // ignore
      }
    }

    // Address/location sits directly under the picture.
    const locTextX = photoX + photoW / 2;
    const locY = photoY + photoH + 26;
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const [city, country] = applicant.location.split(',').map((s) => s.trim());
    doc.text((city || applicant.location || '').toUpperCase(), locTextX, locY, { align: 'center', maxWidth: photoW });
    if (country) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(country, locTextX, locY + 13, { align: 'center', maxWidth: photoW });
    }
  };

  let pageIndex = 0;
  drawChrome(pageIndex);

  // Page-break helper: ensures `needed` vertical space is free; new page if not.
  const ensureSpace = (currentY: number, needed: number): number => {
    if (currentY + needed <= bottomLimit) return currentY;
    doc.addPage();
    pageIndex += 1;
    drawChrome(pageIndex);
    return topMargin;
  };

  let y = topMargin;

  // ===== Header (page 1 only) =====
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(`${applicant.firstName} ${applicant.lastName}`, rightX, y);
  y += 26;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text(applicant.role, rightX, y);
  y += 28;

  // About
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('ABOUT ME', rightX, y);
  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);
  const aboutLines = doc.splitTextToSize(applicant.about, rightW);
  doc.text(aboutLines, rightX, y, { lineHeightFactor: 1.4 });
  y += aboutLines.length * 12 + 8;

  // Divider
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.7);
  doc.line(rightX, y, rightX + rightW, y);
  y += 16;

  // ===== Skills + Tools (paginated row-by-row) =====
  const colW = (rightW - 30) / 2;
  const colGap = 30;
  const rowH = 14;
  const sectionTitleH = 18;

  const enabledSkills = applicant.skills.filter((s) => state.enabledSkills[s.skill]);
  const enabledTools = applicant.tools.filter((t) => state.enabledTools[t]);

  const skillItems = enabledSkills.map((s) => ({ label: s.skill, dots: PROFICIENCY_DOTS[s.proficiency] }));
  const toolItems = enabledTools.map((t) => ({ label: t, dots: 5 }));
  const totalRows = Math.max(skillItems.length, toolItems.length);

  // Need at least title + one row to start the section on this page
  y = ensureSpace(y, sectionTitleH + rowH + 12);

  let rowIndex = 0;
  let drawTitles = true;
  let sectionStartY = y;

  while (rowIndex < totalRows) {
    if (drawTitles) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      doc.text(rowIndex === 0 ? 'CORE SKILLS:' : 'CORE SKILLS (cont.):', rightX, sectionStartY);
      doc.text(rowIndex === 0 ? 'TOOLS:' : 'TOOLS (cont.):', rightX + colW + colGap, sectionStartY);
      drawTitles = false;
      y = sectionStartY + sectionTitleH;
    }

    // How many rows fit on this page from current y?
    const remaining = bottomLimit - y;
    const rowsThatFit = Math.max(0, Math.floor(remaining / rowH));
    if (rowsThatFit === 0) {
      y = ensureSpace(y, rowH * 4);
      sectionStartY = y;
      drawTitles = true;
      continue;
    }

    const rowsToDraw = Math.min(rowsThatFit, totalRows - rowIndex);
    const skillSlice = skillItems.slice(rowIndex, rowIndex + rowsToDraw);
    const toolSlice = toolItems.slice(rowIndex, rowIndex + rowsToDraw);

    drawSkillRows(doc, skillSlice, rightX, y, colW);
    drawSkillRows(doc, toolSlice, rightX + colW + colGap, y, colW);

    y += rowsToDraw * rowH;
    rowIndex += rowsToDraw;

    if (rowIndex < totalRows) {
      // Need a new page for remaining rows
      y = ensureSpace(y, rowH * 4);
      sectionStartY = y;
      drawTitles = true;
    }
  }

  y += 12;

  // Divider before experience
  y = ensureSpace(y, 30);
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.7);
  doc.line(rightX, y, rightX + rightW, y);
  y += 16;

  // ===== Experience =====
  y = ensureSpace(y, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('EXPERIENCE', rightX, y);
  y += 16;

  for (const exp of applicant.experiences) {
    const range = exp.currentlyWorking
      ? `${exp.startDate}-Present`
      : exp.endDate
        ? `${exp.startDate}-${exp.endDate}`
        : exp.startDate;

    y = ensureSpace(y, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    doc.text(`${exp.title} - ${range}`, rightX, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const bullets = exp.responsibilities.split('\n').filter(Boolean);
    for (const b of bullets) {
      const lines = doc.splitTextToSize(`• ${b}`, rightW - 10);
      // Break per bullet if needed
      y = ensureSpace(y, lines.length * 11);
      doc.text(lines, rightX + 6, y);
      y += lines.length * 11;
    }
    y += 6;
  }
}

function drawSkillRows(
  doc: jsPDF,
  items: { label: string; dots: number }[],
  x: number,
  startY: number,
  width: number,
) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  let cy = startY;
  for (const it of items) {
    doc.setTextColor(50, 50, 50);
    // Truncate label to leave room for stars
    const starsW = 5 * 6 + 4 * 2;
    const labelMaxW = width - starsW - 8;
    const labelLines = doc.splitTextToSize(`• ${it.label}`, labelMaxW);
    doc.text(labelLines[0], x, cy);

    const starSize = 6;
    const gap = 2;
    const totalW = 5 * starSize + 4 * gap;
    let sx = x + width - totalW;
    for (let i = 0; i < 5; i++) {
      drawStar(doc, sx + starSize / 2, cy - 3, starSize / 2, i < it.dots);
      sx += starSize + gap;
    }
    cy += 14;
  }
}

function drawStar(doc: jsPDF, cx: number, cy: number, r: number, filled: boolean) {
  const points: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  if (filled) {
    doc.setFillColor(28, 78, 156);
  } else {
    doc.setFillColor(220, 220, 225);
  }
  // jsPDF lines() expects relative deltas
  const lines: [number, number][] = [];
  for (let i = 1; i < points.length; i++) {
    lines.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);
  }
  lines.push([points[0][0] - points[points.length - 1][0], points[0][1] - points[points.length - 1][1]]);
  doc.lines(lines, points[0][0], points[0][1], [1, 1], 'F', true);
}

function drawMapPin(doc: jsPDF, x: number, y: number, size: number, r: number, g: number, b: number) {
  // White rounded "chip" background circle
  doc.setFillColor(255, 255, 255);
  doc.circle(x + size / 2, y + size / 2, size * 0.95, 'F');
  // Pin body (teardrop approximated by circle + small triangle)
  doc.setFillColor(r, g, b);
  const cx = x + size / 2;
  const cy = y + size / 2 - size * 0.05;
  doc.circle(cx, cy, size * 0.45, 'F');
  // Triangle tip
  doc.triangle(
    cx - size * 0.3, cy + size * 0.15,
    cx + size * 0.3, cy + size * 0.15,
    cx, cy + size * 0.65,
    'F',
  );
  // Inner white dot
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy - size * 0.05, size * 0.16, 'F');
}

function loadImageAsDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default AdminDashboard;
