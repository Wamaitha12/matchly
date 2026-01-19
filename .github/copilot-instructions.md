# Copilot / AI agent instructions for this repository

This Next.js (App Router) project uses TypeScript and Tailwind. The goal of this file is to give AI coding agents immediate, actionable knowledge about the structure, conventions, and common edit points in this repo.

1. Project overview
- Framework: Next.js (App Router) — see [next.config.ts](next.config.ts)
- Languages: TypeScript, React (server + client components in `app/`)
- Styling: Tailwind CSS + PostCSS; global styles live in [app/globals.css](app/globals.css)

2. How to run and build
- Dev server: `npm run dev` (runs `next dev`) — see `scripts` in [package.json](package.json)
- Build: `npm run build`; Start production: `npm run start`
- Lint: `npm run lint` runs `eslint` (no custom config file present besides `eslint.config.mjs`)

3. Architecture & routing patterns (what to know)
- Uses the App Router: route segments are folder-based under `app/`. Example routes:
  - Brand dashboard: [app/brand/dashboard/page.tsx](app/brand/dashboard/page.tsx)
  - Creator onboarding: [app/creator/onboarding/page.tsx](app/creator/onboarding/page.tsx)
  - Creator profile: [app/creator/profile/[id]/page.tsx](app/creator/profile/[id]/page.tsx)
- `app/layout.tsx` is the root layout and exports `metadata`. Edit `metadata` and global header here.
- Pages are React Server Components by default; use `'use client'` at top of a file to make it a Client Component.

4. Project conventions and patterns
- Keep global styles in [app/globals.css](app/globals.css). Tailwind classes are used extensively in `app/` components.
- TypeScript path alias: `@/*` is mapped to repo root in [tsconfig.json](tsconfig.json). Prefer this alias for cross-file imports.
- Small, self-contained route folders: each route uses a `page.tsx` (and optionally `layout.tsx`) to scope UI and metadata.
- Prefer semantic, accessible HTML (this project already uses headings and links in pages such as [app/page.tsx](app/page.tsx)).

5. Helpful file locations to change for common tasks
- Edit landing page copy & CTAs: [app/page.tsx](app/page.tsx)
- Modify header / site metadata: [app/layout.tsx](app/layout.tsx)
- Add global CSS / Tailwind changes: [app/globals.css](app/globals.css) and [postcss.config.mjs](postcss.config.mjs)
- Update build or dependency versions: [package.json](package.json) and [next.config.ts](next.config.ts)

6. External integrations and versions
- Next.js v16, React 19 (see `package.json`) — be mindful of new or experimental App Router APIs.
- Tailwind v4 + `@tailwindcss/postcss` is present; use Tailwind classes rather than inline styles.

7. Linting, testing, and CI notes
- Only `lint` script is present. No tests or CI config detected in repository root.
- There is no `.github/` folder — create workflow files under `.github/workflows/` if CI is needed.

8. Example small tasks and how to approach them
- Add a new route `/about`: create `app/about/page.tsx` exporting a default React component. Follow layout styles from [app/page.tsx](app/page.tsx).
- Make a component client-side interactive: create a component file with `'use client'` at the top and import it into the route `page.tsx`.
- Change global theme: update [app/globals.css](app/globals.css) and ensure Tailwind classes are consistent.

9. What not to change without confirmation
- Don't change major dependency versions (Next/React) without testing — the repo pins Next and React major versions.
- Avoid breaking changes to `tsconfig.json` path aliases unless updating all imports accordingly.

10. When you need more context
- Ask the human owner for the intended production host (Vercel, custom), any API keys, and whether new routes should be server or client.

If anything here is unclear or you'd like more examples (component templates, preferred commit messages, or a CI workflow), tell me which area to expand. 
