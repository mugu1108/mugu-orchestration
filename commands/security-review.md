# /security-review - セキュリティレビューコマンド

**説明**: コードのセキュリティ脆弱性を検出し、OWASP Top 10などの基準に基づいて包括的なセキュリティレビューを行います。

## 使用方法

```
/security-review [ファイルパス（省略可）]
```

## 概要

`/security-review` コマンドは、Security Reviewerエージェントを呼び出し、コードのセキュリティ脆弱性を包括的にチェックします。OWASP Top 10、機密情報の漏洩、インジェクション攻撃、認証・認可の問題などを検出し、修正方法を提案します。

## いつ使うか

- **Pull Request前**: 本番環境へのデプロイ前のセキュリティチェック
- **新機能実装後**: 認証、データベース操作、外部API連携を含む機能の実装時
- **セキュリティインシデント対応**: 脆弱性発見時の影響範囲調査
- **定期的なセキュリティ監査**: プロジェクト全体のセキュリティ状態確認

## 使用例

### 例1: 特定ファイルのセキュリティレビュー

```
/security-review src/auth/login.ts
```

**出力**:
```markdown
# セキュリティレビュー結果

## サマリー
- レビュー日時: 2026-01-26 10:00
- レビュー対象: src/auth/login.ts
- 総脆弱性数: 2件
  - High: 1件
  - Medium: 1件

## High Vulnerabilities 🟠

### 1. 認証の強度不足
- **ファイル**: `src/auth/login.ts:30`
- **脆弱性タイプ**: A07:2021 - Identification and Authentication Failures
- **説明**: パスワード検証が弱く、簡単なパスワードを許可している
- **攻撃シナリオ**: 攻撃者がブルートフォース攻撃で簡単にアカウントを乗っ取り可能
- **推奨**: パスワードの複雑性要件を追加（最小8文字、数字・記号を含む）
- **例**:
  ```typescript
  // Before
  if (password.length < 6) {
    throw new Error('パスワードが短すぎます');
  }

  // After
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('パスワードは8文字以上で、英字・数字・記号を含む必要があります');
  }
  ```

## Medium Vulnerabilities 🟡

### 1. セッションタイムアウトの欠如
- **ファイル**: `src/auth/login.ts:50`
- **脆弱性タイプ**: A07:2021 - Identification and Authentication Failures
- **説明**: セッションに有効期限が設定されていない
- **推奨**: JWTトークンに適切な有効期限を設定（例: 1時間）
  ```typescript
  const token = jwt.sign(
    { userId: user.id },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
  ```
```

### 例2: プロジェクト全体のセキュリティスキャン

```
/security-review
```

**出力**:
```markdown
# セキュリティレビュー結果

## サマリー
- レビュー日時: 2026-01-26 14:00
- レビュー対象: 変更されたファイル（5件）
  - src/auth/login.ts
  - src/auth/register.ts
  - src/api/users.ts
  - src/database/queries.ts
  - src/config/env.ts
- 総脆弱性数: 7件
  - Critical: 1件
  - High: 2件
  - Medium: 3件
  - Low: 1件

## Critical Vulnerabilities 🔴

### 1. ハードコードされたAPI key
- **ファイル**: `src/config/env.ts:5`
- **脆弱性タイプ**: A02:2021 - Cryptographic Failures
- **説明**: Supabase Service Keyがコードに直接記述されている
- **攻撃シナリオ**: リポジトリが公開された場合、攻撃者がService Keyを取得し、データベースを完全に操作可能
- **影響**: 全データの漏洩、改ざん、削除のリスク
- **推奨**: 環境変数を使用し、`.env`ファイルで管理
  ```typescript
  // Before (Critical!)
  const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

  // After (Safe)
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_KEY環境変数が必要です');
  }
  ```

## High Vulnerabilities 🟠

### 1. SQLインジェクション脆弱性
- **ファイル**: `src/database/queries.ts:45`
- **脆弱性タイプ**: A03:2021 - Injection
- **説明**: ユーザー入力が直接SQL文字列に連結されている
- **攻撃シナリオ**: 攻撃者が`'; DROP TABLE users; --`のような入力でデータベースを破壊
- **推奨**: パラメータ化されたクエリを使用
  ```typescript
  // Before (Vulnerable)
  const query = \`SELECT * FROM users WHERE email = '\${userEmail}'\`;

  // After (Safe)
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', userEmail);
  ```

### 2. 認可チェックの欠如
- **ファイル**: `src/api/users.ts:30`
- **脆弱性タイプ**: A01:2021 - Broken Access Control
- **説明**: RLSポリシーが設定されておらず、他ユーザーのデータにアクセス可能
- **推奨**: RLSポリシーを設定
  ```sql
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can only access their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);
  ```

