---
marp: true
theme: default
paginate: true
header: 'Supabase入門'
footer: ''
style: |
  section {
    font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif;
    background-color: #ffffff;
    padding: 60px;
  }
  h1 {
    font-size: 48px;
    color: #1a202c;
    font-weight: bold;
    margin-bottom: 24px;
  }
  h2 {
    font-size: 36px;
    color: #2d3748;
    font-weight: bold;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 28px;
    color: #4a5568;
    margin-bottom: 16px;
  }
  p, li {
    font-size: 24px;
    line-height: 1.6;
    color: #2d3748;
  }
  ul, ol {
    margin-left: 32px;
  }
  li {
    margin-bottom: 12px;
  }
  code {
    background-color: #f7fafc;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 22px;
  }
  pre {
    background-color: #2d3748;
    color: #ffffff;
    padding: 16px;
    border-radius: 8px;
    font-size: 20px;
    line-height: 1.5;
  }
  pre code {
    background-color: transparent;
    padding: 0;
    font-size: 20px;
    color: #ffffff;
  }
  strong {
    color: #fbbf24;
    font-weight: bold;
  }
  em {
    color: #a78bfa;
    font-style: italic;
  }
  .problem {
    background-color: #fee;
    border-left: 8px solid #ef4444;
    padding: 20px;
  }
  .solution {
    background-color: #eff6ff;
    border-left: 8px solid #3b82f6;
    padding: 20px;
  }
  .feature {
    background-color: #f0fdf4;
    border-left: 8px solid #22c55e;
    padding: 20px;
  }
  .cta {
    background-color: #fef3c7;
    border-left: 8px solid #f59e0b;
    padding: 20px;
    text-align: center;
  }
  blockquote {
    border-left: 4px solid #4299e1;
    padding-left: 16px;
    margin: 16px 0;
    color: #4a5568;
  }
  .lead {
    font-size: 32px;
    text-align: center;
  }
---

<!-- _class: lead -->

# Supabase

## オープンソースのFirebase代替

---

# Supabaseとは？

SupabaseはオープンソースのBaaS（Backend as a Service）プラットフォームです。

### 一言で表すと
> "オープンソースのFirebase代替"

### 対象ユーザー
- モダンなWebアプリを構築したい開発者
- Firebaseに代わるオープンソースソリューションを探している方
- PostgreSQLを活用したい方

---

# アジェンダ

1. **解決する課題**: なぜSupabaseが必要なのか
2. **ソリューション**: Supabaseの特徴
3. **主要機能**: できることの紹介
4. **デモ**: 実際の使用例
5. **ユースケース**: どのように活用できるか
6. **導入ステップ**: 始め方
7. **まとめ**: 次のアクション

---

<!-- _class: lead -->

# 1. 解決する課題

---

<!-- _class: problem -->

# 現状の課題

多くのチームが以下のような問題に直面しています：

### 課題1: バックエンド開発の複雑さ
認証、データベース、ストレージなど、個別に構築すると時間がかかる

**影響**:
- 開発期間が長期化
- メンテナンスコストが増大

---

<!-- _class: problem -->

# 現状の課題（続き）

### 課題2: ベンダーロックインのリスク
Firebase等のクローズドプラットフォームへの依存

**影響**:
- 移行コストが高い
- プラットフォームの仕様変更に左右される

### 課題3: スケーラビリティの課題
リアルタイム機能とデータベースのスケーリングが困難

**影響**:
- パフォーマンス低下
- インフラコストの増加

---

# これらの課題がもたらすもの

## コスト面
- 💸 開発リソースの浪費
- 💸 高額なベンダー費用

## 時間面
- ⏰ 市場投入までの時間が長い
- ⏰ メンテナンスに時間を取られる

## 品質面
- ⚠️ セキュリティリスク
- ⚠️ データの柔軟性が低い

> **この問題を解決できたら...?**

---

<!-- _class: lead -->

# 2. ソリューション

---

<!-- _class: solution -->

# Supabaseの登場

Supabaseは、これらの課題を解決するために設計されました。

### コンセプト
オープンソースでありながら、Firebaseと同等の開発体験を提供

### 主な特徴
1. **PostgreSQLベース** - 強力なリレーショナルデータベース
2. **完全オープンソース** - セルフホスティング可能
3. **開発者体験** - 直感的なAPI、リアルタイム機能

---

# なぜSupabaseなのか？

## 他のソリューションとの違い

| 項目 | 従来の方法 | Supabase |
|------|-----------|-----------------|
| データベース | 複数サービスを組み合わせ | PostgreSQL統一 ✅ |
| オープンソース | プロプライエタリ | 完全OSS ✅ |
| リアルタイム | 別サービスが必要 | 標準機能 ✅ |

---

# アーキテクチャ概要

Supabaseは複数のオープンソースツールを統合したプラットフォームです。

