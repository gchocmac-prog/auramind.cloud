/**
 * FAQ accordion: toggle answer visibility when question row is clicked/tapped.
 * Cross-browser: works in Chrome, Firefox, Safari, Edge (desktop and mobile).
 */
(function () {
  if (typeof document.addEventListener !== 'function' || typeof document.querySelector !== 'function') return;

  function initFaqAccordion() {
    var container = document.querySelector('.elementor-toggle');
    if (!container) return;
    if (container._faqDone) return;
    container._faqDone = true;

    var handler = function (e) {
      var target = e.target;
      var title = target.closest ? target.closest('.elementor-tab-title') : null;
      if (!title) return;
      e.preventDefault();
      e.stopPropagation();
      title.classList.toggle('elementor-active');
      title.setAttribute('aria-expanded', title.classList.contains('elementor-active') ? 'true' : 'false');
    };

    container.addEventListener('click', handler, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
  } else {
    initFaqAccordion();
  }
})();
