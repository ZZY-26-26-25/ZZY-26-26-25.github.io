window.CourseData = {
  meta: {
    title: "AI 智能体大师课",
    subtitle: "从 AI 小白到能独立设计、构建、评测和部署智能体",
    version: "0.3.0",
    updated: "2026-07-23",
    coreLessons: 51,
    publishedLessons: 3,
    repository: "https://github.com/ZZY-26-26-25/ZZY-26-26-25.github.io/tree/master/ai-agent-masterclass"
  },

  modules: [
    {
      id: "m00",
      order: 0,
      title: "进入智能体世界",
      short: "建立地图、目标与权限边界",
      lessons: 2,
      status: "released",
      outcome: "能区分 LLM、工作流与智能体，并写出可执行的 Agent Charter。",
      project: "旅行规划智能体 v0：目标、工具、禁区、审批点与成功指标。",
      outline: [
        "导学：建立学习系统与 Agent Charter",
        "AI、机器学习、LLM、工作流与 Agent"
      ]
    },
    {
      id: "m01",
      order: 1,
      title: "数字工具与 LLM 基础",
      short: "Colab、API、Python、Prompt、结构化输出",
      lessons: 7,
      status: "current",
      outcome: "能在 Colab 与本地环境安全调用模型，稳定获得并验证结构化结果。",
      project: "结构化旅行助手：把旅行需求变成可校验的 JSON 方案。",
      outline: [
        "Colab 与模型 API：完成第一次真实调用",
        "智能体所需的 Python 与 Notebook 最小基础",
        "Token、上下文窗口、采样、延迟与费用",
        "Prompt、消息角色与指令优先级",
        "JSON Schema、结构化输出与结果验证",
        "流式输出、超时、限流、重试与并发",
        "模型选择、基线任务集与成本质量权衡"
      ]
    },
    {
      id: "m02",
      order: 2,
      title: "单智能体与工具调用",
      short: "Agent Loop、工具契约、执行器与审批",
      lessons: 6,
      status: "planned",
      outcome: "能从零实现一个有终止条件、工具验证、权限边界和人工审批的单智能体。",
      project: "工具型旅行智能体：查询天气、地图和官方信息，但高风险动作必须暂停审批。",
      outline: [
        "从 while 循环实现最小 Agent Loop",
        "Function Calling 与 JSON Schema 工具契约",
        "参数校验、工具执行、观察与错误回传",
        "多工具路由、并行调用与结果合并",
        "最小权限、幂等性、预算、停止与人工审批",
        "单智能体旅行规划器 v1：从需求到可执行计划"
      ]
    },
    {
      id: "m03",
      order: 3,
      title: "资料检索与 RAG",
      short: "搜索、证据、知识库、引用与检索评测",
      lessons: 6,
      status: "planned",
      outcome: "能构建有来源层级、时间戳、可追溯引用和检索评测的研究系统。",
      project: "目的地研究助手：社交平台找线索，官方与一手来源确认事实。",
      outline: [
        "检索问题定义、来源层级与时效性",
        "查询拆解、搜索策略、去重与交叉核验",
        "网页解析、正文抽取、快照、元数据与引用",
        "Embedding、切块、向量检索与上下文组装",
        "关键词 + 向量混合检索、过滤与重排序",
        "RAG 评测：召回、忠实度、引用正确性与旅行知识库"
      ]
    },
    {
      id: "m04",
      order: 4,
      title: "状态、上下文与记忆管理",
      short: "工作状态、长期记忆、冲突、遗忘与隐私",
      lessons: 5,
      status: "planned",
      outcome: "能明确什么进入上下文、什么写入记忆，以及如何更新、冲突处理、遗忘和删除。",
      project: "可治理旅行偏好记忆：预算、节奏、饮食和摄影偏好可查看、修改与清除。",
      outline: [
        "任务状态、上下文与长期记忆不是一回事",
        "对话窗口、摘要、压缩与工作记忆",
        "语义、情景、程序性记忆及其存储结构",
        "记忆写入门、检索、冲突、衰减与遗忘",
        "隐私、同意、生命周期与个性化旅行助手"
      ]
    },
    {
      id: "m05",
      order: 5,
      title: "规划、工作流与长任务",
      short: "任务分解、状态机、恢复、重规划与调度",
      lessons: 5,
      status: "planned",
      outcome: "能把长任务做成可暂停、恢复、重试、取消、重规划和人工接管的可靠流程。",
      project: "多日行程系统：天气、停运、闭园或体力变化时生成并比较 Plan B。",
      outline: [
        "目标、约束、任务分解与计划表示",
        "顺序、分支、循环、DAG 与状态机",
        "约束求解、反思、重规划与 Plan B",
        "Checkpoint、重试、补偿、超时、取消与恢复",
        "事件驱动、定时任务、人在回路与长行程监督"
      ]
    },
    {
      id: "m06",
      order: 6,
      title: "多智能体与互操作",
      short: "Router、Supervisor、Handoff、MCP 与 A2A",
      lessons: 5,
      status: "planned",
      outcome: "能判断何时需要多智能体，并用清晰协议控制角色、通信、共享状态和失败传播。",
      project: "旅行规划团队：交通、天气、安全、摄影等专家协作，由总规划器验收。",
      outline: [
        "何时需要多智能体，以及它为何经常适得其反",
        "Router、Supervisor、Handoff、并行与辩论模式",
        "消息契约、共享状态、黑板与冲突仲裁",
        "MCP：工具与资源的标准化接入",
        "A2A、跨智能体协作与旅行专家团队"
      ]
    },
    {
      id: "m07",
      order: 7,
      title: "评测、可观测性与安全",
      short: "Evals、Tracing、注入防护、红队与事故响应",
      lessons: 6,
      status: "planned",
      outcome: "能以数据和轨迹证明质量，发现回归，并抵抗常见的提示注入、越权和数据泄露。",
      project: "安全可靠版旅行智能体：离线评测集、轨迹审计、攻击集和发布门禁。",
      outline: [
        "从需求建立数据集、指标、Rubric 与基线",
        "结果、轨迹、工具、RAG、成本和延迟评测",
        "日志、Trace、指标、复现与根因定位",
        "威胁建模：提示注入、数据泄露、工具滥用与供应链",
        "输入输出护栏、沙箱、最小权限、红队与审批",
        "回归测试、在线监控、灰度发布与事故响应"
      ]
    },
    {
      id: "m08",
      order: 8,
      title: "产品化与部署",
      short: "服务、容器、CI/CD、可靠性、成本与 UX",
      lessons: 5,
      status: "planned",
      outcome: "能把实验原型变成可部署、可监控、可升级、可控成本且用户信任的产品。",
      project: "旅行智能体 Web 应用：账号隔离、后台任务、审批界面、监控和费用上限。",
      outline: [
        "Web/API、队列、缓存、数据库与后台任务架构",
        "环境配置、Secret、容器、沙箱与数据隔离",
        "版本管理、CI/CD、评测门禁与回滚",
        "延迟、吞吐、缓存、路由、可靠性与成本工程",
        "人机交互、可解释审批、无障碍、合规与商业指标"
      ]
    },
    {
      id: "m09",
      order: 9,
      title: "毕业综合项目",
      short: "需求、架构、实现、验收、上线与答辩",
      lessons: 4,
      status: "planned",
      outcome: "独立交付一个有设计证据、评测报告、安全说明、运维手册与真实用户反馈的智能体。",
      project: "完整旅行规划智能体：从用户访谈到公开演示和付费价值验证。",
      outline: [
        "需求冻结、风险分析、架构图、数据与决策记录",
        "端到端实现、集成测试与失败恢复",
        "离线评测、红队、用户测试与发布门禁",
        "部署、演示、运维、商业验证与毕业答辩"
      ]
    }
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
        <p class="muted">下面的 L0–L4+ 是本课程为了比较风险与控制成本而设计的教学分级，并非行业统一标准或官方认证等级。</p>
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

        <h2 id="sources">一手资料与课程依据</h2>
        <ul class="source-list">
          <li><a href="https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" target="_blank" rel="noopener">OpenAI · A practical guide to building AI agents</a><small>智能体构成、工具、指令、护栏，以及从单智能体逐步增加复杂度的工程建议。</small></li>
          <li><a href="https://www.anthropic.com/engineering/building-effective-agents" target="_blank" rel="noopener">Anthropic · Building effective agents</a><small>工作流与智能体的区分，以及优先采用简单、可组合模式的理由。</small></li>
        </ul>
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
    },
    {
      id: "m01-l00",
      module: "m01",
      order: 0,
      number: "02",
      title: "第一次真实调用：用 Colab 连接模型 API",
      shortTitle: "Colab 与模型 API",
      deck: "从零读懂 HTTP、JSON、Endpoint、API Key 和模型参数，并用不泄露密钥的方式跑通第一个可复用实验。",
      duration: "90 分钟",
      level: "零基础 · 实验课",
      status: "published",
      updated: "2026-07-23",
      keywords: ["Google Colab", "Colab", "Jupyter", "Notebook", "API", "HTTP", "JSON", "REST", "Endpoint", "Base URL", "API Key", "Bearer Token", "Secrets", "环境变量", "OpenAI-compatible", "OpenAI 兼容", "Chat Completions", "vLLM", "Python", "模型接口", "免费 API", "开源模型", "开放权重", "限流", "429", "重试", "超时", "旅行规划", "结构化输出"],
      content: `
        <section class="objectives">
          <h2>完成这一课，你应该能</h2>
          <ul>
            <li>说清浏览器聊天、模型、API 和模型网关分别是什么。</li>
            <li>读懂一次模型请求中的 URL、Header、JSON Body 与 JSON Response。</li>
            <li>在 Google Colab 中用 Secret 保存密钥，并从公开 GitHub Notebook 安全运行代码。</li>
            <li>接入一个提供 <code>/v1/chat/completions</code> 的兼容接口，同时识别厂商扩展和兼容性差异。</li>
            <li>根据 HTTP 状态码定位常见错误，并完成一次最小验收。</li>
          </ul>
        </section>

        <div class="callout warning">
          <h3>先处理你提供的接口文档</h3>
          <p>文档中包含多组明文 Bearer 凭证。公开课程和 Notebook 已全部排除这些值，也不会尝试替你传播或复用。只要一个密钥曾出现在可共享文档、聊天截图或 GitHub 中，就应按“可能泄露”处理：联系接口管理员吊销或轮换，再把新密钥放入 Secret。不要把原文直接提交到公开仓库。</p>
        </div>

        <h2 id="mental-model">1. 先建立调用链：你到底在连接谁？</h2>
        <p>在网页里聊天时，网站替你完成了网络请求。写智能体时，你需要让程序自己发出请求。今天先不构建 Agent Loop，只把最底层的“程序 ↔ 模型服务”连接打通。</p>
        <div class="platform-flow" role="img" aria-label="课程网站、GitHub、Colab 和模型网关之间的关系">
          <article><span>① 学习</span><strong>GitHub Pages</strong><small>读课程、做小测、保存本机进度；不接触 API Key</small></article>
          <article><span>② 取代码</span><strong>GitHub Notebook</strong><small>公开、可审查、可版本管理；只含占位符</small></article>
          <article><span>③ 执行</span><strong>Google Colab</strong><small>在临时 Python 运行时读取你授权的 Secret</small></article>
          <article><span>④ 推理</span><strong>模型 API / 网关</strong><small>接收 JSON 请求，返回模型输出或错误状态</small></article>
        </div>
        <p>这套分工解决了一个关键矛盾：代码应该公开、可复现；密钥必须私有。Colab 可以直接从 GitHub 加载 <code>.ipynb</code>，但代码在与你账号关联的临时虚拟机里执行。运行时会被回收，因此代码和依赖要能从头重跑，结果和重要数据也不能只留在临时磁盘。</p>

        <h2 id="api-anatomy">2. 一次 API 请求的六个零件</h2>
        <table class="compare-table">
          <thead><tr><th>零件</th><th>它回答的问题</th><th>本课示例</th><th>常见错误</th></tr></thead>
          <tbody>
            <tr><td><button class="term" data-term="base-url">Base URL</button></td><td>服务器在哪里？</td><td><code>https://你的网关域名</code></td><td>多写或少写一个 <code>/v1</code></td></tr>
            <tr><td><button class="term" data-term="endpoint">Endpoint</button></td><td>调用服务器的哪项能力？</td><td><code>POST /v1/chat/completions</code></td><td>路径过期、方法不对、404/405</td></tr>
            <tr><td>Header</td><td>这是什么数据、我是谁？</td><td><code>Content-Type</code> 与 <code>Authorization</code></td><td>Bearer 拼写、空格或密钥错误</td></tr>
            <tr><td><button class="term" data-term="json">JSON Body</button></td><td>我要模型做什么？</td><td><code>model</code>、<code>messages</code>、生成参数</td><td>逗号、引号、字段类型或模型名错误</td></tr>
            <tr><td>Status Code</td><td>请求在网络层是否成功？</td><td><code>200</code>、<code>401</code>、<code>429</code>、<code>5xx</code></td><td>只看异常文字，不看状态码</td></tr>
            <tr><td>Response JSON</td><td>模型和服务返回了什么？</td><td>通常从 <code>choices[0].message.content</code> 取文本</td><td>假定所有兼容服务响应完全相同</td></tr>
          </tbody>
        </table>

        <div class="code-block">
          <div class="code-label"><span>OpenAI Chat Completions 风格 · 所有值均为占位符</span><button class="copy-code" type="button">复制</button></div>
          <pre><code>POST https://YOUR_GATEWAY.example/v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "model": "YOUR_MODEL_NAME",
  "messages": [
    {"role": "system", "content": "你是谨慎的旅行规划助手。"},
    {"role": "user", "content": "列出制定三日行程前必须确认的5项信息。"}
  ],
  "temperature": 0.2,
  "max_tokens": 500
}</code></pre>
        </div>
        <p><strong>API 是契约，不是魔法。</strong>客户端按约定发送请求，服务端按约定返回结果。HTTP 规定网络消息的语义，JSON 规定结构化数据的文本表示；模型服务再在这两层之上定义字段。</p>

        <h2 id="compatibility">3. “OpenAI 兼容”到底兼容什么？</h2>
        <p>你提供的接口使用 <code>/v1/chat/completions</code>、Bearer 鉴权、<code>model + messages</code> 请求体，因此可以称为<strong>采用 OpenAI Chat Completions 风格的网关</strong>。vLLM 等推理服务也能提供这类兼容服务器，但“兼容”通常只表示一组常用请求与响应形状相近，不代表所有字段、模型能力、错误格式、工具调用、流式输出或 SDK 行为完全一致。</p>
        <table class="compare-table">
          <thead><tr><th>概念</th><th>它证明了什么</th><th>它没有证明什么</th></tr></thead>
          <tbody>
            <tr><td>OpenAI-compatible API</td><td>某些端点和字段可按相似方式调用</td><td>不是 OpenAI 官方服务，也不保证 100% 参数兼容</td></tr>
            <tr><td>可通过 API 访问</td><td>你拥有某种调用入口</td><td>不等于免费、无限额、稳定或允许公开转发</td></tr>
            <tr><td>开放权重</td><td>模型权重在许可证条件下可获得</td><td>不自动等于完整训练代码和数据均开源</td></tr>
            <tr><td>量化版本</td><td>权重或计算采用较低精度以节省资源</td><td>不能只凭 w4a8/w8a8 推断实际质量和速度</td></tr>
          </tbody>
        </table>
        <div class="callout idea">
          <h3>对附件的证据分级</h3>
          <p><strong>可以确认：</strong>文档声明的 URL 形态、请求示例和模型别名。<strong>需要网关管理员或运行测试确认：</strong>当前可用模型、上下文长度、量化方式、并发实例、限流、免费政策和服务期限。<code>chat_template_kwargs</code> 也是网关/推理框架扩展，不应写进通用客户端的必选字段。</p>
        </div>

        <h2 id="secret">4. 密钥是权限，不是普通字符串</h2>
        <p><button class="term" data-term="api-key">API Key</button> 往往代表配额、费用和访问权限。它不应该出现在公开 Notebook、网页前端、Git 历史、截图、报错全文或共享日志里。GitHub Pages 的 JavaScript 会下载到每个访问者浏览器，因此<strong>绝不能把长期密钥放在本站前端</strong>。</p>
        <div class="do-dont-grid">
          <article class="practice-card good"><strong>应该这样做</strong><ul><li>在 Colab 左侧“钥匙”面板创建 <code>MODEL_API_KEY</code>。</li><li>只授权当前 Notebook 读取该 Secret。</li><li>设置用量上限，按用途拆分密钥并定期轮换。</li><li>日志只记录请求 ID、耗时、状态码和脱敏信息。</li></ul></article>
          <article class="practice-card bad"><strong>不要这样做</strong><ul><li>把密钥粘到代码单元、URL 或 GitHub Issue。</li><li>因为接口“免费”就共享同一个永久密钥。</li><li>打印完整 Header、环境变量或异常请求对象。</li><li>把 Notebook 输出连同凭证公开分享。</li></ul></article>
        </div>

        <h2 id="lab">5. 实验：在 Colab 完成第一次调用</h2>
        <section class="lab-card">
          <div>
            <span class="eyebrow">LAB 01 · 可直接运行</span>
            <h3>通用模型 API 客户端</h3>
            <p>Notebook 不内置供应商、域名、模型名或密钥。你只需填写 Base URL 与 Model，并在 Colab Secrets 中保存 <code>MODEL_API_KEY</code>。没有密钥时也能运行 Mock 模式，先理解数据流。</p>
            <ul>
              <li>自动规范化完整 Endpoint，避免重复 <code>/v1</code>。</li>
              <li>请求超时、指数退避、429/5xx 有限重试。</li>
              <li>兼容常见 <code>choices → message → content</code> 响应，并在不兼容时显示可诊断错误。</li>
              <li>内置旅行规划提示、结构检查、失败练习和通关清单。</li>
            </ul>
          </div>
          <div class="lab-actions">
            <a class="button" href="https://colab.research.google.com/github/ZZY-26-26-25/ZZY-26-26-25.github.io/blob/master/ai-agent-masterclass/labs/01-first-api-call.ipynb" target="_blank" rel="noopener">在 Colab 打开实验 ↗</a>
            <a class="button ghost" href="https://github.com/ZZY-26-26-25/ZZY-26-26-25.github.io/blob/master/ai-agent-masterclass/labs/01-first-api-call.ipynb" target="_blank" rel="noopener">查看 Notebook 源码</a>
          </div>
        </section>
        <ol class="checklist">
          <li><strong>复制一份：</strong>在 Colab 中选择“文件 → 在云端硬盘中保存副本”，公开原版以后更新不会覆盖你的实验。</li>
          <li><strong>先跑 Mock：</strong>从上到下运行，确认每个单元的输入与输出。</li>
          <li><strong>设置三个值：</strong><code>BASE_URL</code>、<code>MODEL</code>、Colab Secret <code>MODEL_API_KEY</code>。</li>
          <li><strong>发最小请求：</strong>先只用 <code>model</code>、<code>messages</code> 和很小的 <code>max_tokens</code>，不要一开始叠加思考、工具或长上下文参数。</li>
          <li><strong>保存证据：</strong>只记录时间、脱敏后的服务名、模型别名、状态码、耗时和输出；绝不记录密钥。</li>
        </ol>

        <h2 id="parameters">6. 先只掌握这几个参数</h2>
        <table class="compare-table">
          <thead><tr><th>参数</th><th>作用</th><th>初学建议</th></tr></thead>
          <tbody>
            <tr><td><code>model</code></td><td>选择网关暴露的模型别名</td><td>精确复制管理员给出的 ID；显示名不一定能调用</td></tr>
            <tr><td><code>messages</code></td><td>按角色传入指令、用户输入和历史</td><td>先用 system + user；后续再讲完整指令层级</td></tr>
            <tr><td><code>max_tokens</code></td><td>限制本次最多生成多少 Token</td><td>先设 300–800，避免失败请求消耗过多资源</td></tr>
            <tr><td><code>temperature</code></td><td>影响采样随机性，具体支持依模型而异</td><td>信息提取与规划草案先用较低值；不要把它当“准确度旋钮”</td></tr>
            <tr><td><code>top_p</code></td><td>另一种控制候选 Token 范围的采样参数</td><td>初学阶段不要同时频繁调 temperature 与 top_p</td></tr>
            <tr><td><code>stream</code></td><td>是否边生成边接收</td><td>第一课先关闭；流式协议和中断处理后续单讲</td></tr>
          </tbody>
        </table>
        <p>不同模型和网关支持的参数可能不同。遇到 400/422 时，先删掉所有可选字段，只保留最小请求，再逐个加回。这比盲目换模型更容易定位问题。</p>

        <h2 id="errors">7. 学会读错误，才算真正跑通</h2>
        <section class="interactive-panel">
          <h3>互动：先找哪一层？</h3>
          <div class="scenario" data-correct="auth" data-correct-feedback="正确。401 首先定位认证层：Secret 是否存在、Header 是否为 Bearer、密钥是否有效且有权限。" data-wrong-feedback="先按状态码定位网络层。401 与 Prompt、记忆或 RAG 无关。">
            <div><strong>A. 返回 401，正文提示 credentials invalid</strong><p>请求已经到达服务器，但身份凭证无效或缺失。</p></div>
            <div class="choice-buttons"><button class="choice-button" data-choice="prompt">改 Prompt</button><button class="choice-button" data-choice="auth">查 Secret/Header</button><button class="choice-button" data-choice="memory">加记忆</button></div>
          </div>
          <div class="scenario" data-correct="route" data-correct-feedback="正确。404 表示目标资源未找到，应先检查 Base URL、/v1 和 Endpoint 拼接。" data-wrong-feedback="服务器路径都没有命中时，生成参数和 RAG 还没有机会生效。">
            <div><strong>B. 返回 404，且域名能访问</strong><p>服务器存在，但目标资源路径不存在。</p></div>
            <div class="choice-buttons"><button class="choice-button" data-choice="route">查 Base URL/Endpoint</button><button class="choice-button" data-choice="temperature">调 temperature</button><button class="choice-button" data-choice="rag">加向量库</button></div>
          </div>
          <div class="scenario" data-correct="backoff" data-correct-feedback="正确。只对暂时性错误做有限指数退避，并设置总时长、次数和取消条件。" data-wrong-feedback="无限重试和共享密钥都会放大故障与安全风险。">
            <div><strong>C. 返回 429 或 503</strong><p>可能是限流、过载或维护；无限立即重试会让情况更糟。</p></div>
            <div class="choice-buttons"><button class="choice-button" data-choice="backoff">有限指数退避</button><button class="choice-button" data-choice="leak">换成公开密钥</button><button class="choice-button" data-choice="loop">无限循环</button></div>
          </div>
        </section>
        <table class="compare-table">
          <thead><tr><th>现象</th><th>优先检查</th><th>不要做</th></tr></thead>
          <tbody>
            <tr><td>DNS/连接失败</td><td>域名、网络可达性、VPN/内网限制、TLS</td><td>把密钥贴到论坛求助</td></tr>
            <tr><td>400 / 422</td><td>JSON、字段类型、模型名和不兼容参数</td><td>无脑重试相同请求</td></tr>
            <tr><td>401 / 403</td><td>Secret、Bearer Header、权限和有效期</td><td>在输出中打印完整 Header</td></tr>
            <tr><td>404 / 405</td><td>Base URL、Endpoint 和 HTTP 方法</td><td>先改 Prompt</td></tr>
            <tr><td>429</td><td>配额、并发、速率限制与 Retry-After</td><td>无限并发或毫无等待地重试</td></tr>
            <tr><td>500 / 502 / 503 / 504</td><td>服务端、网关、过载和上游超时</td><td>认定是 Python 语法错误</td></tr>
            <tr><td>200 但内容不合格</td><td>任务定义、Prompt、模型能力与结果验证</td><td>把“HTTP 成功”当成“业务正确”</td></tr>
          </tbody>
        </table>

        <h2 id="acceptance">8. 本课验收：不是出现一段文字就结束</h2>
        <p>真正的“跑通”至少有四层：</p>
        <ol>
          <li><strong>连接成功：</strong>能得到 2xx 响应，并记录耗时。</li>
          <li><strong>解析成功：</strong>程序能从 JSON 中取出内容，缺字段时给出明确错误。</li>
          <li><strong>任务成功：</strong>输出确实列出制定三日行程前需要确认的信息，而不是泛泛介绍旅游。</li>
          <li><strong>安全成功：</strong>Notebook、输出、Git 历史和截图中都没有密钥。</li>
        </ol>
        <section class="assignment">
          <h3>通关任务：提交一张“脱敏运行卡”</h3>
          <div class="assignment-template">运行时间：YYYY-MM-DD HH:MM（注明时区）
运行模式：Mock / 真实接口
服务：仅写公开名称或“机构网关”，不要写私有地址
模型别名：________
HTTP 状态：________
耗时：________ 秒
输出是否包含 5 项待确认信息：是 / 否
我遇到的错误及定位层：________
密钥检查：代码、输出、截图中均未出现密钥（是 / 否）</div>
          <p>把这张卡和模型给出的 5 项信息发给我。不要发送 API Key、完整 Authorization Header 或含密钥的截图；我会根据运行证据教你做第一次调试和改进。</p>
        </section>

        <h2 id="quiz">随堂小测</h2>
        <div class="quiz" data-quiz="q-m01-l00"></div>

        <h2 id="sources">一手资料与核验边界</h2>
        <ul class="source-list">
          <li><a href="https://research.google.com/colaboratory/faq.html" target="_blank" rel="noopener">Google Colab FAQ</a><small>Notebook 可从 GitHub 加载、代码在临时虚拟机执行、资源与运行时不是永久或无限的。</small></li>
          <li><a href="https://colab.research.google.com/github/googlecolab/colabtools/blob/main/notebooks/Secrets.ipynb" target="_blank" rel="noopener">Google Colab · Secrets 官方示例 Notebook</a><small>Colab Secret 的界面和 <code>google.colab.userdata</code> 读取方式；界面可能随产品更新。</small></li>
          <li><a href="https://datatracker.ietf.org/doc/html/rfc9110" target="_blank" rel="noopener">IETF RFC 9110 · HTTP Semantics</a><small>HTTP 方法、响应和状态码的规范来源。</small></li>
          <li><a href="https://datatracker.ietf.org/doc/html/rfc8259" target="_blank" rel="noopener">IETF RFC 8259 · JSON</a><small>JSON 对象、数组、字符串、数值与语法的标准定义。</small></li>
          <li><a href="https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create" target="_blank" rel="noopener">OpenAI · Create chat completion</a><small>本课所称 Chat Completions 风格的消息、鉴权和请求形状参考；第三方网关不等于 OpenAI 官方服务。</small></li>
          <li><a href="https://docs.vllm.ai/en/stable/serving/online_serving/openai_compatible_server/" target="_blank" rel="noopener">vLLM · OpenAI-Compatible Server</a><small>开放模型推理服务如何暴露兼容接口，以及兼容范围依服务实现而异。</small></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP · Secrets Management Cheat Sheet</a><small>凭证的生命周期、最小权限、轮换、审计和泄露响应。</small></li>
        </ul>
        <p class="source-note"><strong>课程核验说明：</strong>附件中的具体模型在线状态、上下文长度、量化、实例数量、限流和“免费”政策没有可引用的公开权威页面，因此本课不把它们写成事实。真实使用前应向接口管理员确认服务条款，并以最小请求和可审计结果验证。</p>
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
    },
    "q-m01-l00": {
      passingScore: 80,
      questions: [
        {
          prompt: "为什么不能把 API Key 直接写进 GitHub Pages 的 JavaScript？",
          options: ["JavaScript 不能发送 HTTP", "网页代码会下载到访问者浏览器，密钥可以被读取", "API Key 只能包含数字", "GitHub Pages 不支持 JSON"],
          answer: 1,
          explanation: "前端代码和网络请求对访问者可见；长期服务端密钥必须放在受控运行环境或 Secret 管理系统中。"
        },
        {
          prompt: "一个第三方服务声明“OpenAI-compatible”，最稳妥的理解是什么？",
          options: ["它就是 OpenAI 官方服务", "它一定支持 OpenAI 的所有端点和参数", "它实现了部分相似接口，具体兼容范围仍需查文档和测试", "它的模型一定完全开源且永久免费"],
          answer: 2,
          explanation: "兼容通常针对部分请求/响应形状；参数、工具、流式、错误格式和模型能力都可能不同。"
        },
        {
          prompt: "请求返回 401 时，第一优先级应该检查什么？",
          options: ["Prompt 写得够不够长", "API Key、Bearer Header 与权限", "向量数据库召回率", "temperature 是否太低"],
          answer: 1,
          explanation: "RFC 9110 中 401 表示缺少有效认证凭证；先检查鉴权层，而不是修改模型内容。"
        },
        {
          prompt: "遇到 429 或临时 5xx，合理的客户端策略是什么？",
          options: ["无限立即重试", "公开密钥让别人帮忙测试", "有限次数的指数退避，并尊重 Retry-After", "把 max_tokens 调到最大"],
          answer: 2,
          explanation: "有限退避能减少雪崩；重试还应有次数、总时长、幂等性和取消边界。"
        },
        {
          prompt: "HTTP 返回 200 能证明什么？",
          options: ["只能证明请求在协议层成功处理，业务结果仍需验证", "证明模型输出事实全部正确", "证明行程一定能执行", "证明密钥没有泄露"],
          answer: 0,
          explanation: "网络成功、响应可解析、任务完成、事实正确和安全合规是不同验收层。"
        },
        {
          prompt: "关于附件中写出的模型上下文长度、量化和免费政策，课程为什么没有直接当作事实发布？",
          options: ["这些概念没有意义", "任何内部文档都一定是假的", "缺少可引用的权威公开来源和独立运行验证，需要管理员与测试确认", "因为模型接口不能使用 JSON"],
          answer: 2,
          explanation: "来源分级与可复现实验是可靠课程的基础；无法独立核验的声明必须明确标注边界。"
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
    { id: "eval", zh: "评测", en: "Evaluation · Eval", definition: "用任务集、指标和判分标准系统地测量结果质量、过程、成本、延迟与风险。" },
    { id: "api", zh: "应用程序接口", en: "Application Programming Interface · API", definition: "软件组件之间约定的调用契约，规定可以请求什么、怎样请求以及怎样返回结果。" },
    { id: "http", zh: "超文本传输协议", en: "Hypertext Transfer Protocol · HTTP", definition: "Web 客户端与服务器交换请求和响应的应用层协议；方法、Header、状态码和内容共同表达语义。" },
    { id: "json", zh: "JSON", en: "JavaScript Object Notation · JSON", definition: "用对象、数组、字符串、数值、布尔值和 null 表示结构化数据的文本格式。" },
    { id: "base-url", zh: "基础地址", en: "Base URL", definition: "一组 API 端点共享的服务器地址前缀；客户端在其后拼接具体资源路径。" },
    { id: "endpoint", zh: "接口端点", en: "API Endpoint", definition: "由 HTTP 方法与 URL 路径共同确定的一项具体 API 能力，例如 POST /v1/chat/completions。" },
    { id: "api-key", zh: "API 密钥", en: "API Key / Bearer Token", definition: "用于识别调用方并授予配额或权限的凭证；必须按 Secret 管理，泄露后应立即撤销或轮换。" },
    { id: "notebook", zh: "计算笔记本", en: "Jupyter Notebook", definition: "把说明、代码、输出和实验记录组织在可逐单元执行的 .ipynb 文档中。" },
    { id: "rate-limit", zh: "速率限制", en: "Rate Limit", definition: "服务在一定时间、并发或配额范围内允许的请求量限制；超限常见状态码为 429。" },
    { id: "openai-compatible", zh: "OpenAI 风格兼容接口", en: "OpenAI-Compatible API", definition: "第三方服务实现了部分与 OpenAI API 相似的端点和数据形状；不代表官方服务或完整兼容。" }
  ],

  updates: [
    {
      date: "2026-07-23",
      version: "v0.3.0",
      title: "发布 Colab 模型 API 实验与完整课程细目",
      description: "新增第 2 课、可直接运行的供应商无关 Colab Notebook、密钥安全与接口兼容性审计；把 10 模块 51 课逐课展开，并为每个模块补充能力目标和阶段作品。"
    },
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
