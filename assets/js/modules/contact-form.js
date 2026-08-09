/**
 * お問い合わせフォームのバリデーション
 * ブラウザ標準のバリデーション API を使い、メッセージだけ日本語で差し替える。
 * エラーは aria-invalid / aria-describedby でフィールドと紐付けて支援技術にも伝える。
 *
 * ※ 本サイトはフロントエンドのみの制作のため、送信先は用意していない。
 *    入力チェックが通った時点で完了メッセージを表示するデモ挙動としている。
 */

// 項目名を受け取って文面を組み立てる。
// data-error-required を持つ項目は、未入力時だけその文面で上書きする。
const MESSAGES = {
  valueMissing: (label) => `${label}を入力してください。`,
  typeMismatch: (label) => `${label}の形式が正しくありません。`,
  tooShort: (label, field) =>
    `${label}は${field.minLength}文字以上でご記入ください。`,
  patternMismatch: (label) => `${label}の形式が正しくありません。`,
};

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const result = form.parentElement.querySelector('[data-form-result]');
  const fields = form.querySelectorAll('[data-validate]');

  // 標準のエラー表示は使わず、自前のメッセージ領域に出す
  form.setAttribute('novalidate', '');

  const errorFor = (field) =>
    document.getElementById(`${field.id}-error`);

  const messageFor = (field) => {
    const { validity } = field;
    if (validity.valid) return '';

    if (validity.valueMissing && field.dataset.errorRequired) {
      return field.dataset.errorRequired;
    }

    const label =
      field.closest('.form__field')?.querySelector('.form__label')?.firstChild
        ?.textContent?.trim() ?? 'この項目';

    const key = Object.keys(MESSAGES).find((name) => validity[name]);

    return key ? MESSAGES[key](label, field) : '入力内容をご確認ください。';
  };

  const validateField = (field) => {
    const message = messageFor(field);
    const target = errorFor(field);

    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (target) target.textContent = message;

    return !message;
  };

  fields.forEach((field) => {
    // 入力中に赤くしないよう、一度離れてから検証する
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalid = [...fields].filter((field) => !validateField(field));

    if (invalid.length > 0) {
      invalid[0].focus();
      return;
    }

    form.hidden = true;
    if (result) {
      result.classList.add('is-visible');
      result.focus();
    }
  });
}
