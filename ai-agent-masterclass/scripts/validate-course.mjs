import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const sandbox = { window: {} };
const dataSource = fs.readFileSync(path.join(root, "course-data.js"), "utf8");
vm.runInNewContext(dataSource, sandbox, { filename: "course-data.js" });
const data = sandbox.window.CourseData;

check(data && typeof data === "object", "CourseData 未成功加载");
check(data.modules.length === 10, `模块数应为 10，实际为 ${data.modules.length}`);
check(
  data.modules.reduce((sum, module) => sum + module.lessons, 0) === data.meta.coreLessons,
  "模块课数之和与 meta.coreLessons 不一致"
);
check(
  data.lessons.filter((lesson) => lesson.status === "published").length === data.meta.publishedLessons,
  "published 课程数与 meta.publishedLessons 不一致"
);

const moduleIds = new Set();
const lessonIds = new Set();
const glossaryIds = new Set();

for (const module of data.modules) {
  check(!moduleIds.has(module.id), `重复模块 ID：${module.id}`);
  moduleIds.add(module.id);
  check(Array.isArray(module.outline), `模块 ${module.id} 缺少 outline`);
  check(module.outline?.length === module.lessons, `模块 ${module.id} 的 outline 数量与 lessons 不一致`);
  check(Boolean(module.outcome), `模块 ${module.id} 缺少能力目标`);
  check(Boolean(module.project), `模块 ${module.id} 缺少阶段作品`);
}

for (const item of data.glossary) {
  check(!glossaryIds.has(item.id), `重复术语 ID：${item.id}`);
  glossaryIds.add(item.id);
}

for (const lesson of data.lessons) {
  check(!lessonIds.has(lesson.id), `重复课程 ID：${lesson.id}`);
  lessonIds.add(lesson.id);
  check(moduleIds.has(lesson.module), `课程 ${lesson.id} 引用了不存在的模块 ${lesson.module}`);
  check(["published", "draft", "review", "archived"].includes(lesson.status), `课程 ${lesson.id} 的状态无效`);

  if (lesson.status !== "published") continue;
  const quizId = `q-${lesson.id}`;
  check(Boolean(data.quizzes[quizId]), `已发布课程 ${lesson.id} 缺少测验 ${quizId}`);
  check(lesson.content.includes('class="objectives"'), `已发布课程 ${lesson.id} 缺少 objectives`);
  check(lesson.content.includes('class="assignment"'), `已发布课程 ${lesson.id} 缺少 assignment`);
  check(lesson.content.includes('id="sources"'), `已发布课程 ${lesson.id} 缺少 sources`);

  const termRefs = [...lesson.content.matchAll(/data-term="([^"]+)"/g)].map((match) => match[1]);
  for (const termId of termRefs) {
    check(glossaryIds.has(termId), `课程 ${lesson.id} 引用了不存在的术语 ${termId}`);
  }
}

for (const [quizId, quiz] of Object.entries(data.quizzes)) {
  check(Array.isArray(quiz.questions) && quiz.questions.length > 0, `测验 ${quizId} 没有题目`);
  for (const [index, question] of quiz.questions.entries()) {
    check(
      Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length,
      `测验 ${quizId} 第 ${index + 1} 题答案索引无效`
    );
  }
}

const notebookPath = path.join(root, "labs", "01-first-api-call.ipynb");
check(fs.existsSync(notebookPath), "缺少 LAB 01 Notebook");
if (fs.existsSync(notebookPath)) {
  const notebook = JSON.parse(fs.readFileSync(notebookPath, "utf8"));
  check(notebook.nbformat === 4, "LAB 01 不是 nbformat 4");
  for (const [index, cell] of notebook.cells.entries()) {
    if (cell.cell_type !== "code") continue;
    check(cell.execution_count === null, `LAB 01 第 ${index + 1} 个单元保存了 execution_count`);
    check(Array.isArray(cell.outputs) && cell.outputs.length === 0, `LAB 01 第 ${index + 1} 个单元保存了输出`);
  }
}

const publicFiles = [
  "index.html",
  "app.js",
  "course-data.js",
  "README.md",
  "labs/01-first-api-call.ipynb"
].map((relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8")).join("\n");

check(!/openapi-(?:sj|qb-ai)\.sii\.edu\.cn/i.test(publicFiles), "公开文件包含私有 SII Endpoint");
check(!/Bearer\s+[A-Za-z0-9+/=]{24,}/.test(publicFiles), "公开文件疑似包含硬编码 Bearer 凭证");
check(
  !/api[_-]?key\s*[:=]\s*["'][A-Za-z0-9+/=]{16,}["']/i.test(publicFiles),
  "公开文件疑似包含硬编码 API Key"
);

const indexHTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const asset of ["styles.css", "course-data.js", "app.js"]) {
  check(indexHTML.includes(`${asset}?v=${data.meta.version}`), `${asset} 的缓存版本未同步到 v${data.meta.version}`);
}

if (failures.length) {
  console.error(`课程校验失败（${failures.length} 项）：`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `课程校验通过：${data.modules.length} 模块、${data.meta.coreLessons} 课路线、` +
  `${data.meta.publishedLessons} 节已发布、${data.glossary.length} 个术语、` +
  `${Object.keys(data.quizzes).length} 份测验。`
);
