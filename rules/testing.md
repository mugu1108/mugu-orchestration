# テストガイド

このドキュメントは、テスト戦略とベストプラクティスを定義します。

## テストの重要性

テストは以下を保証します：
- **品質**: コードが期待通りに動作する
- **信頼性**: 変更によって既存機能が壊れない
- **保守性**: リファクタリングを安全に行える
- **ドキュメント**: テストはコードの使い方を示す

## テストの種類

### 1. 単体テスト（Unit Tests）

**対象**: 個別の関数・メソッド・クラス

**目的**: 最小単位のコードが正しく動作することを確認

**例**:
```typescript
// src/lib/utils/string.test.ts
import { toKebabCase } from './string';

describe('toKebabCase', () => {
  it('スペースをハイフンに変換する', () => {
    expect(toKebabCase('Hello World')).toBe('hello-world');
  });

  it('大文字を小文字に変換する', () => {
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  it('連続するスペースを1つのハイフンに変換する', () => {
    expect(toKebabCase('Hello  World')).toBe('hello-world');
  });

  it('空文字列の場合は空文字列を返す', () => {
    expect(toKebabCase('')).toBe('');
  });
});
```

### 2. 統合テスト（Integration Tests）

**対象**: 複数のコンポーネント・モジュール間の連携

**目的**: コンポーネントが正しく連携することを確認

**例**:
```typescript
// src/lib/skill-manager.test.ts
import { SkillManager } from './skill-manager';
import { createClient } from '@supabase/supabase-js';

describe('SkillManager', () => {
  let skillManager: SkillManager;

  beforeEach(() => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    skillManager = new SkillManager(supabase);
  });

  it('スキルを作成できる', async () => {
    const skill = {
      name: 'test-skill',
      description: 'Test skill',
      category: 'automation' as const,
    };

    const result = await skillManager.createSkill(skill);
    expect(result).toBeDefined();
    expect(result.name).toBe('test-skill');
  });

  it('存在しないスキルを取得するとエラーをスローする', async () => {
    await expect(
      skillManager.getSkill('non-existent-skill')
    ).rejects.toThrow();
  });
});
```

### 3. E2Eテスト（End-to-End Tests）

**対象**: アプリケーション全体のユーザーフロー

**目的**: 実際のユーザー操作をシミュレートして動作を確認

**例**:
```typescript
// tests/e2e/skill-creation.spec.ts
import { test, expect } from '@playwright/test';

test('新しいスキルを作成できる', async ({ page }) => {
  // ページにアクセス
  await page.goto('http://localhost:3000/skills');

  // 「新規作成」ボタンをクリック
  await page.click('button:has-text("新規作成")');

  // フォームに入力
  await page.fill('input[name="name"]', 'test-skill');
  await page.fill('textarea[name="description"]', 'Test description');
  await page.selectOption('select[name="category"]', 'automation');

  // 送信
  await page.click('button[type="submit"]');

  // 成功メッセージを確認
  await expect(page.locator('.success-message')).toContainText('スキルを作成しました');

  // スキルがリストに表示されることを確認
  await expect(page.locator('.skill-list')).toContainText('test-skill');
});
```

## テストカバレッジ目標

### 最低基準

- **ライン カバレッジ**: 80%以上
- **ブランチ カバレッジ**: 80%以上
- **関数 カバレッジ**: 80%以上
- **ステートメント カバレッジ**: 80%以上

### カバレッジの確認

```bash
# テストをカバレッジ付きで実行
npm test -- --coverage

# カバレッジレポートを確認
open coverage/lcov-report/index.html
```

### 優先的にテストすべき箇所

1. **ビジネスロジック**: コアとなる機能
2. **エッジケース**: エラー処理、境界値
3. **公開API**: 外部から使用される関数・クラス
4. **複雑な関数**: ロジックが複雑な部分
5. **過去にバグがあった箇所**: 再発防止

## テストの書き方

### AAA パターン

テストは以下の3つの部分で構成：

1. **Arrange（準備）**: テストに必要なデータやオブジェクトを準備
2. **Act（実行）**: テスト対象のコードを実行
3. **Assert（検証）**: 結果が期待通りか確認

```typescript
it('スキルをIDで取得できる', async () => {
  // Arrange: テストデータを準備
  const skillId = 'test-skill-123';
  const expectedSkill = {
    id: skillId,
    name: 'Test Skill',
    description: 'Test description',
  };

  // Act: 実際にコードを実行
  const result = await skillManager.getSkillById(skillId);

  // Assert: 結果を検証
  expect(result).toEqual(expectedSkill);
});
```

### テストケースの命名

**明確で説明的な名前**を使用

#### ✅ 良い例

```typescript
it('有効なデータの場合、スキルを作成できる', () => {});
it('名前が空の場合、エラーをスローする', () => {});
it('存在しないIDの場合、nullを返す', () => {});
it('重複する名前の場合、エラーをスローする', () => {});
```

#### ❌ 悪い例

```typescript
it('test1', () => {});
it('works', () => {});
it('should work correctly', () => {});
```

### エッジケースのテスト

**正常系だけでなく、異常系もテスト**

