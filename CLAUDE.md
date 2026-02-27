# mugu-orchestration

## プロジェクト概要

エージェントオーケストレーションシステム。Slack Bot、スライド生成、コードレビューなど複数のAIエージェントを統合管理。

---

## Workflow Orchestration

### 1. Plan Mode Default
- 非自明なタスク（3ステップ以上 or アーキテクチャ決定）は必ずPlan Modeに入る
- 途中で問題が発生したら、STOP して即座に再計画。無理に進めない
- 検証ステップにもPlan Modeを使う
- 曖昧さを減らすため、詳細な仕様を先に書く

### 2. Subagent Strategy
- メインのコンテキストウィンドウをクリーンに保つため、サブエージェントを積極的に使う
- リサーチ、探索、並列分析はサブエージェントにオフロード
- 複雑な問題には、サブエージェント経由でより多くの計算を投入
- 1サブエージェント = 1タスク で集中実行

### 3. Self-Improvement Loop
- ユーザーから修正を受けたら、`docs/lessons.md` にパターンを記録
- 同じミスを防ぐルールを自分で書く
- ミス率が下がるまで、これらの教訓を繰り返し改善
- セッション開始時に関連プロジェクトの教訓をレビュー

### 4. Verification Before Done
- 動作を証明せずにタスク完了としない
- 必要に応じてmainとの差分を確認
- 「シニアエンジニアがこれを承認するか？」と自問
- テスト実行、ログ確認、正しさを実証

### 5. Demand Elegance (Balanced)
- 非自明な変更では「もっとエレガントな方法はないか？」と立ち止まる
- ハック的な修正と感じたら「今知っていること全てを踏まえて、エレガントな解決策を実装」
- 単純で明らかな修正にはこれをスキップ。過剰設計しない
- 提示前に自分の作業をチャレンジする

### 6. Autonomous Bug Fixing
- バグ報告を受けたら、手取り足取りを求めずに修正する
- ログ、エラー、失敗テストを指摘し、それらを解決
- ユーザーのコンテキストスイッチをゼロに
- 指示されずともCIの失敗テストを修正しに行く

---

## Core Principles

- **Simplicity First**: 全ての変更を可能な限りシンプルに。影響を最小限に
- **No Laziness**: 根本原因を見つける。一時的な修正はしない。シニア開発者の基準
- **Minimal Impact**: 必要なものだけに触れる。バグを導入しない

---

## コーディングスタイル

- TypeScript strict mode 必須
- 関数型プログラミング優先（不変性を重視）
- 関数は50行以下に保つ
- ESModules (import/export) を使用
- 2スペースインデント

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

## 重要な制約

- **Supabase**: RLSポリシーを必ず設定。user_idでフィルタ必須
- **API Key**: 必ず.envで管理。コードに埋め込まない
- **Slack Bot**: Socket Mode使用。SLACK_APP_TOKEN必須

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
