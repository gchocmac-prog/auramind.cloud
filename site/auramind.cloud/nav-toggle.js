/**
 * Mobile nav: toggle dropdown when hamburger (twbb-menu-toggle) is clicked/tapped.
 * Cross-browser: works in Chrome, Firefox, Safari, Edge (desktop and mobile).
 */
(function () {
  if (typeof document.addEventListener !== 'function' || typeof document.querySelectorAll !== 'function') return;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavToggle);
  } else {
    initNavToggle();
  }
})();
