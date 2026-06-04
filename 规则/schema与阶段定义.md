# Schema 与阶段定义

## 想法原子 frontmatter 字段

| 字段 | 取值 | 说明 |
|---|---|---|
| id | `idea-NNNN` | 四位序号,递增,不复用 |
| title | string | 一句话标题 |
| status | raw/refining/refined/researching/researched/evaluated/candidate/documented | 当前阶段 |
| kind | single/combo | combo 由找火花产生 |
| parents | `[idea-..]` | combo 的来源原子;single 为 `[]` |
| tags | `[..]` | 主题标签,找火花聚类用 |
| category | 游戏/App/SaaS/内容/硬件/工具/… | 品类 |
| platform | Steam/iOS/Android/Web/小程序/抖音/公众号/… | 首发平台 |
| effort | S/M/L/XL | 工作量预估 |
| excitement | 1-5 | 用户主观兴奋度 |
| verdict | null/go/no-go/maybe | 评估门结论 |
| death_reason | null 或死因词 | no-go 时必填,取自死因词表 |
| created / updated | YYYY-MM-DD | 日期 |
| research_ref / eval_ref | 路径或 null | 关联快照 |
| artifacts | `[..]` | 产出文件 |
| relationships | `[{type,target}]` | 互补/撞车/同源/反例 |

## 状态流转

raw →(完善)→ refined →(调研)→ researched →(评估)→ evaluated
  ├ verdict=go → candidate →(商业/PRD,二期)→ documented
  ├ verdict=maybe → 回调研/回完善
  └ verdict=no-go → 留池,death_reason 必填,成为找火花燃料

## 来源标签(写进正文)

`[本人]` 用户原话 · `[AI推测]` 未证实推断 · `[AI结论]` 推理结论 · `[修正]` 后续更正 · `[已核实]` 带来源链接的事实 · `[未核实]` 无来源 · `[存疑]` 矛盾未决

## 想法原子 body 固定结构

```
## 原文 [本人]
## 完善后描述
## 核心假设
## 待调研
## 完善记录 [AI 元记录]
```
