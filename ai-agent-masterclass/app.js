(() => {
  "use strict";

  const data = window.CourseData;
  const STORAGE_KEY = "ai-agent-masterclass-progress-v1";
  const THEME_KEY = "ai-agent-masterclass-theme";
  const CHARTER_KEY = "ai-agent-masterclass-charter-v1";
  const main = document.querySelector("#main-content");
  const sidebar = document.querySelector("#sidebar");
  const mobileMenuToggle = document.querySelector("#mobile-menu-toggle");
  const mobileLayout = window.matchMedia("(max-width: 980px)");
  let loopTimer = null;
  let searchOpener = null;
  let searchIndex = null;

  const defaultProgress = {
    schemaVersion: 2,
    completedLessons: {},
    quizAttempts: {},
    lastVisited: null
  };

  let progress = loadProgress();

  function isPlainRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function normalizeProgress(raw) {
    const source = isPlainRecord(raw) ? raw : {};
    const publicLessonIds = new Set(publishedLessons().map((lesson) => lesson.id));
    const quizIds = new Set(Object.keys(data.quizzes));
    const completedLessons = {};
    const quizAttempts = {};

    if (isPlainRecord(source.completedLessons)) {
      Object.entries(source.completedLessons).forEach(([id, completedAt]) => {
        if (publicLessonIds.has(id) && (typeof completedAt === "string" || completedAt === true)) {
          completedLessons[id] = completedAt === true ? "imported" : completedAt;
        }
      });
    }

    if (isPlainRecord(source.quizAttempts)) {
      Object.entries(source.quizAttempts).forEach(([id, attempts]) => {
        if (!quizIds.has(id) || !Array.isArray(attempts)) return;
        quizAttempts[id] = attempts
          .filter((attempt) => isPlainRecord(attempt) && Number.isFinite(Number(attempt.score)))
          .slice(-20)
          .map((attempt) => ({
            score: Math.max(0, Math.min(100, Number(attempt.score))),
            completedAt: typeof attempt.completedAt === "string" ? attempt.completedAt : "imported"
          }));
      });
    }

    return {
      schemaVersion: 2,
      completedLessons,
      quizAttempts,
      lastVisited: typeof source.lastVisited === "string" ? source.lastVisited : null
    };
  }

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return normalizeProgress(raw);
    } catch {
      return structuredCloneSafe(defaultProgress);
    }
  }

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
    return data.lessons.find((lesson) => lesson.id === id && lesson.status === "published");
  }

  function moduleLessons(moduleId) {
    return publishedLessons()
      .filter((lesson) => lesson.module === moduleId)
      .sort((a, b) => a.order - b.order);
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

  function setSidebarOpen(open, { focus = false } = {}) {
    const shouldOpen = mobileLayout.matches && open;
    sidebar.classList.toggle("open", shouldOpen);
    sidebar.inert = mobileLayout.matches && !shouldOpen;
    sidebar.setAttribute("aria-hidden", String(mobileLayout.matches && !shouldOpen));
    mobileMenuToggle.setAttribute("aria-expanded", String(shouldOpen));
    mobileMenuToggle.setAttribute("aria-label", shouldOpen ? "关闭课程目录" : "打开课程目录");
    if (shouldOpen && focus) sidebar.querySelector(".module-title, a, button")?.focus();
  }

  function renderSidebar() {
    const nav = document.querySelector("#course-nav");
    const current = route();
    const currentLesson = current.section === "lesson" ? getLesson(current.id) : null;
    const modulesMarkup = data.modules.map((module) => {
      const lessons = moduleLessons(module.id);
      const publishedMarkup = lessons.map((lesson) => {
        const done = Boolean(progress.completedLessons[lesson.id]);
        return `
          <a class="lesson-link ${done ? "done" : ""}" href="#/lesson/${lesson.id}" data-lesson-link="${lesson.id}">
            <span class="lesson-index">${done ? "✓" : lesson.number}</span>
            <span>${escapeHTML(lesson.shortTitle)}</span>
          </a>`;
      }).join("");

      const collapsed = currentLesson
        ? currentLesson.module !== module.id
        : module.order !== 0;

      return `
        <section class="module ${collapsed ? "collapsed" : ""}" data-module="${module.id}">
          <button class="module-title" type="button" aria-expanded="${String(!collapsed)}">
            <span>${String(module.order).padStart(2, "0")} · ${escapeHTML(module.title)}</span>
            <span class="chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="lesson-links">${publishedMarkup}</div>
        </section>`;
    }).join("");

    nav.innerHTML = `${modulesMarkup}
      <div class="sidebar-page-links" aria-label="课程其他页面">
        <a href="#/home">首页</a>
        <a href="#/roadmap">完整路线</a>
        <a href="#/methodology">课程方法</a>
        <a href="#/sources">参考资料</a>
        <a href="#/charter">项目契约</a>
        <a href="#/glossary">术语库</a>
        <a href="#/updates">更新日志</a>
      </div>`;

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

    publishedLessons().forEach((lesson) => {
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
      const active = linkSection === current.section || (current.section === "lesson" && linkSection === "roadmap");
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll(".lesson-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.lessonLink === current.id);
    });
    document.querySelectorAll(".sidebar-page-links a").forEach((link) => {
      const linkSection = link.getAttribute("href").split("/")[1];
      link.classList.toggle("active", linkSection === current.section);
    });
    if (current.section === "lesson") {
      const lesson = getLesson(current.id);
      const module = lesson && document.querySelector(`[data-module="${lesson.module}"]`);
      if (module) {
        module.classList.remove("collapsed");
        module.querySelector(".module-title")?.setAttribute("aria-expanded", "true");
      }
    }
  }

  function homeHTML() {
    const next = nextLesson();
    const pct = percentage();
    return `
      <article class="page page-wide hero">
        <div class="hero-grid">
          <section>
            <div class="eyebrow">51 课理论主干 · 免费开放 · 来源可追溯</div>
            <h1>先把方法想明白，<br />再真正<em>构建智能体</em></h1>
            <p class="lead">用“旅行规划智能体”贯穿 10 个模块，系统理解 AI 与 LLM、工具、检索、记忆、规划、多智能体、评测、安全和产品化。当前版本优先完成理论，实践将作为独立 LAB 逐步接回。</p>
            <div class="hero-actions">
              <a class="button" href="#/lesson/${next.id}">${completedCount() ? "继续学习" : "从导学课开始"} <span aria-hidden="true">→</span></a>
              <a class="button secondary" href="#/roadmap">查看完整路线</a>
            </div>
            <div class="stats-grid">
              <div class="stat"><strong>${data.meta.coreLessons}</strong><span>理论课程</span></div>
              <div class="stat"><strong>${data.modules.length}</strong><span>学习模块</span></div>
              <div class="stat"><strong>${sourceRecords().length}</strong><span>唯一来源</span></div>
              <div class="stat"><strong>1</strong><span>贯穿案例</span></div>
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
          <div class="section-heading"><div><span class="eyebrow">理论建设期</span><h2>每个概念先形成可靠心智模型</h2></div><p>51 课统一回答目的、定义、机制、边界、权衡、误区、案例和来源。实践暂不扩张，避免工具反过来绑架课程结构。</p></div>
          <div class="cards-grid">
            <article class="card"><span class="card-number">机制</span><h3>从因果关系理解原理</h3><p>不把定义换一种说法重复，而是讲清输入、处理、状态变化与输出之间为什么这样连接。</p></article>
            <article class="card"><span class="card-number">边界</span><h3>知道它不能保证什么</h3><p>区分能力与承诺、工具与权限、上下文与记忆、流畅与真实，主动标出失败模式。</p></article>
            <article class="card"><span class="card-number">证据</span><h3>让每项主张可追溯</h3><p>优先引用原始论文、正式标准和官方文档；时变事实注明核验边界，不靠二手口号。</p></article>
          </div>
          <p class="section-link-row"><a href="#/methodology">查看理论课编写与审校方法 →</a></p>
        </section>

        <section class="section">
          <div class="section-heading"><div><span class="eyebrow">能力地图</span><h2>从小白到独立构建者</h2></div><a href="#/roadmap">展开 10 个模块 →</a></div>
          <div class="module-grid">${data.modules.slice(0, 6).map(moduleCardHTML).join("")}</div>
        </section>
      </article>`;
  }

  function moduleCardHTML(module) {
    const tag = module.status === "theory" ? "理论已发布" : `${module.lessons} 课`;
    return `
      <article class="module-card ${module.status === "theory" ? "current" : ""}">
        <span class="num">${String(module.order).padStart(2, "0")}</span>
        <div><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.short)}</p></div>
        <span class="tag">${tag}</span>
      </article>`;
  }

  function syllabusModuleHTML(module) {
    const lessons = moduleLessons(module.id);
    return `
      <details class="syllabus-module" ${module.order === 0 ? "open" : ""}>
        <summary>
          <span class="syllabus-number">${String(module.order).padStart(2, "0")}</span>
          <span><strong>${escapeHTML(module.title)}</strong><small>${escapeHTML(module.outcome)}</small></span>
          <span class="tag">${module.lessons} 课</span>
        </summary>
        <div class="syllabus-body">
          <ol class="syllabus-list">${lessons.map((lesson) => `
            <li class="released">
              <span>${lesson.number}</span>
              <a href="#/lesson/${lesson.id}">${escapeHTML(lesson.title)}</a>
              <small>理论已发布</small>
            </li>`).join("")}</ol>
          <p class="syllabus-project"><strong>案例主线：</strong>${escapeHTML(module.project)}</p>
        </div>
      </details>`;
  }

  function roadmapHTML() {
    return `
      <article class="page page-wide">
        <header class="lesson-header">
          <div class="eyebrow">Mastery Roadmap · v${data.meta.version}</div>
          <h1>51 课理论主干：先建立完整方法，再进入实践</h1>
          <p class="lesson-deck">10 个模块按知识依赖展开。每课都包含机制、边界、误区、旅行案例、理论自检与逐条来源；后续实验将以 LAB 形式关联到相应理论课，不改变主线编号。</p>
        </header>

        <section class="section-heading"><div><span class="eyebrow">学习阶段</span><h2>10 个模块，一条依赖链</h2></div><p>初学者建议按顺序学习；已有基础的读者可以跳转，但应先检查每课列出的先修知识。</p></section>
        <div class="module-grid">${data.modules.map(moduleCardHTML).join("")}</div>

        <section class="section">
          <div class="section-heading"><div><span class="eyebrow">逐课细目</span><h2>51 课已经全部开放理论正文</h2></div><p>展开模块可直接进入每课。协议、框架和平台会更新，课程把稳定原理与时变实现明确分开。</p></div>
          <div class="syllabus-grid">${data.modules.map(syllabusModuleHTML).join("")}</div>
        </section>

        <section class="section">
          <div class="section-heading"><div><span class="eyebrow">开始学习</span><h2>前三课建立共同语言</h2></div></div>
          <div class="cards-grid">${publishedLessons().slice(0, 3).map((lesson) => `
            <article class="card">
              <span class="card-number">${lesson.number}</span>
              <h3>${escapeHTML(lesson.title)}</h3>
              <p>${escapeHTML(lesson.deck)}</p>
              <p><a href="#/lesson/${lesson.id}">进入本课 →</a></p>
            </article>`).join("")}</div>
        </section>

        <section class="section callout idea">
          <h3>为什么现在不继续堆实验</h3>
          <p>如果 Python、API、框架或免费模型先于方法论成为课程中心，学习者容易只会复制调用。当前版本先固定“如何定义问题、解释机制、判断边界、权衡风险和核验证据”；实践阶段再依次加入手工模拟、最小实验、故障注入、评测和旅行智能体增量。</p>
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
          <p class="lesson-deck">记录课程结构、理论正文、来源、术语与网站能力的变化，并保留内容核验日期。实践阶段恢复后，LAB 会单独记录。</p>
        </header>
        <div class="updates">${data.updates.map((update) => `
          <section class="update">
            <time>${update.date} · ${update.version}</time>
            <h2>${escapeHTML(update.title)}</h2>
            <p>${escapeHTML(update.description)}</p>
          </section>`).join("")}</div>
      </article>`;
  }

  function methodologyHTML() {
    const method = data.methodology;
    return `
      <article class="page">
        <header class="lesson-header">
          <div class="eyebrow">Theory Standard · v${escapeHTML(method.version)}</div>
          <h1>${escapeHTML(method.title)}</h1>
          <p class="lesson-deck">${escapeHTML(method.summary)}</p>
        </header>

        <section class="theory-section">
          <h2>为什么先建设理论主干</h2>
          ${method.rationale.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        </section>

        <section class="theory-section">
          <h2>每课必须回答的八类问题</h2>
          <div class="method-grid">${method.questions.map((item, index) => `
            <article class="method-card">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description)}</p>
            </article>`).join("")}</div>
        </section>

        <section class="theory-section">
          <h2>来源怎样分级</h2>
          <ol class="source-policy-list">${method.sourcePolicy.map((item) => `
            <li><strong>${escapeHTML(item.level)}</strong><span>${escapeHTML(item.description)}</span></li>`).join("")}</ol>
          <p class="source-note">${escapeHTML(method.sourceBoundary)}</p>
        </section>

        <section class="theory-section">
          <h2>本阶段明确不做什么</h2>
          <ul>${method.deferred.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          <div class="callout idea">
            <h3>实践会怎样接回来</h3>
            <p>${escapeHTML(method.practiceReturn)}</p>
          </div>
        </section>

        <section class="theory-section">
          <h2>51 课的边界：这些内容进入后续选修轨</h2>
          <p>“完整”指核心智能体工程链条没有断层，不等于把所有数学分支、模型训练方法和交互形态塞进同一条线性路线。以下专题会在核心课稳定后独立展开：</p>
          <ul>${method.electives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
        </section>
      </article>`;
  }

  function charterHTML() {
    return `
      <article class="page">
        <header class="lesson-header">
          <div class="eyebrow">Preserved Learning Asset</div>
          <h1>旅行规划智能体 · Agent Charter</h1>
          <p class="lesson-deck">这是上一阶段已经建立的项目契约入口。内容仍只保存在当前浏览器中；理论建设期间不要求继续完善，但不会删除或重置你已经填写的信息。</p>
        </header>
        <section id="charter-builder" class="interactive-panel">
          <div class="form-grid">
            <label>它为谁服务？<textarea data-charter="user" rows="3" placeholder="需要制定可执行旅行计划的游客"></textarea></label>
            <label>最终交付什么？<textarea data-charter="goal" rows="3" placeholder="物资、交通、时间线、摄影机位、Plan B 和来源"></textarea></label>
            <label>允许使用哪些工具？<textarea data-charter="allowed_tools" rows="3" placeholder="官方信息、天气、地图与获准的交通查询等"></textarea></label>
            <label>绝不能做什么？<textarea data-charter="forbidden_actions" rows="3" placeholder="危险、违法、进入封闭区域或未经许可的行为"></textarea></label>
            <label>哪些动作必须审批？<textarea data-charter="approval_required" rows="3" placeholder="登录、购票、订房、付款、联系第三方和公开发表"></textarea></label>
            <label>怎样判断成功？<textarea data-charter="success_metrics" rows="3" placeholder="可执行性、来源、时效、安全、成本与用户价值"></textarea></label>
          </div>
          <div class="panel-actions">
            <button class="button" type="button" data-action="save-charter">保存到当前浏览器</button>
            <button class="button secondary" type="button" data-action="copy-charter">复制契约文本</button>
            <button class="button ghost" type="button" data-action="clear-charter">清除本地契约</button>
          </div>
          <p class="privacy-note muted">网站不上传这些字段，但同源网页脚本仍可能读取浏览器存储。不要填写 API 密钥、证件号码、精确住址或支付信息；可复制备份，也可用上方按钮清除本地副本。</p>
        </section>
      </article>`;
  }

  function sourceRecords() {
    const records = new Map();
    const kindOrder = ["标准与协议", "法律与监管", "原始论文", "官方文档", "治理框架", "安全指南", "教材与专著", "权威定义"];
    publishedLessons().forEach((lesson) => {
      lesson.sources?.forEach((source) => {
        const existing = records.get(source.url) || { ...source, lessons: [] };
        if (!existing.lessons.some((item) => item.id === lesson.id)) {
          existing.lessons.push({ id: lesson.id, number: lesson.number, title: lesson.title });
        }
        records.set(source.url, existing);
      });
    });
    return [...records.values()].sort((a, b) => {
      const byKind = kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind);
      return byKind || a.title.localeCompare(b.title, "zh-CN");
    });
  }

  function sourcesHTML() {
    const records = sourceRecords();
    const grouped = Map.groupBy
      ? Map.groupBy(records, (source) => source.kind)
      : records.reduce((map, source) => {
        if (!map.has(source.kind)) map.set(source.kind, []);
        map.get(source.kind).push(source);
        return map;
      }, new Map());
    return `
      <article class="page page-wide">
        <header class="lesson-header">
          <div class="eyebrow">Primary Sources · 核验于 ${escapeHTML(data.meta.updated)}</div>
          <h1>课程参考资料库</h1>
          <p class="lesson-deck">这里汇总 51 课引用的 ${records.length} 个唯一来源，并显示它们支撑了哪些课程。优先收录原始论文、正式标准和协议/平台官方文档；链接存在不等于课程认可来源中的所有观点。</p>
        </header>
        <div class="source-groups">${[...grouped.entries()].map(([kind, sources]) => `
          <section class="source-group">
            <div class="section-heading"><div><span class="eyebrow">Source Type</span><h2>${escapeHTML(kind)}</h2></div><p>${sources.length} 项</p></div>
            <div class="source-library">${sources.map((source) => `
              <article class="source-card">
                <span class="source-kind">${escapeHTML(source.kind)}</span>
                <h3><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener">${escapeHTML(source.title)}</a></h3>
                <p>${escapeHTML(source.note)}</p>
                <small>用于：${source.lessons.map((lesson) => `<a href="#/lesson/${lesson.id}">${lesson.number}</a>`).join(" · ")}</small>
              </article>`).join("")}</div>
          </section>`).join("")}</div>
      </article>`;
  }

  function theoryLessonBodyHTML(lesson) {
    return `
      <div class="theory-status">
        <span class="source-kind">理论版 · ${escapeHTML(lesson.revision || "v1")}</span>
        <p>本课先建立稳定方法，不要求写代码或调用平台。后续 LAB 会直接关联到这套理论，不改变主线编号。</p>
      </div>

      <section class="objectives">
        <h2>完成这一课，你应该能</h2>
        <ul>${lesson.objectives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      </section>

      <section class="prerequisite-panel">
        <h2>先修与位置</h2>
        <ul>${lesson.prerequisites.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      </section>

      <nav class="lesson-toc" aria-label="本课目录">
        <strong>本课目录</strong>
        <ol>${lesson.sections.map((section, index) => `
          <li><button type="button" data-scroll-target="section-${index + 1}">${escapeHTML(section.title)}</button></li>`).join("")}</ol>
      </nav>

      ${lesson.sections.map((section, index) => `
        <section class="theory-section" id="section-${index + 1}">
          <span class="section-number">${String(index + 1).padStart(2, "0")}</span>
          <h2>${escapeHTML(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
          ${section.bullets?.length ? `<ul>${section.bullets.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>` : ""}
        </section>`).join("")}

      <section class="theory-section">
        <h2>常见误解与纠正</h2>
        <div class="misconception-grid">${lesson.misconceptions.map((item) => `
          <article class="misconception-card">
            <h3>误解：${escapeHTML(item.claim)}</h3>
            <p><strong>纠正：</strong>${escapeHTML(item.correction)}</p>
          </article>`).join("")}</div>
      </section>

      <section class="travel-theory-case">
        <span class="eyebrow">贯穿案例 · 旅行规划智能体</span>
        <h2>${escapeHTML(lesson.travelCase.title)}</h2>
        ${lesson.travelCase.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
        <h3>本案例的决策规则</h3>
        <ul>${lesson.travelCase.decisionRules.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      </section>

      <section class="theory-section">
        <h2>本课结论</h2>
        <ol class="recap-list">${lesson.recap.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ol>
      </section>

      <section class="theory-section">
        <h2>理论自检</h2>
        <p class="muted">先在心里完整回答，再展开参考答案。重点是解释因果和边界，不是背术语。</p>
        <div class="theory-questions">${lesson.questions.map((item, index) => `
          <details>
            <summary>${index + 1}. ${escapeHTML(item.prompt)}</summary>
            <p>${escapeHTML(item.answer)}</p>
          </details>`).join("")}</div>
      </section>

      <section class="theory-section" id="sources">
        <h2>主要来源与延伸阅读</h2>
        <ul class="source-list">${lesson.sources.map((source) => `
          <li>
            <a href="${escapeHTML(source.url)}" target="_blank" rel="noopener">${escapeHTML(source.title)}</a>
            <span class="source-kind">${escapeHTML(source.kind)}</span>
            <small>${escapeHTML(source.note)}</small>
          </li>`).join("")}</ul>
        <p class="source-note">来源核验日期：${escapeHTML(lesson.updated)}。标准、协议和产品文档会更新；课程引用的是页面在核验时支持的主张，不把未来版本视为自动兼容。</p>
      </section>

      <section class="assignment practice-deferred">
        <h3>实践状态：暂缓</h3>
        <p>当前阶段只要求你能用自己的话解释本课的机制、边界与案例决策。代码、Colab、故障注入和项目增量将在理论方法稳定后，以独立 LAB 加入。</p>
      </section>`;
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
          <div class="lesson-meta"><span class="pill published">理论已发布</span><span class="pill">${escapeHTML(lesson.duration)}</span><span class="pill">${escapeHTML(lesson.level)}</span><span class="pill">更新于 ${escapeHTML(lesson.updated)}</span></div>
        </header>
        <div class="lesson-body">${lesson.sections ? theoryLessonBodyHTML(lesson) : lesson.content}</div>
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
    else if (current.section === "methodology") main.innerHTML = methodologyHTML();
    else if (current.section === "sources") main.innerHTML = sourcesHTML();
    else if (current.section === "charter") main.innerHTML = charterHTML();
    else if (current.section === "glossary") main.innerHTML = glossaryHTML();
    else if (current.section === "updates") main.innerHTML = updatesHTML();
    else if (current.section === "lesson" && getLesson(current.id)) main.innerHTML = lessonHTML(getLesson(current.id));
    else main.innerHTML = notFoundHTML();

    const currentLesson = current.section === "lesson" ? getLesson(current.id) : null;
    const pageNames = {
      home: "首页",
      roadmap: "学习路线",
      methodology: "课程方法",
      sources: "参考资料",
      charter: "项目契约",
      glossary: "术语库",
      updates: "更新日志"
    };
    document.title = `${currentLesson?.title || pageNames[current.section] || "页面未找到"}｜${data.meta.title}`;
    if (currentLesson) {
      progress.lastVisited = currentLesson.id;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
    setActiveNavigation();
    bindPageInteractions();
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    main.focus({ preventScroll: true });
  }

  function bindPageInteractions() {
    document.querySelectorAll("[data-quiz]").forEach(renderQuiz);

    document.querySelectorAll("[data-scroll-target]").forEach((button) => {
      button.addEventListener("click", () => {
        document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.querySelectorAll(".copy-code").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.closest(".code-block").querySelector("code").innerText;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "已复制";
          setTimeout(() => { button.textContent = "复制"; }, 1400);
        } catch {
          toast("复制失败，请手动选择代码");
        }
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
            ? (scenario.dataset.correctFeedback || "判断正确。选择能完成任务的最低复杂度，通常更可靠。")
            : (scenario.dataset.wrongFeedback || "再想想：这件事的步骤是一次完成、完全固定，还是会随新信息动态变化？");
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
      "收到目标：制定一份可执行的周末旅行计划",
      "检查状态：还缺天气、开放时间和交通耗时",
      "执行工具：查询天气、官方信息和地图路线",
      "观察结果：周六有雨，原户外路线和摄影机位受影响",
      "验证与重规划：生成室内 Plan B，并标注关键来源"
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
      "name: 旅行规划智能体",
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
      try {
        await navigator.clipboard.writeText(asText(currentCharter()));
        toast("契约已复制，可以直接发给我");
      } catch {
        toast("复制失败，请手动保存契约内容");
      }
    });
    builder.querySelector("[data-action='clear-charter']").addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (button.dataset.confirm !== "true") {
        button.dataset.confirm = "true";
        button.textContent = "再点一次确认清除";
        setTimeout(() => {
          button.dataset.confirm = "false";
          button.textContent = "清除本地契约";
        }, 4000);
        return;
      }
      localStorage.removeItem(CHARTER_KEY);
      builder.querySelectorAll("[data-charter]").forEach((field) => { field.value = ""; });
      button.dataset.confirm = "false";
      button.textContent = "清除本地契约";
      toast("本地契约已清除");
    });
  }

  function openSearch() {
    const dialog = document.querySelector("#search-dialog");
    setSidebarOpen(false);
    searchOpener = document.activeElement;
    dialog.hidden = false;
    document.querySelector(".topbar").inert = true;
    document.querySelector(".app-shell").inert = true;
    const input = document.querySelector("#search-input");
    input.value = "";
    updateSearch("");
    setTimeout(() => input.focus(), 0);
  }

  function closeSearch() {
    const dialog = document.querySelector("#search-dialog");
    if (dialog.hidden) return;
    dialog.hidden = true;
    document.querySelector(".topbar").inert = false;
    document.querySelector(".app-shell").inert = false;
    searchOpener?.focus();
    searchOpener = null;
  }

  function searchableItems() {
    if (searchIndex) return searchIndex;
    searchIndex = [
      ...publishedLessons().map((lesson) => ({
        title: lesson.title,
        subtitle: `课程 · ${lesson.deck}`,
        text: [
          lesson.title,
          lesson.deck,
          ...(lesson.keywords || []),
          ...(lesson.objectives || []),
          ...(lesson.prerequisites || []),
          ...(lesson.sections || []).flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets || [])]),
          ...(lesson.misconceptions || []).flatMap((item) => [item.claim, item.correction]),
          ...(lesson.recap || []),
          ...(lesson.sources || []).flatMap((source) => [source.title, source.note, source.kind])
        ].join(" "),
        href: `#/lesson/${lesson.id}`
      })),
      ...data.glossary.map((item) => ({
        title: `${item.zh} · ${item.en}`,
        subtitle: `术语 · ${item.definition}`,
        text: [item.zh, item.en, item.definition].join(" "),
        href: "#/glossary"
      })),
      ...data.modules.map((module) => ({
        title: `模块 ${String(module.order).padStart(2, "0")} · ${module.title}`,
        subtitle: `路线 · ${module.outcome}`,
        text: [module.title, module.short, module.outcome, module.project, ...module.outline].join(" "),
        href: "#/roadmap"
      })),
      {
        title: data.methodology.title,
        subtitle: `课程方法 · ${data.methodology.summary}`,
        text: [
          data.methodology.title,
          data.methodology.summary,
          ...data.methodology.rationale,
          ...data.methodology.questions.flatMap((item) => [item.title, item.description]),
          ...data.methodology.deferred,
          ...data.methodology.electives
        ].join(" "),
        href: "#/methodology"
      }
    ];
    return searchIndex;
  }

  function updateSearch(query) {
    const normalized = query.trim().toLocaleLowerCase("zh-CN");
    const terms = normalized.split(/\s+/).filter(Boolean);
    const results = searchableItems().filter((item) => {
      const text = item.text.toLocaleLowerCase("zh-CN");
      return terms.length === 0 || terms.every((term) => text.includes(term));
    });
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

    mobileMenuToggle.addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("open"), { focus: true }));
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
      if (event.key === "Escape") {
        if (!document.querySelector("#search-dialog").hidden) closeSearch();
        else if (sidebar.classList.contains("open")) {
          setSidebarOpen(false);
          mobileMenuToggle.focus();
        }
      }
      if (event.key === "Tab" && !document.querySelector("#search-dialog").hidden) {
        const focusable = [...document.querySelector("#search-dialog").querySelectorAll("input, button, a[href], [tabindex]:not([tabindex='-1'])")]
          .filter((node) => !node.disabled && !node.hidden);
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
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
        if (file.size > 1024 * 1024) throw new Error("too-large");
        const imported = JSON.parse(await file.text());
        if (![1, 2].includes(imported?.schemaVersion) || !isPlainRecord(imported)) throw new Error("invalid");
        progress = normalizeProgress(imported);
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
  setSidebarOpen(false);
  mobileLayout.addEventListener?.("change", () => setSidebarOpen(false));
  window.addEventListener("hashchange", render);
  if (!location.hash) navigate("home");
  else render();
})();
