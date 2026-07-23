import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const contentDir = path.join(siteRoot, "content");
const outputPath = path.join(siteRoot, "theory-lessons.js");
const updated = "2026-07-23";

const expectedCounts = {
  m00: 2,
  m01: 7,
  m02: 6,
  m03: 6,
  m04: 5,
  m05: 5,
  m06: 5,
  m07: 6,
  m08: 5,
  m09: 4
};

const fail = (message) => {
  throw new Error(message);
};

const normalizeSourceKind = (kind) => {
  const value = String(kind || "").trim().toLocaleLowerCase("en-US");
  if (value.includes("paper")) return "原始论文";
  if (value.includes("regulation") || value.includes("law")) return "法律与监管";
  if (
    value.includes("ietf") ||
    value.includes("w3c") ||
    value.includes("protocol") ||
    value.includes("standard") ||
    value.includes("spec") ||
    value.includes("registry")
  ) return "标准与协议";
  if (value.includes("nist") || value.includes("framework")) return "治理框架";
  if (value.includes("security")) return "安全指南";
  if (value.includes("official-handbook") || value.includes("government-handbook")) return "官方文档";
  if (value.includes("book") || value.includes("textbook")) return "教材与专著";
  if (value.includes("definition")) return "权威定义";
  return "官方文档";
};

const contentFiles = fs.readdirSync(contentDir)
  .filter((name) => /^theory-m\d\d-m\d\d\.json$/.test(name))
  .sort();

if (!contentFiles.length) fail(`没有在 ${contentDir} 找到理论稿`);
const contentFingerprint = crypto.createHash("sha256")
  .update(contentFiles.map((name) => `${name}\0${fs.readFileSync(path.join(contentDir, name), "utf8")}`).join("\0"))
  .digest("hex");

const lessons = contentFiles.flatMap((name) => {
  const filePath = path.join(contentDir, name);
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const list = Array.isArray(parsed) ? parsed : parsed.lessons;
  if (!Array.isArray(list)) fail(`${name} 顶层必须是数组或包含 lessons 数组`);
  return list;
});

const normalized = lessons
  .map((lesson) => ({
    ...lesson,
    sources: Array.isArray(lesson.sources)
      ? lesson.sources.map((source) => ({ ...source, kind: normalizeSourceKind(source.kind) }))
      : lesson.sources,
    status: "published",
    phase: "theory",
    updated,
    revision: lesson.revision || "theory-v1",
    level: lesson.level || "零基础 · 理论课"
  }))
  .sort((a, b) => a.module.localeCompare(b.module) || a.order - b.order)
  .map((lesson, index) => ({ ...lesson, number: String(index).padStart(2, "0") }));

if (normalized.length !== 51) fail(`理论课应为 51 节，实际为 ${normalized.length}`);

// 同一 URL 在不同课程中只保留一个稳定标题，避免参考资料库出现重复命名。
const canonicalSourceTitles = new Map();
for (const lesson of normalized) {
  lesson.sources?.forEach((source) => {
    if (!canonicalSourceTitles.has(source.url)) canonicalSourceTitles.set(source.url, source.title);
    else source.title = canonicalSourceTitles.get(source.url);
  });
}

