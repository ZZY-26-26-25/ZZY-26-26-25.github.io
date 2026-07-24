import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");

const fail = (message) => {
  throw new Error(message);
};

const contentDir = path.join(siteRoot, "content");
const contentFiles = fs.readdirSync(contentDir)
  .filter((name) => /^theory-m\d\d-m\d\d\.json$/.test(name))
  .sort();
const expectedFingerprint = crypto.createHash("sha256")
  .update(contentFiles.map((name) => `${name}\0${fs.readFileSync(path.join(contentDir, name), "utf8")}`).join("\0"))
  .digest("hex");

const generated = fs.readFileSync(path.join(siteRoot, "theory-lessons.js"), "utf8");
if (!generated.includes(`内容指纹：sha256-${expectedFingerprint}`)) {
  fail("theory-lessons.js 与 content 原稿指纹不一致，请重新运行 build-theory.mjs");
}
const reviewDir = path.join(contentDir, "reviews");
const reviewFiles = fs.readdirSync(reviewDir)
  .filter((name) => name.endsWith(".json"))
  .sort();
if (!reviewFiles.length) fail("缺少教材独立审校清单");
const reviewFingerprint = crypto.createHash("sha256")
  .update(
    reviewFiles
      .map((name) => `${name}\0${fs.readFileSync(path.join(reviewDir, name), "utf8")}`)
      .join("\0")
  )
  .digest("hex");
if (!generated.includes(`审校指纹：sha256-${reviewFingerprint}`)) {
  fail("theory-lessons.js 与教材审校清单指纹不一致，请重新运行 build-theory.mjs");
}

const context = vm.createContext({ window: {} });
vm.runInContext(generated, context, { filename: "theory-lessons.js" });
vm.runInContext(fs.readFileSync(path.join(siteRoot, "course-data.js"), "utf8"), context, {
  filename: "course-data.js"
});

const data = context.window.CourseData;
if (!data || !Array.isArray(data.lessons)) fail("CourseData 未正确生成");
if (data.lessons.length !== 51) fail(`课程应为 51 节，实际为 ${data.lessons.length}`);
if (data.lessons.some((lesson) => lesson.status !== "published")) fail("存在无法公开访问的课程");

const textbookLessons = data.lessons.filter((lesson) => lesson.contentStatus === "textbook");
if (textbookLessons.length !== data.meta.textbookLessons) {
  fail(`meta.textbookLessons=${data.meta.textbookLessons}，实际=${textbookLessons.length}`);
}
const expectedTextbookIds = new Set(["m00-l00", "m00-l01", "m01-l00"]);
if (
  textbookLessons.length !== expectedTextbookIds.size ||
  textbookLessons.some((lesson) => !expectedTextbookIds.has(lesson.id))
) {
  fail("v0.5.1 应仅有 M00 两课与 m01-l00 共 3 节教材精修课");
}
if (data.lessons.filter((lesson) => lesson.contentStatus === "theory-draft").length !== 48) {
  fail("v0.5.1 应把其余 48 节课明确保留为理论初稿");
}

data.modules.forEach((module) => {
  const lessons = data.lessons.filter((lesson) => lesson.module === module.id);
  const textbookCount = lessons.filter((lesson) => lesson.contentStatus === "textbook").length;
  const expectedStatus = textbookCount === lessons.length ? "textbook" : textbookCount ? "in-progress" : "draft";
  if (module.status !== expectedStatus || module.textbookCount !== textbookCount) {
    fail(`模块 ${module.id} 的教材状态统计不一致`);
  }
});

textbookLessons.forEach((lesson) => {
  if (!lesson.scopeBoundary?.covered?.length || !lesson.scopeBoundary?.deferred?.length) {
    fail(`${lesson.id} 缺少本课范围边界`);
  }
  if (!lesson.engineeringLanguageNote) fail(`${lesson.id} 缺少工程用语说明`);
  const sourceIds = new Set(lesson.sources.map((source) => source.id));
  lesson.sections.forEach((section, index) => {
    section.sourceRefs.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) fail(`${lesson.id} 第 ${index + 1} 节来源引用断链：${sourceId}`);
    });
  });
});