```
[Supabase Platform]
    ├── PostgreSQL (Database)
    ├── PostgREST (Auto API)
    ├── GoTrue (Auth)
    ├── Realtime (WebSocket)
    └── Storage (File Storage)
```

### 主要コンポーネント
- **PostgreSQL**: 堅牢なリレーショナルDB
- **PostgREST**: 自動生成されるREST API
- **GoTrue**: 認証・認可システム

---

<!-- _class: lead -->

# 3. 主要機能

---

<!-- _class: feature -->

# 機能1: データベース

PostgreSQLをベースとした強力なデータベース機能

### 主な利点
- ✅ SQL の全機能が使える
- ✅ リレーション、トランザクション、インデックス
- ✅ Row Level Security（RLS）で細かいアクセス制御

### 使用例（1/2）
```sql
-- テーブル作成
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

<!-- _class: feature -->

# 機能1: データベース（続き）

### 使用例（2/2）
```sql
-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);
```

---

<!-- _class: feature -->

# 機能2: 認証

組み込みの認証システムで、様々な認証方式をサポート

### 主な利点
- ✅ Email/Password認証
- ✅ OAuth（Google、GitHub等）
- ✅ マジックリンク認証

### 使用例
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})
```

---

<!-- _class: feature -->

# 機能3: リアルタイム

データベースの変更をリアルタイムで購読

### 主な利点
- ✅ WebSocketベースの双方向通信
- ✅ データベース変更を自動検知

### 使用例
```typescript
const subscription = supabase
  .channel('posts')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => console.log('新しい投稿:', payload.new)
  )
  .subscribe()
```

---

<!-- _class: feature -->

# 機能4: ストレージ

ファイルアップロード・管理機能

### 主な利点
- ✅ 画像、動画、ドキュメントの保存
- ✅ アクセス制御（public/private）
- ✅ CDN配信

### 使用例
```typescript
// ファイルアップロード
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar1.png', file)

// 公開URLを取得
const { data: publicURL } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar1.png')
```

---

# 機能一覧

| 機能 | 説明 | 対応 |
|------|------|------|
| Database | PostgreSQL | ✅ |
| Auth | 認証・認可 | ✅ |
| Storage | ファイルストレージ | ✅ |
| Realtime | リアルタイム購読 | ✅ |
| Edge Functions | サーバーレス関数 | ✅ |

---

<!-- _class: lead -->

# 4. デモ

---

# デモ: Todoアプリの構築

SupabaseとReactを使ってTodoアプリを作成します。

### シナリオ
ユーザーがTodoを追加・更新・削除できるアプリ

### ゴール
データベース操作とリアルタイム更新を実装

---

# デモ: ステップ1 - データベース設定

**テーブル作成**

SQLエディタで以下を実行：

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**結果**: todosテーブルが作成される

---

# デモ: ステップ2 - フロントエンド実装（1/3）

**クライアント初期化**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)
```

**結果**: Supabaseクライアントが使用可能に

---

# デモ: ステップ2 - フロントエンド実装（2/4）

**データ取得と追加**

```typescript
// Todoを取得
const { data: todos } = await supabase
  .from('todos').select('*')

// Todoを追加
const { data, error } = await supabase
  .from('todos').insert({ task: '買い物をする' })
```

---

# デモ: ステップ2 - フロントエンド実装（3/4）

**データ更新**

```typescript
// Todoを更新
await supabase
  .from('todos')
  .update({ is_complete: true })
  .eq('id', todoId)
```

---

# デモ: ステップ2 - フロントエンド実装（4/4）

**リアルタイム監視**

```typescript
supabase
  .channel('todos')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'todos' },
    (payload) => console.log('変更検知:', payload)
  )
  .subscribe()
