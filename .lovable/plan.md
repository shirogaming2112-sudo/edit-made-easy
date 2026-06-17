## Goal

Polish the design-system primitives so disabled states, spacing, cursors, and focus rings all read as professional and accessible across the app.

## Changes

### 1. Disabled states (consistent across all controls)

- `src/components/ui/button.tsx`: extend disabled class to `disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-muted disabled:text-muted-foreground` (variant-aware: keep `bg-muted` only for solid variants; outline/ghost get `disabled:border-border disabled:text-muted-foreground`).
- `src/components/ui/input.tsx`, `textarea.tsx`, `select.tsx`: standardize disabled to `disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/50 disabled:text-muted-foreground disabled:hover:border-input` so hover treatment doesn't fight the disabled look.

### 2. Padding, spacing, border widths (uniform)

- Inputs / Textarea / SelectTrigger: settle on `h-11` (textarea `min-h-[112px]`), `px-3.5`, `py-2.5`, `rounded-lg`, **border-[1.5px]** for consistent visual weight against the blue brand.
- Button: settle on `rounded-lg`, `gap-2`, sizes `sm h-9 px-4`, `default h-10 px-5`, `lg h-12 px-8 text-base`, `icon h-10 w-10`. Outline gets `border-[1.5px]` to match form controls.
- Add `src/components/ui/label.tsx` tweak: `text-sm font-medium leading-none mb-1.5 inline-block` so form rows align consistently.
- `src/components/ui/form.tsx` FormItem: bump `space-y-2` → `space-y-2` kept, FormMessage given `mt-1.5` for breathing room (verify file first).

### 3. Pointer cursor everywhere

- Already added a global `@layer base` rule in `src/styles.css` for `button`, `[role="button"]`, `a[href]`, `label[for]`, `summary`, `select`. Extend to include `[role="combobox"]`, `[role="switch"]`, `[role="checkbox"]`, `[role="radio"]`, `[role="tab"]`, `[role="menuitem"]`, `[role="option"]`, and `summary` — covers Radix-based shadcn primitives (Select trigger, Switch, Checkbox, Tabs, etc.). 
- Keep `input:not([type="checkbox"]):not([type="radio"]):not([type="file"])` with default text cursor (no override needed; text inputs keep I-beam, which is correct UX). For file inputs add `cursor-pointer` on `::file-selector-button`.

### 4. Accessible focus styles

- Switch focus from `ring-2 ring-primary/20` (subtle) to a stronger keyboard-visible ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background` for buttons.
- For form controls (input/textarea/select), use a layered focus: `focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0` so the border darkens AND a soft halo appears — distinguishable from hover, visible against the light-blue page background.
- Mouse focus stays quiet (no ring on `:focus` without `-visible`), satisfying WCAG 2.4.7 without nagging mouse users.
- Add a project-wide focus reset in `src/styles.css`:
  ```css
  @layer base {
    :focus-visible { outline: none; }
  }
  ```
  so legacy elements rely on the ring utility instead of dual outlines.

5. Design  
  
could you follow the design in the rar file because textboxes are short and buttons that previousely has a blue color now its not just a white background

## Verification

- Drive Playwright on `/` and `/source/test`:
  - Screenshot a button row (default, outline, disabled).
  - Screenshot an input row (idle, hover, focus-visible via `page.keyboard.press('Tab')`, disabled).
  - Confirm hand cursor by checking computed `cursor` on a sample of elements (`button`, `[role=combobox]`, `a[href]`).
- Confirm no TS / console errors.

## Out of scope

- No copy or layout changes to pages.
- No new variants or component APIs.