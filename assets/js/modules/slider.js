/**
 * タレントスライダー
 * レイアウトと横スクロールは CSS の scroll-snap が担当し、
 * JS は「前へ / 次へ」ボタンと、端に着いたときの無効化だけを担当する。
 * そのため JS が動かない環境でもスワイプで全件閲覧できる。
 */

export function initSlider() {
  document.querySelectorAll('[data-slider]').forEach(setupSlider);
}

function setupSlider(root) {
  const viewport = root.querySelector('[data-slider-viewport]');
  const prev = root.querySelector('[data-slider-prev]');
  const next = root.querySelector('[data-slider-next]');
  const slides = viewport?.querySelectorAll('[data-slider-slide]');

  if (!viewport || !slides || slides.length === 0) return;

  // 1 回の操作でスライド 1 枚分（＋隙間）だけ動かす
  const stepSize = () => {
    const [first, second] = slides;
    return second
      ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
      : first.getBoundingClientRect().width;
  };

  const scrollByStep = (direction) => {
    viewport.scrollBy({ left: stepSize() * direction, behavior: 'smooth' });
  };

  const updateButtons = () => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    // 小数点の丸め誤差を吸収するため 2px の余裕を持たせる
    if (prev) prev.disabled = viewport.scrollLeft <= 2;
    if (next) next.disabled = viewport.scrollLeft >= max - 2;
  };

  prev?.addEventListener('click', () => scrollByStep(-1));
  next?.addEventListener('click', () => scrollByStep(1));

  viewport.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons, { passive: true });

  // ボタンは JS が動いて初めて意味を持つので、ここで表示する
  root.querySelector('[data-slider-controls]')?.removeAttribute('hidden');
  updateButtons();
}
