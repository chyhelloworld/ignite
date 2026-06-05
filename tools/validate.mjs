#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];

// 1) required directories
const requiredDirs = [
  "ideas", "research", "decisions", "outputs",
  "background", "background/projects", "rules", "skills",
];
for (const d of requiredDirs) {
  const st = statSync(join(root, d), { throwIfNoEntry: false });
  if (!st?.isDirectory()) errors.push(`missing dir: ${d}`);
}

// 2) required files
const requiredFiles = [
  "ideas/_status.md",
  "background/glossary.md",
  "background/_index.md",
  "rules/schema.md",
  "rules/category-platform-map.md",
  "rules/death-reasons.md",
  "rules/eval-samples.md",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
];
for (const f of requiredFiles) {
  if (!existsSync(join(root, f))) errors.push(`missing file: ${f}`);
}

// 3) plugin manifests must be valid JSON
for (const f of [".claude-plugin/plugin.json", ".claude-plugin/marketplace.json"]) {
  const p = join(root, f);
  if (existsSync(p)) {
    try { JSON.parse(readFileSync(p, "utf8")); }
    catch { errors.push(`${f}: invalid JSON`); }
  }
}

// 4) each skill dir must have a SKILL.md with name + description frontmatter
const skillsDir = join(root, "skills");
if (existsSync(skillsDir)) {
  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue; // only skill subdirs, ignore stray files
    const name = entry.name;
    const p = join(skillsDir, name, "SKILL.md");
    if (!existsSync(p)) { errors.push(`skill missing SKILL.md: ${name}`); continue; }
    const text = readFileSync(p, "utf8").replace(/\r\n/g, "\n"); // normalize CRLF
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { errors.push(`${name}: missing YAML frontmatter`); continue; }
    if (!/\bname:[^\S\n]*\S/.test(fm[1])) errors.push(`${name}: frontmatter missing name`);
    if (!/\bdescription:[^\S\n]*\S/.test(fm[1])) errors.push(`${name}: frontmatter missing description`);
  }
}

if (errors.length) {
  console.error("FAIL\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("OK: structure contract and skill frontmatter all pass");
