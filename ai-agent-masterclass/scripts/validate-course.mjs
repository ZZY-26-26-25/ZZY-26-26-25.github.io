import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const failures = [];
const warnings = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const contentPaths = fs.readdirSync(path.join(root, "content"))
  .filter((name) => /^theory-m\d\d-m\d\d\.json$/.test(name))
  .sort()
  .map((name) => path.join("content", name));
const contentFingerprint = crypto.createHash("sha256")
  .update(contentPaths.map((relativePath) => {
    const name = path.basename(relativePath);
    return `${name}\0${fs.readFileSync(path.join(root, relativePath), "utf8")}`;
  }).join("\0"))
  .digest("hex");

const sandbox = { window: {} };
const theoryPath = path.join(root, "theory-lessons.js");
check(fs.existsSync(theoryPath), "缺少 theory-lessons.js，请先运行 build-theory.mjs");
if (fs.existsSync(theoryPath)) {
  const theorySource = fs.readFileSync(theoryPath, "utf8");
  check(
    theorySource.includes(`内容指纹：sha256-${contentFingerprint}`),
    "theory-lessons.js 与 content 理论原稿不一致，请先运行 build-theory.mjs"
  );
  vm.runInNewContext(theorySource, sandbox, { filename: "theory-lessons.js" });
}
vm.runInNewContext(fs.readFileSync(path.join(root, "course-data.js"), "utf8"), sandbox, { filename: "course-data.js" });
const data = sandbox.window.CourseData;

check(data && typeof data === "object", "CourseData 未成功加载");
check(Array.isArray(data.modules) && data.modules.length === 10, `模块数应为 10，实际为 ${data.modules?.length}`);
check(Array.isArray(data.lessons) && data.lessons.length === 51, `理论课应为 51 节，实际为 ${data.lessons?.length}`);
check(data.meta.coreLessons === 51, "meta.coreLessons 必须为 51");
check(data.meta.publishedLessons === 51, "meta.publishedLessons 必须为 51");
check(data.meta.phase === "lesson-by-lesson-textbook", "meta.phase 应标明 lesson-by-lesson-textbook");
check(data.methodology?.questions?.length === 8, "课程方法应包含八类理论问题");
const expectedTextbookIds = new Set(["m00-l00", "m00-l01", "m01-l00"]);
const textbookLessons = (data.lessons || []).filter((lesson) => lesson.contentStatus === "textbook");
check(data.meta.textbookLessons === expectedTextbookIds.size, "meta.textbookLessons 应为 3");
check(
  textbookLessons.length === expectedTextbookIds.size &&
    textbookLessons.every((lesson) => expectedTextbookIds.has(lesson.id)),
  "本版本应仅有 M00 两课与 m01-l00 共 3 节教材精修课"
);
check(
  (data.lessons || []).filter((lesson) => lesson.contentStatus === "theory-draft").length === 48,
  "其余 48 节课应保持理论初稿"
);

const moduleIds = new Set();
const lessonIds = new Set();
const glossaryIds = new Set();
const uniqueSources = new Map();
const weakSourceHosts = new Set([
  "medium.com",
  "www.zhihu.com",
  "zhihu.com",
  "blog.csdn.net",
  "juejin.cn",
  "www.reddit.com",
  "reddit.com",
  "en.wikipedia.org",
  "zh.wikipedia.org"
]);

for (const module of data.modules || []) {
  check(!moduleIds.has(module.id), `重复模块 ID：${module.id}`);
  moduleIds.add(module.id);
  const moduleLessons = (data.lessons || []).filter((lesson) => lesson.module === module.id);
  const textbookCount = moduleLessons.filter((lesson) => lesson.contentStatus === "textbook").length;
  const expectedStatus = textbookCount === moduleLessons.length
    ? "textbook"
    : textbookCount
      ? "in-progress"
      : "draft";
  check(module.status === expectedStatus, `模块 ${module.id} 的教材状态应为 ${expectedStatus}`);
  check(module.textbookCount === textbookCount, `模块 ${module.id} 的教材精修计数不一致`);
  check(Array.isArray(module.outline), `模块 ${module.id} 缺少 outline`);
  check(module.outline?.length === module.lessons, `模块 ${module.id} 的 outline 数量与 lessons 不一致`);
  check(Boolean(module.outcome), `模块 ${module.id} 缺少能力目标`);
  check(Boolean(module.project), `模块 ${module.id} 缺少案例主线`);
}

for (const item of data.glossary || []) {
  check(!glossaryIds.has(item.id), `重复术语 ID：${item.id}`);
  glossaryIds.add(item.id);
  check(Boolean(item.zh && item.en && item.definition), `术语 ${item.id} 字段不完整`);
}

