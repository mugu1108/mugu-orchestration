# /time-track - 時間追跡コマンド

**説明**: 業務委託の作業時間を記録・管理します。

## 使用方法

```
@timebot /in [プロジェクト名]   # 作業開始
@timebot /out                   # 作業終了
@timebot /status                # 状態確認
@timebot /invoice [YYYY-MM]     # 請求書生成（手動）
```

## 概要

`/time-track` コマンド群は、Time Trackerエージェントを呼び出し、Slackを通じて作業時間を記録します。データはSupabase（マスターDB）に保存され、Notion（閲覧用）にも同期されます。月末には自動で請求書が生成されます。

## いつ使うか

- **作業開始時**: `/in プロジェクト名` で作業を開始
- **作業終了時**: `/out` で作業を終了し、経過時間を記録
- **状態確認時**: `/status` で現在の作業状態を確認
- **請求書が必要な時**: 月末に自動生成、または `/invoice` で手動生成

## 使用例

### 例: /in で作業開始

```
@timebot /in プロジェクトA
```

**出力**:
```
✅ 作業を開始しました
📁 プロジェクト: プロジェクトA
🕐 開始時刻: 09:30
```

## 関連エージェント

- **time-tracker**: このコマンドが呼び出すエージェント（`agents/business/time-tracker.md`）

## 詳細情報

詳細は [skills/time-track/SKILL.md](../skills/time-track/SKILL.md) を参照してください。
