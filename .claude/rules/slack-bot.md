---
paths:
  - "src/bots/**"
---

# Slack Bot ルール

- Socket Mode使用。SLACK_APP_TOKEN必須
- app_mentionイベントでコマンドルーティング
- エラーはSlackメッセージで返す（crashさせない）
- index.ts → services/ → utils/ の構造パターン
- API Keyは.envで管理、コード埋め込み禁止
