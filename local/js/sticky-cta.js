// 追尾CTA: hero内の「全種セット」カード(.mv-set-card)を通り過ぎたら表示し、
// 上に戻ったら再び隠す。
(function () {
  var target = document.querySelector('.mv-set-card');
  var bar = document.getElementById('stickyCta');
  if (!target || !bar) return;

  if (!('IntersectionObserver' in window)) {
    bar.classList.add('is-visible');
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    var entry = entries[0];
    var scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', scrolledPast);
  }, { threshold: 0 });

  io.observe(target);
})();
