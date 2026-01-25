# everything-claude-code との統合分析

## リポジトリ概要

**everything-claude-code** (https://github.com/affaan-m/everything-claude-code)
- Anthropic ハッカソン優勝者による10ヶ月以上の実運用から進化したClaude Codeプラグインコレクション
- 本番対応のエージェント、スキル、フック、コマンド、ルール、MCP設定を提供

## 主要コンポーネント

### 1. Agents（専門化されたサブエージェント）
- **planner.md** - 機能実装計画（Opus使用）
- **architect.md** - システム設計判断
- **code-reviewer.md** - 品質・セキュリティレビュー
- **security-reviewer.md** - 脆弱性分析
- **e2e-runner.md** - Playwright E2Eテスト自動化
- **refactor-cleaner.md** - デッドコード除去
- **doc-updater.md** - ドキュメント同期
- **tdd-guide.md** - TDD開発支援
- **build-error-resolver.md** - ビルドエラー解決

### 2. Skills（ワークフロー定義）
- **coding-standards/** - 言語別ベストプラクティス
- **backend-patterns/** - API・DB・キャッシング パターン
- **frontend-patterns/** - React・Next.js パターン
- **tdd-workflow/** - テスト駆動開発方法論（80%カバレッジ要件）
- **security-review/** - セキュリティレビューチェックリスト
- **continuous-learning/** - 継続的学習ループ
- **verification-loop/** - 検証ループ処理
- **strategic-compact/** - 戦略的コンパクション

### 3. Commands（スラッシュコマンド）
- `/tdd` - テスト駆動開発ワークフロー
- `/plan` - 実装計画作成
- `/e2e` - E2Eテスト生成
- `/code-review` - 品質レビュー
- `/build-fix` - ビルドエラー修正
- `/refactor-clean` - コードクリーンアップ
- `/setup-pm` - パッケージマネージャー設定
- `/checkpoint` - チェックポイント作成
- `/verify` - 検証実行

### 4. Rules（常時適用ガイドライン）
- **security.md** - セキュリティ必須事項（API keyハードコード禁止、入力検証）
- **coding-style.md** - イミュータビリティ、ファイル整理（200-400行、最大800行）
- **testing.md** - TDD・80%カバレッジ要件
- **git-workflow.md** - コミット形式・PRプロセス
- **agents.md** - エージェント委譲基準
- **performance.md** - パフォーマンス最適化

### 5. Hooks（イベント駆動自動化）
- **PreToolUse** - ツール実行前の検証
  - 開発サーバー起動のtmux制限
  - 長時間実行コマンドの警告
  - git push前確認
  - 不要なドキュメント生成ブロック
- **PostToolUse** - ツール実行後の処理
  - GitHub PRリンク自動抽出
  - JavaScript/TypeScriptの自動フォーマット
  - 型チェック実行
  - console.log警告
- **SessionStart/SessionEnd** - セッション管理
  - 前回コンテキスト復元
  - パッケージマネージャー自動検出
  - セッション状態永続化

### 6. Scripts（クロスプラットフォーム実装）
- Node.jsベースのユーティリティ
- パッケージマネージャー検出・選択
- セッションライフサイクル管理
- パターン抽出
- 戦略的コンパクション推奨

## mugu-orchestration への統合推奨事項

### 優先度: 高（即座に取り入れるべき）

#### 1. Rules（ルール）の導入
**目的**: 一貫性のあるコード品質とセキュリティ基準を確立

**実装方法**:
```
mugu-orchestration/
├── rules/
│   ├── security.md          # セキュリティ必須事項
│   ├── coding-style.md      # コーディングスタイル
│   ├── testing.md           # テスト基準
│   ├── git-workflow.md      # Gitワークフロー
│   └── performance.md       # パフォーマンス最適化
```

**取り入れる内容**:
- API keyのハードコード禁止
- イミュータビリティ原則
- ファイルサイズ制限（200-400行推奨、800行上限）
- 入力検証の必須化
- エラーハンドリング標準

#### 2. Agents（エージェント）の追加
**目的**: 専門化されたタスク処理の効率化

**優先的に追加すべきエージェント**:
1. **planner.md** - 複雑な機能の実装計画
2. **code-reviewer.md** - コードレビュー自動化
3. **security-reviewer.md** - セキュリティチェック
4. **doc-updater.md** - ドキュメント同期

**実装方法**:
```
mugu-orchestration/
├── agents/
│   ├── planner.md
│   ├── code-reviewer.md
│   ├── security-reviewer.md
│   └── doc-updater.md
```

**エージェントフォーマット**:
```markdown
---
name: planner
description: Expert planning specialist for complex features
tools: [Read, Grep, Glob]
model: opus
---

# Agent Instructions
[詳細な指示]
```

#### 3. Hooks（フック）の実装
**目的**: 自動化とワークフロー効率化

**優先的に実装すべきフック**:
- **SessionStart**: コンテキスト復元、パッケージマネージャー検出
- **SessionEnd**: セッション状態保存
- **PreToolUse**: git push前確認、長時間コマンド警告
- **PostToolUse**: 自動フォーマット、型チェック

**実装方法**:
```
mugu-orchestration/
├── hooks/
│   ├── hooks.json          # フック設定
│   ├── session-start.js    # セッション開始処理
│   ├── session-end.js      # セッション終了処理
│   └── pre-git-push.js     # git push前確認
```

### 優先度: 中（段階的に取り入れる）

#### 4. Commands（コマンド）の追加
**目的**: 頻繁に使用するワークフローの効率化

**推奨コマンド**:
- `/plan` - 実装計画作成
- `/code-review` - コードレビュー実行
- `/build-fix` - ビルドエラー修正
- `/verify` - 検証実行

**実装方法**:
```
mugu-orchestration/
├── commands/
│   ├── plan.md
│   ├── code-review.md
│   ├── build-fix.md
│   └── verify.md
```

#### 5. Skills（スキル）の拡充
**目的**: ドメイン知識とパターンの体系化

**追加すべきスキル**:
- **coding-standards/** - 言語別ベストプラクティス
- **security-review/** - セキュリティチェックリスト
- **verification-loop/** - 検証ループパターン

**実装方法**:
```
mugu-orchestration/
├── skills/
│   ├── meta-skill/         # 既存
│   ├── coding-standards/   # 新規
│   ├── security-review/    # 新規
│   └── verification-loop/  # 新規
```

### 優先度: 低（将来的に検討）

#### 6. TDD Workflow の完全実装
- 80%カバレッジ要件
- RED → GREEN → REFACTOR サイクル
- `/tdd` コマンド

#### 7. E2E Testing Automation
- Playwright統合
- `/e2e` コマンド
- e2e-runner エージェント

#### 8. Continuous Learning System
- パターン抽出
- ナレッジベース構築

## 統合実装プラン

### フェーズ1: 基盤整備（1-2週間）
1. ✅ ドキュメント日本語化（完了）
2. Rules の導入
   - security.md
   - coding-style.md
   - git-workflow.md
3. Hooks の基本実装
   - hooks.json設定
   - session-start.js
   - session-end.js

### フェーズ2: エージェント追加（2-3週間）
1. planner エージェント
2. code-reviewer エージェント
3. security-reviewer エージェント
4. doc-updater エージェント

### フェーズ3: コマンド・スキル拡充（3-4週間）
1. `/plan` コマンド
2. `/code-review` コマンド
3. coding-standards スキル
4. security-review スキル

### フェーズ4: 高度な機能（継続的）
1. TDD ワークフロー
2. E2E テスト自動化
3. Continuous Learning システム

## コンテキスト管理の注意点

**everything-claude-code** から重要な警告:
- 有効なMCPは最大10個程度に制限
- 200kコンテキストウィンドウが70kに縮小するリスク
- 20-30個のMCP設定を維持し、プロジェクトごとに10個以下を有効化
- ツールは80個以下のアクティブインスタンスに制限

## カスタマイズ推奨事項

1. **技術スタックに合わせた調整**
   - mugu-orchestrationは主にSupabase統合に焦点
   - everything-claude-codeはより汎用的
   - 両者の長所を組み合わせる

2. **日本語対応**
   - everything-claude-codeは英語
   - mugu-orchestrationは日本語
   - 統合時は日本語化を維持

3. **プロジェクト固有ニーズ**
   - セミナースライド生成（Marp）
   - 時間追跡（Slack/Discord）
   - 請求書生成
   - これらはmugu-orchestration固有の機能として維持

## 次のステップ

1. **即座に実装**: Rules + 基本Hooks
2. **1週間以内**: planner + code-reviewer エージェント
3. **2週間以内**: `/plan` + `/code-review` コマンド
4. **継続的**: スキルの段階的追加

## 参考リンク

- everything-claude-code: https://github.com/affaan-m/everything-claude-code
- Shorthand Guide: リポジトリ内の基礎ガイド
- Longform Guide: トークン最適化・並列化の詳細ガイド
