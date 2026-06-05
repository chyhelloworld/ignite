# 想法引擎 Spark

把平时**破碎的想法**(常常只是一句话),交给 AI 一起完善、联网调研竞品、做可行性评估,死掉的想法还能重组出火花,通过评估的候选一路产出商业设计与 PRD。

一套**本地文件知识工程 + 9 个 Agent skill**,跑在 Claude Code / Codex 等任意支持 skill 的 Agent 上。灵感来自 [dontbesilent2025/dbskill](https://github.com/dontbesilent2025/dbskill) 的「原子库 + skill 解耦」与决策系统模式。

---

## 这是什么

你脑子里冒出来的想法大多是半句话,直接评估是浪费,删掉又可惜。Spark 把每个想法当作**池子里的原子**:

- **单个想法可能不成立**——但它不会被删除,而是带着「死因」留在池里当燃料。
- **真正的火花常来自重组**——AI 扫全池(含死掉的想法),按主题与死因互补,把 A + C 拼成新候选。
- **粗糙想法先养肥再调研**——交互式对话把一句话补成"为谁解决什么痛 + 核心假设 + 待查竞品",不在烂点子上烧调研额度。
- **调研只认带来源的事实**——竞品/定价/体量必须有链接,无来源标 `[未核实]`,绝不脑补。

```text
想法池(原子,永不删除)
  │  ① /捕捉      一句话也行,先进池子(原文逐字保留)
  ▼
② /完善  ⇄  /找火花     交互式养肥;遇生词触发 /背景;收尾顺手扫池找火花
  │   ⤷ 太空泛/伪概念 → 降级回池,不浪费调研
  ▼
③ /调研     按品类/平台联网拉真实竞品,每条带来源
  ▼
④ /评估     逐条挑战核心假设 → go / no-go / maybe
  │   go ─────────────▶ 候选
  │   no-go → 降级回池(写结构化死因)──┐
  ▼                                    │
⑤ /找火花  扫全池(含死原子)按死因互补提组合 ←┘ → combo 候选 → 回 ②
  │
  ▼  候选过评估门后
⑥ /商业     定位 / 客群 / 商业模式 / 定价 / GTM
  ▼
⑦ /prd      PRD(功能需求带验收标准)+ 技术方案 + 任务清单 → documented
```

横切其上:**/背景**(把不懂的术语/项目背景查清沉淀,让 AI 听懂你的简写)。

---

## 工具箱(9 个 skill)

| skill | 触发 | 做什么 |
|---|---|---|
| `spark` | `/想法` | 主入口,只路由不干活;开口前先读背景索引与状态总览 |
| `spark-capture` | `/捕捉` | 零摩擦把一句话存成 raw 原子,原文逐字保留 |
| `spark-refine` | `/完善` | 交互式(一次问一个)把想法养到可调研;伪概念当场降级;收尾找火花 |
| `spark-background` | `/背景` | 标记不懂的术语/项目 → 征得同意 → 公开术语联网查 / 私有背景问你 → 沉淀 |
| `spark-research` | `/调研` | 按品类/平台联网扒竞品(产品/定价/体量/差评痛点),每条带来源,防幻觉 |
| `spark-evaluate` | `/评估` | 可行性决策门:引 `[已核实]` 证据挑战假设,出 verdict;no-go 写死因留池 |
| `spark-combine` | `/找火花` | 扫全池(含死原子)按主题/死因互补提组合,建 combo 候选 |
| `spark-business` | `/商业` | 给 `verdict:go` 候选出定位/模式/定价(定价即产品+价差检验)/GTM |
| `spark-prd` | `/prd` | 候选有商业设计后,出可验证 PRD + 技术概要 + 任务清单,置 `documented` |

---

## 安装与使用

### 在本仓库里直接用(最简单)

skill 是 Claude Code **项目级 skill**(`.claude/skills/`)。克隆本仓库,在仓库目录里打开 Claude Code,你的想法就长在 `想法池/` 里:

```bash
git clone https://github.com/chyhelloworld/ignite.git
cd ignite
claude            # 打开 Claude Code
```

然后跑完整条线:

```text
/捕捉 "给 Steam 独立游戏做差评聚合工具"
/完善 idea-0001        # 养肥(遇生词会问要不要 /背景)
/调研 idea-0001        # 联网竞品,带来源
/评估 idea-0001        # go → 候选
/商业 idea-0001        # 出商业设计
/prd  idea-0001        # 出 PRD → documented
```

不知道用哪个时,`/想法` 让主入口替你路由。

### 移植到你自己的项目

把 `.claude/skills/spark*` 连同 `规则/`、`背景库/`、`想法池/_状态总览.md` 一起拷进你的项目即可(skill 依赖这些目录与配置)。

---

## 目录结构

```text
.claude/skills/        9 个 skill(SKILL.md)
想法池/                想法原子(一想法一文件)+ _状态总览.md(第一入口)
调研/                  调研快照(写完不改,带来源)
决策档案/              评估快照(写完不改,带时间戳)
产出/                  商业设计 + PRD 等设计文档
背景库/                概念词典(公开术语)+ 项目档案(私有背景)+ _背景索引.md
规则/                  schema · 品类平台映射 · 死因词表 · eval 样例(可配置数据)
tools/validate.mjs     结构 + frontmatter 校验器(唯一自动化门)
docs/superpowers/      设计文档(spec)与实现计划(plan)
```

### 想法原子(数据契约)

每个想法是一个带 YAML frontmatter 的 markdown 文件:

```yaml
---
id: idea-0042
title: 一句话标题
status: raw            # raw→refining→refined→researching→researched→evaluated→candidate→documented
kind: single           # single | combo(组合候选)
parents: []            # combo 的来源原子
tags: [AI, 效率工具]
category: 游戏          # 品类(→ 默认首发平台)
platform: Steam        # 首发平台
effort: null           # 工作量 S/M/L/XL
excitement: null       # 你的兴奋度 1-5
verdict: null          # go | no-go | maybe
death_reason: null     # no-go 必填,取自死因词表(找火花的匹配键)
research_ref: null     # 调研快照
eval_ref: null         # 评估快照
artifacts: []          # 商业设计 / PRD
relationships: []      # 互补 | 撞车 | 同源 | 反例
---
```

字段与状态流的完整定义见 `规则/schema与阶段定义.md`。

---

## 设计理念(为什么这么做)

- **数据契约先行,skill 慢慢长**:改提示词廉价,迁移已存的几十条想法昂贵——所以先把原子 schema 与目录契约钉死。
- **横切能力 vs 主线流水线**:`找火花`(死想法重组)和 `背景调查`(术语/项目沉淀)是横切层,不锁死在某个阶段,全系统复用。
- **结构化死因 = 精确匹配键**:评估 no-go 必须写受控词表里的死因(缺流量入口/缺变现路径/…),`找火花` 才能按「可被什么互补」做配对。
- **防幻觉硬约束**:调研/评估只采信带来源链接的 `[已核实]` 事实;模型记忆不算来源。

完整设计与决策记录:
- 设计文档:[`docs/superpowers/specs/2026-06-04-想法引擎-design.md`](docs/superpowers/specs/2026-06-04-想法引擎-design.md)
- 实现计划:[第一期](docs/superpowers/plans/2026-06-04-想法引擎第一期.md) · [第二期](docs/superpowers/plans/2026-06-04-想法引擎第二期.md)

---

## 自检

任何改动后跑一次结构校验:

```bash
node tools/validate.mjs    # OK: 结构契约与 skill frontmatter 全部通过
```

skill 的行为靠 `规则/eval样例.md` 里的黄金样例做人工 dry-run 回归(提示词系统不适合上自动测试框架)。

---

## 许可证

[CC BY-NC 4.0](LICENSE)。个人 / 学习 / 研究 / 非商业项目可自由使用、修改、分发,需署名并注明出处;**商业用途需单独授权**。本项目方法论受 [dbskill](https://github.com/dontbesilent2025/dbskill)(同为 CC BY-NC 4.0)启发,代码与提示词为独立编写。

---

> 用 Claude Code 经 brainstorm → spec → plan → 多代理实现流程构建。