for (const [index, lesson] of (data.lessons || []).entries()) {
  check(!lessonIds.has(lesson.id), `重复课程 ID：${lesson.id}`);
  lessonIds.add(lesson.id);
  check(moduleIds.has(lesson.module), `课程 ${lesson.id} 引用了不存在的模块 ${lesson.module}`);
  check(lesson.status === "published", `课程 ${lesson.id} 未发布`);
  check(lesson.phase === "theory", `课程 ${lesson.id} 未标为 theory`);
  check(lesson.number === String(index).padStart(2, "0"), `课程 ${lesson.id} 的全局编号错误`);
  check(Array.isArray(lesson.objectives) && lesson.objectives.length >= 4, `课程 ${lesson.id} 的学习目标少于 4 个`);
  check(Array.isArray(lesson.prerequisites) && lesson.prerequisites.length >= 1, `课程 ${lesson.id} 缺少先修知识`);
  check(Array.isArray(lesson.sections) && lesson.sections.length >= 4, `课程 ${lesson.id} 的理论章节少于 4 个`);
  check(Array.isArray(lesson.misconceptions) && lesson.misconceptions.length >= 3, `课程 ${lesson.id} 的误区少于 3 个`);
  check(Array.isArray(lesson.recap) && lesson.recap.length >= 4, `课程 ${lesson.id} 的结论少于 4 条`);
  check(Array.isArray(lesson.questions) && lesson.questions.length >= 3, `课程 ${lesson.id} 的理论自检少于 3 题`);
  check(Array.isArray(lesson.sources) && lesson.sources.length >= 3, `课程 ${lesson.id} 的来源少于 3 个`);
  check(lesson.travelCase?.paragraphs?.length >= 2, `课程 ${lesson.id} 的旅行案例不完整`);
  check(lesson.travelCase?.decisionRules?.length >= 3, `课程 ${lesson.id} 的旅行案例缺少决策规则`);

  const theoryText = [
    ...(lesson.objectives || []),
    ...(lesson.sections || []).flatMap((section) => [...(section.paragraphs || []), ...(section.bullets || [])]),
    ...(lesson.misconceptions || []).flatMap((item) => [item.claim, item.correction]),
    ...(lesson.travelCase?.paragraphs || []),
    ...(lesson.travelCase?.decisionRules || []),
    ...(lesson.recap || []),
    ...(lesson.questions || []).flatMap((item) => [item.prompt, item.answer])
  ].join("");
  check(theoryText.length >= 1800, `课程 ${lesson.id} 理论正文过短：${theoryText.length} 字符`);

  for (const [sectionIndex, section] of (lesson.sections || []).entries()) {
    check(Boolean(section.title), `课程 ${lesson.id} 第 ${sectionIndex + 1} 节缺少标题`);
    check(section.paragraphs?.length >= 2, `课程 ${lesson.id} 第 ${sectionIndex + 1} 节少于 2 段`);
  }

  for (const [questionIndex, question] of (lesson.questions || []).entries()) {
    check(Boolean(question.prompt && question.answer), `课程 ${lesson.id} 第 ${questionIndex + 1} 个自检题字段不完整`);
  }

  for (const source of lesson.sources || []) {
    check(Boolean(source.title && source.url && source.note && source.kind), `课程 ${lesson.id} 存在字段不完整的来源`);
    try {
      const url = new URL(source.url);
      check(url.protocol === "https:", `课程 ${lesson.id} 来源未使用 HTTPS：${source.url}`);
      check(!weakSourceHosts.has(url.hostname), `课程 ${lesson.id} 使用了不适合作为主要证据的二手来源：${source.url}`);
      if (/\/latest(?:\/|$)/.test(url.pathname) && /modelcontextprotocol|a2a-protocol/.test(url.hostname)) {
        warnings.push(`课程 ${lesson.id} 的协议来源使用 latest 路径，正文必须明确版本边界：${source.url}`);
      }
    } catch {
      check(false, `课程 ${lesson.id} 来源 URL 无效：${source.url}`);
    }
    const previous = uniqueSources.get(source.url);
    if (previous && previous.title !== source.title) {
      warnings.push(`同一来源 URL 使用了不同标题：“${previous.title}” / “${source.title}”`);
    } else {
      uniqueSources.set(source.url, source);
    }
  }
}

for (const module of data.modules || []) {
  const count = data.lessons.filter((lesson) => lesson.module === module.id).length;
  check(count === module.lessons, `模块 ${module.id} 应有 ${module.lessons} 课，实际为 ${count}`);
}

