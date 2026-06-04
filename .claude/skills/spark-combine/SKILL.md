---
name: spark-combine
description: |
  想法引擎·找火花。扫全池(含死掉的想法)按主题/死因互补提组合,建 combo 候选。
  触发:/找火花、/combine、「拼拼看有没有火花」
  Spark combine: scan the whole pool (incl. dead atoms) and propose combinations as new combo candidates.
---

# spark-combine:找火花

扫全池(含死原子)按主题/死因互补提组合,建 combo 候选;新 combo 回 `/完善` 重新养。

---

## 两种触发

| 触发方式 | 扫描范围 |
|---|---|
| 用户手动 `/找火花`(或 `/combine`、「拼拼看有没有火花」) | **全池扫描**:读 `想法池/` 下所有原子 |
| 被 `/完善` 收尾(Phase 7)调用 | **轻量扫描**:只扫与当前想法 `tags`/`category`/`death_reason` 相关的原子 |

---

## 扫描流程

### Step 1 — 读全池

读 `想法池/` 下所有 `idea-NNNN_*.md` 文件,提取每个原子的:
- `id`、`title`、`tags`、`category`、`verdict`、`death_reason`、`relationships`

**`verdict: no-go` 的死原子必须纳入扫描——它们是火花燃料,绝不过滤。**

### Step 2 — 匹配维度

对每一对原子(A, B)从两个维度判断是否可组合:

**① 主题邻近**:A 与 B 的 `tags` 或 `category` 有重叠 → 可能同一用户群或同一场景。

**② 死因互补**:参照 `规则/死因词表.md` 的「可被什么互补」列:

| A 的 death_reason | 可被什么 B 填补 |
|---|---|
| 缺流量入口 | B 自带流量/渠道 |
| 缺变现路径 | B 有付费场景 |
| 缺技术能力 | B 已有技术资产 |
| 撞车无差异 | B 提供差异化角度 |
| 需求太弱 | B 有强需求场景 |
| effort过大 | B 能复用/降本 |
| 平台限制 | B 换平台或绕开 |

> 互补是双向的:B 有 death_reason 时同样检查 A 能否填补 B 的缺口。

### Step 3 — 给出候选

整理有价值的组合,格式:

```
{idea-A 标题} + {idea-C 标题} 可能擦出 {X}
理由:{为什么互补/为什么有火花,一句话}
```

- **一次最多提 3 组**,按火花强度排序(死因互补优先于纯主题邻近)。
- 没有找到值得组合的 → 如实告知:「暂时没扫到值得拼的组合。」

---

## 建 combo

用户选中某组合后执行以下步骤:

### Step 1 — 取下一个 id

扫 `想法池/` 所有 `idea-NNNN_*.md`,提取最大序号 +1,四位补零,得 `idea-NNNN`。

### Step 2 — 新建原子文件

文件路径:`想法池/idea-NNNN_标题.md`

标题用「{A 标题简写}×{C 标题简写}」或简明描述组合点(不超过约 15 字)。

**frontmatter 模板(逐字照搬,替换占位符):**

```yaml
---
id: idea-NNNN
title: {组合点一句话标题}
status: raw
kind: combo
parents: [idea-A, idea-C]
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

- `kind` 固定 `combo`;`parents` 填两个来源原子的 id。
- `status` 固定 `raw`——新 combo 必须重走完善→调研→评估。
- 其余字段照 capture 模板填 null/空数组,created=updated=今天日期。

**body 骨架:**

```markdown
## 原文 [本人]
> 由 {idea-A 标题} + {idea-C 标题} 组合而来:{组合点一句话} [AI结论]

## 完善后描述
(待完善)

## 核心假设
(待完善)

## 待调研
(待完善)

## 完善记录 [AI 元记录]
```

> `## 原文 [本人]` 下标 `[AI结论]`——这个组合是 AI 提出的,不是用户原话。

### Step 3 — 回写来源原子的 relationships

**原 A 和 C 文件原封不动**,只在各自的 `relationships` 数组里追加一条:

```yaml
- { type: 互补, target: idea-NNNN }
```

（`idea-NNNN` 即新建的 combo id。）

### Step 4 — 更新状态总览

在 `想法池/_状态总览.md` 表格末尾追加一行:

```
| idea-NNNN | 标题 | raw | combo |  |  |  |  | YYYY-MM-DD |
```

---

## 收尾

建文件完成后,提示用户:

```
已建 combo idea-NNNN「{标题}」。
来源:idea-A「{A 标题}」+ idea-C「{C 标题}」
下一步:/完善 idea-NNNN  →  重新养肥(组合也要走完善→调研→评估)。
```

---

## 边界

- **池里原子 < 2** → 不扫描,直接回复:「池子里想法太少,先多捕捉几个再来找火花。」
- **用户不选任何组合** → 不建文件,只保留建议;用户下次再触发找火花时重新扫。
- **两个原子已存在互补关系**(`relationships` 里已有对方)→ 跳过,不重复提议。
- **combo 原子本身**(`kind: combo`)可作为来源原子参与下一轮组合,但优先级低于 single 原子。

---

## 语言

中文进中文出。用户用英文输入 → 英文建议保留,但文件内各节标题保持中文。