const m00l00 = data.lessons.find((lesson) => lesson.id === "m00-l00");
const m00l01 = data.lessons.find((lesson) => lesson.id === "m00-l01");
const m01l00 = data.lessons.find((lesson) => lesson.id === "m01-l00");
const l00Text = JSON.stringify(m00l00);
const l01Text = JSON.stringify(m00l01);
const environmentText = JSON.stringify(m01l00);
if (!l00Text.includes("不是行业强制格式")) fail("m00-l00 未明确 Agent Charter 的课程工件边界");
if (!l01Text.includes("启发式，不是 Agent 的充分必要条件")) {
  fail("m00-l01 未明确“谁决定下一步”只是控制权启发式");
}
if (!l01Text.includes("托管工具")) fail("m00-l01 未区分客户端函数调用与平台托管工具");
["多头注意力让", "残差连接和归一化", "Q/K/V"].forEach((overreach) => {
  if (l01Text.includes(overreach)) fail(`m00-l01 越过 M00 范围：${overreach}`);
});
[
  "Notebook 文档",
  "Jupyter Server",
  "Kernel",
  "运行时",
  "虚拟机",
  "相对路径",
  "当前工作目录",
  "虚拟环境",
  "分发包",
  "requirements 文件",
  "pip freeze",
  "锁定结果",
  "HEAD",
  "index",
  "工作区",
  "暂存区",
  "远程跟踪引用",
  "远程仓库",
  ".gitignore",
  "环境变量",
  "撤销",
  "轮换"
].forEach((requiredConcept) => {
  if (!environmentText.includes(requiredConcept)) fail(`m01-l00 缺少关键概念：${requiredConcept}`);
});
if (!environmentText.includes("不是保险箱")) fail("m01-l00 未明确环境变量不是保险箱");
if (!environmentText.includes("静态前端不能保守一个必须下发给浏览器的服务端 Secret")) {
  fail("m01-l00 未明确静态前端无法保守已下发给浏览器的服务端 Secret");
}
if (!environmentText.includes("不会") || !environmentText.includes("Git 历史")) {
  fail("m01-l00 未明确 .gitignore 或删除当前文件不能清除 Git 历史");
}
if (!environmentText.includes("不是 VM、容器或安全沙箱")) {
  fail("m01-l00 未明确虚拟环境不是 VM、容器或安全沙箱");
}
if (!environmentText.includes("参考架构") || !environmentText.includes("没有因此公开其全部内部服务拓扑")) {
  fail("m01-l00 未区分 Jupyter 参考架构与 Colab 未公开的内部实现");
}
if (m01l00.sections.length < 15 || m01l00.sources.length < 25 || m01l00.questions.length !== 12) {
  fail("m01-l00 未满足独立审校确认的 15 章、25 个来源与 12 道迁移自检最低结构");
}
[
  "pip-requirements",
  "pip-freeze",
  "pypa-pyproject",
  "git-three-trees",
  "git-branches",
  "git-remotes",
  "github-sensitive-data",
  "owasp-secrets"
].forEach((sourceId) => {
  if (!m01l00.sources.some((source) => source.id === sourceId)) {
    fail(`m01-l00 缺少直接支撑关键主张的一手来源：${sourceId}`);
  }
});
if (!environmentText.includes("本地 Jupyter") || !environmentText.includes("校园服务器") || !environmentText.includes("静态课程站")) {
  fail("m01-l00 的课末自检缺少跨平台陌生迁移情境");
}
[
  "Colab 免费版固定运行 12 小时",
  "Colab 最多运行 12 小时",
  "Colab Pro+ 最多运行 24 小时",
  "环境变量可以安全保存密钥",
  "保存 Notebook 就保存了运行状态",
  "pip freeze 就是跨平台锁文件"
].forEach((unsafeClaim) => {
  if (environmentText.includes(unsafeClaim)) fail(`m01-l00 包含不应出现的绝对化表述：${unsafeClaim}`);
});

const publicText = JSON.stringify(data);
if (/openapi-(?:sj|qb-ai)\.sii\.edu\.cn/i.test(publicText)) fail("公开数据包含私有 SII Endpoint");
if (/Bearer\s+[A-Za-z0-9+/=]{24,}/.test(publicText)) fail("公开数据疑似包含 Bearer 凭证");

const indexHTML = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
const cacheVersions = [...indexHTML.matchAll(/[?&]v=([0-9.]+)/g)].map((match) => match[1]);
if (!cacheVersions.length || cacheVersions.some((version) => version !== data.meta.version)) {
  fail(`静态资源缓存版本与课程版本 ${data.meta.version} 不一致`);
}

const appSource = fs.readFileSync(path.join(siteRoot, "app.js"), "utf8");
const styleSource = fs.readFileSync(path.join(siteRoot, "styles.css"), "utf8");
[
  "readingGuideHTML",
  "definitionsHTML",
  "tablesHTML",
  "examplesHTML",
  "checkpointsHTML",
  "sectionSourceRefsHTML",
  "scopeBoundaryHTML",
  "engineeringLanguageNoteHTML"
].forEach((renderer) => {
  if (!appSource.includes(`function ${renderer}`)) fail(`缺少教材渲染器：${renderer}`);
});
[
  ".reading-guide",
  ".definition-card",
  ".textbook-table",
  ".worked-example",
  ".section-checkpoints",
  ".section-sources",
  ".scope-boundary",
  ".engineering-language-note"
].forEach((selector) => {
  if (!styleSource.includes(selector)) fail(`缺少教材样式：${selector}`);
});

const uniqueSources = new Set(data.lessons.flatMap((lesson) => lesson.sources.map((source) => source.url)));
console.log(
  `站点校验通过：${data.lessons.length} 课、${textbookLessons.length} 节教材精修、` +
  `${uniqueSources.size} 个唯一来源、缓存版本 ${data.meta.version}。`
);
