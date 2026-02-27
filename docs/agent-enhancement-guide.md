# エージェント強化ガイド

Claude Codeのベストプラクティスに基づいた、エージェント強化・量産のための実践ガイドです。

---

## 現状分析

### 現在の構成

```
mugu-orchestration/
├── agents/              # 9エージェント定義済み
├── rules/               # 4つのルールファイル
├── skills/              # スキル定義
└── .claude/
    └── settings.local.json  # 権限設定のみ
```

### 足りていないもの

| 項目 | 現状 | 推奨 |
|------|------|------|
| CLAUDE.md | なし | 必須 |
| .claude/rules/ | なし | 推奨 |
| agent-memory/ | なし | 推奨 |
| エージェントのフロントマター | なし | 推奨 |

---

## 強化戦略

### 1. CLAUDE.md の作成（最重要）

プロジェクト全体の指示をClaudeに伝えるファイル。

**作成場所**: `CLAUDE.md` または `.claude/CLAUDE.md`

```markdown
# mugu-orchestration

## コーディングスタイル
- TypeScript strict mode 必須
- 関数型プログラミング優先（不変性を重視）
- 関数は50行以下に保つ
- ESModules (import/export) を使用

## アーキテクチャ
- Supabase RLS (Row Level Security) ポリシーを必ず確認
- API キーは必ず .env で管理
- Slack Bot は Socket Mode を使用

## エージェント運用
- 計画: Planner エージェント (/plan)
- 実装後: Code Reviewer (/code-review)
- セキュリティ: Security Reviewer
- ドキュメント: Doc Updater

## 重要な制約
- API キーをコードに埋め込まない
- マイグレーションは必ずバージョン管理
- 本番DBで直接テストしない

## ビルド・テスト
- `npm run build` - TypeScriptコンパイル
- `npm run time-tracker` - Time Tracker Bot起動
```

### 2. エージェントのフロントマター追加

各エージェントMDの先頭に設定を追加することで、Claudeが適切に判断できるようになります。

**Before（現在）:**
```markdown
# Planner Agent - 実装計画エージェント

## 概要
...
```

**After（推奨）:**
```markdown
---
name: planner
description: 複雑な機能や実装タスクの詳細な計画を作成する専門エージェント
model: opus
tools: Read, Grep, Glob, Task, Write
---

# Planner Agent - 実装計画エージェント

## 概要
...
```

### フロントマター設定項目

| 項目 | 説明 | 例 |
|------|------|-----|
| `name` | エージェント識別子 | `planner` |
| `description` | 役割説明（委譲判断に使用） | `複雑な機能の実装計画を作成` |
| `model` | 使用モデル | `opus`, `sonnet`, `haiku` |
| `tools` | 許可ツール | `Read, Grep, Glob, Task` |
| `memory` | メモリ種別 | `project`, `user`, `local` |
| `skills` | 参照スキル | `[code-style, testing]` |

### 3. エージェントメモリの導入

エージェントが学習・記憶するための仕組み。

**ディレクトリ構造:**
```
.claude/agent-memory/
├── code-reviewer/
│   ├── MEMORY.md          # インデックス（200行以内）
│   ├── patterns.md        # よく見つかるパターン
│   └── common-issues.md   # よくある問題
├── planner/
│   ├── MEMORY.md
│   └── architecture-decisions.md
└── security-reviewer/
    ├── MEMORY.md
    └── vulnerability-patterns.md
```

**MEMORY.md の例:**
```markdown
# Code Reviewer Agent Memory

## よく見つかるパターン
- Supabaseクエリでのnullチェック漏れ
- async/awaitでのエラーハンドリング不足
- 型定義の不完全さ

## プロジェクト固有の注意点
- RLSポリシーは必ずuser_idでフィルタ
- time_logsテーブルは分単位で記録

## 過去の重要なレビュー指摘
- 2026-01: Invoice生成でのタイムゾーン処理
- 2026-02: Slack Bot のレート制限対応

[詳細は patterns.md を参照]
```

### 4. モジュール化ルール（.claude/rules/）

条件付きで適用されるルールを分離。

**ディレクトリ構造:**
```
.claude/rules/
├── api.md           # API開発時のルール
├── database.md      # DB操作時のルール
├── slack-bot.md     # Slack Bot開発時のルール
└── marp-slides.md   # スライド生成時のルール
```

**api.md の例:**
```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/routes/**/*.ts"
---

# API開発ルール

- 入力バリデーションを必ず実装
- エラーレスポンスは統一フォーマット
- OpenAPI仕様書を更新
```

---

## エージェント設計パターン

### パターン A: ペルソナ駆動型

明確なキャラクター・専門性を定義。

