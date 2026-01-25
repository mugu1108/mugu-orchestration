# セキュリティルール

このドキュメントは、コード作成時に**必ず遵守すべき**セキュリティ基準を定義します。

## 必須チェック項目

コミット前に以下を確認してください：

- [ ] API key、パスワード、トークンをハードコードしていない
- [ ] 入力検証を実装している
- [ ] SQLインジェクション対策を行っている
- [ ] XSS（クロスサイトスクリプティング）対策を行っている
- [ ] CSRF（クロスサイトリクエストフォージェリ）対策を行っている
- [ ] 認証・認可を適切に実装している
- [ ] エンドポイントにレート制限を設定している
- [ ] エラーメッセージで機密情報を公開していない

## 機密情報の管理

### ❌ 悪い例

```typescript
// APIキーを直接コードに記述
const OPENAI_API_KEY = "sk-1234567890abcdef";

// Supabase認証情報をハードコード
const supabaseUrl = "https://myproject.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### ✅ 良い例

```typescript
// 環境変数から取得
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

// Supabase認証情報も環境変数から
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are required');
}
```

### 環境変数の設定

```bash
# .env ファイル（このファイルは.gitignoreに追加）
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-api-key

# .env.example ファイル（リポジトリにコミット）
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
OPENAI_API_KEY=sk-your-api-key-here
```

## 入力検証

すべてのユーザー入力を検証してください。

### ❌ 悪い例

```typescript
// 検証なしで直接使用
async function createSkill(req: Request) {
  const { name, description } = req.body;
  await supabase.from('skills').insert({ name, description });
}
```

### ✅ 良い例

```typescript
import { z } from 'zod';

// スキーマで検証
const SkillSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(['automation', 'documentation', 'analysis', 'integration', 'workflow']),
});

async function createSkill(req: Request) {
  // 入力を検証
  const validatedData = SkillSchema.parse(req.body);
  await supabase.from('skills').insert(validatedData);
}
```

## SQLインジェクション対策

### ❌ 悪い例

```typescript
// 直接SQL文字列に挿入（危険！）
const query = \`SELECT * FROM skills WHERE name = '\${userInput}'\`;
```

### ✅ 良い例

```typescript
// パラメータ化されたクエリを使用
const { data } = await supabase
  .from('skills')
  .select('*')
  .eq('name', userInput);

// または、プレースホルダーを使用
const { data } = await supabase.rpc('get_skill_by_name', { skill_name: userInput });
```

## 認証・認可

### ❌ 悪い例

```typescript
// 認証チェックなし
app.post('/api/skills', async (req, res) => {
  const skill = req.body;
  await supabase.from('skills').insert(skill);
  res.json({ success: true });
});
```

### ✅ 良い例

```typescript
// 認証チェックを実装
app.post('/api/skills', authenticateUser, async (req, res) => {
  // ユーザーがログインしていることを確認
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 権限チェック
  if (!req.user.permissions.includes('create_skill')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const skill = req.body;
  await supabase.from('skills').insert(skill);
  res.json({ success: true });
});
```

## エラーハンドリング

### ❌ 悪い例

```typescript
// 詳細なエラー情報を公開
try {
  await supabase.from('skills').insert(skill);
} catch (error) {
  res.status(500).json({ error: error.message, stack: error.stack });
}
```

### ✅ 良い例

```typescript
// ユーザーフレンドリーなエラーメッセージ
try {
  await supabase.from('skills').insert(skill);
} catch (error) {
  console.error('Skill creation failed:', error); // サーバーログに詳細を記録
  res.status(500).json({ error: 'スキルの作成に失敗しました' }); // 一般的なメッセージのみ
}
```

## セキュリティインシデント対応

セキュリティ問題を発見した場合の対応手順：

1. **作業を停止**: 問題を発見したら、すぐに作業を中断
2. **問題を報告**: セキュリティレビュアーエージェントを起動
3. **修正**: 重大な問題を優先的に修正
4. **認証情報のローテーション**: 露出した認証情報を直ちに無効化し、再生成
5. **コードベース監査**: 同様の脆弱性がないか全体をチェック

## チェックリスト

コミット前に以下を確認してください：

- [ ] \`.env\`ファイルが\`.gitignore\`に含まれている
- [ ] \`.env.example\`ファイルにダミー値のみが含まれている
- [ ] すべてのAPI keyが環境変数から読み込まれている
- [ ] ユーザー入力が検証されている
- [ ] SQLクエリがパラメータ化されている
- [ ] エラーメッセージが機密情報を含まない
- [ ] 認証・認可が適切に実装されている

---

**重要**: これらのルールは妥協できません。セキュリティは最優先事項です。
