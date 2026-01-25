# Gitワークフローガイド

このドキュメントは、Gitを使用した開発ワークフローの標準を定義します。

## コミットメッセージ

### フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（種類）

- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの動作に影響しない変更（フォーマット、セミコロンなど）
- **refactor**: バグ修正でも機能追加でもないコード変更
- **perf**: パフォーマンス改善
- **test**: テストの追加や修正
- **chore**: ビルドプロセスやツールの変更

### 例

```bash
# 良い例
feat(skills): メタスキル生成機能を追加

メタスキルを使用して新しいスキルを対話的に生成できるようにしました。
- スキルテンプレートの選択
- フロントマター自動生成
- Supabaseへの自動登録

Closes #123

# 良い例（シンプルな場合）
fix(hooks): セッション開始時のエラーを修正

# 良い例（ドキュメント）
docs(readme): インストール手順を更新
```

### 悪い例

```bash
# 悪い例：不明確
git commit -m "update"
git commit -m "fix bug"
git commit -m "WIP"

# 悪い例：詳細がない
git commit -m "add feature"
```

## ブランチ戦略

### ブランチ命名規則

```
<type>/<issue-number>-<description>
```

### 例

```bash
# 機能追加
feature/123-add-meta-skill

# バグ修正
fix/456-session-start-error

# ドキュメント
docs/789-update-readme

# リファクタリング
refactor/101-cleanup-skill-manager
```

### メインブランチ

- **master** または **main**: 本番環境のコード
- 常に安定した状態を保つ
- 直接コミットしない（Pull Request経由）

## Pull Request（PR）

### PR作成前のチェックリスト

- [ ] コードが動作することを確認
- [ ] テストが通ることを確認
- [ ] リントエラーがないことを確認
- [ ] ドキュメントを更新（必要な場合）
- [ ] 不要なconsole.logを削除
- [ ] コミットメッセージが明確
- [ ] セキュリティルールに準拠

### PRタイトル

コミットメッセージと同じフォーマットを使用

```
feat(skills): メタスキル生成機能を追加
```

### PR説明テンプレート

```markdown
## 概要
この変更の目的を簡潔に説明

## 変更内容
- 変更点1
- 変更点2
- 変更点3

## テスト方法
1. ステップ1
2. ステップ2
3. 期待される結果

## スクリーンショット（UI変更の場合）
![説明](画像URL)

## 関連Issue
Closes #123
```

### レビュープロセス

1. **セルフレビュー**: PRを作成する前に自分で変更を確認
2. **コードレビュー**: 他の開発者（またはClaude Code）によるレビュー
3. **修正**: レビューコメントに対応
4. **承認**: レビュアーの承認を取得
5. **マージ**: masterブランチにマージ

## コミットの粒度

### 適切なコミット

- **論理的な単位**でコミット
- **1つの変更につき1つのコミット**
- **元に戻せる**単位でコミット

#### ✅ 良い例

```bash
# コミット1: 機能の追加
git commit -m "feat(skills): スキルテンプレート選択機能を追加"

# コミット2: ドキュメントの更新
git commit -m "docs(skills): SKILL.mdテンプレートを更新"

# コミット3: テストの追加
git commit -m "test(skills): メタスキル生成のテストを追加"
```

#### ❌ 悪い例

```bash
# すべてを1つのコミットに
git commit -m "update everything"

# 細かすぎるコミット
git commit -m "add space"
git commit -m "fix typo"
git commit -m "fix another typo"
```

## .gitignore

### 必ずignoreするファイル

```gitignore
# 環境変数
.env
.env.local
.env.*.local

# 依存関係
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# ビルド成果物
dist/
build/
*.tsbuildinfo

# エディタ設定
.vscode/
.idea/
*.swp
*.swo
*~

# OS固有
.DS_Store
Thumbs.db

# Supabase
.supabase/

# ログ
*.log
logs/

# 一時ファイル
tmp/
temp/
```

### ✅ リポジトリに含めるべきファイル

```
.env.example      # 環境変数のテンプレート
.gitignore        # Git除外ルール
README.md         # プロジェクト説明
package.json      # 依存関係定義
tsconfig.json     # TypeScript設定
```

## 一般的なGitコマンド

### ブランチ作成とチェックアウト

```bash
# 新しいブランチを作成して切り替え
git checkout -b feature/123-add-feature

# または（Git 2.23以降）
git switch -c feature/123-add-feature
```

### 変更のステージングとコミット

```bash
# 変更を確認
git status

# 特定のファイルをステージング
git add src/lib/skill-manager.ts

# すべての変更をステージング
git add .

# コミット
git commit -m "feat(skills): スキル管理機能を追加"

# ステージングとコミットを同時に（既存ファイルのみ）
git commit -am "fix(hooks): セッション処理を修正"
```

### プッシュ

```bash
# 初回プッシュ（上流ブランチを設定）
git push -u origin feature/123-add-feature

# 2回目以降
git push
```

### プル

```bash
# リモートの変更を取得してマージ
git pull origin master

# またはリベース
git pull --rebase origin master
```

### 変更の取り消し

```bash
# ステージングを取り消し（ファイルの変更は保持）
git restore --staged <file>

# ファイルの変更を取り消し
git restore <file>

# 最後のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 最後のコミットを完全に取り消し（変更も破棄）
git reset --hard HEAD~1
```

## Git Hooks

プロジェクトでは以下のGit Hooksを使用しています：

### pre-commit

コミット前に自動実行：
- リントチェック
- フォーマットチェック
- テスト実行（オプション）

### pre-push

プッシュ前に自動実行：
- 確認プロンプト
- ビルドチェック
- セキュリティチェック

## ベストプラクティス

### ✅ すべきこと

- **頻繁にコミット**: 小さな変更を頻繁にコミット
- **意味のあるメッセージ**: 何を変更したか明確に記述
- **ブランチを使用**: 機能ごとにブランチを作成
- **定期的にプル**: 最新の変更を取り込む
- **レビューを依頼**: コードレビューを受ける
- **テストを実行**: コミット前にテストを確認

### ❌ 避けるべきこと

- **巨大なコミット**: 複数の変更を1つのコミットにまとめない
- **不明確なメッセージ**: "update"や"fix"だけのメッセージ
- **masterへの直接コミット**: 必ずブランチを使用
- **force push（基本的に）**: `git push --force`は慎重に
- **機密情報のコミット**: API keyなどをコミットしない
- **生成ファイルのコミット**: `node_modules/`や`dist/`などをコミットしない

## トラブルシューティング

### コンフリクトの解決

```bash
# コンフリクトが発生した場合
git pull origin master

# コンフリクトを手動で解決
# エディタでファイルを開き、<<<<<<, =======, >>>>>> マーカーを編集

# 解決後、ステージングしてコミット
git add <conflicted-file>
git commit -m "merge: masterからの変更をマージ"
```

### 誤ってコミットした場合

```bash
# 最後のコミットメッセージを修正
git commit --amend -m "正しいメッセージ"

# 最後のコミットにファイルを追加
git add forgotten-file.ts
git commit --amend --no-edit
```

### 誤ってプッシュした場合

```bash
# まだ他の人がプルしていない場合のみ
git push --force-with-lease origin feature/branch

# 注意: force pushは慎重に使用してください
```

---

**重要**: Gitワークフローを統一することで、チーム開発の効率が大幅に向上します。
