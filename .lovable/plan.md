## Goal

Replace the current TanStack Start setup with a standard Vite + React + React Router project that mirrors the original `Application-Site-V3-FE.rar` structure, while upgrading packages to current latest stable versions. All existing pages/components/wizard logic (NDA modal, ComplianceStep, ProfessionalBgStep with industry-role matrix, source/:name route, etc.) continue to work identically.

## Scope

### Remove TanStack Start scaffolding

- Delete: `src/router.tsx`, `src/start.ts`, `src/routes/` (entire dir incl. `__root.tsx`, `routeTree.gen.ts`, per-route files), `.tanstack/`, any `*.functions.ts` server-fn modules, `src/integrations/supabase/auth-middleware.ts` / `auth-attacher.ts` / `client.server.ts` if present.
- Strip TanStack Start / Router / Start-Vite plugins from `package.json` and `vite.config.ts`.

### Restore standard Vite shell (matches RAR)

- `index.html` at project root with `<div id="root">` and `<script type="module" src="/src/main.tsx">`.
- `src/main.tsx` → `createRoot(...).render(<ErrorBoundary><App /></ErrorBoundary>)` with global error listeners (verbatim from RAR).
- `src/App.tsx` → `QueryClientProvider` + `TooltipProvider` + `Toaster`/`Sonner` + `BrowserRouter` with the exact route table from the RAR:
  - `/`, `/dashboard`, `/attendance` (Dashboard variant), `/admin`, `/assessment-result`, `/head-hunting`, `/davao-hub`, `/source/:name`, `/compliance-docs-u`, `*` → NotFound.
- `src/pages/` directory with the page files (rename/move current route components into pages preserving their current content — keeping the recent NDA/Compliance/ProfessionalBg fixes intact).
- Replace any `@tanstack/react-router` usage in components (`Link`, `useNavigate`, `useParams`, `createFileRoute`) with `react-router-dom` equivalents.

### vite.config.ts

Plain config matching RAR: `@vitejs/plugin-react-swc`, `lovable-tagger` in dev, `@` alias, port 8080, `dedupe` for react/query.

### Tailwind

use tha latest tailwind and adjust the the code accordingly so that it will not break

### Package updates (latest stable as of 2026-06)

- React 19.x + react-dom 19.x, @types/react 19.x
- Vite 7.x, @vitejs/plugin-react-swc latest
- TypeScript 5.9+
- react-router-dom 7.x
- @tanstack/react-query 5.x latest
- All @radix-ui/* to current latest
- lucide-react, zod 3.x latest, react-hook-form, date-fns 4.x, recharts 2.x, sonner, cmdk, vaul, embla, dnd-kit, jspdf, html2canvas, input-otp — all latest
- tailwindcss 3.4.x (stay on v3 to match RAR), @tailwindcss/typography, tailwindcss-animate, autoprefixer, postcss — latest 3.x-compatible
- eslint 9.x + typescript-eslint 8.x + react-hooks/react-refresh plugins — latest
- Dev: vitest 3.x, @testing-library/react latest, jsdom latest, lovable-tagger latest, @types/node 22.x

### Preservation checklist

- Keep all files under `src/components/`, `src/hooks/`, `src/lib/`, `src/data/` (incl. new `industryRoleMatrix.ts`), `src/types/`, `src/assets/` unchanged in behavior.
- Keep recent edits: NDA modal text, split NBI/Police vs COE compliance, industry-filtered roles, source/:name route.
- Keep shadcn UI primitives (button/input/select/textarea) with their cursor/focus/padding refinements; only adjust class-source if Tailwind utility names changed.

### Verification

- `bun install` clean.
- Dev server boots on :8080 and renders `/`, `/source/test?ref=abc`, `/admin`, `/dashboard`, `/compliance-docs-u` without console errors.
- Playwright smoke: open `/`, advance one wizard step, open NDA modal, confirm content; navigate to `/source/test-campaign?ref=xyz` and confirm sourcing initializes.

## Out of scope

- No feature changes. No design changes beyond porting current tokens.
- Lovable Cloud / Supabase backend wiring is not added (RAR has none).

## Risk note

The Lovable platform's default template is TanStack Start. Moving to plain Vite + React Router is fully supported at runtime but means features keyed off TanStack Start (server functions, file-based routing, SSR) are no longer available — matching the original RAR, which is a pure SPA.