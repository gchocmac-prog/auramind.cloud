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

## Deployment

The live site is **GitHub Pages**, not Vercel: [`CNAME`](CNAME) points at `auramind.cloud`, and [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml) builds `npm run build` and publishes `./out`. `next.config.ts` sets `output: "export"` with `trailingSlash: true`, which is required for directory-style routes (`out/privacy/index.html` → `/privacy`) to resolve on Pages.

Form delivery is a separate Cloudflare Worker at `api.auramind.cloud`; see the form-integration section above and [`worker/`](worker).

**Deploy order matters.** For the ITAD + privacy changes you must deploy the **Worker first**, then the front end — the new Worker accepts both the old and new pathway set, but the old Worker rejects the new pathways with `400`. Full steps and post-deploy acceptance checks are in [`DEPLOY.md`](DEPLOY.md).

Environment values are split by side:

| Side | Where configured |
| --- | --- |
| Front end | GitHub repository **variables** `NEXT_PUBLIC_PROJECT_INQUIRY_ENDPOINT`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (inlined at build time) |
| Worker | Cloudflare **secrets** `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`; non-secret values in [`worker/wrangler.jsonc`](worker/wrangler.jsonc) |

Connect or change the custom domain in the repository's GitHub Pages settings.

---

## Form integration (required before production launch)

> **Important:** Form delivery is **not** connected by default. The enquiry UI is present, but submission is disabled and shows **“Form integration pending”** until a real endpoint is configured. Do not launch production until form delivery is wired.

### Location

All form catalogues, the payload contract, and submission live in:

- [`lib/projectInquiry.ts`](lib/projectInquiry.ts)

The form UI lives in:

- [`components/ProjectInquiryForm.tsx`](components/ProjectInquiryForm.tsx)

### Connect an endpoint

Set an environment variable (local `.env.local`, and as a GitHub repository **variable** for the Pages build):

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
| `pathway` | `"ai-infrastructure" \| "regional-resource" \| "itad" \| "digital-website" \| "partnership-other"` | Required |
| `pathwayOptions` | `string[]` | Optional engagement chips |
| `partnershipDetail` | `string` | Required for the `partnership-other` path |
| `projectBrief` | `string` | Required summary |
| `timeline` | `string` | Optional select value |
| `additionalRequirements` | `string` | Optional |
| `submittedAt` | `string` | ISO timestamp set on submit |
| `consentGiven` | `boolean` | Required; visitor acknowledged the privacy notice |
| `consentVersion` | `string` | Privacy notice version shown at consent (`PRIVACY_NOTICE_VERSION`) |
| `consentAt` | `string` | ISO timestamp when consent was recorded |

Option catalogues (`BUDGET_RANGES`, `TIMELINES`, `PATHWAYS`, `PATHWAY_OPTIONS`, etc.) are also exported from `lib/projectInquiry.ts` for easy content edits.

> **Keep the Worker in sync.** `worker/src/index.ts` mirrors `PATHWAYS` and `PATHWAY_OPTIONS`, and enforces consent. Adding or renaming a pathway or option in `lib/projectInquiry.ts` **without** updating the Worker causes that submission to be rejected with `400 Invalid form data`.

---

## Privacy and consent (PDPA)

- Privacy notice route: [`app/privacy/page.tsx`](app/privacy/page.tsx) → exports to `/privacy`
- Consent is captured on the enquiry form and recorded in the payload (`consentGiven`, `consentVersion`, `consentAt`) and in the notification email.
- `PRIVACY_NOTICE_VERSION` in [`lib/projectInquiry.ts`](lib/projectInquiry.ts) must be bumped whenever the notice materially changes, so stored consents stay attributable.

---

## Adding a business pathway

Each pathway card in [`components/sections/Services.tsx`](components/sections/Services.tsx) is a data object, and its form choices come from `PATHWAY_OPTIONS`. The layout uses `.pathway-grid--quad` (2 × 2 on desktop) — four pathways is the current maximum that renders cleanly.

