---
marp: true
theme: default
paginate: true
header: 'TypeScript入門ワークショップ'
footer: 'ハンズオンワークショップ'
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
    margin-bottom: 24px;
  }
  h2 {
    font-size: 36px;
    color: #2d3748;
    font-weight: bold;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 28px;
    color: #4a5568;
    margin-bottom: 16px;
  }
  p, li {
    font-size: 24px;
    line-height: 1.6;
    color: #2d3748;
  }
  ul, ol {
    margin-left: 32px;
  }
  li {
    margin-bottom: 12px;
  }
  code {
    background-color: #f7fafc;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 22px;
  }
  pre {
    background-color: #2d3748;
    color: #ffffff;
    padding: 16px;
    border-radius: 8px;
    font-size: 20px;
    line-height: 1.5;
  }
  pre code {
    background-color: transparent;
    padding: 0;
    font-size: 20px;
    color: #ffffff;
  }
  strong {
    color: #fbbf24;
    font-weight: bold;
  }
  .hands-on {
    background-color: #edf2f7;
    border-left: 8px solid #4299e1;
    padding: 20px;
  }
  .checkpoint {
    background-color: #fef5e7;
    border-left: 8px solid #f59e0b;
    padding: 20px;
  }
  .challenge {
    background-color: #fce7f3;
    border-left: 8px solid #ec4899;
    padding: 20px;
  }
  blockquote {
    border-left: 4px solid #4299e1;
    padding-left: 16px;
    margin: 16px 0;
    color: #4a5568;
  }
  .lead {
    font-size: 32px;
    text-align: center;
  }
---

<!-- _class: lead -->

# TypeScript入門ワークショップ

## ハンズオンワークショップ

---

# このワークショップについて

このハンズオンワークショップでは、**TypeScript**を実際に手を動かしながら学びます。

### 形式
- 💻 **実習中心**: 理論 30% / 実習 70%
- 👥 **サポート体制**: 質問はいつでもOK
- 🎯 **成果物**: ワークショップ終了時に動くアプリを作成

---

# 学習目標

このワークショップを完了すると、以下ができるようになります：

1. **TypeScriptの基本的な型システムを理解する**
   - 型アノテーション、インターフェース、型推論の活用

2. **React with TypeScriptでコンポーネントを作成する**
   - Props、State、Eventハンドラーの型定義

3. **型安全なアプリケーションを構築する**
   - 実践的なTodoアプリの作成

---

# アジェンダ

| 時間 | 内容 | 形式 |
|------|------|------|
| 10分 | イントロダクション | 講義 |
| 15分 | 環境構築 | 実習 |
| 30分 | セクション1: TypeScript基礎 | 実習 |
| 30分 | セクション2: React + TypeScript | 実習 |
| 30分 | セクション3: 実践アプリ構築 | 実習 |
| 10分 | まとめ | 講義 |

---

# 前提知識の確認

### 必須
- ✅ JavaScript (ES6+) の基本文法
- ✅ Reactの基礎知識（コンポーネント、Props、State）
- ✅ ターミナルの基本操作

### あると良い
- 💡 npm/yarnの使用経験
- 💡 モダンなJavaScript開発の経験

> **初心者の方へ**: 不安な点があっても大丈夫です。サポートしながら進めます。

---

# 必要な環境

### ソフトウェア
- Node.js (バージョン: 18以上)
- npm または yarn
- Visual Studio Code

### VS Code拡張機能
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### エディタ
推奨: Visual Studio Code

---

<!-- _class: lead -->

# 環境構築

**実習時間: 15分**

---

<!-- _class: hands-on -->

# 実習1: 環境のセットアップ

## ステップ1: Node.jsのバージョン確認

```bash
node --version
npm --version
```

## ステップ2: プロジェクト作成

```bash
npx create-react-app typescript-workshop --template typescript
cd typescript-workshop
```

## ステップ3: 開発サーバー起動

```bash
npm start
```

---

<!-- _class: checkpoint -->

# チェックポイント

以下のコマンドを実行して、環境が正しくセットアップされているか確認してください：

```bash
npm start
```

**期待される出力**:
```
Compiled successfully!

You can now view typescript-workshop in the browser.

  Local:            http://localhost:3000
```

❓ **うまくいかない場合**: 手を挙げてサポートを求めてください

