# Browser compatibility (mainstream)

This document summarizes the cross-browser compatibility work done so the site works in **Chrome, Firefox, Safari, and Edge** (current and recent versions).

## What was done

### CSS (`fix-interaction.css`)

- **`min()` function**  
  Used for contact section width. Browsers that don’t support `min()` (e.g. older Safari) get a fallback: `min-width: 100%` is set first, then `min-width: min(100%, 1200px)` so supporting browsers override.

- **`:has()` selector**  
  Used for the tech-news card grid. Browsers without `:has()` (e.g. Firefox &lt; 121) get a fallback on the **blog page** via `body.page-id-147 .elementor-posts-container` so the blog grid still works. Home page news grid still requires `:has()` support.

- **Mask properties**  
  Footer gradient mask uses both `-webkit-mask-*` and standard `mask-*` so Safari and others render it correctly.

- **Line clamp**  
  Card titles use `-webkit-line-clamp` and `-webkit-box-orient` (with `overflow: hidden`) so multi-line clamping works in WebKit/Blink; other browsers get overflow hidden only.

### Content without JavaScript

- **FAQs / Contact**  
  The “Need to have a word with us?” block and its container are forced visible with CSS (`visibility: visible`, `opacity: 1`) so the contact form and content show even when animation or delayed JS never runs.

- **Logos**  
  On the FAQs page, header and footer logos use real image URLs in `src` (no lazy placeholder), so they load without JS. Other pages may still rely on the inline `loadLazyImages` script or real `src` where already set.

- **Critical images**  
  Services card images use direct `src` and root-relative paths (`/assets/...`) so they load reliably across browsers and when lazy-load scripts fail.

### HTML

- **Viewport and charset**  
  Pages use `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">` for correct scaling and encoding.

## Target browsers

- **Chrome** (current, desktop & mobile)  
- **Firefox** (current; `:has()` from 121+)  
- **Safari** (current macOS/iOS; WebKit prefixes and fallbacks in place)  
- **Edge** (Chromium, current)

Older versions may get degraded layout (e.g. no `:has()` grid on home news section) but core content and navigation remain usable. IE11 is not supported (relies on modern grid, flex, and optional JS).

## How to re-check

1. Open the site in Chrome, Firefox, Safari, and Edge (latest stable).
2. Test: home, Services (card images), FAQs/Contact (content and form visible), Blog (grid layout).
3. Optionally disable JavaScript and confirm logos and contact block still appear where fixed.
4. Resize to mobile width and confirm layout and touch targets.
