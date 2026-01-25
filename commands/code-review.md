# /code-review - コードレビューコマンド

**説明**: コードの品質、可読性、保守性を自動的にレビューします。

## 使用方法

```
/code-review [ファイルパス（省略可）]
```

## 概要

`/code-review` コマンドは、Code Reviewerエージェントを呼び出し、コードの品質を包括的にチェックします。ベストプラクティスへの準拠、潜在的なバグ、パフォーマンス問題を検出し、改善提案を行います。

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
- レビュー日時: 2026-01-26 10:00
- レビュー対象: src/invoicing/invoice-generator.ts
- 総問題数: 3件
  - High: 1件
  - Medium: 2件

## High Issues 🟠

### 1. エラーハンドリングの欠如
- **ファイル**: `src/invoicing/invoice-generator.ts:45`
- **説明**: Supabaseからのデータ取得でエラーハンドリングがない
- **推奨**: try-catchブロックを追加
- **例**:
  ```typescript
  // Before
  const { data } = await supabase.from('time_entries').select('*');

  // After
  try {
    const { data, error } = await supabase.from('time_entries').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch time entries:', error);
    throw new Error('データ取得に失敗しました');
  }
  ```

## Medium Issues 🟡

### 1. 関数が長すぎる
- **ファイル**: `src/invoicing/invoice-generator.ts:100-180`
- **説明**: generateInvoice関数が80行あり、複数の責任を持っている
- **推奨**: 小さな関数に分割
  - fetchTimeEntries()
  - calculateTotal()
  - formatInvoiceData()
  - generatePDF()

### 2. マジックナンバーの使用
- **ファイル**: `src/invoicing/invoice-generator.ts:125`
- **説明**: 定数として定義すべき値が直接記述されている
- **推奨**: 定数を定義
  ```typescript
  // Before
  const tax = total * 0.1;

  // After
  const TAX_RATE = 0.1;
  const tax = total * TAX_RATE;
  ```

## ベストプラクティス提案
- エラーハンドリングを全てのデータ取得処理に追加
- 関数を小さく保つ（推奨: 50行以下）
- 定数は大文字のスネークケースで定義

## 総評
全体的にコードの構造は良好ですが、エラーハンドリングの追加と関数の分割を行うことで、より保守性が向上します。
```

### 例2: 変更されたファイルのレビュー

```
/code-review
```

**出力**:
```markdown
# コードレビュー結果

## サマリー
- レビュー日時: 2026-01-26 14:00
- レビュー対象: 変更されたファイル（3件）
  - src/auth/login.ts
  - src/auth/register.ts
  - src/auth/auth-utils.ts
- 総問題数: 5件
  - Medium: 3件
  - Low: 2件

## Medium Issues 🟡

### 1. パスワードバリデーションの不足
- **ファイル**: `src/auth/register.ts:30`
- **説明**: パスワードの強度チェックが不十分
- **推奨**: 最小文字数、特殊文字の要求を追加

### 2. 重複したエラーハンドリング
- **ファイル**: `src/auth/login.ts:50`, `src/auth/register.ts:45`
- **説明**: 同じエラーハンドリングコードが複数箇所にある
- **推奨**: auth-utils.tsに共通関数を作成

### 3. テストの不足
- **ファイル**: `src/auth/auth-utils.ts`
- **説明**: 新しい共通関数にテストがない
- **推奨**: ユニットテストを追加

## Low Issues ⚪

### 1. コメントの不足
- **ファイル**: `src/auth/auth-utils.ts:15`
- **説明**: 複雑なロジックにコメントがない
- **推奨**: JWT検証ロジックにコメントを追加

### 2. 型定義の改善
- **ファイル**: `src/auth/login.ts:20`
- **説明**: any型の使用
- **推奨**: 適切な型を定義

## 総評
リファクタリングの方向性は良好です。エラーハンドリングの統合とテストの追加を行うことで、より品質の高いコードになります。
```

### 例3: セキュリティ重視のレビュー

```
/code-review --security src/api/users.ts
```

**出力**:
```markdown
# コードレビュー結果（セキュリティ重視）

## サマリー
- レビュー対象: src/api/users.ts
- セキュリティ重視モード
- 総問題数: 2件
  - Critical: 1件
  - High: 1件

## Critical Issues 🔴

### 1. 認可チェックの欠如
- **ファイル**: `src/api/users.ts:25`
- **説明**: 他のユーザーのデータを取得できる（Broken Access Control）
- **攻撃シナリオ**: 攻撃者がユーザーIDを変更して他人の情報を取得
- **推奨**: 認可チェックを追加
  ```typescript
  // Before
  const { data } = await supabase.from('users').select('*').eq('id', userId);

  // After
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .eq('id', auth.uid()); // 自分のデータのみ取得
  ```

## High Issues 🟠

### 1. SQLインジェクションのリスク
- **ファイル**: `src/api/users.ts:40`
- **説明**: ユーザー入力を直接クエリに使用
- **推奨**: パラメータ化クエリを使用
```

## レビュー項目

### 1. コードスタイル
- フォーマット、命名規則、コメント、構造

### 2. ベストプラクティス
- 関数型プログラミング、エラーハンドリング、型安全性

### 3. パフォーマンス
- アルゴリズム効率、メモリ使用、データベースクエリ

### 4. 可読性と保守性
- 関数の長さ、複雑度、重複コード

### 5. テスタビリティ
- 依存性注入、副作用の分離、モック可能性

### 6. ドキュメント
- コードコメント、型定義、README更新

## オプション

- `--security`: セキュリティに重点を置いたレビュー
- `--performance`: パフォーマンスに重点を置いたレビュー
- `--style`: コーディングスタイルに重点を置いたレビュー

```
/code-review --security src/auth/
/code-review --performance src/database/
/code-review --style src/
```

## ベストプラクティス

1. **段階的なレビュー**: 小さな変更を頻繁にレビュー
2. **優先順位付け**: Critical/Highを優先的に修正
3. **学習機会**: レビュー結果から学ぶ
4. **自動化**: 定期的な自動レビュー（CI/CD）

## チェックリスト

### コミット前
- [ ] ESLintエラーがないか
- [ ] TypeScriptコンパイルエラーがないか
- [ ] テストが全て通過するか
- [ ] コーディングスタイルに準拠しているか

### Pull Request前
- [ ] コードレビューを実施
- [ ] セキュリティレビューを実施
- [ ] ドキュメントを更新
- [ ] 変更ログを記録

## 関連エージェント

- **code-reviewer**: このコマンドが呼び出すエージェント
- **security-reviewer**: セキュリティ面の詳細レビュー
- **planner**: 実装計画の品質チェック
- **doc-updater**: ドキュメント更新の提案

## モデル選択

コードレビューには、バランスの取れた**Sonnet**モデルの使用を推奨します。

## 詳細情報

詳細は [agents/code-reviewer.md](../agents/code-reviewer.md) を参照してください。

## 注意事項

- レビューは補助ツールであり、人間の判断を置き換えるものではない
- プロジェクト固有のコンテキストを考慮
- 過度な完璧主義を避け、実用的なバランスを保つ
