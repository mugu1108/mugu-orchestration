---
name: security-review
description: コードのセキュリティ脆弱性を検出し、OWASP Top 10などの基準に基づいて包括的なセキュリティレビューを行います
category: analysis
triggers:
  - "security-review"
  - "セキュリティレビュー"
  - "セキュリティチェック"
  - "脆弱性スキャン"
  - "security check"
tools:
  - Read
  - Grep
  - Glob
  - Task
  - Bash
---

# /security-review - セキュリティレビューコマンド

**説明**: コードのセキュリティ脆弱性を検出し、OWASP Top 10などの基準に基づいて包括的なセキュリティレビューを行います。

## 使用方法

```
/security-review [ファイルパス（省略可）]
```

## 概要

`/security-review` コマンドは、Security Reviewerエージェントを呼び出し、コードのセキュリティ脆弱性を包括的にチェックします。OWASP Top 10、機密情報の漏洩、インジェクション攻撃、認証・認可の問題などを検出し、修正方法を提案します。

## 起動タイミング

- **Pull Request前**: 本番環境へのデプロイ前のセキュリティチェック
- **新機能実装後**: 認証、データベース操作、外部API連携を含む機能の実装時
- **セキュリティインシデント対応**: 脆弱性発見時の影響範囲調査
- **定期的なセキュリティ監査**: プロジェクト全体のセキュリティ状態確認

## 前提条件

- レビュー対象のコードファイルが存在する
- rules/security.md などのセキュリティルールが設定されている
- npm audit などのセキュリティツールが利用可能

## ワークフローステップ

### ステップ1: レビュー対象の特定

ファイルパスが指定されている場合はそのファイルを、指定されていない場合は変更されたファイル（git statusから取得）をレビュー対象とします。

### ステップ2: 機密情報スキャン

Grepツールを使用して、以下のパターンをスキャンします:

```typescript
// API keyパターン
- "sk-" で始まる文字列（OpenAI API key）
- "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" で始まる文字列（JWT）
- "SUPABASE_SERVICE_KEY" などの環境変数が直接記述されている

// パスワードパターン
- "password" = "..." の形式
- ハードコードされた認証情報
```

### ステップ3: Security Reviewerエージェントの呼び出し

Taskツールを使用してsecurity-reviewerエージェントを起動します:

```
Task(
  subagent_type="general-purpose",
  description="Security review execution",
  prompt="agents/security-reviewer.mdの指示に従って、以下のファイルのセキュリティレビューを実施してください: [ファイルリスト]"
)
```

### ステップ4: セキュリティチェック項目の実行

Security Reviewerエージェントは以下の項目をチェックします:

1. **機密情報の管理**: API key、パスワード、トークンのハードコード検出
2. **入力検証**: ユーザー入力のバリデーション
3. **SQLインジェクション**: パラメータ化クエリの使用
4. **XSS対策**: HTMLエスケープ、Content Security Policy
5. **CSRF対策**: CSRFトークン、SameSite Cookie
6. **認証・認可**: RLSポリシー、JWT検証
7. **エラーハンドリング**: 機密情報の非公開
8. **依存関係**: npm auditによる脆弱性チェック

### ステップ5: 脆弱性の評価

発見された脆弱性を重要度別に分類します:

- **Critical** 🔴: 直ちに修正が必要（API key漏洩、RCEなど）
- **High** 🟠: 優先的に修正（SQLインジェクション、XSSなど）
- **Medium** 🟡: 計画的に修正（弱い認証、セッション管理の問題など）
- **Low** ⚪: 改善推奨（ログの改善、コードスタイルなど）

### ステップ6: レポート生成

エージェントが以下のフォーマットでレポートを生成します:

```markdown
# セキュリティレビュー結果

## サマリー
- レビュー対象: [ファイルリスト]
- 総脆弱性数: X件
  - Critical: X件
  - High: X件
  - Medium: X件
  - Low: X件

## Critical Vulnerabilities 🔴
[重大な脆弱性]

## High Vulnerabilities 🟠
[重要な脆弱性]

## Medium Vulnerabilities 🟡
[中程度の脆弱性]

## Low Vulnerabilities ⚪
[軽微な問題]

## セキュリティベストプラクティス提案
[改善提案]

## 総評
[全体的なセキュリティ評価]
```

## 使用例

### 例1: 特定ファイルのセキュリティレビュー

```
ユーザー: /security-review src/auth/login.ts

エージェント: [security-reviewerエージェントを呼び出し、レビューを実行]

# セキュリティレビュー結果

## サマリー
- レビュー対象: src/auth/login.ts
- 総脆弱性数: 2件
  - High: 1件
  - Medium: 1件

## High Vulnerabilities 🟠
### 1. 認証の強度不足
- **ファイル**: `src/auth/login.ts:30`
- **脆弱性タイプ**: A07 - Identification and Authentication Failures
- **推奨**: パスワードの複雑性要件を追加
```

### 例2: 機密情報の漏洩チェック

```
ユーザー: /security-review --check-secrets

エージェント: [Grepでパターンマッチング + エージェントによる詳細レビュー]
```

## OWASP Top 10 マッピング

このスキルは、OWASP Top 10 (2021) に基づいてレビューを実施します:

1. **A01:2021 - Broken Access Control**: 認可チェックの欠如
2. **A02:2021 - Cryptographic Failures**: 暗号化されていないデータ
3. **A03:2021 - Injection**: SQLインジェクション
4. **A04:2021 - Insecure Design**: 安全でない設計
5. **A05:2021 - Security Misconfiguration**: デフォルト設定、冗長なエラー
6. **A06:2021 - Vulnerable Components**: 脆弱な依存関係
7. **A07:2021 - Identification and Authentication Failures**: 弱い認証
8. **A08:2021 - Software and Data Integrity Failures**: 検証されていない更新
9. **A09:2021 - Security Logging and Monitoring Failures**: 不十分なログ
10. **A10:2021 - Server-Side Request Forgery**: 不適切なURL検証

## mugu-orchestration固有のセキュリティ基準

### Supabaseセキュリティ
- RLSポリシーの適切な設定
- Service Keyの適切な管理（フロントエンドで絶対に使用しない）
- Anonキーの使用とRLSによる保護

### 環境変数管理
- `.env`ファイルを`.gitignore`に追加
- `.env.example`にダミー値のみ
- 全てのAPI keyを環境変数から読み込み

### APIセキュリティ
- レート制限の設定
- JWT検証
- CORSの適切な設定

参照: `rules/security.md`

## オプション（将来的に実装）

- `--check-secrets`: 機密情報の漏洩チェックに特化
- `--owasp`: OWASP Top 10に基づくチェック
- `--deep`: より詳細なスキャン

## ベストプラクティス

1. **定期的なレビュー**: 週次または月次でセキュリティレビューを実施
2. **コミット前チェック**: Pre-commitフックでセキュリティチェック
3. **Critical即修正**: Criticalの脆弱性は直ちに修正
4. **継続的改善**: セキュリティは継続的なプロセス

## 関連エージェント

- **security-reviewer**: このコマンドが呼び出すエージェント
- **code-reviewer**: 一般的なコード品質チェック
- **planner**: セキュアな実装計画の作成
- **doc-updater**: セキュリティドキュメントの更新

## モデル選択

セキュリティレビューには、詳細な分析が必要なため、**Sonnet**または**Opus**モデルの使用を推奨します。

## 詳細情報

詳細は [agents/security-reviewer.md](../../agents/security-reviewer.md) および [commands/security-review.md](../../commands/security-review.md) を参照してください。

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
