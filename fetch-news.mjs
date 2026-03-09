/**
 * Fetches news from RSS feeds in news-sources.json and updates the Latest news section in index.html
 * Run: npm run fetch-news
 */
import Parser from 'rss-parser';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const parser = new Parser({ timeout: 10000 });

function stripHtml(s) {
  if (!s) return '';
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160) + (s.length > 160 ? '…' : '');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getImage(item) {
  const enc = item.enclosure;
  if (enc && enc.type && enc.type.startsWith('image/')) return enc.url;
  const m = (item.content || item.contentSnippet || '').match(/<img[^>]+src="([^"]+)"/);
  return m ? m[1] : null;
}

/** Exclude promotional / ad-like posts (deals, sponsored, sales, giveaways, etc.) */
function isPromotional(item) {
  const title = (item.title || '').toLowerCase();
  const content = stripHtml(item.content || item.contentSnippet || item.summary || '').toLowerCase();
  const text = title + ' ' + content;
  const promoPatterns = [
    /\bsponsored\b/, /\bpromo\b/, /\bpromotion\b/, /\bad\s*:\s*/, /\bdeal\b(?!\s*with)/,
    /\bsale\b/, /\bbuy\s+now\b/, /\bshop\s+now\b/, /\bdiscount\b/, /\%\s*off\b/,
    /\bgiveaway\b/, /\bcontest\b/, /\bwin\s+a\b/, /\blimited\s+time\b/, /\bpre[- ]?order\b/,
    /\bprice\s*drop\b/, /\bflash\s*sale\b/, /\bcoupon\b/, /\baffiliate\b/,
    /\bthis\s*post\s+is\s+sponsored\b/, /\bpaid\s+partnership\b/, /\bin\s+collaboration\s+with\b/,
  ];
  return promoPatterns.some((re) => re.test(text));
}

async function main() {
  const config = JSON.parse(readFileSync(join(__dirname, 'news-sources.json'), 'utf8'));
  const all = [];

  for (const { label, feedUrl } of config.feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      (feed.items || []).slice(0, 5).forEach((item) => {
        if (isPromotional(item)) return;
        all.push({
          title: item.title || 'Untitled',
          link: item.link || '#',
          excerpt: stripHtml(item.content || item.contentSnippet || item.summary || ''),
          date: item.pubDate ? new Date(item.pubDate) : new Date(0),
          label,
          image: getImage(item),
        });
      });
    } catch (e) {
      console.warn(`Skip ${feedUrl}: ${e.message}`);
    }
  }

  // RSS does not provide view counts; order by most recent.
  all.sort((a, b) => b.date - a.date);
  const itemsHome = all.slice(0, config.maxItems ?? 4);
  const itemsBlog = all.slice(0, config.maxItemsBlog ?? 14);

  function buildArticlesHtml(items) {
    return items
      .map(
        (it) => `
\t\t\t\t\t<article class="elementor-post elementor-grid-item twbb-news-card post-143 post type-post status-publish format-standard hentry">
\t\t\t\t\t<div class="elementor-post__text">
\t\t\t        <div class="twbb-post__badge-container twbb-news-tags">
\t\t          <span class="elementor-post__badge twbb-news-source twbb-news-tag" aria-label="Source: ${escapeHtml(it.label)}">${escapeHtml(it.label)}</span>
\t\t        </div>
\t\t        		<h5 class="elementor-post__title">
\t\t\t\t\t<a href="${escapeHtml(it.link)}" target="_blank" rel="noopener">${escapeHtml(it.title)}</a>
\t\t\t</h5>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t</article>`
      )
      .join('\n');
  }

  const containerStart = '<div data-skin="classic " class="elementor-posts-container elementor-posts elementor-posts--skin-classic elementor-grid">';

  function replacePostsInHtml(html, articlesHtml) {
    const startIdx = html.indexOf(containerStart);
    if (startIdx === -1) return null;
    const afterStart = html.slice(startIdx);
    const lastArticleEnd = afterStart.lastIndexOf('</article>');
    if (lastArticleEnd === -1) return null;
    const containerEndMarker = afterStart.indexOf('</div>', lastArticleEnd);
    if (containerEndMarker === -1) return null;
    const endIdx = startIdx + containerEndMarker + '</div>'.length;
    const before = html.slice(0, startIdx + containerStart.length);
    const after = html.slice(endIdx);
    return before + '\n' + articlesHtml + '\n\t\t\t\t\t\t\t\t</div>' + after;
  }

  // Homepage: index.html
  const indexPath = join(__dirname, 'site', 'auramind.cloud', 'index.html');
  let html = readFileSync(indexPath, 'utf8');
  const newIndexHtml = replacePostsInHtml(html, buildArticlesHtml(itemsHome));
  if (!newIndexHtml) {
    console.error('Could not find posts container in index.html');
    process.exit(1);
  }
  writeFileSync(indexPath, newIndexHtml);
  console.log(`Updated homepage Tech news with ${itemsHome.length} items.`);

  // Blog page: blog/index.html (14 cards)
  const blogPath = join(__dirname, 'site', 'auramind.cloud', 'blog', 'index.html');
  let blogHtml = readFileSync(blogPath, 'utf8');
  const newBlogHtml = replacePostsInHtml(blogHtml, buildArticlesHtml(itemsBlog));
  if (!newBlogHtml) {
    console.error('Could not find posts container in blog/index.html');
    process.exit(1);
  }
  writeFileSync(blogPath, newBlogHtml);
  console.log(`Updated blog Tech news with ${itemsBlog.length} items.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
