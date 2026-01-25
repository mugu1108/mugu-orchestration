# mugu-orchestration

Claude Code統合による個人用オーケストレーション（業務自動化）システム

## 概要

mugu-orchestrationは、Claude Agent SDKをカスタムスキル、エージェント、ワークフローで拡張する強力なオーケストレーションフレームワークです。一般的な業務タスクを自動化するための構造化されたアプローチを提供します:

- カスタムスキルの作成と管理
- データ永続化のためのSupabase統合
- ワークフロー自動化の構築
- エージェント実行とロギングの管理

## 機能

- **スキル管理**: カスタムスキルの作成、登録、管理
- **Supabase統合**: スキル実行追跡のための完全なデータベースバックエンド
- **メタスキルシステム**: メタスキルを使用した新しいスキルの生成
- **MCP統合**: Model Context Protocolサーバーとのシームレスな統合
- **Claude Codeプラグイン**: ネイティブClaude Codeプラグインとして動作
- **Rules（ルール）**: コード品質とセキュリティ基準の自動遵守
- **Hooks（フック）**: イベント駆動型の自動化とワークフロー効率化

## プロジェクト構造

```
mugu-orchestration/
├── src/
│   ├── cli/                 # CLIコマンド
│   ├── lib/
│   │   ├── supabase/       # Supabaseクライアントとスキーマ
│   │   └── skill-manager.ts # スキル管理
│   └── types/              # TypeScript型定義
├── skills/
│   └── meta-skill/         # スキル生成スキル
├── rules/                  # コード品質・セキュリティルール
│   ├── security.md         # セキュリティ基準
│   ├── coding-style.md     # コーディングスタイル
│   ├── git-workflow.md     # Gitワークフロー
│   └── testing.md          # テスト基準
├── hooks/                  # イベント駆動型自動化
│   ├── hooks.json          # フック設定
│   ├── session-start.js    # セッション開始処理
│   ├── session-end.js      # セッション終了処理
│   └── *.js                # 各種フックスクリプト
├── .claude-plugin/         # プラグイン設定
├── mcp-configs/            # MCPサーバー設定
└── package.json
```

## インストール

### 1. クローンまたは初期化

```bash
cd ~/mugu-orchestration
npm install
```

### 2. TypeScriptのビルド

```bash
npm run build
```

### 3. Supabaseのセットアップ

Supabaseをローカルで初期化:

```bash
npx supabase init
npx supabase start
```

これにより、PostgreSQLを含むローカルSupabaseインスタンスが起動します。

### 4. データベーススキーマの適用

[src/lib/supabase/schema.sql](src/lib/supabase/schema.sql)からSQLスキーマをコピーし、Supabase SQLエディタで実行するか、以下のコマンドを実行:

```bash
npx supabase db reset
```

その後、スキーマ内容をSQLエディタに貼り付けて実行します。

### 5. 環境変数の設定

環境変数ファイルの例をコピー:

```bash
cp .env.example .env
```

`.env`をSupabaseの認証情報で更新します（`npx supabase status`から取得）:

```bash
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. インストールの確認

```bash
npm run cli -- --version
```

## 使用方法

### CLIコマンド

```bash
# Supabaseを初期化（セットアップ手順を表示）
npm run cli init

# すべてのスキルをリスト表示
npm run cli list
```

### Claude Codeプラグインとしての使用

1. プラグイン設定をコピー:
   - プラグインは`.claude-plugin/plugin.json`に設定されています
   - スキルは`skills/`にあります

2. スキルはClaude Codeによって自動的に検出されます

### 新しいスキルの作成

メタスキルを使用して新しいスキルを作成:

1. Claudeに自動化のニーズを説明
2. メタスキルがスキル作成をガイド
3. スキルは自動的にSupabaseに登録されます

詳細は[skills/meta-skill/SKILL.md](skills/meta-skill/SKILL.md)を参照してください。

## 開発

### ビルド

```bash
npm run build
```

### ウォッチモード

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

## データベーススキーマ

システムは以下のテーブルを持つSupabaseを使用します:

- **skills**: スキルの定義とメタデータ
- **skill_executions**: 実行履歴とログ
- **agent_executions**: エージェント呼び出しログ
- **configurations**: システム設定の保存

完全なスキーマは[src/lib/supabase/schema.sql](src/lib/supabase/schema.sql)を参照してください。

## MCP統合

システムは[mcp-configs/mcp-servers.json](mcp-configs/mcp-servers.json)に設定されたMCPサーバーと統合されています:

- **supabase**: データベース操作
- **github**: リポジトリ操作
- **filesystem**: ファイルシステムアクセス

## Rules（ルール）

Rulesは、Claude Codeがコードを生成する際に**常に遵守すべき基準**を定義します。

### 利用可能なルール

- **[security.md](rules/security.md)**: セキュリティ必須事項
  - API keyのハードコード禁止
  - 環境変数の使用
  - 入力検証の必須化
  - SQLインジェクション対策
  - XSS・CSRF対策

- **[coding-style.md](rules/coding-style.md)**: コーディングスタイル基準
  - イミュータビリティ原則
  - ファイルサイズ制限（200-400行推奨、最大800行）
  - 関数サイズ制限（50行推奨、最大100行）
  - ネストの深さ制限（最大4レベル）
  - 命名規則とベストプラクティス

- **[git-workflow.md](rules/git-workflow.md)**: Gitワークフロー標準
  - コミットメッセージフォーマット
  - ブランチ命名規則
  - Pull Requestプロセス
  - .gitignore設定

- **[testing.md](rules/testing.md)**: テスト基準
  - カバレッジ目標（80%以上）
  - テストの種類（単体・統合・E2E）
  - テスト駆動開発（TDD）推奨
  - モックの使用方法

### Rulesの効果

Rulesを設定することで、Claude Codeは自動的に：
- セキュアなコードを生成
- 一貫したスタイルを維持
- 適切なテストを作成
- ベストプラクティスに従う

## Hooks（フック）

Hooksは、特定のイベントで**自動的に実行される処理**を定義します。

### 利用可能なフック

#### セッション管理
- **session-start**: セッション開始時
  - 前回のコンテキストを復元
  - パッケージマネージャーを自動検出（npm/pnpm/yarn/bun）
  - 作業状態の表示

- **session-end**: セッション終了時
  - セッション状態を保存
  - 作業履歴を記録
  - 古い履歴のクリーンアップ

#### Git操作
- **pre-git-push**: git push前
  - 確認プロンプトを表示
  - コミット内容を表示
  - masterブランチへの警告

#### コード品質
- **post-format**: JavaScriptファイル保存後
  - Prettierで自動フォーマット

- **post-format-ts**: TypeScriptファイル保存後
  - Prettierで自動フォーマット
  - 型チェック実行

- **warn-console-log**: ファイル保存後
  - console.log文の検出と警告

#### その他
- **warn-long-command**: 長時間コマンド実行前
  - npm install、docker build等の警告
  - 実行時間の目安を表示

### Hooksの効果

Hooksを設定することで：
- 手動作業を自動化
- ミスを事前に防止
- ワークフローを効率化
- コード品質を自動維持

## 今後の機能拡張

- セミナースライド生成（Marp統合）
- Slack/Discord通知付き時間追跡
- 請求書生成
- 追加の自動化ワークフロー

## ライセンス

MIT

## 著者

Seiji

---

Built with [Claude Code](https://claude.com/claude-code)
