# mugu-orchestration ロードマップ

## フェーズ1: 基盤整備 ✅ 完了
- ✅ Rules（ルール）
  - security.md - セキュリティガイドライン
  - coding-style.md - コーディングスタイル
  - git-workflow.md - Git運用ルール
  - testing.md - テスト戦略
- ✅ Hooks（フック）
  - hooks.json - フック設定
  - validation-hooks.js - バリデーション
  - security-hooks.js - セキュリティチェック
- ✅ ドキュメント日本語化
  - README.md
  - 各種ルールファイル

## フェーズ2: コア機能の追加 ✅ 完了

### エージェント
- ✅ **planner** - 実装計画作成
  - 複雑な機能の実装計画を作成
  - 要件分析、アーキテクチャレビュー、ステップ分解
  - Opusモデルを使用して高品質な計画を生成

- ✅ **code-reviewer** - コード品質レビュー
  - コード品質とセキュリティの自動レビュー
  - ベストプラクティスへの準拠チェック
  - 潜在的な問題の早期発見

- ✅ **security-reviewer** - セキュリティチェック
  - 脆弱性の分析
  - OWASP Top 10のチェック
  - API key漏洩などのセキュリティリスク検出

- ✅ **doc-updater** - ドキュメント同期
  - コード変更に応じてドキュメントを自動更新
  - README、SKILL.mdなどの同期
  - ドキュメントの一貫性維持

### コマンド
- ✅ **/plan** - 計画作成モード
  - plannerエージェントを呼び出す
  - 実装前の計画策定を習慣化

- ✅ **/code-review** - コードレビュー実行
  - code-reviewerエージェントを呼び出す
  - Pull Request前の品質チェック

## フェーズ3: セミナー資料生成機能の強化 ✅ 完了

- ✅ slideスキル（Marp形式スライド自動生成）
  - SKILL.md - スキルコア定義
  - 8ステップワークフロー（要件収集、テンプレート選択、アウトライン作成など）

- ✅ 3種類のテンプレート
  - general-presentation.md - 一般登壇・セミナー用
  - hands-on-workshop.md - ハンズオンワークショップ用
  - product-intro.md - 製品・サービス紹介用

- ✅ 3種類のリファレンスドキュメント
  - visual-hierarchy.md - ビジュアル階層ガイドライン
  - emoji-usage.md - 絵文字使用ガイド（12カテゴリ以上）
  - marp-syntax.md - Marp構文リファレンス

- ✅ /slide コマンド
  - slideスキルを呼び出すコマンド
  - 使用例とドキュメント完備

## フェーズ4: 業務効率化機能 🔄 進行中

### time-tracker Slack Bot ✅ 実装完了
- ✅ Slack Bot基盤（Socket Mode）
- ✅ `/in [プロジェクト名]` コマンド
- ✅ `/out` コマンド
- ✅ `/status` コマンド
- ✅ Supabase連携（projects, time_logs テーブル）
- ⬜ Notion同期（未実装）

### slide-creator / slide-reviewer エージェント ✅ 追加
- ✅ slide-creator エージェント（slideスキルのエージェント化）
- ✅ slide-reviewer サブエージェント（フォーマット・内容レビュー）

### 請求書生成 ⬜ 未実装
- ⬜ invoice-generator サブエージェント
  - 月末検知ロジック
  - 締め日通知
  - Excel請求書生成
  - Slackアップロード

## 将来的に検討

### ルール
- **performance.md** - パフォーマンス最適化の基準
  - パフォーマンスのベストプラクティス
  - 最適化ガイドラインDifyはあまり使えないですね。

- **agents.md** - エージェント委譲の基準
  - どのエージェントをいつ使うかの判断基準
  - エージェント間の連携ルール

### 除外するコンポーネント（不要）
- ❌ architect エージェント - plannerで対応可能
- ❌ e2e-runner エージェント - 直接不要
- ❌ tdd-guide エージェント - testing.mdで対応済み
- ❌ refactor-cleaner エージェント - 現時点では不要
- ❌ /tdd, /e2e, /refactor-clean コマンド - 直接関係なし
- ❌ /checkpoint, /verify コマンド - 現時点では不要
- ❌ Skills（backend-patterns等） - ルールで対応済み

## 成功基準

