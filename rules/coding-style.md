# コーディングスタイルガイド

このドキュメントは、コード品質を維持するためのコーディングスタイル基準を定義します。

## イミュータビリティ（重要）

**常に新しいオブジェクトを作成し、既存のオブジェクトを変更しない**

### ❌ 悪い例

```typescript
// 配列を直接変更
const items = [1, 2, 3];
items.push(4); // 元の配列を変更

// オブジェクトを直接変更
const user = { name: 'John', age: 30 };
user.age = 31; // 元のオブジェクトを変更

// 配列の要素を直接変更
const skills = [{ name: 'skill1' }, { name: 'skill2' }];
skills[0].name = 'updated'; // 元の要素を変更
```

### ✅ 良い例

```typescript
// スプレッド演算子で新しい配列を作成
const items = [1, 2, 3];
const newItems = [...items, 4]; // 新しい配列

// スプレッド演算子で新しいオブジェクトを作成
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, age: 31 }; // 新しいオブジェクト

// map()で新しい配列を作成
const skills = [{ name: 'skill1' }, { name: 'skill2' }];
const updatedSkills = skills.map((skill, index) =>
  index === 0 ? { ...skill, name: 'updated' } : skill
);
```

## ファイル構成

### ファイルサイズの制限

- **推奨**: 1ファイル200-400行
- **最大**: 800行
- **超える場合**: 複数のファイルに分割

### ❌ 悪い例

```
src/
├── utils.ts          # 2000行の巨大ファイル
└── components.tsx    # 1500行のコンポーネント集
```

### ✅ 良い例

```
src/
├── utils/
│   ├── string.ts     # 文字列ユーティリティ（150行）
│   ├── date.ts       # 日付ユーティリティ（100行）
│   └── validation.ts # 検証ユーティリティ（200行）
└── components/
    ├── Button.tsx    # ボタンコンポーネント（80行）
    ├── Input.tsx     # 入力コンポーネント（120行）
    └── Modal.tsx     # モーダルコンポーネント（250行）
```

### ファイル構成のベストプラクティス

**機能・ドメインごとに整理**（ファイル種別ではなく）

#### ❌ 悪い例（種別ごと）

```
src/
├── components/
│   ├── SkillList.tsx
│   ├── SkillForm.tsx
│   └── SkillDetail.tsx
├── hooks/
│   ├── useSkills.ts
│   └── useSkillForm.ts
├── types/
│   └── skill.ts
└── api/
    └── skills.ts
```

#### ✅ 良い例（機能ごと）

```
src/
├── features/
│   ├── skills/
│   │   ├── components/
│   │   │   ├── SkillList.tsx
│   │   │   ├── SkillForm.tsx
│   │   │   └── SkillDetail.tsx
│   │   ├── hooks/
│   │   │   ├── useSkills.ts
│   │   │   └── useSkillForm.ts
│   │   ├── types.ts
│   │   └── api.ts
│   └── agents/
│       ├── components/
│       ├── hooks/
│       └── types.ts
└── shared/
    ├── components/
    └── utils/
```

## エラーハンドリング

### try-catch の使用

リスクのある操作は必ずtry-catchで囲む

#### ❌ 悪い例

```typescript
// エラーハンドリングなし
async function fetchSkills() {
  const response = await fetch('/api/skills');
  const data = await response.json();
  return data;
}
```

#### ✅ 良い例

```typescript
// 適切なエラーハンドリング
async function fetchSkills() {
  try {
    const response = await fetch('/api/skills');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw new Error('スキルの取得に失敗しました');
  }
}
```

### ユーザーフレンドリーなエラーメッセージ

#### ❌ 悪い例

```typescript
// 技術的なエラーをそのまま表示
throw new Error('ECONNREFUSED: Connection refused at localhost:54321');
```

#### ✅ 良い例

```typescript
// ユーザーに分かりやすいメッセージ
throw new Error('データベースに接続できません。Supabaseが起動しているか確認してください。');
```

## 入力検証

### スキーマ検証ライブラリの使用

Zodなどのライブラリを使用してユーザー入力を検証

