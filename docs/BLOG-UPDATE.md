# Blog / Tech news auto-update

The **blog page** and **homepage Tech news** are filled from RSS feeds (see `news-sources.json`). They update when the **Update Latest News** GitHub Action runs.

## How it works

1. **Schedule:** The workflow runs **daily at 02:00 UTC** (`cron: '0 2 * * *'`).
2. **Manual run:** You can also run it from **Actions → "Update Latest News (scheduled scrape)" → Run workflow**.
3. **Steps:** The workflow runs `npm run update-news` (fetches RSS, rewrites the posts container in `index.html` and `blog/index.html`), then commits and pushes **only if something changed**.
4. **Deploy:** A push to `main` triggers the **Deploy to Cloudflare Workers** workflow, so the live site updates after the news run.

## Why the blog might not be updating

| Cause | What to do |
|-------|------------|
| **No write permission** | The workflow needs `permissions: contents: write` so it can push. This is now set in `.github/workflows/update-news.yml`. |
| **Schedule not running** | Scheduled workflows run only on the **default branch** (`main`). They can be delayed; first run after adding a cron can take a while. Check **Actions** tab for runs. |
| **Workflow disabled** | In **Actions**, open the workflow and ensure it isn’t disabled. |
| **No changes** | If fetched content is the same as last run, there’s no commit and no push (and no deploy). That’s expected. |
| **Script failure** | If `fetch-news.mjs` can’t find the posts container in `blog/index.html` or `index.html`, the job fails. Don’t change the structure of the `elementor-posts-container` div. |

## Run updates locally

```bash
npm run update-news
```

This updates `site/auramind.cloud/index.html` (homepage) and `site/auramind.cloud/blog/index.html` (blog). Commit and push to deploy.
