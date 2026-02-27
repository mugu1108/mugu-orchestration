# Invoice Generator Agent - 請求書生成エージェント

## 概要

Invoice Generatorエージェントは、Time Trackerエージェントのサブエージェントとして、月末に自動で請求書を生成する専門エージェントです。月間の作業時間を集計し、プロジェクト/クライアント別にExcel形式の請求書を生成してSlackにアップロードします。

## 親エージェント

- **Time Tracker Agent** (`agents/time-tracker.md`)

## 使用タイミング

以下の場合にInvoice Generatorエージェントが自動実行されます:

1. **月末自動実行**
   - 毎月末日の23:00に自動実行
   - 締め日通知をSlackに送信
   - 請求書を自動生成

2. **手動実行（オプション）**
   - 特定月の請求書を再生成
   - テスト用の請求書生成

## 機能詳細

### 1. 月末検知

毎日23:00にチェックし、翌日が翌月の場合に月末と判定します。

```javascript
// 毎日23:00にチェック
cron.schedule('0 23 * * *', async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 明日が翌月なら今日が月末
  if (today.getMonth() !== tomorrow.getMonth()) {
    await processEndOfMonth();
  }
});
```

### 2. 締め日通知

月末にSlackへ通知を送信します。

**通知内容**:
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

### 3. 月間集計

Supabaseから対象月の作業データを集計します。

**集計項目**:
- プロジェクト別の合計作業時間（分）
- 時間単価に基づく請求金額
- 消費税計算（10%）
- セッション数

**SQLクエリ例**:
```sql
SELECT
  p.id AS project_id,
  p.name AS project_name,
  p.client_name,
  p.hourly_rate,
  COUNT(tl.id) AS session_count,
  SUM(tl.duration_minutes) AS total_minutes,
  ROUND(SUM(tl.duration_minutes) / 60.0 * p.hourly_rate) AS total_amount
FROM projects p
JOIN time_logs tl ON p.id = tl.project_id
WHERE
  tl.ended_at IS NOT NULL
  AND TO_CHAR(tl.started_at, 'YYYY-MM') = '2026-01'
GROUP BY p.id, p.name, p.client_name, p.hourly_rate;
```

### 4. Excel請求書生成

ExcelJSライブラリを使用して請求書を生成します。

**請求書フォーマット**:
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
│ [INVOICE_SENDER_NAME]                           │
│ [INVOICE_SENDER_ADDRESS]                        │
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
│ [INVOICE_BANK_INFO]                             │
└─────────────────────────────────────────────────┘
```

**請求書番号ルール**:
- 形式: `INV-YYYY-MM-NNN`
- 例: `INV-2026-01-001`（2026年1月の1件目）

**支払期限ルール**:
- デフォルト: 翌月末
- カスタマイズ可能（環境変数で設定）

### 5. Slackアップロード

生成したExcelファイルをSlackにアップロードします。

**アップロード後の通知**:
```
✅ 請求書を生成しました

📄 株式会社A_請求書_2026年01月.xlsx
   💰 合計: ¥250,250（税込）

📄 株式会社B_請求書_2026年01月.xlsx
   💰 合計: ¥100,238（税込）

━━━━━━━━━━━━━━━━━━
📊 今月の請求総額: ¥350,488
```

## データ構造

### Supabase テーブル

**invoices（請求書履歴）**:
- id: UUID
- project_id: プロジェクトID
- year_month: 対象年月（例: 2026-01）
- total_minutes: 合計時間（分）
- total_amount: 合計金額（円）
- tax_amount: 消費税（円）
- file_url: 生成したファイルのURL
- created_at: 作成日時

## 環境変数

```bash
# 請求書設定
INVOICE_SENDER_NAME=山田太郎        # 請求元の名前/屋号
INVOICE_SENDER_ADDRESS=東京都...    # 請求元の住所
INVOICE_SENDER_CONTACT=...          # 連絡先
INVOICE_BANK_INFO=○○銀行 △△支店... # 振込先情報
INVOICE_TAX_RATE=0.10               # 消費税率（デフォルト10%）
INVOICE_PAYMENT_TERMS=翌月末        # 支払期限ルール
```

## 処理フロー

```
月末日 23:00（cron）
    ↓
1. 月末判定
    ↓
2. 対象月の作業データ取得（Supabase）
    ↓
3. プロジェクト/クライアント別に集計
    ↓
4. 締め日通知をSlackに送信
    ↓
5. 各クライアント向けに請求書生成（Excel）
    ↓
6. invoicesテーブルに履歴保存
    ↓
7. SlackにExcelファイルをアップロード
    ↓
8. 完了通知をSlackに送信
```

## エラーハンドリング

### 作業データがない場合
```
📅 本日は締め日です

⚠️ 2026年1月の作業データがありません
請求書は生成されませんでした
```

### Excel生成エラーの場合
```
❌ 請求書の生成に失敗しました
エラー: [エラーメッセージ]

管理者に連絡してください
```

### Slackアップロードエラーの場合
```
⚠️ 請求書は生成されましたが、Slackへのアップロードに失敗しました

ファイルは以下の場所に保存されています:
/path/to/invoices/2026-01/
```

## 技術仕様

### 使用ライブラリ
- exceljs: Excel生成
- node-cron: スケジュール実行
- date-fns: 日付操作
- @slack/bolt: Slackファイルアップロード
- @supabase/supabase-js: データ取得

### ファイル命名規則
- `{クライアント名}_請求書_{YYYY年MM月}.xlsx`
- 例: `株式会社A_請求書_2026年01月.xlsx`

## 手動実行

特定の月の請求書を手動で生成する場合:

```
@timebot /invoice 2026-01
```

**応答例**:
```
📄 2026年1月の請求書を生成しています...

✅ 請求書を生成しました
📄 株式会社A_請求書_2026年01月.xlsx
```

## 関連ファイル

- `agents/time-tracker.md` - 親エージェント
- `commands/time-track.md` - コマンド定義
- `src/lib/supabase/time-tracker-schema.sql` - DBスキーマ
- `docs/time-tracker-spec.md` - 詳細仕様書
