(() => {
  "use strict";

  const data = window.CourseData;
  const STORAGE_KEY = "ai-agent-masterclass-progress-v1";
  const THEME_KEY = "ai-agent-masterclass-theme";
  const CHARTER_KEY = "ai-agent-masterclass-charter-v1";
  const main = document.querySelector("#main-content");
  const sidebar = document.querySelector("#sidebar");
  let loopTimer = null;

  const defaultProgress = {
    schemaVersion: 1,
    completedLessons: {},
    quizAttempts: {},
    lastVisited: null
  };

  let progress = loadJSON(STORAGE_KEY, defaultProgress);

  function loadJSON(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : structuredCloneSafe(fallback);
    } catch {
      return structuredCloneSafe(fallback);
    }
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    updateProgressUI();
  }

  function publishedLessons() {
    return data.lessons.filter((lesson) => lesson.status === "published");
  }

  function completedCount() {
    return publishedLessons().filter((lesson) => progress.completedLessons[lesson.id]).length;
  }

  function percentage() {
    const total = publishedLessons().length;
    return total ? Math.round((completedCount() / total) * 100) : 0;
  }

  function nextLesson() {
    return publishedLessons().find((lesson) => !progress.completedLessons[lesson.id]) || publishedLessons().at(-1);
  }

  function getModule(id) {
    return data.modules.find((module) => module.id === id);
  }

  function getLesson(id) {
    return data.lessons.find((lesson) => lesson.id === id);
  }

  function route() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [section = "home", id] = raw.split("/");
    return { section, id };
  }

  function navigate(path) {
    location.hash = `#/${path}`;
  }

  function escapeHTML(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function toast(message) {
    const node = document.querySelector("#toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2500);
  }

  function renderSidebar() {
    const nav = document.querySelector("#course-nav");
    nav.innerHTML = data.modules.map((module) => {
      const lessons = data.lessons.filter((lesson) => lesson.module === module.id);
      const publishedMarkup = lessons.map((lesson) => {
        const done = Boolean(progress.completedLessons[lesson.id]);
        return `
          <a class="lesson-link ${done ? "done" : ""}" href="#/lesson/${lesson.id}" data-lesson-link="${lesson.id}">
            <span class="lesson-index">${done ? "✓" : lesson.number}</span>
            <span>${escapeHTML(lesson.shortTitle)}</span>
          </a>`;
      }).join("");

      const plannedMarkup = module.status === "planned" ? `
        <span class="lesson-link planned">
          <span class="lesson-index">·</span>
          <span>${module.lessons} 节课程</span>
          <span class="lesson-status">筹备中</span>
        </span>` : "";

      return `
        <section class="module ${module.status === "planned" ? "collapsed" : ""}" data-module="${module.id}">
          <button class="module-title" type="button" aria-expanded="${module.status !== "planned"}">
            <span>${String(module.order).padStart(2, "0")} · ${escapeHTML(module.title)}</span>
            <span class="chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="lesson-links">${publishedMarkup}${plannedMarkup}</div>
        </section>`;
    }).join("");

    nav.querySelectorAll(".module-title").forEach((button) => {
      button.addEventListener("click", () => {
        const module = button.closest(".module");
        module.classList.toggle("collapsed");
        button.setAttribute("aria-expanded", String(!module.classList.contains("collapsed")));
      });
    });
  }

  function updateProgressUI() {
    const pct = percentage();
    const count = completedCount();
    const total = publishedLessons().length;
    const label = document.querySelector("#sidebar-progress-label");
    const countNode = document.querySelector("#sidebar-progress-count");
    const bar = document.querySelector("#sidebar-progress-bar");
    if (label) label.textContent = `${pct}%`;
    if (countNode) countNode.textContent = `${count} / ${total} 课`;
    if (bar) bar.style.width = `${pct}%`;

    data.lessons.forEach((lesson) => {
      const link = document.querySelector(`[data-lesson-link="${lesson.id}"]`);
      if (!link) return;
      const done = Boolean(progress.completedLessons[lesson.id]);
      link.classList.toggle("done", done);
      link.querySelector(".lesson-index").textContent = done ? "✓" : lesson.number;
    });
  }

  function setActiveNavigation() {
    const current = route();
    document.querySelectorAll(".topnav a").forEach((link) => {
      const linkSection = link.getAttribute("href").split("/")[1];
      link.classList.toggle("active", linkSection === current.section || (current.section === "lesson" && linkSection === "roadmap"));
    });
    document.querySelectorAll(".lesson-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.lessonLink === current.id);
    });
  }

  function homeHTML() {
    const next = nextLesson();
    const pct = percentage();
    return `
      <article class="page page-wide hero">
        <div class="hero-grid">
          <section>
            <div class="eyebrow">从零基础开始 · 免费开放 · 持续更新</div>
            <h1>不是“会聊几句”，<br />而是真正<em>会构建智能体</em></h1>
            <p class="lead">用一个真实的“灵巧手情报智能体”贯穿全程。从 AI 与 LLM 基础，走到工具、检索、记忆、规划、多智能体、评测、安全和部署。</p>
            <div class="hero-actions">
              <a class="button" href="#/lesson/${next.id}">${completedCount() ? "继续学习" : "从导学课开始"} <span aria-hidden="true">→</span></a>
              <a class="button secondary" href="#/roadmap">查看完整路线</a>
            </div>
            <div class="stats-grid">
              <div class="stat"><strong>51</strong><span>核心课程</span></div>
              <div class="stat"><strong>10</strong><span>学习模块</span></div>
              <div class="stat"><strong>9</strong><span>阶段作品</span></div>
              <div class="stat"><strong>1</strong><span>毕业系统</span></div>
            </div>
          </section>
          <aside class="hero-card">
            <span class="hero-card-label">当前课程进度</span>
            <div class="hero-progress-number">${pct}%</div>
            <span class="muted">已完成 ${completedCount()} / ${publishedLessons().length} 节已发布课程</span>
            <div class="progress-track"><span style="width:${pct}%"></span></div>
            <div class="next-lesson-card">
              <small>接下来</small>
              <strong>${escapeHTML(next.title)}</strong>
              <a class="button small" href="#/lesson/${next.id}">进入课程</a>
            </div>
          </aside>
        </div>

        <section class="section">
          <div class="section-heading"><div><span class="eyebrow">学习闭环</span><h2>每个概念都要变成能力</h2></div><p>每课固定经过直觉、实验、失败诊断、评测和复述；每个阶段都给同一个项目增加真实能力。</p></div>
          <div class="cards-grid">
            <article class="card"><span class="card-number">理解</span><h3>先建立可靠心智模型</h3><p>不用术语吓人，也不把框架 API 当原理。先知道它为什么存在、解决什么问题。</p></article>
            <article class="card"><span class="card-number">实践</span><h3>从手工模拟到真实代码</h3><p>先看懂每个零件，再从原生实现走向 SDK、协议和生产基础设施。</p></article>
            <article class="card"><span class="card-number">验证</span><h3>让结果经得起追问</h3><p>用测试集、运行轨迹、引用、安全实验、成本和延迟证明系统是否真的变好。</p></article>
          </div>
        </section>

        <section class="section">
          <div class="section-heading"><div><span class="eyebrow">能力地图</span><h2>从小白到独立构建者</h2></div><a href="#/roadmap">展开 10 个模块 →</a></div>
          <div class="module-grid">${data.modules.slice(0, 6).map(moduleCardHTML).join("")}</div>
        </section>
      </article>`;
  }

  function moduleCardHTML(module) {
    return `
      <article class="module-card ${module.status === "current" ? "current" : ""}">
        <span class="num">${String(module.order).padStart(2, "0")}</span>
        <div><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.short)}</p></div>
        <span class="tag">${module.status === "current" ? "学习中" : `${module.lessons} 课`}</span>
      </article>`;
  }

  function roadmapHTML() {
    return `
      <article class="page page-wide">
        <header class="lesson-header">
          <div class="eyebrow">Mastery Roadmap · v${data.meta.version}</div>
          <h1>一条完整、但不会让初学者迷路的路线</h1>
          <p class="lesson-deck">核心课程共 51 课。每个模块都产出一个能运行的新版本，最终形成可部署、可评测、可持续运行的灵巧手情报智能体。</p>
        </header>

        <section class="section-heading"><div><span class="eyebrow">学习阶段</span><h2>10 个模块，9 次升级</h2></div><p>推荐每次只学一课；课程顺序可以根据你的实际项目调整，但阶段验收不会省略。</p></section>
        <div class="module-grid">${data.modules.map(moduleCardHTML).join("")}</div>

        <section class="section">
          <div class="section-heading"><div><span class="eyebrow">当前已发布</span><h2>从这里开始</h2></div></div>
          <div class="cards-grid">${publishedLessons().map((lesson) => `
            <article class="card">
              <span class="card-number">${lesson.number}</span>
              <h3>${escapeHTML(lesson.title)}</h3>
              <p>${escapeHTML(lesson.deck)}</p>
              <p><a href="#/lesson/${lesson.id}">进入本课 →</a></p>
            </article>`).join("")}</div>
        </section>

        <section class="section callout idea">
          <h3>阶段作品如何成长</h3>
          <p><strong>Charter → 结构化 LLM 应用 → 工具智能体 → RAG 研究助手 → 可治理记忆 → 长任务系统 → 多智能体团队 → 安全可靠版本 → 部署版本。</strong></p>
          <p>毕业验收不是“代码能跑”，而是你能解释架构取舍、提供评测证据、抵抗常见攻击、定位失败、控制费用，并把方法教给另一个初学者。</p>
        </section>
      </article>`;
  }

  function glossaryHTML() {
    return `
      <article class="page">
        <header class="lesson-header">
          <div class="eyebrow">Living Glossary</div>
          <h1>术语库</h1>
          <p class="lesson-deck">只收录课程中已经出现的概念。定义优先追求可操作、可区分，而不是堆砌名词。</p>
        </header>
        <div class="glossary-grid">${data.glossary.map((item) => `
          <article class="glossary-card" id="term-${item.id}">
            <span class="en">${escapeHTML(item.en)}</span>
            <h3>${escapeHTML(item.zh)}</h3>
            <p>${escapeHTML(item.definition)}</p>
          </article>`).join("")}</div>
      </article>`;
  }

  function updatesHTML() {
    return `
      <article class="page">
        <header class="lesson-header">
          <div class="eyebrow">Changelog</div>
          <h1>课程更新日志</h1>
          <p class="lesson-deck">每次教学后同步课程正文、互动实验、测验、术语和资料，并记录内容验证日期。</p>
        </header>
        <div class="updates">${data.updates.map((update) => `
          <section class="update">
            <time>${update.date} · ${update.version}</time>
            <h2>${escapeHTML(update.title)}</h2>
            <p>${escapeHTML(update.description)}</p>
          </section>`).join("")}</div>
      </article>`;
  }

  function lessonHTML(lesson) {
    const module = getModule(lesson.module);
    const lessons = publishedLessons();
    const index = lessons.findIndex((item) => item.id === lesson.id);
    const prev = lessons[index - 1];
    const next = lessons[index + 1];
    const done = Boolean(progress.completedLessons[lesson.id]);
    return `
      <article class="page lesson-page" data-current-lesson="${lesson.id}">
        <header class="lesson-header">
          <div class="breadcrumbs"><span>模块 ${String(module.order).padStart(2, "0")}</span><span>›</span><span>${escapeHTML(module.title)}</span></div>
          <h1>${escapeHTML(lesson.title)}</h1>
          <p class="lesson-deck">${escapeHTML(lesson.deck)}</p>
          <div class="lesson-meta"><span class="pill published">已发布</span><span class="pill">${lesson.duration}</span><span class="pill">${lesson.level}</span><span class="pill">更新于 ${lesson.updated}</span></div>
        </header>
        <div class="lesson-body">${lesson.content}</div>
        <footer class="lesson-footer">
          <div>${prev ? `<a class="button ghost" href="#/lesson/${prev.id}">← ${escapeHTML(prev.shortTitle)}</a>` : `<a class="button ghost" href="#/roadmap">← 学习路线</a>`}</div>
          <button class="button complete-button ${done ? "done" : ""}" type="button" data-action="toggle-complete" data-lesson="${lesson.id}">${done ? "✓ 已完成本课" : "标记为已完成"}</button>
          <div>${next ? `<a class="button" href="#/lesson/${next.id}">${escapeHTML(next.shortTitle)} →</a>` : `<a class="button" href="#/roadmap">查看下一阶段 →</a>`}</div>
        </footer>
      </article>`;
  }

  function notFoundHTML() {
    return `<article class="page"><div class="empty-state"><h1>这里还没有课程</h1><p>页面可能正在准备中。</p><a class="button" href="#/home">回到首页</a></div></article>`;
  }

  function render() {
    clearInterval(loopTimer);
    const current = route();
    if (current.section === "home") main.innerHTML = homeHTML();
    else if (current.section === "roadmap") main.innerHTML = roadmapHTML();
    else if (current.section === "glossary") main.innerHTML = glossaryHTML();
    else if (current.section === "updates") main.innerHTML = updatesHTML();
    else if (current.section === "lesson" && getLesson(current.id)) main.innerHTML = lessonHTML(getLesson(current.id));
    else main.innerHTML = notFoundHTML();

    setActiveNavigation();
    bindPageInteractions();
    sidebar.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
  }

  function bindPageInteractions() {
    document.querySelectorAll("[data-quiz]").forEach(renderQuiz);

    document.querySelectorAll(".copy-code").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.closest(".code-block").querySelector("code").innerText;
        await navigator.clipboard.writeText(code);
        button.textContent = "已复制";
        setTimeout(() => { button.textContent = "复制"; }, 1400);
      });
    });

    document.querySelectorAll(".term").forEach((button) => {
      button.addEventListener("click", () => {
        const term = data.glossary.find((item) => item.id === button.dataset.term);
        if (term) toast(`${term.zh}：${term.definition}`);
      });
    });

    document.querySelector("[data-action='toggle-complete']")?.addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.lesson;
      if (progress.completedLessons[id]) delete progress.completedLessons[id];
      else progress.completedLessons[id] = new Date().toISOString();
      saveProgress();
      render();
      toast(progress.completedLessons[id] ? "已完成本课，学习进度已保存" : "已取消完成标记");
    });

    bindScenarioClassifier();
    bindLoopDemo();
    bindCharter();
  }

  function renderQuiz(container) {
    const quizId = container.dataset.quiz;
    const quiz = data.quizzes[quizId];
    if (!quiz) return;

    container.innerHTML = `
      <form>
        ${quiz.questions.map((question, index) => `
          <fieldset class="quiz-question">
            <legend>${index + 1}. ${escapeHTML(question.prompt)}</legend>
            ${question.options.map((option, optionIndex) => `
              <label class="quiz-option"><input type="radio" name="q${index}" value="${optionIndex}" /><span>${escapeHTML(option)}</span></label>`).join("")}
          </fieldset>`).join("")}
        <button class="button" type="submit">提交答案</button>
        <div class="quiz-output" aria-live="polite"></div>
      </form>`;

    container.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const unanswered = quiz.questions.some((_, index) => form.get(`q${index}`) === null);
      if (unanswered) {
        toast("还有题目没有回答");
        return;
      }
      let correct = 0;
      quiz.questions.forEach((question, index) => {
        if (Number(form.get(`q${index}`)) === question.answer) correct += 1;
      });
      const score = Math.round((correct / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;
      const output = container.querySelector(".quiz-output");
      output.innerHTML = `
        <section class="quiz-result">
          <strong>${passed ? "通过！" : "再看一下解析"} 你的得分：${score} 分</strong>
          <p>${passed ? "你已经掌握本课的核心区分。" : `本课通过线是 ${quiz.passingScore} 分，可以根据解析只复习薄弱处。`}</p>
          <ol class="quiz-explanations">${quiz.questions.map((question, index) => {
            const selected = Number(form.get(`q${index}`));
            return `<li><strong>${selected === question.answer ? "✓" : "✗"}</strong> ${escapeHTML(question.explanation)}</li>`;
          }).join("")}</ol>
        </section>`;

      progress.quizAttempts[quizId] ??= [];
      progress.quizAttempts[quizId].push({ score, completedAt: new Date().toISOString() });
      saveProgress();
      output.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function bindScenarioClassifier() {
    document.querySelectorAll(".scenario").forEach((scenario) => {
      scenario.querySelectorAll(".choice-button").forEach((button) => {
        button.addEventListener("click", () => {
          scenario.querySelectorAll(".choice-button").forEach((item) => item.classList.remove("correct", "wrong"));
          const isCorrect = button.dataset.choice === scenario.dataset.correct;
          button.classList.add(isCorrect ? "correct" : "wrong");
          scenario.querySelector(".scenario-feedback")?.remove();
          const feedback = document.createElement("p");
          feedback.className = "scenario-feedback";
          feedback.textContent = isCorrect
            ? "判断正确。选择能完成任务的最低复杂度，通常更可靠。"
            : "再想想：这件事的步骤是一次完成、完全固定，还是会随新信息动态变化？";
          scenario.append(feedback);
        });
      });
    });
  }

  function bindLoopDemo() {
    const button = document.querySelector("[data-action='run-loop']");
    if (!button) return;
    const steps = [...document.querySelectorAll("[data-loop-step]")];
    const log = document.querySelector(".loop-log");
    const messages = [
      "收到目标：寻找最近发布的灵巧手论文",
      "检查状态：还没有候选论文，决定调用搜索",
      "执行工具：search(query, date_range)",
      "观察结果：得到 8 条记录，其中 3 条来自一手来源",
      "验证：证据足够；若不足，就带着新状态进入下一轮"
    ];
    button.addEventListener("click", () => {
      clearInterval(loopTimer);
      steps.forEach((step) => step.classList.remove("active"));
      let index = 0;
      const advance = () => {
        steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === index));
        log.textContent = messages[index];
        index += 1;
        if (index >= steps.length) {
          clearInterval(loopTimer);
          button.textContent = "再运行一次";
        }
      };
      advance();
      loopTimer = setInterval(advance, 950);
    });
  }

  function bindCharter() {
    const builder = document.querySelector("#charter-builder");
    if (!builder) return;
    const saved = loadJSON(CHARTER_KEY, {});
    builder.querySelectorAll("[data-charter]").forEach((field) => {
      field.value = saved[field.dataset.charter] || "";
    });

    const currentCharter = () => Object.fromEntries([...builder.querySelectorAll("[data-charter]")].map((field) => [field.dataset.charter, field.value.trim()]));
    const asText = (charter) => [
      "name: 灵巧手情报智能体",
      `user: ${charter.user || "待填写"}`,
      `goal: ${charter.goal || "待填写"}`,
      `allowed_tools: ${charter.allowed_tools || "待填写"}`,
      `forbidden_actions: ${charter.forbidden_actions || "待填写"}`,
      `approval_required: ${charter.approval_required || "待填写"}`,
      `success_metrics: ${charter.success_metrics || "待填写"}`
    ].join("\n");

    builder.querySelector("[data-action='save-charter']").addEventListener("click", () => {
      localStorage.setItem(CHARTER_KEY, JSON.stringify(currentCharter()));
      toast("契约已保存在当前浏览器");
    });
    builder.querySelector("[data-action='copy-charter']").addEventListener("click", async () => {
      await navigator.clipboard.writeText(asText(currentCharter()));
      toast("契约已复制，可以直接发给我");
    });
  }

  function openSearch() {
    const dialog = document.querySelector("#search-dialog");
    dialog.hidden = false;
    const input = document.querySelector("#search-input");
    input.value = "";
    updateSearch("");
    setTimeout(() => input.focus(), 0);
  }

  function closeSearch() {
    document.querySelector("#search-dialog").hidden = true;
  }

  function searchableItems() {
    return [
      ...data.lessons.map((lesson) => ({
        title: lesson.title,
        subtitle: `课程 · ${lesson.deck}`,
        text: [lesson.title, lesson.deck, ...lesson.keywords].join(" "),
        href: `#/lesson/${lesson.id}`
      })),
      ...data.glossary.map((item) => ({
        title: `${item.zh} · ${item.en}`,
        subtitle: `术语 · ${item.definition}`,
        text: [item.zh, item.en, item.definition].join(" "),
        href: "#/glossary"
      }))
    ];
  }

  function updateSearch(query) {
    const normalized = query.trim().toLocaleLowerCase("zh-CN");
    const results = searchableItems().filter((item) => !normalized || item.text.toLocaleLowerCase("zh-CN").includes(normalized));
    const target = document.querySelector("#search-results");
    target.innerHTML = results.length ? results.map((item, index) => `
      <a class="search-result ${index === 0 ? "selected" : ""}" href="${item.href}">
        <strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle)}</small>
      </a>`).join("") : `<div class="empty-state">没有找到相关内容</div>`;
    target.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeSearch));
  }

  function bindGlobalInteractions() {
    document.querySelector("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
    });

    document.querySelector("#mobile-menu-toggle").addEventListener("click", () => sidebar.classList.toggle("open"));
    document.querySelector("#search-trigger").addEventListener("click", openSearch);
    document.querySelector("#search-close").addEventListener("click", closeSearch);
    document.querySelector("#search-dialog").addEventListener("click", (event) => {
      if (event.target.id === "search-dialog") closeSearch();
    });
    document.querySelector("#search-input").addEventListener("input", (event) => updateSearch(event.target.value));

    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        openSearch();
      }
      if (event.key === "Escape") closeSearch();
      if (!document.querySelector("#search-dialog").hidden && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
        const results = [...document.querySelectorAll(".search-result")];
        if (!results.length) return;
        const current = Math.max(0, results.findIndex((item) => item.classList.contains("selected")));
        if (event.key === "Enter") {
          results[current].click();
          return;
        }
        event.preventDefault();
        const next = event.key === "ArrowDown" ? Math.min(results.length - 1, current + 1) : Math.max(0, current - 1);
        results.forEach((item, index) => item.classList.toggle("selected", index === next));
        results[next].scrollIntoView({ block: "nearest" });
      }
    });

    document.querySelector("#export-progress").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-agent-masterclass-progress-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    });

    document.querySelector("#import-progress").addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const imported = JSON.parse(await file.text());
        if (imported.schemaVersion !== 1 || typeof imported.completedLessons !== "object") throw new Error("invalid");
        progress = { ...defaultProgress, ...imported };
        saveProgress();
        renderSidebar();
        updateProgressUI();
        render();
        toast("学习进度导入成功");
      } catch {
        toast("无法导入：文件格式不正确");
      }
      event.target.value = "";
    });
  }

  function initializeTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = saved || (systemDark ? "dark" : "light");
  }

  initializeTheme();
  renderSidebar();
  updateProgressUI();
  bindGlobalInteractions();
  window.addEventListener("hashchange", render);
  if (!location.hash) navigate("home");
  else render();
})();
