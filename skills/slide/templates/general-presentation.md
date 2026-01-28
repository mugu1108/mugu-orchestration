---
marp: true
theme: default
paginate: true
header: '{{SEMINAR_TITLE}}'
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

<!--
⚠️ コンテンツ量の制限（必須ルール）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
スライドからコンテンツがはみ出すことは絶対に許容されません。

■ コードブロックの制限
- コードのみ: 最大8行
- コード + テキスト: コード6行 + テキスト2-3行
- 9行以上のコードは必ず分割

■ テキストの制限
- 箇条書き: 最大6項目
- 段落: 2-3個まで
- テーブル: 5行 × 4列まで

■ 分割時の命名
- 「実装の詳細（1/3）」「実装の詳細（2/3）」「実装の詳細（3/3）」
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

<!-- _class: lead -->

# {{PRESENTATION_TITLE}}

## {{SUBTITLE}}

---

# アジェンダ

1. **イントロダクション**: このセッションで学べること
2. **問題提起**: 現状の課題
3. **解決策の提示**: {{MAIN_SOLUTION}}
4. **技術詳細**: 深掘り解説
5. **実践例**: 実際の使用事例
6. **まとめ**: 重要なポイントの振り返り

---

<!-- _class: lead -->

# 1. イントロダクション

---

# このセッションで学べること

このプレゼンテーションでは、以下のトピックをカバーします：

- **{{LEARNING_OBJECTIVE_1}}**
- **{{LEARNING_OBJECTIVE_2}}**
- **{{LEARNING_OBJECTIVE_3}}**

### 対象者
- {{TARGET_AUDIENCE_1}}
- {{TARGET_AUDIENCE_2}}
- {{TARGET_AUDIENCE_3}}

---

# 前提知識

このセッションを最大限活用するために、以下の知識があると良いでしょう：

✅ {{PREREQUISITE_1}}
✅ {{PREREQUISITE_2}}
✅ {{PREREQUISITE_3}}

> **注意**: 初心者の方でも理解できるよう、基礎から説明します。

---

<!-- _class: lead -->

# 2. 問題提起

---

# 現状の課題️

多くの開発者が以下のような問題に直面しています：

### 課題1: {{PROBLEM_1}}
{{PROBLEM_1_DESCRIPTION}}

### 課題2: {{PROBLEM_2}}
{{PROBLEM_2_DESCRIPTION}}

### 課題3: {{PROBLEM_3}}
{{PROBLEM_3_DESCRIPTION}}

---

# なぜこの問題が重要なのか？

## ビジネスへの影響
- {{BUSINESS_IMPACT_1}}
- {{BUSINESS_IMPACT_2}}

## 開発者への影響
- {{DEVELOPER_IMPACT_1}}
- {{DEVELOPER_IMPACT_2}}

## ユーザーへの影響
- {{USER_IMPACT_1}}
- {{USER_IMPACT_2}}

---

# 従来のアプローチの限界

これまでの一般的なアプローチ：

```{{LANGUAGE}}
// 従来の方法
{{OLD_APPROACH_CODE}}
```

**問題点**:
- {{OLD_APPROACH_ISSUE_1}}
- {{OLD_APPROACH_ISSUE_2}}
- {{OLD_APPROACH_ISSUE_3}}

---

<!-- _class: lead -->

# 3. 解決策の提示

---

# {{SOLUTION_NAME}}の登場

{{SOLUTION_DESCRIPTION}}

### 主な特徴
1. **{{FEATURE_1}}**: {{FEATURE_1_DESCRIPTION}}
2. **{{FEATURE_2}}**: {{FEATURE_2_DESCRIPTION}}
3. **{{FEATURE_3}}**: {{FEATURE_3_DESCRIPTION}}

---

# 新しいアプローチ

{{SOLUTION_NAME}}を使った実装：

```{{LANGUAGE}}
// 新しい方法
{{NEW_APPROACH_CODE}}
```

**改善点**:
- {{NEW_APPROACH_BENEFIT_1}}
- {{NEW_APPROACH_BENEFIT_2}}
- {{NEW_APPROACH_BENEFIT_3}}

---

# Before / After 比較

| 項目 | Before | After |
|------|--------|-------|
| {{METRIC_1}} | {{BEFORE_VALUE_1}} | {{AFTER_VALUE_1}} |
| {{METRIC_2}} | {{BEFORE_VALUE_2}} | {{AFTER_VALUE_2}} |
| {{METRIC_3}} | {{BEFORE_VALUE_3}} | {{AFTER_VALUE_3}} |

**結果**: {{IMPROVEMENT_SUMMARY}}

---

<!-- _class: lead -->

# 4. 技術詳細

---

# アーキテクチャ概要️

{{ARCHITECTURE_DESCRIPTION}}

```
{{ARCHITECTURE_DIAGRAM}}
```

### コンポーネント
- **{{COMPONENT_1}}**: {{COMPONENT_1_DESCRIPTION}}
- **{{COMPONENT_2}}**: {{COMPONENT_2_DESCRIPTION}}
- **{{COMPONENT_3}}**: {{COMPONENT_3_DESCRIPTION}}

