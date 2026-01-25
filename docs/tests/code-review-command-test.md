# テスト: /code-review コマンドの実装確認

## 目的

実装した `/code-review` コマンドとcode-reviewerエージェントの構成を確認するテスト。

## テスト日時

2026-01-26

## 実装内容

### 1. エージェント定義

- **ファイル**: `agents/code-reviewer.md`
- **役割**: コード品質、可読性、保守性の自動レビュー
- **レビュー項目**:
  1. コードスタイル
  2. ベストプラクティス
  3. パフォーマンス
  4. 可読性と保守性
  5. テスタビリティ
  6. ドキュメント

### 2. コマンド定義

- **ファイル**: `commands/code-review.md`
- **使用方法**: `/code-review [ファイルパス（省略可）]`
- **機能**:
  - 特定ファイルのレビュー
  - 変更されたファイルの自動検出とレビュー
  - セキュリティ、パフォーマンス、スタイルに重点を置いたレビュー

### 3. スキル登録

- **ファイル**: `skills/code-review/SKILL.md`
- **トリガーワード**: "code-review", "コードレビュー", "レビュー実行", "品質チェック"
- **カテゴリ**: analysis
- **必要なツール**: Read, Grep, Glob, Task

### ファイル構成

```
agents/
└── code-reviewer.md

commands/
└── code-review.md

skills/code-review/
└── SKILL.md
```

## レビュープロセス

### ワークフロー

1. **レビュー対象の特定**
   - ファイルパス指定: 指定されたファイルをレビュー
   - 省略時: git statusから変更ファイルを自動検出

2. **Code Reviewerエージェントの呼び出し**
   - Taskツールで`general-purpose`エージェントを起動
   - `agents/code-reviewer.md`の指示に従って実行

3. **レビュー実施**
   - コードスタイル、ベストプラクティス、パフォーマンスなどをチェック
   - 問題を重要度別に分類（Critical、High、Medium、Low）

4. **レポート生成**
   - マークダウン形式でレビュー結果を出力
   - 問題点、推奨事項、コード例を含む

## レビュー結果のフォーマット

```markdown
# コードレビュー結果

## サマリー
- レビュー対象: [ファイルリスト]
- 総問題数: X件
  - Critical: X件
  - High: X件
  - Medium: X件
  - Low: X件

## Critical Issues 🔴
[重大な問題]

## High Issues 🟠
[重要な問題]

## Medium Issues 🟡
[中程度の問題]

## Low Issues ⚪
[軽微な問題]

## ベストプラクティス提案
[改善提案]

## 総評
[全体的な評価]
```

## mugu-orchestration固有のレビュー基準

### Supabaseコード
- RLSポリシーの適切な設定
- クエリ最適化
- エラーハンドリング

### Marpスライド
- ビジュアル階層への準拠
- アクセシビリティ（コントラスト、フォントサイズ）
- テンプレート整合性

### セキュリティ
- API key管理（.envファイルの使用）
- 入力バリデーション
- XSS/SQL Injection対策

参照: `rules/security.md`

### テスト
- カバレッジ 80%以上の目標
- 意味のあるテストケース
- 高速なテスト実行

参照: `rules/testing.md`

## 結論

✅ **実装完了**: `/code-review` コマンド、code-reviewerエージェント、およびスキル登録が完了した。

### 確認事項

- ✅ エージェント定義ファイルが存在する
- ✅ コマンド定義ファイルが存在する
- ✅ スキル登録ファイルが作成された
- ✅ レビュープロセスが文書化されている
- ✅ mugu-orchestration固有のレビュー基準が定義されている

## ロードマップ更新

以下の項目を完了としてマーク:

- ✅ code-reviewer エージェント
- ✅ /code-review コマンド

## 次のステップ

フェーズ2の残りのコンポーネント:

- [ ] security-reviewer エージェント
- [ ] doc-updater エージェント

## 関連ファイル

- `agents/code-reviewer.md` - エージェント定義
- `commands/code-review.md` - コマンド定義
- `skills/code-review/SKILL.md` - スキル登録
- `rules/coding-style.md` - コーディングスタイルガイド
- `rules/security.md` - セキュリティガイドライン
- `rules/testing.md` - テスト戦略
