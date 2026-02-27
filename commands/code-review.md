# /code-review - コードレビューコマンド

**説明**: コードの品質、可読性、保守性を自動的にレビューします。

## 使用方法

```
/code-review [ファイルパス（省略可）]
```

## 概要

`/code-review` コマンドは、Code Reviewerエージェントを呼び出し、コードの品質を包括的にチェックします。ベストプラクティスへの準拠、潜在的なバグ、エラーハンドリングの欠如を検出し、改善提案を行います。ファイルパスを省略した場合は変更されたファイルを対象にします。

## いつ使うか

- **Pull Request前**: コミット前の最終確認
- **新機能実装後**: 実装完了時の品質確認
- **リファクタリング後**: 変更の検証
- **定期的なレビュー**: プロジェクト全体の品質維持

## 使用例

### 例1: 特定ファイルのレビュー

```
/code-review src/invoicing/invoice-generator.ts
```

**出力**:
```markdown
# コードレビュー結果

## サマリー
- レビュー対象: src/invoicing/invoice-generator.ts
- 総問題数: 3件（High: 1件、Medium: 2件）

## High Issues

### 1. エラーハンドリングの欠如
- **ファイル**: `src/invoicing/invoice-generator.ts:45`
- **説明**: Supabaseからのデータ取得でエラーハンドリングがない
- **推奨**: try-catchブロックを追加し、error を throw する

## Medium Issues

### 1. 関数が長すぎる
- **ファイル**: `src/invoicing/invoice-generator.ts:100-180`
- **推奨**: fetchTimeEntries / calculateTotal / generatePDF に分割

### 2. マジックナンバーの使用
- **ファイル**: `src/invoicing/invoice-generator.ts:125`
- **推奨**: `const TAX_RATE = 0.1;` として定数化

## 総評
エラーハンドリングの追加と関数の分割で保守性が向上します。
```

## 関連エージェント

- **code-reviewer**: このコマンドが呼び出すエージェント（`agents/development/code-reviewer.md`）

## 詳細情報

詳細は [skills/code-review/SKILL.md](../skills/code-review/SKILL.md) を参照してください。
