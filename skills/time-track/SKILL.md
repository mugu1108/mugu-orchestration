---
name: time-track
description: 業務委託の作業時間を記録・管理し、月間サマリーを提供します
category: productivity
triggers:
  - "time-track"
  - "時間追跡"
  - "時間記録"
  - "作業時間"
  - "タイムトラッキング"
  - "勤怠管理"
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Task
  - AskUserQuestion
---

# /time-track - 時間追跡コマンド

**説明**: 業務委託の作業時間を記録・管理し、月間サマリーを提供します。

## 使用方法

```
@timebot /in [プロジェクト名]           # 作業開始
@timebot /out                           # 作業終了
@timebot /status                        # 状態確認
@timebot /today                         # 今日のプロジェクト別内訳
@timebot /week                          # 週間サマリー
@timebot /add [プロジェクト] [時間]     # 作業時間追加
@timebot /undo                          # 直近の記録を削除
@timebot /summary [YYYY-MM]             # 月間サマリー
@timebot /project add [名前] [時給]     # プロジェクト追加
```

## 概要

Time Trackerは、Slackを通じて業務委託の作業時間を記録するシステムです。データはSupabase（マスターDB）に保存されます。月末には自動で月間サマリーが通知されます。

## 起動タイミング

- **作業開始時**: プロジェクトの作業を開始
- **作業終了時**: 作業を終了し、経過時間を記録
- **状態確認時**: 現在の作業状態を確認
- **月末**: 月間サマリーの自動通知

## 前提条件

- Slack Appがセットアップされている（Socket Mode）
- Supabaseにテーブルが作成されている
- プロジェクトが事前に登録されている

## ワークフローステップ

### ステップ1: プロジェクトの登録

作業時間を記録する前に、プロジェクトを登録します:

```
@timebot /project add プロジェクトA 5000
```

### ステップ2: 作業開始（/in）

```
@timebot /in プロジェクトA
```

**処理内容**:
1. プロジェクト名の検証
2. 現在作業中でないことを確認
3. Supabaseに開始時刻を記録
4. Slackに開始通知を送信

**応答**:
```
✅ 作業を開始しました
📁 プロジェクト: プロジェクトA
🕐 開始時刻: 09:30
```

### ステップ3: 作業終了（/out）

```
@timebot /out
```

**処理内容**:
1. 現在作業中のセッションを取得
2. 終了時刻と経過時間を計算
3. Supabaseに記録
4. 今日の合計を計算
5. Slackに終了通知を送信

**応答**:
```
✅ 作業を終了しました
📁 プロジェクト: プロジェクトA
🕐 終了時刻: 12:00
⏱️ 今回の作業時間: 2時間30分
📊 本日の合計: 5時間15分
```

### ステップ4: 状態確認（/status）

```
@timebot /status
```

**応答（作業中）**:
```
🔵 作業中
📁 プロジェクト: プロジェクトA
🕐 開始時刻: 09:30
⏱️ 経過時間: 1時間45分
```

### ステップ5: 今日の内訳確認（/today）

```
@timebot /today
```

今日の作業ログをプロジェクト別に集計して表示します。

### ステップ6: 週間サマリー（/week）

```
@timebot /week
```

今週の作業ログをプロジェクト別に集計し、セッション数とともに表示します。

### ステップ7: 作業時間の追加（/add）

```
@timebot /add saixaid 2時間
@timebot /add saixaid 30分 MTG
```

**対応フォーマット**: `2時間`, `30分`, `2時間30分`, `1.5時間`, `2h`, `30m`, `2h30m`, `90`（分）

**応答**:
```
✅ 作業時間を追加しました
📁 プロジェクト: saixaid
⏱️ 追加時間: 2時間0分
📊 本日の合計: 4時間30分
```

### ステップ8: 直近の記録を削除（/undo）

```
@timebot /undo
```

直近の完了済み作業ログを削除します。誤記録の修正に使用します。

### ステップ9: 月間サマリー（/summary）

```
@timebot /summary           # 今月
@timebot /summary 2026-01   # 指定月
```

**応答**:
```
📊 【2026年1月の作業サマリー】

📁 saixaid（クライアント名）
   ⏱️ 合計: 45時間30分（15回）
   💰 請求額: ¥86,450

━━━━━━━━━━━━━━━━━━
⏱️ 総作業時間: 45時間30分
💰 総合計: ¥86,450
```

### ステップ10: プロジェクト管理（/project）

```
@timebot /project              # 一覧表示
@timebot /project add [名前] [時給]  # プロジェクト追加
```

プロジェクトの一覧表示と新規追加を行います。Supabase上でSQL直接操作する代わりに、Slackから管理できます。

### ステップ11: 月末自動通知

毎月末日の23:00（JST）に自動で月間サマリーが `SLACK_CHANNEL_ID` に送信されます。

## 使用例

### 例1: 1日の作業フロー

```
09:00  @timebot /in プロジェクトA
       → ✅ 作業を開始しました

12:00  @timebot /out
       → ✅ 作業を終了しました（3時間0分）

13:00  @timebot /in プロジェクトB
       → ✅ 作業を開始しました

18:00  @timebot /out
       → ✅ 作業を終了しました（5時間0分）
       → 📊 本日の合計: 8時間0分
```

### 例2: 作業時間の後追い追加

```
@timebot /add saixaid 2時間 昨日のMTG忘れてた
→ ✅ 作業時間を追加しました
```

### 例3: 月間サマリーの確認

```
@timebot /summary
→ 📊 【2026年2月の作業サマリー】
  ...

@timebot /summary 2026-01
→ 📊 【2026年1月の作業サマリー】
  ...
```

## エラーハンドリング

### プロジェクトが見つからない
```
❌ プロジェクト「XXX」が見つかりません
登録済みプロジェクト: プロジェクトA, プロジェクトB
```

### 既に作業中
```
⚠️ 現在「プロジェクトA」で作業中です
先に /out で終了してください
```

### 作業中でない
```
⚠️ 現在作業中ではありません
/in [プロジェクト名] で開始してください
```

## データ保存先

| 保存先 | 用途 | 内容 |
|--------|------|------|
| **Supabase** | マスターDB | 全作業ログ、プロジェクト情報、月間集計 |
| **Slack** | 通知 | リアルタイム通知、Excelファイル共有 |

## 技術仕様

### 使用ライブラリ
- @slack/bolt: Slack Bot（Socket Mode）
- @supabase/supabase-js: Supabase連携
- node-cron: 月末スケジュール実行

### 環境変数
```
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
SLACK_CHANNEL_ID=C...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 関連エージェント

- **time-tracker**: このコマンドが呼び出すエージェント（`agents/business/time-tracker.md`）

## 関連ファイル

- `agents/business/time-tracker.md` - Time Trackerエージェント定義
- `commands/time-track.md` - コマンド定義
- `src/lib/supabase/time-tracker-schema.sql` - DBスキーマ
- `docs/time-tracker-spec.md` - 詳細仕様書

## 詳細情報

詳細は [docs/time-tracker-spec.md](../../docs/time-tracker-spec.md) を参照してください。
