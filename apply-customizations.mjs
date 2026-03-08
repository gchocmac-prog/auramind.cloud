/**
 * Re-applies custom edits after scrape (scrape overwrites our changes).
 * Run after: npm run scrape
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, 'site', 'auramind.cloud', 'index.html');

let html = readFileSync(indexPath, 'utf8');

// 1. Ensure fix-interaction.css is linked (add after <title> if missing)
if (!html.includes('fix-interaction.css')) {
  html = html.replace(
    /(<title>[^<]+<\/title>)/,
    '$1\n<link rel="stylesheet" href="/fix-interaction.css">'
  );
}

// 2. Hero section: heading
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">EMPOWERING AI INFRASTRUCTURE EXCELLENCE<\/h2>/,
  '<h2 class="elementor-heading-title elementor-size-default">NEW MINDSET FOR AI ERA</h2>'
);

// 3. Hero section: paragraphs (match various possible originals)
html = html.replace(
  /<p>AuraMind AI leads the way in comprehensive AI infrastructure[^<]*<\/p>/,
  '<p>Auramind AI provides a clear vision for businesses of all scales for their needs of smart solutions in modern days. From planning the infrastructure to deployment of AI servers, or just simply in need of consultation to better adapt in this new era, we make sure anyone could turn to us for a better future.</p>\n\t\t\t\t\t\t\t<p>Click below to discover our services.</p>'
);

// 4. Section 3 intro
html = html.replace(
  /AuraMind AI offers a comprehensive suite of services designed to optimize your AI infrastructure[^<]+/,
  'Auramind AI offers a comprehensive suite of services designed to help you better fit in this time of advancement. From sourcing your desired items, to consulting about the design of complete waterline for your work with the assistance of AI, whatever you are looking for in AI, we have something in store for you.'
);

// 5. B2B card
html = html.replace(
  /<h5 class="twbb_cta-title">AI Server Rentals<\/h5>\s*<div class="twbb_cta-description">Access high-performance servers[^<]+<\/div>/,
  '<h5 class="twbb_cta-title">B2B All Rounders\' Solutions</h5>\n                    <div class="twbb_cta-description">Access the process of sourcing, procurement, infra-planning, network planning, logistics with ease.</div>'
);

// 6. FAQ background + lazy-load script (before </body>)
const faqStyle = '<style id="faq-bg-override">.elementor-element-09r9ewp1,.elementor-element-09r9ewp1 .e-con-inner,.elementor-element-zka27bmd,.elementor-element-zka27bmd .e-con-inner,.elementor-element-zka27bmd .elementor-widget-wrap,.elementor-element-zka27bmd .elementor-widget-container,.elementor-element-zka27bmd::before,.elementor-element-zka27bmd::after{background-color:#fff!important;background:#fff!important;background-image:none!important}</style>';
const lazyScript = '<script>(function(){function loadLazyImages(){document.querySelectorAll("img[data-src]").forEach(function(img){var s=img.getAttribute("data-src");if(s){img.src=s;img.removeAttribute("data-src");}var ss=img.getAttribute("data-srcset");if(ss){img.srcset=ss;img.removeAttribute("data-srcset");}});}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",loadLazyImages);}else{loadLazyImages();}})();</script>';

if (!html.includes('faq-bg-override') || !html.includes('loadLazyImages')) {
  const inject = [html.includes('faq-bg-override') ? '' : faqStyle, html.includes('loadLazyImages') ? '' : lazyScript].filter(Boolean).join('\n');
  if (inject) html = html.replace('</body>', `${inject}\n\n</body>`);
}

// 7. FAQ container inline style (add if missing)
html = html.replace(
  /(<div[^>]*elementor-element-zka27bmd[^>]*)>/,
  (m) => m.includes('background-color') ? m : m.replace('>', ' style="background-color: #ffffff !important; background: #ffffff !important;">')
);

writeFileSync(indexPath, html);
console.log('Customizations applied to index.html');
