# Northstar Health

A fictional healthcare provider web app, built as a front-end portfolio project. Patients can search for doctors, filter by specialty, location and language, read provider profiles, book an appointment through an accessible four-step flow, browse locations, and sign in to a demo patient portal.

> **Everything here is fictional.** Providers, locations, phone numbers (555-01xx) and insurance plans are invented. No real patient data is collected or stored.

## Tech stack

| Tool | Why |
| --- | --- |
| **Next.js 16 (App Router)** | File-based routing, Server Components, static pre-rendering and API routes in one framework. |
| **React 19** | Component model for the UI. |
| **TypeScript** | Types catch mistakes (like misspelled data fields) before the code runs. |
| **Tailwind CSS v4** | Utility classes driven by design tokens defined once in `globals.css`. |
| **lucide-react** | Consistent, accessible SVG icons. |

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint
```

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Homepage: hero search, specialties, how it works, featured providers, locations |
| `/providers` | Search with filters and sorting, stored in the URL (shareable, back button works) |
| `/providers/[id]` | Provider profile (16 pre-built static pages) |
| `/providers/[id]/book` | Four-step booking flow |
| `/appointments/confirmation` | Booking confirmation |
| `/locations`, `/locations/[id]` | Facilities with hours, services, providers and an illustrated map |
| `/portal`, `/portal/dashboard` | Demo patient portal (simulated sign-in) |
| `/design-system` | Living style guide that renders the real components |
| `/api/...` | JSON endpoints: providers, availability, appointments, locations |

## Project structure

```
src/
  app/            Routes. Each folder is a URL; page.tsx is the page, route.ts is an API endpoint
  components/
    ui/           Design-system components: Button, fields, Card, Badge, Alert, Skeleton...
    layout/       Header, footer, logo
    search/       Search filters and results
    booking/      Booking flow and confirmation
    portal/       Portal sign-in and dashboard
  data/           Fictional providers, locations, specialties
  lib/            Logic: search, availability, validation, formatting, browser storage
```

## Decision log

Short notes on *why* things are built this way. Useful in interviews.

1. **Server Components by default, Client Components only where needed.** Most pages are plain HTML generated at build time. Only interactive pieces (`"use client"`) ship JavaScript: the mobile menu, search filters, booking flow and portal.
2. **Search state lives in the URL.** `/providers?specialty=cardiology&telehealth=1` can be bookmarked and shared, works with the back button, and renders on the server. The filter form is a real `<form method="get">`, so it still works without JavaScript.
3. **Real loading states via Suspense and simulated latency.** The data is local, so `lib/latency.ts` adds a short delay to make loading skeletons actually appear. Search results use a keyed `<Suspense>` so each new search shows the skeleton.
4. **Mock API instead of a database.** `app/api/*` route handlers behave like a real backend: they validate input, return proper status codes (201, 400, 404, 409, 422) and never trust the browser. Availability is generated deterministically, so the server can verify that a requested slot was really offered.
5. **Validation shared by client and server** (`lib/validation.ts`). The browser gives instant feedback, and the server re-checks because requests can be tampered with.
6. **Accessibility target: WCAG 2.2 AA.** Visible labels, `aria-describedby` hints and errors, an error summary with links to fields, radio inputs styled as cards (so keyboard arrows work), focus moved to the heading on each booking step, skip link, a visible focus ring, ≥40px targets, color contrast checked against AA and `prefers-reduced-motion` respected.
7. **Custom components on native HTML instead of a UI kit.** This shows component design skills, and native elements are accessible without extra code.
8. **Design tokens in one place.** `globals.css` defines color, type, radius and shadow tokens. `/design-system` shows them live.
9. **No real authentication.** The portal is a clearly labeled simulation that uses localStorage. Real health-data auth needs a secure backend and HIPAA-grade safeguards, which are outside the scope of a front-end portfolio project.
10. **Static pre-rendering.** `generateStaticParams` builds all provider and location pages at deploy time, so they load instantly from a CDN.

## Possible next steps

- Deploy to Vercel and add the live URL here
- Component tests (Vitest + Testing Library) and a Playwright end-to-end test of the booking flow
- Automated accessibility checks (axe) in CI
- Dark mode using the existing token structure
