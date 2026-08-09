/**
 * 記事画像の保存抑止（案件要件）
 * 右クリックとドラッグを抑止する。CSS 側でも user-select / pointer-events を
 * 併用しているが、完全な保護ではなく「気軽な保存を防ぐ」レベルの措置である点に注意。
 */

export function initImageProtect() {
  const scope = document.querySelector('[data-protect-images]');
  if (!scope) return;

  const block = (event) => {
    if (event.target.tagName === 'IMG') event.preventDefault();
  };

  scope.addEventListener('contextmenu', block);
  scope.addEventListener('dragstart', block);
}
