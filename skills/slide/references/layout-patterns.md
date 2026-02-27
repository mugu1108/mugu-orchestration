# レイアウトパターン集

このドキュメントは、Marpスライド生成で使用する**40種類のレイアウトパターン**を7カテゴリに分類して定義します。毎回新しいレイアウトを生成するのではなく、このパターン集から適切なものを選択して使用してください。

---

## 目次

1. [A. タイトル/セクション（5種）](#a-タイトルセクション5種)
2. [B. カラムレイアウト（8種）](#b-カラムレイアウト8種)
3. [C. 縦リスト（4種）](#c-縦リスト4種)
4. [D. パネルデザイン（5種）](#d-パネルデザイン5種)
5. [E. 背景/画像（4種）](#e-背景画像4種)
6. [F. 強調/特殊（3種）](#f-強調特殊3種)
7. [G. 応用パターン（10種）](#g-応用パターン10種)
8. [パターン選択ガイド](#パターン選択ガイド)

---

## A. タイトル/セクション（5種）

### A-1. タイトルスライド

```markdown
<!-- _class: lead -->
<!--
_backgroundImage: "linear-gradient(to right, #1B4565, #3E9BA4)"
_color: #fff
-->

# プレゼンテーションタイトル

## サブタイトル

**発表者名**
2026年2月3日
```

### A-2. セクション開始

```markdown
<!--
_backgroundImage: "linear-gradient(to right, #1B4565, #3E9BA4)"
_color: #fff
-->

# 1. セクションタイトル
```

### A-3. セクション終了/サマリー

```markdown
# セクション1 まとめ

<div class="bg-gray-50 rounded-xl shadow-lg p-6 mt-6">
  <ul class="text-em-lg space-y-3 text-gray-700">
    <li>ポイント1</li>
    <li>ポイント2</li>
    <li>ポイント3</li>
  </ul>
</div>
```

### A-4. 目次/アジェンダ

```markdown
# アジェンダ

<div class="grid grid-cols-2 gap-6 mt-6">
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-em-xl font-bold text-gray-800">1. イントロダクション</p>
    <p class="text-em-base text-gray-600 mt-2">背景と目的</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-em-xl font-bold text-gray-800">2. 本題</p>
    <p class="text-em-base text-gray-600 mt-2">詳細な解説</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-em-xl font-bold text-gray-800">3. デモ</p>
    <p class="text-em-base text-gray-600 mt-2">実際の動作</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-em-xl font-bold text-gray-800">4. まとめ</p>
    <p class="text-em-base text-gray-600 mt-2">結論と次のステップ</p>
  </div>
</div>
```

### A-5. クロージングスライド

```markdown
<!-- _class: lead -->
<!--
_backgroundImage: "linear-gradient(to right, #1B4565, #3E9BA4)"
_color: #fff
-->

# ご清聴ありがとうございました

**質問・フィードバック歓迎**

@yourhandle | your@email.com
```

---

## B. カラムレイアウト（8種）

### B-1. 2カラム比較（Before/After）

```html
# 変更前後の比較

<div class="grid grid-cols-2 gap-6 mt-6 text-base">
  <div class="bg-gray-50 rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
    <h1 class="text-em-2xl font-bold mb-4 text-gray-800">Before</h1>
    <ul class="text-em-lg space-y-3 text-gray-700">
      <li>問題点1</li>
      <li>問題点2</li>
      <li>問題点3</li>
    </ul>
  </div>
  <div class="bg-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-primary" style="--tw-border-opacity:1;border-color:#3E9BA4;">
    <h1 class="text-em-2xl font-bold mb-4 text-gray-800">After</h1>
    <ul class="text-em-lg space-y-3 text-gray-700">
      <li>改善点1</li>
      <li>改善点2</li>
      <li>改善点3</li>
    </ul>
  </div>
</div>
```

### B-2. 2カラム対比（期待 vs 現実）

```html
# 期待と現実

<div class="grid grid-cols-2 gap-6 mt-6 text-base">
  <div class="bg-gray-50 rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
    <h1 class="text-em-2xl font-bold mb-4 text-gray-800">期待</h1>
    <ul class="text-em-lg space-y-3 text-gray-700">
      <li>こうなるはず</li>
      <li>理想的な動作</li>
    </ul>
  </div>
  <div class="bg-gray-100 rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
    <h1 class="text-em-2xl font-bold mb-4 text-gray-800">現実</h1>
    <ul class="text-em-lg space-y-3 text-gray-700">
      <li>実際にはこうなる</li>
      <li>想定外の動作</li>
    </ul>
  </div>
</div>
```

### B-3. 3カラム等幅

```html
# 3つの選択肢

<div class="grid grid-cols-3 gap-4 mt-6 text-base">
  <div class="bg-gray-50 rounded-lg shadow p-4">
    <h2 class="text-em-xl font-bold text-gray-800 mb-3">オプションA</h2>
    <p class="text-em-lg text-gray-700">説明テキスト</p>
  </div>
  <div class="bg-gray-50 rounded-lg shadow p-4">
    <h2 class="text-em-xl font-bold text-gray-800 mb-3">オプションB</h2>
    <p class="text-em-lg text-gray-700">説明テキスト</p>
  </div>
  <div class="bg-gray-50 rounded-lg shadow p-4">
    <h2 class="text-em-xl font-bold text-gray-800 mb-3">オプションC</h2>
    <p class="text-em-lg text-gray-700">説明テキスト</p>
  </div>
</div>
```

### B-4. 3カラム（中央強調）

```html
# おすすめプラン

<div class="grid grid-cols-3 gap-4 mt-6 text-base">
  <div class="bg-gray-50 rounded-lg shadow p-4">
    <h2 class="text-em-xl font-bold text-gray-700 mb-3">Basic</h2>
    <p class="text-em-lg text-gray-600">基本機能</p>
  </div>
  <div class="rounded-lg shadow-lg p-4 text-white" style="background: linear-gradient(135deg, #1B4565 0%, #3E9BA4 100%);">
    <h2 class="text-em-xl font-bold mb-3">Pro（推奨）</h2>
    <p class="text-em-lg">全機能利用可能</p>
  </div>
  <div class="bg-gray-50 rounded-lg shadow p-4">
    <h2 class="text-em-xl font-bold text-gray-700 mb-3">Enterprise</h2>
    <p class="text-em-lg text-gray-600">カスタマイズ対応</p>
  </div>
</div>
```

### B-5. 4カラム

```html
# 4つのステップ

<div class="grid grid-cols-4 gap-3 mt-6 text-base">
  <div class="bg-gray-50 rounded-lg p-3 text-center">
    <p class="text-em-2xl font-bold text-gray-600">1</p>
    <p class="text-em-base mt-2 text-gray-700">計画</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-3 text-center">
    <p class="text-em-2xl font-bold text-gray-600">2</p>
    <p class="text-em-base mt-2 text-gray-700">設計</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-3 text-center">
    <p class="text-em-2xl font-bold text-gray-600">3</p>
    <p class="text-em-base mt-2 text-gray-700">実装</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-3 text-center">
    <p class="text-em-2xl font-bold text-gray-600">4</p>
    <p class="text-em-base mt-2 text-gray-700">検証</p>
  </div>
</div>
```

### B-6. 5カラム（成熟度レベル）

```html
# 成熟度モデル

<div class="grid grid-cols-5 gap-2 mt-6 text-base">
  <div class="bg-gray-100 rounded p-2 text-center">
    <p class="text-em-xl font-bold text-gray-600">L1</p>
    <p class="text-em-base text-gray-700">初期</p>
  </div>
  <div class="bg-gray-100 rounded p-2 text-center">
    <p class="text-em-xl font-bold text-gray-600">L2</p>
    <p class="text-em-base text-gray-700">管理</p>
  </div>
  <div class="bg-gray-100 rounded p-2 text-center">
    <p class="text-em-xl font-bold text-gray-600">L3</p>
    <p class="text-em-base text-gray-700">定義</p>
  </div>
  <div class="bg-gray-100 rounded p-2 text-center">
    <p class="text-em-xl font-bold text-gray-600">L4</p>
    <p class="text-em-base text-gray-700">測定</p>
  </div>
  <div class="rounded p-2 text-center text-white" style="background:#1B4565;">
    <p class="text-em-xl font-bold">L5</p>
    <p class="text-em-base">最適化</p>
  </div>
</div>
```

### B-7. 2×2グリッド

```html
# 4象限分析

<div class="grid grid-cols-2 gap-4 mt-6 text-base">
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">高優先度 / 低労力</h3>
    <p class="text-em-base text-gray-600 mt-2">すぐに実行</p>
  </div>
  <div class="bg-gray-100 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">高優先度 / 高労力</h3>
    <p class="text-em-base text-gray-600 mt-2">計画的に実行</p>
  </div>
  <div class="bg-gray-100 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">低優先度 / 低労力</h3>
    <p class="text-em-base text-gray-600 mt-2">空き時間に</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">低優先度 / 高労力</h3>
    <p class="text-em-base text-gray-600 mt-2">見送り</p>
  </div>
</div>
```

### B-8. 2×3グリッド

```html
# 6つの機能

<div class="grid grid-cols-3 gap-4 mt-6 text-base">
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">機能1</h3>
    <p class="text-em-base text-gray-600 mt-2">説明</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">機能2</h3>
    <p class="text-em-base text-gray-600 mt-2">説明</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">機能3</h3>
    <p class="text-em-base text-gray-600 mt-2">説明</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">機能4</h3>
    <p class="text-em-base text-gray-600 mt-2">説明</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">機能5</h3>
    <p class="text-em-base text-gray-600 mt-2">説明</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="text-em-lg font-bold text-gray-800">機能6</h3>
    <p class="text-em-base text-gray-600 mt-2">説明</p>
  </div>
</div>
```

---

## C. 縦リスト（4種）

### C-1. ステップリスト

```html
# 導入手順

<div class="space-y-4 mt-6">
  <div class="flex items-start gap-4">
    <div class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-em-xl font-bold text-gray-600">1</div>
    <div>
      <h3 class="text-em-xl font-bold text-gray-800">環境構築</h3>
      <p class="text-em-lg text-gray-600">Node.js 18以上をインストール</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-em-xl font-bold text-gray-600">2</div>
    <div>
      <h3 class="text-em-xl font-bold text-gray-800">初期設定</h3>
      <p class="text-em-lg text-gray-600">設定ファイルを編集</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-em-xl font-bold text-gray-600">3</div>
    <div>
      <h3 class="text-em-xl font-bold text-gray-800">起動</h3>
      <p class="text-em-lg text-gray-600">npm run dev で開発サーバー起動</p>
    </div>
  </div>
</div>
```

### C-2. タイムライン

```html
# プロジェクト経緯

<div class="space-y-4 mt-6">
  <div class="flex items-start gap-4">
    <div class="text-em-lg font-bold text-gray-600 w-24">2024.01</div>
    <div class="border-l-2 border-gray-300 pl-4">
      <h3 class="text-em-lg font-bold text-gray-800">プロジェクト開始</h3>
      <p class="text-em-base text-gray-600">要件定義フェーズ</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="text-em-lg font-bold text-gray-600 w-24">2024.06</div>
    <div class="border-l-2 border-gray-300 pl-4">
      <h3 class="text-em-lg font-bold text-gray-800">MVP完成</h3>
      <p class="text-em-base text-gray-600">基本機能の実装完了</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="text-em-lg font-bold w-24" style="color:#1B4565;">2025.01</div>
    <div class="border-l-2 pl-4" style="border-color:#3E9BA4;">
      <h3 class="text-em-lg font-bold text-gray-800">正式リリース</h3>
      <p class="text-em-base text-gray-600">一般公開</p>
    </div>
  </div>
</div>
```

### C-3. チェックリスト

```html
# 確認事項

<div class="bg-gray-50 rounded-xl p-6 mt-6">
  <ul class="space-y-3">
    <li class="flex items-center gap-3 text-em-lg text-gray-700">
      <span class="text-em-xl">✅</span> 環境変数の設定
    </li>
    <li class="flex items-center gap-3 text-em-lg text-gray-700">
      <span class="text-em-xl">✅</span> データベース接続確認
    </li>
    <li class="flex items-center gap-3 text-em-lg text-gray-700">
      <span class="text-em-xl">⬜</span> テスト実行
    </li>
    <li class="flex items-center gap-3 text-em-lg text-gray-700">
      <span class="text-em-xl">⬜</span> デプロイ準備
    </li>
  </ul>
</div>
```

### C-4. アイコン付きリスト

```markdown
# 主な特徴

- **高速** - 従来比3倍のパフォーマンス
- **安全** - 型安全な設計
- **簡単** - 直感的なAPI
- **柔軟** - カスタマイズ可能
```

---

## D. パネルデザイン（5種）

### D-1. 基本パネル

```html
<div class="bg-gray-50 rounded-xl shadow-lg p-6">
  <h2 class="text-em-2xl font-bold mb-4 text-gray-800">タイトル</h2>
  <p class="text-em-lg text-gray-700">説明テキスト</p>
</div>
```

### D-2. 強調パネル（左ボーダー）

```html
<div class="bg-gray-50 rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
  <h2 class="text-em-2xl font-bold mb-4 text-gray-800">重要なポイント</h2>
  <p class="text-em-lg text-gray-700">この点に注意してください</p>
</div>
```

### D-3. アクセントボーダーパネル

```html
<div class="bg-gray-50 rounded-xl shadow-lg p-6 border-l-4" style="border-color:#3E9BA4;">
  <h2 class="text-em-2xl font-bold mb-4 text-gray-800">ベストプラクティス</h2>
  <p class="text-em-lg text-gray-700">推奨される方法</p>
</div>
```

### D-4. グラデーション背景パネル

```html
<div class="rounded-xl shadow-lg p-6 text-white" style="background: linear-gradient(135deg, #1B4565 0%, #3E9BA4 100%);">
  <h2 class="text-em-2xl font-bold mb-4">ハイライト</h2>
  <p class="text-em-lg">最も重要な情報</p>
</div>
```

### D-5. 情報/警告パネル

```html
<!-- 情報パネル -->
<div class="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-500">
  <p class="text-em-lg text-gray-700">
    <span class="font-bold">Note</span> 補足情報をここに記載
  </p>
</div>

<!-- 警告パネル -->
<div class="bg-gray-100 rounded-lg p-4 border-l-4" style="border-color:#1B4565;">
  <p class="text-em-lg text-gray-700">
    <span class="font-bold">Warning</span> 注意事項をここに記載
  </p>
</div>
```

---

## E. 背景/画像（4種）

### E-1. フルスクリーン背景

```markdown
<!--
_backgroundImage: url('images/hero.jpg')
_backgroundSize: cover
_color: #fff
-->

<div style="background: rgba(27, 69, 101, 0.7); padding: 40px; border-radius: 16px;">

# タイトル

説明テキスト

</div>
```

### E-2. 右寄せ画像

```html
# 製品紹介

<div class="grid grid-cols-2 gap-6 mt-6">
  <div>
    <p class="text-em-lg text-gray-700 space-y-3">
      製品の説明文をここに記載します。
      特徴や利点について詳しく説明。
    </p>
  </div>
  <div>
    <img src="images/product.png" class="rounded-lg shadow-lg" />
  </div>
</div>
```

### E-3. 引用形式

```html
# 顧客の声

<div class="bg-gray-50 rounded-xl p-8 mt-6">
  <p class="text-em-xl text-gray-700 italic">
    「このツールのおかげで作業効率が大幅に向上しました。
    チーム全員が満足しています。」
  </p>
  <p class="text-em-lg text-gray-600 mt-4 text-right">
    — 田中太郎, 株式会社Example CTO
  </p>
</div>
```

### E-4. コード + 結果表示

```html
# 実行例

<div class="grid grid-cols-2 gap-4 mt-6">
  <div>
    <p class="text-em-base text-gray-600 mb-2">コード</p>
    <pre class="bg-gray-800 text-white p-4 rounded-lg text-em-base">
console.log("Hello")
    </pre>
  </div>
  <div>
    <p class="text-em-base text-gray-600 mb-2">出力</p>
    <div class="bg-gray-100 p-4 rounded-lg text-em-base font-mono">
Hello
    </div>
  </div>
</div>
```

---

## F. 強調/特殊（3種）

### F-1. 統計表示

```html
# 成果

<div class="grid grid-cols-3 gap-4 mt-6 text-base">
  <div class="bg-gray-100 rounded-lg shadow p-4 text-center">
    <p class="text-em-3xl font-bold text-gray-600">35万</p>
    <p class="text-em-lg mt-2 text-gray-700">総文字数</p>
  </div>
  <div class="rounded-lg shadow p-4 text-center" style="background: linear-gradient(135deg, #1B4565 0%, #3E9BA4 100%);">
    <p class="text-em-3xl font-bold text-white">774件</p>
    <p class="text-em-lg mt-2 text-white">Issue対応</p>
  </div>
  <div class="bg-gray-100 rounded-lg shadow p-4 text-center">
    <p class="text-em-3xl font-bold text-gray-600">50%</p>
    <p class="text-em-lg mt-2 text-gray-700">効率向上</p>
  </div>
</div>
```

### F-2. 中央配置（キーメッセージ）

```markdown
<!-- _class: lead -->

<div class="text-center">
  <p class="text-em-3xl font-bold text-gray-800">
    シンプルさが最大の武器
  </p>
  <p class="text-em-xl text-gray-600 mt-6">
    複雑さを排除し、本質に集中する
  </p>
</div>
```

### F-3. Q&A形式

```html
# よくある質問

<div class="space-y-6 mt-6">
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-em-lg font-bold text-gray-800">Q. 導入にどれくらい時間がかかりますか</p>
    <p class="text-em-lg text-gray-700 mt-2">A. 基本的な導入は30分程度で完了します。</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-em-lg font-bold text-gray-800">Q. サポートはありますか</p>
    <p class="text-em-lg text-gray-700 mt-2">A. メール・チャットでのサポートを提供しています。</p>
  </div>
</div>
```

---

## G. 応用パターン（10種）

### G-1. QRコード付き

```html
# リソース

<div class="grid grid-cols-2 gap-6 mt-6 items-center">
  <div>
    <ul class="text-em-lg space-y-3 text-gray-700">
      <li>ドキュメント</li>
      <li>サンプルコード</li>
      <li>コミュニティ</li>
    </ul>
  </div>
  <div class="text-center">
    <img src="images/qr-code.png" class="w-40 mx-auto" />
    <p class="text-em-base text-gray-600 mt-2">example.com/docs</p>
  </div>
</div>
```

### G-2. 問いかけスライド

```markdown
<!-- _class: lead -->

<div class="text-center">
  <p class="text-em-2xl text-gray-600">考えてみてください</p>
  <p class="text-em-3xl font-bold text-gray-800 mt-4">
    あなたのチームは本当に効率的ですか
  </p>
</div>
```

### G-3. 3点サマリー

```html
# 本日のまとめ

<div class="grid grid-cols-3 gap-6 mt-6">
  <div class="text-center">
    <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
      <span class="text-em-2xl font-bold text-gray-600">1</span>
    </div>
    <p class="text-em-lg font-bold text-gray-800 mt-4">シンプルに保つ</p>
    <p class="text-em-base text-gray-600 mt-2">複雑さは敵</p>
  </div>
  <div class="text-center">
    <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
      <span class="text-em-2xl font-bold text-gray-600">2</span>
    </div>
    <p class="text-em-lg font-bold text-gray-800 mt-4">一貫性を保つ</p>
    <p class="text-em-base text-gray-600 mt-2">パターンを繰り返す</p>
  </div>
  <div class="text-center">
    <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
      <span class="text-em-2xl font-bold text-gray-600">3</span>
    </div>
    <p class="text-em-lg font-bold text-gray-800 mt-4">検証を忘れない</p>
    <p class="text-em-base text-gray-600 mt-2">レビューと改善</p>
  </div>
</div>
```

### G-4. 企業事例

```html
# 導入事例

<div class="bg-gray-50 rounded-xl p-6 mt-6">
  <div class="flex items-center gap-4 mb-4">
    <img src="images/company-logo.png" class="w-16 h-16 rounded" />
    <div>
      <p class="text-em-xl font-bold text-gray-800">株式会社Example</p>
      <p class="text-em-base text-gray-600">従業員500名 / IT業界</p>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-4 mt-4">
    <div class="text-center">
      <p class="text-em-2xl font-bold" style="color:#1B4565;">50%</p>
      <p class="text-em-base text-gray-600">工数削減</p>
    </div>
    <div class="text-center">
      <p class="text-em-2xl font-bold" style="color:#1B4565;">3ヶ月</p>
      <p class="text-em-base text-gray-600">導入期間</p>
    </div>
    <div class="text-center">
      <p class="text-em-2xl font-bold" style="color:#1B4565;">200%</p>
      <p class="text-em-base text-gray-600">ROI</p>
    </div>
  </div>
</div>
```

### G-5. プロセスフロー

```html
# ワークフロー

<div class="flex items-center justify-between mt-8">
  <div class="text-center">
    <div class="bg-gray-100 rounded-lg p-4">
      <p class="text-em-lg font-bold text-gray-800">入力</p>
    </div>
  </div>
  <div class="text-em-2xl text-gray-400">→</div>
  <div class="text-center">
    <div class="bg-gray-100 rounded-lg p-4">
      <p class="text-em-lg font-bold text-gray-800">処理</p>
    </div>
  </div>
  <div class="text-em-2xl text-gray-400">→</div>
  <div class="text-center">
    <div class="rounded-lg p-4" style="background:#1B4565;">
      <p class="text-em-lg font-bold text-white">出力</p>
    </div>
  </div>
</div>
```

### G-6. 機能比較表

```markdown
# 機能比較

| 機能 | Basic | Pro | Enterprise |
|------|:-----:|:---:|:----------:|
| 基本機能 | ✅ | ✅ | ✅ |
| API連携 | - | ✅ | ✅ |
| カスタマイズ | - | - | ✅ |
| サポート | メール | チャット | 専任 |
```

### G-7. アーキテクチャ図（テキスト）

```html
# システム構成

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="bg-gray-50 rounded-lg p-4 text-center">
    <p class="text-em-lg font-bold text-gray-800">Frontend</p>
    <p class="text-em-base text-gray-600">Next.js</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 text-center">
    <p class="text-em-lg font-bold text-gray-800">Backend</p>
    <p class="text-em-base text-gray-600">Node.js</p>
  </div>
  <div class="bg-gray-50 rounded-lg p-4 text-center">
    <p class="text-em-lg font-bold text-gray-800">Database</p>
    <p class="text-em-base text-gray-600">PostgreSQL</p>
  </div>
</div>

<div class="text-center mt-4 text-em-xl text-gray-400">
  ↑ REST API ↑
</div>

<div class="bg-gray-100 rounded-lg p-4 text-center mt-4">
  <p class="text-em-lg font-bold text-gray-800">Infrastructure</p>
  <p class="text-em-base text-gray-600">AWS / Docker / Kubernetes</p>
</div>
```

### G-8. CTAスライド

```html
<!--
_backgroundImage: "linear-gradient(to right, #1B4565, #3E9BA4)"
_color: #fff
-->

# 今すぐ始めましょう

<div class="mt-8">
  <p class="text-em-xl">無料トライアルを開始</p>
  <p class="text-em-2xl font-bold mt-4">example.com/trial</p>
</div>
```

### G-9. コード解説

```html
# 実装のポイント

<div class="grid grid-cols-2 gap-6 mt-6">
  <div>
    <pre class="bg-gray-800 text-white p-4 rounded-lg text-em-base">
const result = await fetch(url)
const data = await result.json()
return data
    </pre>
  </div>
  <div class="bg-gray-50 rounded-lg p-4">
    <ul class="text-em-lg space-y-3 text-gray-700">
      <li>async/awaitで非同期処理</li>
      <li>JSONパース</li>
      <li>エラーハンドリングは省略</li>
    </ul>
  </div>
</div>
```

### G-10. 次のステップ

```html
# Next Steps

<div class="space-y-4 mt-6">
  <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
    <div class="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-em-lg font-bold text-gray-600">1</div>
    <p class="text-em-lg text-gray-700">ドキュメントを確認</p>
  </div>
  <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
    <div class="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-em-lg font-bold text-gray-600">2</div>
    <p class="text-em-lg text-gray-700">サンプルプロジェクトを試す</p>
  </div>
  <div class="flex items-center gap-4 bg-gray-100 rounded-lg p-4" style="border-left:4px solid #3E9BA4;">
    <div class="rounded-full w-10 h-10 flex items-center justify-center text-em-lg font-bold text-white" style="background:#1B4565;">3</div>
    <p class="text-em-lg text-gray-800 font-bold">本番導入を検討</p>
  </div>
</div>
```

---

## パターン選択ガイド

### 用途別推奨パターン

| 用途 | 推奨パターン |
|------|-------------|
| 導入スライド | A-1 タイトル, A-4 アジェンダ |
| 比較説明 | B-1 Before/After, B-2 対比 |
| 機能紹介 | B-3 3カラム, G-6 比較表 |
| 手順説明 | C-1 ステップ, B-5 4カラム |
| 成果発表 | F-1 統計表示, G-4 事例 |
| まとめ | A-3 サマリー, G-3 3点まとめ |
| 締めくくり | A-5 クロージング, G-8 CTA |

### コンテンツ量による選択

| コンテンツ量 | 推奨パターン |
|-------------|-------------|
| 少ない（1-2項目） | D-1 基本パネル, F-2 中央配置 |
| 中程度（3-4項目） | B-3 3カラム, C-1 ステップ |
| 多い（5-6項目） | B-8 2×3グリッド, C-4 リスト |

---

## 関連ファイル

- `skills/slide/references/style-guide.md` - スタイルガイド（カラー、禁止事項）
- `skills/slide/references/visual-hierarchy.md` - ビジュアル階層
- `skills/slide/references/marp-syntax.md` - Marp構文

---

*このパターン集は [hirokidaichi氏の記事](https://qiita.com/hirokidaichi/items/243bd176b84900f4cc0d) を参考に作成されました。*
