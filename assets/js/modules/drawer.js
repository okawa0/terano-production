/**
 * ドロワーメニュー（SP のハンバーガー）
 * - aria-expanded / aria-label を状態に同期させる
 * - 開いている間はドロワー内にフォーカスを閉じ込める
 * - Esc キー・オーバーレイ・ナビリンクのクリックで閉じる
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function initDrawer() {
  const toggle = document.querySelector('[data-drawer-toggle]');
  const nav = document.querySelector('[data-drawer]');
  const overlay = document.querySelector('[data-drawer-overlay]');

  if (!toggle || !nav) return;

  const desktop = window.matchMedia('(min-width: 900px)');
  let isOpen = false;

  const setState = (open) => {
    isOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
    overlay?.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const open = () => {
    setState(true);
    // visibility が transition 中は同一フレームで focus できないため、
    // 次のフレームまで待ってから先頭の項目へフォーカスを移す
    window.requestAnimationFrame(() => {
      nav.querySelector(FOCUSABLE)?.focus();
    });
  };

  const close = ({ restoreFocus = true } = {}) => {
    setState(false);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (isOpen ? close() : open()));
  overlay?.addEventListener('click', () => close());

  // ドロワー内のリンクを踏んだら閉じる（ページ内アンカーのため）
  nav.addEventListener('click', (event) => {
    if (isOpen && event.target.closest('a')) close({ restoreFocus: false });
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    // フォーカストラップ：ドロワーの外へタブ移動させない
    const items = [toggle, ...nav.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null
    );
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // PC 幅に戻したら状態をリセットする（開いたまま残さない）
  desktop.addEventListener('change', (event) => {
    if (event.matches && isOpen) close({ restoreFocus: false });
  });
}
