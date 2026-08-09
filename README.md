# ルミナプロダクション コーポレートサイト

芸能プロダクションのコーポレートサイト（仮想案件）。
既存デザインの下層ページ実装に加え、**トップページはデザインから自作**しています。

🔗 **[https://okawa0.github.io/lumina-production/](https://okawa0.github.io/lumina-production/)**

---

## 概要

もとは実案件をもとにした「スタッフ紹介」まわりの下層ページ実装のみでしたが、
サイトとして成立させるため、以下を追加・改修しました。

- トップページの設計・デザイン・実装（新規）
- グローバルナビゲーション／ドロワーメニューの追加（全ページ）
- SCSS の設計分割とビルド環境の整備
- JavaScript の ES Modules 化と機能分割
- アクセシビリティ・SEO・パフォーマンスの見直し

---

## ページ構成

| ページ | ファイル | 内容 |
| --- | --- | --- |
| ホーム | `index.html` | ヒーロー／お知らせ／私たちについて／所属タレント／事業内容／オーディション／FAQ／お問い合わせ |
| スタッフ紹介 | `staff.html` | インタビュー記事の一覧（抜粋6件） |
| スタッフ一覧 | `list.html` | 所属タレントの一覧（9件） |
| スタッフ詳細 | `detail.html` | インタビュー本文＋サイドバー＋SNSシェア |

---

## 担当範囲

- トップページのデザイン（ワイヤー・配色・レイアウト）
- コーディング（HTML / SCSS / JavaScript）
- レスポンシブ対応
- 画像の最適化・OGP画像の作成

※ 下層3ページのデザインは支給デザインに基づく実装です。

---

## 使用技術

- **HTML5**
  - セマンティックなマークアップ
  - OGP / Twitter Card
  - 構造化データ（JSON-LD：Organization / BreadcrumbList / Article）
- **SCSS**
  - `@use` / `@forward` によるモジュール分割（22ファイル）
  - FLOCSS を参考にした foundation / layout / component / page の4層構成
  - BEM 記法、デザイントークン（色・余白・ブレイクポイント）の変数化
- **JavaScript（ES Modules）**
  - 機能ごとに 9 モジュールへ分割（ビルド不要のネイティブ ESM）
- **Dart Sass**（ビルド）

---

## ディレクトリ構成

```
.
├── index.html            # ホーム
├── staff.html            # スタッフ紹介
├── list.html             # スタッフ一覧
├── detail.html           # スタッフ詳細
├── sitemap.xml
├── package.json
└── assets/
    ├── css/style.css     # ビルド成果物（1ファイル）
    ├── images/
    ├── js/
    │   ├── main.js       # エントリーポイント
    │   └── modules/      # 機能ごとのモジュール
    └── scss/
        ├── style.scss    # エントリーポイント
        ├── foundation/   # 変数・ミックスイン・リセット
        ├── layout/       # ヘッダー・フッター・コンテナ
        ├── component/    # 再利用する部品
        └── page/         # 各ページ固有の調整
```

---

## 実装した主な機能

| 機能 | 実装のポイント |
| --- | --- |
| ドロワーメニュー | `aria-expanded` の同期、フォーカストラップ、Esc / オーバーレイで閉じる、背面スクロールのロック、PC幅への復帰時に状態をリセット |
| スクロール表示アニメーション | `IntersectionObserver`。表示済みの要素は監視を解除。JS 無効時に本文が消えないよう `html.js` が付いたときだけ初期状態を隠す |
| 数値カウントアップ | 画面に入ったタイミングで easing 付きに加算。`prefers-reduced-motion` 時は最終値を即表示 |
| タレントスライダー | レイアウトと横スクロールは CSS の `scroll-snap` が担当。JS は前へ／次へボタンと端での無効化のみ。**JS が動かなくてもスワイプで全件閲覧できる** |
| FAQ アコーディオン | `grid-template-rows: 0fr → 1fr` で高さの実測なしに開閉をアニメーション。`aria-expanded` / `aria-controls` で関連付け |
| お問い合わせフォーム | ブラウザ標準のバリデーション API を利用し、メッセージのみ日本語化。`aria-invalid` / `aria-describedby` でエラーを支援技術に伝え、最初のエラー項目へフォーカス |
| SNSシェア | ポップアップで X / Facebook を開く。ブロックされた場合は通常の新規タブへフォールバック |
| 記事画像の保存抑止 | 右クリック・ドラッグの抑止（案件要件） |

---

## パフォーマンス

支給画像が表示サイズに対して過大だったため、全画像を実寸に合わせて再生成しました。

| 項目 | Before | After |
| --- | --- | --- |
| 画像アセット合計 | 約 4.2 MB | **584 KB** |
| バナー6枚 | 約 1.5 MB（3168×1344） | **104 KB**（448×190） |
| SNSアイコン（Instagram） | 206 KB（5000×5000） | **1.7 KB**（48×48） |

あわせて以下を実施しています。

- 全 `img` に `width` / `height` を指定して CLS を抑制
- ファーストビューに `fetchpriority="high"`、それ以外に `loading="lazy"` / `decoding="async"`
- 下層ページのキービジュアルを `<picture>` + `<source media>` に変更し、SP / PC で不要な画像を読み込まないように修正
- SP で非表示にしていたバナーが実際には読み込まれていた問題を解消

---

## アクセシビリティ

- スキップリンク、`:focus-visible` によるフォーカスリング
- ランドマーク（`header` / `nav` / `main` / `aside` / `footer`）と見出し階層の整理
- パンくずの現在地を `aria-current="page"` で明示
- 遷移先のないページ送りは `aria-disabled` を付与し、リンクにしない
- カード全体を1リンクにまとめ、タブ移動の重複を解消
- 装飾画像は `alt=""`、意味を持つ画像・アイコンには代替テキストを付与
- `prefers-reduced-motion` に対応

---

## ビルド

```bash
npm install
npm run build   # SCSS を assets/css/style.css へ（1ファイルに圧縮）
npm run watch   # 開発時
npm run serve   # ローカルサーバー（ES Modules のため file:// では動作しません）
```

> 納品要件により **CSS は1ファイルにまとめて出力**しています。
> SCSS 側で機能ごとに分割し、`style.scss` から `@use` で束ねる構成です。

---

## 案件詳細（元案件）

- 依頼内容：HTMLでのコーディング。CSSは一つにまとめること。出来上がったものをWPへお客様側で組み込む。
- 納期：1〜2週間
- 予算：6万5千円
- 基本要件：余白の調整、SNSシェアウィンドウの立ち上げ、記事画像保存防止処理、記事画像無しパターン想定実装

---

## 今後の改善予定

- WordPress 化を前提としたテンプレート分割（`get_header()` / `get_footer()` 相当の切り出し）
- 記事一覧の load more 機能
- お知らせ一覧ページ・オーディション詳細ページの追加
- 実機での Lighthouse 計測結果の記録

---

## 制作者

おおかわ / Webコーダー

Portfolio: [https://okawa-web.com](https://okawa-web.com/)
