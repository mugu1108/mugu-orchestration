# Marp構文リファレンス

このドキュメントは、**Marp Markdownの正確な構文とベストプラクティス**を記載したリファレンスです。Marpは、Markdownからプレゼンテーションスライドを生成するツールで、独自の構文とディレクティブを持っています。

## 目次

1. [フロントマター](#フロントマター)
2. [スライド区切り](#スライド区切り)
3. [レイアウト指定](#レイアウト指定)
4. [テキスト装飾](#テキスト装飾)
5. [リスト](#リスト)
6. [コードブロック](#コードブロック)
7. [画像](#画像)
8. [テーブル](#テーブル)
9. [カスタムスタイル](#カスタムスタイル)
10. [ページ番号とヘッダー/フッター](#ページ番号とヘッダーフッター)

---

## フロントマター

すべてのMarpマークダウンファイルは、フロントマターから始まります。フロントマターは、スライド全体の設定を定義します。

### 基本構造

```yaml
---
marp: true
theme: default
paginate: true
header: 'ヘッダーテキスト'
footer: 'フッターテキスト'
---
```

### 必須項目

| 項目 | 説明 | 例 |
|------|------|-----|
| `marp` | Marpを有効化（必須） | `true` |

### オプション項目

| 項目 | 説明 | デフォルト | 例 |
|------|------|----------|-----|
| `theme` | テーマ名 | `default` | `default`, `gaia`, `uncover` |
| `paginate` | ページ番号を表示 | `false` | `true` |
| `header` | ヘッダーテキスト | なし | `'セミナータイトル'` |
| `footer` | フッターテキスト | なし | `'© 2026 あなたの名前'` |
| `size` | スライドサイズ | `16:9` | `16:9`, `4:3` |
| `backgroundColor` | 背景色 | `#ffffff` | `#f0f0f0` |
| `color` | テキスト色 | `#000000` | `#333333` |

### カスタムスタイルの追加

```yaml
---
marp: true
theme: default
style: |
  section {
    background-color: #ffffff;
    font-family: 'Hiragino Sans', sans-serif;
  }
  h1 {
    font-size: 48px;
    color: #1a202c;
  }
---
```

### 完全な例

```yaml
---
marp: true
theme: default
paginate: true
header: 'TypeScript入門'
footer: '© 2026 山田太郎'
size: 16:9
style: |
  section {
    font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif;
    background-color: #ffffff;
    padding: 60px;
  }
  h1 {
    font-size: 48px;
    color: #1a202c;
    font-weight: bold;
  }
  h2 {
    font-size: 36px;
    color: #2d3748;
  }
---
```

---

## スライド区切り

Marpでは、`---`（3つのハイフン）を使用してスライドを区切ります。

### 基本構文

```markdown
---
marp: true
---

# スライド1

これは最初のスライドです。

---

# スライド2

これは2番目のスライドです。

---

# スライド3

これは3番目のスライドです。
```

### 注意点

- `---`の前後に空行が必要です
- フロントマターの`---`とスライド区切りの`---`は異なります
- 最初のスライドはフロントマターの直後から始まります

### 正しい例

```markdown
---
marp: true
---

# タイトルスライド

---

# 次のスライド
```

### 間違った例

```markdown
---
marp: true
---
# タイトルスライド（空行がない）
---
# 次のスライド（空行がない）
```

---

## レイアウト指定

Marpでは、HTMLコメントを使用してスライドごとのレイアウトを指定できます。

### 基本構文

```markdown
<!-- _class: クラス名 -->
```

### 利用可能なクラス

| クラス | 説明 | 用途 |
|--------|------|------|
| `lead` | 中央揃え、大きなテキスト | タイトルスライド、セクション区切り |
| `invert` | 反転（暗い背景に明るいテキスト） | 強調したいスライド |

### 例: タイトルスライド

```markdown
<!-- _class: lead -->

# TypeScript入門

## 型安全なJavaScript

**山田太郎**
2026年1月27日
```

### 例: セクション区切り

```markdown
<!-- _class: lead -->

# 1. イントロダクション
```

### 例: 反転スライド

```markdown
<!-- _class: invert -->

# 重要なお知らせ

この機能は非推奨になりました。
```

### 複数クラスの指定

```markdown
<!-- _class: lead invert -->

# タイトル
```

### ページ固有の設定

```markdown
<!-- _paginate: false -->

# このスライドだけページ番号を非表示
```

```markdown
<!-- _header: "カスタムヘッダー" -->
<!-- _footer: "カスタムフッター" -->

# このスライド専用のヘッダー/フッター
```

---

## テキスト装飾

### 見出し

```markdown
# h1: 最も大きな見出し
## h2: 次に大きな見出し
### h3: 小見出し
#### h4: さらに小さな見出し
##### h5: より小さな見出し
###### h6: 最も小さな見出し
```

**推奨**: h1〜h3のみ使用（visual-hierarchy.mdに準拠）

### 強調

```markdown
**太字（bold）**
*斜体（italic）*
***太字斜体***
~~取り消し線~~
`インラインコード`
```

### リンク

```markdown
[リンクテキスト](https://example.com)
[リンクテキスト](https://example.com "タイトル")
<https://example.com>
```

### 引用

```markdown
> これは引用です。
> 複数行にわたる引用も可能です。
```

### 水平線

```markdown
---
***
___
```

**注意**: スライド区切りの`---`と区別するため、前後に空行を入れる

---

## リスト

### 箇条書きリスト

```markdown
- 項目1
- 項目2
- 項目3
  - ネストした項目
  - ネストした項目
```

または

```markdown
* 項目1
* 項目2
* 項目3
```

### 番号付きリスト

```markdown
1. 項目1
2. 項目2
3. 項目3
   1. ネストした項目
   2. ネストした項目
```

### チェックリスト

```markdown
- [ ] 未完了のタスク
- [x] 完了したタスク
- [ ] 別の未完了タスク
```

### 混合リスト

```markdown
1. 最初の項目
   - サブ項目A
   - サブ項目B
2. 2番目の項目
   - サブ項目C
   - サブ項目D
```

---

## コードブロック

⚠️ **重要: コードブロックの行数制限**

スライドからコードがはみ出すことを防ぐため、以下の制限を厳守してください：

| パターン | コード行数上限 |
|---------|--------------|
| コードブロックのみ | **8行以内** |
| コード + 説明テキスト | **6行以内** + テキスト2-3行 |
| 複数コードブロック | **合計8行以内** |

**9行以上のコードは必ず分割**してください。

### 基本構文

````markdown
```
コードブロック（言語指定なし）
```
````

### 言語指定

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

````markdown
```typescript
interface User {
  name: string;
  age: number;
}
```
````

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### シンタックスハイライト対応言語

- JavaScript (`javascript`, `js`)
- TypeScript (`typescript`, `ts`)
- Python (`python`, `py`)
- Bash (`bash`, `sh`)
- JSON (`json`)
- YAML (`yaml`, `yml`)
- HTML (`html`)
- CSS (`css`)
- Markdown (`markdown`, `md`)
- その他多数

### インラインコード

```markdown
この`function`は重要です。
```

### コードブロックのスタイル

フロントマターで定義：

```yaml
style: |
  pre {
    background-color: #2d3748;
    color: #ffffff;  /* 白色でくっきり見える */
    padding: 16px;
    border-radius: 8px;
    font-size: 20px;
  }
  pre code {
    font-size: 20px;
    line-height: 1.5;
    color: #ffffff;  /* 白色 */
  }
```

### コード分割の例

❌ **悪い例**: 15行のコードを1スライドに詰め込む

````markdown
# 実装例

```typescript
import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }])
  }
  return <div>...</div>
}
```
````

✅ **良い例**: 3スライドに分割

````markdown
# 実装例（1/3）: 型定義

```typescript
import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}
```

---

# 実装例（2/3）: State設定

```typescript
function App() {
  const [todos, setTodos] = useState<Todo[]>([])
```

---

# 実装例（3/3）: 操作関数

```typescript
  const addTodo = (text: string) => {
    setTodos([...todos, {
      id: Date.now(),
      text,
      completed: false
    }])
  }
```
````

---

## 画像

### 基本構文

```markdown
![代替テキスト](画像のパス)
![代替テキスト](画像のパス "タイトル")
```

### ローカル画像

```markdown
![ロゴ](./images/logo.png)
![スクリーンショット](../assets/screenshot.png)
```

### オンライン画像

```markdown
![画像](https://example.com/image.png)
```

### 画像のサイズ指定

#### 幅指定

```markdown
![画像](image.png)
<!-- width: 50% -->
```

または

```markdown
<img src="image.png" width="50%">
```

#### 高さ指定

```markdown
![画像](image.png)
<!-- height: 300px -->
```

#### 幅と高さの両方

```markdown
<img src="image.png" width="600" height="400">
```

### 画像の配置

#### 中央揃え

```markdown
<div style="text-align: center;">
  <img src="image.png" width="50%">
</div>
```

#### 左寄せ

```markdown
<img src="image.png" style="float: left; margin-right: 20px;" width="300">
テキストが画像の右側に回り込みます。
```

### 背景画像

```markdown
<!-- _backgroundImage: url('background.jpg') -->
```

---

## テーブル

### 基本構文

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| D   | E   | F   |
```

### 列の配置

```markdown
| 左寄せ | 中央揃え | 右寄せ |
|:-------|:--------:|-------:|
| 左     | 中央     | 右     |
| A      | B        | C      |
```

### 複雑なテーブル

```markdown
| 項目 | 説明 | 例 |
|------|------|-----|
| **h1** | 最も大きな見出し | `# タイトル` |
| **h2** | 次に大きな見出し | `## サブタイトル` |
| **h3** | 小見出し | `### 小見出し` |
```

### テーブルのスタイル

```yaml
style: |
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
```

---

## カスタムスタイル

### インラインスタイル

```markdown
<div style="color: red; font-size: 32px;">
  赤い大きなテキスト
</div>
```

### クラスベースのスタイル

フロントマターで定義：

```yaml
style: |
  .highlight {
    background-color: yellow;
    padding: 10px;
  }
  .center {
    text-align: center;
  }
```

使用：

```markdown
<div class="highlight">
  強調したいコンテンツ
</div>

<div class="center">
  中央揃え
</div>
```

### 2カラムレイアウト

```markdown
<div style="display: flex; gap: 40px;">
<div style="flex: 1;">

## 左側

- 項目1
- 項目2

</div>
<div style="flex: 1;">

## 右側

- 項目3
- 項目4

</div>
</div>
```

### カスタムボックス

```yaml
style: |
  .info-box {
    background-color: #eff6ff;
    border-left: 8px solid #3b82f6;
    padding: 20px;
    margin: 20px 0;
  }
  .warning-box {
    background-color: #fef5e7;
    border-left: 8px solid #f59e0b;
    padding: 20px;
    margin: 20px 0;
  }
```

使用：

```markdown
<div class="info-box">
  ℹ️ 情報: これは重要な情報です。
</div>

<div class="warning-box">
  ⚠️ 警告: 注意が必要です。
</div>
```

---

## ページ番号とヘッダー/フッター

### グローバル設定

フロントマターで全スライドに適用：

```yaml
---
marp: true
paginate: true
header: 'セミナータイトル'
footer: '© 2026 あなたの名前'
---
```

### ページ固有の設定

特定のスライドのみ変更：

```markdown
<!-- _paginate: false -->

# このスライドだけページ番号を非表示
```

```markdown
<!-- _header: "" -->
<!-- _footer: "" -->

# このスライドだけヘッダー/フッターを非表示
```

### ページ番号のスタイル

```yaml
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 20px;
    right: 40px;
    font-size: 18px;
    color: #666;
  }
```

### ヘッダー/フッターのスタイル

```yaml
style: |
  header {
    position: absolute;
    top: 20px;
    left: 40px;
    font-size: 18px;
    color: #666;
  }
  footer {
    position: absolute;
    bottom: 20px;
    left: 40px;
    font-size: 18px;
    color: #666;
  }
```

---

## ベストプラクティス

### 1. フロントマターを常に含める

すべてのMarpファイルは、フロントマターから始めます。

✅ **Good**:
```yaml
---
marp: true
theme: default
---
```

### 2. スライド区切りの前後に空行

スライド区切りの`---`の前後には空行を入れます。

✅ **Good**:
```markdown
# スライド1

---

# スライド2
```

❌ **Bad**:
```markdown
# スライド1
---
# スライド2
```

### 3. レイアウト指定はスライドの先頭

レイアウト指定のコメントは、スライドの最初に配置します。

✅ **Good**:
```markdown
---

<!-- _class: lead -->

# タイトル
```

❌ **Bad**:
```markdown
---

# タイトル

<!-- _class: lead -->
```

### 4. 言語指定でコードブロック

コードブロックには常に言語を指定します。

✅ **Good**:
````markdown
```javascript
console.log("Hello");
```
````

❌ **Bad**:
````markdown
```
console.log("Hello");
```
````

### 5. 画像には代替テキスト

画像には必ず代替テキストを含めます。

✅ **Good**:
```markdown
![ロゴ](logo.png)
```

❌ **Bad**:
```markdown
![](logo.png)
```

---

## チェックリスト

Marpマークダウンを作成した後、以下をチェックしてください：

- [ ] フロントマターが正しく設定されている
- [ ] `marp: true`が含まれている
- [ ] スライド区切り（`---`）の前後に空行がある
- [ ] レイアウト指定がスライドの先頭にある
- [ ] コードブロックに言語が指定されている
- [ ] 画像に代替テキストがある
- [ ] テーブルの列が正しく配置されている
- [ ] カスタムスタイルが適切に定義されている

---

## トラブルシューティング

### スライドが表示されない

**原因**: フロントマターに`marp: true`がない
**解決策**: フロントマターに`marp: true`を追加

### スライドが区切られない

**原因**: `---`の前後に空行がない
**解決策**: `---`の前後に空行を追加

### レイアウトが適用されない

**原因**: レイアウト指定がスライドの先頭にない
**解決策**: `<!-- _class: lead -->`をスライドの最初に配置

### コードがハイライトされない

**原因**: 言語が指定されていない
**解決策**: コードブロックに言語を指定（例: ````javascript`）

---

## 参考リンク

- [Marp公式サイト](https://marp.app/)
- [Marpit Markdown構文](https://marpit.marp.app/markdown)
- [Marp CLIドキュメント](https://github.com/marp-team/marp-cli)
- [Marpテーマギャラリー](https://github.com/marp-team/marp-core/tree/main/themes)

---

**ヒント**: Marp構文は、標準的なMarkdownに加えて、独自のディレクティブ（`<!-- ... -->`）を使用します。これらのディレクティブを正しく使用することで、柔軟なスライドデザインが可能になります。
