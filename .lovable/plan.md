## Scope

Four targeted changes — no other behavior touched.

### 1. NDA modal copy (`src/components/common/NdaModal.tsx`)
Replace the entire scrollable body with the verbatim text provided by the user, preserving the existing scroll/agree/continue flow (scroll-to-end gate → checkbox → Continue button). Sections to render:
- Header "NON-DISCLOSURE AGREEMENT / PRIOR INTERVIEW PROCESS"
- "WARNING: No Recording and Copying" paragraph
- "No Conflict of Interest/ Affiliation clause" paragraph
- "Authorization" block (six paragraphs)
- "NON-DISCLOSURE AGREEMENT FOR ASPIRING CYBERBACKERS" header
- Preamble (Cyberbacker Inc., represented by President **Shiela Mie Legaspi** — updated from current "CEO Craig Goodliffe")
- Numbered clauses 1–11 (new clause 4 "Data Privacy Notice, Consent, and Rights of the Applicant"; renumbered Specific Performance → 5, etc.; new clause 11 "Effective Date and Acceptance")
- Closing acknowledgement paragraph
- Final line: "I have read and agree to the terms of the Non-Disclosure Agreement"

Checkbox label stays the same. No structural/CSS changes.

### 2. Compliance step questions (`src/components/steps/ComplianceStep.tsx`)
Split the single Yes/No gate into two independent questions, each driving its own uploads.

- **Question A:** "Are you able to submit your NBI Clearance and Police Clearance at this time?" → Yes reveals the NBI block + Police block (with their date inputs). No shows the existing later-submission notice scoped to NBI/Police.
- **Question B:** "Are you able to submit your Certificate of Employment (COE) at this time?" → Yes reveals the Proof of Separation / COE dropzone block. No shows a later-submission notice scoped to COE.

State changes:
- Replace `canSubmitDocs` with `canSubmitNbiPolice` and `canSubmitCoe` (`'yes' | 'no' | ''`).
- Reminder list bullet wording unchanged.

### 3. Industry → Role filtering (`src/components/steps/ProfessionalBgStep.tsx` + new `src/data/industryRoleMatrix.ts`)
Add a typed matrix file derived from the uploaded Excel: `INDUSTRY_ROLE_MATRIX: Record<string, RoleName[]>` listing only roles whose cell is TRUE. Key observations from the sheet:
- Default row (used by every industry except Leasing and Real Estate): Cyberbacker, Marketing Backer, Appointment Setter, Web Developer, Social Media Backer, Bookkeeper, Video Editor, Concierge Backer, Software Backer, DevOps Backend Engineer, AI Service Delivery Specialist, Client Experience Apprentice.
- **Leasing** adds: Listing Backer, Property Management Backer, Transaction Backer.
- **Real Estate** adds: Listing Backer, Property Management Backer, Transaction Backer, Productivity Backer.
- `Growthbacker`, `Cyber Recruiter`, `Lead Backer`, `Facilitator Support - Cyberbacker University` are FALSE for every industry → not selectable from the wizard.

Matrix uses canonical role labels from `ROLE_OPTIONS`. The matrix's "Bookkeeper" maps to `"Bookkeeper Backer"` (the existing canonical label) so no rename of the role config is needed.

In `ProfessionalBgStep`:
- When `preferredIndustry` is empty → render the role chips section with a muted helper "Select a preferred industry to see matching roles" and no chips.
- When `preferredIndustry` is set → compute `availableRoles = INDUSTRY_ROLE_MATRIX[data.preferredIndustry] ?? []` and render chips only for those.
- On industry change, drop any selected roles that are no longer in `availableRoles` (`update` both fields in one `onChange`).
- The "View role descriptions" modal continues to use the full role catalog — no change to `RoleInfoModal`.

### 4. Verify `/source/:name` dynamic route is wired
The route already exists (`src/routes/source.$name.tsx` → `src/pages/Source.tsx`) and reads the `name` param via `useParams` and `?ref=` via `URLSearchParams`. After the other edits, run Playwright against `http://localhost:8080/source/test-campaign?ref=abc123` and confirm:
- Page renders the Index wizard (not NotFound).
- `setSourcing(true)` / `setSourceName('test-campaign')` are applied (verify via the referral-source UI on the form).

If the route resolves blank or 404s, add it to `src/routeTree.gen.ts` regeneration trigger by saving the route file (TanStack plugin regenerates automatically) and re-test. No code change expected unless the Playwright check fails.

## Out of scope
- No changes to styles, layout, other steps, or business logic.
- No changes to `roleDescriptions.ts` content; only filtering which chips render.
- No changes to validation schemas unless the compliance split surfaces a schema error at runtime (in which case update `wizardSchemas.ts` to mirror the two new gates).

## Verification
- Open NDA modal → scroll to bottom → checkbox appears → Continue enables. Spot-check new section headings render.
- Compliance step: toggle each Yes/No independently and confirm the right blocks show.
- Professional Background: pick Accounting → 12 chips; pick Real Estate → 16 chips including Listing/Property/Transaction/Productivity; switch industries with roles selected → invalid roles drop.
- `/source/demo?ref=xyz` loads the wizard with referral pre-filled.
