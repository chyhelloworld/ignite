#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];

// 1) 必需目录
const requiredDirs = [
  "想法池", "调研", "决策档案", "产出",
  "背景库", "背景库/项目档案", "规则", ".claude/skills",
];
for (const d of requiredDirs) {
  if (!existsSync(join(root, d)) || !statSync(join(root, d)).isDirectory()) {
    errors.push(`缺少目录: ${d}`);
  }
}

// 2) 必需文件(Phase A 末尾应全部存在)
const requiredFiles = [
  "想法池/_状态总览.md",
  "背景库/概念词典.md",
  "背景库/_背景索引.md",
  "规则/schema与阶段定义.md",
  "规则/品类与平台映射.md",
  "规则/死因词表.md",
  "规则/eval样例.md",
];
for (const f of requiredFiles) {
  if (!existsSync(join(root, f))) errors.push(`缺少文件: ${f}`);
}

// 3) 每个 skill 目录必须有带 name + description 的 SKILL.md
const skillsDir = join(root, ".claude/skills");
if (existsSync(skillsDir)) {
  for (const name of readdirSync(skillsDir)) {
    const p = join(skillsDir, name, "SKILL.md");
    if (!existsSync(p)) { errors.push(`skill 缺 SKILL.md: ${name}`); continue; }
    const text = readFileSync(p, "utf8");
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { errors.push(`${name}: 缺 YAML frontmatter`); continue; }
    if (!/\bname:\s*\S/.test(fm[1])) errors.push(`${name}: frontmatter 缺 name`);
    if (!/\bdescription:\s*[\S|]/.test(fm[1])) errors.push(`${name}: frontmatter 缺 description`);
  }
}

if (errors.length) {
  console.error("FAIL\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("OK: 结构契约与 skill frontmatter 全部通过");
