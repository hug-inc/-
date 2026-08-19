/* FAQ accordion: slide the answer open and shut.
   <details> stays the source of truth, so keyboard use, focus and
   screen readers keep working; this only animates the height between
   the two states. Under prefers-reduced-motion, or in a background tab
   where animations are throttled, the browser's own instant toggle is
   left alone. */
(function () {
  'use strict';

  var items = document.querySelectorAll('.faq-list details');
  if (!items.length || typeof Element.prototype.animate !== 'function') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DURATION = 260;
  var EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

  Array.prototype.forEach.call(items, function (item) {
    var summary = item.querySelector('summary');
    var answer = item.querySelector('.answer');
    if (!summary || !answer) return;

    var running = null;

    function play(keyframes, done) {
      var settled = false;
      function settle() {
        if (settled) return;
        settled = true;
        running = null;
        if (done) done();
      }

      running = answer.animate(keyframes, { duration: DURATION, easing: EASING });
      running.onfinish = settle;
      // Never let the open/closed state hang on the animation actually
      // finishing — a throttled or interrupted animation would otherwise
      // leave the item stuck half-toggled.
      window.setTimeout(settle, DURATION + 120);
    }

    summary.addEventListener('click', function (event) {
      if (reduce.matches || document.hidden) return;
      event.preventDefault();

      if (running) {
        running.cancel();          // snap back to the resting height
        running = null;
      }

      if (item.open) {
        // Closing: bring the + back at once, then collapse.
        var from = answer.offsetHeight;
        item.classList.add('is-closing');
        play([{ height: from + 'px' }, { height: '0px' }], function () {
          item.open = false;
          item.classList.remove('is-closing');
        });
      } else {
        // Opening: reveal first so the target height can be measured.
        item.open = true;
        item.classList.remove('is-closing');
        play([{ height: '0px' }, { height: answer.offsetHeight + 'px' }]);
      }
    });
  });
})();