const ids = new Set();
for (const lesson of normalized) {
  if (ids.has(lesson.id)) fail(`重复课程 ID：${lesson.id}`);
  ids.add(lesson.id);
  if (!Object.hasOwn(expectedCounts, lesson.module)) fail(`未知模块：${lesson.module}`);
  if (!lesson.id.startsWith(`${lesson.module}-l`)) fail(`课程 ${lesson.id} 与模块 ${lesson.module} 不匹配`);
  if (!Number.isInteger(lesson.order) || lesson.order < 0) fail(`课程 ${lesson.id} 的 order 无效`);
  if (!lesson.title || !lesson.shortTitle || !lesson.deck) fail(`课程 ${lesson.id} 缺少标题或导语`);
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 4) fail(`课程 ${lesson.id} 的目标少于 4 个`);
  if (!Array.isArray(lesson.prerequisites) || lesson.prerequisites.length < 1) fail(`课程 ${lesson.id} 缺少先修知识`);
  if (!Array.isArray(lesson.sections) || lesson.sections.length < 4) fail(`课程 ${lesson.id} 的理论章节少于 4 个`);
  if (!Array.isArray(lesson.misconceptions) || lesson.misconceptions.length < 3) fail(`课程 ${lesson.id} 的误区少于 3 个`);
  if (!lesson.travelCase || !Array.isArray(lesson.travelCase.paragraphs) || lesson.travelCase.paragraphs.length < 2) {
    fail(`课程 ${lesson.id} 的旅行案例不完整`);
  }
  if (!Array.isArray(lesson.travelCase.decisionRules) || lesson.travelCase.decisionRules.length < 3) {
    fail(`课程 ${lesson.id} 的旅行案例缺少决策规则`);
  }
  if (!Array.isArray(lesson.recap) || lesson.recap.length < 4) fail(`课程 ${lesson.id} 的小结少于 4 条`);
  if (!Array.isArray(lesson.questions) || lesson.questions.length < 3) fail(`课程 ${lesson.id} 的自检题少于 3 题`);
  if (!Array.isArray(lesson.sources) || lesson.sources.length < 3) fail(`课程 ${lesson.id} 的来源少于 3 个`);

  lesson.sections.forEach((section, sectionIndex) => {
    if (!section.title || !Array.isArray(section.paragraphs) || section.paragraphs.length < 2) {
      fail(`课程 ${lesson.id} 第 ${sectionIndex + 1} 节至少需要标题和 2 个段落`);
    }
  });

  lesson.misconceptions.forEach((item, itemIndex) => {
    if (!item.claim || !item.correction) fail(`课程 ${lesson.id} 第 ${itemIndex + 1} 个误区字段不完整`);
  });

  lesson.questions.forEach((item, itemIndex) => {
    if (!item.prompt || !item.answer) fail(`课程 ${lesson.id} 第 ${itemIndex + 1} 个自检题字段不完整`);
  });

  lesson.sources.forEach((source, sourceIndex) => {
    if (!source.title || !source.url || !source.note || !source.kind) {
      fail(`课程 ${lesson.id} 第 ${sourceIndex + 1} 个来源字段不完整`);
    }
    let url;
    try {
      url = new URL(source.url);
    } catch {
      fail(`课程 ${lesson.id} 的来源 URL 无效：${source.url}`);
    }
    if (url.protocol !== "https:") fail(`课程 ${lesson.id} 的来源必须使用 HTTPS：${source.url}`);
  });
}

for (const [moduleId, expected] of Object.entries(expectedCounts)) {
  const moduleLessons = normalized.filter((lesson) => lesson.module === moduleId);
  if (moduleLessons.length !== expected) fail(`${moduleId} 应有 ${expected} 课，实际为 ${moduleLessons.length}`);
  moduleLessons.forEach((lesson, order) => {
    if (lesson.order !== order) fail(`${moduleId} 的课程 order 必须连续，${lesson.id} 实际为 ${lesson.order}`);
    const expectedId = `${moduleId}-l${String(order).padStart(2, "0")}`;
    if (lesson.id !== expectedId) fail(`${moduleId} 第 ${order + 1} 课 ID 应为 ${expectedId}，实际为 ${lesson.id}`);
  });
}

const publicText = JSON.stringify(normalized);
if (/openapi-(?:sj|qb-ai)\.sii\.edu\.cn/i.test(publicText)) fail("理论稿包含私有 SII Endpoint");
if (/Bearer\s+[A-Za-z0-9+/=]{24,}/.test(publicText)) fail("理论稿疑似包含硬编码 Bearer 凭证");

const banner = [
  "/*",
  " * 由 scripts/build-theory.mjs 从 content/theory-*.json 生成。",
  ` * 内容指纹：sha256-${contentFingerprint}`,
  " * 请修改对应理论稿后重新生成，不要直接手改本文件。",
  " */",
  ""
].join("\n");

fs.writeFileSync(
  outputPath,
  `${banner}window.TheoryLessons = ${JSON.stringify(normalized, null, 2)};\n`,
  "utf8"
);

const uniqueSources = new Set(normalized.flatMap((lesson) => lesson.sources.map((source) => source.url)));
const theoryCharacters = normalized.reduce((sum, lesson) => {
  const text = [
    ...lesson.objectives,
    ...lesson.sections.flatMap((section) => [...section.paragraphs, ...(section.bullets || [])]),
    ...lesson.misconceptions.flatMap((item) => [item.claim, item.correction]),
    ...lesson.travelCase.paragraphs,
    ...lesson.travelCase.decisionRules,
    ...lesson.recap,
    ...lesson.questions.flatMap((item) => [item.prompt, item.answer])
  ].join("");
  return sum + text.length;
}, 0);

console.log(
  `理论数据生成完成：${normalized.length} 课、${uniqueSources.size} 个唯一来源、` +
  `${theoryCharacters.toLocaleString("zh-CN")} 个理论字符。`
);