ITAD claims that still need evidence before publication are tracked in [`docs/ITAD-CLAIMS.md`](docs/ITAD-CLAIMS.md). **Do not add standard numbers, certifications, partner or facility names, or recovery figures to public copy before those items are confirmed.**

---

## Internal files not published

These live in the repo for reference but are **not** part of the deployed site (the Pages workflow uploads `./out` only):

| Path | Purpose |
| --- | --- |
| `LEAK-AUDIT.md` | Internal information-leak forensics audit — contains sensitive file inventories; do not publish |
| `DEPLOY.md` | Deployment order and post-deploy acceptance checks for the ITAD + privacy changes |
| `docs/ITAD-CLAIMS.md` | ITAD claim verification register |
| `tools/verify-deploy.mjs` | Post-deploy verifier: checks the live site + Worker against what `DEPLOY.md` promises (read-only; never submits an enquiry) |

### Verify a deployment

```bash
node tools/verify-deploy.mjs                                 # against production
node tools/verify-deploy.mjs --site http://localhost:3000    # against a local build preview
```

Exit codes: `0` all checks passed, `1` one or more failed, `2` usage/network error. It issues only GET/OPTIONS requests and reports one line per check with a reason on failure. The CORS check shows `[SKIP]` when the target is not a production origin, because the deployed Worker only allow-lists `auramind.cloud`.

### Secret scanning

Two scanners cover the same 18 patterns. Both print MASKED excerpts only — never a usable secret value.

**In-repo, cross-platform (CI-capable):** [`tools/secret-scan.mjs`](tools/secret-scan.mjs)

```bash
node tools/secret-scan.mjs --root .            # working tree
node tools/secret-scan.mjs --root . --history  # include full git history
```

**Out-of-repo, PowerShell (adds `-IncludeExcerpt` / `-ExportJson`):** `Invoke-SecretScan.ps1`

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\cheey\Documents\Deepseek-Harness\Auramind\tools\Invoke-SecretScan.ps1" -Path "<repo>" -IncludeExcerpt
```

Exit codes for both: `0` no findings, `1` findings present, `2` usage/pattern-loading error. Neither will report a clean result if its pattern list fails to load.

Run the PowerShell tool with `-ExecutionPolicy Bypass`: dot-sourcing a patterns file under a restrictive policy silently yields an empty pattern list.

> **Note for editors:** do not paste literal PEM/private-key headers or real credential strings into any tracked file — including this repo's audit documents. The scanners flag them, which fails the CI gate. Describe such evidence instead of quoting it.

**CI gate:** [`.github/workflows/secret-scan.yml`](.github/workflows/secret-scan.yml) runs the Node scanner. It is currently **manual-dispatch only** — automatic `push` / `pull_request` triggers are commented out so it cannot block anything until enabled deliberately.

### PII scanning

Separate tool, separate concern: `Invoke-PiiScan.ps1` scans for personal data in a Malaysian context (MyKad/IC formats, Malaysian mobile and landline numbers, emails, passport numbers, labelled dates of birth and postal addresses, long digit runs as bank-account candidates).

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\cheey\Documents\Deepseek-Harness\Auramind\tools\Invoke-PiiScan.ps1" -Path "<dir>" -ExportJson "pii.json"
```

It is read-only, reports **partially masked** values only, and groups output by type and file so a large result stays triageable.

**Known limitations — do not over-read a clean result:**

- It does **not** detect names. Name detection needs a roster; heuristic approaches flag ordinary words.
- The bank-account pattern (`\d{10,16}`) also matches hashes, timestamps and checksums; treat those hits as candidates only.
- It does **not** read text inside images.

A clean PII scan therefore does not mean a document contains no personal data. Names and company names remain a manual review item.



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
- [ ] Deploy to GitHub Pages and verify `#services`, `#how-we-work`, `#about`, `#project-inquiry` anchors under the fixed header
- [ ] Verify `https://auramind.cloud/privacy` returns 200 after deploy
- [ ] Spot-check Regional globe deferred load on a throttled network
