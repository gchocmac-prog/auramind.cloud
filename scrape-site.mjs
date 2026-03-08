/**
 * Scrapes auramind.cloud to static files for local editing
 * Run: node scrape-site.mjs
 * Set SCRAPE_SOURCE_URL env var if WordPress is at a different URL (e.g. origin before Worker).
 */
import scrape from 'website-scraper';

const sourceUrl = process.env.SCRAPE_SOURCE_URL || 'https://auramind.cloud/';

await scrape({
  urls: [sourceUrl],
  directory: './site',
  recursive: true,
  maxDepth: 2,
  maxRecursiveDepth: 2,
  urlFilter: (url) => url.startsWith(new URL(sourceUrl).origin + '/'),
  filenameGenerator: 'bySiteStructure',
  request: {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' }
  }
}).then(() => console.log('Done! Site saved to ./site')).catch(console.error);
