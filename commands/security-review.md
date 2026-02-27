# /security-review - セキュリティレビューコマンド

**説明**: コードのセキュリティ脆弱性を検出し、OWASP Top 10などの基準に基づいてレビューします。

## 使用方法

```
/security-review [ファイルパス（省略可）]
```

## 概要

`/security-review` コマンドは、Security Reviewerエージェントを呼び出し、コードのセキュリティ脆弱性を包括的にチェックします。機密情報の漏洩、インジェクション攻撃、認証・認可の問題などを検出し、修正方法を提案します。ファイルパスを省略した場合は変更されたファイルを対象にします。

## いつ使うか

- **Pull Request前**: 本番環境へのデプロイ前のセキュリティチェック
- **新機能実装後**: 認証、データベース操作、外部API連携を含む機能の実装時
- **脆弱性発見時**: 影響範囲の調査
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
- レビュー対象: src/auth/login.ts
- 総脆弱性数: 2件（High: 1件、Medium: 1件）

## High Vulnerabilities

### 1. 認証の強度不足
- **ファイル**: `src/auth/login.ts:30`
- **脆弱性タイプ**: A07:2021 - Identification and Authentication Failures
- **説明**: パスワード検証が弱く、簡単なパスワードを許可している
- **推奨**: 最小8文字、英字・数字・記号を含む正規表現でバリデーション追加

## Medium Vulnerabilities

### 1. セッションタイムアウトの欠如
- **ファイル**: `src/auth/login.ts:50`
- **脆弱性タイプ**: A07:2021 - Identification and Authentication Failures
- **推奨**: `jwt.sign` に `{ expiresIn: '1h' }` を追加

## 総評
High 1件は直ちに修正が必要です。
```

## 関連エージェント

- **security-reviewer**: このコマンドが呼び出すエージェント（`agents/development/security-reviewer.md`）

## 詳細情報

詳細は [skills/security-review/SKILL.md](../skills/security-review/SKILL.md) を参照してください。
