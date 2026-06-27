## Goal
Redesign `src/components/steps/CompletionStep.tsx` to match the uploaded reference, and add a "Got it, thanks!" button that returns the applicant to the home URL matching their entry route.

## Changes

### 1. `src/components/steps/CompletionStep.tsx` (rewrite)
- Header: blue curved/arched top band (rounded bottom corners) with centered Cyberbacker logo.
- Animated green check badge (soft green circle, decorative dots scattered around).
- Heading: "Thank you for building your profile with Cyberbacker!" (bold, primary blue, centered).
- Subheading: "Your profile has been submitted successfully. Here's what happens next:"
- Vertical timeline (dots + dashed connector on the left) with 4 cards, each card = soft icon tile + blue title + body copy:
  1. **Review in Progress** (clipboard-search icon) — existing 24–48 business hours copy.
  2. **Email Notification** (mail icon) — existing email outcome copy.
  3. **Interview (If Qualified)** (user-check/star icon) — existing interview copy.
  4. **Stay Updated** (bell icon) — existing inbox/spam copy.
- Primary full-width "Got it, thanks!" button with paper-plane (Send) icon.
- Footer line with heart icon: "We appreciate your trust in **Cyberbacker**."
- Use `lucide-react` icons (`ClipboardCheck`/`ClipboardList`, `Mail`, `UserCheck`, `Bell`, `Send`, `Heart`) and semantic tokens only (`bg-primary`, `text-primary`, `bg-primary/10`, `text-foreground`, etc.) — no hardcoded hex/white/black.

### 2. Route-aware "Got it" handler
Determine origin route from the acquisition flags in `src/lib/headhunting.ts` (already imported elsewhere):
- `isSourcing()` + `getSourceName()` → `/source/<name>`
- `isHeadhunting()` (and not sourcing) → `/head-hunting`
- `isDavaohub()` → `/davao-hub`
- else → `/`

Implementation: inside CompletionStep, compute `homeHref` once on mount (before flags get reset by route unmount). On click, do `window.location.assign(homeHref)` — full reload guarantees the target page's `useEffect` re-sets its acquisition flag cleanly and clears the just-submitted wizard state.

### 3. No other files touched
Layout (`bg-muted` outer wrapper + `Footer`) and the existing `CompletionStep` mounting in `Index.tsx` stay intact.

## Verify
- Visit `/`, `/head-hunting`, `/davao-hub`, `/source/test-name`, complete (or jump to) completion step, confirm visual matches reference and button returns to the matching URL.
- `tsgo --noEmit` passes.
