# Port Application-Site-V3-FE into this project

The uploaded archive is a Vite + React Router DOM + Tailwind v3 application (Cyberbacker careers/application wizard). This project is TanStack Start + Tailwind v4 + React 19. I'll port the source over and adapt the parts that aren't directly compatible, so everything builds and runs on this stack.

## What gets copied verbatim
- `src/components/` (ui, common, steps, wizard, plus Footer/Logo/NavLink/ErrorBoundary/ErrorFallback)
- `src/data/`, `src/hooks/`, `src/types/`, `src/lib/` (api, apiClient, azureUpload, countries, date, headhunting, philippines, utils, validation)
- `src/assets/` images and `public/img`, `public/favicon.ico`, `public/robots.txt`, `public/placeholder.svg`
- Page components from `src/pages/` — kept as components, re-mounted under TanStack routes

## What gets rewritten for the new stack

**Routing — react-router-dom → TanStack Router file routes** under `src/routes/`:
```
src/routes/index.tsx                  -> Index
src/routes/dashboard.tsx              -> Dashboard
src/routes/attendance.tsx             -> Dashboard variant="attendance"
src/routes/admin.tsx                  -> AdminDashboard
src/routes/assessment-result.tsx      -> AssessmentResult
src/routes/head-hunting.tsx           -> HeadHunting
src/routes/davao-hub.tsx              -> DavaoHub
src/routes/source.$name.tsx           -> Source (param: name)
src/routes/compliance-docs-u.tsx      -> ComplianceDocsUpload
```
- Replace `react-router-dom` imports inside ported components (`Link`, `useNavigate`, `useParams`, `useLocation`) with the `@tanstack/react-router` equivalents. `useParams` call sites get `Route.useParams()` or `useParams({ from: ... })` as appropriate.
- 404 already handled by `__root.tsx`'s `notFoundComponent` — drop the old `NotFound` route catch-all.
- Keep React Query — `QueryClientProvider` already lives in `__root.tsx`, so the old `App.tsx` wrapper is dropped.

**Styling — Tailwind v3 → v4**
- Move design tokens, fonts, keyframes, and component utilities from the old `src/index.css` + `tailwind.config.ts` into this project's `src/styles.css` using `@theme inline`, `@utility`, and `@custom-variant` (per v4 rules). HSL variables stay on `:root` and are mapped through `@theme inline` so shadcn `border-border`, `bg-primary`, etc. keep working.
- Load Inter + Poppins via `<link>` tags in `src/routes/__root.tsx` head (no remote `@import` in CSS).
- Body background `#BDCEEA` and heading font family preserved.

**Dependencies** — install the packages this app needs that aren't in this project yet:
`@azure/storage-blob`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@tanstack/react-form`, `html2canvas`, `jspdf`, `buffer`, plus any missing Radix primitives, `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `vaul`, `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `sonner`, `next-themes`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate` (or v4 equivalent). I'll diff against current `package.json` and only install what's missing.

**Things dropped (per your instructions)**
- `.env` / `.env.production` — not copied. The app reads `VITE_API_BASE_URL`; I'll either inline the published URL as the default in `src/lib/apiClient.ts` or leave it undefined with a clear `console.warn` if missing. (Default I'll use: the URL from the original `.env.production`, hard-coded as the fallback — let me know if you'd rather I leave it blank.)
- `App.tsx`, `main.tsx`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `azure-pipelines-*.yml`, `staticwebapp.config.json`, `bun.lock*`, `package-lock.json`, `postcss.config.js`, `scripts/`, `vitest.config.ts`, `src/App.css`, `src/main.tsx`, `src/test/` — this project already has its own equivalents.

## Verification
1. Wait for the harness build to complete; fix any TS / Vite / Tailwind errors it reports.
2. Drive Playwright against `http://localhost:8080` to load `/`, `/dashboard`, `/admin`, `/head-hunting`, `/davao-hub`, `/source/test`, `/compliance-docs-u`, `/assessment-result`, `/attendance`. Screenshot each, read console for runtime errors, and patch until clean.
3. Confirm fonts, primary color, sidebar gradient, and the wizard sidebar render correctly.

## Out of scope
- No functional edits to the wizard, no backend changes, no auth wiring. "Edit" pass is deferred — you said none for now.

## Risks / call-outs
- The original app talks to an external Azure backend (`VITE_API_BASE_URL`). Without setting that env var on this project, API calls will hit whatever fallback I hard-code (or fail). Confirm whether you want the production URL baked in as the default.
- Some `src/lib/api.ts` code may use Node-only or browser-only modules; if anything trips SSR (TanStack Start renders on the server by default), I'll guard those modules with client-only loading.