const notebookPath = path.join(root, "labs", "01-first-api-call.ipynb");
check(fs.existsSync(notebookPath), "原有 LAB 01 Notebook 应保留为后续实践资产");
if (fs.existsSync(notebookPath)) {
  const notebook = JSON.parse(fs.readFileSync(notebookPath, "utf8"));
  check(notebook.nbformat === 4, "LAB 01 不是 nbformat 4");
  for (const [index, cell] of notebook.cells.entries()) {
    if (cell.cell_type !== "code") continue;
    check(cell.execution_count === null, `LAB 01 第 ${index + 1} 个代码单元保存了 execution_count`);
    check(Array.isArray(cell.outputs) && cell.outputs.length === 0, `LAB 01 第 ${index + 1} 个代码单元保存了输出`);
  }
}

const publicPaths = [
  "index.html",
  "app.js",
  "course-data.js",
  "theory-lessons.js",
  "README.md",
  "THEORY_STANDARD.md",
  "labs/01-first-api-call.ipynb"
];
const publicText = publicPaths
  .concat(contentPaths)
  .filter((relativePath) => fs.existsSync(path.join(root, relativePath)))
  .map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8"))
  .join("\n");

check(!/openapi-(?:sj|qb-ai)\.sii\.edu\.cn/i.test(publicText), "公开文件包含私有 SII Endpoint");
check(!/Bearer\s+[A-Za-z0-9+/=]{24,}/.test(publicText), "公开文件疑似包含硬编码 Bearer 凭证");
check(
  !/api[_-]?key\s*[:=]\s*["'][A-Za-z0-9+/=]{16,}["']/i.test(publicText),
  "公开文件疑似包含硬编码 API Key"
);
check(
  !/https:\/\/(?:modelcontextprotocol\.io|a2a-protocol\.org)\/latest(?:\/|")/.test(publicText),
  "协议来源不得使用浮动 latest 路径，必须固定已核验版本"
);
check(
  !/https:\/\/spec\.openapis\.org\/oas\/latest\.html/.test(publicText),
  "OpenAPI 规范来源不得使用浮动 latest 路径"
);
check(
  !/github\.com\/cloudevents\/spec\/blob\/main\//.test(publicText),
  "CloudEvents 规范来源不得使用浮动 main 分支"
);
check(
  !/opentelemetry\.io\/docs\/specs\/semconv\/gen-ai\//.test(publicText),
  "GenAI 语义约定已经迁移，应使用已核验的新仓库快照"
);
const passportMonthClaims = [
  ...publicText.matchAll(/护照[^。；]{0,160}到期月[^。；]{0,160}(?:满足|有效|通过)[^。；]*/g)
].map((match) => match[0]);
const unsafePassportMonthClaims = passportMonthClaims.filter(
  (claim) => !/(?:不能|不足以|不足|不得|不应|不可|未核验|无法)/.test(claim)
);
check(
  unsafePassportMonthClaims.length === 0,
  "护照有效性判断不能以到期月份代替完整日期"
);

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const asset of ["styles.css", "theory-lessons.js", "course-data.js", "app.js"]) {
  check(indexHTML.includes(`${asset}?v=${data.meta.version}`), `${asset} 的缓存版本未同步到 v${data.meta.version}`);
}

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
check(appSource.includes("schemaVersion: 3"), "学习进度应使用 schemaVersion 3");
check(appSource.includes("lessonProgress"), "学习进度应区分课级理解状态与疑问");
check(appSource.includes("data-learning-record"), "理论课应提供可保存的学习记录");
const firstTeachingLesson = data.lessons.find((lesson) => lesson.id === "m00-l01");
check(firstTeachingLesson?.contentStatus === "textbook", "课号 01 应保持教材精修状态");
check(firstTeachingLesson?.teachingOrder === "case-first", "课号 01 应使用旅行案例先行的教学顺序");

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
check(readme.includes(`v${data.meta.version}`), `README 版本未同步到 v${data.meta.version}`);
check(readme.includes("51"), "README 未说明 51 课理论主干");
check(fs.readFileSync(theoryPath, "utf8").includes("build-theory.mjs"), "theory-lessons.js 缺少生成来源说明");

if (warnings.length) {
  console.warn(`课程校验警告（${warnings.length} 项）：`);
  [...new Set(warnings)].forEach((warning) => console.warn(`- ${warning}`));
}

if (failures.length) {
  console.error(`课程校验失败（${failures.length} 项）：`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const theoryCharacters = data.lessons.reduce((sum, lesson) => sum + lesson.sections
  .flatMap((section) => section.paragraphs)
  .join("").length, 0);

console.log(
  `课程校验通过：${data.modules.length} 模块、${data.lessons.length} 节理论课、` +
  `${data.glossary.length} 个术语、${uniqueSources.size} 个唯一来源、` +
  `${theoryCharacters.toLocaleString("zh-CN")} 个章节正文字符。`
);
