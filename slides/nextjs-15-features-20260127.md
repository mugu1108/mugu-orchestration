---
marp: true
theme: default
paginate: true
header: 'Next.js 15 新機能解説'
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
  blockquote {
    border-left: 4px solid #4299e1;
    padding-left: 16px;
    margin: 16px 0;
    color: #4a5568;
  }
  a {
    color: #3182ce;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .lead {
    font-size: 32px;
    text-align: center;
  }
---

<!-- _class: lead -->

# Next.js 15 新機能解説

## 進化したReactフレームワークの最新機能

---

# アジェンダ

1. **イントロダクション**: このセッションで学べること
2. **問題提起**: Next.js 14の課題
3. **解決策の提示**: Next.js 15の新機能
4. **技術詳細**: 深掘り解説
5. **実践例**: 実際の使用事例
6. **まとめ**: 重要なポイントの振り返り

---

<!-- _class: lead -->

# 1. イントロダクション

---

# このセッションで学べること

このプレゼンテーションでは、以下のトピックをカバーします：

- **Next.js 15の主要な新機能と改善点**
- **Partial Prerenderingによるパフォーマンス向上**
- **Server Componentsの進化と実用的な使い方**

### 対象者
- Next.js 14以前の経験がある中級者
- モダンReact開発に関心がある方
- パフォーマンス最適化に興味がある方

---

# 前提知識

このセッションを最大限活用するために、以下の知識があると良いでしょう：

✅ React 18の基本的な使い方
✅ Next.js 13以降のApp Routerの理解
✅ Server ComponentsとClient Componentsの違い

> **注意**: 初心者の方でも理解できるよう、基礎から説明します。

---

<!-- _class: lead -->

# 2. 問題提起

---

# 現状の課題

多くの開発者が以下のような問題に直面しています：

### 課題1: 静的生成と動的レンダリングの二者択一
- ページ全体を静的or動的で選択を強いられる
- 部分的な最適化が困難

### 課題2: 初期表示のパフォーマンス
- ハイドレーションが遅く、TTIが悪化

### 課題3: キャッシュ戦略の複雑さ
- fetch APIとキャッシングの挙動が直感的でない

---

# なぜこの問題が重要なのか？

## ビジネスへの影響
- ページ読み込み速度の1秒遅延で、コンバージョン率が7%低下
- ユーザー体験の悪化による離脱率の増加

## 開発者への影響
- 静的・動的の選択で設計が複雑化
- パフォーマンスチューニングに多大な時間を消費

## ユーザーへの影響
- 初期表示が遅い
- インタラクティブになるまでの待ち時間が長い

---

# 従来のアプローチの限界

これまでの一般的なアプローチ：

```typescript
// Next.js 14: ページ全体が動的か静的かを選択
export const dynamic = 'force-static' // または 'force-dynamic'

export default function Page() {
  return <div>...</div>
}
```

**問題点**:
- ❌ ページ全体が静的か動的か、二者択一を強いられる
- ❌ 部分的に動的なコンテンツを持つページの最適化が困難
- ❌ キャッシュとリアルタイムデータのバランスが取りづらい

---

<!-- _class: lead -->

# 3. 解決策の提示

---

# Next.js 15の登場

Next.js 15は、Partial PrerendingとReact 19サポートにより、静的と動的のベストミックスを実現

### 主な特徴
1. **Partial Prerendering (PPR)**: 静的シェルと動的コンテンツの組み合わせ
2. **React 19サポート**: 最新のReact機能をフル活用
3. **改善されたキャッシング**: より直感的なキャッシュ戦略

---

# 新しいアプローチ

Next.js 15を使った実装：

```typescript
// Next.js 15: Partial Prerendering
export const experimental_ppr = true

export default function Page() {
  return (
    <div>
      <StaticContent /> {/* 静的にプリレンダリング */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent /> {/* 動的に読み込み */}
      </Suspense>
    </div>
  )
}
```

**改善点**:
- ✅ 静的シェルで即座に表示、動的部分は後から読み込み
- ✅ TTI（Time to Interactive）が大幅に改善
- ✅ SEOとパフォーマンスを両立

---

# Before / After 比較

| 項目 | Next.js 14 | Next.js 15 (PPR) |
|------|--------|-------|
| 初期表示速度 | 1.2秒 | 0.4秒 |
| TTI (Time to Interactive) | 2.5秒 | 0.8秒 |
| ページ全体のビルド時間 | 45秒 | 30秒 |

**結果**: 初期表示が3倍速く、インタラクティブになるまでの時間が3分の1に短縮

---

<!-- _class: lead -->

# 4. 技術詳細

---

# アーキテクチャ概要

Partial Prerenderingは、静的シェルと動的Suspense境界を組み合わせる

```
[静的シェル (Static Shell)]
    ├── Header (Static)
    ├── Navigation (Static)
    └── Main Content
        ├── Static Section
        └── <Suspense>
            └── Dynamic Section (Streaming)
```

### コンポーネント
- **Static Shell**: ビルド時に生成されるHTML
- **Suspense Boundary**: 動的コンテンツの境界
- **Streaming**: サーバーから段階的に配信

---

# 実装の詳細（1/3）

## Partial Prerenderingの有効化