#### ✅ 良い例

```typescript
import { z } from 'zod';

const SkillSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です'),
  category: z.enum(['automation', 'documentation', 'analysis', 'integration', 'workflow']),
});

// 使用例
function createSkill(data: unknown) {
  const validatedData = SkillSchema.parse(data); // 検証失敗時は例外をスロー
  // または
  const result = SkillSchema.safeParse(data); // 検証結果をオブジェクトで返す
  if (!result.success) {
    console.error('Validation failed:', result.error);
    return;
  }
  // result.data を使用
}
```

## 命名規則

### 変数・関数名

- **わかりやすい名前**を使用
- **略語は避ける**（一般的なものを除く）
- **boolean値は`is`, `has`, `should`で始める**

#### ❌ 悪い例

```typescript
const d = new Date(); // 何のデータ？
const tmp = getData(); // tmpは避ける
const flag = true; // 何のフラグ？
function proc() {} // 何を処理？
```

#### ✅ 良い例

```typescript
const createdAt = new Date();
const skillData = getData();
const isLoading = true;
const hasPermission = checkPermission();
function processSkillData() {}
```

### 定数

- **大文字のスネークケース**を使用

```typescript
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = process.env.API_URL;
```

## 関数の設計

### 関数のサイズ

- **推奨**: 1関数50行以内
- **最大**: 100行
- **超える場合**: 複数の関数に分割

### 単一責任の原則

1つの関数は1つのことだけを行う

#### ❌ 悪い例

```typescript
// 複数の責任を持つ関数
function processAndSaveSkill(data: any) {
  // データを検証
  if (!data.name) throw new Error('Name required');

  // データを変換
  const transformed = transformData(data);

  // データベースに保存
  saveToDatabase(transformed);

  // 通知を送信
  sendNotification();

  // ログを記録
  logActivity();
}
```

#### ✅ 良い例

```typescript
// 各機能を分離
function validateSkillData(data: any) {
  if (!data.name) throw new Error('Name required');
}

function transformSkillData(data: any) {
  return { ...data, createdAt: new Date() };
}

async function saveSkill(data: any) {
  validateSkillData(data);
  const transformed = transformSkillData(data);
  await saveToDatabase(transformed);
}

async function processSkill(data: any) {
  await saveSkill(data);
  await sendNotification();
  await logActivity();
}
```

## ネストの深さ

### ネストは4レベルまで

#### ❌ 悪い例

```typescript
function processData(data: any) {
  if (data) {
    if (data.items) {
      for (const item of data.items) {
        if (item.isValid) {
          if (item.category === 'automation') {
            // 5レベルのネスト！
          }
        }
      }
    }
  }
}
```

#### ✅ 良い例

```typescript
function processData(data: any) {
  if (!data?.items) return;

  const automationItems = data.items.filter(
    (item: any) => item.isValid && item.category === 'automation'
  );

  for (const item of automationItems) {
    processAutomationItem(item);
  }
}
```

## コード品質チェックリスト

コミット前に以下を確認してください：

- [ ] 変数・関数名が分かりやすい
- [ ] 関数が50行以内（最大100行）
- [ ] ファイルが800行以内
- [ ] ネストが4レベル以内
- [ ] イミュータブルなパターンを使用している
- [ ] 適切なエラーハンドリングがある
- [ ] デバッグ用のconsole.logが残っていない
- [ ] マジックナンバーが定数化されている
- [ ] コメントが適切に記述されている（必要な場合）

## TypeScript固有のベストプラクティス

### 型の明示

```typescript
// ✅ 良い例
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

// ❌ 悪い例（any は避ける）
function calculateTotal(items: any): any {
  return items.reduce((sum: any, item: any) => sum + item, 0);
}
```

### 型ガード

```typescript
// ✅ 良い例
function isSkill(obj: unknown): obj is Skill {
  return typeof obj === 'object' && obj !== null && 'name' in obj;
}

if (isSkill(data)) {
  console.log(data.name); // 型安全
}
```

---

**重要**: これらのガイドラインは、コードの可読性、保守性、品質を保つために重要です。
