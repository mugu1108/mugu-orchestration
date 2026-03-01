# /time-track - 時間追跡コマンド

**説明**: 業務委託の作業時間を記録・管理します。

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

Time Trackerは、Slackを通じて業務委託の作業時間を記録するシステムです。データはSupabaseに保存され、月末には自動で月間サマリーが通知されます。

## いつ使うか

- **作業開始・終了時**: `/in` `/out` で作業セッションを記録
- **状態・実績の確認**: `/status` `/today` `/week` で作業状況を把握
- **後追い記録**: `/add` で過去の作業時間を追加、`/undo` で誤記録を削除
- **月次確認**: `/summary` で月間の作業時間と請求額を集計

## 使用例

### 例1: 基本的な作業フロー

```
@timebot /in プロジェクトA
→ ✅ 作業を開始しました
  📁 プロジェクト: プロジェクトA
  🕐 開始時刻: 09:30

@timebot /out
→ ✅ 作業を終了しました
  📁 プロジェクト: プロジェクトA
  ⏱️ 今回の作業時間: 2時間30分
  📊 本日の合計: 5時間15分
```

### 例2: 作業時間の後追い追加

```
@timebot /add saixaid 2時間 昨日のMTG
→ ✅ 作業時間を追加しました
  📁 プロジェクト: saixaid
  ⏱️ 追加時間: 2時間0分
```

## 関連エージェント

- **time-tracker**: このコマンドが呼び出すエージェント（`agents/business/time-tracker.md`）

## 詳細情報

詳細は [skills/time-track/SKILL.md](../skills/time-track/SKILL.md) を参照してください。