```typescript
describe('validateSkillName', () => {
  // 正常系
  it('有効な名前の場合、trueを返す', () => {
    expect(validateSkillName('valid-skill-name')).toBe(true);
  });

  // 異常系
  it('空文字の場合、falseを返す', () => {
    expect(validateSkillName('')).toBe(false);
  });

  it('nullの場合、falseを返す', () => {
    expect(validateSkillName(null)).toBe(false);
  });

  it('長すぎる名前の場合、falseを返す', () => {
    const longName = 'a'.repeat(101);
    expect(validateSkillName(longName)).toBe(false);
  });

  it('無効な文字を含む場合、falseを返す', () => {
    expect(validateSkillName('skill name!')).toBe(false);
  });
});
```

## モック（Mock）の使用

外部依存をモック化してテストを高速化・安定化

### データベースのモック

```typescript
import { vi } from 'vitest';

// Supabaseクライアントをモック
const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [{ id: '1', name: 'test' }],
        error: null,
      }),
    }),
  }),
};
```

### API呼び出しのモック

```typescript
import { vi } from 'vitest';

// fetch をモック
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' }),
});
```

### 時間のモック

```typescript
import { vi } from 'vitest';

// 現在時刻を固定
const mockDate = new Date('2024-01-01T00:00:00Z');
vi.setSystemTime(mockDate);

// テスト実行

// モックをクリア
vi.useRealTimers();
```

## テストファイルの配置

### コロケーション（推奨）

テストファイルをソースファイルと同じディレクトリに配置

```
src/
├── lib/
│   ├── skill-manager.ts
│   ├── skill-manager.test.ts      # ← 同じディレクトリ
│   └── utils/
│       ├── string.ts
│       └── string.test.ts          # ← 同じディレクトリ
```

### 分離型

E2Eテストなどは別ディレクトリに配置

```
tests/
├── e2e/
│   ├── skill-creation.spec.ts
│   └── agent-execution.spec.ts
└── integration/
    ├── api.test.ts
    └── database.test.ts
```

## テストの実行

### 全テストの実行

```bash
npm test
```

### 特定のテストファイルを実行

```bash
npm test skill-manager.test.ts
```

### ウォッチモード

```bash
npm test -- --watch
```

### カバレッジ付きで実行

```bash
npm test -- --coverage
```

## テストを書くタイミング

### TDD（テスト駆動開発）推奨

1. **RED**: テストを書く（失敗することを確認）
2. **GREEN**: 最小限のコードを書いて通す
3. **REFACTOR**: コードを改善

```typescript
// 1. RED: まずテストを書く
describe('calculateTotal', () => {
  it('数値の配列の合計を返す', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});

// 2. GREEN: 最小限の実装
function calculateTotal(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}

// 3. REFACTOR: 必要に応じて改善
function calculateTotal(numbers: number[]): number {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  return numbers.reduce((sum, n) => sum + n, 0);
}
```

## テストのベストプラクティス

### ✅ すべきこと

- **独立したテスト**: 各テストは他のテストに依存しない
- **明確な命名**: テストの目的が分かる名前を使用
- **1つの概念**: 1つのテストで1つの概念をテスト
- **高速なテスト**: テストは素早く実行されるべき
- **決定論的**: 同じ入力に対して常に同じ結果

### ❌ 避けるべきこと

- **実装の詳細をテスト**: 内部実装ではなく、動作をテスト
- **テスト間の依存**: テストの実行順序に依存しない
- **脆弱なセレクタ**: E2Eテストでクラス名やIDに依存しすぎない
- **大量のモック**: モックしすぎると実際の動作と乖離
- **テストのための実装変更**: テストのためだけに本番コードを変更しない

## CI/CDでのテスト

### GitHub Actions の例

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## トラブルシューティング

### テストが不安定（Flaky Tests）

```typescript
// ❌ 悪い例: タイミングに依存
it('データを読み込む', async () => {
  loadData();
  await new Promise(resolve => setTimeout(resolve, 100)); // 不安定
  expect(data).toBeDefined();
});

// ✅ 良い例: 明示的な待機
it('データを読み込む', async () => {
  await loadData();
  expect(data).toBeDefined();
});
```

### テストが遅い

```typescript
// ❌ 悪い例: 実際のAPIを呼び出す
it('ユーザーを取得する', async () => {
  const user = await fetchUserFromAPI('123'); // 遅い
  expect(user.name).toBe('John');
});

// ✅ 良い例: モックを使用
it('ユーザーを取得する', async () => {
  const mockFetch = vi.fn().mockResolvedValue({ name: 'John' });
  const user = await getUserData('123', mockFetch);
  expect(user.name).toBe('John');
});
```

## チェックリスト

コミット前に以下を確認してください：

- [ ] すべてのテストが通る
- [ ] 新しいコードにテストを追加した
- [ ] カバレッジが80%以上
- [ ] エッジケースをテストしている
- [ ] テストが独立している
- [ ] テスト名が明確
- [ ] モックが適切に使用されている

---

**重要**: テストは品質保証の要です。テストを書くことで、自信を持ってコードを変更できます。
