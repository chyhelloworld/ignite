---
name: spark-capture
description: |
  想法引擎·捕捉。零摩擦把一句话想法存进想法池,原文逐字保留。
  触发:/捕捉、/capture、「记一下」「先存着这个想法」
  Spark capture: append a raw idea atom to the pool with zero friction.
---

# spark-capture:捕捉

**只建 raw 原子,不追问、不养肥、不调研。**

---

## 建原子流程

**Step 1 — 取 id**

扫 `想法池/` 下所有匹配 `idea-NNNN_*.md` 的文件,提取序号,取最大值 +1;若一个都没有,从 `idea-0001` 开始。序号四位补零。

**Step 2 — 确定文件名**

文件路径:`想法池/idea-NNNN_标题.md`

标题取用户那句话的名词性缩写,不超过约 15 字,不改写原意、不抽象化。

**Step 3 — 写入 frontmatter(模板如下,逐字照搬,替换占位符)**

```yaml
---
id: idea-NNNN
title: 一句话标题
status: raw
kind: single
parents: []
tags: []
category: null
platform: null
effort: null
excitement: null
verdict: null
death_reason: null
created: YYYY-MM-DD
updated: YYYY-MM-DD
research_ref: null
eval_ref: null
artifacts: []
relationships: []
---
```

- `status` 固定写 `raw`
- `category / platform / effort / excitement / verdict / death_reason / research_ref / eval_ref` 均填 `null`
- `tags / parents / artifacts / relationships` 填空数组 `[]`
- `created` 与 `updated` 填今天日期(通过 Bash `date +%F` 或系统日期获取)

**Step 4 — 写入 body 骨架(模板如下)**

```markdown
## 原文 [本人]
> {用户原话,逐字保留}

## 完善后描述
(待完善)

## 核心假设
(待完善)

## 待调研
(待完善)

## 完善记录 [AI 元记录]
```

`## 原文 [本人]` 下的引用块必须是用户说的那句话原文,一字不改。

---

## 零摩擦原则

- 句中出现未知术语或私有背景词 → **不打断用户,不联网,不追问**。在 `## 待调研` 里写一行 `待补背景:[词]`,留给后续 `/背景` 或 `/完善` 处理。
- 捕捉阶段绝不联网、绝不追问、绝不评估、绝不改写原话。

---

## 收尾

**更新 `想法池/_状态总览.md`**:在表格末尾追加一行:

```
| idea-NNNN | 标题 | raw |  |  |  |  |  | YYYY-MM-DD |
```

(verdict / category / platform / excitement / effort 列留空)

**回执一行**:

```
已存:idea-NNNN · 想法池/idea-NNNN_标题.md。下一步 /完善
```

---

## 边界

- **空输入** → 不建文件,回复「没有捕捉到想法,请说一句话。」
- **用户一次给多个想法** → 拆成多条,每条分别建独立原子,依序执行完整流程,最后一并回执所有 id。

---

## 语言

中文进中文出。用户用英文输入 → 英文原话保留在 `## 原文 [本人]`,其余骨架标题保持中文。