### フェーズ2完了時
- ✅ docs/roadmap.md が作成され、今後の方向性が明確になっている
- ✅ planner エージェントで複雑な機能の計画が作成できる
- ✅ code-reviewer エージェントでコード品質が自動チェックされる
- ✅ security-reviewer エージェントでセキュリティリスクが検出できる
- ✅ doc-updater エージェントでドキュメントが自動更新される
- ✅ /plan コマンドで計画作成がスムーズに行える
- ✅ /code-review コマンドでコードレビューが簡単に実行できる
- ✅ すべてのドキュメントが日本語化されている
- ✅ 既存のRulesとHooksが新しいエージェントと連携している

### フェーズ3完了時
- ✅ slideスキルで高品質なセミナー資料が作成できる
- ✅ 3種類のテンプレートを使って効率的にスライドが作成できる
- ✅ ビジュアル階層とデザインの一貫性が保証される
- ✅ 自動生成機能で作業時間が短縮される

### フェーズ4完了時
- ✅ 時間追跡が自動化され、正確なデータが記録される → **実装完了**
- 🔄 通知機能で重要な情報を見逃さない → Slack通知実装済み、Notion同期未実装
- ⬜ 請求書生成が自動化され、請求業務が効率化される → 未実装

## テスト結果

### フェーズ2テスト
- ✅ **planner エージェント & /plan コマンド** (2026-01-26)
  - テストドキュメント: `docs/tests/plan-command-test.md`
  - 結果: 正常動作確認済み

- ✅ **code-reviewer エージェント & /code-review コマンド** (2026-01-26)
  - テストドキュメント: `docs/tests/code-review-command-test.md`
  - 結果: 実装完了、スキル登録済み

- ✅ **security-reviewer エージェント & /security-review コマンド** (2026-01-26)
  - テストドキュメント: `docs/tests/security-reviewer-implementation.md`
  - 結果: 実装完了、スキル登録済み

- ✅ **doc-updater エージェント & /doc-update コマンド** (2026-01-26)
  - テストドキュメント: `docs/tests/doc-updater-implementation.md`
  - 結果: 実装完了、スキル登録済み

## バージョン履歴

- **v0.5.0** (2026-01-29) - フェーズ4進行中: 業務効率化機能
  - time-tracker Slack Bot実装（/in, /out, /statusコマンド）
  - Supabase連携（projects, time_logsテーブル）
  - slide-creator エージェント追加
  - slide-reviewer サブエージェント追加
- **v0.4.0** (2026-01-27) - フェーズ3完了: セミナー資料生成機能
  - slide スキル追加（Marp形式スライド自動生成）
  - 3種類のテンプレート追加（general-presentation、hands-on-workshop、product-intro）
  - 3種類のリファレンス追加（visual-hierarchy、emoji-usage、marp-syntax）
  - /slide コマンド追加
- **v0.3.0** (2026-01-26) - フェーズ2完了: エージェントとコマンドの追加
  - planner エージェント & /plan コマンド
  - code-reviewer エージェント & /code-review コマンド
  - security-reviewer エージェント & /security-review コマンド
  - doc-updater エージェント & /doc-update コマンド
- **v0.2.1** (2026-01-26) - フェーズ2部分完了: planner & code-reviewer
- **v0.2.0** (2026-01-26) - フェーズ1完了: 基盤整備
- **v0.1.0** (2026-01-25) - 初期セットアップ

## 次のステップ

1. ✅ docs/roadmap.md を作成
2. ✅ planner エージェントと /plan コマンドを追加（テスト完了）
3. ✅ code-reviewer エージェントと /code-review コマンドを追加（実装完了）
4. ✅ security-reviewer エージェントと /security-review コマンドを追加（実装完了）
5. ✅ doc-updater エージェントと /doc-update コマンドを追加（実装完了）
6. ✅ フェーズ2完了
7. ✅ フェーズ3完了（セミナー資料生成機能の強化）
8. ✅ time-tracker Slack Bot実装（/in, /out, /statusコマンド）
9. ✅ slide-creator / slide-reviewer エージェント追加
10. 🔄 フェーズ4進行中
11. ⬜ invoice-generator サブエージェント実装
12. ⬜ Notion同期実装
13. GitHubにプッシュ