---

# 実装の詳細（1/3）

## {{DETAIL_SECTION_1_TITLE}}

{{DETAIL_SECTION_1_DESCRIPTION}}

```{{LANGUAGE}}
{{DETAIL_CODE_1}}
```

**ポイント**:
- {{DETAIL_POINT_1_1}}
- {{DETAIL_POINT_1_2}}

---

# 実装の詳細（2/3）

## {{DETAIL_SECTION_2_TITLE}}

{{DETAIL_SECTION_2_DESCRIPTION}}

```{{LANGUAGE}}
{{DETAIL_CODE_2}}
```

**ポイント**:
- {{DETAIL_POINT_2_1}}
- {{DETAIL_POINT_2_2}}

---

# 実装の詳細（3/3）

## {{DETAIL_SECTION_3_TITLE}}

{{DETAIL_SECTION_3_DESCRIPTION}}

```{{LANGUAGE}}
{{DETAIL_CODE_3}}
```

**ポイント**:
- {{DETAIL_POINT_3_1}}
- {{DETAIL_POINT_3_2}}

---

# パフォーマンス最適化

### 最適化テクニック

1. **{{OPTIMIZATION_1}}**
   - {{OPTIMIZATION_1_DESCRIPTION}}

2. **{{OPTIMIZATION_2}}**
   - {{OPTIMIZATION_2_DESCRIPTION}}

3. **{{OPTIMIZATION_3}}**
   - {{OPTIMIZATION_3_DESCRIPTION}}

---

# ベストプラクティス

### 推奨される使い方

✅ **Do**
- {{BEST_PRACTICE_DO_1}}
- {{BEST_PRACTICE_DO_2}}
- {{BEST_PRACTICE_DO_3}}

❌ **Don't**
- {{BEST_PRACTICE_DONT_1}}
- {{BEST_PRACTICE_DONT_2}}
- {{BEST_PRACTICE_DONT_3}}

---

<!-- _class: lead -->

# 5. 実践例

---

# 事例1: {{CASE_STUDY_1_TITLE}}

## 概要
{{CASE_STUDY_1_OVERVIEW}}

## 実装
```{{LANGUAGE}}
{{CASE_STUDY_1_CODE}}
```

## 結果
- {{CASE_STUDY_1_RESULT_1}}
- {{CASE_STUDY_1_RESULT_2}}

---

# 事例2: {{CASE_STUDY_2_TITLE}}

## 概要
{{CASE_STUDY_2_OVERVIEW}}

## 実装
```{{LANGUAGE}}
{{CASE_STUDY_2_CODE}}
```

## 結果
- {{CASE_STUDY_2_RESULT_1}}
- {{CASE_STUDY_2_RESULT_2}}

---

# 事例3: {{CASE_STUDY_3_TITLE}}

## 概要
{{CASE_STUDY_3_OVERVIEW}}

## 実装
```{{LANGUAGE}}
{{CASE_STUDY_3_CODE}}
```

## 結果
- {{CASE_STUDY_3_RESULT_1}}
- {{CASE_STUDY_3_RESULT_2}}

---

# 実際のプロダクトでの採用例

多くの企業やプロジェクトで採用されています：

- **{{ADOPTER_1}}**: {{ADOPTER_1_USE_CASE}}
- **{{ADOPTER_2}}**: {{ADOPTER_2_USE_CASE}}
- **{{ADOPTER_3}}**: {{ADOPTER_3_USE_CASE}}

> "{{TESTIMONIAL}}" - {{TESTIMONIAL_AUTHOR}}

---

<!-- _class: lead -->

# 6. まとめ

---

# 重要なポイントの振り返り

### 今日学んだこと

1. **{{KEY_TAKEAWAY_1}}**
   - {{KEY_TAKEAWAY_1_DETAIL}}

2. **{{KEY_TAKEAWAY_2}}**
   - {{KEY_TAKEAWAY_2_DETAIL}}

3. **{{KEY_TAKEAWAY_3}}**
   - {{KEY_TAKEAWAY_3_DETAIL}}

---

# Next Steps

### すぐに始められること

1. **{{NEXT_STEP_1}}**
   - {{NEXT_STEP_1_DESCRIPTION}}

2. **{{NEXT_STEP_2}}**
   - {{NEXT_STEP_2_DESCRIPTION}}

3. **{{NEXT_STEP_3}}**
   - {{NEXT_STEP_3_DESCRIPTION}}

---

# 参考資料

### 公式ドキュメント
- [{{RESOURCE_1_NAME}}]({{RESOURCE_1_URL}})
- [{{RESOURCE_2_NAME}}]({{RESOURCE_2_URL}})

### 関連記事
- [{{ARTICLE_1_NAME}}]({{ARTICLE_1_URL}})
- [{{ARTICLE_2_NAME}}]({{ARTICLE_2_URL}})

### サンプルコード
- [{{SAMPLE_CODE_NAME}}]({{SAMPLE_CODE_URL}})

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
