# Wizard, Dashboard & Attendance Polish

## 1. Personal Info — profile photo hint
`src/components/steps/PersonalInfoStep.tsx`
- Add a small helper line under the photo tile: "Click to upload your profile picture (JPG/PNG)."
- Keep existing camera icon / "Upload Photo" label inside the tile.

## 2. Retain wizard answers across navigation
The form store already keeps text values, but two step components hold local state that resets when the user leaves and returns:

- `WorkExperienceStep` — `hasExperience` boolean. Already re-derives from `data.length`. Leave as-is.
- `WorkSetupStep` — `tab` (device/isp) and `consent` reset on remount. Lift both into the parent `values.workSetup` object (add `activeTab` + `consent` on `WorkSetup` type). Hydrate from props, persist through `onChange`.
- `ComplianceStep` — `canSubmitNbiPolice` / `canSubmitCoe` / `sampleOpen` reset on remount. Persist `canSubmitNbiPolice` and `canSubmitCoe` in `ComplianceData` (as `'yes' | 'no' | ''`) so answers survive back/forward.

## 3. Retain uploaded files when navigating back
`src/components/wizard/FileDropzone.tsx`
- Accept optional `initialFiles?: File[]` prop and hydrate the internal `files` state from it on mount (build `UploadedFile` entries with fresh object URLs).
- Callers pass the previously-uploaded files:
  - `CertificationsStep` → cert.certificate (single)
  - `ComplianceStep` → validId, nbiClearance, policeClearance, proofOfSeparation
  - `WorkSetupStep` → deviceScreenshots, secondaryDeviceScreenshots
  - `PortfolioStep` → portfolioFiles
- Do not re-notify `onFilesSelected` during hydration to avoid state churn.

## 4. Certifications — Yes/No gate like Work Experience
`src/components/steps/CertificationsStep.tsx`
- Add a `hasCertifications` local state that defaults to `true` when `data.length > 0`, else `null`.
- When `null`, render the same "Do you have certifications you'd like to include?" branch UI used in `WorkExperienceStep`. "No" clears `data` and calls a new optional `onSkip?: () => void`.
- Wizard (`Index.tsx`) passes `onSkip` for step 8 that marks sidebar step 5 complete and jumps to substep 9 (Value Proposition).

## 5. Work Setup — sample device screenshot modal
`src/components/steps/WorkSetupStep.tsx`
- Add a "See example device screenshot" button next to the Primary Device screenshot dropzone (and Secondary), styled like the NBI/Police sample buttons.
- Reuse `SampleDocumentModal`, extended to accept an array of `{ src, caption }` (Windows + Mac side-by-side, or tabs).
- Upload the two provided reference images to Lovable Assets:
  - `user-uploads://windows.png` → `src/assets/device-sample-windows.png.asset.json`
  - `user-uploads://Mac.png` → `src/assets/device-sample-mac.png.asset.json`
- Modal shows both with captions "Windows — Settings ▸ System ▸ About" and "macOS — About This Mac".

## 6. Form-validation-gated Next / Save buttons
Add a lightweight `isStepValid(subStep, values)` helper in `src/lib/validation/wizardSchemas.ts` (or a new `stepValidation.ts`) implementing the rules below. Return `boolean`.

Required-field rules:
- **Personal Info (1)**: firstName, lastName, dateOfBirth, phoneNumber, languagesSpoken, country, nationality. If country === 'Philippines' → require houseStreet, city, barangay (no `address`). Otherwise require `address`.
- **Education (2)**: highestLevel, schoolName, schoolLocation, graduationDate. Require `degreeField` unless highestLevel === 'High School Graduate'.
- **Professional Background (3)**: preferredIndustry, preferredRole, schedule (Current Availability). (hoursPerDay defaults, still required.)
- **Value Proposition (9)**: non-empty `personalInfo.valueProposition`.
- **Work Setup (10)**: primaryDevice, at least one file in `deviceScreenshots`, primaryInternetProvider, primaryISPSpeedtest.
- **Compliance (11)**: `validId` file present.
- Other substeps (Work Experience, Tools, Skills, Portfolio, Certifications, Assessment): keep current behavior (always valid; existing gates apply).

