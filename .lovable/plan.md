## Part 1 — `/source/:name` mirrors `/head-hunting`

### `src/pages/Source.tsx`
Mirror `HeadHunting.tsx`: on mount, in addition to `setSourcing(true)` + `setSourceName(name)`, also call `setHeadhunting(true)`. On unmount, clear all three. This activates every existing `isHeadhunting()`-gated UI branch (currently the Referral Link field on `PersonalInfoStep`, and any future ones) for sourcing sessions without duplicating logic.

### `src/lib/apiClient.ts` (payload injection, lines ~38–49)
- Keep `headhunting: true` for the head-hunting branch.
- For sourcing, rename injected keys from `sourcing` → `source`:
  ```
  source: true
  source_name: "<name from URL>"
  ```
- A `/source/:name` request will therefore carry `headhunting: true`, `source: true`, `source_name: "<name>"` together.

No other files change — `isHeadhunting()` is the only flag consumed by step components.

### Verification (Part 1)
- `/source/test-name?ref=abc` shows the Referral Link field, prefilled with `abc`.
- Network payload contains `source: true`, `source_name: "test-name"`, `headhunting: true`.
- `/head-hunting` regression: only `headhunting: true`.
- `/` regression: none of the three keys.

---

## Part 2 — Admin Dashboard "Settings" tab

A new tab on `AdminDashboard` that opens a Settings view for editing the role-fit formulas described in the attached Values Assessment doc, plus an Assessment URL field with a usage counter.

### Value dimensions (from the doc)
Seven traits, each scored 0–100 (percentile):
`Aesthetic, Altruistic, Individualistic, Theoretical, Economic, Political, Regulatory`.

### Role formula model
Each role has, per trait, an **ideal percentile range** (min–max, 0–100) and a **weight** (0–3, mapping to the doc's `→ moderate / ↑ / ↑↑ / ↑↑↑` and inverse for `↓`). Fit score per trait = how well the applicant's percentile falls inside the range, multiplied by weight; role fit % = weighted average across traits. This replaces the current arrow-based authoring with explicit numeric ranges.

Seeded roles (from the doc): Web Developer, Bookkeeper, Video Editor, Software Backer, DevOps Backend Engineer. Admin can add/rename/delete roles.

### UI: Settings page
New left-nav tab on `AdminDashboard` labelled **Settings** (icon: `Settings` from lucide). Selecting it swaps the right pane to a settings view with two sections.

**Section A — Role Fit Formulas**
- Role list (sidebar inside settings) with "+ Add role" and per-row delete.
- Selected role shows a table with one row per trait. Each row has:
  - Trait name (read-only).
  - Two number inputs: **Min** and **Max** (0–100, Min ≤ Max). Example shown in placeholder: "60–90 for Aesthetic". No spinners/arrows — use plain numeric inputs (`type="number"` with `appearance-none` to hide arrows, also accept manual typing).
  - Weight selector: 0 (ignore), 1 (moderate), 2 (high), 3 (very high). Toggle "Inverse" for ↓ traits (low percentile is preferred — internally flips the range against 100).
- "Save changes" button persists via `PUT /admin/role-formulas` (new endpoint, see Technical).
- Inline validation: Min ≤ Max, both in 0–100; weight in 0–3.

**Section B — Assessment Link**
- Single text input **Assessment URL** with copy-to-clipboard button.
- Read-only metric card **Total uses** showing a whole number returned by the backend.
- "Save" button persists URL via `PUT /admin/assessment-link`.
- Metric is fetched from `GET /admin/assessment-link` which returns `{ url, uses }`.

### Technical

New file `src/components/admin/SettingsPanel.tsx` — renders Sections A & B, owns local edit state, calls the API client.

New file `src/data/valueDimensions.ts` — exports the 7 trait names and the doc-seeded defaults so the UI can hydrate before the first save.

`src/pages/AdminDashboard.tsx` — add a `tab: 'applicants' | 'settings'` state, render the existing applicants pane when `applicants`, the new `<SettingsPanel />` when `settings`. Add a `Settings` button to the existing left rail.

`src/lib/apiClient.ts` — add four functions wired through the existing `request<T>()` helper:
- `getRoleFormulas(): Promise<RoleFormula[]>` → `GET /admin/role-formulas`
- `saveRoleFormulas(payload): Promise<void>` → `PUT /admin/role-formulas`
- `getAssessmentLink(): Promise<{ url: string; uses: number }>` → `GET /admin/assessment-link`
- `saveAssessmentLink(url): Promise<void>` → `PUT /admin/assessment-link`

`src/types/admin.ts` (new) — `RoleFormula = { id, name, traits: Record<TraitName, { min: number; max: number; weight: 0|1|2|3; inverse: boolean }> }`.

Number inputs styled with the existing `form-input` class plus a small CSS rule to hide native spinner arrows (per the "instead of arrows" requirement).

### Out of scope
- No changes to the assessment computation pipeline itself — this only edits the **formulas** that downstream consumers will read. The backend owns recomputing fit scores from the saved formulas.
- No auth changes; the new endpoints assume the same admin context as today's dashboard calls.
- No design system changes beyond reusing existing tokens / Tailwind classes.

### Verification (Part 2)
- Open `/admin`, click **Settings**: panel renders with the 5 seeded roles and 7 trait rows each.
- Edit Aesthetic on "Web Developer" to Min 60 / Max 90, weight 2 → Save → reload → values persist (mocked locally if backend unavailable, real persistence once endpoints exist).
- Assessment URL section shows the saved URL and the `uses` counter as a whole number; editing + saving round-trips.
- Existing applicants tab and all flows unchanged.
