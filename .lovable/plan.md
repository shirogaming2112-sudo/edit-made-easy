# Role-Aware Suggested Tools

## Goal
In the Tools & Platforms step, replace the static suggested-tools list with a list driven by the up-to-3 roles selected on the Professional Background step, sourced from the uploaded `Role_Tools_Matrix.xlsx` (plus a few common additions).

## Changes

### 1. New data file `src/data/roleToolsMatrix.ts`
Export `ROLE_TOOLS: Record<RoleName, string[]>` seeded from the uploaded matrix. Each role gets its 15 tools from the sheet, plus 2–4 commonly-used additions where appropriate. Examples:

- Growthbacker: + ChatGPT, Gmail
- Cyberbacker: + ChatGPT, Canva, Asana
- Marketing Backer: + ChatGPT, Notion, Figma
- Appointment Setter: + Gmail, ChatGPT
- Cyber Recruiter: + Notion, Slack, ChatGPT
- Listing Backer: + Zillow Premier Agent, Notion
- Property Management Backer: + Notion, Zoom
- Web Developer: + VS Code extensions (Copilot), Vercel, Supabase, ChatGPT
- Social Media Backer: + Notion, Trello
- Transaction Backer: + DocuSign Rooms, Microsoft Teams
- Productivity Backer: + ChatGPT, Calendly
- Lead Backer: + Notion, ChatGPT, Calendly
- Bookkeeper (mapped from "Bookkeeper Backer"): + Hubdoc, Microsoft Teams
- Video Editor: + ChatGPT, Notion
- Concierge Backer: + ChatGPT, Asana
- Software Backer: + ChatGPT, npm
- DevOps Backend Engineer: + GitHub, AWS CLI
- AI Service Delivery Specialist: + ChatGPT, Hugging Face
- Client Experience Apprentice: + ChatGPT, Asana
- Facilitator Support – Cyberbacker University: + Padlet, ChatGPT

Also export a helper:
```ts
export function getSuggestedToolsForRoles(roles: string[]): string[]
```
that returns the **deduplicated union** of tools for the given role names, preserving stable order: walk roles in selection order, then tools in matrix order, skipping duplicates (case-insensitive).

### 2. `src/components/steps/ToolsStep.tsx`
- Accept new prop `selectedRoles: string[]` (comma-split from `professionalBackground.preferredRole`).
- Remove the hardcoded `SUGGESTED_TOOLS` constant; compute `suggestedTools = getSuggestedToolsForRoles(selectedRoles)`.
- Render the "Suggested tools" section only when `selectedRoles.length > 0`. When empty, show a small muted note: "Select your preferred roles on the Professional Background step to see suggested tools."
- Keep the existing "already added" filter and chip behavior unchanged.

### 3. Wizard wiring (the page that renders `<ToolsStep />`, likely `src/pages/Index.tsx` / `HeadHunting.tsx` / `Source.tsx` via a shared wizard)
Pass `selectedRoles={data.professionalBackground.preferredRole.split(',').map(s=>s.trim()).filter(Boolean)}` to `<ToolsStep />`. No other props change.

## Notes / Out of scope
- "Bookkeeper Backer" in the app maps to the matrix's "Bookkeeper" entry.
- No changes to backend payload, validation, or other steps.
- Manual tool entry remains available; the suggested list is just a faster shortcut.

## Verification
1. On `/` (or `/head-hunting`), pick e.g. industry → roles `Web Developer`, `Marketing Backer`, `Bookkeeper Backer`. Advance to Tools & Platforms. Suggested chips show the union of those three role lists (VS Code, GitHub, …, Canva, Mailchimp, …, QuickBooks Online, Xero, …) with no duplicates.
2. Deselect a role → return to Tools step → suggestions update accordingly.
3. With zero roles selected, the suggestions block shows the helper note instead of chips.
4. Adding a suggested chip still appends it to `selectedTools` with the chosen proficiency.
