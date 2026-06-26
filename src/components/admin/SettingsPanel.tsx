import { useEffect, useMemo, useState } from 'react';
import { Copy, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  VALUE_DIMENSIONS,
  DEFAULT_ROLE_FORMULAS,
  type RoleFormula,
  type ValueDimension,
} from '@/data/valueDimensions';
import {
  getRoleFormulas,
  saveRoleFormulas,
  getAssessmentLink,
  saveAssessmentLink,
} from '@/lib/apiClient';

const LS_FORMULAS = 'admin.roleFormulas.v1';
const LS_ASSESSMENT = 'admin.assessmentUrl.v1';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
  `role-${Date.now()}`;

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

const SettingsPanel = () => {
  const [roles, setRoles] = useState<RoleFormula[]>(DEFAULT_ROLE_FORMULAS);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_ROLE_FORMULAS[0].id);
  const [savingRoles, setSavingRoles] = useState(false);
  const [assessmentUrl, setAssessmentUrl] = useState('');
  const [assessmentUses, setAssessmentUses] = useState<number>(0);
  const [savingUrl, setSavingUrl] = useState(false);

  // Hydrate role formulas: backend first, fall back to localStorage, then defaults.
  useEffect(() => {
    (async () => {
      try {
        const data = await getRoleFormulas();
        if (Array.isArray(data) && data.length) {
          setRoles(data);
          setSelectedId(data[0].id);
          return;
        }
      } catch { /* fall through */ }
      try {
        const raw = localStorage.getItem(LS_FORMULAS);
        if (raw) {
          const parsed = JSON.parse(raw) as RoleFormula[];
          if (Array.isArray(parsed) && parsed.length) {
            setRoles(parsed);
            setSelectedId(parsed[0].id);
          }
        }
      } catch { /* ignore */ }
    })();

    (async () => {
      try {
        const link = await getAssessmentLink();
        setAssessmentUrl(link.url ?? '');
        setAssessmentUses(Number(link.uses ?? 0));
        return;
      } catch { /* fall through */ }
      try {
        const raw = localStorage.getItem(LS_ASSESSMENT);
        if (raw) setAssessmentUrl(raw);
      } catch { /* ignore */ }
    })();
  }, []);

  const selected = useMemo(
    () => roles.find((r) => r.id === selectedId) ?? roles[0],
    [roles, selectedId],
  );

  const updateTrait = (
    dim: ValueDimension,
    patch: Partial<RoleFormula['traits'][ValueDimension]>,
  ) => {
    setRoles((rs) =>
      rs.map((r) =>
        r.id === selected.id
          ? { ...r, traits: { ...r.traits, [dim]: { ...r.traits[dim], ...patch } } }
          : r,
      ),
    );
  };

  const renameRole = (name: string) => {
    setRoles((rs) => rs.map((r) => (r.id === selected.id ? { ...r, name } : r)));
  };

  const addRole = () => {
    const name = 'New Role';
    const base: RoleFormula = {
      id: `${slugify(name)}-${Date.now().toString(36)}`,
      name,
      traits: Object.fromEntries(
        VALUE_DIMENSIONS.map((d) => [d, { min: 0, max: 100, weight: 0, inverse: false }]),
      ) as RoleFormula['traits'],
    };
    setRoles((rs) => [...rs, base]);
    setSelectedId(base.id);
  };

  const deleteRole = (id: string) => {
    setRoles((rs) => {
      const next = rs.filter((r) => r.id !== id);
      if (next.length === 0) return rs; // never empty
      if (id === selectedId) setSelectedId(next[0].id);
      return next;
    });
  };

  const validate = (): string | null => {
    for (const r of roles) {
      for (const d of VALUE_DIMENSIONS) {
        const t = r.traits[d];
        if (t.min < 0 || t.min > 100 || t.max < 0 || t.max > 100) {
          return `${r.name} · ${d}: range must be within 0–100`;
        }
        if (t.min > t.max) return `${r.name} · ${d}: Min must be ≤ Max`;
        if (![0, 1, 2, 3].includes(t.weight)) return `${r.name} · ${d}: weight 0–3`;
      }
    }
    return null;
  };

  const saveRoles = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setSavingRoles(true);
    try {
      try { await saveRoleFormulas(roles); } catch { /* backend optional */ }
      localStorage.setItem(LS_FORMULAS, JSON.stringify(roles));
      toast.success('Role formulas saved');
    } finally {
      setSavingRoles(false);
    }
  };

  const saveUrl = async () => {
    setSavingUrl(true);
    try {
      try { await saveAssessmentLink(assessmentUrl); } catch { /* backend optional */ }
      localStorage.setItem(LS_ASSESSMENT, assessmentUrl);
      toast.success('Assessment URL saved');
    } finally {
      setSavingUrl(false);
    }
  };

  const copyUrl = async () => {
    if (!assessmentUrl) return;
    try {
      await navigator.clipboard.writeText(assessmentUrl);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Section A: Role Fit Formulas */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-5">
        <header className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Role Fit Formulas</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Edit the ideal percentile range and weight per value dimension for each role.
            </p>
          </div>
          <button
            type="button"
            onClick={saveRoles}
            disabled={savingRoles}
            className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {savingRoles ? 'Saving...' : 'Save changes'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
          {/* Role list */}
          <div className="border border-border rounded-xl p-2 h-fit">
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className={`group flex items-center justify-between rounded-lg px-2 ${
                    r.id === selected?.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className="flex-1 text-left py-2 text-sm font-medium truncate"
                  >
                    {r.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRole(r.id)}
                    className={`p-1 rounded ${
                      r.id === selected?.id
                        ? 'text-primary-foreground/80 hover:text-primary-foreground'
                        : 'text-muted-foreground hover:text-destructive'
                    }`}
                    title="Delete role"
                    aria-label={`Delete ${r.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRole}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Plus className="w-4 h-4" /> Add role
            </button>
          </div>

          {/* Selected role editor */}
          {selected && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Role name
                </label>
                <input
                  type="text"
                  value={selected.name}
                  onChange={(e) => renameRole(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="py-2 pr-3">Trait</th>
                      <th className="py-2 pr-3 w-24">Min</th>
                      <th className="py-2 pr-3 w-24">Max</th>
                      <th className="py-2 pr-3 w-32">Weight</th>
                      <th className="py-2 pr-3 w-20">Inverse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VALUE_DIMENSIONS.map((d) => {
                      const t = selected.traits[d];
                      return (
                        <tr key={d} className="border-b border-border/60 last:border-0">
                          <td className="py-2 pr-3 font-medium text-foreground">{d}</td>
                          <td className="py-2 pr-3">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={t.min}
                              onChange={(e) =>
                                updateTrait(d, { min: clamp(Number(e.target.value || 0)) })
                              }
                              className="form-input no-spinner py-1.5 text-sm"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 pr-3">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={t.max}
                              onChange={(e) =>
                                updateTrait(d, { max: clamp(Number(e.target.value || 0)) })
                              }
                              className="form-input no-spinner py-1.5 text-sm"
                              placeholder="100"
                            />
                          </td>
                          <td className="py-2 pr-3">
                            <select
                              value={t.weight}
                              onChange={(e) =>
                                updateTrait(d, {
                                  weight: Number(e.target.value) as 0 | 1 | 2 | 3,
                                })
                              }
                              className="form-input py-1.5 text-sm"
                            >
                              <option value={0}>0 — Ignore</option>
                              <option value={1}>1 — Moderate</option>
                              <option value={2}>2 — High</option>
                              <option value={3}>3 — Very high</option>
                            </select>
                          </td>
                          <td className="py-2 pr-3">
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={t.inverse}
                                onChange={(e) => updateTrait(d, { inverse: e.target.checked })}
                              />
                              <span className="text-muted-foreground">↓</span>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: set Aesthetic to <span className="font-medium">Min 60 / Max 90</span>{' '}
                  to require a percentile range of 60–90 for that role.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section B: Assessment Link */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-5">
        <header className="mb-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Assessment Link</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The URL applicants visit to take the values assessment.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Assessment URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={assessmentUrl}
                onChange={(e) => setAssessmentUrl(e.target.value)}
                placeholder="https://example.com/assessment"
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={copyUrl}
                disabled={!assessmentUrl}
                className="btn-outline text-sm px-3 inline-flex items-center gap-2 disabled:opacity-50"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button
                type="button"
                onClick={saveUrl}
                disabled={savingUrl}
                className="btn-primary text-sm px-4 inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {savingUrl ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 bg-muted/40">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total uses</p>
            <p className="font-heading text-3xl font-bold text-foreground mt-1">
              {Number.isFinite(assessmentUses) ? Math.trunc(assessmentUses) : 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPanel;