---

<!-- _class: lead -->

# セクション1: TypeScript基礎

**実習時間: 30分**

---

# TypeScript基礎: 概要

TypeScriptは、JavaScriptに静的型付けを追加した言語です。

### このセクションで学ぶこと
- 基本的な型アノテーション
- インターフェースと型エイリアス
- ジェネリクスとUnion型

---

# 理論: 型アノテーション（1/2）

TypeScriptでは、変数や関数に型を指定できます：

```typescript
// 基本的な型
let name: string = "太郎"
let age: number = 25
let isStudent: boolean = true

// 配列
let scores: number[] = [80, 90, 100]
```

---

# 理論: 型アノテーション（2/2）

```typescript
// 関数
function greet(name: string): string {
  return `Hello, ${name}!`
}
```

**ポイント**:
- 型を明示することでエラーを早期に発見
- IDEの補完機能が強化される

---

<!-- _class: hands-on -->

# 実習2: 型アノテーションの練習

## タスク
`src/types.ts`ファイルを作成し、基本的な型を定義してみましょう

## ステップ

1. **ファイル作成**
   ```typescript
   // src/types.ts
   export interface User {
     id: number;
     name: string;
     email: string;
   }
   ```

2. **型の使用**
   ```typescript
   const user: User = {
     id: 1,
     name: "太郎",
     email: "taro@example.com"
   }
   ```

---

<!-- _class: hands-on -->

# 実習2: 型アノテーションの練習（続き）

3. **関数の型定義**
   ```typescript
   function getUserName(user: User): string {
     return user.name
   }

   console.log(getUserName(user))
   ```

4. **動作確認**
   ```bash
   npm start
   ```

**期待される結果**: コンソールに"太郎"が表示される

---

<!-- _class: checkpoint -->

# チェックポイント

セクション1の理解度チェック：

- [ ] 基本的な型（string, number, boolean）を使える
- [ ] インターフェースを定義して使用できる
- [ ] 関数の引数と戻り値に型を指定できる

**すべてチェックできましたか？** 👍

---

<!-- _class: lead -->

# セクション2: React + TypeScript

**実習時間: 30分**

---

# React + TypeScript: 概要

ReactコンポーネントをTypeScriptで書くことで、Propsやイベントの型安全性が向上します。

### このセクションで学ぶこと
- Functional Componentの型定義
- Propsの型指定
- Stateの型指定

---

# 理論: React Componentの型定義

Reactコンポーネントに型を付ける方法：

