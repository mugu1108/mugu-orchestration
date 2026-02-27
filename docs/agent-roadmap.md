# エージェント拡張ロードマップ

ハイブリッド型エージェント組織の段階的拡張計画。

---

## 現在の構成（10体）

```
agents/
├── orchestrator.md              # 統括
├── development/                 # 開発チーム（4体）
│   ├── planner.md
│   ├── code-reviewer.md
│   ├── security-reviewer.md
│   └── doc-updater.md
├── business/                    # ビジネスチーム（3体）
│   ├── time-tracker.md
│   ├── invoice-generator.md
│   └── daily-briefing.md
└── content/                     # コンテンツチーム（2体）
    ├── slide-creator.md
    └── slide-reviewer.md
```

---

## Phase 1: 開発強化（+3体 → 計13体）

### 追加エージェント

| エージェント | 役割 | 優先度 |
|-------------|------|--------|
| **Architect** | 設計・アーキテクチャ決定 | 高 |
| **Implementer** | コード実装支援 | 高 |
| **Test Generator** | テストコード自動生成 | 中 |

### Architect

```markdown
agents/development/architect.md

役割:
- システム設計
- アーキテクチャ決定
- 技術選定
- 設計レビュー

トリガー:
- 「設計して」「アーキテクチャ」「構成を考えて」
```

### Implementer

```markdown
agents/development/implementer.md

役割:
- コード実装
- リファクタリング
- バグ修正
- 機能追加

トリガー:
- 「実装して」「コードを書いて」「修正して」
```

### Test Generator

```markdown
agents/development/test-generator.md

役割:
- ユニットテスト生成
- 統合テスト生成
- テストケース設計
- カバレッジ向上

トリガー:
- 「テストを書いて」「テスト生成」「カバレッジ」
```

---

## Phase 2: ビジネス強化（+3体 → 計16体）

### 追加エージェント

| エージェント | 役割 | 優先度 |
|-------------|------|--------|
| **Meeting Summarizer** | 議事録作成 | 高 |
| **Email Drafter** | メール下書き | 中 |
| **Task Prioritizer** | タスク優先順位付け | 中 |

### Meeting Summarizer

```markdown
agents/business/meeting-summarizer.md

役割:
- 議事録作成
- アクションアイテム抽出
- 決定事項まとめ
- フォローアップ提案

トリガー:
- 「議事録」「MTGまとめ」「会議の内容を」
```

### Email Drafter

```markdown
agents/business/email-drafter.md

役割:
- ビジネスメール作成
- 返信文作成
- トーン調整
- 多言語対応

トリガー:
- 「メールを書いて」「返信を」「ビジネスメール」
```

### Task Prioritizer

```markdown
agents/business/task-prioritizer.md

役割:
- タスク優先順位付け
- 緊急度・重要度マトリクス
- スケジュール提案
- リソース配分

トリガー:
- 「優先順位を」「何から始める」「タスク整理」
```

---

## Phase 3: コンテンツ強化（+3体 → 計19体）

### 追加エージェント

| エージェント | 役割 | 優先度 |
|-------------|------|--------|
| **Blog Writer** | ブログ記事作成 | 中 |
| **SNS Manager** | SNS投稿管理 | 低 |
| **Video Script Writer** | 動画台本作成 | 低 |

### Blog Writer

```markdown
agents/content/blog-writer.md

役割:
- 技術ブログ記事作成
- SEO最適化
- 構成提案
- 校正・編集

トリガー:
- 「ブログを書いて」「記事作成」「Qiita」「Zenn」
```

### SNS Manager

```markdown
agents/content/sns-manager.md

役割:
- SNS投稿文作成
- ハッシュタグ提案
- 投稿スケジュール
- エンゲージメント分析

トリガー:
- 「SNS投稿」「ツイート」「LinkedIn」
```

### Video Script Writer

```markdown
agents/content/video-script-writer.md

役割:
- 動画台本作成
- ナレーション文
- シーン構成
- 字幕テキスト

トリガー:
- 「動画の台本」「YouTube」「解説動画」
```

---

## Phase 4: リサーチチーム新設（+4体 → 計23体）

### 新規チーム

```
agents/research/                 # リサーチチーム（新設）
├── tech-researcher.md
├── competitor-analyst.md
├── trend-watcher.md
└── paper-reader.md
```

### 追加エージェント

| エージェント | 役割 | 優先度 |
|-------------|------|--------|
| **Tech Researcher** | 技術調査 | 高 |
| **Competitor Analyst** | 競合分析 | 中 |
| **Trend Watcher** | トレンド監視 | 中 |
| **Paper Reader** | 論文読解 | 低 |

---

## Phase 5: 運用チーム新設（+3体 → 計26体）

### 新規チーム

```
agents/operations/               # 運用チーム（新設）
├── devops-engineer.md
├── incident-responder.md
└── monitoring-analyst.md
```

---

## 拡張スケジュール（目安）

| Phase | 期間 | エージェント数 | 主な追加 |
|-------|------|---------------|---------|
| 現在 | - | 10体 | 基盤完成 |
| Phase 1 | 1-2週間 | 13体 | 開発強化 |
| Phase 2 | 2-3週間 | 16体 | ビジネス強化 |
| Phase 3 | 1ヶ月後 | 19体 | コンテンツ強化 |
| Phase 4 | 1-2ヶ月後 | 23体 | リサーチ新設 |
| Phase 5 | 2-3ヶ月後 | 26体 | 運用新設 |

---

## エージェント追加テンプレート

新しいエージェントを追加する際のテンプレート:

```markdown
---
name: {agent-name}
description: {役割の簡潔な説明}
model: {opus|sonnet|haiku}
tools: {必要なツール}
---

# {Agent Name} - {日本語名}

## 概要
{1-2段落で説明}

## 使用タイミング
1. {ユースケース1}
2. {ユースケース2}

## ワークフロー
### Step 1: {ステップ名}
{詳細}

## 他のエージェントとの連携
- **{エージェント名}**: {連携方法}

## コマンド
```
/{command}
```
```

---

## 優先順位の判断基準

| 優先度 | 基準 |
|--------|------|
| **高** | 日常的に使う、手動作業が多い |
| **中** | 週1-2回使う、あると便利 |
| **低** | 月1回程度、将来的に必要 |

---

## 次のアクション

- [ ] Phase 1 の Architect エージェントを作成
- [ ] Phase 1 の Implementer エージェントを作成
- [ ] Phase 1 の Test Generator エージェントを作成
- [ ] Orchestrator の振り分けルールを更新