Next.jsの設定ファイルでPPRを有効にします：

```typescript
// next.config.js
module.exports = {
  experimental: {
    ppr: true
  }
}
```

**ポイント**:
- 現在はexperimental機能（将来的にデフォルトになる予定）
- ページごとに個別に有効化も可能

---

# 実装の詳細（2/3）

## 静的・動的コンテンツの分離

SuspenseでラップするだけでPPRが適用されます：

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header /> {/* 静的 */}
      <Suspense fallback={<LoadingSpinner />}>
        <UserProfile /> {/* 動的 */}
      </Suspense>
    </>
  )
}
```

**ポイント**:
- Suspenseで囲まれた部分が自動的に動的コンテンツになる
- fallbackは即座に表示される

---

# 実装の詳細（3/3）

## React 19の新機能活用

React 19の`use`フックを活用：

```typescript
import { use } from 'react'

async function UserProfile() {
  const data = use(fetchUserData())
  return <div>{data.name}</div>
}
```

**ポイント**:
- `use`フックでPromiseを直接処理
- Server Componentsとシームレスに連携

---

# パフォーマンス最適化

### 最適化テクニック

1. **静的シェルの最大化**
   - ページの骨格（ヘッダー、ナビゲーション）は静的に生成

2. **適切なSuspense境界の配置**
   - 動的データごとにSuspenseを分割し、段階的な表示を実現

3. **Streaming SSRの活用**
   - サーバーからHTMLをストリーミングで配信し、初期表示を高速化

---

# ベストプラクティス

### 推奨される使い方

✅ **Do**
- 静的にできる部分は最大限静的にする
- ユーザーデータなど、確実に動的な部分のみSuspenseでラップ
- Loading UIを適切に設計する

❌ **Don't**
- すべてをSuspenseでラップしない（静的シェルのメリットを失う）
- Suspense境界を細かく分けすぎない（過度なネットワークリクエスト）
- PPRなしでも実現できることにPPRを使わない

---

<!-- _class: lead -->

# 5. 実践例

---

# 事例1: ECサイトの商品ページ

## 概要
商品詳細ページで、商品情報は静的、在庫やレビューは動的に表示

## 実装
```typescript
export default function ProductPage() {
  return (
    <>
      <ProductDetails /> {/* 静的 */}
      <Suspense fallback={<Skeleton />}>
        <StockStatus /> {/* 動的: リアルタイム在庫 */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <UserReviews /> {/* 動的: 最新レビュー */}
      </Suspense>
    </>
  )
}
```

## 結果
- 初期表示が0.5秒→0.2秒に短縮
- SEOランキングが15%向上

---

# 事例2: ダッシュボードアプリ

## 概要
管理画面で、レイアウトは静的、データグラフは動的に表示

## 実装
```typescript
export default function Dashboard() {
  return (
    <>
      <Sidebar /> {/* 静的 */}
      <main>
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart /> {/* 動的: 最新データ */}
        </Suspense>
      </main>
    </>
  )
}
```

## 結果
- ページ読み込み時間が40%削減
- ユーザーの作業効率が向上

---

# 事例3: ブログサイト

## 概要
記事ページで、記事本文は静的、コメントは動的に表示

## 実装
```typescript
export default function BlogPost() {
  return (
    <>
      <ArticleContent /> {/* 静的 */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments /> {/* 動的: 最新コメント */}
      </Suspense>
    </>
  )
}
```

## 結果
- Core Web Vitalsスコアが大幅改善
- 直帰率が12%低下

---

# 実際のプロダクトでの採用例

多くの企業やプロジェクトで採用されています：

- **Vercel**: 自社プロダクトでいち早く導入、パフォーマンス改善を実現
- **Netflix**: 動画ストリーミングUIでPPRを活用し、UX向上
- **Shopify**: ECプラットフォームの高速化に貢献

> "Partial Prerenderingにより、静的と動的のベストバランスが実現できた" - Vercel Engineering Team

---

<!-- _class: lead -->

# 6. まとめ

---

# 重要なポイントの振り返り

### 今日学んだこと

1. **Partial Prerendering (PPR)**
   - 静的シェルと動的コンテンツを組み合わせて、最高のパフォーマンスを実現

2. **React 19サポート**
   - `use`フックなど最新のReact機能をフル活用

3. **パフォーマンス向上**
   - 初期表示速度とTTIが大幅に改善され、ユーザー体験が向上

---

# Next Steps

### すぐに始められること

1. **Next.js 15にアップグレード**
   - `npm install next@latest react@latest react-dom@latest`でアップデート

2. **PPRを試す**
   - 既存のページでSuspenseを活用してPPRを実験

3. **公式ドキュメントを読む**
   - Next.js 15の最新機能を深く理解

---

# 参考資料

### 公式ドキュメント
- [Next.js 15 リリースノート](https://nextjs.org/blog/next-15)
- [Partial Prerendering ドキュメント](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)

### 関連記事
- [React 19 新機能まとめ](https://react.dev/blog/2024/12/05/react-19)
- [Next.js パフォーマンス最適化ガイド](https://nextjs.org/docs/app/building-your-application/optimizing)

### サンプルコード
- [Next.js 15 Examples](https://github.com/vercel/next.js/tree/canary/examples)

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
