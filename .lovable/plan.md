
## 1. Work Setup — bring back Device / ISP tabs

`src/components/steps/WorkSetupStep.tsx`

- Wrap existing fields into shadcn `Tabs` with two triggers: **Device Specification** and **ISP Setup**.
- Device tab: primary/secondary device, noise-cancelling headset, HD webcam, device screenshots, detected system specs.
- ISP tab: primary/secondary internet provider, primary/secondary ISP speedtest link.
- Expose an imperative `tryAdvance()` (via `useImperativeHandle` on a `forwardRef`) that the wizard already calls. Behavior:
  - If active tab is `device` → switch to `isp` and return `false` (Next stays on this step).
  - If active tab is `isp` → run existing validation and return `true` when it passes.
- No visual redesign beyond the tab strip. No business-logic changes to payload.

## 2. Rename step + build a single "Assessment" step

- `src/types/application.ts` / wherever step 9 title lives → rename **"Values Assessment"** to **"Assessment"** (keep the same step index so ordering doesn't shift).
- Rename `ValuesAssessmentStep.tsx` → `AssessmentStep.tsx` (component export `AssessmentStep`). Update the two importers (`Index.tsx`, `Dashboard.tsx`).

Internal state machine inside `AssessmentStep`:

```text
phase: 'loading' | 'error' | 'values' | 'disc' | 'completed'
```

- `values` phase:
  1. Read cached VI code from `localStorage[cb_imx_values_code_<contactId>]`; if missing → `generateValuesCode()` → cache it.
  2. `launchValuesAssessment({ code, fname, lname, email })` → iframe.
  3. Header: "Assessment — Step 1 of 2 · Values".
- `disc` phase (entered only after Values is confirmed complete):
  1. Read cached DI code from `localStorage[cb_imx_disc_code_<contactId>]`; if missing → `generateDiscCode()` → cache.
  2. `launchDiscAssessment({ code, fname, lname, email })` → iframe.
  3. Header: "Assessment — Step 2 of 2 · DISC".
- Cache per-user completion flags (`cb_imx_values_done_<contactId>`, `cb_imx_disc_done_<contactId>`) so refreshing skips finished sub-assessments.
- **No Download button** rendered in this component (wizard + dashboard). Completed state shows only a green "Assessment completed" confirmation.

## 3. Next button: check-then-advance with 30s countdown

The wizard/dashboard Next button becomes the single trigger for "did you finish?".

`src/components/wizard/WizardNavigation.tsx`

- Accept new optional props: `cooldownSeconds?: number`, `checkingLabel?: string`.
- When `isSubmitting || cooldownSeconds > 0` → button disabled, shows `Loader2` spinner + label `Try again in {N}s` (or `Checking…` while awaiting).

Wizard glue in `src/pages/Index.tsx`:

- On the Assessment step, override the wizard's `handleNext` (or the assessment step's `tryAdvance` ref):
  - If `phase === 'values'`: `getValuesResults(viCode)`; if `isValuesResultCompleted()` → set `phase='disc'`, cache done flag, return `false` (stay on step). Else → start 30s cooldown, return `false`.
  - If `phase === 'disc'`: `getDiscResults(diCode)`; if `isDiscResultCompleted()` → cache done, set `phase='completed'`, return `true` (wizard advances to Completion). Else → 30s cooldown.
- Same wiring in `src/pages/Dashboard.tsx` so the dashboard flow behaves identically.
- Countdown lives in the wizard shell state (or exposed by the AssessmentStep via ref). Loader icon is `Loader2` from `lucide-react` (already used).

## 4. API client additions

`src/lib/apiClient.ts`

- `generateDiscCode(): Promise<string>` → `generateAssessmentCodes('DI', 1)[0]`.
- `getDiscResults(code)` → GET `/api/v1/values_assessment/disc/results/{code}` (mirrors `getValuesResults`).
- `isDiscResultCompleted(raw)` → reuse the values heuristic; extract shared helper `isImxResultCompleted` internally.
- `getDiscReportUrl(code)` → `${IMX_PREFIX}/disc/report/{code}` (admin-only consumer).
- Keep `getValuesReportUrl` as-is.

## 5. Session storage of applicant identity

Goal: `fname`, `lname`, `email` are always populated when calling `launchValuesAssessment` / `launchDiscAssessment` — no email-local-part fallback needed in the happy path.

New helper in `src/lib/apiClient.ts` (or a small `src/lib/session.ts`):

```ts
const APPLICANT_KEY = 'cb_applicant_identity';
export function saveApplicantIdentity(x: { email: string; firstName: string; lastName: string }) { … }
export function loadApplicantIdentity(): { email: string; firstName: string; lastName: string } | null { … }
export function clearApplicantIdentity() { … }
```

Wire the save points:

- **Wizard (`src/pages/Index.tsx`)**: right after Personal Info substep succeeds (we already have `firstName`/`lastName`/`email` in form state), call `saveApplicantIdentity(...)`. Also refresh it whenever those fields change so late edits propagate.
- **Dashboard (`src/pages/Dashboard.tsx`)**: after `getDashboard(contactId)` resolves, call `saveApplicantIdentity({ email, firstName: personal_info.first_name, lastName: personal_info.last_name })`.
- **Signup/login (`Index.tsx` auth handlers)**: also save `email` immediately after successful auth so the assessment step never has to guess.

`AssessmentStep` reads identity in this order:
1. Props (`firstName`, `lastName`, `email`) from parent.
2. `loadApplicantIdentity()`.
3. Existing email-local-part derivation (last-resort fallback).

Both `launchValuesAssessment` and `launchDiscAssessment` calls use the resolved `{ fname, lname, email }`.

## 6. Refurbish Assessment Result page (admin)

`src/pages/AssessmentResult.tsx`

- Add two prominent download buttons in the header:
  - **Download Values PDF** → `getValuesReportUrl(viCode)` in a new tab.
  - **Download DISC PDF** → `getDiscReportUrl(diCode)` in a new tab.
- Codes come from the existing admin lookup response; if the DISC code isn't yet in that response, add a small TODO comment referencing where the backend field should surface (no backend changes in this pass).
- Leave the rest of the layout untouched. Add a placeholder section note: *"Custom scoring algorithm for Values will be wired in a follow-up."*
- Download buttons remain **admin-only** (this page is only reachable via the admin route).

## 7. Out of scope

- No backend changes.
- No changes to compliance, personal info, or other steps.
- No new custom Values scoring algorithm yet — just leave the placeholder.

## Files touched

- `src/components/steps/WorkSetupStep.tsx`
- `src/components/steps/ValuesAssessmentStep.tsx` → renamed to `AssessmentStep.tsx`
- `src/components/wizard/WizardNavigation.tsx`
- `src/lib/apiClient.ts` (DISC helpers + applicant-identity session helpers)
- `src/pages/Index.tsx` (wire identity save, gate Next on Assessment step)
- `src/pages/Dashboard.tsx` (wire identity save, gate Next on Assessment step)
- `src/pages/AssessmentResult.tsx` (two download buttons + placeholder)
- `src/types/application.ts` (rename step label)

## Verification

- `tsgo --noEmit`.
- Manual: WorkSetup Next stuck on Device tab, advances on ISP tab; Assessment step shows Values first, Next runs the completion check with visible 30s countdown + spinner, advances to DISC, then to Completion; no Download in wizard/dashboard; admin result page shows both download buttons; refreshing wizard/dashboard reuses cached VI/DI codes.