```typescript
// Props の型定義
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// Functional Component
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

**ポイント**:
- Propsの型を明示することで、誤った使用を防ぐ
- イベントハンドラーの型も指定できる

---

<!-- _class: hands-on -->

# 実習3: React Componentの作成

## タスク
型安全なButtonコンポーネントを作成しましょう

## ステップ1: Props定義

```typescript
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}
```

---

<!-- _class: hands-on -->

# 実習3: React Componentの作成（実装）

## ステップ2: コンポーネント実装

```typescript
export function Button({
  label, onClick, variant = 'primary'
}: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  )
}
```

---

<!-- _class: hands-on -->

# 実習3: React Componentの作成（続き）

3. **コンポーネントの使用**
   ```typescript
   // src/App.tsx
   import { Button } from './components/Button'

   function App() {
     const handleClick = () => alert('Clicked!')

     return (
       <div>
         <Button label="送信" onClick={handleClick} variant="primary" />
       </div>
     )
   }
   ```

4. **動作確認**
   ```bash
   npm start
   ```

**期待される結果**: ボタンをクリックするとアラートが表示される

---

<!-- _class: checkpoint -->

# チェックポイント

セクション2の理解度チェック：

- [ ] Propsの型を定義できる
- [ ] Functional Componentで型を使用できる
- [ ] イベントハンドラーの型を指定できる

**すべてチェックできましたか？** 👍

---

<!-- _class: lead -->

# セクション3: 実践アプリ構築

**実習時間: 30分**

---

# 実践アプリ構築: 概要

学んだ知識を使って、TypeScript + ReactでTodoアプリを作成します。

### このセクションで学ぶこと
- 複雑な型の定義
- Stateの型指定
- イベントハンドラーの実装

---

# 理論: Todoアプリの型設計

Todoアプリに必要な型を設計します：

```typescript
// Todo の型定義
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// State の型
type TodoState = {
  todos: Todo[];
  input: string;
}
```

**ポイント**:
- データ構造を先に型で定義する
- 型を見れば、アプリの構造が理解できる

---

<!-- _class: hands-on -->

# 実習4: Todoアプリの構築

## タスク
型安全なTodoアプリを作成しましょう

## ステップ

1. **型定義**
   ```typescript
   // src/types.ts
   export interface Todo {
     id: number;
     text: string;
     completed: boolean;
   }
   ```

2. **Appコンポーネント（1/3）: State定義**
   ```typescript
   import { useState } from 'react'
   import { Todo } from './types'

   function App() {
     const [todos, setTodos] = useState<Todo[]>([])
     const [input, setInput] = useState('')
   ```

---

<!-- _class: hands-on -->

# 実習4: Todoアプリの構築（2/4）

3. **addTodo関数**
   ```typescript
   const addTodo = () => {
     if (!input.trim()) return
     const newTodo: Todo = {
       id: Date.now(), text: input, completed: false
     }
     setTodos([...todos, newTodo])
     setInput('')
   }
   ```

---

<!-- _class: hands-on -->

# 実習4: Todoアプリの構築（3/4）

4. **toggleTodoとdeleteTodo関数**
   ```typescript
   const toggleTodo = (id: number) => {
     setTodos(todos.map(todo =>
       todo.id === id
         ? { ...todo, completed: !todo.completed }
         : todo
     ))
   }

   const deleteTodo = (id: number) => {
     setTodos(todos.filter(todo => todo.id !== id))
   }
   ```

---

<!-- _class: hands-on -->

# 実習4: Todoアプリの構築（4/4）

5. **UIの実装: 入力部分**
   ```typescript
   return (
     <div className="App">
       <h1>Todo App</h1>
       <input
         value={input}
         onChange={(e) => setInput(e.target.value)}
       />
       <button onClick={addTodo}>追加</button>
   ```

---

<!-- _class: hands-on -->

# 実習4: Todoアプリの構築（完成）

6. **UIの実装: リスト部分**
   ```typescript
       <ul>
         {todos.map(todo => (
           <li key={todo.id}>
             <input type="checkbox"
               checked={todo.completed}
               onChange={() => toggleTodo(todo.id)} />
             {todo.text}
           </li>
         ))}
       </ul>
     </div>
   )
   }
   ```

---

<!-- _class: checkpoint -->

# チェックポイント

セクション3の理解度チェック：

- [ ] 複雑な型（interfaceとstate）を定義できる
- [ ] useStateに型を指定できる
- [ ] 型安全なイベントハンドラーを実装できる

**すべてチェックできましたか？** 👍

---

<!-- _class: lead -->

# まとめ

---

# 今日学んだこと

### TypeScriptの基礎
- ✅ 基本的な型アノテーション
- ✅ インターフェースと型エイリアス
- ✅ ジェネリクスとUnion型

### React + TypeScript
- ✅ React with TypeScriptのセットアップ
- ✅ 型安全なコンポーネント作成
- ✅ 実践的なTodoアプリ構築

---

# 次のステップ

### すぐにできること
1. **公式ドキュメントを読む**
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
   - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

2. **実践プロジェクトに取り組む**
   - 既存のJavaScriptプロジェクトをTypeScriptに移行
   - 新しいプロジェクトでTypeScriptを使う

3. **コミュニティに参加する**
   - TypeScript Japan UserGroup
   - Discord/Slackコミュニティ

---

# リソース

### 公式ドキュメント
- [TypeScript 公式サイト](https://www.typescriptlang.org/)
- [React 公式ドキュメント](https://react.dev/)

### 学習リソース
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### コミュニティ
- [TypeScript GitHub](https://github.com/microsoft/TypeScript)
- [Stack Overflow - TypeScript](https://stackoverflow.com/questions/tagged/typescript)

---

<!-- _class: lead -->

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-top: 80px;
}
section h1 {
  font-size: 64px;
  margin-bottom: 60px;
}
.images {
  display: flex;
  gap: 40px;
  align-items: center;
}
</style>

# Xもやってます

<div class="images">
  <img src="images/profile.png" width="400" style="margin-right: 40px;">
  <img src="images/x-qr.png" width="300">
</div>
