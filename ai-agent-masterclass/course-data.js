window.CourseData = {
  meta: {
    title: "AI 智能体大师课",
    subtitle: "从 AI 小白到能独立设计、构建、评测和部署智能体",
    version: "0.2.1",
    updated: "2026-07-22",
    coreLessons: 51,
    publishedLessons: 2,
    repository: "https://github.com/ZZY-26-26-25/ZZY-26-26-25.github.io/tree/master/ai-agent-masterclass"
  },

  modules: [
    { id: "m00", order: 0, title: "进入智能体世界", short: "建立地图与边界", lessons: 2, status: "current" },
    { id: "m01", order: 1, title: "数字工具与 LLM 基础", short: "API、Python、Prompt、结构化输出", lessons: 7, status: "planned" },
    { id: "m02", order: 2, title: "单智能体与工具调用", short: "Agent Loop、Function Calling、审批", lessons: 6, status: "planned" },
    { id: "m03", order: 3, title: "资料检索与 RAG", short: "搜索、知识库、引用与检索评测", lessons: 6, status: "planned" },
    { id: "m04", order: 4, title: "状态与记忆管理", short: "短期、长期、冲突、遗忘与隐私", lessons: 5, status: "planned" },
    { id: "m05", order: 5, title: "规划、工作流与长任务", short: "任务分解、状态机、恢复与监督", lessons: 5, status: "planned" },
    { id: "m06", order: 6, title: "多智能体与互操作", short: "Supervisor、Handoff、MCP、A2A", lessons: 5, status: "planned" },
    { id: "m07", order: 7, title: "评测、可观测性与安全", short: "Evals、Tracing、注入防护、红队", lessons: 6, status: "planned" },
    { id: "m08", order: 8, title: "产品化与部署", short: "服务、容器、CI/CD、成本与 UX", lessons: 5, status: "planned" },
    { id: "m09", order: 9, title: "毕业综合项目", short: "需求、实现、评测、部署与答辩", lessons: 4, status: "planned" }
  ],

  lessons: [
    {
      id: "m00-l00",
      module: "m00",
      order: 0,
      number: "00",
      title: "导学：先建立你的智能体学习系统",
      shortTitle: "导学与学习契约",
      deck: "先看终点、路线和规则，再动手定义贯穿全程的“旅行规划智能体”。",
      duration: "35 分钟",
      level: "零基础",
      status: "published",
      updated: "2026-07-22",
      keywords: ["课程地图", "Agent Charter", "学习方法", "旅行规划智能体", "旅行规划", "目的地", "天气", "交通", "12306", "航旅纵横", "高德地图", "住宿", "预算", "时间线", "摄影机位", "日出日落", "月相", "星空摄影", "小红书", "抖音", "Plan B", "安全", "审批", "来源验证", "自主度", "权限"],
      content: `
        <section class="objectives">
          <h2>完成这一课，你会得到什么</h2>
          <ul>
            <li>知道这门课如何从零基础一路走到生产级智能体。</li>
            <li>理解“会调用模型”与“会构建可靠智能体”之间的差距。</li>
            <li>建立一个贯穿 51 节核心课的个人项目。</li>
            <li>写出第一版 <button class="term" data-term="agent-charter">Agent Charter</button>（智能体契约）。</li>
          </ul>
        </section>

        <h2 id="destination">先看终点：什么叫“智能体大师”</h2>
        <p>我们不以“跑通一个 Demo”作为终点。课程结束时，你应当能独立回答并完成下面这些事情：</p>
        <div class="cards-grid">
          <article class="card"><span class="card-number">01</span><h3>会判断</h3><p>知道什么时候应该用脚本、工作流或智能体，也知道什么时候不该用智能体。</p></article>
          <article class="card"><span class="card-number">02</span><h3>会构建</h3><p>能搭建工具调用、检索、记忆、规划、多智能体、审批和恢复机制。</p></article>
          <article class="card"><span class="card-number">03</span><h3>会证明</h3><p>用评测、轨迹、成本和安全测试证明系统真的有效，而不是“感觉它很聪明”。</p></article>
        </div>

        <div class="callout idea">
          <h3>贯穿全课的主项目</h3>
          <p><strong>旅行规划智能体</strong>：它将从一个只会罗列景点的小程序，逐步成长为能检索并交叉核验官方与公开信息、记住预算和旅行偏好、规划行前物资、交通与完整时间线、协调天气和摄影等专业智能体，并为恶劣天气、停运、闭园或身体不适生成可执行 Plan B 的完整系统。它会为关键决策附上来源，只推荐安全、合法且获准的玩法，并在购票、预订、付款或公开发表内容前请求审批。</p>
        </div>

        <h2 id="method">我们的学习方法：每个知识点走五遍</h2>
        <ol>
          <li><strong>认识：</strong>先用生活类比建立直觉。</li>
          <li><strong>使用：</strong>亲手运行最小实验。</li>
          <li><strong>调试：</strong>故意制造失败，学会定位原因。</li>
          <li><strong>评测：</strong>用数据判断是否真正改善。</li>
          <li><strong>讲清：</strong>最后用自己的语言教给另一个初学者。</li>
        </ol>
        <p>课程会坚持“先原理、后框架”。OpenAI Agents SDK、LangGraph、MCP 等工具会学习，但它们是实现手段，不是知识本身。这样即使某个 API 改版，你掌握的能力也不会过期。</p>

        <h2 id="autonomy">第一个重要观念：更自主，不等于更好</h2>
        <table class="compare-table">
          <thead><tr><th>等级</th><th>系统能做什么</th><th>适合场景</th></tr></thead>
          <tbody>
            <tr><td>L0</td><td>只生成文本</td><td>改写、摘要、解释</td></tr>
            <tr><td>L1</td><td>建议使用什么工具，但不执行</td><td>高风险决策辅助</td></tr>
            <tr><td>L2</td><td>执行预先确定的固定流程</td><td>步骤稳定、规则清楚的任务</td></tr>
            <tr><td>L3</td><td>在给定工具中自己选择下一步</td><td>路径难以事先穷举的综合旅行规划</td></tr>
            <tr><td>L4+</td><td>长任务重规划或跨智能体协作</td><td>复杂任务，但关键动作必须受监督</td></tr>
          </tbody>
        </table>
        <div class="callout warning">
          <h3>课程中的安全底线</h3>
          <p>我们永远选择“足够完成任务的最低自主度”。权限越大，越需要明确的审批点、预算、停止条件、日志和回滚方式。</p>
        </div>

        <h2 id="charter">动手：写下你的第一份 Agent Charter</h2>
        <p>智能体契约不是漂亮口号，而是系统设计的边界。先写一个不完美的版本，以后每个阶段再迭代。</p>
        <section id="charter-builder" class="interactive-panel">
          <h3>旅行规划智能体 · v0 契约生成器</h3>
          <div class="form-grid">
            <label>它为谁服务？<textarea data-charter="user" rows="2" placeholder="例如：需要制定可执行旅行计划的游客"></textarea></label>
            <label>最终要交付什么？<textarea data-charter="goal" rows="2" placeholder="例如：包含物资、交通、逐时路线、摄影机位、多套 Plan B 和来源的完整计划"></textarea></label>
            <label>允许使用哪些工具？<textarea data-charter="allowed_tools" rows="2" placeholder="例如：官方信息、天气预警、12306、航旅纵横、高德、星空摄影工具；小红书/抖音仅作机位灵感"></textarea></label>
            <label>绝不能做什么？<textarea data-charter="forbidden_actions" rows="2" placeholder="例如：推荐危险、违法、进入封闭区域或未经许可的玩法"></textarea></label>
            <label>哪些动作必须审批？<textarea data-charter="approval_required" rows="2" placeholder="例如：购票、订房、付款、登录账号、联系第三方或公开发表内容"></textarea></label>
            <label>怎样算做得好？<textarea data-charter="success_metrics" rows="2" placeholder="例如：行程可执行率、引用准确率、时间衔接、Plan B 覆盖、安全合规与复用/付费意愿"></textarea></label>
          </div>
          <div class="panel-actions"><button class="button small" type="button" data-action="save-charter">保存到本机</button><button class="button secondary small" type="button" data-action="copy-charter">复制契约</button></div>
          <p class="muted privacy-note">内容只保存在当前浏览器，不会上传到网站或 GitHub。</p>
        </section>

        <h2 id="rules">你和我的协作规则</h2>
        <ul>
          <li>每次只推进一课；如果前置知识缺失，我会先补齐，而不是假设你懂。</li>
          <li>你可以随时说“换个类比”“再慢一点”“给我出题”或“直接实战”。</li>
          <li>每次教学完成后，同步更新本网站的正文、互动实验、测验、资料与更新日志。</li>
          <li>你的私人作业、密钥和个人记忆默认不公开。只有通用教学内容进入网站。</li>
          <li>每个阶段都要有可运行作品和验收，而不是只看完文章。</li>
        </ul>

        <h2 id="quiz">随堂小测</h2>
        <div class="quiz" data-quiz="q-m00-l00"></div>

        <section class="assignment">
          <h3>本课通关任务</h3>
          <p>完成上面的 Agent Charter，然后用一句话回答：</p>
          <div class="assignment-template">我想让智能体帮助我 ______；它可以自主 ______；但在 ______ 之前必须问我。</div>
          <p>把这句话发给我，我们会用它作为后续所有设计的第一条约束。</p>
        </section>
      `
    },
    {
      id: "m00-l01",
      module: "m00",
      order: 1,
      number: "01",
      title: "从 AI、LLM 到 Agent：它们到底是什么关系？",
      shortTitle: "AI、LLM 与 Agent",
      deck: "建立一张不容易过时的心智地图，并亲手运行一次最小智能体循环。",
      duration: "50 分钟",
      level: "零基础",
      status: "published",
      updated: "2026-07-22",
      keywords: ["AI", "机器学习", "深度学习", "LLM", "大语言模型", "AI Agent", "智能体循环", "Agent Loop", "工具调用", "旅行规划", "天气", "交通", "Plan B"],
      content: `
        <section class="objectives">
          <h2>完成这一课，你应该能</h2>
          <ul>
            <li>解释 AI、机器学习、深度学习与 LLM 的关系。</li>
            <li>用自己的话说明 LLM 为什么不是完整的智能体。</li>
            <li>区分聊天机器人、固定工作流与智能体。</li>
            <li>读懂并手工执行一次 <button class="term" data-term="agent-loop">Agent Loop</button>。</li>
          </ul>
        </section>

        <h2 id="family">1. 先把最容易混淆的名词放进一张地图</h2>
        <p>这些词不是平级的产品名称，而是范围不同的概念。可以把它们想成一层层缩小的圆：</p>
        <div class="concept-map" role="img" aria-label="AI、机器学习、深度学习和大语言模型的包含关系">
          <div class="concept-layer"><strong>人工智能 · AI</strong><span>总目标：让机器完成需要智能的任务</span></div>
          <div class="concept-layer"><strong>机器学习 · ML</strong><span>实现 AI 的一类方法：从数据中学习规律</span></div>
          <div class="concept-layer"><strong>深度学习 · DL</strong><span>机器学习的一类方法：使用多层神经网络学习表示</span></div>
          <div class="concept-layer"><strong>大语言模型 · LLM</strong><span>以大量文本等数据训练、擅长理解和生成序列的模型</span></div>
        </div>
        <p><strong>Agent 不在最里面。</strong>它通常是一套包在模型外面的软件系统。它可以使用 LLM 作为决策引擎，但还要加入目标、工具、状态、控制循环、权限与评测。</p>

        <div class="callout idea">
          <h3>一个最重要的类比</h3>
          <p><strong>LLM 像大脑，Agent 像一个在制度和工具支持下做事的人。</strong>只有大脑，没有眼睛、手、笔记、工作流程和权限边界，就很难持续完成现实任务。</p>
        </div>

        <h2 id="llm">2. LLM 在做什么？先用“黑箱模型”理解</h2>
        <p>暂时不碰数学，你可以把 LLM 看成一个函数：输入一段上下文，它根据已经学到的参数，逐步预测并生成后续 <button class="term" data-term="token">Token</button>。这个过程叫 <button class="term" data-term="inference">推理</button>。</p>
        <div class="code-block">
          <div class="code-label"><span>心智模型，不是真实 API</span><button class="copy-code" type="button">复制</button></div>
          <pre><code>输入：指令 + 当前对话 + 相关资料
            ↓
LLM：计算下一个 Token 的概率，并连续生成
            ↓
输出：文字 / 结构化数据 / 工具调用请求</code></pre>
        </div>
        <p>因此，LLM 的“表达很流畅”并不自动等于“事实正确”。它的生成目标首先是形成符合上下文的序列；如果上下文缺少可靠事实，它仍可能给出听起来合理却错误的内容。</p>
        <div class="callout warning">
          <h3>三组不能画等号的概念</h3>
          <p>流畅 ≠ 真实；上下文窗口 ≠ 永久记忆；模型推理 ≠ 软件系统已经验证结果。</p>
        </div>

        <h2 id="difference">3. 聊天机器人、工作流和智能体有什么区别？</h2>
        <table class="compare-table">
          <thead><tr><th>形态</th><th>下一步由谁决定</th><th>典型例子</th><th>主要优点</th></tr></thead>
          <tbody>
            <tr><td><strong>聊天 / 单次调用</strong></td><td>用户再次发消息</td><td>把一段文字改写得更清楚</td><td>简单、便宜、容易控制</td></tr>
            <tr><td><strong>固定工作流</strong></td><td>程序提前写死</td><td>读取已确认行程 → 套模板 → 生成提醒 → 保存</td><td>稳定、可预测、易测试</td></tr>
            <tr><td><strong>智能体</strong></td><td>模型根据新观察动态选择</td><td>先核验目的地，再判断缺少天气、交通、开放状态还是摄影条件</td><td>能处理路径难以事先穷举的任务</td></tr>
          </tbody>
        </table>
        <p>现实系统往往是混合体：外层用确定工作流控制高风险步骤，某些节点内部再让智能体自主选择。不要为了“听起来先进”而把所有流程都智能体化。</p>

        <section class="interactive-panel" id="classifier">
          <h3>互动：它更适合哪种形态？</h3>
          <p class="muted">先做判断，再看原因。目标不是给系统贴标签，而是选择最低且足够的复杂度。</p>
          <div class="scenario" data-correct="chat">
            <div><strong>A. 把已核验的景点资料改写成 150 字行程说明</strong><p>输入清楚，只需一次生成。</p></div>
            <div class="choice-buttons"><button class="choice-button" data-choice="chat">单次调用</button><button class="choice-button" data-choice="workflow">工作流</button><button class="choice-button" data-choice="agent">智能体</button></div>
          </div>
          <div class="scenario" data-correct="workflow">
            <div><strong>B. 出发前每天 8:30，按固定步骤读取天气与已确认行程、生成提醒并存档</strong><p>步骤固定，输入输出明确。</p></div>
            <div class="choice-buttons"><button class="choice-button" data-choice="chat">单次调用</button><button class="choice-button" data-choice="workflow">工作流</button><button class="choice-button" data-choice="agent">智能体</button></div>
          </div>
          <div class="scenario" data-correct="agent">
            <div><strong>C. 为陌生目的地制定完整方案，自己判断该查官方公告、天气、交通、地图还是摄影条件</strong><p>信息缺口会随检索结果变化，路线无法完全预写；社交平台发现的机位还需要交叉核验。</p></div>
            <div class="choice-buttons"><button class="choice-button" data-choice="chat">单次调用</button><button class="choice-button" data-choice="workflow">工作流</button><button class="choice-button" data-choice="agent">智能体</button></div>
          </div>
        </section>

        <h2 id="loop">4. 智能体的心跳：Agent Loop</h2>
        <p>最小智能体循环可以压缩成五步：读取目标和状态、决定下一步、执行动作、观察结果、检查是否结束。没有结束条件，它就可能无限循环；没有工具结果，它就无法真正接触外界。</p>
        <section class="agent-loop" aria-label="智能体循环互动演示">
          <div class="loop-track">
            <div class="loop-step" data-loop-step="0"><span><strong>目标</strong><small>生成可执行旅行方案</small></span></div>
            <div class="loop-step" data-loop-step="1"><span><strong>决定</strong><small>先核验天气与交通</small></span></div>
            <div class="loop-step" data-loop-step="2"><span><strong>行动</strong><small>调用天气、地图与官方检索</small></span></div>
            <div class="loop-step" data-loop-step="3"><span><strong>观察</strong><small>得到预警、班次与开放信息</small></span></div>
            <div class="loop-step" data-loop-step="4"><span><strong>验证</strong><small>能衔接、有来源和 Plan B 吗？</small></span></div>
          </div>
          <div class="loop-controls"><button class="button small" type="button" data-action="run-loop">运行一次循环</button><span class="loop-log">等待开始……</span></div>
        </section>

        <div class="code-block">
          <div class="code-label"><span>最小 Agent Loop · 伪代码</span><button class="copy-code" type="button">复制</button></div>
          <pre><code>state = 初始化(目标, 约束, 预算)

while not 已完成(state):
    decision = 模型决定下一步(state)

    if decision.type == "使用工具":
        observation = 执行工具(decision.tool, decision.arguments)
        state = 更新状态(state, observation)
    else:
        return 验证后输出(decision.answer)

    if 超时 or 超预算 or 需要审批:
        return 暂停并请求人类</code></pre>
        </div>
        <p>这段伪代码已经暴露了智能体工程的核心问题：模型怎样决定？工具怎样定义？哪些状态要保留？怎样停止？何时必须找人？后面的课程会逐个拆开。</p>

        <h2 id="anatomy">5. 一个完整智能体至少要看八个部分</h2>
        <div class="module-grid anatomy-grid">
          <div class="module-card"><span class="num">1</span><div><h3>目标与指令</h3><p>要做什么、什么不做、输出标准是什么</p></div></div>
          <div class="module-card"><span class="num">2</span><div><h3>模型</h3><p>理解输入、作出决策、生成结果</p></div></div>
          <div class="module-card"><span class="num">3</span><div><h3>上下文</h3><p>本轮可见的指令、资料与工具结果</p></div></div>
          <div class="module-card"><span class="num">4</span><div><h3>工具</h3><p>检索、计算、读写或调用外部服务</p></div></div>
          <div class="module-card"><span class="num">5</span><div><h3>状态与记忆</h3><p>任务进度、历史事件和可治理的长期信息</p></div></div>
          <div class="module-card"><span class="num">6</span><div><h3>控制循环</h3><p>如何继续、暂停、重试、转交和结束</p></div></div>
          <div class="module-card"><span class="num">7</span><div><h3>护栏与审批</h3><p>权限、预算、安全规则与人类监督</p></div></div>
          <div class="module-card"><span class="num">8</span><div><h3>评测与日志</h3><p>证明结果、过程、成本和风险是否达标</p></div></div>
        </div>

        <h2 id="quiz">随堂小测</h2>
        <div class="quiz" data-quiz="q-m00-l01"></div>

        <section class="assignment">
          <h3>本课通关任务：用 200 字教会一个 12 岁学生</h3>
          <p>请用自己的话回答三件事：LLM 是什么？它为什么会答错？智能体比 LLM 多了什么？</p>
          <div class="assignment-template">LLM 像 ______，它擅长 ______。\n它可能答错，因为 ______。\n智能体在它外面增加了 ______，所以能够 ______；但仍需要 ______。</div>
          <p>不要追求标准答案。把你的版本发给我，我会只指出心智模型中的关键偏差，并帮你迭代到能讲给别人听。</p>
        </section>

        <h2 id="sources">一手资料与延伸阅读</h2>
        <ul class="source-list">
          <li><a href="https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" target="_blank" rel="noopener">OpenAI · A practical guide to building AI agents</a><small>智能体定义、工具、指令、单/多智能体编排与护栏。</small></li>
          <li><a href="https://developers.openai.com/api/docs/guides/agents" target="_blank" rel="noopener">OpenAI · Agents SDK 文档</a><small>把 Agent 视为会规划、调用工具、协作并维护任务状态的应用。</small></li>
          <li><a href="https://www.anthropic.com/engineering/building-effective-agents" target="_blank" rel="noopener">Anthropic · Building effective agents</a><small>工作流与智能体的区分，以及从简单可组合模式开始的工程方法。</small></li>
        </ul>
      `
    }
  ],

  quizzes: {
    "q-m00-l00": {
      passingScore: 67,
      questions: [
        {
          prompt: "以下哪项最符合这门课的最终目标？",
          options: ["记住尽可能多的框架 API", "能设计、构建并用证据验证可靠智能体", "只要跑通一个聊天 Demo", "让智能体拥有最大权限"],
          answer: 1,
          explanation: "框架会变化；稳定能力是判断、构建、评测、安全和运维。"
        },
        {
          prompt: "系统自主度越高，通常越需要什么？",
          options: ["更长的宣传文案", "取消所有固定流程", "权限边界、审批、预算和日志", "把全部数据放入 Prompt"],
          answer: 2,
          explanation: "自主行动扩大了错误的影响范围，因此控制和可追踪性必须同步增强。"
        },
        {
          prompt: "哪类内容默认不会公开到课程网站？",
          options: ["通用课程正文", "公开参考资料", "你的私人作业、密钥与个人记忆", "小测解析"],
          answer: 2,
          explanation: "公开课程内容和你的私人学习数据必须分开。"
        }
      ]
    },
    "q-m00-l01": {
      passingScore: 80,
      questions: [
        {
          prompt: "LLM 与 Agent 的关系，哪种说法最准确？",
          options: ["两者完全相同", "Agent 一定不需要模型", "LLM 可作为 Agent 的决策引擎，但 Agent 还包括工具、状态、循环和护栏", "只要有聊天界面就是 Agent"],
          answer: 2,
          explanation: "模型是重要组件，但不是整套能持续行动的软件系统。"
        },
        {
          prompt: "“出发前每天按固定步骤读取天气与已确认行程、生成提醒并保存”优先应该设计成什么？",
          options: ["固定工作流", "完全自主智能体", "多智能体系统", "只依赖长期记忆"],
          answer: 0,
          explanation: "路径稳定、规则清楚时，固定工作流更可靠、更便宜、更容易测试。"
        },
        {
          prompt: "Agent Loop 在观察到工具结果之后，合理的下一步是什么？",
          options: ["无条件重复同一工具", "更新状态并判断下一步或是否结束", "删除所有历史信息", "直接把结果当成正确答案"],
          answer: 1,
          explanation: "新观察要进入当前状态，再由系统验证证据是否足够。"
        },
        {
          prompt: "为什么 LLM 说得很流畅仍可能是错的？",
          options: ["因为所有 LLM 都不能处理文字", "因为生成连贯序列的目标不自动保证事实真实", "因为工具一定返回假数据", "因为 Token 就是数据库记录"],
          answer: 1,
          explanation: "语言概率和事实验证是两件事；可靠系统需要来源、工具和验证。"
        },
        {
          prompt: "下面哪一项不是完整智能体必须考虑的工程部分？",
          options: ["终止条件", "权限与审批", "任务状态", "让模型暴露全部内部思维过程"],
          answer: 3,
          explanation: "系统应依赖可检查的动作、观察、结果和验证，不应把不可控的内部思维当接口。"
        }
      ]
    }
  },

  glossary: [
    { id: "ai", zh: "人工智能", en: "Artificial Intelligence · AI", definition: "让机器完成通常需要智能的任务的广泛研究与工程领域。" },
    { id: "llm", zh: "大语言模型", en: "Large Language Model · LLM", definition: "在大规模序列数据上训练、能依据上下文理解与生成语言等内容的模型。" },
    { id: "agent", zh: "AI 智能体", en: "AI Agent", definition: "在明确边界内，为目标持续获取信息、选择动作、调用工具、更新状态并检查结果的软件系统。" },
    { id: "agent-loop", zh: "智能体循环", en: "Agent Loop", definition: "目标/状态 → 决策 → 行动 → 观察 → 更新与验证 → 继续或结束的控制循环。" },
    { id: "agent-charter", zh: "智能体契约", en: "Agent Charter", definition: "对目标、输入输出、允许工具、禁止动作、审批点、数据策略、成功指标与停止条件的明确约定。" },
    { id: "token", zh: "Token", en: "Token", definition: "模型处理序列时使用的基本单位；它不总等于一个汉字或一个完整英文单词。" },
    { id: "context", zh: "上下文", en: "Context", definition: "本次模型调用可见的指令、对话、资料与工具结果；它是有限工作区，不等于永久记忆。" },
    { id: "inference", zh: "推理", en: "Inference", definition: "使用已经训练好的模型参数，根据输入生成预测或输出的过程。" },
    { id: "tool", zh: "工具", en: "Tool", definition: "智能体用来获取外部信息或执行动作的受控接口，例如搜索、计算、数据库查询或文件操作。" },
    { id: "workflow", zh: "工作流", en: "Workflow", definition: "由程序预先规定执行路径的多步骤流程；模型可以参与某些节点，但不会自由决定整个流程。" },
    { id: "rag", zh: "检索增强生成", en: "Retrieval-Augmented Generation · RAG", definition: "先从外部知识源检索相关证据，再把证据提供给生成模型的系统方法。" },
    { id: "memory", zh: "智能体记忆", en: "Agent Memory", definition: "经过选择、结构化和治理后，可供后续任务读取的状态、事件、事实或偏好；不是把所有对话无限堆叠。" },
    { id: "mcp", zh: "模型上下文协议", en: "Model Context Protocol · MCP", definition: "让 AI 应用以标准方式发现和使用外部工具、资源与提示模板的开放协议。" },
    { id: "eval", zh: "评测", en: "Evaluation · Eval", definition: "用任务集、指标和判分标准系统地测量结果质量、过程、成本、延迟与风险。" }
  ],

  updates: [
    {
      date: "2026-07-22",
      version: "v0.2.1",
      title: "补齐旅行工具搜索索引",
      description: "让 12306、航旅纵横、高德地图、星空摄影、小红书、抖音等旅行工具与场景词可以直接检索到对应课程。"
    },
    {
      date: "2026-07-22",
      version: "v0.2.0",
      title: "贯穿项目切换为旅行规划智能体",
      description: "同步更新主项目定位、Agent Charter、课程场景、智能体循环、搜索关键词与安全审批边界；保留原有课程进度。"
    },
    {
      date: "2026-07-22",
      version: "v0.1.0",
      title: "项目启动：课程地图、导学课与第 1 课上线",
      description: "建立 10 模块、51 节核心课的完整路线；加入本地学习进度、搜索、小测、智能体循环演示和 Agent Charter 生成器。"
    }
  ]
};
