/**
 * 画面に入った要素をふわっと表示する
 * data-reveal を付けた要素が対象。data-reveal-stagger を付けた親は
 * 子要素へ順番に遅延を割り当てる。
 * 一度表示したら監視を解除するので、行き来しても再生され続けない。
 */

const STAGGER_STEP = 0.12; // 秒
const STAGGER_CYCLE = 3; // 列数に合わせて遅延を繰り返す（末尾の要素が待たされすぎないように）

export function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (targets.length === 0) return;

  // IntersectionObserver が使えない環境では最初から表示しておく
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    const cycle = Number(group.dataset.revealStagger) || STAGGER_CYCLE;

    group.querySelectorAll('[data-reveal]').forEach((el, index) => {
      const delay = (index % cycle) * STAGGER_STEP;
      el.style.setProperty('--reveal-delay', `${delay}s`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}