Wiring:
- `src/pages/Index.tsx` — compute `const nextDisabled = !isStepValid(currentSubStep, values)` and pass to `WizardNavigation` via a new `disableNext?: boolean` prop. When disabled, hide the button entirely (per request "not visible"). Show a small inline hint "Fill required fields to continue" in its place.
- `src/components/wizard/WizardNavigation.tsx` — add `disableNext` prop; when true, render the hint span instead of the Next button (Previous stays).
- `src/pages/Dashboard.tsx` — in edit mode, compute the same validity for the active section and hide the "Save" button until valid (Cancel stays). Reuse the helper by mapping section → substep number.

## 7. Dashboard & Attendance Dashboard — show uploaded assets with preview
Data source: `getDashboard` already returns URLs for uploaded files in the compliance / work_setup / portfolio blocks (Azure-hosted). Extend the load in `Dashboard.tsx` to capture them into new state:
- `photoUrl` (from `d.personal_info.photo_url` / equivalent)
- `complianceUrls`: validId, nbiClearance, policeClearance, proofOfSeparation
- `workSetupUrls`: primary/secondary device screenshots
- `portfolioFiles`: switch from names-only to `{ name, url }[]`

UI:
- Profile header — if `photoUrl` present, render it inside the avatar tile (falls back to `photoPreview` from local upload, then `User` icon).
- Create a new `<FilePreviewLink name url />` component: renders the file name as a clickable chip that opens a modal (reuse the existing `FileDropzone` preview markup, extracted into `src/components/common/FilePreviewModal.tsx`) showing `<img>` for images or `<iframe>` for PDFs, with "Open in new tab" fallback.
- Update `WorkSetupView`, `ComplianceView`, and Portfolio view section to render `FilePreviewLink`s for every URL returned by the backend.
- Apply to both dashboard variants (`reapply` and `attendance`) since they share the component.

## 8. Hide assessment result download in wizard/dashboard
Already scoped to admin per prior turn — no change unless a stray "Download" button remains in `AssessmentStep`; audit and remove client-facing download buttons if any slipped through.

## 9. Attendance — rename "Client Pairing" to "Client Matching"
- `src/lib/apiClient.ts` — change `AttendanceAvailability` union member `'available for client pairing only'` → `'available for client matching only'` (and the composed `Logged In - …` string will follow automatically).
- `src/pages/Dashboard.tsx` — update the availability options array to match. Label displays via `capitalize` so "matching" surfaces naturally.
- Note: backend payload changes to `"Logged In - available for client matching only"`. Confirm the backend accepts the new string (or keep the wire value as `pairing` and only relabel the UI). Default plan: change both; call it out here so backend can be updated in lockstep.

## Technical Notes

- Type additions:
  - `WorkSetup`: `activeTab?: 'device' | 'isp'`, `consent?: boolean`.
  - `ComplianceData`: `canSubmitNbiPolice?: 'yes'|'no'|''`, `canSubmitCoe?: 'yes'|'no'|''`.
  - `Certification`: no change; use a wrapper state at the step level (`hasCertifications` derived from `data.length`).
  - Extend dashboard state with new URL fields; `getDashboard` result shape read via optional chaining (no strict typing changes needed).
- New files:
  - `src/lib/validation/stepValidation.ts` (helper)
  - `src/components/common/FilePreviewModal.tsx` (shared preview)
  - `src/assets/device-sample-windows.png.asset.json`, `src/assets/device-sample-mac.png.asset.json`
- No routing or backend schema changes beyond the attendance string decision above.

## Out of Scope
- Backend endpoints (only the attendance enum string mentioned).
- Assessment step logic (already handled).
- Any visual redesign beyond the small hint + sample modal additions.
