/**
 * Mobile nav: toggle dropdown when hamburger (twbb-menu-toggle) is clicked/tapped.
 * Cross-browser: works in Chrome, Firefox, Safari, Edge (desktop and mobile).
 * Also: tab title = "Auramind AI"; fix footer broken encoding (replacement char).
 */
(function () {
  if (typeof document.addEventListener !== 'function' || typeof document.querySelectorAll !== 'function') return;

  function applyTitleAndFooterFix() {
    var t = document.title || '';
    if (t.indexOf('\uFFFD') !== -1) {
      document.title = t.replace(/\s*[\uFFFD?]+\s*/g, ' | ').replace(/\s*\|\s*\|/g, ' | ') || 'Auramind AI';
    }
    if (!document.title) document.title = 'Auramind AI';
    var footer = document.querySelector('.elementor-element-6hbale5l .elementor-widget-container');
    if (footer && footer.textContent && (footer.textContent.indexOf('2025') !== -1 || footer.textContent.indexOf('\uFFFD') !== -1)) {
      footer.textContent = '\u00A9 2025 Auramind AI. All rights reserved. Leading the way in AI infrastructure management.';
    }
  }

  function initNavToggle() {
    var buttons = document.querySelectorAll('.twbb-menu-toggle');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (btn._navToggleDone) continue;
      btn._navToggleDone = true;
      btn.addEventListener('click', function () {
        var widget = this.closest ? this.closest('.elementor-widget-twbb-nav-menu') : null;
        if (widget) widget.classList.toggle('twbb-nav-menu--toggle-active');
        var expanded = widget && widget.classList.contains('twbb-nav-menu--toggle-active');
        this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }, false);
    }
  }

  function init() {
    applyTitleAndFooterFix();
    initNavToggle();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
