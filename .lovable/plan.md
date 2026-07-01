
# Implementation Plan

## 1. IMX Assessment Migration

### A. New API client section — `src/lib/apiClient.ts`

Add a new block for the IMX proxy under a new prefix `/api/v1/values_assessment`:

```ts
generateAssessmentCode(contactId, email)   → POST /generate_codes    → { code, assessment_url, completed }
launchValuesAssessment(code)               → POST /launch_values     → { assessment_url }
launchDiscAssessment(code)                 → POST /launch_disc       (stub, for future)
launchAiAssessment(code)                   → POST /launch_ai
launchAdvancedInsights(code)               → POST /launch_advanced_insights
getValuesResults(code)                     → GET  /values/results/{code}   → { completed, scores, ... }
getValuesReport(code)                      → GET  /values/report/{code}    (PDF)
```

`generate_codes` is treated as idempotent — the backend returns the existing code if the user already has one. The frontend never generates duplicates.

Assessment code is persisted per user in `localStorage` under `cb_values_assessment_code_<contactId>` as a cache; on load we still call the backend to confirm and pull `assessment_url` + completion state.

Keep `submitValuesAssessment`, `getAssessmentResult`, `getRoleFormulas`, `getAssessmentLink` for backwards compatibility so admin pages and legacy result page keep working.

### B. New embedded component — `src/components/steps/ValuesAssessmentStep.tsx`

Replace the current drag-and-drop UI. Preserve the outer card, title, and intro copy so the wizard/dashboard layout, spacing, and responsiveness are unchanged.

Props:
```ts
{ contactId: string; email: string; onCompleted: () => void; }
```

State machine:
- `loading` → fetch/generate code and `assessment_url`
- `in_progress` → render `<iframe src={assessment_url} className="w-full h-[70vh] min-h-[520px] rounded-lg border border-border" title="Values Assessment" allow="fullscreen" />`
- `completed` → hide iframe, show a completed state card with link to results/PDF report

Timer / Continue behavior:
- Continue button is hidden during the first 5 minutes after the iframe mounts (uses a `Date.now()` start timestamp stored in `localStorage` per code so refresh preserves it).
- After 5 min, replace with `Check Assessment Status` button.
- Clicking calls `getValuesResults(code)`:
  - completed → hide iframe, mark step complete, enable the wizard's normal Continue button via `onCompleted()`.
  - not completed → toast/inline message: "Your assessment is not yet complete…", disable button and start a 30 s countdown labeled `Check Again (30s)`.
- No polling. No auto-generation of a new code.

### C. Wiring changes

- `src/pages/Index.tsx` (wizard): remove `buildInitialAssessment`/`computeScores`/`submitValuesAssessment` for the values step; render new `ValuesAssessmentStep` with `contactId`/`email` and gate the wizard's `Next` on `onCompleted`.
- `src/pages/Dashboard.tsx`: same swap inside the assessment dialog. The dialog card and confirm modal stay; only inner content changes.
- Keep `src/pages/AssessmentResult.tsx` as-is for now (it reads from the legacy endpoint and is opened from admin — out of scope of this refactor).

### D. Resume & refresh behavior

On mount `ValuesAssessmentStep` runs: `generateAssessmentCode(contactId, email)`. Because the backend returns the existing code + current completion state, refresh cannot create a duplicate and progress is preserved.

## 2. Compliance Step — `src/components/steps/ComplianceStep.tsx`

- Hide the "Are you able to submit your NBI/Police Clearance at this time?" question card once the user picks Yes/No (already tracked by `canSubmitNbiPolice`). Same for `canSubmitCoe` — collapse the gate after selection, show a small "Change answer" text link to reopen.
- Inside the NBI section, add the reminder line:  
  *"Please ensure that the document submitted is clear, authentic, valid, and verifiable through the official [NBI Clearance](https://verification.nbi-clearance.io/) verification portal prior to uploading."*  
  Below it add a `See example of document` button that opens a modal showing `nbi-sample.png`.
- Inside the Police Clearance section, add the equivalent line pointing to `https://pnpclearance.ph/` and a `See example of document` button opening a modal showing `police-sample.png`.
- Remove the duplicated portal paragraphs from the top "We Prioritize the Prepared" info card so they only appear inline in each section.

### Sample images
Copy the two uploaded photos into `src/assets/`:
- `src/assets/nbi-sample.png` ← `user-uploads://NBI.png`
- `src/assets/police-sample.png` ← `user-uploads://Police.png`

Add a small `SampleDocumentModal` (reusing shadcn `Dialog`) that takes `{ open, onOpenChange, src, title }`.

## 3. Work Setup Step — `src/components/steps/WorkSetupStep.tsx`

- Remove the `network` tab and the `TABS` array; render Device Specification content directly (no tab bar).
- Remove the `tryAdvance` tab-switch logic from the imperative handle — `tryAdvance` simply returns `true`. Keep the exported handle so `Index.tsx` doesn't need changes.
- Move the four internet fields (Primary Internet Provider*, Primary ISP Speedtest*, Secondary Internet Provider, Secondary ISP Speedtest) into the single Device Specification view, appended after the existing device fields, wrapped in the same styling.
- Update the "Required Items" list copy to:
  - Primary Internet Provider (*)
  - Primary ISP Speedtest shareable link (*)
  - Secondary/Back up Internet Provider
  - Secondary/Back up ISP Speedtest shareable link

Field names (`primaryISP`, `secondaryISP`, `primaryISPSpeedtest`, `secondaryISPSpeedtest`) stay the same so the API payload / backend contract is unchanged.

## 4. Azure SPA Refresh Fix

Add both configs so it works regardless of which Azure hosting is used:

- **`public/staticwebapp.config.json`** (Azure Static Web Apps):
  ```json
  {
    "navigationFallback": {
      "rewrite": "/index.html",
      "exclude": ["/assets/*", "/*.{js,css,png,jpg,jpeg,svg,ico,webp,woff,woff2,map,json,txt}"]
    },
    "mimeTypes": { ".json": "application/json" }
  }
  ```
- **`public/web.config`** (Azure App Service / IIS): URL Rewrite rule sending all non-file, non-directory requests to `/index.html`.

Both files are shipped from `public/` so Vite copies them to `dist/` on build.

## 5. Verification

- `tsgo --noEmit`
- Playwright: load wizard, open Values step, confirm iframe renders, Continue is hidden < 5 min, becomes "Check Assessment Status" after (test with a shortened threshold via env in dev only if needed — production stays 5 min).
- Visual check of compliance modals and simplified Work Setup step.

## Files touched

- `src/lib/apiClient.ts` (add IMX section)
- `src/components/steps/ValuesAssessmentStep.tsx` (rewritten)
- `src/components/steps/ComplianceStep.tsx`
- `src/components/steps/WorkSetupStep.tsx`
- `src/pages/Index.tsx`, `src/pages/Dashboard.tsx` (wiring)
- New: `src/components/common/SampleDocumentModal.tsx`
- New assets: `src/assets/nbi-sample.png`, `src/assets/police-sample.png`
- New: `public/staticwebapp.config.json`, `public/web.config`
