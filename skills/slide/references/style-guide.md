# スライドスタイルガイド

このドキュメントは、Marpスライド生成における**デザインシステムと禁止事項**を定義します。一貫性のあるプロフェッショナルなスライドを作成するための必須ルールです。

---

## 目次

1. [デザイン哲学](#デザイン哲学)
2. [カラーパレット](#カラーパレット)
3. [タイポグラフィシステム](#タイポグラフィシステム)
4. [Tailwind CSS統合](#tailwind-css統合)
5. [禁止事項](#禁止事項)
6. [パネルデザイン](#パネルデザイン)
7. [グラデーション背景](#グラデーション背景)

---

## デザイン哲学

### 4つの原則

1. **シンプルさ**: 余計な装飾を排除し、メッセージを明確に
2. **一貫性**: パターンの繰り返しで理解しやすく
3. **可読性**: 十分なコントラストと適切なフォントサイズ
4. **制限されたカラー**: グレースケール基調 + 限定的なアクセントカラー

### AIスライド生成の原則

> 「AIに丸投げ」ではなく「人間が設計した仕組みの中でAIが動く」

- テンプレートとパターンを参照して生成
- 毎回微妙に違うHTMLを生成しない
- スタイルガイドに厳密に準拠

---

## カラーパレット

### メインカラー（グレースケール基調）

| 用途 | Tailwindクラス | カラーコード | 説明 |
|------|---------------|-------------|------|
| パネル背景（明） | `bg-gray-50` | `#f9fafb` | 軽いパネル背景 |
| パネル背景（中） | `bg-gray-100` | `#f3f4f6` | やや濃いパネル背景 |
| 補助テキスト | `text-gray-600` | `#4b5563` | セカンダリテキスト |
| 見出しテキスト | `text-gray-700` | `#374151` | サブ見出し |
| メインテキスト | `text-gray-800` | `#1f2937` | 本文、主要見出し |

### アクセントカラー（限定使用）

| 用途 | カラーコード | 説明 |
|------|-------------|------|
| **ネイビー** | `#1B4565` | プライマリアクセント、セクション背景 |
| **ティール** | `#3E9BA4` | セカンダリアクセント、グラデーション |

### アクセントカラーの使用ルール

```
⚠️ 重要: 1スライドにつきアクセントカラーは1-2色まで

✅ Good: グレースケール + ネイビー1色
✅ Good: グレースケール + ネイビー + ティール（グラデーション）
❌ Bad: 赤、緑、青、黄色を多用
```

### 使用禁止カラー

以下のカラーは**使用禁止**です：

| 禁止カラー | 理由 |
|-----------|------|
| `red-600` / `#dc2626` | 派手すぎる、警告以外で使用不可 |
| `green-600` / `#16a34a` | 派手すぎる |
| `blue-600` / `#2563eb` | アクセントカラーと競合 |
| `yellow-500` / `#eab308` | 視認性が低い |

**代替案**:
- 強調したい場合 → `gray-600` / `gray-700` + **太字**
- 成功/完了を示す場合 → ティール `#3E9BA4`
- 警告を示す場合 → テキストで明示 + アイコン

---

## タイポグラフィシステム

### フォントサイズクラス

| クラス | 用途 | サイズ目安 |
|--------|------|-----------|
| `text-em-3xl` | 数値強調、インパクトキーワード | 48-56px |
| `text-em-2xl` | パネル見出し、セクションタイトル | 36-40px |
| `text-em-xl` | サブ見出し | 28-32px |
| `text-em-lg` | 本文、リスト項目 | 22-24px |
| `text-em-base` | 補足説明、キャプション | 18-20px |

### 使用例

```html
<!-- 数値強調 -->
<p class="text-em-3xl font-bold text-gray-600">35万文字</p>

<!-- パネル見出し -->
<h1 class="text-em-2xl font-bold mb-4 text-gray-800">セクション名</h1>

<!-- 本文 -->
<ul class="text-em-lg space-y-3 text-gray-700">
  <li>項目1</li>
  <li>項目2</li>
</ul>

<!-- 補足 -->
<p class="text-em-base text-gray-600">補足説明テキスト</p>
```

---

## Tailwind CSS統合

### 設定方法

フロントマターまたはHTMLで読み込み：

```html
<script src="theme/js/tailwindcss-3.0.16.js"></script>
<script src="theme/js/tailwind.config.js"></script>
```

### tailwind.config.js の設定

```javascript
// 重要: preflight: false でMarpのデフォルトスタイルを保持
module.exports = {
  corePlugins: {
    preflight: false  // Marpのスタイルを上書きしない
  },
  theme: {
    extend: {
      colors: {
        'primary': '#1B4565',
        'secondary': '#3E9BA4',
      }
    }
  }
}
```

### なぜTailwind CSS を使うか

1. **グリッドレイアウト**: `grid grid-cols-2 gap-6` で簡単に2カラム
2. **パネルデザイン**: `rounded-xl shadow-lg p-6` で美しいパネル
3. **一貫したスペーシング**: `space-y-3`, `mt-6`, `mb-4` で統一
4. **レスポンシブ**: 複雑なCSSを書かずに柔軟なレイアウト

---

## 禁止事項

### 1. タイトルにコロンを使わない

```markdown
❌ Bad: 原則: 自律性
✅ Good: 原則 自律性

❌ Bad: ステップ1: 環境構築
✅ Good: ステップ1 環境構築
```

### 2. 感嘆符を使わない

```markdown
❌ Bad: 素晴らしい結果が出ました!
✅ Good: 素晴らしい結果が出ました

❌ Bad: 注意してください!
✅ Good: 注意してください
```

### 3. 疑問符をスライド本文に使わない

```markdown
❌ Bad: なぜTypeScriptを使うのか?
✅ Good: なぜTypeScriptを使うのか

❌ Bad: どうすればいい?
✅ Good: 解決方法
```

**例外**: Q&Aスライドでの質問表示は許可

### 4. 装飾的な絵文字を使わない

```markdown
❌ Bad: TypeScript入門 ✨🎉🚀💯
✅ Good: TypeScript入門

❌ Bad: まとめ 📝✨
✅ Good: まとめ
```

**許可される絵文字の使用**:
- 状態を示すアイコン（✅ ❌ ⚠️）リスト内で使用
- セクション区切りの単一絵文字（控えめに）

### 5. 派手な色を使わない

```markdown
❌ Bad: <span class="text-red-600">重要</span>
✅ Good: <span class="font-bold text-gray-800">重要</span>

❌ Bad: <div class="bg-green-500">成功</div>
✅ Good: <div class="bg-gray-100 border-l-4 border-primary">成功</div>
```

### 6. 過度な装飾を避ける

```markdown
❌ Bad:
- 🎯 目標1 ✨
- 🎯 目標2 ✨
- 🎯 目標3 ✨

✅ Good:
- 目標1
- 目標2
- 目標3
```

---

## パネルデザイン

### 基本パネル

```html
<div class="bg-gray-50 rounded-xl shadow-lg p-6">
  <h1 class="text-em-2xl font-bold mb-4 text-gray-800">タイトル</h1>
  <ul class="text-em-lg space-y-3 text-gray-700">
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</div>
```

### 左ボーダー付きパネル

```html
<div class="bg-gray-50 rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
  <h1 class="text-em-2xl font-bold mb-4 text-gray-800">期待</h1>
  <p class="text-em-lg text-gray-700">内容</p>
</div>
```

### アクセントカラーパネル

```html
<div class="rounded-lg shadow p-4 text-center"
     style="background: linear-gradient(135deg, #1B4565 0%, #3E9BA4 100%);">
  <p class="text-em-3xl font-bold text-white">774件</p>
  <p class="text-em-lg mt-2 text-white">GitHub Issue</p>
</div>
```

---

## グラデーション背景

### セクション区切りスライド

```markdown
<!--
_backgroundImage: "linear-gradient(to right, #1B4565, #3E9BA4)"
_color: #fff
-->

# セクションタイトル
```

### 斜めグラデーション

```html
<div style="background: linear-gradient(135deg, #1B4565 0%, #3E9BA4 100%);">
  <!-- コンテンツ -->
</div>
```

### グラデーションの使用ルール

```
✅ セクション区切りスライドの背景
✅ 統計表示パネルの強調
✅ CTAスライドの背景

❌ 通常のコンテンツスライド全体
❌ 複数のグラデーションを1スライドに
```

---

## チェックリスト

スライド生成後、以下を確認してください：

### カラー
- [ ] アクセントカラーは1スライド1-2色まで
- [ ] 禁止カラー（red-600等）を使用していない
- [ ] グレースケール基調になっている

### テキスト
- [ ] タイトルにコロンがない
- [ ] 感嘆符・疑問符がない
- [ ] 装飾的な絵文字がない

### レイアウト
- [ ] Tailwindクラスを適切に使用
- [ ] パネルデザインが統一されている
- [ ] スペーシングが一貫している

---

## 関連ファイル

- `skills/slide/references/layout-patterns.md` - 40種類のレイアウトパターン
- `skills/slide/references/visual-hierarchy.md` - ビジュアル階層
- `skills/slide/references/marp-syntax.md` - Marp構文
- `skills/slide/references/emoji-usage.md` - 絵文字使用ガイド

---

*このスタイルガイドは [hirokidaichi氏の記事](https://qiita.com/hirokidaichi/items/243bd176b84900f4cc0d) を参考に作成されました。*