## セキュリティベストプラクティス提案
- 全てのAPI keyを環境変数に移行
- RLSポリシーを全テーブルに設定
- パラメータ化クエリを徹底
- 定期的なnpm auditの実行

## 総評
重大なセキュリティリスク（Critical: 1件）が発見されました。直ちに修正が必要です。
全体的にセキュリティの基本的な対策が不足しているため、`rules/security.md`のガイドラインに従った改善を推奨します。
```

### 例3: API key漏洩チェック

```
/security-review --check-secrets
```

**出力**:
```markdown
# 機密情報スキャン結果

## 検出された機密情報

### 1. Supabase Service Key
- **ファイル**: `src/config/database.ts:10`
- **パターン**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **リスク**: Critical
- **推奨アクション**:
  1. 直ちにコードから削除
  2. Supabaseダッシュボードでキーをローテーション
  3. 環境変数に移行
  4. `.env`ファイルを`.gitignore`に追加

### 2. OpenAI API Key
- **ファイル**: `src/ai/client.ts:5`
- **パターン**: `sk-...`
- **リスク**: High
- **推奨アクション**: 同上
```

## レビュー項目

### 1. 機密情報の管理
- API key、パスワード、トークンのハードコード検出
- 環境変数の適切な使用
- `.env`ファイルの`.gitignore`登録

### 2. 入力検証とサニタイゼーション
- ユーザー入力の検証
- バリデーションスキーマの使用
- ファイルアップロードの検証

### 3. インジェクション攻撃対策
- SQLインジェクション
- コマンドインジェクション
- NoSQLインジェクション

### 4. XSS（クロスサイトスクリプティング）対策
- HTMLエスケープ
- Content Security Policy
- DOM操作の安全性

### 5. 認証・認可
- 認証の強度
- セッション管理
- RLSポリシー
- JWT検証

### 6. CSRF対策
- CSRFトークン
- SameSite Cookie
- HTTPメソッドの適切な使用

### 7. エラーハンドリング
- エラーメッセージの適切性
- スタックトレースの非公開
- ログの機密情報

### 8. 依存関係のセキュリティ
- npm audit
- 脆弱な依存関係の検出
- ライセンスチェック

## オプション

- `--check-secrets`: 機密情報の漏洩チェックに特化
- `--owasp`: OWASP Top 10に基づくチェック
- `--deep`: より詳細なスキャン（時間がかかる）

```
/security-review --check-secrets src/
/security-review --owasp
/security-review --deep
```

## ベストプラクティス

1. **定期的なレビュー**: 週次または月次でセキュリティレビューを実施
2. **コミット前チェック**: Pre-commitフックでセキュリティチェック
3. **Critical即修正**: Criticalの脆弱性は直ちに修正
4. **継続的改善**: セキュリティは継続的なプロセス

## チェックリスト

### コミット前
- [ ] API keyがハードコードされていない
- [ ] `.env`が`.gitignore`に含まれている
- [ ] ユーザー入力が検証されている
- [ ] SQLクエリがパラメータ化されている

### Pull Request前
- [ ] セキュリティレビューを実施
- [ ] Critical/High脆弱性を修正
- [ ] npm auditを実行し、脆弱性を解決
- [ ] RLSポリシーを設定

### デプロイ前
- [ ] 本番環境の環境変数を確認
- [ ] HTTPSが有効化されている
- [ ] レート制限が設定されている
- [ ] セキュリティヘッダーが設定されている

## 関連エージェント

- **security-reviewer**: このコマンドが呼び出すエージェント
- **code-reviewer**: 一般的なコード品質チェック
- **planner**: セキュアな実装計画の作成
- **doc-updater**: セキュリティドキュメントの更新

## モデル選択

セキュリティレビューには、詳細な分析が必要なため、**Sonnet**または**Opus**モデルの使用を推奨します。

## 詳細情報

詳細は [agents/security-reviewer.md](../agents/security-reviewer.md) を参照してください。

## セキュリティインシデント対応手順

脆弱性が発見された場合:

1. **作業停止**: 直ちに作業を中断
2. **影響範囲特定**: 同様の脆弱性を全体チェック
3. **修正実施**: Critical/Highを優先的に修正
4. **認証情報ローテーション**: 露出した認証情報を無効化・再生成
5. **再レビュー**: 修正後、再度セキュリティレビューを実施
6. **ドキュメント更新**: インシデント対応を記録

## 注意事項

- セキュリティレビューは補助ツールであり、専門家による監査を置き換えるものではない
- 重大な脆弱性が発見された場合は、直ちに対処する
- セキュリティは継続的なプロセスであり、一度の対応で終わりではない
- 脆弱性情報の取り扱いには注意し、公開前に修正を完了する
