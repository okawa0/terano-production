/**
 * SNS シェア
 * data-share="x" / "facebook" を持つボタンからポップアップを開く。
 * ポップアップがブロックされた場合は同じ URL へ通常遷移させ、
 * 「押しても何も起きない」状態を作らない。
 */

const WINDOWS = {
  x: { name: 'share-x', width: 550, height: 420 },
  facebook: { name: 'share-facebook', width: 626, height: 436 },
};

const buildUrl = (type, pageUrl, pageTitle) => {
  const url = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(pageTitle);

  switch (type) {
    case 'x':
      return `https://x.com/intent/post?url=${url}&text=${text}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    default:
      return '';
  }
};

export function initShare() {
  const buttons = document.querySelectorAll('[data-share]');
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.share;
      const config = WINDOWS[type];
      const shareUrl = buildUrl(type, window.location.href, document.title);

      if (!config || !shareUrl) return;

      // 画面中央にポップアップを配置する
      const left = window.screenX + (window.outerWidth - config.width) / 2;
      const top = window.screenY + (window.outerHeight - config.height) / 2;

      // 特性値に noopener を含めると window.open が null を返してしまい、
      // ブロック判定と区別できなくなる。開いた後に opener を切る。
      const popup = window.open(
        shareUrl,
        config.name,
        `width=${config.width},height=${config.height},left=${Math.max(
          0,
          Math.round(left)
        )},top=${Math.max(0, Math.round(top))}`
      );

      if (popup) {
        popup.opener = null;
        popup.focus();
        return;
      }

      // ポップアップがブロックされたときは通常の新規タブで開く
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    });
  });
}
