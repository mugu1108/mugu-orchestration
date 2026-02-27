# mugu-orchestration

## プロジェクト概要

エージェントオーケストレーションシステム。Slack Bot、スライド生成、コードレビューなど複数のAIエージェントを統合管理。

## アーキテクチャ

```
src/
├── bots/           # Slack Bot実装
│   ├── time-tracker/
│   └── daily-briefing/
├── lib/
│   └── supabase/   # Supabase連携
└── services/       # 共通サービス
```

## エージェント運用

| コマンド | エージェント | 用途 |
|---------|-------------|------|
| `/plan` | Planner | 実装計画作成 |
| `/code-review` | Code Reviewer | コード品質チェック |
| `/slide` | Slide Creator | Marpスライド生成 |

## ビルド・実行

```bash
npm run build          # TypeScriptコンパイル
npm run time-tracker   # Time Tracker Bot起動
npm run lint           # ESLint実行
npm run test           # Jestテスト実行
```

## Git運用

- コミット前に `npm run lint` を実行
- コミットメッセージは Conventional Commits 形式
- PRには必ずCode Reviewerを通す

## プロジェクト固有の注意点

- time_logsテーブルは分単位(duration_minutes)で記録
- Marpスライドは `skills/slide/references/` のガイドラインに準拠
- 月末処理は23:00 JST にcronで実行
