import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const contentDir = path.join(siteRoot, "content");
const outputPath = path.join(siteRoot, "theory-lessons.js");
const updated = "2026-07-24";

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

const TEXTBOOK_MINIMUM_CHARACTERS = {
  "m00-l00": 12000,
  "m00-l01": 16000,
  "m01-l00": 24000
};
const TEXTBOOK_COMPONENT_MINIMUMS = {
  "m01-l00": {
    sections: 15,
    definitions: 35,
    tables: 10,
    examples: 10,
    checkpoints: 15,
    sources: 25
  }
};
const TEXTBOOK_IDS = new Set(Object.keys(TEXTBOOK_MINIMUM_CHARACTERS));

const fail = (message) => {
  throw new Error(message);
};

const countStrings = (value) => {
  if (typeof value === "string") return value.length;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + countStrings(item), 0);
  if (value && typeof value === "object") {
    return Object.entries(value).reduce(
      (sum, [key, item]) => sum + (["id", "sourceRefs"].includes(key) ? 0 : countStrings(item)),
      0
    );
  }
  return 0;
};

const lessonBodyCharacters = (lesson) => countStrings({
  objectives: lesson.objectives,
  readingGuide: lesson.readingGuide,
  sections: lesson.sections,
  misconceptions: lesson.misconceptions,
  travelCase: lesson.travelCase,
  recap: lesson.recap,
  questions: lesson.questions
});

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
const rawLessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const reviewDir = path.join(contentDir, "reviews");
if (!fs.existsSync(reviewDir)) fail("缺少教材独立审校清单目录");
const reviewFiles = fs.readdirSync(reviewDir)
  .filter((name) => name.endsWith(".json"))
  .sort();
if (!reviewFiles.length) fail("缺少教材独立审校清单");

const reviewSources = reviewFiles.map((name) => ({
  name,
  source: fs.readFileSync(path.join(reviewDir, name), "utf8")
}));
const reviewFingerprint = crypto.createHash("sha256")
  .update(reviewSources.map(({ name, source }) => `${name}\0${source}`).join("\0"))
  .digest("hex");
const reviewedLessonHashes = new Map();
for (const { name, source } of reviewSources) {
  const manifest = JSON.parse(source);
  for (const lessonId of manifest.reviewScope || []) {
    if (reviewedLessonHashes.has(lessonId)) {
      fail(`精修课 ${lessonId} 在多个审校清单中重复出现：${name}`);
    }
    const lessonHash = manifest.lessonHashes?.[lessonId];
    if (!lessonHash) fail(`审校清单 ${name} 缺少 ${lessonId} 的内容指纹`);
    reviewedLessonHashes.set(lessonId, lessonHash);
  }
}
const reviewedIds = new Set(reviewedLessonHashes.keys());
if (
  reviewedIds.size !== TEXTBOOK_IDS.size ||
  [...TEXTBOOK_IDS].some((lessonId) => !reviewedIds.has(lessonId))
) {
  fail("教材审校范围与本版本精修课不一致");
}

