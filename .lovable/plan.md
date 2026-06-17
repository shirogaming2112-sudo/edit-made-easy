## Goal
Tighten the visual quality of inputs and buttons across the app so they feel cohesive with the Cyberbacker brand blue (`--primary: 207 100% 26%`), behave correctly (hand cursor on interactive controls), and use professional spacing.

## Scope
Global, low-risk changes to the design system primitives. Pages that use `Button` / `Input` / `Textarea` / `Select` automatically inherit the polish — no page-by-page rewrites.

## Changes

### 1. `src/components/ui/button.tsx`
- Add `cursor-pointer` to base class so every button shows the hand icon on hover (disabled keeps default via `disabled:pointer-events-none`).
- Slight shape/elevation polish: `rounded-lg`, subtle `shadow-sm` on solid variants, `hover:shadow-md`, `active:scale-[0.98]`, smoother `transition-all`.
- Variant tweaks:
  - `default`: solid primary blue, hover deepens to `primary/90`.
  - `outline`: 1.5px border in `--primary/30`, hover fills with `primary/5`, text stays `primary`.
  - `secondary`: light blue tint (`secondary`) with `primary` text.
  - `ghost` / `link`: keep, add `cursor-pointer`.
- Sizes: bump default to `h-10 px-5`, `lg` to `h-12 px-8 text-base`, `sm` to `h-9 px-4`.

### 2. `src/components/ui/input.tsx`
- Border defaults to `border-input` token but we'll switch input border to a soft slate (`border-slate-300`-equivalent via tokens) and `hover:border-primary/40`.
- Focus state: replace harsh `ring-2 ring-ring ring-offset-2` with `focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0` for a calmer, more professional glow.
- `h-11`, `px-3.5`, `rounded-lg`, `text-sm`, `transition-colors`, `shadow-sm`.

### 3. `src/components/ui/textarea.tsx` and `src/components/ui/select.tsx`
- Mirror the Input treatment (border, focus ring, radius, padding, shadow) so all form controls match.
- Select trigger gets `cursor-pointer`.

### 4. `src/styles.css`
- Add a global rule so native interactive elements always show pointer:
  ```css
  @layer base {
    button:not(:disabled), [role="button"]:not([aria-disabled="true"]), a, label[for], summary, select { cursor: pointer; }
  }
  ```
- Tweak `--input` token to a subtle slate (`214 32% 91%`) so default field borders read as soft gray instead of white-on-white.
- Optional: refine `--ring` opacity expectation by keeping the variable but relying on `/20` modifier in components.

## Verification
- Drive Playwright on `/`, `/dashboard`, `/source/test`, `/compliance-docs-u` to screenshot a button row, a form field row, and a focused field — confirm cursor + visual polish render correctly.
- Confirm no console errors.

## Out of scope
- No layout/page redesigns, no copy edits, no functional changes to the wizard or routes.