```

**結果**: データベースの変更がリアルタイムで反映される

---

# デモの完成

わずか**数分**で、リアルタイムTodoアプリができました！

### Before
```typescript
// 従来: バックエンド構築に数日
- サーバー構築
- DB設計・構築
- API実装
- WebSocket実装
```

### After
```typescript
// Supabase: 数分で完成
const { data } = await supabase.from('todos').select('*')
```

---

<!-- _class: lead -->

# 5. ユースケース

---

# ユースケース1: SaaSアプリケーション

## 背景
スタートアップがMVPを迅速に開発したい

## 課題
限られたリソースで認証、DB、ストレージを実装

## 解決策
Supabaseで全機能を統合、2週間でローンチ

## 結果
- ✅ 開発期間を70%短縮
- ✅ インフラコストを50%削減
- ✅ スケーラブルな基盤を確保

---

# ユースケース2: リアルタイムコラボレーションツール

## 背景
チームでドキュメントを共同編集するツール

## 課題
リアルタイム同期の実装が複雑

## 解決策
SupabaseのRealtime機能を活用

## 結果
- ✅ WebSocketインフラ不要
- ✅ 複数ユーザーの同時編集を実現
- ✅ データ整合性を保証

---

# ユースケース3: モバイルアプリ

## 背景
iOS/Androidアプリのバックエンド

## 課題
認証とデータ同期の実装

## 解決策
SupabaseのSDKを使用してネイティブ統合

## 結果
- ✅ オフライン対応を簡単に実装
- ✅ クロスプラットフォーム対応
- ✅ Push通知も統合

---

# 実際の導入事例

多くの企業やプロジェクトで採用されています：

- **Mozilla**: ブラウザ拡張機能のバックエンド
- **PwC**: 内部ツールのデータ基盤
- **個人開発者**: 数千のプロジェクトで採用

> "Supabaseのおかげで、インフラではなくプロダクトに集中できた" - Mozilla開発チーム

---

# 導入実績

## 数字で見るSupabase

- 🌍 **100万+** のプロジェクト
- 🚀 **1000+** の企業が導入
- ⭐ **65k+** GitHub Stars
- 📈 **300%** 成長率（前年比）

---

<!-- _class: lead -->

# 6. 導入ステップ

---

# 導入は簡単！

Supabaseを始めるのは、わずか5分で可能です。

## ステップ1: プロジェクト作成

```bash
# Supabase CLI インストール
npm install -g supabase

# プロジェクト初期化
supabase init
```

プロジェクトをsupabase.comで作成するか、ローカルで起動

---

# 導入ステップ（続き）

## ステップ2: クライアントセットアップ

```typescript
// npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)
```

環境変数にURLとキーを設定

## ステップ3: 使い始める

```bash
npm run dev
```

アプリを起動して、Supabaseを使い始める

---

# 完成！

これでSupabaseが使えるようになりました。

### 次にできること
1. **データベース設計** - SQLエディタでテーブル作成
2. **認証設定** - ユーザー登録・ログイン機能を追加
3. **リアルタイム機能** - データの自動同期を実装

---

# プランと料金

| プラン | 料金 | 主な機能 |
|--------|------|---------|
| **Free** | $0 | 500MB DB、1GB ストレージ、認証 |
| **Pro** | $25/月 | 8GB DB、100GB ストレージ、優先サポート |
| **Enterprise** | カスタム | 無制限、SLA、専用サポート |

### すべてのプランに含まれるもの
✅ 認証・認可
✅ リアルタイム機能
✅ Edge Functions

---

# サポートとコミュニティ

### ドキュメント
- [公式ドキュメント](https://supabase.com/docs)
- [チュートリアル](https://supabase.com/docs/guides)
- [ビデオガイド](https://www.youtube.com/@supabase)

### コミュニティ
- [Discord](https://discord.supabase.com)
- [GitHubディスカッション](https://github.com/supabase/supabase/discussions)
- [Twitter](https://twitter.com/supabase)

### サポート
- Email: support@supabase.com
- チャット: discord.supabase.com

---

<!-- _class: lead -->

# 7. まとめ

---

# Supabaseのまとめ

### 解決する課題
バックエンド開発の複雑さ、ベンダーロックイン、スケーラビリティ

### 提供する価値
1. **開発速度** - 数日から数分へ短縮
2. **オープンソース** - ベンダーロックインなし
3. **拡張性** - PostgreSQLの全機能を活用

### 主要機能
Database、Auth、Storage、Realtime、Edge Functions

---

# なぜ今、Supabaseなのか？

1. **モダン開発のニーズ**
   - リアルタイム、認証、スケーラビリティが標準要件に

2. **オープンソースの重要性**
   - ベンダーロックインを回避し、柔軟性を確保

3. **開発者体験**
   - 直感的なAPI、充実したドキュメント、活発なコミュニティ

---

<!-- _class: cta -->

# 今すぐ始めよう！

**無料で試せる Supabase**

数分でバックエンドが完成します

### アクション
1. **無料で試す**: [supabase.com](https://supabase.com)
2. **ドキュメントを読む**: [supabase.com/docs](https://supabase.com/docs)
3. **コミュニティに参加**: [Discord](https://discord.supabase.com)

---

# リソース

### 公式ドキュメント
- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [API リファレンス](https://supabase.com/docs/reference)

### チュートリアル
- [Supabase Crash Course](https://www.youtube.com/supabase)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

### コミュニティ
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Discord Community](https://discord.supabase.com)

---

<!-- _class: lead -->

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-top: 80px;
}
section h1 {
  font-size: 64px;
  margin-bottom: 60px;
}
.images {
  display: flex;
  gap: 40px;
  align-items: center;
}
</style>

# Xもやってます

<div class="images">
  <img src="images/profile.png" width="400" style="margin-right: 40px;">
  <img src="images/x-qr.png" width="300">
</div>