```markdown
---
name: security-reviewer
description: セキュリティ脆弱性を専門的に分析
model: opus
---

You are a senior security engineer with 15 years of experience in:
- OWASP Top 10 vulnerabilities
- Authentication and authorization systems
- API security best practices

When reviewing code:
1. Check for injection vulnerabilities
2. Verify authentication flows
3. Assess data exposure risks
4. Review RLS policies for Supabase
```

### パターン B: メモリ活用型

過去の知識を蓄積・活用。

```markdown
---
name: code-reviewer
description: コード品質・可読性・保守性をレビュー
model: sonnet
memory: project
---

Before reviewing, consult your memory about:
- Project coding patterns
- Common issues found before
- Architecture decisions

After reviewing, update your memory with:
- New patterns discovered
- Recurring issues
- Important decisions made
```

### パターン C: スキル統合型

再利用可能なスキルを参照。

```markdown
---
name: planner
description: 実装計画を作成
model: opus
skills:
  - code-conventions
  - testing-strategy
  - architecture-patterns
---

Create implementation plans following the preloaded skills.
```

---

## 推奨エージェント追加リスト

現在の9体に加えて追加を検討できるエージェント:

| エージェント | 役割 | 優先度 |
|-------------|------|--------|
| **Architect** | アーキテクチャ設計・レビュー | 高 |
| **Performance Optimizer** | パフォーマンス最適化 | 中 |
| **Tech Debt Analyzer** | 技術的負債の特定 | 中 |
| **Test Generator** | テストコード自動生成 | 中 |
| **Migration Helper** | DBマイグレーション支援 | 低 |
| **Onboarding Guide** | 新規開発者向けガイド | 低 |

---

## 実装チェックリスト

### Phase 1: 基盤整備（今すぐ）

```
□ CLAUDE.md を作成
□ .claude/rules/ ディレクトリを作成
□ 既存エージェントにフロントマターを追加
```

### Phase 2: メモリ導入（1週間以内）

```
□ .claude/agent-memory/ ディレクトリを作成
□ 主要エージェント（planner, code-reviewer）のMEMORY.mdを作成
□ セッション後にメモリを更新する習慣化
```

### Phase 3: 新エージェント追加（継続的）

```
□ 新エージェントはテンプレートに従って作成
□ 必ずdescriptionを具体的に記述
□ ツールは必要最小限に制限
□ テスト後にメモリを初期化
```

---

## エージェント作成テンプレート

新しいエージェントを追加する際のテンプレート:

```markdown
---
name: {agent-name}
description: {具体的な役割説明 - Claudeが委譲判断に使用}
model: {opus|sonnet|haiku}
tools: {Read, Grep, Glob, Task, Write, Bash など必要最小限}
memory: {project|user|local}
skills:
  - {関連スキル1}
  - {関連スキル2}
---

# {Agent Name} - {日本語名}

## 概要

{エージェントの目的と専門性を1-2段落で説明}

## ペルソナ

You are a {専門家の種類} with expertise in:
- {専門分野1}
- {専門分野2}
- {専門分野3}

## 使用タイミング

以下の場合に使用:
1. {ユースケース1}
2. {ユースケース2}
3. {ユースケース3}

## ワークフロー

### Step 1: {ステップ名}
{詳細}

### Step 2: {ステップ名}
{詳細}

### Step 3: {ステップ名}
{詳細}

## 出力フォーマット

{期待される出力形式を明示}

## 他のエージェントとの連携

- **{エージェント名}**: {どのように連携するか}

## コマンド

```
/{command-name} [オプション]
```

## 注意事項

- {重要な制約1}
- {重要な制約2}
```

---

## ベストプラクティス vs アンチパターン

### ベストプラクティス

| 項目 | 説明 |
|------|------|
| **Single Responsibility** | 1エージェント = 1専門性 |
| **Clear Description** | descriptionは具体的に（委譲判断に影響） |
| **Tool Minimization** | 必要最小限のツールのみ許可 |
| **Memory Discipline** | MEMORY.mdは200行以内に維持 |
| **Skill Reuse** | 共通知識はスキルとして定義 |

### アンチパターン

| 項目 | 説明 |
|------|------|
| **Omnipotent Agent** | 1エージェントに全責任を持たせる |
| **Vague Description** | 「コードを助ける」のような曖昧な説明 |
| **Tool Bloat** | 全ツールを許可 |
| **Memory Bloat** | メモリを無制限に肥大化させる |
| **Duplication** | 同じ知識を複数エージェントで重複定義 |

---

## 参考リソース

- [Claude Code Sub-agents](https://docs.anthropic.com/claude-code/sub-agents)
- [Memory Management](https://docs.anthropic.com/claude-code/memory)
- [Best Practices](https://docs.anthropic.com/claude-code/best-practices)
