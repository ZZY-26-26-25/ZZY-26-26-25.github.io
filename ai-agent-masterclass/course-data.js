(() => {
  "use strict";

  const lessons = Array.isArray(window.TheoryLessons) ? window.TheoryLessons : [];

  const moduleSpecs = [
    {
      id: "m00",
      order: 0,
      title: "进入智能体世界",
      short: "建立地图、目标、边界与共同语言",
      lessons: 2,
      outcome: "能准确区分 AI、机器学习、LLM、工作流与智能体，并理解目标、权限和成功标准为何必须先于技术选型。",
      project: "旅行规划智能体 v0：用它检验目标、工具、禁区、审批点和成功指标是否彼此一致。"
    },
    {
      id: "m01",
      order: 1,
      title: "数字系统与 LLM 基础",
      short: "计算环境、API、模型机制、Prompt 与结构",
      lessons: 7,
      outcome: "能解释程序如何连接模型、主流自回归 LLM 怎样生成，以及上下文、采样、Prompt、结构化输出和模型选择之间的关系。",
      project: "结构化旅行助手：从理论上定义输入、模型边界、输出契约和质量判断，不绑定某个供应商。"
    },
    {
      id: "m02",
      order: 2,
      title: "单智能体与工具调用",
      short: "Agent Loop、工具契约、执行控制与审批",
      lessons: 6,
      outcome: "能解释有限智能体循环、工具调用协议、参数与结果校验、副作用控制、多工具路由和人在回路。",
      project: "工具型旅行智能体：研究类动作可自主进行，高风险或有副作用的动作必须暂停并请求审批。"
    },
    {
      id: "m03",
      order: 3,
      title: "资料检索与 RAG",
      short: "搜索、证据、知识库、引用与检索评测",
      lessons: 6,
      outcome: "能把问题拆成可核验主张，理解从资料获取到混合检索、上下文组装、引用和分层评测的完整链条。",
      project: "目的地研究助手：社交平台只发现线索，开放状态、交通、安全和时效性结论由官方或一手来源确认。"
    },
    {
      id: "m04",
      order: 4,
      title: "状态、上下文与记忆管理",
      short: "工作状态、长期记忆、冲突、遗忘与隐私",
      lessons: 5,
      outcome: "能区分上下文、会话状态、任务状态和长期记忆，并说明选择、写入、检索、冲突、遗忘、同意与隔离机制。",
      project: "可治理旅行偏好记忆：预算、节奏、饮食和摄影偏好都有来源，可查看、修改、过期和删除。"
    },
    {
      id: "m05",
      order: 5,
      title: "规划、工作流与长任务",
      short: "任务分解、状态机、恢复、重规划与调度",
      lessons: 5,
      outcome: "能比较计划表示与编排模式，理解长任务为何需要检查点、幂等、补偿、取消、时间语义、重规划和人工接管。",
      project: "多日行程系统：在天气、停运、闭园或体力变化时保留有效部分，并比较可执行 Plan B。"
    },
    {
      id: "m06",
      order: 6,
      title: "多智能体与互操作",
      short: "Router、Supervisor、Handoff、MCP 与 A2A",
      lessons: 5,
      outcome: "能判断多智能体何时值得增加复杂度，并理解角色、通信、共享状态、责任、MCP 与 A2A 的准确边界。",
      project: "旅行规划团队：交通、天气、安全与摄影专家有清晰任务契约，由总规划器负责冲突仲裁和最终验收。"
    },
    {
      id: "m07",
      order: 7,
      title: "评测、可观测性与安全",
      short: "Evals、Tracing、注入防护、红队与事故响应",
      lessons: 6,
      outcome: "能从需求建立评测证据，分开测结果、轨迹、工具和检索，并理解日志隐私、威胁建模、最小权限和发布门禁。",
      project: "安全可靠版旅行智能体：用离线数据集、轨迹审计、攻击集和回归门禁证明质量与边界。"
    },
    {
      id: "m08",
      order: 8,
      title: "产品化与部署",
      short: "架构、交付、可靠性、成本与人机交互",
      lessons: 5,
      outcome: "能解释从原型到服务所需的系统边界、隔离、版本交付、可靠性、成本、人机交互、无障碍和合规治理。",
      project: "旅行智能体产品：账号与数据隔离、后台任务、可解释审批、服务目标和费用上限共同构成产品，而非只有聊天页面。"
    },
    {
      id: "m09",
      order: 9,
      title: "毕业综合项目",
      short: "需求、架构、验证、运营与价值证据",
      lessons: 4,
      outcome: "能把前九个模块串成一套完整的系统工程方法，并用需求、架构、评测、安全、运维与用户价值证据完成答辩。",
      project: "完整旅行规划智能体：从问题定义到长期运营，所有关键取舍都有记录、来源、责任人和可检验标准。"
    }
  ];

  const modules = moduleSpecs.map((module) => ({
    ...module,
    status: "theory",
    outline: lessons
      .filter((lesson) => lesson.module === module.id)
      .sort((a, b) => a.order - b.order)
      .map((lesson) => lesson.title)
  }));

  window.CourseData = {
    meta: {
      title: "AI 智能体大师课",
      subtitle: "从 AI 小白到能独立理解、设计、构建、评测和运营智能体",
      version: "0.4.0",
      updated: "2026-07-23",
      coreLessons: 51,
      publishedLessons: 51,
      phase: "theory-foundation",
      repository: "https://github.com/ZZY-26-26-25/ZZY-26-26-25.github.io/tree/master/ai-agent-masterclass"
    },

    methodology: {
      version: "1.0",
      title: "先把 51 课理论方法铺完整",
      summary: "课程当前冻结新增实践，先用统一结构讲清概念、机制、边界、权衡、误区、案例和来源；实践以后以 LAB 形式回接，不反过来决定知识顺序。",
      rationale: [
        "对于零基础学习者，过早进入 API、框架和 Notebook 容易形成“复制运行等于理解”的错觉。工具可以很快变化，但问题定义、系统边界、因果机制、风险控制和证据标准更稳定。",
        "理论并不等于只背名词。好的理论应该能预测系统在什么条件下成功、为什么失败、哪些能力不能由一个组件自动保证，以及面对新框架时怎样重新映射。"
      ],
      questions: [
        { title: "学习目的", description: "它解决什么问题？不理解会造成什么错误？" },
        { title: "核心定义", description: "它与相邻概念怎样区分？本课采用什么操作性范围？" },
        { title: "工作机制", description: "输入、处理、状态变化和输出之间怎样形成因果链？" },
        { title: "适用边界", description: "它能解决什么，又不能自动保证什么？" },
        { title: "关键权衡", description: "质量、成本、延迟、复杂度、隐私和风险怎样互相影响？" },
        { title: "常见误解", description: "哪些直觉看似合理，却会导致错误设计？" },
        { title: "案例映射", description: "这套理论怎样改变旅行规划智能体的一项真实决策？" },
        { title: "来源与自检", description: "主张来自哪里？学习者能否解释因果与边界？" }
      ],
      sourcePolicy: [
        { level: "一级：正式规范与法规", description: "国际/国家标准、协议规范、官方法规与政府或学术机构的正式文件。" },
        { level: "二级：原始研究", description: "原始论文、作者项目页、正式会议或期刊版本。" },
        { level: "三级：官方文档", description: "协议、框架、平台或模型提供方维护的官方说明。" },
        { level: "四级：公认教材", description: "用于补充解释，但不替代当前协议和产品事实的核验。" }
      ],
      sourceBoundary: "厂商宣传、排行榜、社交媒体和二手教程只能作为线索，不能单独支撑能力、价格、安全或效果声明。版本、价格、法律和产品能力属于时变信息，必须重新核验。",
      deferred: [
        "不新增需要写代码或安装依赖的核心课任务。",
        "不继续扩展 Colab、免费 API 或框架教程。",
        "不把某个模型、SDK、排行榜或供应商变成课程主线。",
        "不要求学习者暴露密钥、私有接口、个人旅行数据或模型私有思维过程。"
      ],
      electives: [
        "数学与 Transformer 深潜：线性代数、概率、优化、Attention 计算、位置编码与训练规模规律。",
        "开放权重与本地推理：GPU/显存、量化、推理运行时、模型卡和许可证。",
        "微调与蒸馏：SFT、LoRA/PEFT、偏好优化、数据集设计与独立评测。",
        "多模态、语音与实时智能体：视觉、OCR、语音中断、延迟和隐私。",
        "Browser/Computer Use、代码与数据智能体：沙箱、凭据隔离、供应链和高影响动作审批。",
        "高级检索：GraphRAG、知识图谱、多模态检索和增量索引。",
        "按部署地区展开的隐私、消费者权益、平台条款、旅游和支付合规。"
      ],
      practiceReturn: "理论稳定后，每课依次加入手工模拟、最小实验、故障注入、结果评测和旅行智能体增量。GitHub 网站承担教材主线，Colab 等平台只承担可替换的实验环境。"
    },

    modules,
    lessons,

    quizzes: {
      "q-m00-l00": { archived: true, passingScore: 67, questions: [] },
      "q-m00-l01": { archived: true, passingScore: 80, questions: [] },
      "q-m01-l00": { archived: true, passingScore: 80, questions: [] }
    },

    glossary: [
      { id: "ai", zh: "人工智能", en: "Artificial Intelligence · AI", definition: "研究和构建能够完成感知、预测、决策、生成等任务的系统的广泛领域；它不是单一算法。" },
      { id: "ml", zh: "机器学习", en: "Machine Learning · ML", definition: "让系统通过数据和目标函数学习模式或决策规则的一类方法。" },
      { id: "dl", zh: "深度学习", en: "Deep Learning · DL", definition: "使用多层神经网络学习表示和映射的机器学习方法家族。" },
      { id: "llm", zh: "大语言模型", en: "Large Language Model · LLM", definition: "在大规模序列数据上训练、能依据上下文对语言及其他序列进行条件建模和生成的模型类别。" },
      { id: "agent", zh: "AI 智能体", en: "AI Agent", definition: "本课程指在一个或多个受控回合中，依据目标、状态和新观察选择动作，并受工具、权限、停止条件与验证机制约束的软件系统。" },
      { id: "workflow", zh: "工作流", en: "Workflow", definition: "执行路径主要由程序预先规定的多步骤流程；模型可以参与节点，但不自由决定整个控制流。" },
      { id: "agent-loop", zh: "智能体循环", en: "Agent Loop", definition: "读取目标与状态、选择动作、执行、观察、更新和判断继续或结束的受控循环。" },
      { id: "agent-charter", zh: "智能体契约", en: "Agent Charter", definition: "本课程用于记录目标、范围、工具、禁止项、审批点、数据规则、停止条件和成功指标的设计文档。" },
      { id: "token", zh: "Token", en: "Token", definition: "模型处理序列时使用的离散单位；它不总等于一个汉字、音节或完整英文单词。" },
      { id: "embedding", zh: "向量表示", en: "Embedding", definition: "把离散对象映射为连续向量，使某些关系能够通过几何或统计运算处理。" },
      { id: "transformer", zh: "Transformer", en: "Transformer", definition: "以注意力机制为核心构件的神经网络架构家族，是许多当代主流 LLM 的基础。" },
      { id: "inference", zh: "推理", en: "Inference", definition: "使用已经训练好的参数，根据新输入计算预测或生成输出的过程；不等于训练。" },
      { id: "context", zh: "上下文", en: "Context", definition: "一次模型调用可见的指令、对话、资料与工具结果，是有限工作区而不是永久记忆。" },
      { id: "prompt", zh: "提示与输入规格", en: "Prompt", definition: "提供给模型的目标、背景、约束、示例和输出要求；可靠系统还必须依赖代码、权限和验证。" },
      { id: "api", zh: "应用程序接口", en: "Application Programming Interface · API", definition: "软件组件之间约定的调用契约，定义可请求的能力、输入、输出和错误。" },
      { id: "http", zh: "超文本传输协议", en: "Hypertext Transfer Protocol · HTTP", definition: "Web 客户端与服务器交换请求和响应的应用层协议。" },
      { id: "json", zh: "JSON", en: "JavaScript Object Notation · JSON", definition: "使用对象、数组、字符串、数值、布尔值和 null 表示结构化数据的文本格式。" },
      { id: "schema", zh: "数据模式", en: "Schema", definition: "描述数据允许的字段、类型、约束和组合规则的机器可检查契约。" },
      { id: "tool", zh: "工具", en: "Tool", definition: "智能体获取外部信息或执行动作的受控接口；能访问不等于获准执行所有操作。" },
      { id: "idempotency", zh: "幂等性", en: "Idempotency", definition: "同一操作重复执行时，外部可观察结果与执行一次相同或可安全判定的性质。" },
      { id: "rag", zh: "检索增强生成", en: "Retrieval-Augmented Generation · RAG", definition: "先从外部知识源检索证据，再把选定证据提供给生成模型的系统方法。" },
      { id: "chunking", zh: "切块", en: "Chunking", definition: "将文档划分为可检索单位的过程；边界、长度和重叠会影响召回与上下文完整性。" },
      { id: "bm25", zh: "BM25", en: "Best Matching 25 · BM25", definition: "基于词项频率、逆文档频率和长度归一化的经典稀疏检索排序函数。" },
      { id: "reranking", zh: "重排序", en: "Reranking", definition: "对初步召回的候选使用更精细模型或规则重新排列，以提高前列结果相关性。" },
      { id: "provenance", zh: "来源追溯", en: "Provenance", definition: "记录信息、数据或产物来自何处、经历了什么处理、适用于何时的可追溯关系。" },
      { id: "task-state", zh: "任务状态", en: "Task State", definition: "描述任务当前进度、已完成步骤、约束、未决问题和下一步所需信息的数据。" },
      { id: "memory", zh: "智能体记忆", en: "Agent Memory", definition: "经选择、结构化和治理后，可供后续任务读取的事件、事实、偏好或程序信息。" },
      { id: "memory-scope", zh: "记忆适用范围", en: "Memory Scope", definition: "一条记忆可在哪些任务、领域、时间段或用户情境中使用；它不同于授权令牌的权限集合。" },
      { id: "data-subject", zh: "数据主体", en: "Data Subject", definition: "一条记录或记忆所描述的人；数据主体不一定是当前发起读取或修改的调用者。" },
      { id: "checkpoint", zh: "检查点", en: "Checkpoint", definition: "持久化保存足够的执行状态，使任务在暂停或失败后能够从已知位置恢复。" },
      { id: "materialized-view", zh: "物化视图", en: "Materialized View", definition: "把事件或源数据预先投影成便于查询的派生状态；它需要明确刷新、重建和一致性规则。" },
      { id: "outbox", zh: "事务发件箱", en: "Transactional Outbox", definition: "把业务状态变化与待发送事件写入同一事务，再由独立发布器投递，以减少数据库已提交但消息丢失的窗口。" },
      { id: "state-machine", zh: "状态机", en: "State Machine", definition: "用有限状态及其转换条件表示系统控制逻辑的模型。" },
      { id: "dag", zh: "有向无环图", en: "Directed Acyclic Graph · DAG", definition: "由有方向且不存在闭环的边连接节点，常用于表达任务依赖。" },
      { id: "compensation", zh: "补偿操作", en: "Compensating Action", definition: "当分布式流程无法简单回滚时，用新的业务动作抵消或修正既有副作用。" },
      { id: "durable-execution", zh: "耐久执行", en: "Durable Execution", definition: "通过持久状态、事件历史和可恢复控制流，使长任务跨故障和等待继续运行。" },
      { id: "visibility-timeout", zh: "可见性超时", en: "Visibility Timeout", definition: "消息被消费者领取后暂时对其他消费者隐藏的期限；未确认完成时，消息可能在期限后再次可见。" },
      { id: "dead-letter", zh: "死信", en: "Dead Letter", definition: "多次处理失败或无法按当前契约消费后被隔离的消息，供调查、修复或受控重放。" },
      { id: "router", zh: "路由器", en: "Router", definition: "依据输入特征或规则把任务分配给不同模型、工具、流程或智能体的组件。" },
      { id: "supervisor", zh: "监督者模式", en: "Supervisor Pattern", definition: "由一个协调者分解、分派、汇总并负责终止的多智能体组织方式。" },
      { id: "handoff", zh: "任务移交", en: "Handoff", definition: "把任务责任和必要上下文从一个智能体显式转交给另一个智能体。" },
      { id: "mcp", zh: "模型上下文协议", en: "Model Context Protocol · MCP", definition: "标准化 AI 应用与外部工具、资源及提示之间连接方式的开放协议。" },
      { id: "a2a", zh: "智能体到智能体协议", en: "Agent2Agent · A2A", definition: "面向独立智能体之间发现能力、交换消息、管理任务和产物的互操作协议。" },
      { id: "eval", zh: "评测", en: "Evaluation · Eval", definition: "用任务集、判分标准和统计方法测量结果、过程、成本、延迟与风险。" },
      { id: "rubric", zh: "评分量规", en: "Rubric", definition: "把抽象质量要求拆成可判断维度、等级和证据规则的评分说明。" },
      { id: "trace", zh: "执行轨迹", en: "Trace", definition: "按因果和时间关系记录一次请求中模型、工具、检索、状态与服务步骤的可观察数据。" },
      { id: "span-link", zh: "Span Link", en: "Span Link", definition: "在分布式追踪中，把当前 Span 与另一个不适合作父子关系的 Span 上下文建立关联，常用于长时间异步或批处理因果关系。" },
      { id: "replay", zh: "重放", en: "Replay", definition: "需结合语境判断：可指用事件历史重建状态、攻击者重复旧消息，或在沙箱中重建执行轨迹；三者的目的和控制不同。" },
      { id: "threat-model", zh: "威胁建模", en: "Threat Modeling", definition: "系统识别资产、攻击者、信任边界、滥用途径、影响和缓解措施的过程。" },
      { id: "prompt-injection", zh: "提示注入", en: "Prompt Injection", definition: "不可信输入诱导模型偏离预期指令或触发非预期行为的攻击与失效类型。" },
      { id: "least-privilege", zh: "最小权限", en: "Principle of Least Privilege", definition: "只授予完成当前任务所需的最小能力、范围和持续时间。" },
      { id: "sandbox", zh: "沙箱", en: "Sandbox", definition: "通过隔离资源、权限和副作用范围来限制不受信任代码或操作影响的执行环境。" },
      { id: "sli", zh: "服务级别指标", en: "Service Level Indicator · SLI", definition: "从用户视角量化服务行为的指标，例如成功率、延迟或新鲜度。" },
      { id: "slo", zh: "服务级别目标", en: "Service Level Objective · SLO", definition: "针对一个 SLI 设定的目标值或范围，用于权衡可靠性与迭代速度。" },
      { id: "error-budget", zh: "错误预算", en: "Error Budget", definition: "由 SLO 允许的不可靠程度，可用于决定继续发布功能还是优先修复可靠性。" },
      { id: "rollback", zh: "回滚", en: "Rollback", definition: "在新版本不满足标准时恢复到已知可接受版本或状态的发布能力。" },
      { id: "multi-tenancy", zh: "多租户", en: "Multi-tenancy", definition: "多个用户或组织共享基础设施，但身份、数据、配额和权限保持逻辑隔离的架构。" },
      { id: "tenant", zh: "租户", en: "Tenant", definition: "共享系统中拥有独立身份、数据、策略、配额或计费边界的用户组织或逻辑客户空间。" },
      { id: "subject", zh: "调用主体", en: "Caller / Security Principal", definition: "发起请求或被授权执行动作的人、服务或工作负载；身份认证只确认主体，仍需对具体资源和动作授权。" },
      { id: "auth-scope", zh: "授权范围", en: "Authorization Scope", definition: "令牌或授权决定允许执行的一组权限；它必须与受众、调用主体、资源和期限一起校验。" },
      { id: "human-in-loop", zh: "人在回路", en: "Human in the Loop · HITL", definition: "人在关键节点提供输入、审批、纠错、接管或最终责任判断的控制设计。" },
      { id: "adr", zh: "架构决策记录", en: "Architecture Decision Record · ADR", definition: "记录重要技术决策的背景、候选方案、选择理由、后果和复审条件的短文档。" }
    ],

    updates: [
      {
        date: "2026-07-23",
        version: "v0.4.0",
        title: "51 节理论主干完整开放",
        description: "冻结新增实践，按统一理论标准补齐全部 10 模块 51 课；新增课程方法、逐课先修、机制与边界、误区纠正、旅行案例、理论自检、来源库和全文搜索。现有 Notebook 保留为后续实践资产。"
      },
      {
        date: "2026-07-23",
        version: "v0.3.0",
        title: "发布 Colab 模型 API 实验与完整课程细目",
        description: "新增供应商无关 Colab Notebook、密钥安全与接口兼容性审计，并把 10 模块 51 课在路线图中逐课展开。"
      },
      {
        date: "2026-07-22",
        version: "v0.2.1",
        title: "补齐旅行工具搜索索引",
        description: "让 12306、航旅纵横、高德地图、星空摄影、小红书、抖音等旅行工具与场景词可以检索到对应课程。"
      },
      {
        date: "2026-07-22",
        version: "v0.2.0",
        title: "贯穿项目切换为旅行规划智能体",
        description: "同步更新主项目、Agent Charter、课程场景、搜索关键词和安全审批边界，并保留原有学习进度。"
      },
      {
        date: "2026-07-22",
        version: "v0.1.0",
        title: "项目启动",
        description: "建立 10 模块、51 节核心课路线，以及本地学习进度、搜索、术语、小测和 Agent Charter。"
      }
    ]
  };
})();
