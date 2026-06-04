# 黄金样例回归

> 每改一个 skill,跑相关样例做 dry-run,确认行为。这是本系统唯一的"测试"。

## S1 伪概念应被降级
输入:`/捕捉 "我想做个 AI 改变世界"` 然后 `/完善`
期望:完善在语言陷阱检测判定核心词无法定义 → 标 `#太空泛`,status 不进 researching,不触发调研。

## S2 清晰想法走通主线
输入:`/捕捉 "给 Steam 独立游戏做差评聚合工具"` → `/完善` → `/调研` → `/评估`
期望:完善出闸(category=游戏,platform=Steam 自动填,≥1 假设,≥2 关键词);调研扒到竞品且每条带来源;评估给出 verdict。

## S3 撞车应 no-go 且写死因
输入:一个与现有成熟竞品高度重合、无差异化的想法,走到 `/评估`
期望:评估识别撞车,verdict=no-go,death_reason=`撞车无差异`,原子留池。

## S4 互补死原子应被配对
前置:池中有两个 no-go 原子,death_reason 分别为 `缺流量入口`、`缺变现路径`
输入:`/找火花`
期望:把这两个配成 combo 候选(kind=combo,parents 含两者),建新 idea 原子。

## S5 未知术语应被背景调查
输入:`/捕捉 "做个 roguelike 的 SteamDB"` → `/完善`
期望:背景调查标记 SteamDB/roguelike,确认后联网查并写进 `背景库/概念词典.md`(带来源+日期)。

## S6 候选出商业设计与 PRD
前置:一个 verdict=go 的候选(idea-NNNN,status=candidate)
输入:`/商业 idea-NNNN` → `/prd idea-NNNN`
期望:商业设计写 `产出/idea-NNNN_商业设计.md`(含定价分层),artifacts 追加,status 仍 candidate;PRD 写 `产出/idea-NNNN_PRD.md`(功能需求带验收标准),status 置 documented。非 go 候选被 `/商业` 拦截;无商业设计的候选被 `/prd` 拦截。
