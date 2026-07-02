## Fix IMX payloads to match FastAPI backend contract

The current frontend calls the IMX proxy with the wrong request bodies. Reading `values.py` + `imx_service.py` shows what the backend actually expects:

| Endpoint | Real payload | Response |
|---|---|---|
| `POST /generate_codes` | `{ prefix: "VI" \| "DI" \| "AI", count: number }` | Raw IMX response (list of generated codes; no user linkage). |
| `POST /launch_values` | `{ code, fname, lname, email, complete_url?, lang? }` | `{ assessment_url }` |
| `POST /launch_disc` / `/launch_ai` | same shape as launch_values (AI also accepts `ai_report`) | `{ assessment_url }` |
| `GET /values/results/{code}` | — | Raw IMX rawscores JSON (no `completed` flag). |
| `GET /values/report/{code}` | — | PDF stream. |

Our current calls send `{ contact_id, email }` to `generate_codes` and `{ code }` to `launch_values`, both of which the backend rejects. Backend also does not persist codes per user, so the frontend must cache the generated code itself.

### 1. `src/lib/apiClient.ts` — rewrite the IMX section

- `generateValuesCode()` → `POST /generate_codes` with `{ prefix: "VI", count: 1 }`. Return the first code from the response (handle both `[{code}]` and `{codes:[...]}` shapes defensively).
- `launchValuesAssessment(params)` → `POST /launch_values` with `{ code, fname, lname, email, complete_url?, lang? }`. Drop the old `code`-only signature.
- Same signature update for `launchDiscAssessment` and `launchAiAssessment` (kept for future use).
- `getValuesResults(code)` returns raw IMX JSON. Add a helper `isValuesResultCompleted(raw)` that treats a response with any non-empty scores/dimensions as complete (and network errors / empty payloads as not complete).
- Keep `getValuesReportUrl(code)` unchanged.
- Remove/deprecate the `ImxCodeResponse.assessment_url` / `completed` fields since backend doesn't return them.

### 2. `src/components/steps/ValuesAssessmentStep.tsx` — cache code + send full launch payload

- Accept new optional props `firstName` and `lastName` (fallback: split `email` local-part on `.`/`_`, else use `"Applicant"`/`"User"`).
- Per-user cache key: `cb_imx_values_code_<contactId>`.
- On mount:
  1. Read cached code from `localStorage`. If missing → call `generateValuesCode()`, store result.
  2. Call `launchValuesAssessment({ code, fname, lname, email })` to get `assessment_url`.
  3. Render iframe as today.
- On "Check Assessment Status": call `getValuesResults(code)` → use `isValuesResultCompleted()` to decide. Same 5-min / 30-s UX as today.
- Preserve the existing 5-minute start-time key `cb_imx_start_<code>`.
- No visual/UX changes.

### 3. Wire names through from callers

- `src/pages/Index.tsx`: pass `firstName={values.firstName}` and `lastName={values.lastName}` to `<ValuesAssessmentStep />`.
- `src/pages/Dashboard.tsx`: pass the applicant's first/last name from the loaded profile (fallback to empty strings; component handles fallback).

### 4. Out of scope

- No changes to `ComplianceStep`, `WorkSetupStep`, Azure configs, or backend code.
- Admin `/assessment-result` page continues to use legacy endpoints untouched.

### Files touched

- `src/lib/apiClient.ts`
- `src/components/steps/ValuesAssessmentStep.tsx`
- `src/pages/Index.tsx`
- `src/pages/Dashboard.tsx`

### Verification

- `tsgo --noEmit`
- Manual: open Values step → network tab shows `generate_codes` with `{prefix:"VI",count:1}` and `launch_values` with full payload; iframe loads; refresh reuses cached code (no second `generate_codes` call).
