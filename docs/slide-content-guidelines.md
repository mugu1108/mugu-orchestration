# スライドコンテンツガイドライン

このドキュメントは、Marpスライド生成時の**コンテンツ量制限ルール**をまとめたものです。

## 背景

Marpでスライドを生成した際、コードブロックやテキストがスライドからはみ出す問題が頻発していました。特に以下のケースで問題が発生：

- 10行以上のコードブロック
- コードブロック + 説明テキストの組み合わせ
- 1スライドに複数のコードブロック

この問題を根本的に解決するため、スキル定義とリファレンスドキュメントにルールを追加しました。

---

## コンテンツ量の制限ルール

### コードブロックの制限（最重要）

| パターン | コード行数上限 | テキスト上限 |
|---------|--------------|-------------|
| コードのみ | **8行** | なし |
| コード + 説明 | **6行** | 2-3行 |
| コード + タイトル + ポイント | **6行** | ポイント2項目まで |
| 複数コードブロック | **合計8行** | なし |

**9行以上のコードは必ず分割**してください。

### テキストのみの制限

| コンテンツタイプ | 上限 |
|----------------|------|
| 箇条書き（1階層） | **6項目** |
| 箇条書き（2階層） | **4項目**（サブ項目含む） |
| 段落 | **2-3段落** |
| テーブル | **5行 × 4列** |

### 分割時の命名規則

- 「実装の詳細（1/3）」「実装の詳細（2/3）」「実装の詳細（3/3）」
- 「デモ: ステップ1」「デモ: ステップ2」

---

## ルールを追加したファイル

### スキル定義

| ファイル | 追加内容 |
|---------|---------|
| `skills/slide/SKILL.md` | ステップ4に「スライドはみ出し防止ルール」、ステップ6に整合性チェック3項目、ベストプラクティスに「はみ出し防止」セクション |
| `skills/slide/references/visual-hierarchy.md` | 新セクション「コンテンツ量の制限」（コードブロック制限表、テキスト制限表、分割ルール、分割例） |
| `skills/slide/references/marp-syntax.md` | コードブロックセクションに行数制限と分割例を追加 |
| `skills/slide/templates/general-presentation.md` | フロントマター後に制限ルールのコメントを追加 |

### 修正済みスライド

| ファイル | 修正箇所 |
|---------|---------|
| `slides/nextjs-15-features-20260127.md` | 5箇所（新しいアプローチ→2分割、事例1-3のコード簡略化） |
| `slides/typescript-intro-workshop-20260127.md` | 11箇所（型アノテーション→2分割、実習3分割、実習4→5分割） |
| `slides/supabase-intro-20260127.md` | 4箇所（機能2-3のコード短縮、デモ→4分割） |

---

## 分割の例

### 悪い例（はみ出す）

```markdown
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

**ポイント**:
- 項目1
- 項目2
```

### 良い例（分割済み）

```markdown
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
      id: Date.now(), text, completed: false
    }])
  }
```

**ポイント**:
- 項目1
- 項目2
```

---

## 今後の対応

### スライド生成時

1. **コードブロックの行数を確認**：9行以上なら分割
2. **コード + テキストの組み合わせ**：コードは6行以内に
3. **分割時は連番を付ける**：「（1/3）」形式

### 既存スライドの修正時

1. 問題箇所の特定：`10行以上のコードブロックを検索`
2. 論理単位で分割：インポート/定義/使用、または関数単位
3. 修正後はMarpでプレビュー確認

---

## 関連ファイル

- `skills/slide/SKILL.md` - スキル定義（ワークフロー、ベストプラクティス）
- `skills/slide/references/visual-hierarchy.md` - ビジュアル階層ガイドライン
- `skills/slide/references/marp-syntax.md` - Marp構文リファレンス
- `skills/slide/templates/general-presentation.md` - 一般登壇用テンプレート

---

## 注意事項

- `hands-on-workshop.md`と`product-intro.md`のテンプレートは現在空です（必要に応じて再作成が必要）
- スライド修正後は必ずMarpでプレビューして、はみ出しがないことを確認してください

---

*最終更新: 2026-01-28*
*コミット: b05bfa9*
