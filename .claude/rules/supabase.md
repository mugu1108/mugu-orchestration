---
paths:
  - "src/lib/supabase/**"
---

# Supabase ルール

- RLSポリシー必須、user_idでフィルタ
- API Keyは.envで管理、コード埋め込み禁止
- クライアントはsingleton初期化
- time_logsは分単位(duration_minutes)で記録
