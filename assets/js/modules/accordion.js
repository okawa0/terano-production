/**
 * アコーディオン（FAQ）
 * ボタンと本文を aria-controls / aria-expanded で結び付ける。
 * 開閉は grid-template-rows: 0fr → 1fr の CSS トランジションに任せ、
 * JS は状態クラスの付け外しだけを行う（高さの実測が不要になる）。
 */

export function initAccordion() {
  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const triggers = root.querySelectorAll('[data-accordion-trigger]');

    triggers.forEach((trigger) => {
      const panel = document.getElementById(
        trigger.getAttribute('aria-controls')
      );
      if (!panel) return;

      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

        // 同時に開くのは 1 つだけにする
        if (willOpen && root.dataset.accordion === 'single') {
          triggers.forEach((other) => {
            if (other === trigger) return;
            other.setAttribute('aria-expanded', 'false');
            document
              .getElementById(other.getAttribute('aria-controls'))
              ?.classList.remove('is-open');
          });
        }

        trigger.setAttribute('aria-expanded', String(willOpen));
        panel.classList.toggle('is-open', willOpen);
      });
    });
  });
}
