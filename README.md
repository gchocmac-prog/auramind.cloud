# Auramind Website

Marketing site for Auramind — AI infrastructure delivery and regional resource integration across Southeast Asia.

Built with **Next.js (App Router)**, **React**, and **Tailwind CSS**.

---

## Requirements

- Node.js 20+ recommended
- npm 10+

---

## Setup

Install dependencies from the lockfile:

```bash
npm ci
```

---

## Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Quality checks

```bash
npm run lint
```

```bash
npm run build
```

Production preview after a successful build:

```bash
npm run start
```

---

## Deploy on Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. Framework preset: **Next.js** (default).
3. Build command: `npm run build`
4. Output: Next.js defaults (no extra config required for a standard deploy).
5. Add environment variables in the Vercel project settings as needed (see form integration below).

Connect a custom domain in the Vercel project **Domains** settings when ready.

---

## Form integration (required before production launch)

> **Important:** Form delivery is **not** connected by default. The enquiry UI is present, but submission is disabled and shows **“Form integration pending”** until a real endpoint is configured. Do not launch production until form delivery is wired.

### Location

All form catalogues, the payload contract, and submission live in:

- [`lib/projectInquiry.ts`](lib/projectInquiry.ts)

The form UI lives in:

- [`components/ProjectInquiryForm.tsx`](components/ProjectInquiryForm.tsx)

### Connect an endpoint

Set an environment variable (local `.env.local` and Vercel):

```bash
NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT=https://your-endpoint.example/api/inquiry
```

When this value is present, the submit button enables and `submitProjectInquiry` POSTs JSON to that URL.

Alternatively, replace the body of `submitProjectInquiry` in `lib/projectInquiry.ts` with a Google Sheets, email, or CRM client — **keep `ProjectInquiryPayload` field names stable**.

### `ProjectInquiryPayload` fields

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Required |
| `company` | `string` | Required |
| `email` | `string` | Required |
| `budgetRange` | `string` | Optional select value |
| `pathway` | `"ai-infrastructure" \| "regional-resource" \| "partnership-other"` | Required |
| `pathwayOptions` | `string[]` | Optional engagement chips |
| `partnershipDetail` | `string` | Optional (partnership path) |
| `projectBrief` | `string` | Required summary |
| `timeline` | `string` | Optional select value |
| `additionalRequirements` | `string` | Optional |
| `submittedAt` | `string` | ISO timestamp set on submit |

Option catalogues (`BUDGET_RANGES`, `TIMELINES`, `PATHWAYS`, etc.) are also exported from `lib/projectInquiry.ts` for easy content edits.

---

## Public assets

| Path | Purpose |
| --- | --- |
| `public/logo/` | Brand logos (black / white) |
| `public/images/` | Hero and marketing imagery |
| `public/globe/countries.geojson` | Regional globe country polygons |
| `public/*.svg` | Misc static SVGs |

---

## Regional Globe

- UI shell: [`components/sections/Regional.tsx`](components/sections/Regional.tsx)
- Lazy canvas gate: [`components/RegionalGlobeCanvas.tsx`](components/RegionalGlobeCanvas.tsx) — loads only when the Regional section approaches the viewport
- Globe implementation: [`components/RegionalGlobe.tsx`](components/RegionalGlobe.tsx)
- Geo data: [`public/globe/countries.geojson`](public/globe/countries.geojson)

The globe and geojson are **not** loaded during initial page hydration.

---

## Project structure (high level)

```
app/                  # Next.js App Router (layout, page, globals.css)
components/           # UI sections, header/footer, form, globe
lib/projectInquiry.ts # Form contract + submission
public/               # Static assets
```

Primary page composition: [`app/page.tsx`](app/page.tsx).

---

## Pre-launch checklist

- [ ] Connect form delivery (`NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT` or custom `submitProjectInquiry`)
- [ ] Confirm enquiry submissions arrive in Sheets / email / CRM
- [ ] `npm run lint` and `npm run build` pass
- [ ] Deploy to Vercel and verify `#services`, `#how-we-work`, `#about`, `#project-inquiry` anchors under the fixed header
- [ ] Spot-check Regional globe deferred load on a throttled network
