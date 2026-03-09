/**
 * Injects meta descriptions and JSON-LD structured data for SEO and AI discoverability.
 * Target: first-page visibility for "buy servers", "customize servers", "business AI deployment".
 * Run after: npm run scrape && node apply-customizations.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, 'site', 'auramind.cloud');
const BASE = 'https://auramind.cloud';

const SEO_MARKER = '<!-- auramind-seo -->';

const PAGE_CONFIG = [
  {
    path: 'index.html',
    slug: '',
    title: 'Buy AI Servers & Custom GPU Solutions | Business AI Deployment | Auramind AI',
    description: 'Buy servers, customize servers, and get business solutions for AI deployment. Auramind AI offers GPU server rental, custom AI infrastructure, and AI server solutions in Malaysia and Asia.',
    isHome: true,
  },
  {
    path: 'services/index.html',
    slug: 'services/',
    title: 'AI Server Rental & Custom Server Solutions | Auramind AI Services',
    description: 'Customize servers for AI workloads. AI server rental, GPU servers, and business solutions for AI deployment. Sourcing, procurement, and infrastructure planning.',
    isHome: false,
  },
  {
    path: 'about-us/index.html',
    slug: 'about-us/',
    title: 'About Auramind AI | AI Infrastructure & Server Solutions',
    description: 'About Auramind AI: experts in buying servers, customizing servers, and business AI deployment. AI infrastructure management and GPU server solutions.',
    isHome: false,
  },
  {
    path: 'blog/index.html',
    slug: 'blog/',
    title: 'AI Infrastructure & Server Solutions Blog | Auramind AI',
    description: 'Insights on AI servers, GPU rental, custom server solutions, and business AI deployment. Stay updated on AI infrastructure and server best practices.',
    isHome: false,
  },
  {
    path: 'faqs/index.html',
    slug: 'faqs/',
    title: 'FAQs | Buy Servers, AI Deployment & GPU Rental | Auramind AI',
    description: 'Frequently asked questions about buying servers, customizing servers, AI server rental, and business solutions for AI deployment. Get in touch for a quote.',
    isHome: false,
  },
  {
    path: 'ai-server-rentals/index.html',
    slug: 'ai-server-rentals/',
    title: 'AI Server Rentals & GPU Server Rental | Auramind AI',
    description: 'Rent AI servers and GPU servers. Flexible AI server rental for ML training and inference. Business solution for AI deployment without large upfront cost.',
    isHome: false,
  },
  {
    path: 'ai-infrastructure-management/index.html',
    slug: 'ai-infrastructure-management/',
    title: 'AI Infrastructure Management | Custom Server Solutions | Auramind AI',
    description: 'AI infrastructure management and custom server solutions for business AI deployment. Plan, deploy, and operate AI servers and GPU infrastructure.',
    isHome: false,
  },
  {
    path: 'ai-operation-and-maintenance/index.html',
    slug: 'ai-operation-and-maintenance/',
    title: 'AI Server Operation & Maintenance | Auramind AI',
    description: 'AI server operation and maintenance. Keep your AI infrastructure and custom servers running. Business solution for ongoing AI deployment support.',
    isHome: false,
  },
];

function buildJsonLd(config) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Auramind AI',
    url: BASE + '/',
    description: 'Auramind AI provides business solutions for AI deployment: buy servers, customize servers, AI server rental, GPU servers, and AI infrastructure management.',
    sameAs: [],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Auramind AI',
    url: BASE + '/',
    description: 'Buy AI servers, customize servers, and get business solutions for AI deployment. GPU server rental and AI infrastructure in Malaysia and Asia.',
    publisher: { '@id': BASE + '/#organization' },
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI Server Solutions & Business AI Deployment',
    description: 'Buy servers, customize servers for AI, GPU server rental, and end-to-end business solutions for AI deployment. Sourcing, infrastructure planning, and operations.',
    provider: { '@type': 'Organization', name: 'Auramind AI', url: BASE + '/' },
    areaServed: 'Worldwide',
    serviceType: ['AI server rental', 'Custom server solutions', 'Business AI deployment', 'GPU server rental', 'AI infrastructure management'],
  };

  const scripts = [organization];
  if (config.isHome) scripts.push(website, service);
  else scripts.push(service);

  return scripts.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
}

function injectBlock(config) {
  const meta = `<meta name="description" content="${config.description.replace(/"/g, '&quot;')}">`;
  const jsonLd = buildJsonLd(config);
  return `\n${SEO_MARKER}\n${meta}\n${jsonLd}\n`;
}

function processPage(config) {
  const filePath = join(siteRoot, config.path);
  if (!existsSync(filePath)) {
    console.warn('Skip (missing):', config.path);
    return false;
  }
  let html = readFileSync(filePath, 'utf8');
  if (html.includes(SEO_MARKER)) {
    console.log('Already has SEO:', config.path);
    return false;
  }
  const viewport = /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/;
  if (!viewport.test(html)) {
    console.warn('No viewport meta in:', config.path);
    return false;
  }
  html = html.replace(viewport, '$&' + injectBlock(config));
  writeFileSync(filePath, html);
  console.log('Injected SEO:', config.path);
  return true;
}

// Sitemap
const SITEMAP_URLS = [
  '',
  'services/',
  'about-us/',
  'blog/',
  'faqs/',
  'ai-server-rentals/',
  'ai-infrastructure-management/',
  'ai-operation-and-maintenance/',
];

function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = SITEMAP_URLS.map(
    (slug) =>
      `  <url>\n    <loc>${BASE}/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${slug === '' ? '1.0' : '0.8'}</priority>\n  </url>`
  ).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  const sitemapPath = join(siteRoot, 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap);
  console.log('Wrote sitemap.xml');
}

// Run
let injected = 0;
for (const config of PAGE_CONFIG) {
  if (processPage(config)) injected++;
}
writeSitemap();
console.log('Done. Injected SEO into', injected, 'pages.');
