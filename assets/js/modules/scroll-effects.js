/**
 * スクロール量に連動する UI
 * - ヘッダーに影を付ける
 * - ページトップへ戻るボタンの表示切り替え
 * スクロールイベントは requestAnimationFrame で間引く
 */

const SHADOW_THRESHOLD = 8;
const TO_TOP_THRESHOLD = 600;

export function initScrollEffects() {
  const header = document.querySelector('[data-header]');
  const toTop = document.querySelector('[data-to-top]');

  if (!header && !toTop) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > SHADOW_THRESHOLD);
    toTop?.classList.toggle('is-visible', y > TO_TOP_THRESHOLD);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}
