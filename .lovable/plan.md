## Goal

Include `contact_id` in every IMX assessment payload/request sent from the wizard and dashboard, so the backend can associate every code, launch, and results lookup with the applicant.

Non-IMX endpoints (personal info, education, work setup, compliance, etc.) already send `contact_id` and are unchanged.

## 1. `src/lib/apiClient.ts` — thread contact_id through IMX helpers

Update signatures so callers must pass `contactId`, and include it in the JSON body / as a query param on GETs:

- `generateAssessmentCodes(prefix, count, contactId)` → POST body adds `contact_id: contactId`.
- `generateValuesCode(contactId)` → forwards to `generateAssessmentCodes('VI', 1, contactId)`.
- `generateDiscCode(contactId)` → forwards to `generateAssessmentCodes('DI', 1, contactId)`.
- `ImxLaunchParams` gains a required `contact_id: string`; `launchValuesAssessment`, `launchDiscAssessment`, `launchAiAssessment` include it in the POST body verbatim.
- `getValuesResults(code, contactId)` → GET `/values/results/{code}?contact_id={contactId}`.
- `getDiscResults(code, contactId)` → GET `/disc/results/{code}?contact_id={contactId}`.
- `getValuesReportUrl(code, contactId)` / `getDiscReportUrl(code, contactId)` → append `?contact_id=` (admin PDF links).

All helpers throw if `contactId` is empty so we never silently send a payload without it.

## 2. `src/components/steps/ValuesAssessmentStep.tsx` (AssessmentStep)

- Pass `contactId` into every helper call: `generateValuesCode`, `generateDiscCode`, `launchValuesAssessment`, `launchDiscAssessment`, `getValuesResults`, `getDiscResults` — both in the bootstrap `useEffect`, in `startDiscPhase`, and in `checkAndAdvance`.
- Guard: if `contactId` is missing, keep the existing "must be signed in" error path (no calls fired).

## 3. `src/pages/Index.tsx` and `src/pages/Dashboard.tsx`

- Already resolve `contactId` via `loadContactId()` / dashboard response. No new fetches — just confirm the `AssessmentStep` prop `contactId` is always non-empty before rendering that step (it already is).
- Admin download buttons in `AssessmentResult.tsx` (when wired) will pass `contactId` to `getValuesReportUrl` / `getDiscReportUrl`.

## 4. Out of scope

- No backend changes.
- No changes to non-IMX endpoints (they already send `contact_id`).
- No UI/visual changes.

## Files touched

- `src/lib/apiClient.ts`
- `src/components/steps/ValuesAssessmentStep.tsx`
- `src/pages/AssessmentResult.tsx` (only if it already calls the report helpers)

## Verification

- `tsgo --noEmit` clean — the new required arg forces every caller to be updated.
- Manual: open Network tab on wizard + dashboard Assessment step; confirm `/generate_codes`, `/launch_values`, `/launch_disc`, `/values/results/…`, `/disc/results/…` all carry `contact_id`.
