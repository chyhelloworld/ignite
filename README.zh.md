# Ignite — 想法引擎 Spark

[English](README.md)

把平时**破碎的想法**(常常只是一句话),交给 AI 一起完善、联网调研竞品、做可行性评估,死掉的想法还能重组出火花,通过评估的候选一路产出商业设计与 PRD。

一套**本地文件知识工程 + 10 个 Claude Code skill**,已打包成可一键安装的插件。灵感来自 [dontbesilent2025/dbskill](https://github.com/dontbesilent2025/dbskill) 的「原子库 + skill 解耦」与决策系统模式。

---

## 这是什么

你脑子里冒出来的想法大多是半句话,直接评估是浪费,删掉又可惜。Spark 把每个想法当作**池子里的原子**:

- **单个想法可能不成立**——但它不会被删除,而是带着「死因」留在池里当燃料。
- **真正的火花常来自重组**——AI 扫全池(含死掉的想法),按主题与死因互补,把 A + C 拼成新候选。
- **粗糙想法先养肥再调研**——交互式对话把一句话补成"为谁解决什么痛 + 核心假设 + 待查竞品"。
- **调研只认带来源的事实**——竞品/定价/体量必须有链接,无来源标 `[unverified]`,绝不脑补。

```text
ideas 想法池(原子,永不删除)
  │  ① /spark:capture    一句话也行,原文逐字保留
  ▼
② /spark:refine ⇄ /spark:combine   交互式养肥;遇生词触发 /spark:background;收尾扫池找火花
  │   ⤷ 太空泛/伪概念 → 降级回池,不浪费调研
  ▼
③ /spark:research   按品类/平台联网拉真实竞品,每条带来源
  ▼
④ /spark:evaluate   逐条挑战核心假设 → go / no-go / maybe
  │   go ─────────────────▶ 候选
  │   no-go → 降级回池(写结构化死因)──┐
  ▼                                    │
⑤ /spark:combine   扫全池(含死原子)按死因互补提组合 ←┘ → combo 候选 → 回 ②
  │
  ▼  候选过评估门后
⑥ /spark:business   定位 / 客群 / 商业模式 / 定价 / GTM
  ▼
⑦ /spark:prd        PRD(功能需求带验收标准)+ 技术方案 + 任务清单 → documented
```

横切其上:**/spark:background** 维护概念词典 + 项目档案,让 AI 听懂你的简写。

---

## 10 个 skill

| skill | 命令 | 做什么 |
|---|---|---|
| idea | `/spark:idea` | 主入口,只路由 |
| capture | `/spark:capture` | 零摩擦把一句话存成 raw 原子,原文逐字 |
| refine | `/spark:refine` | 交互式养肥;降级伪概念;收尾找火花 |
| background | `/spark:background` | 标记不懂的术语 → 征得同意 → 联网查/问你 → 沉淀 |
| research | `/spark:research` | 按品类/平台联网扒竞品,每条带来源,防幻觉 |
| evaluate | `/spark:evaluate` | 可行性决策门;no-go 写死因留池 |
| combine | `/spark:combine` | 扫全池(含死原子)按主题/死因互补提组合 |
| business | `/spark:business` | 给 go 候选出定位/模式/定价/GTM |
| prd | `/spark:prd` | 可验证 PRD + 技术概要 + 任务清单 → documented |
| init | `/spark:init` | 把工作区脚手架铺到你的项目(跑一次) |

---

## 安装

```text
/plugin marketplace add chyhelloworld/ignite
/plugin install spark@ignite
```

然后,在你想存放想法的项目里:

```text
/spark:init                                   # 铺好 ideas/ research/ rules/ …(一次)
/spark:capture "给 Steam 独立游戏做差评聚合工具"
/spark:refine idea-0001                        # 养肥(遇生词会先问你要不要查)
/spark:research idea-0001                       # 联网竞品,带来源
/spark:evaluate idea-0001                        # go → 候选
/spark:business idea-0001                         # 商业设计
/spark:prd idea-0001                               # PRD → documented
```

不知道用哪个时,`/spark:idea` 替你路由。

### 本地开发(在本仓库里)

```bash
git clone https://github.com/chyhelloworld/ignite.git
cd ignite
claude --plugin-dir .     # 从工作区加载插件
```

---

## 目录结构

```text
.claude-plugin/         plugin.json(name: spark)+ marketplace.json(name: ignite)
skills/                 10 个 skill(SKILL.md)
ideas/                  想法原子(一想法一文件)+ _status.md(第一入口)
research/               调研快照(写完不改,带来源)
decisions/              评估快照(写完不改,带时间戳)
outputs/                商业设计 + PRD
background/             概念词典(公开术语)+ projects/(私有背景)+ _index.md
rules/                  schema · category-platform-map · death-reasons · eval-samples(配置)
tools/validate.mjs      结构 + frontmatter 校验器(唯一自动化门)
docs/                   设计文档(spec / plan,作为设计史保留)
```

> `ideas/research/decisions/outputs` 存每个项目的用户数据;`rules/` 与 `background/` 作为模板随插件分发,由 `/spark:init` 复制到你的项目。

字段与状态流的完整定义见 `rules/schema.md`。

---

## 设计理念

- **数据契约先行,skill 慢慢长**:改提示词廉价,迁移已存的想法昂贵——先把原子 schema 与目录契约钉死。
- **横切能力 vs 主线**:`combine`(死想法重组)和 `background`(术语/项目沉淀)是横切层,不锁死在某阶段。
- **结构化死因 = 精确匹配键**:no-go 必写受控死因,`combine` 才能按"可被什么互补"配对。
- **防幻觉硬约束**:调研/评估只采信带来源的事实;模型记忆不算来源。

---

## 自检

```bash
node tools/validate.mjs    # OK: structure contract and skill frontmatter all pass
```

skill 行为靠 `rules/eval-samples.md` 的黄金样例人工 dry-run 回归。

---

## 许可证

[CC BY-NC 4.0](LICENSE)。个人 / 学习 / 研究 / 非商业项目可自由使用、修改、分发,需署名;**商业用途需单独授权**。方法论受 [dbskill](https://github.com/dontbesilent2025/dbskill)(同为 CC BY-NC 4.0)启发,代码与提示词为独立编写。

---

> 用 Claude Code 经 brainstorm → spec → plan → 多代理实现流程构建。
