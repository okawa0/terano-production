/**
 * エントリーポイント
 * 機能ごとに ES Modules で分割し、ここでまとめて初期化する。
 * 各モジュールは対象要素が無ければ即 return するため、
 * ページごとに読み込むファイルを出し分ける必要がない。
 */

import { initDrawer } from './modules/drawer.js';
import { initScrollEffects } from './modules/scroll-effects.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initCountUp } from './modules/count-up.js';
import { initSlider } from './modules/slider.js';
import { initAccordion } from './modules/accordion.js';
import { initContactForm } from './modules/contact-form.js';
import { initShare } from './modules/share.js';
import { initImageProtect } from './modules/image-protect.js';

const modules = [
  initDrawer,
  initScrollEffects,
  initScrollReveal,
  initCountUp,
  initSlider,
  initAccordion,
  initContactForm,
  initShare,
  initImageProtect,
];

// 1 つのモジュールが落ちても他の機能を巻き込まないようにする
modules.forEach((init) => {
  try {
    init();
  } catch (error) {
    console.error(`[lumina] ${init.name} の初期化に失敗しました`, error);
  }
});
