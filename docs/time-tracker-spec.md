# time-tracker エージェント仕様書

このドキュメントは、業務委託の時間追跡システムの仕様をまとめたものです。

---

## 目次

1. [概要](#概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [機能要件](#機能要件)
4. [データ設計](#データ設計)
5. [Slack操作](#slack操作)
6. [invoice-generator サブエージェント](#invoice-generator-サブエージェント)
7. [担当者と役割分担](#担当者と役割分担)
8. [実装計画](#実装計画)
9. [技術スタック](#技術スタック)
10. [進捗チェックリスト](#進捗チェックリスト)
11. [成功基準](#成功基準)

---

## 概要

### 目的

業務委託の作業時間を正確に記録し、月末に請求書を自動生成するシステム。

### 主な用途

- 業務委託の時間管理
- プロジェクト/クライアント別の時間集計
- 月末の請求書自動生成

---

## アーキテクチャ

```
【全体構成】

Slack（ユーザーインターフェース）
  │
  ├── @bot /in [プロジェクト名]  → 作業開始
  ├── @bot /out                  → 作業終了
  └── @bot /status               → 状態確認（オプション）
  │
  ↓
time-tracker エージェント
  │
  ├── Supabase（マスターDB）
  │   ├── projects テーブル
  │   └── time_logs テーブル
  │
  ├── Notion（閲覧用ビュー）
  │   └── 作業ログDB（同期）
  │
  └── invoice-generator サブエージェント
      ├── 月末検知
      ├── 請求書生成（Excel）
      └── Slackアップロード
```

### データフロー

```
1. 日常の時間記録フロー

ユーザー: @bot /in プロジェクトA
    ↓
Slack Bot受信
    ↓
Supabaseに開始時刻を記録
    ↓
Notionに同期
    ↓
Slack: 「プロジェクトAの作業を開始しました」

    ... 作業中 ...

ユーザー: @bot /out
    ↓
Slack Bot受信
    ↓
Supabaseに終了時刻・経過時間を記録
    ↓
Notionに同期
    ↓
Slack: 「作業終了: 2時間30分 / 今日の合計: 5時間15分」


2. 月末請求書生成フロー

月末日を検知（cron）
    ↓
Slack: 「本日締め日です」
    ↓
Supabaseから月間データを集計
    ↓
プロジェクト別に請求書生成（Excel）
    ↓
Slackにファイルアップロード
```

---

## 機能要件

### time-tracker エージェント（親）

| 機能 | 説明 |
|------|------|
| `/in [プロジェクト名]` | 作業開始。プロジェクトは事前登録済みのものを指定 |
| `/out` | 作業終了。経過時間を計算し、今日の合計を通知 |
| `/status` | 現在の作業状態を確認（オプション） |
| Supabase保存 | 全ログをマスターDBに保存 |
| Notion同期 | 閲覧用にNotionに同期 |

### invoice-generator サブエージェント（子）

| 機能 | 説明 |
|------|------|
| 月末検知 | 毎月末日を自動検知 |
| 締め日通知 | Slackで「本日締め日です」を送信 |
| 月間集計 | プロジェクト別に作業時間を集計 |
| 請求書生成 | Excel形式で請求書を生成 |
| Slackアップロード | 生成した請求書をSlackにアップロード |

---

## データ設計

### Supabase テーブル

#### 1. projects（プロジェクト/クライアントマスタ）

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,           -- プロジェクト名
  client_name VARCHAR(255) NOT NULL,    -- クライアント名
  hourly_rate INTEGER NOT NULL,         -- 時間単価（円）
  is_active BOOLEAN DEFAULT true,       -- 有効フラグ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_projects_client ON projects(client_name);
```

**サンプルデータ**:

| name | client_name | hourly_rate |
|------|-------------|-------------|
| プロジェクトA | 株式会社A | 5000 |
| プロジェクトB | 株式会社B | 4500 |
| 保守案件C | 株式会社A | 4000 |

#### 2. time_logs（作業ログ）

```sql
CREATE TABLE time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,  -- 開始時刻
  ended_at TIMESTAMP WITH TIME ZONE,             -- 終了時刻（作業中はNULL）
  duration_minutes INTEGER,                       -- 経過時間（分）
  note TEXT,                                      -- メモ（オプション）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_time_logs_project ON time_logs(project_id);
CREATE INDEX idx_time_logs_started ON time_logs(started_at);
CREATE INDEX idx_time_logs_ended ON time_logs(ended_at);
```

#### 3. invoices（請求書履歴）

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  year_month VARCHAR(7) NOT NULL,        -- 対象年月（例: 2026-01）
  total_minutes INTEGER NOT NULL,        -- 合計時間（分）
  total_amount INTEGER NOT NULL,         -- 合計金額（円）
  file_url TEXT,                         -- 生成したファイルのURL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユニーク制約（同じプロジェクト・月の重複防止）
CREATE UNIQUE INDEX idx_invoices_unique ON invoices(project_id, year_month);
```

### Notion データベース

#### 作業ログDB（閲覧用）

| プロパティ | タイプ | 説明 |
|-----------|--------|------|
| タイトル | Title | プロジェクト名 |
| クライアント | Select | クライアント名 |
| 開始時刻 | Date | 作業開始日時 |
| 終了時刻 | Date | 作業終了日時 |
| 経過時間 | Number | 経過時間（分） |
| 経過時間（表示） | Formula | 「2時間30分」形式 |
| ステータス | Select | 作業中 / 完了 |
| メモ | Text | 備考 |

---

## Slack操作

### コマンド一覧

#### `/in [プロジェクト名]` - 作業開始

```
ユーザー: @timebot /in プロジェクトA

Bot応答:
✅ 作業を開始しました
📁 プロジェクト: プロジェクトA
🕐 開始時刻: 09:30
```

#### `/out` - 作業終了

```
ユーザー: @timebot /out

Bot応答:
✅ 作業を終了しました
📁 プロジェクト: プロジェクトA
🕐 終了時刻: 12:00
⏱️ 今回の作業時間: 2時間30分
📊 本日の合計: 5時間15分
```

#### `/status` - 状態確認（オプション）

```
ユーザー: @timebot /status

Bot応答（作業中の場合）:
🔵 作業中
📁 プロジェクト: プロジェクトA
🕐 開始時刻: 09:30
⏱️ 経過時間: 1時間45分

Bot応答（作業していない場合）:
⚪ 作業していません
📊 本日の合計: 2時間45分
```

### エラーハンドリング

```
// プロジェクトが見つからない場合
❌ プロジェクト「XXX」が見つかりません
登録済みプロジェクト: プロジェクトA, プロジェクトB, 保守案件C

// 既に作業中の場合
⚠️ 現在「プロジェクトA」で作業中です
先に /out で終了してください

// 作業中でないのに /out した場合
⚠️ 現在作業中ではありません
/in [プロジェクト名] で開始してください
```

---

## invoice-generator サブエージェント

### 月末検知ロジック

```javascript
// 毎日23:00にチェック
cron.schedule('0 23 * * *', async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 明日が翌月なら今日が月末
  if (today.getMonth() !== tomorrow.getMonth()) {
    await sendEndOfMonthNotification();
    await generateMonthlyInvoices();
  }
});
```

### 締め日通知

```
📅 本日は締め日です

【2026年1月の作業サマリー】

📁 プロジェクトA（株式会社A）
   ⏱️ 合計: 45時間30分
   💰 請求額: ¥227,500

📁 プロジェクトB（株式会社B）
   ⏱️ 合計: 20時間15分
   💰 請求額: ¥91,125

━━━━━━━━━━━━━━━━━━
💰 総合計: ¥318,625
━━━━━━━━━━━━━━━━━━

請求書を生成しています...
```

### Excel請求書フォーマット

```
┌─────────────────────────────────────────────────┐
│                    請 求 書                      │
├─────────────────────────────────────────────────┤
│ 請求書番号: INV-2026-01-001                      │
│ 発行日: 2026年1月31日                            │
│ 支払期限: 2026年2月28日                          │
├─────────────────────────────────────────────────┤
│ 【請求先】                                       │
│ 株式会社A 御中                                   │
├─────────────────────────────────────────────────┤
│ 【請求元】                                       │
│ [あなたの名前/屋号]                              │
│ [住所]                                          │
│ [連絡先]                                        │
├─────────────────────────────────────────────────┤
│ 【明細】                                         │
│ ┌────────────┬───────┬────────┬──────────┐     │
│ │ 項目       │ 数量  │ 単価   │ 金額     │     │
│ ├────────────┼───────┼────────┼──────────┤     │
│ │ プロジェクトA│ 45.5h │ ¥5,000 │ ¥227,500│     │
│ │ 業務委託   │       │        │          │     │
│ └────────────┴───────┴────────┴──────────┘     │
│                                                 │
│ 小計:     ¥227,500                              │
│ 消費税:   ¥22,750                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 合計:     ¥250,250                              │
├─────────────────────────────────────────────────┤
│ 【振込先】                                       │
│ ○○銀行 △△支店 普通 1234567                    │
│ 口座名義: ××××                                  │
└─────────────────────────────────────────────────┘
```

---

## 担当者と役割分担

### 担当者一覧

| 担当者 | 記号 | 役割 |
|--------|------|------|
| **ユーザー（あなた）** | 👤 | 手動設定、外部サービス登録、確認作業、情報提供 |
| **Claude Code** | 🤖 | コード実装、ファイル作成、ドキュメント作成 |

### フェーズ別タスク一覧

#### Phase 1: 基盤構築

| # | タスク | 担当 | 詳細 | ステータス |
|---|--------|------|------|-----------|
| 1-1 | Slack App作成 | 👤 | api.slack.comでApp作成、Socket Mode有効化 | [ ] |
| 1-2 | Slackトークン取得 | 👤 | Bot Token (xoxb-) と App Token (xapp-) 取得 | [ ] |
| 1-3 | Supabaseプロジェクト確認 | 👤 | 既存プロジェクトの接続情報確認 | [ ] |
| 1-4 | Supabaseテーブル作成SQL | 🤖 | projects, time_logs, invoices テーブル | [ ] |
| 1-5 | agents/time-tracker.md 作成 | 🤖 | エージェント定義ファイル | [ ] |
| 1-6 | agents/invoice-generator.md 作成 | 🤖 | サブエージェント定義ファイル | [ ] |
| 1-7 | commands/time-track.md 作成 | 🤖 | コマンド定義ファイル | [ ] |
| 1-8 | skills/time-track/SKILL.md 作成 | 🤖 | スキル登録ファイル | [ ] |

#### Phase 2: time-tracker 実装

| # | タスク | 担当 | 詳細 | ステータス |
|---|--------|------|------|-----------|
| 2-1 | Slack Bot基盤コード | 🤖 | Socket Mode接続、基本構造 | [ ] |
| 2-2 | /in コマンド実装 | 🤖 | 作業開始機能 | [ ] |
| 2-3 | /out コマンド実装 | 🤖 | 作業終了機能、今日の合計通知 | [ ] |
| 2-4 | /status コマンド実装 | 🤖 | 状態確認機能（オプション） | [ ] |
| 2-5 | Supabase連携実装 | 🤖 | DB読み書き機能 | [ ] |
| 2-6 | Notion同期実装 | 🤖 | 閲覧用DB同期 | [ ] |
| 2-7 | 環境変数設定 | 👤 | .envファイルにトークン等を設定 | [ ] |
| 2-8 | 動作確認 | 👤 | /in, /out の実環境テスト | [ ] |

#### Phase 3: invoice-generator 実装

| # | タスク | 担当 | 詳細 | ステータス |
|---|--------|------|------|-----------|
| 3-1 | 月末検知ロジック | 🤖 | cron設定、月末判定 | [ ] |
| 3-2 | 締め日通知機能 | 🤖 | Slack通知送信 | [ ] |
| 3-3 | 月間集計機能 | 🤖 | プロジェクト別集計クエリ | [ ] |
| 3-4 | 請求書テンプレート情報提供 | 👤 | 名前、住所、振込先情報 | [ ] |
| 3-5 | Excel請求書生成 | 🤖 | ExcelJSで請求書作成 | [ ] |
| 3-6 | Slackアップロード機能 | 🤖 | ファイルアップロードAPI | [ ] |
| 3-7 | 動作確認 | 👤 | 請求書生成テスト | [ ] |

#### Phase 4: テスト・調整

| # | タスク | 担当 | 詳細 | ステータス |
|---|--------|------|------|-----------|
| 4-1 | 実環境テスト | 👤 | 本番環境での動作確認 | [ ] |
| 4-2 | バグ修正・調整 | 🤖 | 発見された問題の修正 | [ ] |
| 4-3 | ドキュメント更新 | 🤖 | roadmap.md等の更新 | [ ] |
| 4-4 | 最終確認 | 👤 | 全機能の最終チェック | [ ] |

### 依存関係

```
Phase 1
├── 1-1, 1-2 (👤) ← Slack設定が先
│   └── 1-4〜1-8 (🤖) ← 並行して実行可能
└── 1-3 (👤) ← Supabase確認

Phase 2
├── 2-1〜2-6 (🤖) ← Phase 1完了後
├── 2-7 (👤) ← 1-1, 1-2完了後
└── 2-8 (👤) ← 2-1〜2-7完了後

Phase 3
├── 3-1〜3-3 (🤖) ← Phase 2完了後
├── 3-4 (👤) ← いつでも提供可能
├── 3-5, 3-6 (🤖) ← 3-4完了後
└── 3-7 (👤) ← 3-5, 3-6完了後

Phase 4
└── 全タスク ← Phase 3完了後
```

---

## 実装計画

### Phase 1: 基盤構築

**👤 ユーザータスク**:
1. Slack App作成・トークン取得
2. Supabaseプロジェクト確認

**🤖 Claude Codeタスク**:
1. Supabaseテーブル作成SQL
   - projects テーブル
   - time_logs テーブル
   - invoices テーブル
2. エージェント定義ファイル作成
   - agents/time-tracker.md
   - agents/invoice-generator.md
3. コマンド定義ファイル作成
   - commands/time-track.md
4. スキル登録ファイル作成
   - skills/time-track/SKILL.md

### Phase 2: time-tracker 実装

**🤖 Claude Codeタスク**:
1. Slack Bot基盤コード（Socket Mode）
2. `/in` コマンド実装
3. `/out` コマンド実装
4. `/status` コマンド実装（オプション）
5. Supabase保存機能
6. Notion同期機能

**👤 ユーザータスク**:
1. 環境変数設定
2. 動作確認

### Phase 3: invoice-generator 実装

**🤖 Claude Codeタスク**:
1. 月末検知ロジック
2. 締め日通知機能
3. 月間集計機能
4. Excel請求書生成（ExcelJSライブラリ）
5. Slackアップロード機能

**👤 ユーザータスク**:
1. 請求書テンプレート情報提供（名前、住所、振込先）
2. 動作確認

### Phase 4: テスト・調整

**👤 ユーザータスク**:
1. 実環境テスト

**🤖 Claude Codeタスク**:
1. バグ修正・調整
2. ドキュメント更新

---

## 技術スタック

### 必要なライブラリ

```json
{
  "dependencies": {
    "@slack/bolt": "^3.x",           // Slack Socket Mode
    "@supabase/supabase-js": "^2.x", // Supabase Client
    "@notionhq/client": "^2.x",      // Notion API
    "exceljs": "^4.x",               // Excel生成
    "node-cron": "^3.x",             // スケジュール実行
    "date-fns": "^3.x"               // 日付操作
  }
}
```

### 環境変数

```bash
# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
SLACK_CHANNEL_ID=C...

# Supabase
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Notion
NOTION_API_KEY=...
NOTION_TIME_LOGS_DB_ID=...

# 請求書設定
INVOICE_SENDER_NAME=...
INVOICE_SENDER_ADDRESS=...
INVOICE_BANK_INFO=...
```

---

## 進捗チェックリスト

### Phase 1: 基盤構築

#### 👤 ユーザータスク
- [ ] **1-1** Slack App作成（api.slack.comでApp作成）
- [ ] **1-2** Socket Mode有効化
- [ ] **1-3** Bot Token (xoxb-) 取得
- [ ] **1-4** App Token (xapp-) 取得
- [ ] **1-5** Supabaseプロジェクト接続情報確認

#### 🤖 Claude Codeタスク
- [x] **1-6** Supabaseテーブル作成SQL作成
  - [x] projects テーブル
  - [x] time_logs テーブル
  - [x] invoices テーブル
- [x] **1-7** agents/time-tracker.md 作成
- [x] **1-8** agents/invoice-generator.md 作成
- [x] **1-9** commands/time-track.md 作成
- [x] **1-10** skills/time-track/SKILL.md 作成

#### Phase 1 完了条件
- [ ] 全Slackトークンが取得済み
- [ ] Supabase接続情報が確認済み
- [x] 全エージェント・コマンド・スキルファイルが作成済み

---

### Phase 2: time-tracker 実装

#### 🤖 Claude Codeタスク
- [ ] **2-1** Slack Bot基盤コード作成（Socket Mode接続）
- [ ] **2-2** `/in [プロジェクト名]` コマンド実装
  - [ ] プロジェクト検索機能
  - [ ] 作業開始記録機能
  - [ ] Slack応答メッセージ
- [ ] **2-3** `/out` コマンド実装
  - [ ] 作業終了記録機能
  - [ ] 経過時間計算
  - [ ] 今日の合計計算
  - [ ] Slack応答メッセージ
- [ ] **2-4** `/status` コマンド実装（オプション）
  - [ ] 現在の作業状態取得
  - [ ] 経過時間表示
- [ ] **2-5** Supabase連携実装
  - [ ] projects テーブル読み取り
  - [ ] time_logs テーブル読み書き
- [ ] **2-6** Notion同期実装
  - [ ] 作業ログDB同期

#### 👤 ユーザータスク
- [ ] **2-7** .envファイルに環境変数設定
  - [ ] SLACK_BOT_TOKEN
  - [ ] SLACK_APP_TOKEN
  - [ ] SLACK_CHANNEL_ID
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] NOTION_API_KEY
  - [ ] NOTION_TIME_LOGS_DB_ID
- [ ] **2-8** Supabaseでテーブル作成（SQLを実行）
- [ ] **2-9** Notionで作業ログDB作成
- [ ] **2-10** `/in` コマンド動作確認
- [ ] **2-11** `/out` コマンド動作確認
- [ ] **2-12** Supabaseにデータが保存されることを確認
- [ ] **2-13** Notionにデータが同期されることを確認

#### Phase 2 完了条件
- [ ] `/in` で作業開始できる
- [ ] `/out` で作業終了できる
- [ ] 今日の合計時間が通知される
- [ ] Supabaseに正確にデータが保存される
- [ ] Notionで作業ログが閲覧できる

---

### Phase 3: invoice-generator 実装

#### 🤖 Claude Codeタスク
- [ ] **3-1** 月末検知ロジック実装
  - [ ] cron設定（毎日23:00）
  - [ ] 月末判定ロジック
- [ ] **3-2** 締め日通知機能実装
  - [ ] 月間サマリー生成
  - [ ] Slack通知送信
- [ ] **3-3** 月間集計機能実装
  - [ ] プロジェクト別集計クエリ
  - [ ] 金額計算（時間 × 単価）
- [ ] **3-4** Excel請求書生成実装
  - [ ] ExcelJSセットアップ
  - [ ] 請求書テンプレート作成
  - [ ] 動的データ埋め込み
- [ ] **3-5** Slackアップロード機能実装
  - [ ] ファイルアップロードAPI

#### 👤 ユーザータスク
- [ ] **3-6** 請求書テンプレート情報提供
  - [ ] 請求元の名前/屋号
  - [ ] 請求元の住所
  - [ ] 請求元の連絡先
  - [ ] 振込先銀行情報
  - [ ] 支払期限のルール（翌月末等）
- [ ] **3-7** .envファイルに請求書設定追加
  - [ ] INVOICE_SENDER_NAME
  - [ ] INVOICE_SENDER_ADDRESS
  - [ ] INVOICE_BANK_INFO
- [ ] **3-8** 請求書生成テスト
- [ ] **3-9** Excel請求書の内容確認

#### Phase 3 完了条件
- [ ] 月末に自動で締め日通知が届く
- [ ] 月間サマリーが正確に計算される
- [ ] Excel形式の請求書が生成される
- [ ] 請求書がSlackにアップロードされる

---

### Phase 4: テスト・調整

#### 👤 ユーザータスク
- [ ] **4-1** 実環境での総合テスト
  - [ ] 1週間程度の実運用テスト
  - [ ] 複数プロジェクトでのテスト
  - [ ] エラーケースの確認
- [ ] **4-2** フィードバック・改善要望の整理

#### 🤖 Claude Codeタスク
- [ ] **4-3** バグ修正
- [ ] **4-4** 改善要望への対応
- [ ] **4-5** ドキュメント更新
  - [ ] roadmap.md 更新
  - [ ] README.md 更新
- [ ] **4-6** テスト結果ドキュメント作成

#### Phase 4 完了条件
- [ ] 全機能が安定動作する
- [ ] ドキュメントが最新化されている
- [ ] ユーザーが問題なく使用できる

---

## 全体進捗サマリー

| Phase | 進捗 | ステータス |
|-------|------|-----------|
| Phase 1: 基盤構築 | 5/10 | 🔄 進行中（🤖完了、👤待ち） |
| Phase 2: time-tracker 実装 | 0/13 | ⬜ 未着手 |
| Phase 3: invoice-generator 実装 | 0/9 | ⬜ 未着手 |
| Phase 4: テスト・調整 | 0/6 | ⬜ 未着手 |
| **合計** | **5/38** | **13%** |

---

## 成功基準

- [ ] `/in` `/out` でSlackから時間記録ができる
- [ ] プロジェクト別に時間が記録される
- [ ] Supabaseに正確にデータが保存される
- [ ] Notionで作業ログが閲覧できる
- [ ] `/out` 時に今日の合計が通知される
- [ ] 月末に自動で締め日通知が届く
- [ ] Excel形式の請求書が自動生成される
- [ ] 請求書がSlackにアップロードされる

---

**作成日**: 2026-01-28
**最終更新**: 2026-01-28
**ステータス**: 仕様策定完了