const normalized = lessons
  .map((lesson) => ({
    ...lesson,
    sources: Array.isArray(lesson.sources)
      ? lesson.sources.map((source) => ({ ...source, kind: normalizeSourceKind(source.kind) }))
      : lesson.sources,
    status: "published",
    phase: "theory",
    updated,
    contentStatus: lesson.contentStatus || "theory-draft",
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
  if (!["theory-draft", "textbook"].includes(lesson.contentStatus)) {
    fail(`课程 ${lesson.id} 的 contentStatus 无效：${lesson.contentStatus}`);
  }
  if (lesson.contentStatus === "textbook" && !TEXTBOOK_IDS.has(lesson.id)) {
    fail(`课程 ${lesson.id} 未列入本版本教材精修范围`);
  }

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

  if (lesson.contentStatus === "textbook") {
    if (lesson.edition !== "textbook-v1") fail(`精修课 ${lesson.id} 缺少 textbook-v1 edition`);
    if (lesson.revision !== "textbook-v1") fail(`精修课 ${lesson.id} 缺少 textbook-v1 revision`);
    if (
      !lesson.scopeBoundary ||
      !Array.isArray(lesson.scopeBoundary.covered) ||
      lesson.scopeBoundary.covered.length < 2 ||
      !Array.isArray(lesson.scopeBoundary.deferred) ||
      lesson.scopeBoundary.deferred.length < 2
    ) {
      fail(`精修课 ${lesson.id} 缺少明确的本课范围与后置内容`);
    }
    if (!lesson.engineeringLanguageNote || lesson.engineeringLanguageNote.length < 40) {
      fail(`精修课 ${lesson.id} 缺少工程用语边界说明`);
    }
    if (!lesson.readingGuide || !Number.isFinite(lesson.readingGuide.estimatedMinutes)) {
      fail(`精修课 ${lesson.id} 缺少 readingGuide.estimatedMinutes`);
    }
    if (!Array.isArray(lesson.readingGuide.howToRead) || lesson.readingGuide.howToRead.length < 3) {
      fail(`精修课 ${lesson.id} 的阅读方法少于 3 条`);
    }
    if (!Array.isArray(lesson.readingGuide.masteryEvidence) || lesson.readingGuide.masteryEvidence.length < 3) {
      fail(`精修课 ${lesson.id} 的掌握证据少于 3 条`);
    }
    if (lesson.objectives.length < 8) fail(`精修课 ${lesson.id} 的目标少于 8 个`);
    if (lesson.sections.length < 10) fail(`精修课 ${lesson.id} 的教材章节少于 10 个`);
    if (lesson.misconceptions.length < 6) fail(`精修课 ${lesson.id} 的误区少于 6 个`);
    if (lesson.recap.length < 10) fail(`精修课 ${lesson.id} 的结论少于 10 条`);
    if (lesson.questions.length < 8) fail(`精修课 ${lesson.id} 的自检题少于 8 道`);
    if (lesson.sources.length < 12) fail(`精修课 ${lesson.id} 的来源少于 12 个`);

    const minimumCharacters = TEXTBOOK_MINIMUM_CHARACTERS[lesson.id] || 12000;
    const actualCharacters = lessonBodyCharacters(lesson);
    if (actualCharacters < minimumCharacters) {
      fail(`精修课 ${lesson.id} 理论字符不足：${actualCharacters} < ${minimumCharacters}`);
    }

    const sourceIds = new Set();
    const sourceUrls = new Set();
    lesson.sources.forEach((source, sourceIndex) => {
      if (!source.id || !/^[a-z0-9][a-z0-9-]*$/.test(source.id)) {
        fail(`精修课 ${lesson.id} 第 ${sourceIndex + 1} 个来源 ID 无效`);
      }
      if (sourceIds.has(source.id)) fail(`精修课 ${lesson.id} 来源 ID 重复：${source.id}`);
      if (sourceUrls.has(source.url)) fail(`精修课 ${lesson.id} 来源 URL 重复：${source.url}`);
      if (source.note.length < 40) fail(`精修课 ${lesson.id} 来源 ${source.id} 的适用范围说明过短`);
      sourceIds.add(source.id);
      sourceUrls.add(source.url);
    });

    let tableCount = 0;
    let exampleCount = 0;
    let checkpointCount = 0;
    let definitionCount = 0;
    const usedSourceIds = new Set();
    const longTextLocations = new Map();
    const checkDuplicateText = (text, location) => {
      if (typeof text !== "string" || text.length < 80) return;
      if (longTextLocations.has(text)) {
        fail(`精修课 ${lesson.id} 存在重复长段落：${longTextLocations.get(text)} 与 ${location}`);
      }
      longTextLocations.set(text, location);
    };
    lesson.sections.forEach((section, sectionIndex) => {
      if (!section.lead) fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节缺少 lead`);
      if (section.paragraphs.length < 3) {
        fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节正文少于 3 段`);
      }
      if (!Array.isArray(section.sourceRefs) || section.sourceRefs.length < 1) {
        fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节缺少 sourceRefs`);
      }
      section.sourceRefs.forEach((sourceId) => {
        if (!sourceIds.has(sourceId)) fail(`精修课 ${lesson.id} 引用了不存在的来源：${sourceId}`);
        usedSourceIds.add(sourceId);
      });

      const definitions = section.definitions || [];
      const tables = section.tables || [];
      const examples = section.examples || [];
      const checkpoints = section.checkpoints || [];
      definitionCount += definitions.length;
      tableCount += tables.length;
      exampleCount += examples.length;
      checkpointCount += checkpoints.length;
      section.paragraphs.forEach((paragraph, paragraphIndex) => {
        checkDuplicateText(paragraph, `第 ${sectionIndex + 1} 节第 ${paragraphIndex + 1} 段`);
      });

      tables.forEach((table, tableIndex) => {
        if (!table.caption || !Array.isArray(table.columns) || table.columns.length < 2) {
          fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节表 ${tableIndex + 1} 缺少标题或列`);
        }
        if (!Array.isArray(table.rows) || table.rows.length < 2) {
          fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节表 ${tableIndex + 1} 少于 2 行`);
        }
        table.rows.forEach((row) => {
          if (!Array.isArray(row) || row.length !== table.columns.length) {
            fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节表格行列数不一致`);
          }
        });
      });

      examples.forEach((example, exampleIndex) => {
        if (!example.title || !Array.isArray(example.paragraphs) || !example.paragraphs.length || !example.takeaway) {
          fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节案例 ${exampleIndex + 1} 不完整`);
        }
        example.paragraphs.forEach((paragraph, paragraphIndex) => {
          checkDuplicateText(
            paragraph,
            `第 ${sectionIndex + 1} 节案例 ${exampleIndex + 1} 第 ${paragraphIndex + 1} 段`
          );
        });
      });

      checkpoints.forEach((checkpoint, checkpointIndex) => {
        if (!checkpoint.prompt || !checkpoint.answer) {
          fail(`精修课 ${lesson.id} 第 ${sectionIndex + 1} 节检查点 ${checkpointIndex + 1} 不完整`);
        }
      });
    });

    if (definitionCount < 4) fail(`精修课 ${lesson.id} 的定义框少于 4 个`);
    if (tableCount < 2) fail(`精修课 ${lesson.id} 的对比表少于 2 张`);
    if (exampleCount < 3) fail(`精修课 ${lesson.id} 的推演案例少于 3 个`);
    if (checkpointCount < 5) fail(`精修课 ${lesson.id} 的章中检查点少于 5 个`);
    const componentMinimums = TEXTBOOK_COMPONENT_MINIMUMS[lesson.id];
    if (componentMinimums) {
      const actualComponents = {
        sections: lesson.sections.length,
        definitions: definitionCount,
        tables: tableCount,
        examples: exampleCount,
        checkpoints: checkpointCount,
        sources: lesson.sources.length
      };
      Object.entries(componentMinimums).forEach(([component, minimum]) => {
        if (actualComponents[component] < minimum) {
          fail(
            `精修课 ${lesson.id} 的 ${component} 未达到本课独立审校最低值：` +
            `${actualComponents[component]} < ${minimum}`
          );
        }
      });
    }
    const unusedSourceIds = [...sourceIds].filter((sourceId) => !usedSourceIds.has(sourceId));
    if (unusedSourceIds.length) {
      fail(`精修课 ${lesson.id} 存在未被任何章节引用的来源：${unusedSourceIds.join("、")}`);
    }

    const rawLesson = rawLessonsById.get(lesson.id);
    const actualReviewHash = `sha256-${crypto
      .createHash("sha256")
      .update(JSON.stringify(rawLesson))
      .digest("hex")}`;
    if (reviewedLessonHashes.get(lesson.id) !== actualReviewHash) {
      fail(`精修课 ${lesson.id} 已在审校后发生变化，请重新独立审校并更新内容指纹`);
    }
  }
}

for (const lessonId of TEXTBOOK_IDS) {
  const lesson = normalized.find((item) => item.id === lessonId);
  if (!lesson || lesson.contentStatus !== "textbook") {
    fail(`本版本要求精修课 ${lessonId} 的 contentStatus 为 textbook`);
  }
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
  ` * 审校指纹：sha256-${reviewFingerprint}`,
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
const theoryCharacters = normalized.reduce((sum, lesson) => sum + lessonBodyCharacters(lesson), 0);
const textbookLessons = normalized.filter((lesson) => lesson.contentStatus === "textbook").length;

console.log(
  `理论数据生成完成：${normalized.length} 课、${uniqueSources.size} 个唯一来源、` +
  `${theoryCharacters.toLocaleString("zh-CN")} 个理论字符、${textbookLessons} 节教材精修完成。`
);
