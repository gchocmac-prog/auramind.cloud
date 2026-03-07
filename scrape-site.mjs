/**
 * Scrapes auramind.cloud to static files for local editing
 * Run: node scrape-site.mjs
 */
import scrape from 'website-scraper';

await scrape({
  urls: ['https://auramind.cloud/'],
  directory: './site',
  recursive: true,
  maxDepth: 2,
  maxRecursiveDepth: 2,
  urlFilter: (url) => url.startsWith('https://auramind.cloud/'),
  filenameGenerator: 'bySiteStructure',
  request: {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' }
  }
}).then(() => console.log('Done! Site saved to ./site')).catch(console.error);
