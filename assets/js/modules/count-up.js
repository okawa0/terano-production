/**
 * 数値のカウントアップ
 * data-count-to に最終値を持つ要素が画面に入ったら 0 から数え上げる。
 * 動きを減らす設定のユーザーには最終値をそのまま表示する。
 */

const DURATION = 1400; // ms
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function initCountUp() {
  const targets = document.querySelectorAll('[data-count-to]');
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const render = (el, value) => {
    el.textContent = value.toLocaleString('ja-JP');
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => render(el, Number(el.dataset.countTo)));
    return;
  }

  const animate = (el) => {
    const to = Number(el.dataset.countTo);
    if (Number.isNaN(to)) return;

    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      render(el, Math.round(to * easeOutCubic(progress)));
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  targets.forEach((el) => {
    render(el, 0);
    observer.observe(el);
  });
}
