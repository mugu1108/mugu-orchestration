# テスト: security-reviewer実装確認

## 目的

security-reviewerエージェント、コマンド、スキルの実装が正しく完了していることを確認するテスト。

## テスト日時

2026-01-26

## 実装内容

### 1. エージェント定義

- **ファイル**: `agents/security-reviewer.md`
- **役割**: コードのセキュリティ脆弱性を検出し、OWASP Top 10に基づいてレビュー
- **レビュー項目**:
  1. 認証と認可
  2. インジェクション攻撃
  3. XSS (Cross-Site Scripting)
  4. 機密情報の漏洩
  5. CSRF (Cross-Site Request Forgery)
  6. セキュアな通信
  7. ファイルアップロード
  8. 依存関係のセキュリティ

### 2. コマンド定義

- **ファイル**: `commands/security-review.md`
- **使用方法**: `/security-review [ファイルパス（省略可）]`
- **機能**:
  - 特定ファイルのセキュリティレビュー
  - プロジェクト全体のセキュリティスキャン
  - 機密情報の漏洩チェック（API key、パスワードなど）
  - OWASP Top 10に基づくチェック

### 3. スキル登録

- **ファイル**: `skills/security-review/SKILL.md`
- **トリガーワード**: "security-review", "セキュリティレビュー", "セキュリティチェック", "脆弱性スキャン"
- **カテゴリ**: analysis
- **必要なツール**: Read, Grep, Glob, Task, Bash

### ファイル構成

```
mugu-orchestration/
├── agents/
│   └── security-reviewer.md (既存)
├── commands/
│   └── security-review.md (新規作成)
└── skills/security-review/
    └── SKILL.md (新規作成)
```

## セキュリティレビュープロセス

### ワークフロー

1. **レビュー対象の特定**
   - ファイルパス指定: 指定されたファイルをレビュー
   - 省略時: git statusから変更ファイルを自動検出

2. **機密情報スキャン**
   - Grepでパターンマッチング
   - "sk-"で始まる文字列（API key）
   - JWT形式の文字列
   - ハードコードされたパスワード

3. **Security Reviewerエージェントの呼び出し**
   - Taskツールで`general-purpose`エージェントを起動
   - `agents/security-reviewer.md`の指示に従って実行

4. **セキュリティチェック実施**
   - OWASP Top 10に基づくチェック
   - 脆弱性を重要度別に分類（Critical、High、Medium、Low）

5. **レポート生成**
   - マークダウン形式でレビュー結果を出力
   - 脆弱性の説明、攻撃シナリオ、修正方法を含む

## レビュー結果のフォーマット

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

## OWASP Top 10 マッピング

Security Reviewerエージェントは、OWASP Top 10 (2021) に基づいてレビューを実施します:

1. **A01:2021 - Broken Access Control**: 認可チェックの欠如、RLS未設定
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
- Service Keyの適切な管理
- Anonキーの使用とRLSによる保護

参照: `rules/security.md`

### 環境変数管理
- `.env`ファイルを`.gitignore`に追加
- `.env.example`にダミー値のみ
- 全てのAPI keyを環境変数から読み込み

### APIセキュリティ
- レート制限の設定
- JWT検証
- CORSの適切な設定

## 結論

✅ **実装完了**: security-reviewerエージェント、コマンド、スキル登録が完了した。

### 確認事項

- ✅ エージェント定義ファイルが存在する
- ✅ コマンド定義ファイルが作成された
- ✅ スキル登録ファイルが作成された
- ✅ セキュリティレビュープロセスが文書化されている
- ✅ OWASP Top 10に基づくチェックリストが定義されている
- ✅ mugu-orchestration固有のセキュリティ基準が定義されている

## ロードマップ更新

以下の項目を完了としてマーク:

- ✅ security-reviewer エージェント
- ✅ /security-review コマンド（コマンド定義として実装）

## 次のステップ

フェーズ2の残りのコンポーネント:

- ✅ doc-updater エージェント（実装完了）

## 関連ファイル

- `agents/security-reviewer.md` - エージェント定義
- `commands/security-review.md` - コマンド定義
- `skills/security-review/SKILL.md` - スキル登録
- `rules/security.md` - セキュリティガイドライン

## セキュリティインシデント対応手順

脆弱性が発見された場合:

1. **作業停止**: 直ちに作業を中断
2. **影響範囲特定**: 同様の脆弱性を全体チェック
3. **修正実施**: Critical/Highを優先的に修正
4. **認証情報ローテーション**: 露出した認証情報を無効化・再生成
5. **再レビュー**: 修正後、再度セキュリティレビューを実施
6. **ドキュメント更新**: インシデント対応を記録
