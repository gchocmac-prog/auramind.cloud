# Deploy this website on Cloudflare

This project is set up to deploy as **Cloudflare Workers (static assets)**. The site is served from `site/auramind.cloud` with no server-side code.

## Prerequisites

- Node.js 18+
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is enough)

## Deploy steps

### 1. Install dependencies

```bash
npm install
```

### 2. Log in to Cloudflare (first time only)

**On your machine (with a browser):**

```bash
npx wrangler login
```

This opens a browser to authorize Wrangler with your Cloudflare account.

**In CI or non-interactive environments:** set a [Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) and run:

```bash
set CLOUDFLARE_API_TOKEN=your_token_here
npm run deploy
```

### 3. Deploy

```bash
npm run deploy
```

Or:

```bash
npx wrangler deploy
```

Wrangler uploads everything in `site/auramind.cloud` and publishes the Worker. When it finishes, you get a URL like:

`https://auramind.<your-subdomain>.workers.dev`

### 4. Use your own domain (auramind.cloud)

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) go to **Workers & Pages**.
2. Open the **auramind** worker.
3. Go to **Settings** → **Domains & routes** (or **Triggers** → **Custom Domains**).
4. Click **Add** and add `auramind.cloud` (and optionally `www.auramind.cloud`).

Your domain must be on Cloudflare (same account) for the Worker to be attached. If `auramind.cloud` is already a zone in your account, adding it here is enough. If not, add the site in **Websites** and update the domain’s nameservers to Cloudflare, then add the custom domain to the Worker as above.

## Config

- **Wrangler:** `wrangler.jsonc`  
  - `name`: worker name (auramind)  
  - `assets.directory`: `site/auramind.cloud` (static files)  
  - `workers_dev`: `true` → gives you a `*.workers.dev` URL

- **Static files:** all HTML, CSS, JS, and assets under `site/auramind.cloud` are served as-is. Requests that match a file are served directly; others return 404.

## Optional: Cloudflare Pages (alternative)

If you prefer **Pages** instead of Workers:

1. In Dashboard go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git** (or **Direct Upload**).
2. If using Git: connect the repo and set **Build output directory** to `site/auramind.cloud` (and no build command).
3. If using Direct Upload: upload the contents of `site/auramind.cloud` as the project root.

Then add your custom domain in the Pages project settings. The current setup uses Workers + static assets and does not require Pages unless you want that workflow.
