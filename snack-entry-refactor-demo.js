const columns = [
  ['backlog', '待规划'],
  ['in_progress', '进行中'],
  ['review', '审核中'],
  ['done', '已完成'],
  ['blocked', '已阻塞'],
];

const stateLabels = {
  backlog: '待规划',
  in_progress: '进行中',
  review: '审核中',
  done: '已完成',
  blocked: '已阻塞',
};

const meetingSetupStorageKey = 'snack_meeting_setup_completed_projects_v1';
const snackRecordConfigStorageKey = 'snack_record_config_v1';
const snackRecordDetectionDelay = 900;
let snackRecordDetectionSerial = 0;

const snackRecordDefaultConfig = {
  language: 'zh',
  mode: 'fast',
  autoMeetingReminder: false,
  shortcut: 'Control+R',
  outputDirectory: '~/Desktop/Snack Recordings',
  organizeByDate: true,
};

function loadMeetingSetupCompletedProjects() {
  try {
    const value = JSON.parse(window.localStorage.getItem(meetingSetupStorageKey) || '[]');
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
  } catch (error) {
    return [];
  }
}

function loadSnackRecordConfig() {
  try {
    const value = JSON.parse(window.localStorage.getItem(snackRecordConfigStorageKey) || 'null');
    if (!value || value.configured !== true || typeof value.config !== 'object') return null;
    return {
      configured: true,
      config: { ...snackRecordDefaultConfig, ...value.config },
    };
  } catch (error) {
    return null;
  }
}

function saveSnackRecordConfig() {
  try {
    window.localStorage.setItem(snackRecordConfigStorageKey, JSON.stringify({
      configured: true,
      config: state.snackRecordConfig,
    }));
  } catch (error) {
    // Local persistence is helpful for the demo but should never block the flow.
  }
}

const savedSnackRecordConfig = loadSnackRecordConfig();

const state = {
  view: 'tasks',
  taskTab: 'projects',
  activeProject: 'snack-product-iteration',
  meetingReturnView: 'tasks',
  activeSession: null,
  activeIssue: null,
  activeIssueTab: null,
  openIssueTabs: [],
  activeTodoIssue: null,
  activeLooseSession: null,
  agentTab: 'square',
  resourceTab: 'all',
  selectedAgent: 'Snack',
  agentMenuOpen: false,
  logDocIssue: null,
  draftSerial: 1,
  projectSerial: 1,
  boardSidebarOpen: false,
  projectDetailOpen: true,
  memberSidebarOpen: false,
  memberPanelTab: 'members',
  memberManagerOpen: false,
  memberManagerQuery: '',
  agentStatusOpen: false,
  collapsedProjects: [],
  expandedSessionLists: [],
  taskFilterOpen: false,
  renamingProjectId: null,
  openProjectMenuId: null,
  openProjectCreateMenuId: null,
  selectedModel: 'snack-5-5-ultra',
  modelPickerOpen: false,
  composerProjectId: 'snack-product-iteration',
  projectPickerOpen: false,
  projectPickerQuery: '',
  projectCreationOpen: false,
  projectCreationMembers: [],
  projectCreationFolders: [],
  projectCreationWikiTopics: [],
  projectWikiTopicPickerOpen: false,
  projectMemberQuery: '',
  projectMemberPickerOpen: false,
  projectEditingId: null,
  issueCreationOpen: false,
  issueCreationProjectId: null,
  issueSerial: 1,
  editingConfirmationIssue: null,
  projectChatDraftProjectId: null,
  projectChatDraft: '',
  meetingWeekOffset: 0,
  meetingAgendaDate: '2026-07-31',
  selectedMeetingId: null,
  meetingModalId: null,
  meetingNoticeOpen: false,
  meetingPermissionOpen: false,
  meetingEndConfirmOpen: false,
  meetingRecorderHidden: false,
  meetingTranscriptOpen: false,
  meetingShareOpen: false,
  meetingActionReviewOpen: false,
  meetingTranscriptTime: 0,
  recordingSeconds: 0,
  recordingCaptureMode: 'system_and_mic',
  snackRecordInstalled: Boolean(savedSnackRecordConfig),
  snackRecordConfigured: Boolean(savedSnackRecordConfig?.configured),
  snackRecordSetupOpen: false,
  snackRecordSetupPhase: 'idle',
  snackRecordNativeOpen: false,
  snackRecordNativeMaximized: false,
  snackRecordActive: false,
  snackRecordSeconds: 0,
  snackRecordQuery: '',
  snackRecordSelection: [],
  snackRecordDeleteIds: [],
  snackRecordTranscriptId: null,
  snackRecordSummaryId: null,
  snackRecordSummaryProjectId: null,
  snackRecordSummaryStatus: 'ready',
  snackRecordFollowupStep: 0,
  snackRecordFollowupAnswers: {},
  snackRecordProjectDetailOpen: false,
  snackRecordFollowupProjectName: 'AI 营销增长系统',
  snackRecordFollowupContexts: [],
  snackRecordContextPickerOpen: false,
  snackRecordFollowupMembers: [],
  snackRecordMemberQuery: '',
  snackRecordMemberPickerOpen: false,
  snackRecordResourceStatus: savedSnackRecordConfig ? 'complete' : 'unknown',
  snackRecordSetupReturnView: 'apps',
  snackRecordConfig: { ...(savedSnackRecordConfig?.config || snackRecordDefaultConfig) },
  snackRecordConfigDraft: { ...(savedSnackRecordConfig?.config || snackRecordDefaultConfig) },
  meetingSetupCompletedProjects: loadMeetingSetupCompletedProjects(),
  meetingSetupDrafts: {},
  demoDevice: 'desktop',
  draggedConversation: null,
};

const currentUserName = '田晓柔';

const projectWikiTopicOptions = [
  {
    name: '即服务',
    description: '服务方案、客户交付与支持资料',
  },
  {
    name: '平台业务',
    description: '平台规划、运营规则与业务资料',
  },
];

const snackRecordCloudContextOptions = [
  {
    id: 'growth-experiment-wiki',
    name: '增长实验 Wiki',
    path: '云端 / 增长实验',
    kind: 'cloud',
  },
  {
    id: 'growth-onboarding',
    name: 'Growth / Onboarding',
    path: '云端 / Growth / Onboarding',
    kind: 'cloud',
  },
  {
    id: 'user-research',
    name: '新用户研究',
    path: '云端 / 用户研究 / 新用户',
    kind: 'cloud',
  },
];

const snackRecordTaskCandidates = [
  {
    code: 'REC-001',
    title: '完成 onboarding 引导稿',
    owner: '陆铭',
    dueDate: '2026-08-05',
    dueLabel: '周三',
    evidenceTime: '00:08:42',
    desc: '完成新版 onboarding 引导稿，并准备 20% 流量实验所需的产品文案与页面说明。',
  },
  {
    code: 'REC-002',
    title: '补齐激活率数据口径',
    owner: '林可',
    dueDate: '2026-08-06',
    dueLabel: '周四',
    evidenceTime: '00:16:18',
    desc: '补齐激活率统计口径与历史基线，为 onboarding 实验建立可对比的数据基准。',
  },
  {
    code: 'REC-003',
    title: '复盘转化与次日留存',
    owner: '田晓柔',
    dueDate: '2026-08-07',
    dueLabel: '周五',
    evidenceTime: '00:27:36',
    desc: '复盘新版 onboarding 的实验转化与新用户次日留存，形成下一轮优化结论。',
  },
];

const agents = [
  {
    name: 'Snack',
    desc: '通用项目 Agent，负责理解上下文、生成任务、推进节点和回答项目进展。',
    last: '项目内默认可问',
  },
  {
    name: '投放监控 Agent',
    desc: '通过各平台 MCP 拉取投放数据，识别异常、归因并给出策略建议。',
    last: '适合存量投放盯盘',
  },
  {
    name: '研发交付 Agent',
    desc: '承接 PRD、HTML 原型、技术方案、代码实现、测试和上线验收。',
    last: '适合研发工作流',
  },
];

const modelOptions = [
  {
    id: 'snack-5-5-ultra',
    label: '5.5 超高',
    desc: '更强推理，适合复杂项目拆解',
  },
  {
    id: 'snack-5-5-standard',
    label: '5.5 标准',
    desc: '平衡速度和质量',
  },
  {
    id: 'deepseek-v4-pro',
    label: 'DeepSeek V4 Pro',
    desc: '适合长文本分析和检索',
  },
];

const monitoringMetricOptions = {
  private_domain: [
    ['企微新增人数', '人'],
    ['入群人数', '人'],
    ['私聊触达人数', '人'],
    ['注册率', '%'],
    ['激活率', '%'],
    ['私聊转化率', '%'],
  ],
  paid_media: [
    ['入驻人数', '人'],
    ['注册率', '%'],
    ['线索成本', '元'],
    ['消耗金额', '元'],
    ['点击率', '%'],
    ['转化率', '%'],
  ],
};

const monitoringTypeLabels = {
  private_domain: '私域运营',
  paid_media: '投放运营',
};

const monitoringOperatorOptions = [
  ['≥', '≥ 不低于'],
  ['≤', '≤ 不高于'],
  ['=', '= 等于'],
  ['>', '> 高于'],
  ['<', '< 低于'],
];

const monitoringMetricAliases = [
  { metric: '私聊转化率', aliases: ['私聊转化率', '私聊成交率'] },
  { metric: '企微新增人数', aliases: ['企微新增人数', '企微新增', '新增企微', '加微人数'] },
  { metric: '私聊触达人数', aliases: ['私聊触达人数', '私聊触达', '触达人数'] },
  { metric: '入群人数', aliases: ['入群人数', '入群量', '进群人数'] },
  { metric: '入驻人数', aliases: ['入驻人数', '入驻量', '商家入驻'] },
  { metric: '线索成本', aliases: ['线索成本', '获客成本', 'cpl'] },
  { metric: '消耗金额', aliases: ['消耗金额', '广告消耗', '投放消耗', '消耗'] },
  { metric: '点击率', aliases: ['点击率', 'ctr'] },
  { metric: '注册率', aliases: ['注册率'] },
  { metric: '激活率', aliases: ['激活率'] },
  { metric: '转化率', aliases: ['转化率'] },
];

const projectFolders = [
  {
    id: 'snack-product-iteration',
    title: 'Snack 产品迭代',
    summary: '产品周会、版本评审与跨团队协作',
    scenario: '产品研发',
    updated: '现在',
    createdAt: 4,
    participating: true,
    objective: '让产品周会的会前准备、会议结论和会后任务形成可追溯的项目闭环。',
    health: '需关注',
    agents: ['Snack', '产品设计 Agent', '研发交付 Agent'],
    members: ['田晓柔', '产品设计 Agent', '前端工程师-小贝', 'QA-小林'],
    rememberedPeople: [
      ['前端工程师-小贝', '前端实现、技术评估与版本交付'],
      ['QA-小林', '测试计划、验收证据与风险反馈'],
      ['产品设计 Agent', '交互方案、原型与产品资料整理'],
    ],
    pushRule: '产品周会提前 1 小时生成会前简报；行动项经管理者确认后进入 Task Hub。',
    operatingRules: [
      ['会前准备', '汇总项目任务、群聊和上次会议遗留事项。'],
      ['会议录音', '到点提醒，由参会者确认同意后开始记录。'],
      ['纪要生成', '会议结束后自动转写并进入 Snack 会话。'],
      ['任务回写', '行动项需确认负责人和截止时间后才创建任务。'],
    ],
    taskCodes: [],
    sessions: [],
    groupMessages: [],
  },
];

const issues = [
  {
    code: 'ADS-001',
    title: '线索成本异常监控与策略调整',
    projectId: 'ads-crane-july',
    status: 'in_progress',
    issueType: '工作任务',
    owner: '投放监控 Agent',
    reviewer: '田晓柔',
    priority: 'P0',
    stage: '人工确认',
    tag: 'AI投放',
    desc: '通过平台 MCP 持续监控吊车投放盘面，发现成本异常后完成归因、策略建议、人工确认和执行调整。',
    count: '4/6',
    predecessor: null,
    relatedTasks: ['ADS-002', 'ADS-003'],
    source: '项目群聊 / 定时监控',
    nodes: [
      { title: 'MCP 拉数', state: 'done', detail: '巨量、快手、广点通近 7/14/30 天消耗、线索和素材数据已读取。' },
      { title: '异常识别', state: 'done', detail: '快手吊车计划线索成本较 7 日均值上升 28%，素材 CTR 连续 3 天下滑。' },
      { title: '归因分析', state: 'done', detail: '主要原因指向素材衰退和预算节奏偏快，落地页转化暂无明显异常。' },
      { title: '策略建议', state: 'done', detail: '建议方案一：降低快手高成本计划预算 20%，同步替换两组衰退素材。' },
      { title: '人工确认', state: 'active', detail: '已向田晓柔发起确认；确认后进入执行，需要修改则由投放监控 Agent 重新分析。' },
      { title: '执行调整', state: 'waiting', detail: '确认后有写权限则 MCP 执行；无写权限则生成投手操作清单。' },
    ],
    confirmation: {
      status: 'pending',
      version: 1,
      assignee: '田晓柔',
      requestedBy: '投放监控 Agent',
      requestedAt: '10:12',
      updatedAt: '10:12',
      title: '确认执行快手投放调整方案',
      summary: '异常定位与执行建议已完成，只有收到人工确认后才会进入执行节点。',
      signals: ['CPL 较 7 日均值 +28%', '素材 CTR 连续 3 天下滑'],
      plan: [
        ['调整预算', '快手高成本计划日预算下调 20%'],
        ['替换素材', '替换两组点击率连续下滑的衰退素材'],
        ['效果复核', '执行后创建 24 小时效果观察窗口'],
      ],
      revisionReason: '',
      confirmedBy: '',
      confirmedAt: '',
    },
    evidence: [
      '快手吊车计划 CPL 较 7 日均值 +28%',
      '素材 A/B 点击率连续 3 天下滑',
      '巨量账户同周期 CPL 稳定，排除全局线索质量波动',
    ],
    artifacts: ['异常摘要卡', '归因链路', '策略建议 3 选 1'],
    activity: [
      ['投放监控 Agent', '通过 MCP 完成三平台数据读取。', '10:02'],
      ['数据归因 Agent', '初步归因为素材衰退叠加预算节奏偏快。', '10:08'],
      ['Snack', '@田晓柔 请确认是否按方案一执行。', '10:12'],
    ],
    comments: [
      ['田晓柔', '不要自动执行投放动作，需要负责人确认。', '10:14'],
    ],
    logs: ['MCP: kuaishou.ads.report.read 成功', 'MCP: oceanengine.campaign.read 成功', '写操作待人工确认'],
  },
  {
    code: 'ADS-002',
    title: '调整效果观察与复盘沉淀',
    projectId: 'ads-crane-july',
    status: 'backlog',
    issueType: '关联后续',
    owner: '数据归因 Agent',
    reviewer: '田晓柔',
    priority: 'P1',
    stage: '等待前序',
    tag: '复盘',
    desc: '在 ADS-001 完成策略调整后启动观察窗口，对比调整前后效果，并沉淀为项目经验。',
    count: '0/4',
    predecessor: 'ADS-001',
    relatedTasks: ['ADS-001'],
    source: 'ADS-001 关联生成',
    nodes: [
      { title: '等待前序任务完成', state: 'active', detail: 'ADS-001 执行调整完成后自动启动。' },
      { title: '设置观察窗口', state: 'waiting', detail: '默认 24 小时初判，3 天复盘。' },
      { title: '自动对比数据', state: 'waiting', detail: '继续通过 MCP 拉数，对比 CPL、线索量、素材 CTR。' },
      { title: '复盘沉淀', state: 'waiting', detail: '有效策略写入项目知识和下次异常建议。' },
    ],
    evidence: ['关联任务 ADS-001 尚未完成'],
    artifacts: ['观察窗口', '效果对比表', '复盘结论'],
    activity: [['Snack', '已作为 ADS-001 的后续关联任务创建，避免多个任务长期处于执行中。', '10:16']],
    nodeActivity: [
      [
        ['Snack', '已作为 ADS-001 的后续关联任务创建，避免多个任务长期处于执行中。', '10:16'],
        ['数据归因 Agent', '当前停在节点 1，等待 ADS-001 执行调整完成后再启动观察窗口。', '10:17'],
      ],
      [],
      [],
      [],
    ],
    comments: [],
    logs: ['等待 ADS-001 done 后启动'],
  },
  {
    code: 'ADS-003',
    title: '素材替换与落地页信息校验',
    projectId: 'ads-crane-july',
    status: 'review',
    issueType: '关联并行',
    owner: '素材负责人-小雨',
    reviewer: '投放负责人-阿七',
    priority: 'P1',
    stage: '素材确认',
    tag: '素材',
    desc: '并行检查衰退素材、替换文案和落地页关键信息，给 ADS-001 的策略执行提供素材准备。',
    count: '3/4',
    predecessor: null,
    relatedTasks: ['ADS-001'],
    source: 'ADS-001 异常归因关联',
    nodes: [
      { title: '识别衰退素材', state: 'done', detail: '素材 A/B 连续 3 天 CTR 下滑。' },
      { title: '准备替换素材', state: 'done', detail: '已准备两组吊车找活文案和一组落地页截图。' },
      { title: '落地页信息校验', state: 'done', detail: '电话、区域、表单字段均正常。' },
      { title: '负责人审核', state: 'active', detail: '等待阿七确认替换顺序。' },
    ],
    evidence: ['素材 CTR 下滑曲线', '落地页表单校验截图'],
    artifacts: ['替换素材清单', '落地页校验记录'],
    activity: [['素材负责人-小雨', '替换素材已准备，等待投放负责人确认排序。', '10:28']],
    comments: [
      ['素材负责人-小雨', '@田晓柔 素材替换清单已准备，等阿七确认替换顺序。', '现在'],
      ['投放负责人-阿七', '优先上“找活需求”这组。', '10:32'],
    ],
    logs: ['素材库已关联 2 个候选'],
  },
  {
    code: 'DEV-100',
    title: '订单详情页库存不足提示研发交付',
    projectId: 'dev-stock-warning',
    status: 'in_progress',
    issueType: '研发任务',
    owner: '研发交付 Agent',
    reviewer: '田晓柔',
    priority: 'P0',
    stage: '技术方案',
    tag: '研发',
    desc: '基于项目聊天中的脑暴结果，推进 PRD、HTML 原型、技术方案、代码实现、测试执行和审核上线。',
    count: '3/7',
    predecessor: null,
    relatedTasks: ['DEV-101'],
    source: '项目聊天 / 产品脑暴',
    nodes: [
      { title: '项目创建', state: 'done', detail: '用户一句话创建项目，Snack 进入项目聊天。' },
      { title: '产品脑暴', state: 'done', detail: '已确认库存不足、预售、部分发货三个场景。' },
      { title: 'PRD 与 HTML 原型', state: 'done', detail: '已生成 PRD、BDD 和 HTML 原型草稿。' },
      { title: '技术方案', state: 'active', detail: '正在确认库存字段兼容老订单的方案。' },
      { title: '代码实现', state: 'waiting', detail: '技术方案 review 通过后启动。' },
      { title: '测试执行', state: 'waiting', detail: 'QA 执行 E2E，并输出证据摘要。' },
      { title: '审核上线', state: 'waiting', detail: '所有阶段完成后父任务进入 review。' },
    ],
    evidence: ['PRD v0.2', 'HTML 原型 v0.1', 'BDD 验收规则'],
    artifacts: ['PRD', 'HTML 原型', '技术方案草稿'],
    activity: [
      ['Snack', '已从项目聊天整理 PRD 和 HTML 原型。', '11:18'],
      ['研发交付 Agent', '技术方案已生成，等待库存字段兼容确认。', '13:30'],
      ['Snack', '@田晓柔 请确认老订单是否需要展示“库存待确认”。', '13:40'],
    ],
    comments: [['田晓柔', '老订单不要强提示，先用弱提示并保留客服入口。', '13:45']],
    logs: ['PRD 生成完成', 'HTML 原型生成完成', '技术方案 review 中'],
  },
  {
    code: 'DEV-101',
    title: '库存提示 HTML 原型微调',
    projectId: 'dev-stock-warning',
    status: 'done',
    issueType: '关联并行',
    owner: '产品设计 Agent',
    reviewer: '田晓柔',
    priority: 'P1',
    stage: '原型确认',
    tag: '原型',
    desc: '根据项目聊天里的自然语言反馈，直接更新 HTML 原型文案和边界状态。',
    count: '4/4',
    predecessor: null,
    relatedTasks: ['DEV-100'],
    source: 'DEV-100 产物反馈',
    nodes: [
      { title: '接收反馈', state: 'done', detail: '用户在项目聊天里说“文案更明确，补老订单兼容场景”。' },
      { title: '更新原型', state: 'done', detail: '已更新按钮文案、弱提示和部分发货状态。' },
      { title: '预览确认', state: 'done', detail: '用户确认可进入研发。' },
      { title: '关联研发任务', state: 'done', detail: '已关联 DEV-100。' },
    ],
    evidence: ['HTML 原型 v0.2', '文案修改记录'],
    artifacts: ['HTML 原型'],
    activity: [['产品设计 Agent', 'HTML 原型已更新并关联到 DEV-100。', '12:10']],
    comments: [],
    logs: ['原型更新完成'],
  },
  {
    code: 'SNK-201',
    title: '项目文件夹与任务详情体验重构',
    projectId: 'task-hub-refactor',
    status: 'review',
    issueType: '产品任务',
    owner: '前端工程师 Agent',
    reviewer: '田晓柔',
    priority: 'P0',
    stage: '高保真评审',
    tag: 'Task Hub',
    desc: '把入口重构 demo 调整为项目文件夹、同一套状态看板、任务节点详情和项目群聊问 Snack 的体验。',
    count: '5/6',
    predecessor: null,
    relatedTasks: [],
    source: '项目群聊',
    nodes: [
      { title: '上下文梳理', state: 'done', detail: '已对齐投放、研发、Multica 状态机和项目创建流程。' },
      { title: '信息架构', state: 'done', detail: '项目文件夹 + Task Hub 固定状态 + 任务详情节点。' },
      { title: '高保真页面', state: 'active', detail: '等待最终视觉和浏览器验证。' },
      { title: '统一 review', state: 'waiting', detail: '验证投放和研发两个场景。' },
    ],
    evidence: ['需求讨论记录', 'Multica 只读参考'],
    artifacts: ['静态 demo'],
    activity: [['Snack', '方案已收敛为一个看板服务管理者和执行者。', '昨天']],
    comments: [],
    logs: ['等待浏览器验证'],
  },
];

const looseSessions = [];

const resources = [
  { type: 'skill', title: '投放异常归因', desc: '读取平台 MCP 数据，生成异常摘要、原因链路和策略建议。' },
  { type: 'skill', title: '研发规范整理', desc: '把项目聊天沉淀成 PRD、BDD、HTML 原型和研发交付任务。' },
  { type: 'tool', title: '投放平台 MCP', desc: '读取巨量、快手、广点通等平台账户、计划、素材和线索数据。' },
  { type: 'tool', title: '项目群聊推送', desc: '把定时监控结果、任务 review 和人工确认点同步到项目群。' },
  { type: 'knowledge', title: 'Task Hub 状态机', desc: 'backlog / in_progress / review / done / blocked 固定状态。' },
  { type: 'knowledge', title: 'Multica Issue 详情参考', desc: '任务正文、动态评论、属性、执行日志和 Agent 会话的组合结构。' },
];

const apps = [
  { type: 'app', title: '投放数据看板', desc: '各平台 MCP 聚合后的投放盘面，只读监控优先。', meta: '场景应用' },
  { type: 'app', title: '研发原型预览', desc: '查看项目内生成的 HTML 原型和 PRD 产物。', meta: '研发协作' },
  { type: 'app', title: '更多应用', desc: '按项目上下文接入业务工具。', meta: '接入中' },
];

const snackRecordings = [
  {
    id: 'record-product-weekly',
    fileName: '产品周会 · 智能协作.wav',
    transcriptFileName: '产品周会 · 智能协作.txt',
    createdLabel: '今天 16:02',
    durationSeconds: 1938,
    fileSize: '48.2 MB',
    state: 'completed',
    progress: 100,
    transcript: '田晓柔：本周先以新用户首日完成率作为核心目标。\n陆铭：我会在周三前完成 onboarding 引导稿。\n林可：我来补齐激活率数据口径与历史基线。',
  },
  {
    id: 'record-channel-sync',
    fileName: '东南亚渠道合作沟通.wav',
    transcriptFileName: '东南亚渠道合作沟通.txt',
    createdLabel: '7 月 31 日 14:30',
    durationSeconds: 2769,
    fileSize: '68.7 MB',
    state: 'completed',
    progress: 100,
    transcript: '周舟：首批渠道先覆盖新加坡和马来西亚。\n高翔：合作资料需要统一中英文版本，并补齐报价边界。',
  },
  {
    id: 'record-growth-review',
    fileName: '新官网增长方案评审.wav',
    transcriptFileName: null,
    createdLabel: '7 月 30 日 10:12',
    durationSeconds: 1722,
    fileSize: '41.3 MB',
    state: 'processing',
    progress: 68,
    transcript: '',
  },
  {
    id: 'record-temporary',
    fileName: '临时录音 2026-07-29.wav',
    transcriptFileName: null,
    createdLabel: '7 月 29 日 19:06',
    durationSeconds: 735,
    fileSize: '18.5 MB',
    state: 'pending',
    progress: 0,
    transcript: '',
  },
];

const meetingStatusMeta = {
  scheduled: { label: '待准备', className: 'scheduled', icon: 'calendar-clock' },
  brief_ready: { label: '简报已生成', className: 'brief-ready', icon: 'sparkles' },
  upcoming: { label: '即将开始', className: 'upcoming', icon: 'bell-ring' },
  recording: { label: '录音中', className: 'recording', icon: 'radio' },
  paused: { label: '已暂停', className: 'paused', icon: 'pause' },
  transcribing: { label: '转写中', className: 'processing', icon: 'audio-lines' },
  summary_generating: { label: '纪要生成中', className: 'processing', icon: 'wand-sparkles' },
  needs_review: { label: '待确认', className: 'needs-review', icon: 'clipboard-check' },
  completed: { label: '已完成', className: 'completed', icon: 'circle-check-big' },
};

const meetingSeries = [
  {
    id: 'product-weekly',
    projectId: 'snack-product-iteration',
    title: '产品周会',
    cadence: '每周五',
    weekday: 5,
    startTime: '16:00',
    duration: 60,
    memberNames: ['田晓柔', '产品设计 Agent', '前端工程师-小贝', 'QA-小林'],
    reminderMinutes: 60,
    briefSources: ['项目任务', '项目群聊', '上次会议'],
    nextOccurrenceId: 'product-weekly-20260731',
  },
];

const meetingOccurrences = [
  {
    id: 'product-planning-20260727',
    projectId: 'snack-product-iteration',
    title: '版本规划同步',
    date: '2026-07-27',
    startTime: '10:00',
    duration: 45,
    status: 'completed',
    memberNames: ['田晓柔', '产品设计 Agent'],
    sessionId: 'product-planning-20260727',
    source: 'Snack 日程',
  },
  {
    id: 'taskhub-review-20260729',
    projectId: 'snack-product-iteration',
    title: 'Task Hub 1.2 交互评审',
    date: '2026-07-29',
    startTime: '14:00',
    duration: 60,
    status: 'needs_review',
    memberNames: ['田晓柔', '前端工程师-小贝', 'QA-小林'],
    sessionId: 'taskhub-review-20260729',
    source: 'Snack 日程',
  },
  {
    id: 'mobile-review-20260730',
    projectId: 'snack-product-iteration',
    title: '移动端录音入口评审',
    date: '2026-07-30',
    startTime: '11:00',
    duration: 30,
    status: 'completed',
    memberNames: ['田晓柔', '产品设计 Agent'],
    sessionId: 'mobile-review-20260730',
    source: 'Snack 日程',
  },
  {
    id: 'product-weekly-20260731',
    seriesId: 'product-weekly',
    projectId: 'snack-product-iteration',
    title: '产品周会',
    date: '2026-07-31',
    startTime: '16:00',
    duration: 60,
    status: 'brief_ready',
    memberNames: ['田晓柔', '产品设计 Agent', '前端工程师-小贝', 'QA-小林'],
    sessionId: 'product-weekly-20260731',
    source: 'Snack 周期日程',
    reminderMinutes: 60,
    brief: {
      agenda: ['确认会议纪要一期交互范围', '对齐桌面端与移动端录音入口', '确认 Task Hub 行动项回写规则'],
      carryovers: ['Task Hub 移动端信息密度仍需确认', 'Snack Record 暂停/继续能力待补齐'],
      businessFocus: ['一期只做页面与模拟数据', '会后结果先进入 Snack 会话', '行动项必须人工确认后再建任务'],
      sources: ['12 条项目群消息', '3 个进行中任务', '上次产品周会纪要'],
    },
  },
  {
    id: 'prototype-check-20260731',
    projectId: 'snack-product-iteration',
    title: '会议日程 Demo 走查',
    date: '2026-07-31',
    startTime: '18:00',
    duration: 30,
    status: 'scheduled',
    memberNames: ['田晓柔', '前端工程师-小贝'],
    sessionId: 'prototype-check-20260731',
    source: 'Snack 日程',
  },
  {
    id: 'product-weekly-20260807',
    seriesId: 'product-weekly',
    projectId: 'snack-product-iteration',
    title: '产品周会',
    date: '2026-08-07',
    startTime: '16:00',
    duration: 60,
    status: 'scheduled',
    memberNames: ['田晓柔', '产品设计 Agent', '前端工程师-小贝', 'QA-小林'],
    sessionId: 'product-weekly-20260807',
    source: 'Snack 周期日程',
  },
];

const transcriptSegments = [
  { start: 8, timestamp: '00:00:08', speaker: '我', text: '今天先确认会议纪要一期范围，会议日程只能放在项目里。' },
  { start: 58, timestamp: '00:00:58', speaker: '说话人 1', text: '桌面端和移动端都要有录音入口，但一期先做模拟交互。' },
  { start: 148, timestamp: '00:02:28', speaker: '说话人 2', text: '会后先进入 Snack 会话，会议详情页后续再做。' },
  { start: 438, timestamp: '00:07:18', speaker: '我', text: '日程看板用周日历和议程列表，会议只能在项目里设置。' },
  { start: 812, timestamp: '00:13:32', speaker: '说话人 1', text: '说话人识别先保留我、说话人一和说话人二，不要假装识别到真实姓名。' },
  { start: 1398, timestamp: '00:23:18', speaker: '我', text: '把桌面和移动录音入口的交互原型交给小贝和产品设计一起完成。' },
  { start: 1624, timestamp: '00:27:04', speaker: '说话人 2', text: '测试要覆盖三百九十像素下的日程、录音和任务确认。' },
  { start: 1912, timestamp: '00:31:52', speaker: '我', text: '任务不要自动创建，我确认负责人和截止时间后再进入 Task Hub。' },
];

const meetingSummary = {
  title: '产品周会｜07-31',
  overview: '本次会议确认一期以项目内会议日程为入口，覆盖桌面与移动端录音、会后 Snack 会话和人工确认后的任务回写。',
  decisions: [
    { text: '会议只能在项目内创建，不新增一级入口。', evidenceTime: '00:07:18' },
    { text: '会后先进入 Snack 会话，独立会议详情页后续再做。', evidenceTime: '00:02:28' },
    { text: '行动项必须经管理者确认负责人和截止时间后再创建任务。', evidenceTime: '00:31:52' },
  ],
  questions: [
    { text: '真实移动端录音的系统能力和权限方案仍需专项验证。', evidenceTime: '00:00:58' },
  ],
  risks: [
    { text: '说话人识别不稳定时，错误姓名可能污染任务分配。', evidenceTime: '00:13:32' },
  ],
};

const actionCandidates = [
  {
    id: 'meeting-action-1',
    code: 'MTG-301',
    title: '完成桌面端与移动端会议录音交互原型',
    assignees: ['前端工程师-小贝', '产品设计 Agent'],
    dueDate: '2026-08-05',
    projectId: 'snack-product-iteration',
    evidenceTime: '00:23:18',
    status: 'pending',
  },
  {
    id: 'meeting-action-2',
    code: 'MTG-302',
    title: '补充 390px 移动端会议流程验收用例',
    assignees: ['QA-小林'],
    dueDate: '2026-08-06',
    projectId: 'snack-product-iteration',
    evidenceTime: '00:27:04',
    status: 'pending',
  },
];

const initialMeetingOccurrences = JSON.parse(JSON.stringify(meetingOccurrences));
const initialMeetingSeries = JSON.parse(JSON.stringify(meetingSeries));
let recordingTimerId = null;
let meetingProcessingTimerIds = [];
let snackRecordTimerId = null;
let snackRecordSetupTimerId = null;
const snackRecordTranscriptionTimers = new Map();
let snackRecordSummaryTimerId = null;
let snackRecordSearchTimerId = null;
let conversationPointerDrag = null;
let suppressConversationClick = false;

const mainSurface = document.querySelector('#mainSurface');
const secondaryTabs = document.querySelector('#secondaryTabs');
const topbar = document.querySelector('.topbar');
const topbarActions = document.querySelector('#topbarActions');
const projectHistory = document.querySelector('#projectHistory');
const toast = document.querySelector('#toast');
const meetingDemoControls = document.querySelector('#meetingDemoControls');

function setView(view) {
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.modelPickerOpen = false;
  state.projectPickerOpen = false;
  state.projectCreationOpen = false;
  state.projectEditingId = null;
  state.issueCreationOpen = false;
  state.issueCreationProjectId = null;
  state.view = view;
  state.activeIssue = null;
  state.activeLooseSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  state.boardSidebarOpen = false;
  state.projectDetailOpen = true;
  state.memberSidebarOpen = false;
  state.taskFilterOpen = false;
  if (view === 'project' && !state.activeSession) state.activeSession = 'group';
  render();
}

function render() {
  document.body.dataset.demoDevice = state.demoDevice;
  syncEntryNav();
  renderSecondaryTabs();
  renderTopbarActions();
  syncTopbarVisibility();
  renderProjectHistory();
  renderMeetingDemoControls();
  mainSurface.classList.toggle('edge-to-edge', ['project', 'projectBoard', 'projectSchedule', 'issue', 'recordLibrary', 'recordSettings', 'recordSummary'].includes(state.view));
  mainSurface.innerHTML = `${renderMainView()}${state.projectCreationOpen ? renderProjectCreationModal() : ''}${state.issueCreationOpen ? renderIssueCreationModal() : ''}${renderMeetingOverlays()}${renderSnackRecordOverlays()}`;
  renderIcons();
  syncProjectRenameFocus();
  syncProjectCreationFocus();
  syncIssueCreationFocus();
  syncProjectChatScroll();
}

function syncProjectChatScroll() {
  if (state.view !== 'project') return;
  window.setTimeout(() => {
    const thread = document.querySelector('.project-chat-main .chat-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, 0);
}

function syncProjectRenameFocus() {
  if (!state.renamingProjectId) return;
  window.setTimeout(() => {
    const input = document.querySelector(`[data-project-title-input="${state.renamingProjectId}"]`);
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }
  }, 0);
}

function syncProjectCreationFocus() {
  if (!state.projectCreationOpen) return;
  window.setTimeout(() => {
    const input = document.querySelector('[data-project-create-name]');
    if (input instanceof HTMLInputElement) input.focus();
  }, 0);
}

function syncIssueCreationFocus() {
  if (!state.issueCreationOpen) return;
  window.setTimeout(() => {
    const input = document.querySelector('[data-issue-create-title]');
    if (input instanceof HTMLInputElement) input.focus();
  }, 0);
}

function syncEntryNav() {
  document.querySelectorAll('.entry-nav [data-view]').forEach((node) => {
    const navView = ['issue', 'projectBoard', 'projectSchedule'].includes(state.view)
      ? 'tasks'
      : ['recordLibrary', 'recordSettings'].includes(state.view)
        ? 'apps'
        : state.view;
    node.classList.toggle('active', node.dataset.view === navView);
  });
}

function getSecondaryTabs() {
  if (['tasks', 'issue', 'projectBoard', 'projectSchedule'].includes(state.view)) {
    return [
      { value: 'projects', label: '状态看板', active: state.view !== 'projectSchedule' && state.taskTab === 'projects', attr: 'data-task-tab' },
      {
        value: 'todos',
        label: '我的待办',
        badge: getPendingConfirmationIssues().length,
        active: state.taskTab === 'todos',
        attr: 'data-task-tab',
      },
    ];
  }
  if (state.view === 'agents') {
    return [
      { value: 'square', label: '员工广场', active: state.agentTab === 'square', attr: 'data-agent-tab' },
      { value: 'resources', label: '技能与工具', active: state.agentTab === 'resources', attr: 'data-agent-tab' },
      { value: 'knowledge', label: '我的知识库', active: state.agentTab === 'knowledge', attr: 'data-agent-tab' },
    ];
  }
  return [];
}

function renderSecondaryTabs() {
  const tabs = getSecondaryTabs();
  secondaryTabs.hidden = tabs.length === 0;
  topbar.classList.toggle('has-secondary-tabs', tabs.length > 0);
  secondaryTabs.innerHTML = tabs.map((tab) => `
    <button class="${tab.active ? 'active' : ''}" ${tab.attr}="${tab.value}">
      <span>${tab.label}</span>
      ${tab.badge ? `<em class="secondary-tab-badge" aria-label="${escapeAttribute(tab.badgeLabel || `${tab.badge} 条待确认`)}">${tab.badge}</em>` : ''}
    </button>
  `).join('');
}

function syncTopbarVisibility() {
  topbar.hidden = ['project', 'recordSummary'].includes(state.view);
}

function renderTopbarActions() {
  const canCreateIssue = ['tasks', 'projectBoard', 'issue'].includes(state.view);
  topbarActions.innerHTML = canCreateIssue ? `
    <button class="primary-button task-create-entry" type="button" data-create-issue>
      <i data-lucide="plus"></i>
      <span>创建任务</span>
    </button>
  ` : '';
}

function renderProjectHistory() {
  const looseConversationList = getSortedLooseSessions();
  projectHistory.innerHTML = `
    <div class="section-title dialogue-title">对话</div>
    <div class="loose-session-list conversation-drop-zone ${looseConversationList.length ? '' : 'empty'}" data-conversation-drop-zone="loose" aria-label="未归入项目的对话">
      ${looseConversationList.length
        ? looseConversationList.map(renderLooseSession).join('')
        : `<div class="conversation-drop-empty">
            <i data-lucide="message-square"></i>
            <span>暂无对话</span>
            <small>可将项目内对话拖到这里</small>
          </div>`}
    </div>
    <div class="sidebar-section-header">
      <div class="section-title">项目</div>
      <button class="sidebar-project-create" data-create-project>
        <i data-lucide="plus"></i>
        <span>新建项目</span>
      </button>
    </div>
    <div class="history-tree">${getVisibleProjectFolders().map(renderHistoryProject).join('')}</div>
  `;
}

function renderHistoryProject(project) {
  const expanded = !state.collapsedProjects.includes(project.id);
  const activeFolder = (['project', 'projectBoard', 'projectSchedule'].includes(state.view) && state.activeProject === project.id)
    || (state.view === 'recordSummary' && state.snackRecordSummaryProjectId === project.id);
  const renaming = state.renamingProjectId === project.id;
  const menuOpen = state.openProjectMenuId === project.id;
  const createMenuOpen = state.openProjectCreateMenuId === project.id;
  return `
    <section class="history-project conversation-drop-zone ${expanded ? 'expanded' : ''} ${project.pinnedAt ? 'pinned-project' : ''}" data-conversation-drop-project="${project.id}">
      <div class="history-project-row">
        ${renaming ? `
          <div class="history-project-title active renaming">
            <i data-lucide="${expanded ? 'folder-open' : 'folder'}"></i>
            <input data-project-title-input="${project.id}" value="${escapeAttribute(project.title)}" aria-label="项目名称" />
          </div>
        ` : `
          <button class="history-project-title ${activeFolder ? 'active' : ''}" data-project-open="${project.id}">
            <i data-lucide="${expanded ? 'folder-open' : 'folder'}"></i>
            <span><strong>${escapeHtml(project.title)}</strong></span>
            ${project.pinnedAt ? '<i class="project-pin-indicator" data-lucide="pin"></i>' : ''}
          </button>
        `}
        <button class="history-toggle" aria-label="${expanded ? '收起项目' : '展开项目'}" data-project-toggle="${project.id}">
          <i class="tree-chevron" data-lucide="chevron-right"></i>
        </button>
        <span class="history-project-create-wrap">
          <button class="history-add ${createMenuOpen ? 'active' : ''}" aria-label="新建会话或群聊" data-project-create-menu="${project.id}" aria-expanded="${createMenuOpen ? 'true' : 'false'}">
            <i data-lucide="plus"></i>
          </button>
          ${createMenuOpen ? renderProjectCreateMenu(project) : ''}
        </span>
        <span class="history-project-menu-wrap">
          <button class="history-menu-trigger ${menuOpen ? 'active' : ''}" aria-label="更多项目操作" data-project-menu="${project.id}">
            <i data-lucide="ellipsis"></i>
          </button>
          ${menuOpen ? renderProjectMoreMenu(project) : ''}
        </span>
      </div>
      ${expanded ? `<div class="history-sessions">${renderProjectSessions(project)}</div>` : ''}
    </section>
  `;
}

function renderProjectCreateMenu(project) {
  return `
    <div class="history-create-menu" role="menu" aria-label="${escapeAttribute(project.title)} 新建入口">
      <button class="history-create-item" data-project-create-action="single" data-project-id="${project.id}">
        <i data-lucide="message-square"></i>
        <span>新建会话</span>
      </button>
      <button class="history-create-item" data-project-create-action="group" data-project-id="${project.id}">
        <i data-lucide="messages-square"></i>
        <span>新建群聊</span>
      </button>
    </div>
  `;
}

function renderProjectMoreMenu(project) {
  const pinned = Boolean(project.pinnedAt);
  return `
    <div class="project-more-menu" role="menu" aria-label="${escapeAttribute(project.title)} 更多操作">
      <button class="project-menu-item" data-project-action="add-schedule" data-project-id="${project.id}">
        <i data-lucide="calendar-plus"></i>
        <span>添加日程</span>
      </button>
      <button class="project-menu-item" data-project-action="rename" data-project-id="${project.id}">
        <i data-lucide="pencil"></i>
        <span>重命名</span>
      </button>
      <button class="project-menu-item" data-project-action="pin" data-project-id="${project.id}">
        <i data-lucide="${pinned ? 'pin-off' : 'pin'}"></i>
        <span>${pinned ? '取消置顶' : '置顶'}</span>
      </button>
      <button class="project-menu-item danger" data-project-action="remove" data-project-id="${project.id}">
        <i data-lucide="archive-x"></i>
        <span>移除</span>
      </button>
    </div>
  `;
}

function renderProjectSessions(project) {
  const groupActive = state.view === 'project' && state.activeProject === project.id && state.activeSession === 'group';
  const groupSession = project.groupMessages && project.groupMessages.length
    ? [{
      id: 'group',
      title: '项目群聊',
      updated: '',
      pinned: true,
      active: groupActive,
    }]
    : [];
  const allSessions = [
    ...groupSession,
    ...project.sessions.map((session) => ({
      ...session,
      pinned: false,
      active: (state.view === 'project' && state.activeProject === project.id && state.activeSession === session.id)
        || (session.kind === 'record-summary' && state.view === 'recordSummary' && state.snackRecordSummaryProjectId === project.id),
    })),
  ];
  const expanded = state.expandedSessionLists.includes(project.id);
  const visibleSessions = expanded ? allSessions : allSessions.slice(0, 3);
  const hiddenCount = Math.max(0, allSessions.length - visibleSessions.length);
  return `
    ${visibleSessions.map((session) => renderHistorySession(project, session)).join('')}
    ${allSessions.length > 3 ? renderHistoryMore(project, expanded, hiddenCount) : ''}
  `;
}

function renderHistorySession(project, session) {
  const movable = !session.pinned;
  return `
    <button class="history-session ${session.pinned ? 'pinned' : ''} ${session.active ? 'active' : ''}" data-project-session="${project.id}:${session.id}" ${movable ? `draggable="true" data-conversation-origin="project" data-conversation-id="${session.id}" data-conversation-project="${project.id}" title="拖拽可移动到其他项目或移出项目"` : ''}>
      <i data-lucide="${session.icon || (session.pinned ? 'messages-square' : 'message-square')}"></i>
      <span>${session.title}</span>
      ${session.updated ? `<small>${session.updated}</small>` : ''}
    </button>
  `;
}

function renderHistoryMore(project, expanded, hiddenCount) {
  return `
    <button class="history-more" data-project-sessions="${project.id}">
      <span>${expanded ? '收起对话' : '查看全部'}</span>
    </button>
  `;
}

function renderLooseSession(session) {
  const active = ['recordSummary', 'record-summary'].includes(session.kind)
    ? state.view === 'recordSummary' && state.snackRecordSummaryId === session.recordingId
    : state.view === 'loose' && state.activeLooseSession === session.id;
  return `
    <button class="loose-session ${active ? 'active' : ''}" data-loose-session="${session.id}" draggable="true" data-conversation-origin="loose" data-conversation-id="${session.id}" title="拖拽可移入项目">
      <span>${session.title}</span>
      <small>${session.updated}</small>
    </button>
  `;
}

function getVisibleProjectFolders() {
  return projectFolders
    .filter((project) => !project.removedFromSidebar)
    .sort(compareSidebarProjects);
}

function compareSidebarProjects(a, b) {
  const aPinnedAt = Number(a.pinnedAt) || 0;
  const bPinnedAt = Number(b.pinnedAt) || 0;
  if (aPinnedAt || bPinnedAt) {
    if (aPinnedAt && bPinnedAt) return bPinnedAt - aPinnedAt;
    return bPinnedAt ? 1 : -1;
  }
  return getProjectCreatedAt(b) - getProjectCreatedAt(a);
}

function getProjectCreatedAt(project) {
  if (Number(project.createdAt)) return Number(project.createdAt);
  const fallbackIndex = projectFolders.indexOf(project);
  return fallbackIndex >= 0 ? projectFolders.length - fallbackIndex : 0;
}

function getSortedLooseSessions() {
  const summaryRecording = snackRecordings.find((item) => item.id === state.snackRecordSummaryId);
  const summarySessionId = summaryRecording ? `record-summary-${summaryRecording.id}` : null;
  const summarySession = summaryRecording && !state.snackRecordSummaryProjectId && !looseSessions.some((item) => item.id === summarySessionId) ? [{
    id: `record-summary-${summaryRecording.id}`,
    title: '会议纪要｜AI 营销增长周会',
    updated: '刚刚',
    updatedAt: Number.MAX_SAFE_INTEGER,
    agent: 'Snack',
    kind: 'recordSummary',
    recordingId: summaryRecording.id,
  }] : [];
  return [...summarySession, ...looseSessions].sort((a, b) => getLooseSessionUpdatedAt(b) - getLooseSessionUpdatedAt(a));
}

function getLooseSessionUpdatedAt(session) {
  if (Number(session.updatedAt)) return Number(session.updatedAt);
  const labelRank = { '刚刚': 4, '现在': 4, '今天': 3, '昨天': 2 };
  return labelRank[session.updated] || 0;
}

function getUniqueConversationId(baseId, existingIds) {
  if (!existingIds.has(baseId)) return baseId;
  let suffix = 2;
  while (existingIds.has(`${baseId}-${suffix}`)) suffix += 1;
  return `${baseId}-${suffix}`;
}

function getConversationDragPayload(event) {
  if (state.draggedConversation) return state.draggedConversation;
  try {
    const rawPayload = event.dataTransfer?.getData('application/x-snack-conversation')
      || event.dataTransfer?.getData('text/plain');
    const payload = JSON.parse(rawPayload || 'null');
    return payload?.conversationId && payload?.origin ? payload : null;
  } catch (error) {
    return null;
  }
}

function getLooseConversationForMove(conversationId) {
  const looseIndex = looseSessions.findIndex((session) => session.id === conversationId);
  if (looseIndex >= 0) return { session: looseSessions[looseIndex], looseIndex };
  const recording = snackRecordings.find((item) => `record-summary-${item.id}` === conversationId);
  if (!recording || state.snackRecordSummaryProjectId) return null;
  return {
    looseIndex: -1,
    recording,
    session: {
      id: conversationId,
      title: '会议纪要｜AI 营销增长周会',
      updated: '刚刚',
      updatedAt: Date.now(),
      agent: 'Snack',
      with: 'Snack',
      icon: 'file-text',
      kind: 'record-summary',
      recordingId: recording.id,
      messages: [],
    },
  };
}

function normalizeProjectConversation(session, project) {
  const existingIds = new Set(project.sessions.map((item) => item.id));
  return {
    ...session,
    id: getUniqueConversationId(session.id, existingIds),
    with: session.with || session.agent || 'Snack',
    updated: '刚刚',
  };
}

function normalizeLooseConversation(session) {
  const existingIds = new Set(looseSessions.map((item) => item.id));
  return {
    ...session,
    id: getUniqueConversationId(session.id, existingIds),
    agent: session.agent || session.with || 'Snack',
    updated: '刚刚',
    updatedAt: Date.now(),
  };
}

function isDraggedConversationActive(payload) {
  if (payload.origin === 'loose') {
    return state.activeLooseSession === payload.conversationId
      || (state.view === 'recordSummary' && state.snackRecordSummaryProjectId === null && `record-summary-${state.snackRecordSummaryId}` === payload.conversationId);
  }
  return state.activeProject === payload.projectId && state.activeSession === payload.conversationId;
}

function moveConversationToProject(payload, targetProjectId) {
  const targetProject = getProjectById(targetProjectId);
  if (!targetProject || (payload.origin === 'project' && payload.projectId === targetProjectId)) return;

  const wasActive = isDraggedConversationActive(payload);
  let movedSession;
  let sourceProject = null;
  let recording = null;

  if (payload.origin === 'loose') {
    const looseConversation = getLooseConversationForMove(payload.conversationId);
    if (!looseConversation) return;
    movedSession = looseConversation.session;
    recording = looseConversation.recording
      || snackRecordings.find((item) => item.id === movedSession.recordingId)
      || null;
    if (looseConversation.looseIndex >= 0) looseSessions.splice(looseConversation.looseIndex, 1);
  } else {
    sourceProject = getProjectById(payload.projectId);
    const sourceIndex = sourceProject?.sessions.findIndex((session) => session.id === payload.conversationId) ?? -1;
    if (!sourceProject || sourceIndex < 0) return;
    [movedSession] = sourceProject.sessions.splice(sourceIndex, 1);
    sourceProject.updated = '现在';
    recording = snackRecordings.find((item) => item.id === movedSession.recordingId) || null;
  }

  const projectSession = normalizeProjectConversation(movedSession, targetProject);
  targetProject.sessions.unshift(projectSession);
  targetProject.updated = '现在';
  state.collapsedProjects = state.collapsedProjects.filter((id) => id !== targetProjectId);
  if (recording || projectSession.kind === 'record-summary') {
    if (recording) recording.summaryProjectId = targetProjectId;
    if (state.snackRecordSummaryId === projectSession.recordingId) state.snackRecordSummaryProjectId = targetProjectId;
  }
  if (wasActive) {
    state.activeProject = targetProjectId;
    state.activeSession = projectSession.id;
    state.activeLooseSession = null;
    state.composerProjectId = targetProjectId;
    if (projectSession.kind !== 'record-summary') state.view = 'project';
  }
  render();
  showToast(`已将「${projectSession.title}」移入「${targetProject.title}」`);
}

function moveConversationToLoose(payload) {
  if (payload.origin !== 'project') return;
  const sourceProject = getProjectById(payload.projectId);
  const sourceIndex = sourceProject?.sessions.findIndex((session) => session.id === payload.conversationId) ?? -1;
  if (!sourceProject || sourceIndex < 0) return;
  const wasActive = isDraggedConversationActive(payload);
  const [projectSession] = sourceProject.sessions.splice(sourceIndex, 1);
  const looseSession = normalizeLooseConversation(projectSession);
  looseSessions.unshift(looseSession);
  sourceProject.updated = '现在';
  if (looseSession.kind === 'record-summary') {
    const recording = snackRecordings.find((item) => item.id === looseSession.recordingId);
    if (recording) recording.summaryProjectId = null;
    if (state.snackRecordSummaryId === looseSession.recordingId) state.snackRecordSummaryProjectId = null;
  }
  if (wasActive) {
    state.view = looseSession.kind === 'record-summary' ? 'recordSummary' : 'loose';
    state.activeLooseSession = looseSession.id;
    state.activeProject = null;
    state.activeSession = null;
    state.composerProjectId = null;
  }
  render();
  showToast(`已将「${looseSession.title}」移出「${sourceProject.title}」`);
}

function clearConversationDropState() {
  document.body.classList.remove('conversation-dragging');
  document.querySelectorAll('.conversation-drag-source, .conversation-drop-target').forEach((node) => {
    node.classList.remove('conversation-drag-source', 'conversation-drop-target');
  });
}

function handleConversationDragStart(event) {
  const source = event.target.closest('[data-conversation-origin][data-conversation-id]');
  if (!source) return;
  const payload = {
    origin: source.dataset.conversationOrigin,
    conversationId: source.dataset.conversationId,
    projectId: source.dataset.conversationProject || null,
  };
  state.draggedConversation = payload;
  source.classList.add('conversation-drag-source');
  document.body.classList.add('conversation-dragging');
  if (event.dataTransfer) {
    const serialized = JSON.stringify(payload);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-snack-conversation', serialized);
    event.dataTransfer.setData('text/plain', serialized);
  }
}

function getConversationDropZone(target) {
  return target.closest('[data-conversation-drop-project], [data-conversation-drop-zone="loose"]');
}

function handleConversationDragOver(event) {
  const payload = getConversationDragPayload(event);
  const dropZone = getConversationDropZone(event.target);
  if (!payload || !dropZone) return;
  const targetProjectId = dropZone.dataset.conversationDropProject;
  const validTarget = targetProjectId
    ? !(payload.origin === 'project' && payload.projectId === targetProjectId)
    : payload.origin === 'project';
  if (!validTarget) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.conversation-drop-target').forEach((node) => {
    if (node !== dropZone) node.classList.remove('conversation-drop-target');
  });
  dropZone.classList.add('conversation-drop-target');
}

function handleConversationDrop(event) {
  const payload = getConversationDragPayload(event);
  const dropZone = getConversationDropZone(event.target);
  if (!payload || !dropZone) return;
  event.preventDefault();
  clearConversationDropState();
  state.draggedConversation = null;
  const targetProjectId = dropZone.dataset.conversationDropProject;
  if (targetProjectId) moveConversationToProject(payload, targetProjectId);
  else moveConversationToLoose(payload);
}

function handleConversationDragEnd() {
  state.draggedConversation = null;
  clearConversationDropState();
}

function isValidConversationDrop(payload, dropZone) {
  if (!payload || !dropZone) return false;
  const targetProjectId = dropZone.dataset.conversationDropProject;
  return targetProjectId
    ? !(payload.origin === 'project' && payload.projectId === targetProjectId)
    : payload.origin === 'project';
}

function setActiveConversationDropZone(dropZone) {
  document.querySelectorAll('.conversation-drop-target').forEach((node) => {
    node.classList.toggle('conversation-drop-target', node === dropZone);
  });
}

function handleConversationPointerDown(event) {
  if (event.button !== 0 || !(event.target instanceof Element)) return;
  const source = event.target.closest('[data-conversation-origin][data-conversation-id]');
  if (!source) return;
  conversationPointerDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    source,
    wasDraggable: source.draggable,
    payload: {
      origin: source.dataset.conversationOrigin,
      conversationId: source.dataset.conversationId,
      projectId: source.dataset.conversationProject || null,
    },
  };
  source.draggable = false;
}

function handleConversationPointerMove(event) {
  const pointerDrag = conversationPointerDrag;
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  if (!pointerDrag.active) {
    const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
    if (distance < 6) return;
    pointerDrag.active = true;
    state.draggedConversation = pointerDrag.payload;
    pointerDrag.source.classList.add('conversation-drag-source');
    document.body.classList.add('conversation-dragging');
    pointerDrag.source.setPointerCapture?.(event.pointerId);
  }
  event.preventDefault();
  const hitTarget = document.elementFromPoint(event.clientX, event.clientY);
  const dropZone = hitTarget ? getConversationDropZone(hitTarget) : null;
  setActiveConversationDropZone(isValidConversationDrop(pointerDrag.payload, dropZone) ? dropZone : null);
}

function finishConversationPointerDrag(event) {
  const pointerDrag = conversationPointerDrag;
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  pointerDrag.source.draggable = pointerDrag.wasDraggable;
  conversationPointerDrag = null;
  if (!pointerDrag.active) return;
  event.preventDefault();
  const hitTarget = document.elementFromPoint(event.clientX, event.clientY);
  const dropZone = hitTarget ? getConversationDropZone(hitTarget) : null;
  const validDropZone = isValidConversationDrop(pointerDrag.payload, dropZone) ? dropZone : null;
  clearConversationDropState();
  state.draggedConversation = null;
  suppressConversationClick = true;
  window.setTimeout(() => { suppressConversationClick = false; }, 0);
  if (!validDropZone) return;
  const targetProjectId = validDropZone.dataset.conversationDropProject;
  if (targetProjectId) moveConversationToProject(pointerDrag.payload, targetProjectId);
  else moveConversationToLoose(pointerDrag.payload);
}

function cancelConversationPointerDrag(event) {
  const pointerDrag = conversationPointerDrag;
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  pointerDrag.source.draggable = pointerDrag.wasDraggable;
  conversationPointerDrag = null;
  state.draggedConversation = null;
  clearConversationDropState();
}

function renderMainView() {
  if (state.view === 'tasks') return renderTaskWorkbench();
  if (state.view === 'projectBoard') return renderProjectBoardPage(getActiveProject());
  if (state.view === 'projectSchedule') return renderProjectSchedulePage(getActiveProject());
  if (state.view === 'issue') return renderIssueDetail(getIssueByCode(state.activeIssue));
  if (state.view === 'project') return renderProjectConversation(getActiveProject());
  if (state.view === 'chat') return renderChatView();
  if (state.view === 'agents') return renderAgents();
  if (state.view === 'loose') return renderLooseConversation();
  if (state.view === 'recordLibrary') return renderSnackRecordLibrary();
  if (state.view === 'recordSettings') return renderSnackRecordSettings();
  if (state.view === 'recordSummary') return renderSnackRecordSummary();
  return renderApps();
}

function renderTaskWorkbench() {
  if (state.taskTab === 'todos') return renderMyTodos();
  const visibleIssues = getVisibleIssues();
  const boardContent = `
    ${renderTaskFilterBar(visibleIssues)}
    <section class="kanban-board">${columns.map((column) => renderKanbanColumn(column, visibleIssues)).join('')}</section>
  `;
  return renderBoardWorkspace({
    boardLabel: '全部看板',
    boardContent,
  });
}

function renderProjectBoardPage(project) {
  if (!project) return renderTaskWorkbench();
  const projectIssues = getProjectIssues(project);
  const boardContent = `
    <section class="project-board-shell">
      <section class="project-board-page">
        <section class="project-entity-header">
          <header class="project-entity-primary">
            <div class="project-board-title">
              <span class="project-entity-kicker">
                <em>${escapeHtml(project.scenario)}</em>
                <span>项目 ID · ${escapeHtml(project.id)}</span>
              </span>
              <h2>${escapeHtml(project.title)}</h2>
            </div>
            <div class="project-entity-actions">
              ${state.projectDetailOpen ? '' : `
                <button class="project-detail-restore" type="button" data-project-detail-sidebar="open" aria-label="展开项目详情">
                  <i data-lucide="panel-right-open"></i>
                  <span>项目详情</span>
                </button>
              `}
            </div>
          </header>
        </section>
        ${renderTaskFilterBar(projectIssues, { projectFilter: project.title })}
        <section class="kanban-board project-kanban">${columns.map((column) => renderKanbanColumn(column, projectIssues)).join('')}</section>
      </section>
      ${state.projectDetailOpen ? renderProjectDetailPanel(project) : ''}
    </section>
  `;
  return renderBoardWorkspace({
    boardLabel: '项目看板',
    boardContent,
    project,
  });
}

function renderProjectDetailPanel(project, options = {}) {
  const members = getProjectCollaborators(project);
  const rules = getProjectOperatingRules(project);
  const monitoringRules = project.monitoringRules || [];
  const wikiTopics = project.wikiTopics || [];
  const inRecordSummary = options.context === 'record-summary';
  const sourceFolders = (project.sourceFolders || []).map((folder) => (
    typeof folder === 'string' ? { name: folder, fileCount: null } : folder
  ));
  return `
    <aside class="project-detail-panel ${inRecordSummary ? 'record-summary-project-detail' : ''}" id="${inRecordSummary ? 'recordSummaryProjectDetail' : 'projectBoardDetail'}" aria-label="${escapeAttribute(project.title)}项目详情">
      <header class="project-detail-header">
        <strong>项目详情</strong>
        <span>
          <button type="button" aria-label="编辑项目配置" title="编辑项目配置" data-project-config="${escapeAttribute(project.id)}">
            <i data-lucide="pencil"></i>
          </button>
          <button type="button" aria-label="收起项目详情" title="收起项目详情" ${inRecordSummary ? 'data-record-action="close-summary-project-detail"' : 'data-project-detail-sidebar="close"'}>
            <i data-lucide="panel-right-close"></i>
          </button>
        </span>
      </header>

      <div class="project-detail-scroll">
        <section class="project-detail-identity">
          <span class="project-detail-folder"><i data-lucide="folder-kanban"></i></span>
          <div>
            <span class="project-detail-scenario">${escapeHtml(project.scenario || '协作项目')}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <small>所有者 · ${escapeHtml(currentUserName)}</small>
          </div>
        </section>

        <section class="project-detail-section project-detail-objective">
          <header><strong>项目目标</strong></header>
          <p>${escapeHtml(project.objective || project.summary || '待补充项目目标')}</p>
        </section>

        <section class="project-detail-section project-detail-members">
          <header>
            <strong>成员 <em>${members.length}</em></strong>
            <button class="project-detail-text-button" type="button" data-member-manager-toggle>
              <i data-lucide="user-plus"></i>${state.memberManagerOpen ? '收起' : '管理'}
            </button>
          </header>
          ${state.memberManagerOpen ? renderProjectDetailMemberManager(project) : ''}
          <div class="project-detail-member-list">
            ${members.map(renderProjectDetailMemberRow).join('')}
          </div>
        </section>

        <section class="project-detail-section">
          <header><strong>项目配置</strong></header>
          <div class="project-detail-config-list">
            <div><span><i data-lucide="shield-check"></i>执行方式</span><strong>协助执行</strong><small>关键动作需确认</small></div>
            <div><span><i data-lucide="user-check"></i>确认人</span><strong>${escapeHtml(currentUserName)}</strong></div>
            <div><span><i data-lucide="activity"></i>数据监控</span><strong>${monitoringRules.length ? `已启用 ${monitoringRules.length} 条` : '按需配置'}</strong></div>
          </div>
        </section>

        <section class="project-detail-section">
          <header><strong>关联资料</strong></header>
          <div class="project-detail-resource-list">
            ${wikiTopics.map((topic) => `
              <span><i data-lucide="book-open-text"></i><strong>${escapeHtml(topic)}</strong><small>云端 Wiki</small></span>
            `).join('')}
            ${sourceFolders.map((folder) => {
    const isMeeting = folder.kind === 'meeting';
    const icon = isMeeting ? 'file-text' : 'folder';
    const label = isMeeting ? '会议纪要' : (Number.isFinite(folder.fileCount) ? `${folder.fileCount} 个文件` : '本地文件夹');
    return `<span><i data-lucide="${icon}"></i><strong>${escapeHtml(folder.name)}</strong><small>${label}</small></span>`;
  }).join('')}
            ${wikiTopics.length || sourceFolders.length ? '' : '<p class="project-detail-empty">尚未关联 Wiki 或本地文件夹</p>'}
          </div>
        </section>

        <section class="project-detail-section project-detail-rules">
          <header>
            <strong>运营规则 <em>${rules.length}</em></strong>
            <button class="project-detail-text-button" type="button" data-project-config="${escapeAttribute(project.id)}">编辑</button>
          </header>
          <div>
            ${rules.map(([title, detail]) => `
              <article>
                <span><i data-lucide="check"></i></span>
                <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></div>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
    </aside>
  `;
}

function renderProjectDetailMemberManager(project) {
  const candidates = getProjectMemberCandidates(project);
  return `
    <section class="project-detail-member-manager">
      <label>
        <i data-lucide="search"></i>
        <input
          type="search"
          value="${escapeAttribute(state.memberManagerQuery)}"
          autocomplete="off"
          placeholder="搜索人员或 Agent"
          aria-label="搜索可添加的项目成员"
          data-member-manager-search
        />
      </label>
      <div>
        ${candidates.length ? candidates.map(renderProjectMemberCandidate).join('') : `
          <p>${state.memberManagerQuery.trim() ? '没有匹配的成员' : '暂无可添加的成员'}</p>
        `}
      </div>
    </section>
  `;
}

function renderProjectDetailMemberRow(member) {
  const canRemove = member.name !== currentUserName && member.name !== 'Snack';
  return `
    <article class="project-detail-member-row">
      <span class="group-member-avatar ${member.isAgent ? 'agent' : 'human'}">${escapeHtml(member.name.slice(0, 1))}</span>
      <div>
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(member.role)}</small>
      </div>
      ${member.status === '工作中' ? '<em>工作中</em>' : ''}
      ${canRemove ? `
        <button type="button" data-member-manager-remove="${escapeAttribute(member.name)}" aria-label="移除 ${escapeAttribute(member.name)}" title="移除成员">
          <i data-lucide="user-minus"></i>
        </button>
      ` : ''}
    </article>
  `;
}

function getProjectMeetings(projectId) {
  return meetingOccurrences
    .filter((meeting) => meeting.projectId === projectId)
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));
}

function getUpcomingMeetingCount(projectId) {
  return getProjectMeetings(projectId)
    .filter((meeting) => !['completed'].includes(meeting.status) && meeting.date >= '2026-07-31')
    .length;
}

function parseMeetingDate(value) {
  return new Date(`${value}T00:00:00`);
}

function formatMeetingDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMeetingDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getDisplayedWeekDates() {
  const baseMonday = parseMeetingDate('2026-07-27');
  const start = addMeetingDays(baseMonday, state.meetingWeekOffset * 7);
  return Array.from({ length: 7 }, (_, index) => formatMeetingDateISO(addMeetingDays(start, index)));
}

function formatMeetingWeekRange(dates) {
  const start = parseMeetingDate(dates[0]);
  const end = parseMeetingDate(dates[dates.length - 1]);
  const startLabel = `${start.getMonth() + 1}月${start.getDate()}日`;
  const endLabel = start.getMonth() === end.getMonth()
    ? `${end.getDate()}日`
    : `${end.getMonth() + 1}月${end.getDate()}日`;
  return `${start.getFullYear()}年 ${startLabel} – ${endLabel}`;
}

function getMeetingStatus(meeting) {
  return meetingStatusMeta[meeting?.status] || meetingStatusMeta.scheduled;
}

function renderProjectSchedulePage(project) {
  if (!project) return '';
  if (!isMeetingSetupCompleted(project.id)) return renderMeetingSetupConversation(project);
  const weekDates = getDisplayedWeekDates();
  const visibleMeetings = getProjectMeetings(project.id)
    .filter((meeting) => weekDates.includes(meeting.date));
  return `
    <section class="meeting-schedule-page" aria-label="${escapeAttribute(project.title)}会议日程">
      <header class="meeting-schedule-header">
        <div class="meeting-schedule-title">
          <span class="meeting-project-label"><i data-lucide="folder"></i>${escapeHtml(project.title)}</span>
          <div>
            <h2>会议日程</h2>
            <span class="prototype-badge">交互原型 · 模拟数据</span>
          </div>
          <p>把会前准备、录音、纪要和会后任务放在同一条项目时间线上。</p>
        </div>
        <div class="meeting-schedule-primary-actions">
          <button class="primary-button" type="button" data-meeting-action="new">
            <i data-lucide="calendar-plus"></i>新建会议
          </button>
        </div>
      </header>

      <section class="meeting-toolbar" aria-label="会议日程工具栏">
        <div class="meeting-week-navigation">
          <button class="secondary-button compact" type="button" data-meeting-week="today">今天</button>
          <span class="meeting-week-arrows">
            <button class="icon-button" type="button" aria-label="上一周" data-meeting-week="previous"><i data-lucide="chevron-left"></i></button>
            <button class="icon-button" type="button" aria-label="下一周" data-meeting-week="next"><i data-lucide="chevron-right"></i></button>
          </span>
          <strong>${formatMeetingWeekRange(weekDates)}</strong>
        </div>
      </section>

      <div class="meeting-schedule-layout">
        <main class="meeting-calendar-panel">
          ${renderMeetingWeekGrid(weekDates, visibleMeetings)}
        </main>
        ${renderMeetingAgenda(project, weekDates)}
      </div>
      ${renderMeetingMobileNavigation()}
    </section>
  `;
}

function isMeetingSetupCompleted(projectId) {
  return state.meetingSetupCompletedProjects.includes(projectId);
}

function getMeetingSetupDraft(projectId) {
  if (!state.meetingSetupDrafts[projectId]) {
    state.meetingSetupDrafts[projectId] = {
      step: 'intro',
      hasMeetings: null,
      meetingDescription: '',
      leadHours: 1,
      recordConfigured: null,
      usedRecordGuide: false,
      recordDetectionStatus: 'idle',
      recordInstallStarted: false,
      recordDetectionRequestId: 0,
    };
  }
  return state.meetingSetupDrafts[projectId];
}

function persistMeetingSetupCompletedProjects() {
  try {
    window.localStorage.setItem(
      meetingSetupStorageKey,
      JSON.stringify(state.meetingSetupCompletedProjects),
    );
  } catch (error) {
    // The prototype still works in-memory when storage is unavailable.
  }
}

function renderMeetingSetupMessage(role, content) {
  const isUser = role === 'user';
  return `
    <article class="meeting-setup-message ${isUser ? 'user' : 'assistant'}">
      <span class="meeting-setup-avatar">${isUser ? escapeHtml(currentUserName.slice(0, 1)) : '<i data-lucide="sparkles"></i>'}</span>
      <div class="meeting-setup-bubble">${content}</div>
    </article>
  `;
}

function renderMeetingSetupChoices(options, label) {
  return `
    <div class="meeting-setup-choices" role="group" aria-label="${escapeAttribute(label)}">
      ${options.map((option) => `
        <button class="meeting-setup-choice ${option.primary ? 'primary' : ''}" type="button" data-meeting-setup-action="${escapeAttribute(option.action)}" ${option.value !== undefined ? `data-meeting-setup-value="${escapeAttribute(option.value)}"` : ''}>
          <span class="meeting-setup-choice-icon"><i data-lucide="${option.icon}"></i></span>
          <span><strong>${escapeHtml(option.label)}</strong><small>${escapeHtml(option.description)}</small></span>
          <i data-lucide="arrow-right"></i>
        </button>
      `).join('')}
    </div>
  `;
}

function renderMeetingSetupIntro(project, interactive = true) {
  return renderMeetingSetupMessage('assistant', `
    <span class="meeting-setup-speaker">Snack</span>
    <h3>我来帮你配置项目会议</h3>
    <p>先确认一下：<strong>「${escapeHtml(project.title)}」</strong>现在有需要持续跟进的周期会议，或近期临时会议吗？</p>
    ${interactive ? renderMeetingSetupChoices([
      { action: 'has-meetings', icon: 'calendar-check-2', label: '有，帮我配置', description: '设置会前准备、提醒和会后跟进', primary: true },
      { action: 'skip', icon: 'arrow-right', label: '跳过配置', description: '需要时再添加日程' },
    ], '当前是否有相关会议') : ''}
  `);
}

function getMeetingSetupSuggestion(project, draft) {
  const series = meetingSeries.find((item) => item.projectId === project.id);
  const fallback = series || {
    title: '项目同步会',
    cadence: '按需安排',
    startTime: '待确认',
    memberNames: project.members?.slice(0, 4) || [currentUserName],
  };
  const description = draft.meetingDescription || '';
  const titleMatch = description.match(/(?:开|召开|安排)\s*([^，。,.\n]{2,24}?会)(?=[，。,.\n]|$)/);
  const cadenceMatch = description.match(/每(?:周|星期)[一二三四五六日天]|每天|每月(?:\d{1,2}[号日])?/);
  const timeMatch = description.match(/(?:^|[^\d])((?:[01]?\d|2[0-3]):[0-5]\d)/);
  return {
    ...fallback,
    title: titleMatch?.[1]?.trim() || fallback.title,
    cadence: cadenceMatch?.[0] || fallback.cadence,
    startTime: timeMatch?.[1] || fallback.startTime,
  };
}

function renderMeetingSetupPreparation(project, draft, interactive = true) {
  if (!draft.meetingDescription) {
    return `
      ${renderMeetingSetupMessage('user', '<p>有，帮我一起配置。</p>')}
      ${renderMeetingSetupMessage('assistant', `
        <span class="meeting-setup-speaker">Snack</span>
        <h3>请告诉我会议安排</h3>
        <p>可以直接描述会议名称、时间、频率和参会人，我会据此设置会前准备、提醒和会后跟进。</p>
        ${interactive ? `
          <form class="meeting-setup-input-form" data-meeting-setup-form>
            <label for="meetingSetupDescription">会议安排</label>
            <textarea id="meetingSetupDescription" name="meetingDescription" rows="4" data-meeting-setup-input placeholder="例如：每周五 15:00 开产品周会，产品、设计和研发参加，重点同步进度与风险。" autofocus>${escapeHtml(draft.meetingDescription || '')}</textarea>
            <div class="meeting-setup-input-actions">
              <span>支持自然语言填写</span>
              <button class="primary-button" type="submit">继续配置<i data-lucide="arrow-right"></i></button>
            </div>
          </form>
        ` : ''}
      `)}
    `;
  }
  const suggestion = getMeetingSetupSuggestion(project, draft);
  return `
    ${renderMeetingSetupMessage('user', '<p>有，帮我一起配置。</p>')}
    ${renderMeetingSetupMessage('user', `<p>${escapeHtml(draft.meetingDescription)}</p>`)}
    ${renderMeetingSetupMessage('assistant', `
      <span class="meeting-setup-speaker">Snack</span>
      <h3>我会把会前、会中和会后串起来</h3>
      <p>我可以在会前汇总项目任务、群聊结论和上次遗留，生成重点关注项；会后自动整理纪要和行动项，再由你确认是否创建跟进任务。</p>
      <section class="meeting-setup-detected-card" aria-label="识别到的会议">
        <header><span><i data-lucide="calendar-search"></i></span><div><small>根据你的描述整理</small><strong>${escapeHtml(suggestion.title)}</strong></div><em>待确认</em></header>
        <dl>
          <div><dt>频率</dt><dd>${escapeHtml(suggestion.cadence || '单次')}</dd></div>
          <div><dt>时间</dt><dd>${escapeHtml(suggestion.startTime)}</dd></div>
          <div><dt>参会人</dt><dd>${escapeHtml((suggestion.memberNames || []).slice(0, 3).join('、'))}${(suggestion.memberNames || []).length > 3 ? ` 等${suggestion.memberNames.length}人` : ''}</dd></div>
        </dl>
      </section>
      <p class="meeting-setup-question">你希望我提前多久发送会前准备？</p>
      ${interactive ? renderMeetingSetupChoices([
        { action: 'set-lead', value: '1', icon: 'badge-check', label: '提前 1 小时', description: '有时间补充议程并处理风险，推荐', primary: true },
        { action: 'set-lead', value: '2', icon: 'clock-3', label: '提前 2 小时', description: '适合需要多人确认材料的会议' },
        { action: 'set-lead', value: '0.5', icon: 'timer', label: '提前 30 分钟', description: '适合短会或临时同步' },
      ], '选择会前准备发送时间') : ''}
      <div class="meeting-setup-capability-note"><i data-lucide="info"></i><span>配置完成后，你还能添加更多单次/周期日程，或授权我读取指定范围的系统日历。</span></div>
    `)}
  `;
}

function renderSnackRecordDetectionStatus(status) {
  const statusMeta = {
    checking: {
      className: 'checking',
      icon: 'loader-circle',
      eyebrow: '自动检测中',
      title: '正在检查本机应用',
      description: '正在确认 Snack Record 是否已安装并可用，通常只需几秒。',
      badge: '检测中',
    },
    installed: {
      className: 'installed',
      icon: 'circle-check-big',
      eyebrow: '自动检测完成',
      title: 'Snack Record 已安装并就绪',
      description: '已检测到本机应用，可以继续完成项目会议设置。',
      badge: '已就绪',
    },
    missing: {
      className: 'missing',
      icon: 'download',
      eyebrow: '自动检测完成',
      title: '未检测到 Snack Record',
      description: '推荐现在下载安装并完成录音权限配置，以便自动生成会议转写和纪要。',
      badge: '推荐安装',
    },
  }[status] || null;
  if (!statusMeta) return '';
  return `
    <section class="meeting-record-detection ${statusMeta.className}" role="status" aria-live="polite" aria-label="Snack Record 自动检测结果">
      <span class="meeting-record-detection-icon"><i data-lucide="${statusMeta.icon}"></i></span>
      <div>
        <small>${statusMeta.eyebrow}</small>
        <strong>${statusMeta.title}</strong>
        <p>${statusMeta.description}</p>
      </div>
      <em>${statusMeta.badge}</em>
    </section>
  `;
}

function renderSnackRecordDetectionActions(status, interactive) {
  if (!interactive || status === 'checking') return '';
  if (status === 'installed') {
    return renderMeetingSetupChoices([
      { action: 'record-continue', icon: 'arrow-right', label: '继续完成设置', description: '使用已检测到的 Snack Record', primary: true },
    ], 'Snack Record 自动检测完成');
  }
  return renderMeetingSetupChoices([
    { action: 'record-download', icon: 'download', label: '下载安装 Snack Record', description: '查看下载、安装和录音权限配置', primary: true },
    { action: 'record-recheck', icon: 'refresh-cw', label: '我已安装，重新检测', description: '再次检查本机应用状态' },
    { action: 'record-skip', icon: 'clock-3', label: '稍后安装', description: '先使用日程和会前准备能力' },
  ], 'Snack Record 安装建议');
}

function renderMeetingSetupRecordStep(project, draft, interactive = true, forcedStatus = null) {
  const leadLabel = draft.leadHours === 0.5 ? '30 分钟' : `${draft.leadHours} 小时`;
  const detectionStatus = forcedStatus || draft.recordDetectionStatus || 'checking';
  const previousMessages = draft.hasMeetings
    ? `
      ${renderMeetingSetupMessage('user', `<p>就按提前 ${leadLabel} 发送。</p>`)}
      ${renderMeetingSetupMessage('assistant', `
        <span class="meeting-setup-speaker">Snack</span>
        <p>好的。我会提前 ${leadLabel} 发送会前准备，并在会议结束后自动整理总结和待跟进事项。</p>
      `)}
    `
    : `
      ${renderMeetingSetupMessage('user', '<p>暂时没有相关会议。</p>')}
      ${renderMeetingSetupMessage('assistant', `
        <span class="meeting-setup-speaker">Snack</span>
        <p>没问题。以后你可以随时添加单次或周期日程，也可以只授权我读取指定范围的日历；我会在会前准备重点关注项，并在会后总结跟踪。</p>
      `)}
    `;
  return `
    ${previousMessages}
    ${renderMeetingSetupMessage('assistant', `
      <span class="meeting-setup-speaker">Snack</span>
      <h3>${detectionStatus === 'checking' ? '正在自动检测 Snack Record' : 'Snack Record 自动检测结果'}</h3>
      <p>Snack Record 用于采集会议音频、生成转写和纪要。Snack 会自动检查本机安装状态，无需你手动确认。</p>
      ${renderSnackRecordDetectionStatus(detectionStatus)}
      ${renderSnackRecordDetectionActions(detectionStatus, interactive)}
    `)}
  `;
}

function renderMeetingRecordGuide(interactive = true) {
  return `
    ${renderMeetingSetupMessage('user', '<p>下载安装 Snack Record。</p>')}
    ${renderMeetingSetupMessage('assistant', `
      <span class="meeting-setup-speaker">Snack</span>
      <h3>下载安装并完成录音配置</h3>
      <p>安装完成后重新检测，Snack 会自动确认应用是否已经就绪。</p>
      <section class="meeting-record-guide" aria-label="Snack Record 配置步骤">
        <div><em>1</em><span><strong>下载并安装 Snack Record</strong><small>安装到本机应用目录，首次打开后保持应用运行</small></span></div>
        <div><em>2</em><span><strong>允许录音权限</strong><small>开启麦克风；需要记录线上会议时，再开启系统音频</small></span></div>
        <div><em>3</em><span><strong>选择默认录音来源</strong><small>推荐系统音频 + 麦克风，也可以只录麦克风</small></span></div>
      </section>
      ${interactive ? renderMeetingSetupChoices([
        { action: 'record-recheck', icon: 'refresh-cw', label: '安装完成，重新检测', description: '自动检查应用与基础配置状态', primary: true },
        { action: 'record-skip', icon: 'arrow-right', label: '稍后安装', description: '先进入会议日历' },
      ], '重新检测 Snack Record') : ''}
    `)}
  `;
}

function renderMeetingRecordRecheck(draft, interactive = true, forcedStatus = null) {
  const detectionStatus = forcedStatus || draft.recordDetectionStatus || 'checking';
  return `
    ${renderMeetingSetupMessage('user', '<p>安装完成，请重新检测。</p>')}
    ${renderMeetingSetupMessage('assistant', `
      <span class="meeting-setup-speaker">Snack</span>
      <h3>${detectionStatus === 'checking' ? '正在重新检测 Snack Record' : '重新检测完成'}</h3>
      ${renderSnackRecordDetectionStatus(detectionStatus)}
      ${renderSnackRecordDetectionActions(detectionStatus, interactive)}
    `)}
  `;
}

function renderMeetingSetupComplete(project, draft) {
  const leadLabel = draft.leadHours === 0.5 ? '30 分钟' : `${draft.leadHours} 小时`;
  const recordLabel = draft.recordConfigured ? '已自动检测，就绪' : '待下载安装';
  return `
    ${renderMeetingSetupMessage('user', `<p>${draft.recordConfigured ? 'Snack Record 已通过自动检测。' : 'Snack Record 先稍后安装。'}</p>`)}
    ${renderMeetingSetupMessage('assistant', `
      <span class="meeting-setup-speaker">Snack</span>
      <h3>项目会议助手已准备好</h3>
      <p>我已经保存这次配置。后续你可以直接进入日历，新建会议或继续补充日历授权范围。</p>
      <section class="meeting-setup-summary" aria-label="项目会议配置摘要">
        <header><span><i data-lucide="circle-check-big"></i></span><div><strong>配置完成</strong><small>${escapeHtml(project.title)}</small></div></header>
        <div class="meeting-setup-summary-grid">
          <span><small>相关会议</small><strong>${draft.hasMeetings ? '已识别并跟进' : '暂未添加'}</strong></span>
          <span><small>会前准备</small><strong>${draft.hasMeetings ? `提前 ${leadLabel}` : '添加日程后开启'}</strong></span>
          <span><small>会后总结</small><strong>自动生成，任务需确认</strong></span>
          <span><small>Snack Record</small><strong>${recordLabel}</strong></span>
        </div>
      </section>
      <div class="meeting-setup-final-actions">
        <button class="primary-button" type="button" data-meeting-setup-action="open-calendar"><i data-lucide="calendar-days"></i>进入会议日历</button>
        <button class="secondary-button" type="button" data-meeting-setup-action="restart"><i data-lucide="rotate-ccw"></i>重新配置</button>
      </div>
    `)}
  `;
}

function renderMeetingSetupConversation(project) {
  const draft = getMeetingSetupDraft(project.id);
  const afterIntro = draft.step !== 'intro';
  let conversation = renderMeetingSetupIntro(project, !afterIntro);
  if (draft.hasMeetings === true) {
    conversation += renderMeetingSetupPreparation(project, draft, draft.step === 'preparation');
  }
  if (draft.hasMeetings !== null && draft.step === 'record') {
    conversation += renderMeetingSetupRecordStep(project, draft, draft.step === 'record');
  }
  if (draft.step === 'record-guide') {
    conversation += renderMeetingSetupRecordStep(project, draft, false, 'missing');
    conversation += renderMeetingRecordGuide(true);
  }
  if (draft.step === 'record-recheck') {
    conversation += renderMeetingSetupRecordStep(project, draft, false, 'missing');
    conversation += renderMeetingRecordGuide(false);
    conversation += renderMeetingRecordRecheck(draft, true);
  }
  if (draft.step === 'complete') {
    if (draft.usedRecordGuide) {
      conversation += renderMeetingSetupRecordStep(project, draft, false, 'missing');
      conversation += renderMeetingRecordGuide(false);
      if (draft.recordConfigured) conversation += renderMeetingRecordRecheck(draft, false, 'installed');
    } else {
      conversation += renderMeetingSetupRecordStep(project, draft, false, draft.recordConfigured ? 'installed' : 'missing');
    }
    conversation += renderMeetingSetupComplete(project, draft);
  }
  return `
    <section class="meeting-setup-page" aria-label="${escapeAttribute(project.title)}会议首次配置">
      <main class="meeting-setup-thread">
        <div class="meeting-setup-thread-inner">
          <div class="meeting-setup-progress"><span><i data-lucide="message-circle-more"></i>首次配置</span><small>配置仅作用于当前项目</small></div>
          ${conversation}
        </div>
      </main>
    </section>
  `;
}

function renderMeetingWeekGrid(weekDates, meetings) {
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const hours = Array.from({ length: 11 }, (_, index) => index + 8);
  return `
    <section class="meeting-week-grid" aria-label="周会议日历">
      <header class="meeting-week-header">
        <span class="meeting-timezone">GMT+8</span>
        ${weekDates.map((date, index) => {
          const parsed = parseMeetingDate(date);
          const isToday = date === '2026-07-31';
          return `
            <button class="meeting-day-heading ${isToday ? 'today' : ''} ${state.meetingAgendaDate === date ? 'selected' : ''}" type="button" data-meeting-date="${date}">
              <span>${dayNames[index]}</span>
              <strong>${parsed.getDate()}</strong>
            </button>
          `;
        }).join('')}
      </header>
      <div class="meeting-week-body">
        <div class="meeting-time-axis">
          ${hours.map((hour) => `<span>${String(hour).padStart(2, '0')}:00</span>`).join('')}
        </div>
        ${weekDates.map((date) => `
          <div class="meeting-day-column ${date === '2026-07-31' ? 'today' : ''}" data-calendar-date="${date}">
            ${meetings.filter((meeting) => meeting.date === date).map(renderMeetingCalendarCard).join('')}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderMeetingCalendarCard(meeting) {
  const [hours, minutes] = meeting.startTime.split(':').map(Number);
  const top = ((hours - 8) * 56) + (minutes / 60 * 56);
  const height = Math.max(40, meeting.duration / 60 * 56);
  const status = getMeetingStatus(meeting);
  const isSelected = state.selectedMeetingId === meeting.id;
  return `
    <button
      class="meeting-calendar-card status-${status.className} ${isSelected ? 'selected' : ''}"
      type="button"
      style="--meeting-top:${top}px;--meeting-height:${height}px"
      data-meeting-select="${meeting.id}"
      aria-label="${escapeAttribute(meeting.title)}，${escapeAttribute(status.label)}"
    >
      <span class="meeting-card-time">${meeting.startTime}</span>
      <strong>${escapeHtml(meeting.title)}</strong>
      <small>${status.label}</small>
    </button>
  `;
}

function renderMeetingAgenda(project, weekDates) {
  const selectedDate = weekDates.includes(state.meetingAgendaDate) ? state.meetingAgendaDate : weekDates[0];
  const meetings = getProjectMeetings(project.id)
    .filter((meeting) => meeting.date === selectedDate);
  const parsed = parseMeetingDate(selectedDate);
  return `
    <aside class="meeting-agenda-panel" aria-label="会议议程列表">
      <header>
        <span>
          <strong>${parsed.getMonth() + 1}月${parsed.getDate()}日</strong>
          <small>${meetings.length} 场会议</small>
        </span>
        <button class="icon-button" type="button" aria-label="新建会议" data-meeting-action="new"><i data-lucide="plus"></i></button>
      </header>
      <nav class="meeting-mobile-date-strip" aria-label="选择日期">
        ${weekDates.map((date, index) => {
          const value = parseMeetingDate(date);
          return `
            <button class="${selectedDate === date ? 'active' : ''}" type="button" data-meeting-date="${date}">
              <span>${['一', '二', '三', '四', '五', '六', '日'][index]}</span>
              <strong>${value.getDate()}</strong>
            </button>
          `;
        }).join('')}
      </nav>
      <div class="meeting-agenda-list">
        ${meetings.length ? meetings.map(renderMeetingAgendaCard).join('') : `
          <article class="meeting-agenda-empty">
            <i data-lucide="calendar-check"></i>
            <strong>这一天没有会议</strong>
            <p>你可以在当前项目中创建单次或周期会议。</p>
            <button class="secondary-button" type="button" data-meeting-action="new">新建会议</button>
          </article>
        `}
      </div>
    </aside>
  `;
}

function renderMeetingAgendaCard(meeting) {
  const status = getMeetingStatus(meeting);
  const isSelected = state.selectedMeetingId === meeting.id;
  return `
    <button class="meeting-agenda-card ${isSelected ? 'selected' : ''}" type="button" data-meeting-select="${meeting.id}">
      <span class="meeting-agenda-time">
        <strong>${meeting.startTime}</strong>
        <small>${meeting.duration} 分钟</small>
      </span>
      <span class="meeting-agenda-main">
        <strong>${escapeHtml(meeting.title)}</strong>
        <small>${meeting.memberNames.slice(0, 3).map(escapeHtml).join('、')}${meeting.memberNames.length > 3 ? ` 等 ${meeting.memberNames.length} 人` : ''}</small>
        <em class="meeting-status-tag status-${status.className}"><i data-lucide="${status.icon}"></i>${status.label}</em>
      </span>
      <i data-lucide="chevron-right"></i>
    </button>
  `;
}

function renderMeetingMobileNavigation() {
  return `
    <nav class="meeting-mobile-navigation" aria-label="移动端导航">
      <button type="button" data-meeting-action="open-group"><i data-lucide="messages-square"></i><span>项目</span></button>
      <button class="active" type="button"><i data-lucide="calendar-days"></i><span>日程</span></button>
      <button type="button" data-view="tasks"><i data-lucide="clipboard-list"></i><span>任务</span></button>
      <button type="button" data-toast="个人中心为模拟入口"><i data-lucide="circle-user-round"></i><span>我的</span></button>
    </nav>
  `;
}

function renderMeetingDemoControls() {
  if (!meetingDemoControls) return;
  const isMeetingSurface = state.view === 'projectSchedule'
    || (state.view === 'project' && state.activeSession === 'product-weekly-20260731')
    || state.meetingNoticeOpen
    || state.meetingPermissionOpen
    || state.meetingEndConfirmOpen
    || state.meetingTranscriptOpen;
  meetingDemoControls.hidden = !isMeetingSurface;
  if (!isMeetingSurface) {
    meetingDemoControls.innerHTML = '';
    return;
  }
  const mainMeeting = getMeetingById('product-weekly-20260731');
  const status = getMeetingStatus(mainMeeting);
  const setupPending = state.view === 'projectSchedule' && !isMeetingSetupCompleted(state.activeProject);
  meetingDemoControls.innerHTML = `
    <div class="demo-control-copy">
      <span>会议 Demo</span>
      <strong>${setupPending ? '首次配置' : status.label}</strong>
    </div>
    <div class="demo-device-switch" role="group" aria-label="切换演示设备">
      <button class="${state.demoDevice === 'desktop' ? 'active' : ''}" type="button" data-demo-device="desktop"><i data-lucide="monitor"></i>桌面</button>
      <button class="${state.demoDevice === 'mobile' ? 'active' : ''}" type="button" data-demo-device="mobile"><i data-lucide="smartphone"></i>移动</button>
    </div>
    ${setupPending
      ? '<button class="demo-advance-button" type="button" data-meeting-setup-action="skip"><i data-lucide="calendar-days"></i>跳过配置</button>'
      : '<button class="demo-advance-button" type="button" data-meeting-action="advance"><i data-lucide="skip-forward"></i>推进演示</button>'}
    <button class="demo-reset-button" type="button" data-meeting-action="reset" aria-label="重置会议演示"><i data-lucide="rotate-ccw"></i></button>
  `;
}

function renderMeetingOverlays() {
  const mainMeeting = getMeetingById('product-weekly-20260731');
  return [
    state.meetingModalId ? renderMeetingFormModal() : '',
    state.meetingNoticeOpen ? renderMeetingNotice(mainMeeting) : '',
    state.meetingPermissionOpen ? renderMeetingPermissionModal() : '',
    mainMeeting && ['recording', 'paused'].includes(mainMeeting.status) && !state.meetingRecorderHidden ? renderMeetingRecorder(mainMeeting) : '',
    state.meetingEndConfirmOpen ? renderMeetingEndConfirmation() : '',
    mainMeeting && ['transcribing', 'summary_generating'].includes(mainMeeting.status) ? renderMeetingProcessingOverlay(mainMeeting) : '',
    state.meetingTranscriptOpen ? renderMeetingTranscriptDrawer() : '',
    state.meetingShareOpen ? renderMeetingShareModal() : '',
    state.meetingActionReviewOpen ? renderMeetingActionReviewModal() : '',
  ].join('');
}

function renderMeetingFormModal() {
  const project = getActiveProject() || getProjectById('snack-product-iteration');
  const isNew = state.meetingModalId === 'new';
  const meeting = isNew ? {
    title: '',
    date: state.meetingAgendaDate || '2026-07-31',
    startTime: '15:00',
    duration: 60,
    memberNames: [currentUserName],
    reminderMinutes: 30,
    seriesId: null,
  } : getMeetingById(state.meetingModalId);
  if (!meeting || !project) return '';
  const memberOptions = [...new Set(project.members || [])];
  return `
    <section class="meeting-modal-backdrop" data-meeting-action="close-modal">
      <form class="meeting-form-modal" data-meeting-form="${isNew ? 'new' : escapeAttribute(meeting.id)}" aria-label="${isNew ? '新建会议' : '编辑会议'}">
        <header>
          <div><span>项目会议</span><h3>${isNew ? '新建会议' : '编辑会议'}</h3><p>${escapeHtml(project.title)}</p></div>
          <button class="icon-button" type="button" aria-label="关闭" data-meeting-action="close-modal"><i data-lucide="x"></i></button>
        </header>
        <div class="meeting-form-body">
          <label class="meeting-form-field meeting-form-field-wide">
            <span>会议名称</span>
            <input name="meetingTitle" value="${escapeAttribute(meeting.title)}" placeholder="例如：产品周会" required />
          </label>
          <label class="meeting-form-field">
            <span>日期</span>
            <input name="meetingDate" type="date" value="${escapeAttribute(meeting.date)}" required />
          </label>
          <label class="meeting-form-field">
            <span>开始时间</span>
            <input name="meetingStartTime" type="time" value="${escapeAttribute(meeting.startTime)}" required />
          </label>
          <label class="meeting-form-field">
            <span>时长</span>
            <select name="meetingDuration">
              ${[30, 45, 60, 90].map((duration) => `<option value="${duration}" ${meeting.duration === duration ? 'selected' : ''}>${duration} 分钟</option>`).join('')}
            </select>
          </label>
          <label class="meeting-form-field">
            <span>重复</span>
            <select name="meetingCadence">
              <option value="once" ${meeting.seriesId ? '' : 'selected'}>不重复</option>
              <option value="weekly" ${meeting.seriesId ? 'selected' : ''}>每周</option>
            </select>
          </label>
          ${!isNew && meeting.seriesId ? `
            <label class="meeting-form-field">
              <span>修改范围</span>
              <select name="meetingEditScope">
                <option value="occurrence">仅本次会议</option>
                <option value="series">整个周期系列</option>
              </select>
            </label>
          ` : ''}
          <fieldset class="meeting-form-field meeting-form-field-wide">
            <legend>参会人</legend>
            <div class="meeting-form-members">
              ${memberOptions.map((member) => `
                <label>
                  <input type="checkbox" name="meetingMembers" value="${escapeAttribute(member)}" ${meeting.memberNames.includes(member) ? 'checked' : ''} />
                  <span><em>${escapeHtml(member.slice(0, 1))}</em>${escapeHtml(member)}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>
          <label class="meeting-form-field">
            <span>提前提醒</span>
            <select name="meetingReminder">
              ${[10, 30, 60].map((minutes) => `<option value="${minutes}" ${Number(meeting.reminderMinutes || 30) === minutes ? 'selected' : ''}>提前 ${minutes} 分钟</option>`).join('')}
            </select>
          </label>
          <fieldset class="meeting-form-field meeting-form-field-wide">
            <legend>会前简报来源</legend>
            <div class="meeting-source-options">
              ${['项目任务', '项目群聊', '上次会议'].map((source) => `
                <label><input type="checkbox" name="meetingSources" value="${source}" checked /><span><i data-lucide="check"></i>${source}</span></label>
              `).join('')}
            </div>
          </fieldset>
          <div class="meeting-privacy-note">
            <i data-lucide="shield-check"></i>
            <span><strong>默认私密</strong><small>日程对项目成员可见；录音、转写和纪要默认仅记录者与管理者可见。</small></span>
          </div>
        </div>
        <footer>
          ${isNew ? '<span></span>' : meeting.seriesId ? `
            <span class="meeting-delete-actions">
              <button class="meeting-delete-button" type="button" data-meeting-action="delete" data-meeting-delete-scope="occurrence" data-meeting-id="${escapeAttribute(meeting.id)}"><i data-lucide="trash-2"></i>删除本次</button>
              <button class="meeting-delete-button" type="button" data-meeting-action="delete" data-meeting-delete-scope="series" data-meeting-id="${escapeAttribute(meeting.id)}">删除系列</button>
            </span>
          ` : `<button class="meeting-delete-button" type="button" data-meeting-action="delete" data-meeting-delete-scope="occurrence" data-meeting-id="${escapeAttribute(meeting.id)}"><i data-lucide="trash-2"></i>删除会议</button>`}
          <span class="meeting-form-footer-actions">
            <button class="secondary-button" type="button" data-meeting-action="close-modal">取消</button>
            <button class="primary-button" type="submit">${isNew ? '创建会议' : '保存修改'}</button>
          </span>
        </footer>
      </form>
    </section>
  `;
}

function renderMeetingNotice(meeting) {
  if (!meeting) return '';
  const mobile = state.demoDevice === 'mobile';
  return `
    <section class="meeting-notification ${mobile ? 'mobile' : ''}" role="status" aria-label="会议开始提醒">
      <span class="meeting-notification-icon"><i data-lucide="calendar-clock"></i></span>
      <div>
        <small>${mobile ? 'Snack 通知' : '会议即将开始'}</small>
        <strong>${escapeHtml(meeting.title)}现在开始</strong>
        <p>${mobile ? '使用手机麦克风记录线下会议' : '可记录系统音频与麦克风，无 Bot 入会'}</p>
      </div>
      <button class="secondary-button" type="button" data-meeting-action="dismiss-notice">稍后</button>
      <button class="primary-button" type="button" data-meeting-action="request-record">开始录音</button>
    </section>
  `;
}

function renderMeetingPermissionModal() {
  const mobile = state.demoDevice === 'mobile';
  return `
    <section class="meeting-modal-backdrop">
      <article class="meeting-permission-modal" role="dialog" aria-modal="true" aria-label="录音权限确认">
        <header>
          <span class="meeting-permission-icon"><i data-lucide="${mobile ? 'smartphone' : 'monitor-speaker'}"></i></span>
          <div><small>首次使用</small><h3>开始记录产品周会</h3><p>${mobile ? '移动端用于线下会议，仅采集手机麦克风。' : '桌面端模拟采集会议软件声音与麦克风。'}</p></div>
        </header>
        <div class="meeting-permission-list">
          ${mobile ? `
            <div><i data-lucide="mic"></i><span><strong>麦克风</strong><small>记录当前设备周围的会议声音</small></span><em>需要</em></div>
          ` : `
            <div><i data-lucide="volume-2"></i><span><strong>系统音频</strong><small>记录飞书、腾讯会议或 Zoom 的声音</small></span><em>推荐</em></div>
            <div><i data-lucide="mic"></i><span><strong>麦克风</strong><small>记录你在会议中的发言</small></span><em>需要</em></div>
          `}
        </div>
        <label class="meeting-consent-check">
          <input type="checkbox" data-meeting-consent />
          <span>我已确认取得参会者同意，并遵守组织的信息安全要求。</span>
        </label>
        <footer>
          <button class="secondary-button" type="button" data-meeting-action="cancel-permission">取消</button>
          ${mobile ? '' : '<button class="secondary-button" type="button" data-meeting-action="grant-mic-only">仅录麦克风</button>'}
          <button class="primary-button" type="button" data-meeting-action="${mobile ? 'grant-mic-only' : 'grant-all'}">${mobile ? '允许麦克风并开始' : '允许并开始记录'}</button>
        </footer>
      </article>
    </section>
  `;
}

function renderMeetingRecorder(meeting) {
  const paused = meeting.status === 'paused';
  const mobile = state.demoDevice === 'mobile';
  return `
    <section class="meeting-recorder-shell ${mobile ? 'mobile' : ''}" aria-label="会议录音控制">
      <article class="meeting-recorder-panel">
        <header>
          <span class="recording-pulse ${paused ? 'paused' : ''}"></span>
          <div><strong>${paused ? '记录已暂停' : '正在记录会议'}</strong><small>${escapeHtml(meeting.title)}</small></div>
          <button class="icon-button" type="button" aria-label="隐藏录音控制" data-meeting-action="hide-recorder"><i data-lucide="minus"></i></button>
        </header>
        <div class="meeting-recording-time">${formatRecordingTime(state.recordingSeconds)}</div>
        <div class="meeting-audio-wave ${paused ? 'paused' : ''}" aria-hidden="true">
          ${Array.from({ length: 28 }, (_, index) => `<span style="--wave:${8 + ((index * 13) % 30)}px"></span>`).join('')}
        </div>
        <div class="meeting-capture-state">
          <span><i data-lucide="mic"></i>麦克风</span>
          ${state.recordingCaptureMode === 'system_and_mic' ? '<span><i data-lucide="volume-2"></i>系统音频</span>' : '<span class="muted"><i data-lucide="volume-x"></i>未采集系统音频</span>'}
        </div>
        <footer>
          <button class="recording-control secondary" type="button" data-meeting-action="${paused ? 'resume' : 'pause'}">
            <i data-lucide="${paused ? 'play' : 'pause'}"></i><span>${paused ? '继续' : '暂停'}</span>
          </button>
          <button class="recording-control stop" type="button" data-meeting-action="end-recording">
            <i data-lucide="square"></i><span>结束</span>
          </button>
        </footer>
      </article>
    </section>
  `;
}

function renderMeetingEndConfirmation() {
  return `
    <section class="meeting-modal-backdrop">
      <article class="meeting-end-modal" role="dialog" aria-modal="true" aria-label="结束会议录音">
        <span class="meeting-end-icon"><i data-lucide="square"></i></span>
        <h3>结束记录并生成会议纪要？</h3>
        <p>已记录 ${formatRecordingTime(state.recordingSeconds)}。结束后 Snack 会整理音频、生成转写，并自动进入一个新的项目会话。</p>
        <div>
          <button class="secondary-button" type="button" data-meeting-action="continue-recording">继续记录</button>
          <button class="primary-button" type="button" data-meeting-action="confirm-end">结束并生成纪要</button>
        </div>
      </article>
    </section>
  `;
}

function renderMeetingProcessingSteps(status, compact = false) {
  const steps = [
    ['整理录音', '已完成'],
    ['生成转写', status === 'transcribing' ? '进行中' : '已完成'],
    ['创建 Snack 会话', status === 'summary_generating' ? '已完成' : '等待中'],
    ['生成会议纪要', status === 'summary_generating' ? '进行中' : '等待中'],
  ];
  return `
    <section class="meeting-processing-steps ${compact ? 'compact' : ''}">
      ${steps.map(([label, stepStatus], index) => `
        <div class="${stepStatus === '已完成' ? 'done' : stepStatus === '进行中' ? 'active' : ''}">
          <span>${stepStatus === '已完成' ? '<i data-lucide="check"></i>' : index + 1}</span>
          <strong>${label}</strong>
          <small>${stepStatus}</small>
        </div>
      `).join('')}
    </section>
  `;
}

function renderMeetingProcessingOverlay(meeting) {
  return `
    <section class="meeting-processing-overlay" role="status" aria-label="会议纪要处理中">
      <article>
        <span class="meeting-processing-mark"><i data-lucide="${meeting.status === 'transcribing' ? 'audio-lines' : 'wand-sparkles'}"></i></span>
        <small>会议已结束</small>
        <h3>${meeting.status === 'transcribing' ? '正在生成转写…' : '正在创建会话与会议纪要…'}</h3>
        <p>你可以关闭这个提示，Snack 会继续在后台处理。</p>
        ${renderMeetingProcessingSteps(meeting.status)}
        <button class="secondary-button" type="button" data-meeting-action="finish-processing">立即完成模拟处理</button>
      </article>
    </section>
  `;
}

function renderMeetingTranscriptDrawer() {
  const activeSegment = getTranscriptSegmentAtTime(state.meetingTranscriptTime);
  const total = transcriptSegments[transcriptSegments.length - 1].start + 180;
  const progress = Math.min(100, state.meetingTranscriptTime / total * 100);
  return `
    <section class="meeting-drawer-backdrop" data-meeting-action="close-transcript"></section>
    <aside class="meeting-transcript-drawer" role="dialog" aria-modal="true" aria-label="会议原始转写">
      <header>
        <div><small>产品周会 · 记录证据</small><h3>原始录音与转写</h3></div>
        <button class="icon-button" type="button" aria-label="关闭原始转写" data-meeting-action="close-transcript"><i data-lucide="x"></i></button>
      </header>
      <section class="meeting-mock-player">
        <button type="button" aria-label="播放模拟录音" data-meeting-action="toggle-player"><i data-lucide="play"></i></button>
        <span><i style="width:${progress}%"></i></span>
        <strong>${formatRecordingTime(state.meetingTranscriptTime)}</strong>
        <em>模拟音频</em>
      </section>
      <div class="meeting-transcript-list">
        ${transcriptSegments.map((segment) => `
          <button class="${activeSegment?.start === segment.start ? 'active' : ''}" type="button" data-meeting-evidence="${segment.timestamp}">
            <time>${segment.timestamp}</time>
            <span><strong>${escapeHtml(segment.speaker)}</strong><p>${escapeHtml(segment.text)}</p></span>
          </button>
        `).join('')}
      </div>
      <footer><i data-lucide="lock-keyhole"></i>录音与完整转写仅你可见，分享摘要不会自动分享原始内容。</footer>
    </aside>
  `;
}

function renderMeetingShareModal() {
  const project = getProjectById('snack-product-iteration');
  return `
    <section class="meeting-modal-backdrop">
      <form class="meeting-share-modal" data-meeting-share-form aria-label="分享会议纪要">
        <header><span><i data-lucide="share-2"></i></span><div><h3>分享会议摘要</h3><p>只分享摘要、决策和已确认的行动项。</p></div></header>
        <div class="meeting-share-options">
          ${(project?.members || []).filter((member) => member !== currentUserName).map((member) => `
            <label><input type="checkbox" name="shareMembers" value="${escapeAttribute(member)}" /><span><em>${escapeHtml(member.slice(0, 1))}</em><strong>${escapeHtml(member)}</strong></span></label>
          `).join('')}
        </div>
        <div class="meeting-share-privacy"><i data-lucide="lock-keyhole"></i>原始录音和完整转写不会随摘要一起分享。</div>
        <footer>
          <button class="secondary-button" type="button" data-meeting-action="close-share">取消</button>
          <button class="primary-button" type="submit">确认分享</button>
        </footer>
      </form>
    </section>
  `;
}

function renderMeetingActionReviewModal() {
  const project = getProjectById('snack-product-iteration');
  const candidates = actionCandidates.filter((action) => action.status !== 'created');
  return `
    <section class="meeting-modal-backdrop">
      <form class="meeting-action-review-modal" data-meeting-action-review-form aria-label="确认会议行动项">
        <header>
          <div><small>产品周会 · 人工确认</small><h3>确认后创建 Task Hub 任务</h3><p>请检查任务内容、负责人和截止时间。未确认前不会执行外部写入。</p></div>
          <button class="icon-button" type="button" aria-label="关闭" data-meeting-action="close-action-review"><i data-lucide="x"></i></button>
        </header>
        <div class="meeting-action-review-list">
          ${candidates.length ? candidates.map((action) => `
            <article class="meeting-action-editor">
              <span class="meeting-action-index">${action.code}</span>
              <label><span>任务内容</span><input name="${action.id}-title" value="${escapeAttribute(action.title)}" required /></label>
              <fieldset>
                <legend>负责人（可多选）</legend>
                <div class="meeting-owner-options">
                  ${(project?.members || []).filter((member) => member !== currentUserName).map((member) => `
                    <label>
                      <input type="checkbox" name="${action.id}-assignees" value="${escapeAttribute(member)}" ${action.assignees.includes(member) ? 'checked' : ''} />
                      <span>${escapeHtml(member)}</span>
                    </label>
                  `).join('')}
                </div>
              </fieldset>
              <label class="meeting-action-date"><span>截止时间</span><input type="date" name="${action.id}-dueDate" value="${action.dueDate}" required /></label>
              <button class="meeting-evidence-link" type="button" data-meeting-evidence="${action.evidenceTime}"><i data-lucide="audio-lines"></i>来自产品周会 ${action.evidenceTime}</button>
            </article>
          `).join('') : '<p class="meeting-action-empty">行动项已全部创建为任务。</p>'}
        </div>
        <footer>
          <span><i data-lucide="folder"></i>${escapeHtml(project?.title || '')}</span>
          <div><button class="secondary-button" type="button" data-meeting-action="close-action-review">取消</button><button class="primary-button" type="submit" ${candidates.length ? '' : 'disabled'}>确认并创建 ${candidates.length} 个任务</button></div>
        </footer>
      </form>
    </section>
  `;
}

function formatRecordingTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function getMeetingById(meetingId) {
  return meetingOccurrences.find((meeting) => meeting.id === meetingId);
}

function getTranscriptSegmentAtTime(seconds) {
  return [...transcriptSegments].reverse().find((segment) => segment.start <= seconds) || transcriptSegments[0];
}

function transcriptTimestampToSeconds(timestamp) {
  const values = timestamp.split(':').map(Number);
  if (values.length === 3) return values[0] * 3600 + values[1] * 60 + values[2];
  return values[0] * 60 + values[1];
}

function getProjectOperatingRules(project) {
  if (project.operatingRules?.length) return project.operatingRules;
  const pushRules = (project.pushRule || '')
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (pushRules.length) return pushRules.map((detail, index) => [`规则 ${index + 1}`, detail]);
  return [['等待配置', '项目监控指标将在目标确认后由 Snack 补充。']];
}

function renderBoardWorkspace({ boardLabel, boardContent, project = null }) {
  const activeIssue = getActiveIssueTab(project);
  return `
    <section class="board-workspace ${activeIssue ? 'issue-open' : ''}">
      ${renderIssueWorkspaceTabs(boardLabel)}
      <section class="board-workspace-panel">
        ${activeIssue ? renderIssueDetail(activeIssue) : boardContent}
      </section>
    </section>
  `;
}

function renderIssueWorkspaceTabs(boardLabel) {
  const activeCode = state.activeIssueTab;
  const openTabs = getOpenIssueTabs();
  return `
    <nav class="issue-workspace-tabs" aria-label="状态看板任务页签">
      <button class="issue-board-tab ${activeCode ? '' : 'active'}" data-issue-tab="board">
        <i data-lucide="layout-dashboard"></i>
        <span>${boardLabel}</span>
      </button>
      ${openTabs.map((issue) => `
        <span class="issue-workspace-tab ${activeCode === issue.code ? 'active' : ''}">
          <button class="issue-tab-main" data-issue-tab="${issue.code}" title="${issue.title}">
            <strong>${issue.code}</strong>
            <span>${issue.title}</span>
          </button>
          <button class="issue-tab-close" data-close-issue-tab="${issue.code}" aria-label="关闭 ${issue.code} 页签">
            <i data-lucide="x"></i>
          </button>
        </span>
      `).join('')}
    </nav>
  `;
}

function renderTaskFilterBar(visibleIssues, options = {}) {
  return `
    <section class="task-filter-bar">
      <div class="task-filter-left">
        <button class="filter-button ${state.taskFilterOpen ? 'active' : ''}" data-task-filter>
          <i data-lucide="filter"></i>
          <span>筛选</span>
        </button>
        ${options.projectFilter ? `
          <span class="task-filter-chip">
            <i data-lucide="folder"></i>
            <span>项目 = ${escapeHtml(options.projectFilter)}</span>
          </span>
        ` : ''}
        ${state.taskFilterOpen ? renderTaskFilterMenu() : ''}
      </div>
    </section>
  `;
}

function renderTaskFilterMenu() {
  const items = [
    ['circle-dot', '状态'],
    ['bar-chart-3', '优先级'],
    ['calendar-days', '日期'],
    ['user-round', '负责人'],
    ['user-pen', '创建者'],
    ['folder', '项目'],
  ];
  return `
    <section class="filter-menu" aria-label="任务筛选">
      ${items.map(([icon, label]) => `
        <button class="filter-menu-item" data-toast="筛选项：${label}">
          <i data-lucide="${icon}"></i>
          <span>${label}</span>
          <i data-lucide="chevron-right"></i>
        </button>
      `).join('')}
    </section>
  `;
}

function getVisibleIssues() {
  return issues.filter((issue) => getProjectById(issue.projectId));
}

function renderKanbanColumn(column, sourceIssues = issues) {
  const columnIssues = sourceIssues.filter((issue) => issue.status === column[0]);
  return `
    <section class="kanban-column status-${column[0]}">
      <header><span>${column[1]}</span><strong>${columnIssues.length}</strong></header>
      <div class="kanban-column-body">${columnIssues.map(renderIssueCard).join('')}</div>
    </section>
  `;
}

function renderIssueCard(issue) {
  const project = getProjectById(issue.projectId);
  const opened = state.openIssueTabs.includes(issue.code);
  const active = state.activeIssueTab === issue.code;
  return `
    <button class="issue-card issue-card-button ${opened ? 'opened' : ''} ${active ? 'active' : ''}" data-issue-id="${issue.code}">
      <div class="issue-code">
        <span>${issue.code}</span>
        <small>${opened ? '已打开' : issue.tag}</small>
      </div>
      <h3>${issue.title}</h3>
      <p>${issue.desc}</p>
      <div class="issue-node-line">
        <span>${issue.stage}</span>
        <strong>${issue.count}</strong>
      </div>
      <div class="issue-meta"><span>${project.title}</span><span>${issue.owner}${issue.dueLabel ? ` · ${escapeHtml(issue.dueLabel)}` : ''}</span></div>
    </button>
  `;
}

function hasPendingConfirmation(issue) {
  return issue?.confirmation?.status === 'pending';
}

function canReviewConfirmation(issue, viewerName = currentUserName) {
  return Boolean(issue?.confirmation?.assignee && issue.confirmation.assignee === viewerName);
}

function ensureCurrentUserCanReview(issue) {
  if (canReviewConfirmation(issue)) return true;
  const assignee = issue?.confirmation?.assignee || issue?.reviewer || '指定审核人';
  showToast(`仅 ${assignee} 可以操作这条确认请求`);
  return false;
}

function getPendingConfirmationIssues() {
  return getVisibleIssues().filter((issue) => hasPendingConfirmation(issue) && canReviewConfirmation(issue));
}

function isMyTodoIssue(issue) {
  return (hasPendingConfirmation(issue) && canReviewConfirmation(issue)) || ['review', 'blocked'].includes(issue.status);
}

function getIssueStateLabel(issue) {
  if (hasPendingConfirmation(issue)) return '确认中';
  if (issue?.confirmation?.status === 'deferred') return '已暂缓';
  return stateLabels[issue.status] || issue.status;
}

function renderMyTodos() {
  const myItems = getVisibleIssues().filter(isMyTodoIssue);
  const activeIssue = myItems.find((issue) => issue.code === state.activeTodoIssue) || myItems[0];
  return `
    <section class="todo-inbox-shell">
      <aside class="todo-inbox-list-pane" aria-label="待办列表">
        <header class="todo-inbox-list-header">
          <strong>待办</strong>
          <button class="icon-button" aria-label="更多待办操作"><i data-lucide="ellipsis"></i></button>
        </header>
        <div class="todo-inbox-list">
          ${myItems.map((issue) => renderTodoInboxItem(issue, issue.code === activeIssue.code)).join('')}
        </div>
      </aside>
      ${renderTodoInboxMain(activeIssue)}
    </section>
  `;
}

function renderTodoInboxItem(issue, active) {
  const project = getProjectById(issue.projectId);
  const currentNode = getIssueActiveNode(issue);
  const pendingConfirmation = hasPendingConfirmation(issue);
  return `
    <button class="todo-inbox-item ${active ? 'active' : ''} ${pendingConfirmation ? 'needs-confirmation' : ''}" data-todo-inbox-issue="${issue.code}">
      <span class="todo-inbox-icon"><i data-lucide="${issue.status === 'blocked' ? 'circle-alert' : pendingConfirmation ? 'badge-check' : 'clipboard-list'}"></i></span>
      <span class="todo-inbox-main">
        <strong>${issue.title}</strong>
        <small>${project.title} · ${pendingConfirmation ? '等待你确认' : currentNode ? currentNode.title : issue.stage}</small>
      </span>
      <span class="todo-inbox-meta">
        ${pendingConfirmation ? '<em class="todo-unread-badge" aria-label="1 条新确认请求">1</em>' : `<i data-lucide="${active ? 'circle-check' : 'circle'}"></i>`}
        <small>${project.updated}</small>
      </span>
    </button>
  `;
}

function renderTodoInboxMain(issue) {
  if (!issue) {
    return `
      <article class="todo-inbox-detail-area empty-detail">
        <h2>暂无待办</h2>
        <p>需要你处理的任务会出现在这里。</p>
      </article>
    `;
  }
  return `
    <section class="todo-inbox-detail-area" aria-label="${issue.code} 任务详情">
      ${renderIssueDetail(issue, { surface: 'todo', highlightTodoMention: true })}
    </section>
  `;
}

function getIssueTodoMention(issue) {
  const mentionText = `@${currentUserName}`;
  return (issue.comments || []).find((item) => item[1].includes(mentionText)) || null;
}

function renderProjectConversation(project) {
  if (!project) return '';
  if (isProjectIntakeBlank(project)) return renderProjectIntake(project);
  const session = getProjectSession(project);
  const isGroup = session.id === 'group';
  const headerTitle = isGroup ? getGroupChatTitle(project) : session.title;
  const messages = getSessionMessages(project, session);
  const sideOpen = isGroup && (state.boardSidebarOpen || state.memberSidebarOpen);
  return `
    <section class="project-chat-shell ${sideOpen ? 'side-open' : ''} ${state.boardSidebarOpen && isGroup ? 'board-open' : ''}">
      <section class="project-chat-main">
        <header class="project-chat-header">
          <div class="project-chat-title">
            <span>
              <h2>${headerTitle}</h2>
              ${isGroup ? '' : `<small>${session.with}</small>`}
            </span>
          </div>
          ${isGroup ? `<div class="group-header-actions">${renderGroupMembersButton(project)}${renderMiniBoard(project)}</div>` : ''}
        </header>
        <section class="chat-thread">
          ${messages.map(renderChatMessage).join('')}
        </section>
        ${renderComposer({
          project,
          session,
          placeholder: isGroup ? '询问进展、同步结论或 @ 成员...' : '继续对齐项目上下文...',
        })}
      </section>
      ${isGroup && state.boardSidebarOpen ? renderProjectBoardDrawer(project) : ''}
      ${isGroup && state.memberSidebarOpen ? renderGroupMemberDrawer(project) : ''}
    </section>
  `;
}

function renderProjectIntake(project) {
  return `
    <section class="new-chat-page project-intake-page">
      <div class="new-chat-inner">
        <div class="new-chat-title">
          <h2>和 <button class="agent-title-button" data-agent-menu="toggle">${state.selectedAgent}<i data-lucide="chevron-down"></i></button> 一起开始工作</h2>
          ${state.agentMenuOpen ? renderProjectAgentMenu(project) : ''}
        </div>
        ${renderComposer({
          project,
          variant: 'ask',
          mode: 'project-intake',
          placeholder: '描述项目目标或要跟进的事情...',
        })}
      </div>
    </section>
  `;
}

function renderGroupMembersButton(project) {
  const members = getProjectCollaborators(project);
  return `
    <button class="group-members-button ${state.memberSidebarOpen ? 'active' : ''}" data-member-sidebar="${state.memberSidebarOpen ? 'close' : 'open'}" aria-label="查看群成员">
      <span class="member-avatar-stack">
        ${members.slice(0, 3).map((member, index) => `
          <span class="member-stack-avatar ${member.isAgent ? 'agent' : 'human'}" style="--stack-index:${index}">${escapeHtml(member.name.slice(0, 1))}</span>
        `).join('')}
      </span>
      <strong>${members.length}</strong>
    </button>
  `;
}

function renderAgentWorkStatus(project) {
  const statuses = project.agentStatuses || [];
  const working = statuses.filter((item) => item[1] === '工作中');
  return `
    <div class="agent-status-wrap">
      <button class="agent-status-button ${state.agentStatusOpen ? 'active' : ''}" data-agent-status-toggle aria-label="查看智能体工作状态">
        <i data-lucide="bot"></i>
        ${working.length ? '<span>工作中</span>' : ''}
        <i data-lucide="chevron-down"></i>
      </button>
      ${state.agentStatusOpen ? `
        <section class="agent-status-popover">
          ${statuses.length ? statuses.map((item) => `
            <article class="agent-status-row">
              <span class="activity-avatar">${item[0].slice(0, 1)}</span>
              <div>
                <strong>${item[0]}</strong>
                <small>${item[2]}</small>
              </div>
              ${item[1] === '工作中' ? '<em>工作中</em>' : ''}
            </article>
          `).join('') : '<p>暂无智能体在工作</p>'}
        </section>
      ` : ''}
    </div>
  `;
}

function renderMiniBoard(project) {
  const projectIssues = getProjectIssues(project);
  const runningIssues = projectIssues.filter((issue) => issue.status === 'in_progress');
  const first = runningIssues[0];
  return `
    <button class="mini-board ${state.boardSidebarOpen ? 'active' : ''}" data-board-sidebar="${state.boardSidebarOpen ? 'close' : 'open'}" aria-label="查看进行中的项目任务">
      <span>任务</span>
      <strong>${projectIssues.length}</strong>
      <small>${first ? `${first.code} ${stateLabels[first.status]}` : '暂无进行中'}</small>
      <i data-lucide="${state.boardSidebarOpen ? 'panel-right-close' : 'panel-right-open'}"></i>
    </button>
  `;
}

function renderProjectBoardDrawer(project) {
  const projectIssues = getProjectIssues(project);
  const runningIssues = projectIssues.filter((issue) => issue.status === 'in_progress');
  return `
    <aside class="project-board-drawer project-task-panel" aria-label="项目任务面板">
      <header>
        <span>
          <strong>进行中的任务</strong>
          <small>${project.title}</small>
        </span>
        <button class="icon-button" aria-label="收起看板" data-board-sidebar="close"><i data-lucide="x"></i></button>
      </header>
      <section class="project-task-summary">
        <span><strong>${runningIssues.length}</strong>进行中</span>
        <span><strong>${projectIssues.length}</strong>项目任务</span>
      </section>
      <section class="project-task-list">
        ${runningIssues.length ? runningIssues.map(renderProjectTaskRow).join('') : '<p class="project-task-empty">当前没有进行中的任务</p>'}
      </section>
      <section class="project-task-hint">
        <i data-lucide="message-square-text"></i>
        <span>在群聊里直接问 Snack 进展，或 @ 成员确认当前节点。</span>
      </section>
    </aside>
  `;
}

function renderGroupMemberDrawer(project) {
  const members = getProjectCollaborators(project);
  const activeTab = state.memberPanelTab === 'instructions' ? 'instructions' : 'members';
  return `
    <aside class="member-drawer" aria-label="项目成员与协作说明">
      <header>
        <span>
          <strong>项目成员</strong>
          <small>${getGroupChatTitle(project)}</small>
        </span>
        <button class="icon-button" aria-label="收起成员面板" data-member-sidebar="close"><i data-lucide="x"></i></button>
      </header>
      <nav class="member-drawer-tabs" aria-label="群聊人员面板">
        <button class="${activeTab === 'members' ? 'active' : ''}" data-member-tab="members"><i data-lucide="users"></i>成员</button>
        <button class="${activeTab === 'instructions' ? 'active' : ''}" data-member-tab="instructions"><i data-lucide="file-text"></i>协作说明</button>
      </nav>
      ${activeTab === 'instructions' ? renderCollaborationInstructions(project) : renderGroupMemberList(project, members)}
    </aside>
  `;
}

function renderGroupMemberList(project, members) {
  const candidates = getProjectMemberCandidates(project);
  return `
    <section class="member-management">
      <button class="member-add-toggle ${state.memberManagerOpen ? 'active' : ''}" type="button" data-member-manager-toggle>
        <i data-lucide="user-plus"></i>
        <span>添加成员</span>
        <i data-lucide="${state.memberManagerOpen ? 'chevron-up' : 'chevron-down'}"></i>
      </button>
      ${state.memberManagerOpen ? `
        <section class="member-add-panel">
          <label class="member-add-search">
            <i data-lucide="search"></i>
            <input
              type="search"
              value="${escapeAttribute(state.memberManagerQuery)}"
              autocomplete="off"
              placeholder="搜索人员或 Agent"
              aria-label="搜索可添加的项目成员"
              data-member-manager-search
            />
          </label>
          <div class="member-add-options">
            ${candidates.length ? candidates.map(renderProjectMemberCandidate).join('') : `
              <p class="member-add-empty">${state.memberManagerQuery.trim() ? '没有匹配的成员' : '暂无可添加的成员'}</p>
            `}
          </div>
        </section>
      ` : ''}
    </section>
    <section class="group-member-list">
      ${members.map(renderGroupMemberRow).join('')}
    </section>
    <section class="member-drawer-note">
      <i data-lucide="at-sign"></i>
      <span>在群聊中直接 @ 成员或 Agent，Snack 会把关键信息同步到任务节点。</span>
    </section>
  `;
}

function renderGroupMemberRow(member) {
  const canRemove = member.name !== currentUserName && member.name !== 'Snack';
  return `
    <article class="group-member-row">
      <span class="group-member-avatar ${member.isAgent ? 'agent' : 'human'}">${escapeHtml(member.name.slice(0, 1))}</span>
      <div class="group-member-main">
        <header>
          <strong>${escapeHtml(member.name)}</strong>
          <small>${escapeHtml(member.role)}</small>
        </header>
        <p>${escapeHtml(member.desc)}</p>
      </div>
      <span class="group-member-actions">
        ${member.status === '工作中' ? '<em>工作中</em>' : ''}
        ${canRemove ? `
          <button type="button" data-member-manager-remove="${escapeAttribute(member.name)}" aria-label="移除 ${escapeAttribute(member.name)}" title="移除成员">
            <i data-lucide="user-minus"></i>
          </button>
        ` : ''}
      </span>
    </article>
  `;
}

function getProjectMemberCandidates(project) {
  const existingNames = new Set(getProjectCollaborators(project).map((member) => member.name));
  const query = state.memberManagerQuery.trim().toLowerCase();
  return getProjectMemberDirectory()
    .filter((member) => !existingNames.has(member.name))
    .filter((member) => !query || `${member.name} ${member.role} ${member.isAgent ? 'agent 智能体' : '人员 同事'}`.toLowerCase().includes(query));
}

function renderProjectMemberCandidate(member) {
  return `
    <button class="member-add-option" type="button" data-member-manager-add="${escapeAttribute(member.name)}">
      <span class="group-member-avatar ${member.isAgent ? 'agent' : 'human'}">${escapeHtml(member.name.slice(0, 1))}</span>
      <span>
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(member.role)}</small>
      </span>
      <em>${member.isAgent ? 'Agent' : '人员'}</em>
      <i data-lucide="plus"></i>
    </button>
  `;
}

function toggleMemberManager() {
  state.memberManagerOpen = !state.memberManagerOpen;
  state.memberManagerQuery = '';
  render();
  if (state.memberManagerOpen) syncMemberManagerSearchFocus();
}

function syncMemberManagerSearchFocus() {
  window.setTimeout(() => {
    const input = document.querySelector('[data-member-manager-search]');
    if (!(input instanceof HTMLInputElement)) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function addProjectMember(name) {
  const project = getActiveProject();
  const member = getProjectMemberDirectory().find((item) => item.name === name);
  if (!project || !member || getProjectCollaborators(project).some((item) => item.name === name)) return;
  if (member.isAgent) {
    project.agents = [...new Set([...(project.agents || []), member.name])];
  } else {
    project.members = [...new Set([...(project.members || []), member.name])];
  }
  const rememberedPeople = new Map(project.rememberedPeople || []);
  rememberedPeople.set(member.name, getCollaboratorDefaultDesc(member.name, member.isAgent));
  project.rememberedPeople = [...rememberedPeople.entries()];
  project.updated = '现在';
  state.memberManagerOpen = true;
  state.memberManagerQuery = '';
  render();
  syncMemberManagerSearchFocus();
  showToast(`${member.name} 已加入项目`);
}

function removeProjectMemberFromProject(name) {
  const project = getActiveProject();
  if (!project || name === currentUserName || name === 'Snack') return;
  const isMember = getProjectCollaborators(project).some((member) => member.name === name);
  if (!isMember) return;
  project.members = (project.members || []).filter((memberName) => memberName !== name);
  project.agents = (project.agents || []).filter((memberName) => memberName !== name);
  project.rememberedPeople = (project.rememberedPeople || []).filter(([memberName]) => memberName !== name);
  project.agentStatuses = (project.agentStatuses || []).filter(([memberName]) => memberName !== name);
  project.updated = '现在';
  state.memberManagerQuery = '';
  render();
  showToast(`${name} 已移出项目`);
}

function renderCollaborationInstructions(project) {
  const instructions = [
    ['Snack', '理解群聊上下文，维护项目看板和任务节点，把关键确认点同步给对应成员。'],
    ['数据监控Agent', '通过平台 MCP 持续读取投放数据，每天推送结果；发现异常时给出建议并 @ 项目发起人确认。'],
    ['投放Agent', '收到任务后执行投放调整，完成后在任务详情里写入执行结果，并通知数据监控Agent复核。'],
    ['项目发起人', '确认目标、授权执行、补充同事和职责；需要管理进展时可在群里直接问 Snack。'],
  ];
  const instructionText = getCollaborationInstructionText(project, instructions);
  return `
    <section class="collaboration-instructions">
      <section class="instruction-editor">
        <textarea id="groupInstructionEditor" name="group-instruction">${instructionText}</textarea>
        <button class="primary-button" data-toast="协作说明已保存"><i data-lucide="save"></i>保存</button>
      </section>
    </section>
  `;
}

function getCollaborationInstructionText(project, instructions) {
  const pushRule = project.pushRule && project.pushRule !== '待确认'
    ? `推送规则：${project.pushRule}`
    : '推送规则：群聊协作规则会跟随项目目标和任务进展更新。';
  return [pushRule, ...instructions.map(([title, desc]) => `${title}：${desc}`)].join('\n');
}

function getGroupChatTitle(project) {
  if (project.title.includes('吊车') || project.scenario === 'AI 投放') return '吊车监控项目群';
  if (project.title.includes('库存')) return '库存提示项目群';
  return '项目群聊';
}

function getProjectCollaborators(project) {
  const remembered = new Map(project.rememberedPeople || []);
  const statusMap = new Map((project.agentStatuses || []).map((item) => [item[0], item]));
  const names = [...(project.members || []), ...(project.agents || [])]
    .filter(Boolean)
    .filter((name, index, array) => array.indexOf(name) === index);
  return names.map((name) => {
    const isAgent = name === 'Snack' || (project.agents || []).includes(name) || name.endsWith('Agent');
    const status = statusMap.get(name);
    return {
      name,
      isAgent,
      role: getCollaboratorRole(name, isAgent),
      desc: remembered.get(name) || (status ? status[2] : getCollaboratorDefaultDesc(name, isAgent)),
      status: status ? status[1] : '',
    };
  });
}

function getCollaboratorRole(name, isAgent) {
  if (name === '田晓柔') return '项目发起人';
  if (name === 'Snack') return '项目协调';
  if (name.includes('数据监控')) return '数据监控';
  if (name.includes('数据归因')) return '数据归因';
  if (name.includes('投放监控')) return '投放监控';
  if (name.includes('策略优化')) return '策略优化';
  if (name.includes('投放Agent')) return '投放执行';
  if (name.includes('研发交付')) return '研发交付';
  if (name.includes('产品设计')) return '产品设计';
  if (name.includes('QA')) return '测试验收';
  if (name.includes('前端')) return name.includes('Agent') ? '前端实现' : '前端工程师';
  if (name.includes('投放负责人')) return '投放负责人';
  if (name.includes('素材负责人')) return '素材负责人';
  if (name.includes('数据负责人')) return '数据负责人';
  return isAgent ? '智能体员工' : '协作成员';
}

function getCollaboratorDefaultDesc(name, isAgent) {
  if (name === 'Snack') return '理解项目上下文，维护任务流转，并在群里回答进展。';
  return isAgent ? '按项目任务节点处理对应工作，并把结果同步到群聊。' : '参与项目协作，接收 Snack 的任务提醒和确认请求。';
}

function renderProjectTaskRow(issue) {
  const activeNode = getIssueActiveNode(issue);
  return `
    <button class="project-task-row" data-issue-id="${issue.code}">
      <span class="project-task-code">${issue.code}</span>
      <span class="project-task-main">
        <strong>${issue.title}</strong>
        <small>${activeNode ? activeNode.title : issue.stage} · ${issue.owner}</small>
      </span>
      <span class="state-pill state-${issue.status}">${stateLabels[issue.status]}</span>
    </button>
  `;
}

function getIssueActiveNode(issue) {
  return issue.nodes.find((node) => node.state === 'active')
    || issue.nodes.find((node) => ['waiting', 'pending'].includes(node.state))
    || issue.nodes[issue.nodes.length - 1];
}

function renderIssueDetail(issue, options = {}) {
  if (!issue) return renderTaskWorkbench();
  const project = getProjectById(issue.projectId);
  const isTodoSurface = options.surface === 'todo';
  return `
    <section class="issue-detail-shell ${isTodoSurface ? 'todo-issue-detail' : ''}">
      <main class="issue-detail-main">
        <header class="issue-detail-header">
          ${isTodoSurface
            ? '<span class="issue-detail-back-spacer" aria-hidden="true"></span>'
            : '<button class="icon-button" aria-label="返回状态看板" data-issue-tab="board"><i data-lucide="arrow-left"></i></button>'}
          <div class="issue-detail-title">
            <span>${issue.code} · ${issue.issueType}</span>
            <h2>${issue.title}</h2>
            <p>${issue.desc}</p>
          </div>
          <div class="issue-detail-actions" aria-label="任务操作">
            <button class="primary-button" title="当任务有新进展或动态时，会提醒你" data-tooltip="当任务有新进展或动态时，会提醒你" data-toast="已订阅该任务进展"><i data-lucide="bell-plus"></i>订阅该任务进展</button>
            <button class="secondary-button" data-toast="已归档该任务"><i data-lucide="archive"></i>归档任务</button>
            <span class="state-pill state-${issue.status} ${hasPendingConfirmation(issue) ? 'state-confirming' : ''}">${getIssueStateLabel(issue)}</span>
          </div>
        </header>
        ${renderIssueTimeline(issue, options)}
      </main>
      ${renderIssueSidePanel(issue, project)}
    </section>
    ${state.logDocIssue === issue.code ? renderLogDocModal(issue, project) : ''}
  `;
}

function renderIssueTimeline(issue, options = {}) {
  const activeIndex = issue.nodes.findIndex((node) => node.state === 'active');
  return `
    <section class="issue-timeline-panel" aria-label="任务进展时间轴">
      <header>
        <h3>任务进展</h3>
        <span>节点、动态与评论按发生位置归档</span>
      </header>
      <div class="issue-timeline">
        ${issue.nodes.map((node, index) => renderTimelineNode(issue, node, index, activeIndex, options)).join('')}
      </div>
      <div class="composer compact-composer">
        <textarea name="issue-comment" placeholder="在当前节点留下评论，或 @Snack / @负责人 追问进展..."></textarea>
        <div class="button-row">
          <button class="secondary-button"><i data-lucide="paperclip"></i>附件</button>
          <button class="primary-button" data-toast="评论已记录到当前节点"><i data-lucide="send"></i>发送</button>
        </div>
      </div>
    </section>
  `;
}

function renderTimelineNode(issue, node, index, activeIndex, options = {}) {
  const done = node.state === 'done';
  const active = node.state === 'active';
  const waiting = node.state === 'waiting';
  const marker = done ? 'check' : active ? 'play' : 'circle';
  if (waiting) {
    return `
    <article class="timeline-node waiting compact">
      <span class="timeline-rail-marker"><i data-lucide="${marker}"></i></span>
      <div class="timeline-node-card">
        <strong>${node.title}</strong>
      </div>
    </article>
  `;
  }
  const events = getIssueNodeEvents(issue, index, activeIndex);
  const statusMeta = getNodeStatusMeta(node);
  const confirmationCard = issue.confirmation && node.title === '人工确认'
    ? renderConfirmationCard(issue, { surface: options.surface === 'todo' ? 'todo' : 'timeline' })
    : '';
  return `
    <article class="timeline-node ${done ? 'done' : ''} ${active ? 'active' : ''} ${waiting ? 'waiting' : ''}">
      <span class="timeline-rail-marker"><i data-lucide="${marker}"></i></span>
      <div class="timeline-node-card">
        <header>
          <div>
            <small>节点 ${index + 1}${index === activeIndex ? ' · 当前' : ''}</small>
            <strong>${node.title}</strong>
          </div>
          <span class="${statusMeta.className}">${statusMeta.label}</span>
        </header>
        <p>${node.detail}</p>
        ${confirmationCard}
        <div class="timeline-event-list">
          ${events.length
            ? events.map((event) => renderTimelineEvent(issue, event, options)).join('')
            : '<span class="timeline-empty">暂无动态</span>'}
        </div>
      </div>
    </article>
  `;
}

function getIssueNodeEvents(issue, index, activeIndex) {
  if (issue.nodeActivity && Array.isArray(issue.nodeActivity[index])) return issue.nodeActivity[index];
  const comments = issue.comments || [];
  const activity = issue.activity || [];
  if (index === activeIndex) return [...activity, ...comments];
  if (index < activeIndex && activity[index]) return [activity[index]];
  return [];
}

function getNodeStatusMeta(node) {
  if (node.state === 'done') return { label: '已完成', className: 'timeline-node-status done' };
  if (node.state === 'active') return { label: '当前', className: 'timeline-node-status active' };
  return { label: '待启动', className: 'timeline-node-status waiting' };
}

function isHighlightedTodoMention(issue, item, options = {}) {
  return Boolean(options.highlightTodoMention) && getIssueTodoMention(issue) === item;
}

function renderTimelineEvent(issue, item, options = {}) {
  const highlighted = isHighlightedTodoMention(issue, item, options);
  return `
    <article class="timeline-event ${highlighted ? 'mention-highlight' : ''}"${highlighted ? ' data-highlighted-comment="true"' : ''}>
      <span class="activity-avatar">${item[0].slice(0, 1)}</span>
      <div>
        <header>
          <strong>${item[0]}</strong>
          <small>${item[2]}</small>
          ${highlighted ? '<span class="timeline-mention-badge">@我</span>' : ''}
        </header>
        <p>${item[1]}</p>
      </div>
    </article>
  `;
}

function renderIssueSidePanel(issue, project) {
  return `
    <aside class="issue-detail-side" aria-label="任务详情面板">
      <section class="issue-side-dock">
        <details class="issue-side-section" open>
          <summary>属性 <i data-lucide="chevron-down"></i></summary>
          <div class="issue-side-section-body">
            ${renderProperty('状态', getIssueStateLabel(issue))}
            ${renderProperty('负责人', issue.owner)}
            ${renderProperty('审核人', issue.reviewer)}
            ${renderProperty('项目', project.title)}
            ${renderProperty('优先级', issue.priority)}
            ${renderProperty('当前节点', issue.stage)}
            ${renderProperty('来源', issue.source)}
            ${renderPropertyRaw('关联任务', renderAssociatedTaskLinks(issue))}
            ${renderPropertyRaw('监控指标', renderMonitoringMetricTags(project))}
          </div>
        </details>
        <details class="issue-side-section" open>
          <summary>任务日志 <i data-lucide="chevron-down"></i></summary>
          <div class="issue-side-section-body">
            ${renderTaskLogEntry(issue)}
          </div>
        </details>
        <details class="issue-side-section" open>
          <summary>详情 <i data-lucide="chevron-down"></i></summary>
          <div class="issue-side-section-body">
            ${renderProperty('类型', issue.issueType)}
            ${renderProperty('标签', issue.tag)}
            ${renderProperty('节点进度', issue.count)}
            ${renderProperty('节点数', `${issue.nodes.length} 个`)}
          </div>
        </details>
      </section>
    </aside>
  `;
}

function renderAssociatedTaskLinks(issue) {
  const codes = [...new Set([issue.predecessor, ...(issue.relatedTasks || [])].filter(Boolean))];
  if (!codes.length) return '<span class="property-muted">无</span>';
  return `
    <span class="property-link-list">
      ${codes.map((code) => {
        const related = getIssueByCode(code);
        return `<button class="property-link" data-issue-id="${code}" title="${related ? related.title : '查看关联任务'}">${code}</button>`;
      }).join('')}
    </span>
  `;
}

function renderMonitoringMetricTags(project) {
  const rules = project?.monitoringRules || [];
  if (!rules.length) return '<span class="property-muted">无</span>';
  return `
    <span class="property-metric-list">
      ${rules.map((rule) => {
        const valueWithUnit = rule.value
          ? `${rule.value}${rule.unit === '%' ? rule.unit : rule.unit ? ` ${rule.unit}` : ''}`
          : '';
        const condition = [rule.operator, valueWithUnit].filter(Boolean).join(' ');
        return `
          <span class="property-metric-tag">
            <em>${escapeHtml(rule.metric)}</em>
            ${condition ? `<small>${escapeHtml(condition)}</small>` : ''}
          </span>
        `;
      }).join('')}
    </span>
  `;
}

function renderTaskLogEntry(issue) {
  const recordCount = (issue.logs || []).length + (issue.activity || []).length + (issue.comments || []).length;
  return `
    <button class="log-doc-card" data-log-doc="${issue.code}">
      <i data-lucide="file-text"></i>
      <span>
        <strong>${issue.code} 任务日志.md</strong>
        <small>${recordCount} 条记录 · 点击查看</small>
      </span>
    </button>
    <div class="log-list compact-log-list">${issue.logs.map((log) => `<span>${log}</span>`).join('')}</div>
  `;
}

function renderLogDocModal(issue, project) {
  const markdown = buildIssueLogMarkdown(issue, project);
  return `
    <section class="log-doc-backdrop" role="dialog" aria-modal="true" aria-label="${issue.code} 任务日志">
      <article class="log-doc-modal">
        <header>
          <div>
            <strong>${issue.code} 任务日志.md</strong>
            <span>任务属性、执行记录、人员动作</span>
          </div>
          <button class="icon-button" aria-label="关闭任务日志" data-close-log-doc><i data-lucide="x"></i></button>
        </header>
        <pre>${escapeHtml(markdown)}</pre>
      </article>
    </section>
  `;
}

function buildIssueLogMarkdown(issue, project) {
  const associated = [...new Set([issue.predecessor, ...(issue.relatedTasks || [])].filter(Boolean))];
  const lines = [
    `# ${issue.code} ${issue.title}`,
    '',
    '## 任务属性',
    `- 状态：${stateLabels[issue.status]}`,
    `- 负责人：${issue.owner}`,
    `- 审核人：${issue.reviewer}`,
    `- 项目：${project.title}`,
    `- 优先级：${issue.priority}`,
    `- 当前节点：${issue.stage}`,
    `- 来源：${issue.source}`,
    `- 关联任务：${associated.length ? associated.join('、') : '无'}`,
    '',
    '## 执行记录',
    ...(issue.logs || []).map((log) => `- ${log}`),
    '',
    '## 节点记录',
    ...issue.nodes.flatMap((node, index) => {
      const events = getIssueNodeEvents(issue, index, issue.nodes.findIndex((item) => item.state === 'active'));
      return [
        `### 节点 ${index + 1}：${node.title}`,
        `- 节点说明：${node.detail}`,
        ...(events.length ? events.map((event) => `- ${event[2]} ${event[0]}：${event[1]}`) : ['- 暂无动态']),
      ];
    }),
  ];
  return lines.join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value)
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderProperty(label, value) {
  return `<div class="property-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderPropertyRaw(label, html) {
  return `<div class="property-row"><span>${label}</span><strong>${html}</strong></div>`;
}

function renderChatMessage(message) {
  const body = escapeHtml(message[1]);
  return `
    <article class="chat-message">
      <span class="activity-avatar">${message[0].slice(0, 1)}</span>
      <div>
        <header><strong>${message[0]}</strong><small>${message[2]}</small></header>
        <p>${body}</p>
        ${message[3] ? `<div class="message-actions">${message[3].map((action) => renderMessageAction(action)).join('')}</div>` : ''}
      </div>
    </article>
  `;
}

function renderConfirmationCard(issue, options = {}) {
  const confirmation = issue?.confirmation;
  if (!confirmation) return '';
  const requestedVersion = Number(options.version || confirmation.version);
  const surface = options.surface || 'chat';
  const isObserverView = options.viewAs === 'observer';
  const canOperate = !isObserverView && canReviewConfirmation(issue);
  if (requestedVersion < confirmation.version) {
    return `
      <section class="confirmation-card confirmation-card-superseded" data-confirmation-card="${escapeAttribute(issue.code)}" data-confirmation-version="${requestedVersion}">
        <span class="confirmation-card-icon"><i data-lucide="refresh-cw"></i></span>
        <div>
          <strong>方案 v${requestedVersion} 已更新</strong>
          <p>已根据修改意见重新分析，请处理最新的方案 v${confirmation.version}。</p>
        </div>
      </section>
    `;
  }
  const isPending = confirmation.status === 'pending';
  const isConfirmed = confirmation.status === 'confirmed';
  const isDeferred = confirmation.status === 'deferred';
  const isEditing = isPending && canOperate && state.editingConfirmationIssue === issue.code;
  const statusLabel = isConfirmed
    ? '已确认'
    : isDeferred
      ? '已暂缓'
      : canOperate
        ? '待你确认'
        : `等待${confirmation.assignee}操作`;
  const statusIcon = isConfirmed ? 'circle-check-big' : isDeferred ? 'pause-circle' : 'clock-3';
  return `
    <section class="confirmation-card confirmation-card-${escapeAttribute(confirmation.status)} confirmation-card-${escapeAttribute(surface)} ${canOperate ? 'confirmation-card-actionable' : 'confirmation-card-observer'}" data-confirmation-card="${escapeAttribute(issue.code)}" data-confirmation-version="${confirmation.version}" data-confirmation-view="${canOperate ? 'assignee' : 'observer'}">
      <header class="confirmation-card-header">
        <span class="confirmation-card-kicker"><i data-lucide="shield-check"></i>人工确认 · ${escapeHtml(issue.code)}</span>
        <span class="confirmation-status"><i data-lucide="${statusIcon}"></i>${statusLabel}</span>
      </header>
      <div class="confirmation-card-body">
        <h4>${escapeHtml(confirmation.title)}</h4>
        <p>${escapeHtml(confirmation.summary)}</p>
        <div class="confirmation-signals" aria-label="异常信号">
          ${confirmation.signals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join('')}
        </div>
        <div class="confirmation-plan">
          ${confirmation.plan.map(([label, detail], index) => `
            <div class="confirmation-plan-row">
              <em>${index + 1}</em>
              <span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(detail)}</small></span>
            </div>
          `).join('')}
        </div>
        ${confirmation.revisionReason ? `
          <div class="confirmation-revision-note">
            <i data-lucide="message-square-text"></i>
            <span><strong>已按你的意见生成方案 v${confirmation.version}</strong><small>${escapeHtml(confirmation.revisionReason)}</small></span>
          </div>
        ` : ''}
        ${isConfirmed ? `
          <div class="confirmation-result">
            <i data-lucide="circle-check-big"></i>
            <span><strong>${escapeHtml(confirmation.confirmedBy)} 已确认执行</strong><small>${escapeHtml(confirmation.confirmedAt)} · 任务已进入执行节点</small></span>
          </div>
        ` : ''}
        ${isDeferred ? `
          <div class="confirmation-result confirmation-result-deferred">
            <i data-lucide="pause-circle"></i>
            <span><strong>${escapeHtml(confirmation.deferredBy)} 选择暂不执行</strong><small>${escapeHtml(confirmation.deferredAt)} · 任务保留在人工确认节点</small></span>
          </div>
        ` : ''}
        ${isPending && canOperate ? `
          <div class="confirmation-options" role="group" aria-label="确认方式">
            <button class="confirmation-option" type="button" data-confirmation-action="confirm" data-issue-code="${escapeAttribute(issue.code)}">
              <span class="confirmation-option-index">1</span>
              <span class="confirmation-option-copy"><strong>确认执行</strong><small>按当前方案继续，任务进入执行节点</small></span>
              <i data-lucide="arrow-right"></i>
            </button>
            <div class="confirmation-option-wrap ${isEditing ? 'active' : ''}">
              <button class="confirmation-option ${isEditing ? 'active' : ''}" type="button" data-confirmation-action="revise" data-issue-code="${escapeAttribute(issue.code)}" aria-expanded="${isEditing ? 'true' : 'false'}">
                <span class="confirmation-option-index">2</span>
                <span class="confirmation-option-copy"><strong>修改任务</strong><small>输入修改建议，由 Agent 重新分析后再次确认</small></span>
                <i data-lucide="${isEditing ? 'chevron-up' : 'chevron-down'}"></i>
              </button>
              ${isEditing ? `
                <form class="confirmation-revision-form" data-confirmation-revision-form="${escapeAttribute(issue.code)}">
                  <label for="confirmation-reason-${escapeAttribute(issue.code)}">修改建议</label>
                  <textarea id="confirmation-reason-${escapeAttribute(issue.code)}" name="confirmationReason" placeholder="告诉 Agent 要调整的动作、范围或约束…" required></textarea>
                  <div class="confirmation-card-actions">
                    <button class="secondary-button" type="button" data-confirmation-cancel="${escapeAttribute(issue.code)}">取消</button>
                    <button class="primary-button" type="submit"><i data-lucide="send"></i>提交修改建议</button>
                  </div>
                </form>
              ` : ''}
            </div>
            <button class="confirmation-option" type="button" data-confirmation-action="defer" data-issue-code="${escapeAttribute(issue.code)}">
              <span class="confirmation-option-index">3</span>
              <span class="confirmation-option-copy"><strong>暂不执行</strong><small>保留当前任务和方案，稍后再处理</small></span>
              <i data-lucide="arrow-right"></i>
            </button>
          </div>
        ` : ''}
        ${isPending && !canOperate ? `
          <div class="confirmation-waiting" role="status">
            <i data-lucide="user-round-clock"></i>
            <span>
              <strong>等待${escapeHtml(confirmation.assignee)}操作</strong>
              <small>仅指定审核人可以确认执行、提出修改或暂不执行，处理结果会同步到项目群。</small>
            </span>
          </div>
        ` : ''}
      </div>
      <footer class="confirmation-card-footer">
        <span>${escapeHtml(confirmation.requestedBy)} · ${escapeHtml(confirmation.updatedAt)} · 方案 v${confirmation.version}</span>
        <button type="button" data-issue-id="${escapeAttribute(issue.code)}">查看任务详情<i data-lucide="arrow-up-right"></i></button>
      </footer>
    </section>
  `;
}

function renderMessageAction(action) {
  const projectId = state.activeProject;
  if (action.type === 'meetingIntakeGuide') {
    return renderMeetingIntakeGuideCard();
  }
  if (action.type === 'meetingSchedule') {
    return `<button class="secondary-button" data-project-session="${projectId}:meeting-schedule"><i data-lucide="calendar-days"></i>${action.label}</button>`;
  }
  if (action.type === 'meetingBrief') {
    const meeting = getMeetingById(action.meetingId);
    return meeting?.brief ? renderMeetingBriefMessageCard(meeting) : '';
  }
  if (action.type === 'meetingTranscript') {
    return renderMeetingTranscriptAttachment(action);
  }
  if (action.type === 'meetingSummary') {
    return renderMeetingSummaryCard();
  }
  if (action.type === 'confirmationCard') {
    const issue = getIssueByCode(action.issueCode);
    return issue ? renderConfirmationCard(issue, { surface: 'chat', version: action.version, viewAs: action.viewAs }) : '';
  }
  if (action.type === 'complexBrief') {
    return `<button class="secondary-button" data-mock-action="complexBrief" data-project-id="${projectId}">${action.label}</button>`;
  }
  if (action.type === 'confirmSetup') {
    return `<button class="primary-button" data-mock-action="confirmSetup" data-project-id="${projectId}">${action.label}</button>`;
  }
  if (action.type === 'group') {
    return `<button class="secondary-button" data-project-session="${projectId}:group"><i data-lucide="messages-square"></i>${action.label}</button>`;
  }
  if (action.type === 'projectBoard') {
    return `<button class="secondary-button" data-project-open="${projectId}"><i data-lucide="kanban-square"></i>${action.label}</button>`;
  }
  return `<button class="secondary-button">${action.label}</button>`;
}

function renderMeetingIntakeGuideCard() {
  return `
    <section class="message-meeting-intake-guide" aria-label="新建日程需要补充的信息">
      <header>
        <span><i data-lucide="calendar-plus"></i></span>
        <div><small>新建项目日程</small><strong>先告诉 Snack 这 4 件事</strong></div>
      </header>
      <div class="message-meeting-intake-grid">
        <span><em>1</em><strong>什么日程</strong><small>例会、评审、客户沟通或临时同步</small></span>
        <span><em>2</em><strong>日程主题</strong><small>这次希望讨论或解决什么</small></span>
        <span><em>3</em><strong>关于什么业务</strong><small>关联的产品、项目、客户或业务目标</small></span>
        <span><em>4</em><strong>和谁有关</strong><small>参会人，以及需要知会或影响到的人</small></span>
      </div>
      <p>可以一次说完整，也可以先告诉我你已经确定的部分。</p>
    </section>
  `;
}

function renderMeetingBriefMessageCard(meeting) {
  return `
    <section class="message-meeting-brief">
      <header>
        <span><i data-lucide="sparkles"></i></span>
        <div><small>会前 1 小时自动生成</small><strong>${escapeHtml(meeting.title)}会前简报</strong></div>
        <em>${meeting.startTime} 开始</em>
      </header>
      <div class="message-meeting-brief-grid">
        <section><span>上次遗留</span><strong>${meeting.brief.carryovers.length}</strong><small>项待跟进</small></section>
        <section><span>项目任务</span><strong>3</strong><small>项有更新</small></section>
        <section><span>风险</span><strong>2</strong><small>项需关注</small></section>
      </div>
      <div class="message-meeting-brief-list">
        ${meeting.brief.businessFocus.map((item) => `<span><i data-lucide="circle-dot"></i>${escapeHtml(item)}</span>`).join('')}
      </div>
      <footer><button type="button" data-project-session="${meeting.projectId}:meeting-schedule">查看项目日程<i data-lucide="arrow-up-right"></i></button></footer>
    </section>
  `;
}

function renderMeetingTranscriptAttachment(action) {
  return `
    <section class="message-transcript-attachment">
      <span><i data-lucide="file-audio"></i></span>
      <div><strong>${escapeHtml(action.filename || '会议转写-2026-07-31.txt')}</strong><small>${escapeHtml(action.meta || '35:12 · 桌面端 · 系统音频 + 麦克风')}</small></div>
      <button type="button" aria-label="查看原始转写" data-meeting-evidence="00:00:08"><i data-lucide="chevron-right"></i></button>
    </section>
  `;
}

function renderMeetingSummaryCard() {
  const pendingActions = actionCandidates.filter((action) => action.status !== 'created');
  const createdActions = actionCandidates.filter((action) => action.status === 'created');
  return `
    <section class="meeting-summary-card">
      <header>
        <div><small>Snack 会议纪要 · 自动生成</small><h3>${escapeHtml(meetingSummary.title)}</h3></div>
        <span class="meeting-summary-privacy"><i data-lucide="lock-keyhole"></i>${meetingSummary.shared ? '已分享摘要' : '仅你可见'}</span>
      </header>
      <section class="meeting-summary-overview">
        <span><i data-lucide="align-left"></i>会议摘要</span>
        <p>${escapeHtml(meetingSummary.overview)}</p>
      </section>
      <section class="meeting-summary-group">
        <header><span><i data-lucide="circle-check-big"></i>明确决策</span><em>${meetingSummary.decisions.length}</em></header>
        ${meetingSummary.decisions.map((decision) => `
          <article><p>${escapeHtml(decision.text)}</p><button type="button" data-meeting-evidence="${decision.evidenceTime}"><i data-lucide="audio-lines"></i>${decision.evidenceTime}</button></article>
        `).join('')}
      </section>
      <div class="meeting-summary-two-column">
        <section class="meeting-summary-group compact">
          <header><span><i data-lucide="circle-help"></i>开放问题</span></header>
          ${meetingSummary.questions.map((question) => `<article><p>${escapeHtml(question.text)}</p><button type="button" data-meeting-evidence="${question.evidenceTime}">${question.evidenceTime}</button></article>`).join('')}
        </section>
        <section class="meeting-summary-group compact risk">
          <header><span><i data-lucide="triangle-alert"></i>风险</span></header>
          ${meetingSummary.risks.map((risk) => `<article><p>${escapeHtml(risk.text)}</p><button type="button" data-meeting-evidence="${risk.evidenceTime}">${risk.evidenceTime}</button></article>`).join('')}
        </section>
      </div>
      <section class="meeting-summary-actions">
        <header>
          <span><i data-lucide="list-checks"></i>行动项</span>
          <em>${createdActions.length ? `${createdActions.length} 已创建` : `${pendingActions.length} 待确认`}</em>
        </header>
        ${actionCandidates.map((action) => `
          <article class="${action.status === 'created' ? 'created' : ''}">
            <span>${action.status === 'created' ? '<i data-lucide="check"></i>' : '<i data-lucide="clock-3"></i>'}</span>
            <div>
              <strong>${escapeHtml(action.title)}</strong>
              <small>${action.assignees.map(escapeHtml).join('、')} · ${action.dueDate}</small>
            </div>
            ${action.status === 'created'
              ? `<button type="button" data-issue-id="${action.code}">${action.code}<i data-lucide="arrow-up-right"></i></button>`
              : `<button type="button" data-meeting-evidence="${action.evidenceTime}">${action.evidenceTime}</button>`}
          </article>
        `).join('')}
      </section>
      <footer>
        <button class="secondary-button" type="button" data-meeting-action="share"><i data-lucide="share-2"></i>分享摘要</button>
        ${pendingActions.length
          ? `<button class="primary-button" type="button" data-meeting-action="review-actions"><i data-lucide="clipboard-check"></i>确认并创建任务</button>`
          : '<button class="primary-button" type="button" data-view="tasks"><i data-lucide="clipboard-list"></i>查看 Task Hub</button>'}
      </footer>
    </section>
  `;
}

function renderChatView() {
  const project = getComposerProject();
  const agentProject = project || getVisibleProjectFolders()[0] || projectFolders[0];
  return `
    <section class="new-chat-page">
      <div class="new-chat-inner">
        <div class="new-chat-title">
          <h2>和 <button class="agent-title-button" data-agent-menu="toggle">${state.selectedAgent}<i data-lucide="chevron-down"></i></button> 一起开始工作</h2>
          ${state.agentMenuOpen ? renderProjectAgentMenu(agentProject) : ''}
        </div>
        <div class="new-chat-workspace">
          ${renderComposer({ project, variant: 'ask', placeholder: '描述项目目标或要跟进的事情...' })}
          ${renderSnackMeetingEntryCard()}
        </div>
      </div>
    </section>
  `;
}

function renderSnackMeetingEntryCard() {
  const ready = state.snackRecordConfigured;
  const active = state.snackRecordActive;
  const action = ready ? 'open-native' : 'start-setup';
  const status = active ? '正在录音' : ready ? '打开录音' : '首次使用需配置';
  return `
    <button class="snack-meeting-entry-card ${ready ? 'configured' : ''} ${active ? 'active' : ''}" type="button" data-record-action="${action}" aria-label="${active ? '查看正在进行的 Snack 会议录音' : ready ? '打开 Snack 会议录音' : '配置 Snack 会议并下载资源包'}">
      <span class="snack-meeting-entry-icon"><i data-lucide="mic-2"></i></span>
      <span class="snack-meeting-entry-copy"><strong>Snack 会议</strong><small>录音、转写和会议纪要，在一个流程里完成</small></span>
      <span class="snack-meeting-entry-status">${status}<i data-lucide="chevron-right"></i></span>
    </button>
  `;
}

function renderProjectAgentMenu(project) {
  const agentNames = project?.agents?.length ? project.agents : agents.map((agent) => agent.name);
  return `
    <div class="agent-picker-menu">
      ${agentNames.map((agentName) => `
        <button class="${agentName === state.selectedAgent ? 'active' : ''}" data-agent-select="${agentName}">
          <i data-lucide="${agentName === state.selectedAgent ? 'check' : 'bot'}"></i>
          <span>${agentName}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderComposer(options = {}) {
  if (options.variant === 'ask') {
    const projectId = options.project ? options.project.id : '';
    const isProjectIntake = options.mode === 'project-intake' && projectId;
    const submitAttrs = isProjectIntake
      ? `data-project-intake-submit="${projectId}"`
      : 'data-toast="已进入项目聊天草稿"';
    return `
      <div class="composer ask-composer">
        <textarea name="new-chat-message" ${isProjectIntake ? `data-ask-input="${projectId}"` : ''} placeholder="${options.placeholder || '随心输入'}"></textarea>
        <div class="button-row">
          <div class="chip-row">
            <button class="icon-button composer-tool-button" aria-label="上传附件"><i data-lucide="paperclip"></i></button>
            <button class="icon-button composer-tool-button" aria-label="工具"><i data-lucide="puzzle"></i></button>
            <button class="icon-button composer-tool-button" aria-label="节点网络"><i data-lucide="network"></i></button>
          </div>
          <div class="chip-row composer-model-row">
            ${renderModelSelector()}
            <button class="primary-button send-round" ${submitAttrs} aria-label="发送"><i data-lucide="arrow-up"></i></button>
          </div>
        </div>
        ${renderComposerProjectContext(options.project)}
      </div>
    `;
  }
  const projectDraft = options.project && state.projectChatDraftProjectId === options.project.id
    ? state.projectChatDraft
    : '';
  const isMeetingIntake = options.session?.kind === 'meeting-intake';
  const projectId = options.project?.id || '';
  const sessionId = options.session?.id || '';
  return `
    <div class="composer project-composer">
      <textarea name="project-message" data-project-message="${escapeAttribute(projectId)}" ${isMeetingIntake ? `data-meeting-intake-input="${escapeAttribute(sessionId)}"` : ''} placeholder="${isMeetingIntake ? '告诉 Snack：日程类型、主题、业务背景、参会人和相关人员…' : (options.placeholder || '给 Snack 发送消息...')}">${escapeHtml(projectDraft)}</textarea>
      <div class="button-row">
        <div class="chip-row">
          <button class="icon-button" aria-label="添加附件或工具"><i data-lucide="plus"></i></button>
        </div>
        <button class="primary-button send-round" ${isMeetingIntake ? `data-meeting-intake-submit data-project-id="${escapeAttribute(projectId)}" data-session-id="${escapeAttribute(sessionId)}"` : 'data-toast="消息已发送到项目群"'} aria-label="发送"><i data-lucide="arrow-up"></i></button>
      </div>
    </div>
  `;
}

function renderModelSelector() {
  const selectedModel = getSelectedModel();
  return `
    <span class="model-select-wrap">
      <button class="model-select ${state.modelPickerOpen ? 'active' : ''}" data-model-menu="toggle" aria-expanded="${state.modelPickerOpen ? 'true' : 'false'}">
        <span>${escapeHtml(selectedModel.label)}</span>
        <i data-lucide="chevron-down"></i>
      </button>
      ${state.modelPickerOpen ? `
        <div class="model-picker-menu" role="menu" aria-label="选择模型">
          ${modelOptions.map((model) => `
            <button class="model-picker-item ${model.id === selectedModel.id ? 'active' : ''}" data-model-select="${model.id}">
              <span>
                <strong>${escapeHtml(model.label)}</strong>
                <small>${escapeHtml(model.desc)}</small>
              </span>
              ${model.id === selectedModel.id ? '<i data-lucide="check"></i>' : ''}
            </button>
          `).join('')}
        </div>
      ` : ''}
    </span>
  `;
}

function renderComposerProjectContext(project) {
  const label = project ? project.title : '不使用项目';
  const icon = project ? 'folder' : 'x';
  return `
    <div class="composer-context-wrap">
      <button class="composer-context ${state.projectPickerOpen ? 'active' : ''}" data-project-picker="toggle" aria-expanded="${state.projectPickerOpen ? 'true' : 'false'}">
        <i data-lucide="${icon}"></i>
        <span>${escapeHtml(label)}</span>
        <i data-lucide="chevron-down"></i>
      </button>
      ${state.projectPickerOpen ? renderProjectPicker(project) : ''}
    </div>
  `;
}

function renderProjectPicker(activeProject) {
  const query = state.projectPickerQuery.trim().toLowerCase();
  const projects = getVisibleProjectFolders().filter((project) => {
    if (!query) return true;
    return `${project.title} ${project.summary} ${project.scenario}`.toLowerCase().includes(query);
  });
  return `
    <section class="project-picker-popover" aria-label="选择项目">
      <label class="project-picker-search">
        <i data-lucide="search"></i>
        <input data-project-picker-search value="${escapeAttribute(state.projectPickerQuery)}" placeholder="搜索项目" />
      </label>
      <div class="project-picker-list">
        ${projects.length ? projects.map((project) => `
          <button class="project-picker-item ${activeProject?.id === project.id ? 'active' : ''}" data-project-context="${project.id}">
            <i data-lucide="notebook-tabs"></i>
            <span>
              <strong>${escapeHtml(project.title)}</strong>
              <small>${escapeHtml(project.summary)}</small>
            </span>
            ${activeProject?.id === project.id ? '<i data-lucide="check"></i>' : ''}
          </button>
        `).join('') : '<p class="project-picker-empty">没有匹配的项目</p>'}
      </div>
      <div class="project-picker-actions">
        <button data-create-project>
          <i data-lucide="plus"></i>
          <span>新建项目</span>
          <i data-lucide="chevron-right"></i>
        </button>
        <button data-project-context-empty>
          <i data-lucide="x"></i>
          <span>不使用项目</span>
        </button>
      </div>
    </section>
  `;
}

function getSelectedModel() {
  return modelOptions.find((model) => model.id === state.selectedModel) || modelOptions[0];
}

function toggleModelPicker() {
  state.modelPickerOpen = !state.modelPickerOpen;
  state.projectPickerOpen = false;
  state.agentMenuOpen = false;
  render();
}

function selectModel(modelId) {
  if (!modelOptions.some((model) => model.id === modelId)) return;
  state.selectedModel = modelId;
  state.modelPickerOpen = false;
  render();
}

function toggleProjectPicker() {
  state.projectPickerOpen = !state.projectPickerOpen;
  state.modelPickerOpen = false;
  state.agentMenuOpen = false;
  render();
  if (state.projectPickerOpen) syncProjectPickerSearchFocus();
}

function selectProjectContext(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  state.composerProjectId = projectId;
  state.projectPickerOpen = false;
  state.projectPickerQuery = '';
  const activeProject = getActiveProject();
  if (state.view === 'project' && activeProject && isProjectIntakeBlank(activeProject)) {
    state.activeProject = projectId;
    state.activeSession = isProjectIntakeBlank(project) ? 'snack-intake' : 'group';
  }
  render();
}

function clearProjectContext() {
  state.composerProjectId = null;
  state.projectPickerOpen = false;
  state.projectPickerQuery = '';
  const activeProject = getActiveProject();
  if (state.view === 'project' && activeProject && isProjectIntakeBlank(activeProject)) {
    state.view = 'chat';
    state.activeSession = null;
  }
  render();
}

function syncProjectPickerSearchFocus() {
  window.setTimeout(() => {
    const input = document.querySelector('[data-project-picker-search]');
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 0);
}

function renderLooseConversation() {
  const session = looseSessions.find((item) => item.id === state.activeLooseSession);
  if (!session) return renderChatView();
  return `
    <section class="project-chat-shell standalone-chat-shell">
      <section class="project-chat-main">
        <header class="project-chat-header">
          <div class="project-chat-title">
            <button class="icon-button" aria-label="返回新建会话" data-view="chat"><i data-lucide="arrow-left"></i></button>
            <span><h2>${session.title}</h2><small>${session.agent}</small></span>
          </div>
        </header>
        <section class="chat-thread">${session.messages.map(renderChatMessage).join('')}</section>
        ${renderComposer()}
      </section>
    </section>
  `;
}

function renderAgents() {
  if (state.agentTab === 'resources') return renderResourceWorkspace();
  if (state.agentTab === 'knowledge') return renderKnowledgeWorkspace();
  return `<section class="agent-grid">${agents.map(renderAgentCard).join('')}</section>`;
}

function renderAgentCard(agent) {
  return `
    <article class="agent-card">
      <span class="agent-icon"><i data-lucide="bot"></i></span>
      <h3>${agent.name}</h3>
      <p>${agent.desc}</p>
      <span class="tag">${agent.last}</span>
      <button class="secondary-button" data-agent-chat="${agent.name}">发起会话</button>
    </article>
  `;
}

function renderResourceWorkspace() {
  return `
    ${renderWorkspaceToolbar(renderResourceTabs(), '搜索技能或工具...')}
    <section class="resource-grid">${getVisibleResources().map(renderResourceCard).join('')}</section>
  `;
}

function renderKnowledgeWorkspace() {
  const knowledgeItems = resources.filter((item) => item.type === 'knowledge');
  return `
    ${renderWorkspaceToolbar('<span></span>', '搜索知识...')}
    <section class="resource-grid">${knowledgeItems.map(renderResourceCard).join('')}</section>
  `;
}

function renderWorkspaceToolbar(left, placeholder) {
  return `
    <section class="workspace-toolbar">
      ${left}
      <label class="search-box"><i data-lucide="search"></i><input placeholder="${placeholder}" /></label>
    </section>
  `;
}

function getVisibleResources() {
  if (state.resourceTab === 'all') return resources;
  return resources.filter((item) => item.type === state.resourceTab);
}

function renderResourceTabs() {
  return `<div class="scope-switch">${['all', 'skill', 'tool'].map(renderResourceTab).join('')}</div>`;
}

function renderResourceTab(type) {
  const labels = { all: '全部', skill: '技能', tool: '工具' };
  return `<button class="${state.resourceTab === type ? 'active' : ''}" data-resource-tab="${type}">${labels[type]}</button>`;
}

function renderResourceCard(item) {
  const typeLabels = { skill: '技能', tool: '工具', knowledge: '知识', app: '应用' };
  const meta = item.meta || typeLabels[item.type] || '可用于会话';
  return `
    <article class="knowledge-card">
      <span class="resource-icon"><i data-lucide="${getResourceIcon(item)}"></i></span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <div class="resource-meta"><span class="tag">${meta}</span></div>
    </article>
  `;
}

function getResourceIcon(item) {
  const icons = { skill: 'sparkles', tool: 'wrench', knowledge: 'book-open', app: 'app-window' };
  return icons[item.type] || 'blocks';
}

function renderApps() {
  const recordingActionLabel = state.snackRecordActive ? '查看正在录音' : '开始录音';
  return `
    <section class="snack-apps-page" aria-label="应用">
      <header class="snack-apps-heading">
        <h2>应用</h2>
        <p>启用适合团队工作流的 Snack 应用。</p>
      </header>
      <div class="snack-apps-grid" role="list" aria-label="应用列表">
        <article class="snack-record-app-card ${state.snackRecordConfigured ? 'configured' : ''}" role="listitem">
          ${state.snackRecordConfigured ? `<button class="snack-record-card-settings" type="button" data-record-action="open-settings" aria-label="打开 Snack Record 设置" title="打开 Snack Record 设置"><i data-lucide="settings-2"></i></button>` : ''}
          <span class="snack-record-app-icon"><i data-lucide="mic-2"></i></span>
          <h3>Snack Record</h3>
          <p>本地会议录音、转写与会议纪要</p>
          ${state.snackRecordConfigured ? '' : '<small class="snack-record-first-use-copy"><i data-lucide="circle-1"></i>首次使用需配置</small>'}
          <footer>
            <button class="snack-record-mic-action ${state.snackRecordActive ? 'active' : ''}" type="button" data-record-action="${state.snackRecordConfigured ? 'open-native' : 'start-setup'}" aria-label="${state.snackRecordConfigured ? recordingActionLabel : '开始录音，首次使用需先配置'}" title="${state.snackRecordConfigured ? recordingActionLabel : '开始录音（首次使用需配置）'}"><i data-lucide="mic-2"></i></button>
            ${state.snackRecordConfigured
              ? '<button class="secondary-button snack-record-library-action" type="button" data-record-action="open-library">我的录音</button>'
              : '<button class="secondary-button snack-record-setup-action" type="button" data-record-action="start-setup">配置</button>'}
          </footer>
        </article>
      </div>
      <div class="snack-apps-section-heading">
        <div><h3>更多应用</h3><p>在会话和智能体工作中直接使用</p></div>
        <button class="secondary-button" type="button" data-toast="添加应用为模拟入口"><i data-lucide="plus"></i>添加应用</button>
      </div>
      <section class="resource-grid">${apps.map(renderResourceCard).join('')}</section>
    </section>
  `;
}

function renderSnackRecordPageHeader(title, description, backAction = 'back-apps') {
  return `
    <header class="snack-record-page-header">
      <div>
        <button class="icon-button" type="button" data-record-action="${backAction}" aria-label="返回"><i data-lucide="arrow-left"></i></button>
        <span><strong>${title}</strong><small>${description}</small></span>
      </div>
    </header>
  `;
}

function getFilteredSnackRecordings() {
  const keyword = state.snackRecordQuery.trim().toLowerCase();
  if (!keyword) return snackRecordings;
  return snackRecordings.filter((recording) => `${recording.fileName} ${recording.transcriptFileName || ''} ${recording.transcript || ''}`.toLowerCase().includes(keyword));
}

function getSnackRecordDisplayName(recording) {
  return recording.transcriptFileName || recording.fileName;
}

function getSnackRecordStateMeta(recording) {
  const meta = {
    completed: ['转写完成', 'completed'],
    processing: ['转写中', 'processing'],
    failed: ['转写失败', 'failed'],
    pending: ['待转写', 'pending'],
  };
  return meta[recording.state] || meta.pending;
}

function formatSnackRecordDuration(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  return `${Math.floor(seconds / 60)} 分 ${String(seconds % 60).padStart(2, '0')} 秒`;
}

function formatSnackRecordClock(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function renderSnackRecordLibrary() {
  const recordings = getFilteredSnackRecordings();
  const visibleIds = recordings.map((recording) => recording.id);
  const selectedCount = state.snackRecordSelection.filter((id) => visibleIds.includes(id)).length;
  const allSelected = recordings.length > 0 && selectedCount === recordings.length;
  return `
    <section class="snack-record-page snack-record-library-page" aria-labelledby="snack-record-library-title">
      ${renderSnackRecordPageHeader('我的录音', '本地录音与转写结果')}
      <div class="snack-record-page-body">
        <div class="snack-record-library-toolbar">
          <label class="snack-record-search"><i data-lucide="search"></i><input value="${escapeAttribute(state.snackRecordQuery)}" data-record-search placeholder="搜索录音转写" aria-label="搜索录音转写" /></label>
          <button class="primary-button" type="button" data-record-action="import-audio"><i data-lucide="upload"></i>上传本地音频文件</button>
        </div>
        <div class="snack-record-list-header">
          <label class="snack-record-check"><input type="checkbox" data-record-select-all ${allSelected ? 'checked' : ''} /><span></span></label>
          <div><strong>录音转写列表</strong><em>${recordings.length}</em></div>
          <button type="button" data-record-action="delete-selected" ${selectedCount ? '' : 'disabled'}><i data-lucide="trash-2"></i>删除已选${selectedCount ? ` (${selectedCount})` : ''}</button>
        </div>
        <div class="snack-record-list" role="list" aria-label="本地录音">
          ${recordings.length ? recordings.map(renderSnackRecordRow).join('') : renderSnackRecordEmptyState()}
        </div>
      </div>
    </section>
  `;
}

function renderSnackRecordRow(recording) {
  const [stateLabel, stateClass] = getSnackRecordStateMeta(recording);
  const selected = state.snackRecordSelection.includes(recording.id);
  const completed = recording.state === 'completed';
  const processing = recording.state === 'processing';
  return `
    <article class="snack-record-row ${selected ? 'selected' : ''}" role="listitem" data-record-row="${recording.id}">
      <label class="snack-record-check"><input type="checkbox" data-record-select="${recording.id}" ${selected ? 'checked' : ''} /><span></span></label>
      <span class="snack-record-file-icon"><i data-lucide="file-text"></i></span>
      <div class="snack-record-row-copy">
        <h3>${escapeHtml(getSnackRecordDisplayName(recording))}</h3>
        <p>${escapeHtml(recording.createdLabel)} · ${escapeHtml(recording.fileSize)} · ${formatSnackRecordDuration(recording.durationSeconds)}</p>
        ${processing ? `
          <div class="snack-record-progress-copy"><span>转写中 ${Math.round(recording.progress || 0)}%</span><span>请保持 Snack 开启</span></div>
          <div class="snack-record-progress"><i style="width:${Math.round(recording.progress || 0)}%"></i></div>
        ` : ''}
        ${recording.state === 'failed' ? '<small class="snack-record-error">转写任务未完成，请重新转写。</small>' : ''}
      </div>
      <span class="snack-record-state ${stateClass}">${stateLabel}${processing ? ` ${Math.round(recording.progress || 0)}%` : ''}</span>
      <div class="snack-record-row-actions">
        <button type="button" data-record-action="open-transcript" data-record-id="${recording.id}" title="打开转写文件" aria-label="打开转写文件" ${completed ? '' : 'disabled'}><i data-lucide="file-text"></i></button>
        <button type="button" data-record-action="open-audio" data-record-id="${recording.id}" title="打开录音文件" aria-label="打开录音文件"><i data-lucide="music-2"></i></button>
        ${completed
          ? `<button type="button" data-record-action="open-summary" data-record-id="${recording.id}" title="生成会议纪要" aria-label="生成会议纪要"><i data-lucide="sparkles"></i></button>`
          : `<button type="button" data-record-action="transcribe" data-record-id="${recording.id}" title="开始转写" aria-label="开始转写" ${processing ? 'disabled' : ''}><i data-lucide="${processing ? 'loader-circle' : 'audio-lines'}"></i></button>`}
        <button class="danger" type="button" data-record-action="delete-one" data-record-id="${recording.id}" title="删除" aria-label="删除"><i data-lucide="trash-2"></i></button>
      </div>
    </article>
  `;
}

function renderSnackRecordEmptyState() {
  return `
    <div class="snack-record-empty">
      <i data-lucide="file-audio-2"></i>
      <strong>${snackRecordings.length ? '没有找到匹配的录音转写' : '还没有录音'}</strong>
      <p>${snackRecordings.length ? '换个关键词试试。' : '开始录制或上传本地音频。'}</p>
    </div>
  `;
}

function renderSnackRecordSettings() {
  const config = state.snackRecordConfigDraft;
  const resourceChecking = state.snackRecordResourceStatus === 'checking';
  const resourceReady = state.snackRecordResourceStatus === 'complete';
  const firstTime = !state.snackRecordConfigured;
  return `
    <section class="snack-record-page snack-record-settings-page" aria-labelledby="snack-record-settings-title">
      ${renderSnackRecordPageHeader(firstTime ? 'Snack 会议设置' : 'Snack Record 设置', firstTime ? '配置录音、转写与本地文件保存方式' : '录音、转写与本地文件保存方式', 'back-setup')}
      <div class="snack-record-page-body narrow">
        ${firstTime ? `<section class="snack-record-first-config"><span><i data-lucide="wand-sparkles"></i></span><div><small>首次使用</small><h2>设置你的默认录音方式</h2><p>你可以先完成设置，录音资源包正在同时下载。下载完成后保存配置即可进入录音。</p></div><em class="${resourceChecking ? 'checking' : ''}"><i data-lucide="${resourceChecking ? 'loader-circle' : 'circle-check-big'}"></i>${resourceChecking ? '正在准备' : '可开始录音'}</em></section>` : ''}
        <section class="snack-record-settings-card">
          <header><h2>录音默认配置</h2><p>以下配置将作为会议录制功能的默认设置</p></header>
          <div class="snack-record-setting-list">
            ${renderSnackRecordSelectSetting('界面语言', '录音与转写界面的默认显示语言', 'language', config.language, [['zh', '中文'], ['en', 'English']])}
            ${renderSnackRecordSelectSetting('转写模式', '控制录音结束后的默认转写速度与说话人识别', 'mode', config.mode, [['fast', '快速转写（不区分说话人）'], ['standard', '标准转写（区分说话人）']])}
            ${renderSnackRecordToggleSetting('自动会议提醒', '会议开始后自动发送弹窗提醒', 'autoMeetingReminder', config.autoMeetingReminder)}
            <div class="snack-record-setting-row"><div><strong>录音纪要快捷键配置</strong><p>由 Snack Record 全局监听，当前固定为 Control+R</p></div><kbd>Control + R</kbd></div>
            <div class="snack-record-setting-row"><div><strong>输出位置</strong><p>转写文件和会议纪要的默认保存位置</p></div><div class="snack-record-output"><span>${escapeHtml(config.outputDirectory)}</span><button type="button" data-record-action="choose-output"><i data-lucide="folder-open"></i>选择</button></div></div>
            ${renderSnackRecordToggleSetting('按日期建立文件夹', '每天的录音结果保存到独立日期文件夹', 'organizeByDate', config.organizeByDate)}
          </div>
          <footer><button class="secondary-button" type="button" data-record-action="restore-settings"><i data-lucide="rotate-ccw"></i>恢复默认</button><button class="primary-button" type="button" data-record-action="save-settings" ${firstTime && !resourceReady ? 'disabled' : ''}>${firstTime ? (resourceChecking ? '资源包下载中…' : '保存配置并去录音') : '保存配置'}<i data-lucide="${firstTime ? (resourceChecking ? 'loader-circle' : 'arrow-right') : 'check'}"></i></button></footer>
        </section>
        <section class="snack-record-resource-card">
          <span><i data-lucide="${resourceChecking ? 'package-open' : 'package-check'}"></i></span>
          <div><h2>${resourceChecking ? '正在下载本地资源包' : '本地资源包已下载'}</h2><p>${resourceChecking ? '正在准备语音模型、FFmpeg 和本地运行环境…' : '录音与本地转写所需资源已经准备就绪'}</p>${resourceChecking ? '<div class="snack-record-resource-progress" role="progressbar" aria-label="正在下载 Snack 会议资源包" aria-busy="true"><i></i></div>' : ''}</div>
          <em class="${resourceChecking ? 'checking' : ''}"><i data-lucide="${resourceChecking ? 'loader-circle' : 'circle-check-big'}"></i>${resourceChecking ? '下载中' : '下载完成'}</em>
          ${firstTime ? '' : `<button class="secondary-button" type="button" data-record-action="check-resource" ${resourceChecking ? 'disabled' : ''}>${resourceChecking ? '检测中' : '检测完整性'}</button>`}
        </section>
      </div>
    </section>
  `;
}

function renderSnackRecordSelectSetting(title, description, key, value, options) {
  return `
    <label class="snack-record-setting-row">
      <div><strong>${title}</strong><p>${description}</p></div>
      <select data-record-setting="${key}">${options.map(([optionValue, optionLabel]) => `<option value="${optionValue}" ${value === optionValue ? 'selected' : ''}>${optionLabel}</option>`).join('')}</select>
    </label>
  `;
}

function renderSnackRecordToggleSetting(title, description, key, checked) {
  return `
    <label class="snack-record-setting-row">
      <div><strong>${title}</strong><p>${description}</p></div>
      <span class="snack-record-toggle-copy">${checked ? '开启' : '关闭'}<input class="snack-record-toggle" type="checkbox" data-record-setting="${key}" ${checked ? 'checked' : ''} /></span>
    </label>
  `;
}

function renderSnackRecordAssistantMessage(content, extraClass = '') {
  return `<article class="snack-record-followup-message assistant ${extraClass}"><header class="snack-record-assistant-heading"><span><i data-lucide="sparkles"></i></span><strong>Snack</strong></header><div class="snack-record-followup-bubble">${content}</div></article>`;
}

function renderSnackRecordUserMessage(content) {
  return `<article class="snack-record-followup-message user"><div class="snack-record-followup-bubble">${escapeHtml(content)}</div><span class="snack-record-followup-user">田</span></article>`;
}

function renderSnackRecordFollowupActions(actions) {
  return `<div class="snack-record-followup-actions">${actions.map((action) => `<button class="${action.primary ? 'primary' : ''}" type="button" data-record-action="${action.action}">${action.icon ? `<i data-lucide="${action.icon}"></i>` : ''}${action.label}</button>`).join('')}</div>`;
}

function renderSnackRecordProjectChoiceCard() {
  return `
    <section class="snack-record-project-choice-card" aria-label="选择是否用项目继续跟进">
      <header>
        <div><h3>是否用项目继续跟进？</h3><p>Snack 已根据会议内容整理好一个项目。</p></div>
        <span>1 of 2</span>
      </header>
      <div class="snack-record-project-choice-options" role="group" aria-label="项目跟进方式">
        <button class="recommended" type="button" data-record-action="followup-track">
          <span class="snack-record-project-choice-index">1</span>
          <span class="snack-record-project-choice-copy"><strong>用项目继续跟进 <em>推荐</em></strong><small>项目目标、相关成员和跟进规则已经从纪要中自动整理。</small></span>
          <i data-lucide="arrow-right"></i>
        </button>
        <button type="button" data-record-action="followup-save-only">
          <span class="snack-record-project-choice-index">2</span>
          <span class="snack-record-project-choice-copy"><strong>只保留会议纪要</strong><small>不进入持续跟进，之后仍可从纪要创建项目。</small></span>
          <i data-lucide="arrow-right"></i>
        </button>
      </div>
    </section>
  `;
}

function renderSnackRecordPreparedProjectCard(project) {
  const memberCount = getProjectCollaborators(project).length;
  const monitoringCount = (project.monitoringRules || []).length;
  return `
    <button
      class="snack-record-prepared-project ${state.snackRecordProjectDetailOpen ? 'active' : ''}"
      type="button"
      data-record-action="open-summary-project-detail"
      aria-controls="recordSummaryProjectDetail"
      aria-expanded="${state.snackRecordProjectDetailOpen ? 'true' : 'false'}"
    >
      <span class="snack-record-prepared-project-icon"><i data-lucide="folder-kanban"></i></span>
      <span class="snack-record-prepared-project-main">
        <small>已根据会议内容准备</small>
        <strong>${escapeHtml(project.title)}</strong>
        <em>${escapeHtml(project.objective || project.summary)}</em>
        <span class="snack-record-prepared-project-meta">
          <span><i data-lucide="users"></i>${memberCount} 位成员</span>
          <span><i data-lucide="list-checks"></i>3 个行动项</span>
          <span><i data-lucide="activity"></i>${monitoringCount} 个指标</span>
        </span>
      </span>
      <span class="snack-record-prepared-project-action">
        <em>查看详情</em>
        <i data-lucide="panel-right-open"></i>
      </span>
    </button>
  `;
}

function renderSnackRecordConversationComposer() {
  return `
    <div class="composer project-composer snack-record-conversation-composer">
      <textarea name="record-summary-message" placeholder="有什么问题尽管问我"></textarea>
      <div class="button-row">
        <div class="chip-row"><button class="icon-button" type="button" aria-label="添加附件或工具"><i data-lucide="plus"></i></button></div>
        <div class="chip-row composer-model-row">${renderModelSelector()}<button class="primary-button send-round" type="button" data-toast="消息已发送" aria-label="发送"><i data-lucide="arrow-up"></i></button></div>
      </div>
    </div>
  `;
}

function renderSnackRecordMessageActions() {
  return `
    <div class="snack-record-message-actions" aria-label="会议纪要消息操作">
      <button type="button" data-record-action="copy-summary" aria-label="复制纪要" title="复制纪要"><i data-lucide="copy"></i></button>
      <button type="button" data-record-action="reply-summary" aria-label="回复" title="回复"><i data-lucide="reply"></i></button>
      <button type="button" data-record-action="forward-summary" aria-label="转发" title="转发"><i data-lucide="forward"></i></button>
      <button type="button" data-record-action="share-summary-image" aria-label="分享为图片" title="分享为图片" data-tooltip="分享为图片"><i data-lucide="share-2"></i></button>
      <button type="button" data-record-action="more-summary" aria-label="更多操作" title="更多操作"><i data-lucide="ellipsis"></i></button>
      <span></span><time datetime="2026-08-02T15:41:45+08:00">15:41:45</time>
    </div>
  `;
}

function renderSnackRecordContextPicker(disabled = false) {
  const selectedContexts = state.snackRecordFollowupContexts || [];
  const selectedIds = new Set(selectedContexts.map((context) => context.id));
  return `
    <div class="snack-record-draft-field">
      <small>项目上下文</small>
      <div class="snack-record-context-picker ${state.snackRecordContextPickerOpen ? 'open' : ''}" data-record-context-picker>
        <div class="snack-record-draft-selection" aria-live="polite">
          ${selectedContexts.length ? selectedContexts.map((context) => `
            <span class="snack-record-draft-chip context ${context.kind === 'local' ? 'local' : 'cloud'}">
              <i data-lucide="${context.kind === 'local' ? 'folder' : 'cloud'}"></i>
              <strong>${escapeHtml(context.name)}</strong>
              ${disabled ? '' : `<button type="button" aria-label="移除项目上下文 ${escapeAttribute(context.name)}" data-record-action="remove-record-context" data-record-context-id="${escapeAttribute(context.id)}"><i data-lucide="x"></i></button>`}
            </span>
          `).join('') : '<span class="snack-record-draft-empty">暂未添加项目上下文</span>'}
          ${disabled ? '' : `
            <button class="snack-record-draft-add" type="button" data-record-action="toggle-record-context-picker" aria-haspopup="listbox" aria-expanded="${state.snackRecordContextPickerOpen ? 'true' : 'false'}">
              <i data-lucide="plus"></i>添加上下文<i data-lucide="${state.snackRecordContextPickerOpen ? 'chevron-up' : 'chevron-down'}"></i>
            </button>
          `}
        </div>
        ${disabled ? '' : '<input id="snackRecordLocalContextInput" class="snack-record-local-context-input" type="file" data-record-local-context-input webkitdirectory directory multiple />'}
        ${!disabled && state.snackRecordContextPickerOpen ? `
          <section class="snack-record-draft-options snack-record-context-options" role="listbox" aria-label="可选择的项目上下文" aria-multiselectable="true">
            <header>
              <span>项目上下文</span>
              <span class="snack-record-draft-options-actions"><small>可多选</small><button type="button" data-record-action="close-record-context-picker"><i data-lucide="check"></i>完成</button></span>
            </header>
            <div class="snack-record-draft-option-group">
              <p>云端文件夹</p>
              ${snackRecordCloudContextOptions.map((context) => {
    const selected = selectedIds.has(context.id);
    return `
                  <button class="snack-record-draft-option ${selected ? 'selected' : ''}" type="button" role="option" aria-selected="${selected ? 'true' : 'false'}" data-record-action="toggle-record-cloud-context" data-record-context-id="${escapeAttribute(context.id)}">
                    <span><i data-lucide="cloud"></i></span>
                    <span><strong>${escapeHtml(context.name)}</strong><small>${escapeHtml(context.path)}</small></span>
                    <i data-lucide="${selected ? 'check' : 'plus'}"></i>
                  </button>
                `;
  }).join('')}
            </div>
            <div class="snack-record-draft-option-group local">
              <p>本地</p>
              <label class="snack-record-draft-option" for="snackRecordLocalContextInput">
                <span><i data-lucide="folder-open"></i></span>
                <span><strong>选择本地文件夹</strong><small>仅记录目录名称，本 Demo 不上传文件</small></span>
                <i data-lucide="chevron-right"></i>
              </label>
            </div>
          </section>
        ` : ''}
      </div>
    </div>
  `;
}

function getSnackRecordMemberDirectory() {
  const directory = new Map();
  const addMember = (member) => {
    if (!member?.name || member.name === 'Snack') return;
    if (!directory.has(member.name)) directory.set(member.name, member);
  };
  addMember({ name: currentUserName, isAgent: false, role: '项目发起人' });
  getProjectMemberDirectory().forEach(addMember);
  return [...directory.values()];
}

function renderSnackRecordMemberPicker(disabled = false) {
  const selectedMembers = state.snackRecordFollowupMembers || [];
  const selectedNames = new Set(selectedMembers.map((member) => member.name));
  const query = state.snackRecordMemberQuery.trim().toLowerCase();
  const options = getSnackRecordMemberDirectory()
    .filter((member) => !selectedNames.has(member.name))
    .filter((member) => !query || `${member.name} ${member.role} ${member.isAgent ? 'agent 智能体' : '人员 同事'}`.toLowerCase().includes(query));
  return `
    <div class="snack-record-draft-field">
      <small>成员</small>
      <div class="snack-record-member-picker ${state.snackRecordMemberPickerOpen ? 'open' : ''}" data-record-member-picker>
        <div class="snack-record-draft-selection" aria-live="polite">
          <span class="snack-record-draft-chip member agent fixed"><i data-lucide="sparkles"></i><strong>Snack</strong><em>默认加入</em></span>
          ${selectedMembers.map((member) => `
            <span class="snack-record-draft-chip member ${member.isAgent ? 'agent' : 'human'}">
              <i data-lucide="${member.isAgent ? 'bot' : 'user-round'}"></i>
              <strong>${escapeHtml(member.name)}</strong>
              ${disabled ? '' : `<button type="button" aria-label="移除成员 ${escapeAttribute(member.name)}" data-record-action="remove-record-member" data-record-member="${escapeAttribute(member.name)}"><i data-lucide="x"></i></button>`}
            </span>
          `).join('')}
          ${disabled ? '' : `
            <button class="snack-record-draft-add" type="button" data-record-action="toggle-record-member-picker" aria-haspopup="listbox" aria-expanded="${state.snackRecordMemberPickerOpen ? 'true' : 'false'}">
              <i data-lucide="user-plus"></i>添加成员<i data-lucide="${state.snackRecordMemberPickerOpen ? 'chevron-up' : 'chevron-down'}"></i>
            </button>
          `}
        </div>
        ${!disabled && state.snackRecordMemberPickerOpen ? `
          <section class="snack-record-draft-options snack-record-member-options" role="listbox" aria-label="人员与 Agent" aria-multiselectable="true">
            <header>
              <span>人员与 Agent</span>
              <span class="snack-record-draft-options-actions"><small>${options.length} 个结果</small><button type="button" data-record-action="close-record-member-picker"><i data-lucide="check"></i>完成</button></span>
            </header>
            <label class="snack-record-member-search"><i data-lucide="search"></i><input type="search" value="${escapeAttribute(state.snackRecordMemberQuery)}" data-record-member-search placeholder="搜索人员或 Agent" autocomplete="off" /></label>
            <div class="snack-record-draft-option-list">
              ${options.length ? options.map((member) => `
                <button class="snack-record-draft-option" type="button" role="option" data-record-action="select-record-member" data-record-member="${escapeAttribute(member.name)}">
                  <span><i data-lucide="${member.isAgent ? 'bot' : 'user-round'}"></i></span>
                  <span><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(member.role)}</small></span>
                  <em>${member.isAgent ? 'Agent' : '人员'}</em>
                  <i data-lucide="plus"></i>
                </button>
              `).join('') : '<p class="snack-record-draft-no-results">没有找到匹配的人员或 Agent</p>'}
            </div>
          </section>
        ` : ''}
      </div>
    </div>
  `;
}

function toggleSnackRecordCloudContext(contextId) {
  const context = snackRecordCloudContextOptions.find((item) => item.id === contextId);
  if (!context) return;
  const selected = state.snackRecordFollowupContexts || [];
  state.snackRecordFollowupContexts = selected.some((item) => item.id === context.id)
    ? selected.filter((item) => item.id !== context.id)
    : [...selected, { ...context }];
  state.snackRecordContextPickerOpen = true;
  renderSnackRecordDraftUpdate();
}

function removeSnackRecordContext(contextId) {
  state.snackRecordFollowupContexts = state.snackRecordFollowupContexts.filter((context) => context.id !== contextId);
  renderSnackRecordDraftUpdate();
}

function handleSnackRecordLocalContextSelection(input) {
  const files = [...(input.files || [])];
  if (!files.length) return;
  const folders = new Map();
  files.forEach((file) => {
    const relativePath = String(file.webkitRelativePath || file.name || '');
    const [folderName] = relativePath.split('/').filter(Boolean);
    if (!folderName) return;
    const id = `local:${folderName}`;
    const folder = folders.get(id) || { id, name: folderName, path: `本地 / ${folderName}`, kind: 'local', fileCount: 0 };
    folder.fileCount += 1;
    folders.set(id, folder);
  });
  const nextContexts = new Map(state.snackRecordFollowupContexts.map((context) => [context.id, context]));
  folders.forEach((context, id) => nextContexts.set(id, context));
  state.snackRecordFollowupContexts = [...nextContexts.values()];
  state.snackRecordContextPickerOpen = false;
  renderSnackRecordDraftUpdate();
}

function selectSnackRecordMember(name) {
  const member = getSnackRecordMemberDirectory().find((item) => item.name === name);
  if (!member || state.snackRecordFollowupMembers.some((item) => item.name === member.name)) return;
  state.snackRecordFollowupMembers = [...state.snackRecordFollowupMembers, member];
  state.snackRecordMemberQuery = '';
  state.snackRecordMemberPickerOpen = true;
  renderSnackRecordDraftUpdate({ focusMemberSearch: true });
}

function removeSnackRecordMember(name) {
  state.snackRecordFollowupMembers = state.snackRecordFollowupMembers.filter((member) => member.name !== name);
  renderSnackRecordDraftUpdate();
}

function focusSnackRecordMemberSearch() {
  window.requestAnimationFrame(() => {
    const input = document.querySelector('[data-record-member-search]');
    if (!(input instanceof HTMLInputElement)) return;
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

function renderSnackRecordDraftUpdate({ focusMemberSearch = false } = {}) {
  renderSnackRecordFollowupUpdate({ focusMemberSearch });
}

function renderSnackRecordFollowupUpdate({ focusMemberSearch = false, revealCurrentStep = false } = {}) {
  const thread = document.querySelector('[data-record-followup-thread]');
  const previousScrollTop = thread instanceof HTMLElement ? thread.scrollTop : null;
  render();
  const nextThread = document.querySelector('[data-record-followup-thread]');
  if (previousScrollTop !== null && nextThread instanceof HTMLElement) {
    nextThread.style.scrollBehavior = 'auto';
    nextThread.scrollTop = Math.min(previousScrollTop, Math.max(0, nextThread.scrollHeight - nextThread.clientHeight));
    window.requestAnimationFrame(() => {
      if (!nextThread.isConnected) return;
      nextThread.style.removeProperty('scroll-behavior');
      if (!revealCurrentStep) return;
      const currentStep = nextThread.querySelector('.snack-record-followup-message.is-current-step');
      if (!(currentStep instanceof HTMLElement)) return;
      const threadRect = nextThread.getBoundingClientRect();
      const stepRect = currentStep.getBoundingClientRect();
      const targetTop = Math.min(
        nextThread.scrollHeight - nextThread.clientHeight,
        nextThread.scrollTop + Math.max(0, stepRect.top - threadRect.top - 24),
      );
      if (targetTop > nextThread.scrollTop + 1) nextThread.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  }
  if (focusMemberSearch) focusSnackRecordMemberSearch();
}

function createSnackRecordFollowupProject() {
  const existingProject = getProjectById(state.snackRecordSummaryProjectId);
  if (existingProject) return existingProject;
  const recording = snackRecordings.find((item) => item.id === state.snackRecordSummaryId);
  if (!recording) return null;
  const serial = state.projectSerial;
  const projectId = `meeting-followup-${serial}`;
  const sessionId = `record-summary-${recording.id}`;
  const project = buildNewProject(projectId, serial);
  project.title = state.snackRecordFollowupProjectName.trim() || 'AI 营销增长系统';
  project.summary = 'AI 营销增长周会纪要与后续跟进';
  project.objective = '提升新用户首日完成率，用 20% 流量验证新版 onboarding 引导，并在周五复盘转化与次日留存。';
  project.scenario = '会议跟进';
  project.health = '准备中';
  project.operatingRules = [
    ['会议结论', '会议纪要和原始转写作为项目初始依据，关键结论可回溯。'],
    ['行动项', '负责人和截止时间由 Snack 从会议内容中整理，写入 Task Hub 前仍需确认。'],
    ['实验复盘', '周五汇总 onboarding 转化与次日留存，形成下一次会议的会前简报。'],
  ];
  project.monitoringRules = [
    { metric: 'onboarding 完成率', operator: '≥', value: '55', unit: '%', type: 'meeting', source: '会议目标：onboarding 完成率达到 55%' },
    { metric: '新用户次日留存', operator: '≥', value: '38', unit: '%', type: 'meeting', source: '会议目标：新用户次日留存达到 38%' },
  ];
  project.pushRule = '周五复盘实验转化与次日留存；涉及任务创建和执行的动作仍由田晓柔确认。';
  const selectedContexts = (state.snackRecordFollowupContexts || []).length
    ? state.snackRecordFollowupContexts.map((context) => ({ ...context }))
    : [{
      id: `meeting:${recording.id}`,
      name: '会议纪要｜AI 营销增长周会',
      path: '本次会议 / 纪要与原始转写',
      kind: 'meeting',
      fileCount: 2,
    }];
  const selectedMembers = (state.snackRecordFollowupMembers || []).length
    ? state.snackRecordFollowupMembers.map((member) => ({ ...member }))
    : [
      { name: currentUserName, isAgent: false, role: '项目发起人' },
      { name: '陆铭', isAgent: false, role: '内容负责人' },
      { name: '林可', isAgent: false, role: '数据负责人' },
    ];
  const selectedPeople = selectedMembers.filter((member) => !member.isAgent);
  const selectedAgents = selectedMembers.filter((member) => member.isAgent);
  project.wikiTopics = selectedContexts.filter((context) => context.kind === 'cloud').map((context) => context.name);
  project.sourceFolders = selectedContexts.map((context) => ({
    name: context.name,
    path: context.path,
    kind: context.kind,
    fileCount: context.fileCount ?? null,
  }));
  project.members = selectedPeople.map((member) => member.name);
  project.agents = ['Snack', ...selectedAgents.map((member) => member.name)];
  project.rememberedPeople = [
    ...selectedPeople.map((member) => {
      if (member.name === currentUserName) return [member.name, '项目发起人，负责目标确认和执行授权'];
      if (member.name === '陆铭') return [member.name, '负责 onboarding 引导稿，计划周三前完成'];
      if (member.name === '林可') return [member.name, '负责激活率数据口径与历史基线'];
      return [member.name, '受邀项目成员，参与项目协作和任务确认'];
    }),
    ...selectedAgents.map((member) => [member.name, `受邀 ${member.role}，按项目任务节点处理对应工作`]),
  ];
  project.sessions = [{
    id: sessionId,
    title: '会议纪要｜AI 营销增长周会',
    with: 'Snack',
    updated: '刚刚',
    icon: 'file-text',
    kind: 'record-summary',
    recordingId: recording.id,
    messages: [],
  }];
  state.projectSerial += 1;
  projectFolders.unshift(project);
  recording.summaryProjectId = projectId;
  state.snackRecordSummaryProjectId = projectId;
  state.activeProject = projectId;
  state.activeSession = sessionId;
  state.activeLooseSession = null;
  state.composerProjectId = projectId;
  state.collapsedProjects = state.collapsedProjects.filter((id) => id !== projectId);
  return project;
}

function writeSnackRecordTasksToTaskHub() {
  const project = getProjectById(state.snackRecordSummaryProjectId);
  if (!project) return [];
  const allocatedCodes = new Set(issues.map((issue) => issue.code));
  const getAvailableCode = (preferredCode) => {
    if (!allocatedCodes.has(preferredCode)) {
      allocatedCodes.add(preferredCode);
      return preferredCode;
    }
    let serial = 1;
    let code = '';
    do {
      code = `REC-${String(serial).padStart(3, '0')}`;
      serial += 1;
    } while (allocatedCodes.has(code));
    allocatedCodes.add(code);
    return code;
  };
  const resolvedTasks = snackRecordTaskCandidates.map((task) => {
    const existingIssue = issues.find((issue) => issue.projectId === project.id
      && issue.issueType === '会议行动项'
      && issue.title === task.title);
    return { task, issue: existingIssue || null, code: existingIssue?.code || getAvailableCode(task.code) };
  });
  const createdIssues = [];
  resolvedTasks.forEach(({ task, code, issue: existingIssue }) => {
    let issue = existingIssue;
    if (!issue) {
      issue = {
        code,
        title: task.title,
        projectId: project.id,
        status: 'backlog',
        issueType: '会议行动项',
        owner: task.owner,
        reviewer: currentUserName,
        priority: 'P1',
        stage: '待开始',
        tag: '会议行动项',
        desc: task.desc,
        count: '0/3',
        dueDate: task.dueDate,
        dueLabel: task.dueLabel,
        predecessor: null,
        relatedTasks: resolvedTasks.filter((item) => item.code !== code).map((item) => item.code),
        source: `AI 营销增长周会 ${task.evidenceTime}`,
        nodes: [
          { title: '任务执行', state: 'active', detail: `${task.owner} 负责推进，计划于${task.dueLabel}完成。` },
          { title: '结果提交', state: 'waiting', detail: '完成后将结果与证据回写到当前任务。' },
          { title: '会议复盘', state: 'waiting', detail: '在下次增长周会中复盘结果并确认后续动作。' },
        ],
        evidence: [`AI 营销增长周会原始转写 ${task.evidenceTime}`, '用户确认写入 Task Hub'],
        artifacts: ['会议纪要', '原始转写证据'],
        activity: [
          ['Snack', `从会议纪要 ${task.evidenceTime} 提取行动项。`, '刚刚'],
          [currentUserName, `确认写入 Task Hub；负责人：${task.owner}；截止：${task.dueLabel}。`, '刚刚'],
        ],
        comments: [],
        logs: [`来源：AI 营销增长周会 ${task.evidenceTime}`, `负责人：${task.owner}`, `截止时间：${task.dueDate}`],
      };
      issues.push(issue);
    }
    if (!project.taskCodes.includes(issue.code)) project.taskCodes.push(issue.code);
    createdIssues.push(issue);
  });
  project.health = '推进中';
  return createdIssues;
}

function focusSnackRecordConversationComposer() {
  window.requestAnimationFrame(() => {
    const input = document.querySelector('textarea[name="record-summary-message"]');
    if (input instanceof HTMLTextAreaElement) input.focus();
  });
}

function renderSnackRecordSummary() {
  const recording = snackRecordings.find((item) => item.id === state.snackRecordSummaryId) || snackRecordings.find((item) => item.state === 'completed');
  if (!recording) return renderSnackRecordLibrary();
  const generating = state.snackRecordSummaryStatus === 'generating';
  const complete = state.snackRecordSummaryStatus === 'complete';
  const answers = state.snackRecordFollowupAnswers;
  const step = state.snackRecordFollowupStep;
  const tracking = answers.tracking === '用项目继续跟进';
  const projectName = state.snackRecordFollowupProjectName.trim() || 'AI 营销增长系统';
  const preparedProject = getProjectById(state.snackRecordSummaryProjectId);
  const progress = complete ? 100 : Math.max(12, Math.round(recording.progress || 12));
  const messages = [];

  if (generating) {
    messages.push(renderSnackRecordAssistantMessage(`
      <div class="snack-record-analysis-status active"><span><i></i>正在分析录音并生成会议纪要</span><em>${progress}%</em></div>
      <p class="snack-record-analysis-copy">转写和纪要会在当前会话中生成。</p>
    `, 'is-processing'));
  }

  if (complete) {
    const transcriptFileName = recording.transcriptFileName || recording.fileName.replace(/\.[^.]+$/, '.txt');
    messages.push(renderSnackRecordAssistantMessage(`
      <div class="snack-record-analysis-status"><span><i></i>分析完成</span><i data-lucide="chevron-right"></i></div>
      <p class="snack-record-analysis-copy">会议纪要已生成，录音转写原文 TXT 已发送给你。</p>
      <button class="snack-record-transcript-delivery" type="button" data-record-action="download-transcript" data-record-id="${escapeAttribute(recording.id)}" aria-label="下载录音转写原文 ${escapeAttribute(transcriptFileName)}">
        <span><i data-lucide="file-text"></i></span>
        <span><strong>${escapeHtml(transcriptFileName)}</strong><small>TXT · 完整录音转写原文</small></span>
        <em>下载</em>
        <i data-lucide="download"></i>
      </button>
      <article class="snack-record-minutes-document">
        <h2>会议纪要｜AI 营销增长周会</h2>
        <p class="snack-record-minutes-meta">时间：2026-08-02 23:10<br />时长：${formatSnackRecordDuration(recording.durationSeconds)}</p>
        <section><h3>核心结论</h3><p>本周以新用户首日完成率为核心目标，先用 20% 流量验证新版 onboarding 引导。</p></section>
        <section><h3>行动项</h3><ol><li><span>周三前完成 onboarding 引导稿</span><em>陆铭</em></li><li><span>补齐激活率数据口径与历史基线</span><em>林可</em></li><li><span>周五复盘实验转化和次日留存</span><em>田晓柔</em></li></ol></section>
      </article>
      ${renderSnackRecordMessageActions()}
    `));
  }

  if (answers.tracking) messages.push(renderSnackRecordUserMessage(answers.tracking));

  if (tracking && step >= 2 && preparedProject) {
    messages.push(renderSnackRecordAssistantMessage(`
      <p>我已经根据会议内容准备好了项目“${escapeHtml(projectName)}”。项目目标、相关成员、会议资料和跟进规则都已整理完成；点击项目卡，可以直接在当前会话右侧查看和调整。</p>
      ${renderSnackRecordPreparedProjectCard(preparedProject)}
    `, 'is-current-step'));
  }

  if (step >= 7) {
    messages.push(renderSnackRecordAssistantMessage(`
      <div class="snack-record-followup-finished"><span><i data-lucide="circle-check-big"></i></span><div><strong>会议纪要已保留在当前会话</strong><p>你可以继续询问纪要内容，也可以之后再从这份纪要创建项目。</p></div></div>
      ${renderSnackRecordFollowupActions([{ action: 'back-library', label: '返回我的录音', icon: 'folder-clock', primary: true }])}
    `, step === 7 ? 'is-current-step' : ''));
  }

  return `
    <section class="project-chat-shell standalone-chat-shell snack-record-summary-page ${state.snackRecordProjectDetailOpen && preparedProject ? 'project-detail-open' : ''}" aria-label="独立会议纪要会话" data-conversation-scope="standalone">
      <section class="project-chat-main snack-record-conversation-main">
        <header class="project-chat-header snack-record-conversation-header"><div class="project-chat-title"><span><h2>会议纪要：AI 营销增长周会</h2></span></div></header>
        <div class="snack-record-followup-thread" data-record-followup-thread><div class="snack-record-conversation-inner">${messages.join('')}</div></div>
        <div class="snack-record-conversation-dock"><div class="snack-record-conversation-dock-inner">${complete && step === 1 ? renderSnackRecordProjectChoiceCard() : ''}${renderSnackRecordConversationComposer()}</div></div>
      </section>
      ${state.snackRecordProjectDetailOpen && preparedProject ? renderProjectDetailPanel(preparedProject, { context: 'record-summary' }) : ''}
    </section>
  `;
}

function renderSnackRecordOverlays() {
  return [
    state.snackRecordNativeOpen ? renderSnackRecordNativeWindow() : '',
    state.snackRecordActive ? renderSnackRecordFloatingCard() : '',
    state.snackRecordSetupOpen ? renderSnackRecordSetupDialog() : '',
    state.snackRecordDeleteIds.length ? renderSnackRecordDeleteConfirmation() : '',
    state.snackRecordTranscriptId ? renderSnackRecordTranscriptPreview() : '',
  ].join('');
}

function renderSnackRecordSetupDialog() {
  const success = state.snackRecordSetupPhase === 'success';
  return `
    <section class="snack-record-setup-layer" aria-label="Snack Record 资源检测">
      <article class="snack-record-setup-dialog" role="dialog" aria-modal="true" aria-labelledby="snack-record-setup-title">
        <header>
          <h2 id="snack-record-setup-title">${success ? 'Snack Record 资源可用' : '正在检测 Snack Record 资源'}</h2>
          <p>${success ? '已复用本机 Snack Record 的本地转写资源。' : '正在读取本机已安装的运行时、语音模型和 FFmpeg。'}</p>
        </header>
        <div>
          <span class="snack-record-setup-icon"><i data-lucide="${success ? 'circle-check-big' : 'loader-circle'}"></i></span>
          <p>${success ? '无需再次下载资源包，可以继续配置录音功能。' : '检测只读取 Snack Record 的本地资源目录，不会发起下载。'}</p>
          ${success ? '' : '<div class="snack-record-setup-progress" role="progressbar" aria-label="正在检测 Snack Record 资源" aria-busy="true"><i></i></div>'}
        </div>
        <footer><button class="primary-button" type="button" disabled>${success ? '检测完成' : '正在检测，请稍候'}</button></footer>
      </article>
    </section>
  `;
}

function renderSnackRecordNativeWindow() {
  const active = state.snackRecordActive;
  return `
    <section class="snack-record-native-layer" aria-label="Snack Record 原生窗口">
      <article class="snack-record-native-window ${state.snackRecordNativeMaximized ? 'maximized' : ''}" role="dialog" aria-modal="true" aria-label="Snack Record">
        <header class="snack-record-native-titlebar">
          <span class="snack-record-traffic-lights">
            <button type="button" data-record-action="close-native" aria-label="关闭 Snack Record" title="关闭"></button>
            <button type="button" data-record-action="minimize-native" aria-label="最小化 Snack Record" title="最小化"></button>
            <button type="button" data-record-action="toggle-native-size" aria-label="最大化 Snack Record" title="最大化"></button>
          </span>
          <strong>Snack Record</strong>
          <span></span>
        </header>
        <div class="snack-record-native-body">
          <section class="snack-record-native-hero">
            <span class="snack-record-native-app-icon"><i data-lucide="mic-2"></i></span>
            <div><h2>Snack Record</h2><p>RECORD&nbsp;&nbsp;·&nbsp;&nbsp;本地会议录音与转写</p></div>
            <button class="snack-record-native-settings" type="button" data-record-action="open-settings" aria-label="设置" title="设置"><i data-lucide="settings-2"></i></button>
            <button class="snack-record-native-control ${active ? 'stop' : ''}" type="button" data-record-action="${active ? 'stop-recording' : 'start-recording'}" aria-label="${active ? '停止录音并转写' : '开始会议录音'}" title="${active ? '停止录音并转写' : '开始会议录音（Control+R）'}"><i data-lucide="${active ? 'square' : 'mic-2'}"></i></button>
          </section>
          <p class="snack-record-native-status">${active ? '正在录制系统音频与麦克风' : '点击录音或按 Control+R 开始'}</p>
          <section class="snack-record-native-tasks">
            <header>
              <div><i data-lucide="mic-2"></i><strong>转写任务</strong></div>
              <span><button class="snack-record-native-import" type="button" data-record-action="native-import-audio"><i data-lucide="upload"></i>上传本地音频文件</button><button class="snack-record-native-clear" type="button" data-record-action="native-clear" aria-label="清空转写任务" title="清空转写任务"><i data-lucide="trash-2"></i></button></span>
            </header>
            <div>${snackRecordings.slice(0, 4).map(renderSnackRecordNativeTask).join('') || '<p class="snack-record-native-empty">录音结束后，转写任务会显示在这里</p>'}</div>
          </section>
        </div>
      </article>
    </section>
  `;
}

function renderSnackRecordNativeTask(recording) {
  const [label] = getSnackRecordStateMeta(recording);
  return `
    <article class="snack-record-native-task" data-native-record-id="${recording.id}">
      <div><strong>${escapeHtml(getSnackRecordDisplayName(recording))}</strong><small>${recording.state === 'completed' ? '已完成 · 本地有效' : recording.state === 'processing' ? `快速转写 · ${Math.round(recording.progress || 0)}% · 正在本机处理` : label}</small></div>
      <span class="snack-record-native-task-actions">
        ${recording.state !== 'processing' ? `<button type="button" data-record-action="transcribe" data-record-id="${recording.id}" aria-label="重新转写" title="重新转写"><i data-lucide="rotate-cw"></i></button>` : '<i class="snack-record-native-spinner"></i>'}
        <button type="button" data-record-action="open-transcript" data-record-id="${recording.id}" aria-label="打开转写文件" title="打开转写文件" ${recording.state === 'completed' ? '' : 'disabled'}><i data-lucide="file-text"></i></button>
        <button type="button" data-record-action="open-summary" data-record-id="${recording.id}" aria-label="生成会议纪要" title="生成会议纪要" ${recording.state === 'completed' ? '' : 'disabled'}><i data-lucide="sparkles"></i></button>
      </span>
    </article>
  `;
}

function renderSnackRecordFloatingCard() {
  return `
    <aside class="snack-record-floating-card" aria-label="Snack Record 正在录音">
      <button class="snack-record-floating-main" type="button" data-record-action="open-native">
        <span class="snack-record-floating-record-icon"><i data-lucide="circle-dot"></i></span>
        <span><strong>正在录制会议</strong><small class="snack-record-floating-time">${formatSnackRecordClock(state.snackRecordSeconds)}</small></span>
      </button>
      <button class="snack-record-floating-stop" type="button" data-record-action="stop-recording" aria-label="停止录音并转写" title="停止录音并转写"><i data-lucide="square"></i></button>
    </aside>
  `;
}

function renderSnackRecordDeleteConfirmation() {
  const names = state.snackRecordDeleteIds
    .map((id) => snackRecordings.find((recording) => recording.id === id))
    .filter(Boolean)
    .map(getSnackRecordDisplayName);
  return `
    <section class="snack-record-dialog-layer">
      <article class="snack-record-confirm-dialog" role="dialog" aria-modal="true" aria-label="删除录音">
        <span><i data-lucide="trash-2"></i></span>
        <h3>${names.length > 1 ? `删除 ${names.length} 条录音？` : '删除录音？'}</h3>
        <p>${names.length > 1 ? '将同时删除所选录音及其 mock 本地文件。' : `确定删除“${escapeHtml(names[0] || '这条录音')}”及其 mock 本地文件吗？`}</p>
        <footer><button class="secondary-button" type="button" data-record-action="cancel-delete">取消</button><button class="snack-record-danger-button" type="button" data-record-action="confirm-delete">删除</button></footer>
      </article>
    </section>
  `;
}

function renderSnackRecordTranscriptPreview() {
  const recording = snackRecordings.find((item) => item.id === state.snackRecordTranscriptId);
  if (!recording) return '';
  return `
    <section class="snack-record-dialog-layer">
      <article class="snack-record-transcript-dialog" role="dialog" aria-modal="true" aria-label="转写文件预览">
        <header><div><small>本地转写文件 · mock 预览</small><h3>${escapeHtml(recording.transcriptFileName || recording.fileName)}</h3></div><button class="icon-button" type="button" data-record-action="close-transcript" aria-label="关闭"><i data-lucide="x"></i></button></header>
        <pre>${escapeHtml(recording.transcript || '这条录音还没有可用的转写内容。')}</pre>
        <footer><span><i data-lucide="hard-drive"></i>模拟本地文件，不会读取真实录音</span><button class="primary-button" type="button" data-record-action="open-summary" data-record-id="${recording.id}"><i data-lucide="sparkles"></i>生成会议纪要</button></footer>
      </article>
    </section>
  `;
}

function startSnackRecordSetup() {
  state.snackRecordSetupReturnView = state.view === 'chat' ? 'chat' : 'apps';
  state.snackRecordNativeOpen = false;
  state.snackRecordSetupOpen = false;
  state.snackRecordSetupPhase = 'idle';
  state.snackRecordConfigDraft = { ...state.snackRecordConfig };
  state.view = 'recordSettings';
  if (state.snackRecordInstalled) {
    state.snackRecordResourceStatus = 'complete';
    render();
    return;
  }
  if (snackRecordSetupTimerId !== null) window.clearTimeout(snackRecordSetupTimerId);
  state.snackRecordResourceStatus = 'checking';
  render();
  snackRecordSetupTimerId = window.setTimeout(() => {
    snackRecordSetupTimerId = null;
    state.snackRecordInstalled = true;
    state.snackRecordResourceStatus = 'complete';
    render();
    showToast('资源包下载完成，保存配置后即可开始录音');
  }, 2200);
}

function startSnackRecordMock() {
  if (state.snackRecordActive) return;
  state.snackRecordActive = true;
  state.snackRecordSeconds = 0;
  state.snackRecordNativeOpen = true;
  stopSnackRecordTimer();
  snackRecordTimerId = window.setInterval(() => {
    state.snackRecordSeconds += 1;
    document.querySelectorAll('.snack-record-floating-time').forEach((node) => {
      node.textContent = formatSnackRecordClock(state.snackRecordSeconds);
    });
  }, 1000);
  render();
  showToast('Snack Record 已开始模拟录音');
}

function stopSnackRecordTimer() {
  if (snackRecordTimerId === null) return;
  window.clearInterval(snackRecordTimerId);
  snackRecordTimerId = null;
}

function stopSnackRecordMock() {
  if (!state.snackRecordActive) return;
  stopSnackRecordTimer();
  const now = new Date();
  const label = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
  const recording = {
    id: `record-mock-${Date.now()}`,
    fileName: `临时录音 2026-08-02 ${label}.wav`,
    transcriptFileName: null,
    createdLabel: '刚刚',
    durationSeconds: Math.max(3, state.snackRecordSeconds),
    fileSize: `${Math.max(1.2, state.snackRecordSeconds * 0.08).toFixed(1)} MB`,
    state: 'processing',
    progress: 8,
    transcript: '',
  };
  snackRecordings.unshift(recording);
  state.snackRecordActive = false;
  state.snackRecordSeconds = 0;
  state.snackRecordNativeOpen = false;
  openSnackRecordSummary(recording.id);
  showToast('录音已停止，正在同步生成转写与会议纪要');
}

function startSnackRecordTranscription(recordingId) {
  const recording = snackRecordings.find((item) => item.id === recordingId);
  if (!recording || snackRecordTranscriptionTimers.has(recordingId)) return;
  recording.state = 'processing';
  recording.progress = Math.max(8, recording.progress || 0);
  render();
  const timerId = window.setInterval(() => {
    const current = snackRecordings.find((item) => item.id === recordingId);
    if (!current) {
      window.clearInterval(timerId);
      snackRecordTranscriptionTimers.delete(recordingId);
      return;
    }
    current.progress = Math.min(100, current.progress + 14);
    if (current.progress >= 100) {
      window.clearInterval(timerId);
      snackRecordTranscriptionTimers.delete(recordingId);
      current.state = 'completed';
      current.transcriptFileName = current.fileName.replace(/\.[^.]+$/, '.txt');
      current.transcript = '田晓柔：我们先确认本周最重要的目标和需要跟进的行动项。\n说话人 1：我会在周三前提交第一版方案。\n田晓柔：完成后放到项目里，请 Snack 帮我们继续跟踪。';
      render();
      showToast('本地转写已完成，可以生成会议纪要');
      return;
    }
    render();
  }, 420);
  snackRecordTranscriptionTimers.set(recordingId, timerId);
}

function openSnackRecordSummary(recordingId) {
  const recording = snackRecordings.find((item) => item.id === recordingId);
  if (!recording) return;
  const existingSummaryProject = getProjectById(recording.summaryProjectId);
  const openingDifferentSummary = state.snackRecordSummaryId !== recordingId;
  if (snackRecordSummaryTimerId !== null) window.clearTimeout(snackRecordSummaryTimerId);
  state.snackRecordNativeOpen = false;
  state.snackRecordTranscriptId = null;
  state.snackRecordSummaryId = recordingId;
  state.snackRecordSummaryProjectId = recording.summaryProjectId || null;
  state.snackRecordSummaryStatus = 'generating';
  state.snackRecordFollowupStep = existingSummaryProject ? 2 : 0;
  state.snackRecordFollowupAnswers = existingSummaryProject ? {
    tracking: '用项目继续跟进',
  } : {};
  state.snackRecordProjectDetailOpen = false;
  state.snackRecordFollowupProjectName = existingSummaryProject?.title || 'AI 营销增长系统';
  if (openingDifferentSummary) {
    state.snackRecordFollowupContexts = [];
    state.snackRecordFollowupMembers = [];
  }
  if (existingSummaryProject) {
    const cloudNames = new Set(existingSummaryProject.wikiTopics || []);
    state.snackRecordFollowupContexts = (existingSummaryProject.sourceFolders || []).map((context, index) => {
      const name = typeof context === 'string' ? context : context.name;
      const kind = typeof context === 'string' ? (cloudNames.has(context) ? 'cloud' : 'local') : (context.kind || (cloudNames.has(name) ? 'cloud' : 'local'));
      return {
        id: typeof context === 'string' ? `${kind}:${context}` : (context.id || `${kind}:${name || index}`),
        name,
        path: typeof context === 'string' ? `${kind === 'cloud' ? '云端' : '本地'} / ${context}` : (context.path || `${kind === 'cloud' ? '云端' : '本地'} / ${name}`),
        kind,
        fileCount: typeof context === 'string' ? null : (context.fileCount ?? null),
      };
    });
    const memberDirectory = new Map(getSnackRecordMemberDirectory().map((member) => [member.name, member]));
    const projectMemberNames = [...(existingSummaryProject.members || []), ...(existingSummaryProject.agents || [])]
      .filter((name) => name && name !== 'Snack');
    state.snackRecordFollowupMembers = [...new Set(projectMemberNames)].map((name) => memberDirectory.get(name) || {
      name,
      isAgent: (existingSummaryProject.agents || []).includes(name) || name.endsWith('Agent'),
      role: getCollaboratorRole(name, (existingSummaryProject.agents || []).includes(name) || name.endsWith('Agent')),
    });
  }
  state.snackRecordContextPickerOpen = false;
  state.snackRecordMemberQuery = '';
  state.snackRecordMemberPickerOpen = false;
  state.view = 'recordSummary';
  state.activeProject = state.snackRecordSummaryProjectId;
  state.activeSession = state.snackRecordSummaryProjectId ? `record-summary-${recordingId}` : null;
  state.activeIssue = null;
  state.activeLooseSession = state.snackRecordSummaryProjectId ? null : `record-summary-${recordingId}`;
  render();
  if (recording.state !== 'completed') startSnackRecordTranscription(recordingId);
  snackRecordSummaryTimerId = window.setTimeout(() => {
    snackRecordSummaryTimerId = null;
    const current = snackRecordings.find((item) => item.id === recordingId);
    if (current && current.state !== 'completed') {
      const transcriptionTimerId = snackRecordTranscriptionTimers.get(recordingId);
      if (transcriptionTimerId) window.clearInterval(transcriptionTimerId);
      snackRecordTranscriptionTimers.delete(recordingId);
      current.state = 'completed';
      current.progress = 100;
      current.transcriptFileName = current.fileName.replace(/\.[^.]+$/, '.txt');
      current.transcript = '田晓柔：本周以新用户首日完成率作为核心目标，先用 20% 流量验证新版 onboarding。\n陆铭：我会在周三前完成 onboarding 引导稿。\n林可：我来补齐激活率数据口径与历史基线。\n田晓柔：周五一起复盘实验转化和次日留存。';
    }
    state.snackRecordSummaryStatus = 'complete';
    state.snackRecordFollowupStep = state.snackRecordSummaryProjectId ? Math.max(state.snackRecordFollowupStep, 2) : 1;
    render();
    scrollSnackRecordFollowup();
  }, recording.state === 'completed' ? 1200 : 3200);
}

function scrollSnackRecordFollowup() {
  window.requestAnimationFrame(() => {
    const thread = document.querySelector('[data-record-followup-thread]');
    if (thread instanceof HTMLElement) thread.scrollTop = thread.scrollHeight;
  });
}

function setSnackRecordFollowupAnswer(key, value, nextStep) {
  state.snackRecordFollowupAnswers[key] = value;
  state.snackRecordFollowupStep = nextStep;
  renderSnackRecordFollowupUpdate({ revealCurrentStep: true });
}

function importSnackRecordMock() {
  const recording = {
    id: `record-import-${Date.now()}`,
    fileName: '客户访谈录音-导入文件.m4a',
    transcriptFileName: null,
    createdLabel: '刚刚',
    durationSeconds: 1486,
    fileSize: '22.8 MB',
    state: 'pending',
    progress: 0,
    transcript: '',
  };
  snackRecordings.unshift(recording);
  state.snackRecordNativeOpen = false;
  state.snackRecordQuery = '';
  state.snackRecordSelection = [];
  state.view = 'recordLibrary';
  render();
  showToast('已模拟导入本地音频，可点击开始转写');
}

function importSnackRecordNativeMock() {
  const recording = {
    id: `record-native-import-${Date.now()}`,
    fileName: '访谈录音-导入文件.m4a',
    transcriptFileName: '访谈录音-导入文件-转写.txt',
    createdLabel: '刚刚',
    durationSeconds: 1486,
    fileSize: '22.8 MB',
    state: 'processing',
    progress: 8,
    transcript: '',
  };
  snackRecordings.unshift(recording);
  render();
  startSnackRecordTranscription(recording.id);
  showToast('本地文件已加入转写任务');
}

function requestSnackRecordDeletion(ids) {
  state.snackRecordDeleteIds = ids.filter((id) => snackRecordings.some((recording) => recording.id === id));
  render();
}

function confirmSnackRecordDeletion() {
  const deleteIds = new Set(state.snackRecordDeleteIds);
  for (let index = snackRecordings.length - 1; index >= 0; index -= 1) {
    if (deleteIds.has(snackRecordings[index].id)) snackRecordings.splice(index, 1);
  }
  state.snackRecordSelection = state.snackRecordSelection.filter((id) => !deleteIds.has(id));
  state.snackRecordDeleteIds = [];
  render();
  showToast(`已删除 ${deleteIds.size} 条 mock 录音`);
}

function downloadSnackRecordTranscript(recordingId) {
  const recording = snackRecordings.find((item) => item.id === recordingId);
  if (!recording || !recording.transcript) return;
  const fileName = recording.transcriptFileName || recording.fileName.replace(/\.[^.]+$/, '.txt');
  const file = new Blob([recording.transcript], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  showToast(`已下载 ${fileName}`);
}

function handleSnackRecordAction(target) {
  const action = target.dataset.recordAction;
  const recordingId = target.dataset.recordId;
  if (action === 'start-setup') return startSnackRecordSetup();
  if (action === 'open-native') {
    state.snackRecordNativeOpen = true;
    render();
    return;
  }
  if (action === 'close-native') {
    state.snackRecordNativeOpen = false;
    render();
    return;
  }
  if (action === 'minimize-native') {
    state.snackRecordNativeOpen = false;
    render();
    showToast(state.snackRecordActive ? 'Snack Record 已最小化，录音仍在进行' : 'Snack Record 已最小化');
    return;
  }
  if (action === 'toggle-native-size') {
    state.snackRecordNativeMaximized = !state.snackRecordNativeMaximized;
    render();
    return;
  }
  if (action === 'start-recording') return startSnackRecordMock();
  if (action === 'stop-recording') return stopSnackRecordMock();
  if (action === 'open-library') {
    state.snackRecordNativeOpen = false;
    state.view = 'recordLibrary';
    render();
    return;
  }
  if (action === 'open-settings') {
    state.snackRecordNativeOpen = false;
    state.snackRecordSetupReturnView = 'apps';
    state.snackRecordConfigDraft = { ...state.snackRecordConfig };
    state.view = 'recordSettings';
    render();
    return;
  }
  if (action === 'back-setup') {
    state.view = state.snackRecordSetupReturnView || 'apps';
    render();
    return;
  }
  if (action === 'back-apps') {
    state.view = 'apps';
    render();
    return;
  }
  if (action === 'back-library') {
    state.snackRecordProjectDetailOpen = false;
    state.view = 'recordLibrary';
    render();
    return;
  }
  if (action === 'import-audio') return importSnackRecordMock();
  if (action === 'native-import-audio') return importSnackRecordNativeMock();
  if (action === 'native-clear') {
    showToast('演示数据已保留，可在“我的录音”中体验批量删除');
    return;
  }
  if (action === 'transcribe') return startSnackRecordTranscription(recordingId);
  if (action === 'open-audio') {
    showToast('已模拟打开本地录音文件');
    return;
  }
  if (action === 'open-transcript') {
    state.snackRecordTranscriptId = recordingId;
    render();
    return;
  }
  if (action === 'download-transcript') return downloadSnackRecordTranscript(recordingId);
  if (action === 'close-transcript') {
    state.snackRecordTranscriptId = null;
    render();
    return;
  }
  if (action === 'open-summary') return openSnackRecordSummary(recordingId);
  if (action === 'delete-one') return requestSnackRecordDeletion([recordingId]);
  if (action === 'delete-selected') return requestSnackRecordDeletion([...state.snackRecordSelection]);
  if (action === 'cancel-delete') {
    state.snackRecordDeleteIds = [];
    render();
    return;
  }
  if (action === 'confirm-delete') return confirmSnackRecordDeletion();
  if (action === 'restore-settings') {
    state.snackRecordConfigDraft = { ...snackRecordDefaultConfig };
    render();
    return;
  }
  if (action === 'choose-output') {
    state.snackRecordConfigDraft.outputDirectory = '~/Desktop/Snack Recordings/2026-08-02';
    render();
    showToast('已模拟选择本地输出目录');
    return;
  }
  if (action === 'save-settings') {
    if (!state.snackRecordConfigured && state.snackRecordResourceStatus !== 'complete') return;
    const firstTime = !state.snackRecordConfigured;
    state.snackRecordConfig = { ...state.snackRecordConfigDraft };
    state.snackRecordInstalled = true;
    state.snackRecordConfigured = true;
    state.snackRecordResourceStatus = 'complete';
    saveSnackRecordConfig();
    state.view = 'apps';
    state.snackRecordNativeOpen = firstTime;
    render();
    showToast(firstTime ? '配置完成，点击麦克风开始录音' : 'Snack Record 配置已保存');
    return;
  }
  if (action === 'check-resource') {
    state.snackRecordResourceStatus = 'checking';
    render();
    window.setTimeout(() => {
      state.snackRecordResourceStatus = 'complete';
      render();
      showToast('本地资源包完整');
    }, 1100);
    return;
  }
  if (action === 'summary-to-project') {
    const projectId = state.snackRecordSummaryProjectId;
    state.view = projectId ? 'projectBoard' : 'projectSchedule';
    state.taskTab = projectId ? 'projects' : 'schedule';
    state.activeProject = projectId || 'snack-product-iteration';
    state.activeSession = null;
    render();
    showToast(projectId ? '已打开新创建的项目' : '已带着会议纪要回到项目会议日程');
    return;
  }
  if (action === 'copy-summary') {
    showToast('会议纪要已复制');
    return;
  }
  if (action === 'reply-summary') {
    focusSnackRecordConversationComposer();
    return;
  }
  if (action === 'forward-summary') {
    showToast('已打开转发选择（mock）');
    return;
  }
  if (action === 'share-summary-image') {
    showToast('会议纪要分享图片已生成（mock）');
    return;
  }
  if (action === 'more-summary') {
    showToast('已打开更多操作（mock）');
    return;
  }
  if (action === 'open-summary-project-detail') {
    const project = createSnackRecordFollowupProject();
    if (!project) return;
    state.activeProject = project.id;
    state.snackRecordProjectDetailOpen = true;
    state.memberManagerOpen = false;
    state.memberManagerQuery = '';
    renderSnackRecordFollowupUpdate();
    return;
  }
  if (action === 'close-summary-project-detail') {
    state.snackRecordProjectDetailOpen = false;
    state.memberManagerOpen = false;
    state.memberManagerQuery = '';
    renderSnackRecordFollowupUpdate();
    return;
  }
  if (action === 'toggle-record-context-picker') {
    state.snackRecordContextPickerOpen = !state.snackRecordContextPickerOpen;
    state.snackRecordMemberPickerOpen = false;
    renderSnackRecordDraftUpdate();
    return;
  }
  if (action === 'close-record-context-picker') {
    state.snackRecordContextPickerOpen = false;
    renderSnackRecordDraftUpdate();
    return;
  }
  if (action === 'toggle-record-cloud-context') return toggleSnackRecordCloudContext(target.dataset.recordContextId);
  if (action === 'remove-record-context') return removeSnackRecordContext(target.dataset.recordContextId);
  if (action === 'toggle-record-member-picker') {
    state.snackRecordMemberPickerOpen = !state.snackRecordMemberPickerOpen;
    state.snackRecordContextPickerOpen = false;
    state.snackRecordMemberQuery = '';
    renderSnackRecordDraftUpdate({ focusMemberSearch: state.snackRecordMemberPickerOpen });
    return;
  }
  if (action === 'close-record-member-picker') {
    state.snackRecordMemberPickerOpen = false;
    state.snackRecordMemberQuery = '';
    renderSnackRecordDraftUpdate();
    return;
  }
  if (action === 'select-record-member') return selectSnackRecordMember(target.dataset.recordMember);
  if (action === 'remove-record-member') return removeSnackRecordMember(target.dataset.recordMember);
  if (action === 'followup-track') {
    const project = createSnackRecordFollowupProject();
    if (!project) return;
    setSnackRecordFollowupAnswer('tracking', '用项目继续跟进', 2);
    showToast(`项目“${project.title}”已根据会议内容准备好`);
    return;
  }
  if (action === 'followup-save-only') return setSnackRecordFollowupAnswer('tracking', '只保存纪要', 7);
}

function getActiveProject() {
  return getProjectById(state.activeProject);
}

function getComposerProject() {
  if (state.composerProjectId === null) return null;
  return getProjectById(state.composerProjectId) || getActiveProject() || getVisibleProjectFolders()[0] || null;
}

function getProjectById(projectId) {
  return projectFolders.find((project) => project.id === projectId);
}

function getProjectIssues(project) {
  return issues.filter((issue) => project.taskCodes.includes(issue.code));
}

function getProjectSession(project) {
  if (state.activeSession === 'group') return { id: 'group', title: '项目群聊', with: project.title };
  return project.sessions.find((session) => session.id === state.activeSession) || { id: 'group', title: '项目群聊', with: project.title };
}

function getSessionMessages(project, session) {
  if (session.id === 'group') return project.groupMessages;
  return session.messages;
}

function isProjectIntakeBlank(project) {
  const intakeSession = project.sessions.find((session) => session.id === 'snack-intake');
  return intakeSession
    && intakeSession.messages.length === 0
    && project.groupMessages.length === 0
    && project.taskCodes.length === 0;
}

function ensureProjectIntakeSession(project) {
  let session = project.sessions.find((item) => item.id === 'snack-intake');
  if (!session) {
    session = buildInitialProjectSession();
    project.sessions.unshift(session);
  }
  return session;
}

function getIssueByCode(code) {
  return issues.find((issue) => issue.code === code);
}

function getOpenIssueTabs() {
  return state.openIssueTabs.map((code) => getIssueByCode(code)).filter(Boolean);
}

function getActiveIssueTab(project = null) {
  const issue = getIssueByCode(state.activeIssueTab);
  if (!issue) return null;
  if (project && issue.projectId !== project.id) return null;
  return issue;
}

function getIssueProjectId(code) {
  const issue = getIssueByCode(code);
  return issue ? issue.projectId : state.activeProject;
}

function buildNewProject(id, serial) {
  return {
    id,
    title: '未命名项目',
    mockIssueCode: `ADS-${String(100 + serial).padStart(3, '0')}`,
    summary: '等待补充项目目标',
    scenario: '项目协作',
    updated: '刚刚',
    createdAt: Date.now() + serial,
    participating: true,
    objective: '待确认',
    health: '准备中',
    agents: ['Snack'],
    members: ['田晓柔', 'Snack'],
    rememberedPeople: [['田晓柔', '项目发起人，负责目标确认和执行授权']],
    monitoringType: '',
    monitoringRules: [],
    wikiTopics: [],
    pushRule: '待确认',
    operatingRules: [],
    taskCodes: [],
    agentStatuses: [],
    sessions: [],
    groupMessages: [],
  };
}

function buildInitialProjectSession() {
  return {
    id: 'snack-intake',
    title: '和 Snack 对齐项目目标',
    with: 'Snack',
    updated: '刚刚',
    messages: [],
  };
}

function getDefaultIssueProjectId() {
  const activeIssue = getIssueByCode(state.activeIssueTab || state.activeIssue);
  const candidateId = activeIssue?.projectId || state.activeProject;
  return getProjectById(candidateId)?.id || getVisibleProjectFolders()[0]?.id || null;
}

function openIssueCreationModal() {
  state.projectCreationOpen = false;
  state.projectEditingId = null;
  state.issueCreationProjectId = getDefaultIssueProjectId();
  state.issueCreationOpen = true;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.taskFilterOpen = false;
  render();
}

function closeIssueCreationModal() {
  if (!state.issueCreationOpen) return;
  state.issueCreationOpen = false;
  state.issueCreationProjectId = null;
  render();
}

function getIssueOwnerOptions(projectId) {
  const project = getProjectById(projectId);
  const ownerNames = [
    currentUserName,
    '未分配',
    ...(project?.members || []),
    ...(project?.agents || []),
    ...projectFolders.flatMap((item) => [...(item.members || []), ...(item.agents || [])]),
  ];
  return [...new Set(ownerNames.filter(Boolean))];
}

function renderIssueCreationModal() {
  const projectId = getProjectById(state.issueCreationProjectId)?.id || getDefaultIssueProjectId();
  const projects = getVisibleProjectFolders();
  const ownerOptions = getIssueOwnerOptions(projectId);
  return `
    <section class="issue-create-backdrop" data-issue-modal-backdrop role="presentation">
      <form class="issue-create-modal" data-issue-create-form role="dialog" aria-modal="true" aria-labelledby="issueCreateTitle">
        <header class="issue-create-header">
          <div class="issue-create-breadcrumb">
            <span>任务工作台</span>
            <i data-lucide="chevron-right"></i>
            <strong id="issueCreateTitle">手动创建</strong>
          </div>
          <button class="issue-create-close" type="button" aria-label="关闭创建任务" data-issue-modal-close>
            <i data-lucide="x"></i>
          </button>
        </header>
        <section class="issue-create-body">
          <div class="issue-create-editor">
            <input class="issue-create-title-input" name="issue-title" data-issue-create-title maxlength="80" autocomplete="off" placeholder="任务标题" aria-label="任务标题" required />
            <textarea class="issue-create-description" name="issue-description" maxlength="800" placeholder="添加描述..." aria-label="任务描述"></textarea>
          </div>
          <section class="issue-create-properties" aria-label="任务属性">
            <label class="issue-create-property">
              <i data-lucide="circle-dot"></i>
              <span>状态</span>
              <select name="issue-status" aria-label="状态">
                ${columns.map(([value, label]) => `<option value="${value}" ${value === 'backlog' ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </label>
            <label class="issue-create-property">
              <i data-lucide="minus"></i>
              <span>优先级</span>
              <select name="issue-priority" aria-label="优先级">
                <option value="P0">P0 · 紧急</option>
                <option value="P1" selected>P1 · 高</option>
                <option value="P2">P2 · 普通</option>
                <option value="P3">P3 · 低</option>
              </select>
            </label>
            <label class="issue-create-property">
              <i data-lucide="user-round"></i>
              <span>负责人</span>
              <select name="issue-owner" aria-label="负责人">
                ${ownerOptions.map((owner) => `<option value="${escapeAttribute(owner)}">${escapeHtml(owner)}</option>`).join('')}
              </select>
            </label>
            <label class="issue-create-property issue-create-tag-property">
              <i data-lucide="tag"></i>
              <span>标签</span>
              <input name="issue-tag" maxlength="20" autocomplete="off" placeholder="添加标签" aria-label="标签" />
            </label>
            <label class="issue-create-property issue-create-project-property">
              <i data-lucide="folder-kanban"></i>
              <span>项目</span>
              <select name="issue-project" aria-label="所属项目" required>
                ${projects.map((project) => `<option value="${escapeAttribute(project.id)}" ${project.id === projectId ? 'selected' : ''}>${escapeHtml(project.title)}</option>`).join('')}
              </select>
            </label>
          </section>
        </section>
        <footer class="issue-create-footer">
          <span class="issue-create-manual-hint"><i data-lucide="pencil-line"></i>当前仅支持手动创建</span>
          <div>
            <button class="secondary-button" type="button" data-issue-modal-close>取消</button>
            <button class="primary-button" type="submit">创建任务</button>
          </div>
        </footer>
      </form>
    </section>
  `;
}

function getNextManualIssueCode() {
  let code = '';
  do {
    code = `TSK-${String(state.issueSerial).padStart(3, '0')}`;
    state.issueSerial += 1;
  } while (getIssueByCode(code));
  return code;
}

function createManualIssue(form) {
  const formData = new FormData(form);
  const rawTitle = String(formData.get('issue-title') || '').trim();
  const rawDescription = String(formData.get('issue-description') || '').trim();
  const projectId = String(formData.get('issue-project') || '');
  const project = getProjectById(projectId);
  if (!rawTitle) {
    showToast('请填写任务标题');
    const titleInput = form.querySelector('[data-issue-create-title]');
    if (titleInput instanceof HTMLInputElement) titleInput.focus();
    return;
  }
  if (!project) {
    showToast('请选择所属项目');
    return;
  }
  const status = stateLabels[String(formData.get('issue-status'))]
    ? String(formData.get('issue-status'))
    : 'backlog';
  const priority = ['P0', 'P1', 'P2', 'P3'].includes(String(formData.get('issue-priority')))
    ? String(formData.get('issue-priority'))
    : 'P1';
  const owner = String(formData.get('issue-owner') || currentUserName);
  const rawTag = String(formData.get('issue-tag') || '').trim();
  const stageByStatus = {
    backlog: '待开始',
    in_progress: '任务执行',
    review: '等待审核',
    done: '已完成',
    blocked: '等待解除阻塞',
  };
  const stage = stageByStatus[status];
  const code = getNextManualIssueCode();
  const issue = {
    code,
    title: escapeAttribute(rawTitle),
    projectId: project.id,
    status,
    issueType: '工作任务',
    owner,
    reviewer: currentUserName,
    priority,
    stage,
    tag: rawTag ? escapeAttribute(rawTag) : '手动创建',
    desc: rawDescription ? escapeAttribute(rawDescription) : '暂无任务描述。',
    count: status === 'done' ? '1/1' : '0/1',
    predecessor: null,
    relatedTasks: [],
    source: '任务工作台 / 手动创建',
    nodes: [{
      title: stage,
      state: status === 'done' ? 'done' : 'active',
      detail: rawDescription ? escapeAttribute(rawDescription) : '等待负责人补充执行说明。',
    }],
    evidence: [],
    artifacts: [],
    activity: [[currentUserName, '手动创建了任务。', '刚刚']],
    comments: [],
    logs: [`${currentUserName} 手动创建任务`],
  };
  issues.push(issue);
  if (!project.taskCodes.includes(code)) project.taskCodes.push(code);
  state.issueCreationOpen = false;
  state.issueCreationProjectId = null;
  showToast(`${code} 已创建`);
  openIssue(code);
}

function renderProjectCreationModal() {
  const editingProject = getProjectById(state.projectEditingId);
  const projectName = editingProject?.title || '';
  const projectObjective = editingProject?.objective || '';
  const monitoringRules = (editingProject?.monitoringRules || []).map((rule) => ({
    ...rule,
    type: rule.type || getMonitoringMetricInfo(rule.metric, editingProject?.monitoringType)?.type || '',
  }));
  return `
    <section class="project-create-backdrop" data-project-modal-backdrop role="presentation">
      <form class="project-create-modal" data-project-create-form role="dialog" aria-modal="true" aria-labelledby="projectCreateTitle">
        <header class="project-create-header">
          <div>
            <h2 id="projectCreateTitle">${editingProject ? '项目设置' : '新建项目'}</h2>
            <p>${editingProject ? '维护项目目标与数据监控' : '填写项目名称并邀请协作成员，保存后即可进入项目看板'}</p>
          </div>
          <button class="project-create-close" type="button" aria-label="关闭${editingProject ? '项目配置' : '新建项目'}" data-project-modal-close>
            <i data-lucide="x"></i>
          </button>
        </header>
        <section class="project-create-form-body">
          <label class="project-create-field">
            <span>项目名称 <em>必填</em></span>
            <input name="project-name" data-project-create-name value="${escapeAttribute(projectName)}" maxlength="40" autocomplete="off" placeholder="例如：7 月吊车投放监控" required />
          </label>
          <div class="project-create-field project-wiki-topic-field">
            <span>云端 Wiki Topic <em class="project-field-optional">可多选</em></span>
            ${renderProjectWikiTopicPicker()}
            <small>关联后，Snack 可读取所选 Topic 的云端资料；支持同时选择多个 Topic。</small>
          </div>
          <div class="project-create-field project-source-folder-field">
            <span>项目文件夹 <em class="project-field-optional">可选</em></span>
            ${renderProjectFolderPicker()}
            <small>选择后，Snack 可读取文件夹内容并在项目内协助编辑。</small>
          </div>
          ${editingProject ? `
            <label class="project-create-field">
              <span>项目目标</span>
              <textarea name="project-objective" rows="3" maxlength="240" placeholder="描述这个项目希望持续解决的问题和达成的结果">${escapeHtml(projectObjective)}</textarea>
            </label>
            <div class="project-create-field project-monitoring-field">
              <span>数据监控</span>
              <small>用自然语言描述一个或多个需要监控的指标，Snack 会识别为可执行规则。</small>
              ${renderMonitoringRulesEditor(monitoringRules)}
            </div>
          ` : ''}
          ${editingProject ? '' : `
            <div class="project-create-field">
              <span>邀请成员</span>
              ${renderProjectMemberPicker()}
              <small>你和 Snack 会自动加入项目，受邀成员会显示在看板与项目群中。</small>
            </div>
          `}
        </section>
        <footer class="project-create-footer">
          <button class="secondary-button" type="button" data-project-modal-close>取消</button>
          <button class="primary-button" type="submit" data-project-save>保存</button>
        </footer>
      </form>
    </section>
  `;
}

function renderMonitoringRulesEditor(rules = []) {
  return `
    <section class="monitoring-rules-editor" data-monitoring-rules-editor>
      <div class="monitoring-natural-input" data-monitoring-input-shell>
        <textarea
          name="monitoring-rule-draft"
          rows="2"
          maxlength="240"
          data-monitoring-rule-input
          aria-label="用自然语言描述监控指标"
          aria-describedby="monitoringRecognitionHint monitoringRuleError"
          placeholder="例如：当线索成本高于 200 元时提醒我"
        ></textarea>
        <button class="monitoring-recognize-button" type="button" data-monitoring-rule-recognize disabled>
          <i data-lucide="sparkles"></i>
          <span>智能识别</span>
        </button>
      </div>
      <p class="monitoring-recognition-hint" id="monitoringRecognitionHint">
        可用换行或分号一次描述多条，例如“注册率低于 50% 时提醒；入驻人数达到 100 人”。
      </p>
      <p class="monitoring-rule-error" id="monitoringRuleError" data-monitoring-rule-error role="alert" hidden>
        <i data-lucide="circle-alert"></i>
        <span></span>
      </p>
      <div class="monitoring-rule-list" data-monitoring-rule-list>
        ${rules.length
    ? rules.map((rule) => renderMonitoringRuleRow(rule)).join('')
    : renderMonitoringRuleEmpty()}
      </div>
    </section>
  `;
}

function renderMonitoringRuleEmpty() {
  return '<p class="monitoring-rule-empty">还没有监控规则，输入一句话让 Snack 帮你识别。</p>';
}

function renderMonitoringRuleRow(rule = {}) {
  const unit = rule.unit || getMonitoringMetricInfo(rule.metric)?.unit || '';
  const valueWithUnit = rule.value
    ? `${rule.value}${unit === '%' ? unit : unit ? ` ${unit}` : ''}`
    : '';
  const source = rule.source || formatMonitoringRuleSource(rule);
  return `
    <article class="monitoring-rule-row" data-monitoring-rule-row>
      <input type="hidden" name="monitoring-metric" value="${escapeAttribute(rule.metric || '')}" />
      <input type="hidden" name="monitoring-operator" value="${escapeAttribute(rule.operator || '')}" />
      <input type="hidden" name="monitoring-value" value="${escapeAttribute(rule.value || '')}" />
      <input type="hidden" name="monitoring-unit" value="${escapeAttribute(unit)}" />
      <input type="hidden" name="monitoring-type" value="${escapeAttribute(rule.type || getMonitoringMetricInfo(rule.metric)?.type || '')}" />
      <input type="hidden" name="monitoring-source" value="${escapeAttribute(source)}" />
      <span class="monitoring-rule-status" aria-hidden="true"><i data-lucide="check"></i></span>
      <span class="monitoring-rule-main">
        <small>已匹配指标</small>
        <strong>${escapeHtml(rule.metric || '')}</strong>
        <em>${escapeHtml([rule.operator, valueWithUnit].filter(Boolean).join(' '))}</em>
        <span title="${escapeAttribute(source)}">${escapeHtml(source)}</span>
      </span>
      <span class="monitoring-rule-actions">
        <button type="button" data-monitoring-rule-edit aria-label="编辑 ${escapeAttribute(rule.metric || '监控规则')}">
          <i data-lucide="pencil"></i>
          <span>编辑</span>
        </button>
        <button type="button" data-monitoring-rule-remove aria-label="删除 ${escapeAttribute(rule.metric || '监控规则')}">
          <i data-lucide="trash-2"></i>
        </button>
      </span>
    </article>
  `;
}

function formatMonitoringRuleSource(rule) {
  const unit = rule.unit || getMonitoringMetricInfo(rule.metric)?.unit || '';
  const valueWithUnit = rule.value
    ? `${rule.value}${unit === '%' ? unit : unit ? ` ${unit}` : ''}`
    : '';
  return `${rule.metric || '指标'} ${rule.operator || ''} ${valueWithUnit}`.trim();
}

function getMonitoringMetricInfo(metric, preferredType = '') {
  const preferredOption = (monitoringMetricOptions[preferredType] || []).find(([name]) => name === metric);
  if (preferredOption) return { type: preferredType, metric: preferredOption[0], unit: preferredOption[1] };
  for (const [type, metrics] of Object.entries(monitoringMetricOptions)) {
    const option = metrics.find(([name]) => name === metric);
    if (option) return { type, metric: option[0], unit: option[1] };
  }
  return null;
}

function getMonitoringOperator(text) {
  const normalized = text.toLowerCase();
  const patterns = [
    ['≥', /(不低于|不少于|至少|最低|达到|达成|大于等于|以上|>=|≥)/],
    ['≤', /(不高于|不超过|至多|最高|小于等于|以下|以内|<=|≤)/],
    ['>', /(超过|高于|大于|超出|>)/],
    ['<', /(低于|少于|小于|跌破|<)/],
    ['=', /(等于|保持在|=)/],
  ];
  for (const [operator, pattern] of patterns) {
    const match = normalized.match(pattern);
    if (match) return { operator, endIndex: (match.index || 0) + match[0].length };
  }
  return null;
}

function recognizeMonitoringRule(source) {
  const normalized = source.trim().replace(/，/g, ',');
  if (!normalized) return { ok: false, source, message: '请输入要监控的指标和判断条件。' };
  const aliasMatch = monitoringMetricAliases.find((item) => item.aliases.some((alias) => normalized.toLowerCase().includes(alias.toLowerCase())));
  if (!aliasMatch) return { ok: false, source, message: '没有识别到可匹配的指标，请补充具体指标名称。' };
  const preferredType = /(企微|私聊|入群|进群|加微)/.test(normalized) ? 'private_domain' : 'paid_media';
  const metricInfo = getMonitoringMetricInfo(aliasMatch.metric, preferredType);
  const operatorMatch = getMonitoringOperator(normalized);
  if (!operatorMatch) return { ok: false, source, message: `已识别“${aliasMatch.metric}”，但缺少高于、低于或达到等判断条件。` };
  const thresholdText = normalized.slice(operatorMatch.endIndex);
  const thresholdMatch = thresholdText.match(/-?\d+(?:\.\d+)?/);
  const allNumbers = [...normalized.matchAll(/-?\d+(?:\.\d+)?/g)];
  const numberMatch = thresholdMatch || allNumbers[allNumbers.length - 1];
  if (!numberMatch) return { ok: false, source, message: `已识别“${aliasMatch.metric}”，但缺少明确的数字阈值。` };
  if (!metricInfo) return { ok: false, source, message: '当前指标还没有可用的数据口径。' };
  return {
    ok: true,
    rule: {
      metric: metricInfo.metric,
      operator: operatorMatch.operator,
      value: numberMatch[0],
      unit: metricInfo.unit,
      type: metricInfo.type,
      source: normalized,
    },
  };
}

function splitMonitoringRuleDraft(value) {
  return value
    .split(/[\n；;。]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setMonitoringRuleError(editor, message = '') {
  const error = editor?.querySelector('[data-monitoring-rule-error]');
  const input = editor?.querySelector('[data-monitoring-rule-input]');
  if (!(error instanceof HTMLElement) || !(input instanceof HTMLTextAreaElement)) return;
  const text = error.querySelector('span');
  if (text instanceof HTMLElement) text.textContent = message;
  error.hidden = !message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function syncMonitoringRuleEmpty(list) {
  if (!(list instanceof HTMLElement)) return;
  const rows = list.querySelectorAll('[data-monitoring-rule-row]');
  const empty = list.querySelector('.monitoring-rule-empty');
  if (!rows.length && !empty) list.innerHTML = renderMonitoringRuleEmpty();
  if (rows.length && empty) empty.remove();
}

function syncMonitoringDraftState(input) {
  const editor = input.closest('[data-monitoring-rules-editor]');
  const form = input.closest('[data-project-create-form]');
  const recognizeButton = editor?.querySelector('[data-monitoring-rule-recognize]');
  const saveButton = form?.querySelector('[data-project-save]');
  const hasDraft = Boolean(input.value.trim());
  if (recognizeButton instanceof HTMLButtonElement) recognizeButton.disabled = !hasDraft;
  if (saveButton instanceof HTMLButtonElement) {
    saveButton.disabled = hasDraft;
    saveButton.title = hasDraft ? '请先完成数据监控规则识别' : '';
  }
  setMonitoringRuleError(editor, '');
  editor?.classList.toggle('has-draft', hasDraft);
}

function recognizeMonitoringRules(button) {
  const editor = button.closest('[data-monitoring-rules-editor]');
  const input = editor?.querySelector('[data-monitoring-rule-input]');
  const list = editor?.querySelector('[data-monitoring-rule-list]');
  if (!(editor instanceof HTMLElement) || !(input instanceof HTMLTextAreaElement) || !(list instanceof HTMLElement)) return;
  const statements = splitMonitoringRuleDraft(input.value);
  if (!statements.length) {
    setMonitoringRuleError(editor, '请输入要监控的指标和判断条件。');
    input.focus();
    return;
  }
  const results = statements.map(recognizeMonitoringRule);
  const successfulRules = results.filter((result) => result.ok).map((result) => result.rule);
  const failedResults = results.filter((result) => !result.ok);
  const empty = list.querySelector('.monitoring-rule-empty');
  if (successfulRules.length && empty) empty.remove();
  successfulRules.forEach((rule) => list.insertAdjacentHTML('beforeend', renderMonitoringRuleRow(rule)));
  input.value = failedResults.map((result) => result.source).join('\n');
  if (failedResults.length) {
    setMonitoringRuleError(editor, failedResults[0].message);
    input.focus();
  } else {
    setMonitoringRuleError(editor, '');
  }
  syncMonitoringRuleEmpty(list);
  syncMonitoringDraftStateWithoutClearingError(input);
  renderIcons();
}

function syncMonitoringDraftStateWithoutClearingError(input) {
  const editor = input.closest('[data-monitoring-rules-editor]');
  const form = input.closest('[data-project-create-form]');
  const recognizeButton = editor?.querySelector('[data-monitoring-rule-recognize]');
  const saveButton = form?.querySelector('[data-project-save]');
  const hasDraft = Boolean(input.value.trim());
  if (recognizeButton instanceof HTMLButtonElement) recognizeButton.disabled = !hasDraft;
  if (saveButton instanceof HTMLButtonElement) {
    saveButton.disabled = hasDraft;
    saveButton.title = hasDraft ? '请先完成数据监控规则识别' : '';
  }
  editor?.classList.toggle('has-draft', hasDraft);
}

function editMonitoringRule(button) {
  const editor = button.closest('[data-monitoring-rules-editor]');
  const row = button.closest('[data-monitoring-rule-row]');
  const input = editor?.querySelector('[data-monitoring-rule-input]');
  const list = editor?.querySelector('[data-monitoring-rule-list]');
  const sourceInput = row?.querySelector('input[name="monitoring-source"]');
  if (!(row instanceof HTMLElement) || !(input instanceof HTMLTextAreaElement) || !(list instanceof HTMLElement)) return;
  const source = sourceInput instanceof HTMLInputElement ? sourceInput.value : '';
  input.value = [input.value.trim(), source].filter(Boolean).join('\n');
  row.remove();
  syncMonitoringRuleEmpty(list);
  syncMonitoringDraftState(input);
  input.focus();
}

function removeMonitoringRule(button) {
  const editor = button.closest('[data-monitoring-rules-editor]');
  const row = button.closest('[data-monitoring-rule-row]');
  const list = editor?.querySelector('[data-monitoring-rule-list]');
  if (!(row instanceof HTMLElement)) return;
  row.remove();
  syncMonitoringRuleEmpty(list);
}

function openProjectCreationModal(projectId = null) {
  const editingProject = getProjectById(projectId);
  state.projectCreationOpen = true;
  state.issueCreationOpen = false;
  state.issueCreationProjectId = null;
  state.projectEditingId = editingProject?.id || null;
  state.projectCreationMembers = [];
  state.projectCreationWikiTopics = [...(editingProject?.wikiTopics || [])];
  state.projectWikiTopicPickerOpen = false;
  state.projectCreationFolders = (editingProject?.sourceFolders || []).map((folder) => ({
    name: typeof folder === 'string' ? folder : folder.name,
    fileCount: typeof folder === 'string' ? null : folder.fileCount,
  }));
  state.projectMemberQuery = '';
  state.projectMemberPickerOpen = false;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.modelPickerOpen = false;
  state.projectPickerOpen = false;
  state.agentMenuOpen = false;
  render();
}

function closeProjectCreationModal() {
  if (!state.projectCreationOpen) return;
  state.projectCreationOpen = false;
  state.projectEditingId = null;
  state.projectCreationMembers = [];
  state.projectCreationWikiTopics = [];
  state.projectWikiTopicPickerOpen = false;
  state.projectCreationFolders = [];
  state.projectMemberQuery = '';
  state.projectMemberPickerOpen = false;
  render();
}

function renderProjectWikiTopicPicker() {
  const selectedTopics = state.projectCreationWikiTopics || [];
  const selectedTopicNames = new Set(selectedTopics);
  const selectionLabel = selectedTopics.length
    ? `已选择 ${selectedTopics.join('、')}`
    : '尚未选择云端 Wiki Topic';
  return `
    <div class="project-wiki-topic-picker ${state.projectWikiTopicPickerOpen ? 'open' : ''}" data-project-wiki-topic-picker>
      <button
        class="project-wiki-topic-control"
        type="button"
        data-project-wiki-topic-toggle
        aria-haspopup="listbox"
        aria-expanded="${state.projectWikiTopicPickerOpen ? 'true' : 'false'}"
        aria-controls="projectWikiTopicOptions"
        aria-label="${escapeAttribute(selectionLabel)}"
      >
        <span class="project-wiki-topic-selection" aria-live="polite">
          ${selectedTopics.length
    ? selectedTopics.map((topic) => `<span class="project-wiki-topic-chip"><i data-lucide="book-open-text"></i>${escapeHtml(topic)}</span>`).join('')
    : '<span class="project-wiki-topic-placeholder">选择云端 Wiki Topic</span>'}
        </span>
        <i class="project-wiki-topic-chevron" data-lucide="chevron-down"></i>
      </button>
      ${state.projectWikiTopicPickerOpen ? `
        <section class="project-wiki-topic-options" id="projectWikiTopicOptions" role="listbox" aria-label="云端 Wiki Topic" aria-multiselectable="true">
          ${projectWikiTopicOptions.map((topic) => {
    const isSelected = selectedTopicNames.has(topic.name);
    return `
              <button
                class="project-wiki-topic-option ${isSelected ? 'selected' : ''}"
                type="button"
                role="option"
                aria-selected="${isSelected ? 'true' : 'false'}"
                data-project-wiki-topic-option="${escapeAttribute(topic.name)}"
              >
                <span class="project-wiki-topic-icon"><i data-lucide="book-open-text"></i></span>
                <span class="project-wiki-topic-copy">
                  <strong>${escapeHtml(topic.name)}</strong>
                  <small>${escapeHtml(topic.description)}</small>
                </span>
                <span class="project-wiki-topic-check" aria-hidden="true"><i data-lucide="check"></i></span>
              </button>
            `;
  }).join('')}
          <footer>${selectedTopics.length ? `已选择 ${selectedTopics.length} 个 Topic` : '可选择多个 Topic'}</footer>
        </section>
      ` : ''}
    </div>
  `;
}

function refreshProjectWikiTopicPicker() {
  const picker = document.querySelector('[data-project-wiki-topic-picker]');
  if (!(picker instanceof HTMLElement)) return;
  picker.outerHTML = renderProjectWikiTopicPicker();
  renderIcons();
}

function toggleProjectWikiTopicPicker() {
  state.projectWikiTopicPickerOpen = !state.projectWikiTopicPickerOpen;
  if (state.projectWikiTopicPickerOpen && state.projectMemberPickerOpen) {
    state.projectMemberPickerOpen = false;
    refreshProjectMemberPicker();
  }
  refreshProjectWikiTopicPicker();
}

function closeProjectWikiTopicPicker() {
  if (!state.projectWikiTopicPickerOpen) return;
  state.projectWikiTopicPickerOpen = false;
  refreshProjectWikiTopicPicker();
}

function toggleProjectWikiTopic(topicName) {
  if (!projectWikiTopicOptions.some((topic) => topic.name === topicName)) return;
  const selectedTopicNames = new Set(state.projectCreationWikiTopics || []);
  if (selectedTopicNames.has(topicName)) selectedTopicNames.delete(topicName);
  else selectedTopicNames.add(topicName);
  state.projectCreationWikiTopics = projectWikiTopicOptions
    .map((topic) => topic.name)
    .filter((name) => selectedTopicNames.has(name));
  state.projectWikiTopicPickerOpen = true;
  refreshProjectWikiTopicPicker();
}

function renderProjectFolderPicker() {
  const folders = state.projectCreationFolders || [];
  return `
    <div class="project-folder-picker ${folders.length ? 'has-selection' : ''}" data-project-folder-picker>
      <input
        class="project-folder-input"
        id="projectSourceFolderInput"
        type="file"
        data-project-folder-input
        webkitdirectory
        directory
        multiple
      />
      ${folders.length ? `
        <div class="project-folder-selection" aria-live="polite">
          ${folders.map((folder) => `
            <div class="project-folder-item">
              <span class="project-folder-icon"><i data-lucide="folder-check"></i></span>
              <span class="project-folder-details">
                <strong>${escapeHtml(folder.name)}</strong>
                <small>${Number.isFinite(folder.fileCount) ? `${folder.fileCount} 个文件` : '本地文件夹'}</small>
              </span>
              <button type="button" aria-label="移除文件夹 ${escapeAttribute(folder.name)}" data-project-folder-remove="${escapeAttribute(folder.name)}">
                <i data-lucide="x"></i>
              </button>
            </div>
          `).join('')}
          <label class="project-folder-replace" for="projectSourceFolderInput">
            <i data-lucide="refresh-cw"></i>
            <span>重新选择</span>
          </label>
        </div>
      ` : `
        <label class="project-folder-empty" for="projectSourceFolderInput">
          <i data-lucide="folder-plus"></i>
          <span>
            <strong>选择 Snack 可读取和编辑的文件夹</strong>
            <small>点击选择本地项目资料或代码目录</small>
          </span>
        </label>
      `}
    </div>
  `;
}

function refreshProjectFolderPicker() {
  const picker = document.querySelector('[data-project-folder-picker]');
  if (!(picker instanceof HTMLElement)) return;
  picker.outerHTML = renderProjectFolderPicker();
  renderIcons();
}

function handleProjectFolderSelection(input) {
  const files = [...(input.files || [])];
  if (!files.length) return;
  const folders = new Map();
  files.forEach((file) => {
    const relativePath = String(file.webkitRelativePath || file.name || '');
    const [folderName] = relativePath.split('/').filter(Boolean);
    if (!folderName) return;
    const folder = folders.get(folderName) || { name: folderName, fileCount: 0 };
    folder.fileCount += 1;
    folders.set(folderName, folder);
  });
  if (!folders.size) return;
  state.projectCreationFolders = [...folders.values()];
  refreshProjectFolderPicker();
}

function removeProjectFolder(name) {
  state.projectCreationFolders = state.projectCreationFolders.filter((folder) => folder.name !== name);
  refreshProjectFolderPicker();
}

function renderProjectMemberPicker() {
  const selectedMembers = state.projectCreationMembers || [];
  const selectedNames = new Set(selectedMembers.map((member) => member.name));
  const query = state.projectMemberQuery.trim().toLowerCase();
  const options = getProjectMemberDirectory()
    .filter((member) => !selectedNames.has(member.name))
    .filter((member) => !query || `${member.name} ${member.role} ${member.isAgent ? 'agent 智能体' : '人员 同事'}`.toLowerCase().includes(query));
  return `
    <div class="project-member-picker ${state.projectMemberPickerOpen ? 'open' : ''}" data-project-member-picker>
      <div class="project-member-control">
        ${selectedMembers.map((member) => `
          <span class="project-member-selected ${member.isAgent ? 'agent' : 'human'}">
            <em>${escapeHtml(member.name.slice(0, 1))}</em>
            <strong>${escapeHtml(member.name)}</strong>
            <button type="button" aria-label="移除 ${escapeAttribute(member.name)}" data-project-member-remove="${escapeAttribute(member.name)}">
              <i data-lucide="x"></i>
            </button>
          </span>
        `).join('')}
        <input
          type="search"
          data-project-member-search
          value="${escapeAttribute(state.projectMemberQuery)}"
          autocomplete="off"
          aria-label="搜索人员或 Agent"
          aria-expanded="${state.projectMemberPickerOpen ? 'true' : 'false'}"
          aria-controls="projectMemberOptions"
          placeholder="${selectedMembers.length ? '继续搜索人员或 Agent' : '搜索人员或 Agent'}"
        />
        <i class="project-member-chevron" data-lucide="chevron-down"></i>
      </div>
      ${state.projectMemberPickerOpen ? `
        <section class="project-member-options" id="projectMemberOptions" role="listbox" aria-label="可邀请的人员与 Agent">
          <header>
            <span>${query ? `搜索“${escapeHtml(state.projectMemberQuery.trim())}”` : '人员与 Agent'}</span>
            <small>${options.length} 个结果</small>
          </header>
          <div class="project-member-option-list">
            ${options.length ? options.map(renderProjectMemberOption).join('') : `
              <p class="project-member-empty">没有找到匹配的人员或 Agent</p>
            `}
          </div>
        </section>
      ` : ''}
    </div>
  `;
}

function renderProjectMemberOption(member) {
  return `
    <button class="project-member-option" type="button" role="option" data-project-member-option="${escapeAttribute(member.name)}">
      <span class="project-member-option-avatar ${member.isAgent ? 'agent' : 'human'}">
        <i data-lucide="${member.isAgent ? 'bot' : 'user-round'}"></i>
      </span>
      <span class="project-member-option-main">
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(member.role)}</small>
      </span>
      <em>${member.isAgent ? 'Agent' : '人员'}</em>
    </button>
  `;
}

function getProjectMemberDirectory() {
  const directory = new Map();
  const addMember = (name, isAgent) => {
    if (!name || name === currentUserName || name === 'Snack') return;
    const existing = directory.get(name);
    if (existing?.isAgent || (!isAgent && existing)) return;
    directory.set(name, {
      name,
      isAgent,
      role: getCollaboratorRole(name, isAgent),
    });
  };
  projectFolders.forEach((project) => {
    (project.members || []).forEach((name) => addMember(
      name,
      (project.agents || []).includes(name) || name.endsWith('Agent'),
    ));
    (project.agents || []).forEach((name) => addMember(name, true));
  });
  agents.forEach((agent) => addMember(agent.name, true));
  return [...directory.values()].sort((a, b) => {
    if (a.isAgent !== b.isAgent) return a.isAgent ? 1 : -1;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
}

function refreshProjectMemberPicker(options = {}) {
  const picker = document.querySelector('[data-project-member-picker]');
  if (!(picker instanceof HTMLElement)) return;
  picker.outerHTML = renderProjectMemberPicker();
  renderIcons();
  if (options.focusSearch) syncProjectMemberSearchFocus();
}

function syncProjectMemberSearchFocus() {
  window.setTimeout(() => {
    const input = document.querySelector('[data-project-member-search]');
    if (!(input instanceof HTMLInputElement)) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function openProjectMemberPicker() {
  if (state.projectWikiTopicPickerOpen) {
    state.projectWikiTopicPickerOpen = false;
    refreshProjectWikiTopicPicker();
  }
  state.projectMemberPickerOpen = true;
  refreshProjectMemberPicker({ focusSearch: true });
}

function closeProjectMemberPicker() {
  if (!state.projectMemberPickerOpen) return;
  state.projectMemberPickerOpen = false;
  refreshProjectMemberPicker();
}

function selectProjectMember(name) {
  const member = getProjectMemberDirectory().find((item) => item.name === name);
  if (!member || state.projectCreationMembers.some((item) => item.name === member.name)) return;
  state.projectCreationMembers = [...state.projectCreationMembers, member];
  state.projectMemberQuery = '';
  state.projectMemberPickerOpen = true;
  refreshProjectMemberPicker({ focusSearch: true });
}

function removeProjectMember(name) {
  state.projectCreationMembers = state.projectCreationMembers.filter((member) => member.name !== name);
  state.projectMemberPickerOpen = true;
  refreshProjectMemberPicker({ focusSearch: true });
}

function createNewProject(form) {
  const editingProject = getProjectById(state.projectEditingId);
  const formData = new FormData(form);
  const title = String(formData.get('project-name') || '').trim();
  const objective = String(formData.get('project-objective') || '').trim();
  const wikiTopics = [...(state.projectCreationWikiTopics || [])];
  const sourceFolders = (state.projectCreationFolders || []).map((folder) => ({ ...folder }));
  const invitedMembers = [...state.projectCreationMembers];
  const invitedPeople = invitedMembers.filter((member) => !member.isAgent);
  const invitedAgents = invitedMembers.filter((member) => member.isAgent);
  const monitoringDraft = String(formData.get('monitoring-rule-draft') || '').trim();
  const monitoringRules = parseProjectMonitoringRules(formData);
  const monitoringTypes = [...new Set(monitoringRules.map((rule) => rule.type).filter(Boolean))];
  const monitoringType = monitoringTypes.length === 1 ? monitoringTypes[0] : monitoringTypes.length ? 'mixed' : '';
  const operatingRules = mergeProjectMonitoringOperatingRules(editingProject, monitoringRules);
  const pushRule = monitoringRules.length
    ? `数据监控：${monitoringRules.map((rule) => formatMonitoringRuleSource(rule)).join('；')}`
    : (editingProject?.monitoringRules?.length ? '待确认' : (editingProject?.pushRule || '待确认'));
  if (!title) {
    showToast('请填写项目名称');
    const nameInput = form.querySelector('[data-project-create-name]');
    if (nameInput instanceof HTMLInputElement) nameInput.focus();
    return;
  }
  if (monitoringDraft) {
    const monitoringInput = form.querySelector('[data-monitoring-rule-input]');
    const editor = monitoringInput?.closest('[data-monitoring-rules-editor]');
    setMonitoringRuleError(editor, '这段描述尚未通过识别，请修改后再次智能识别。');
    if (monitoringInput instanceof HTMLTextAreaElement) monitoringInput.focus();
    return;
  }
  if (editingProject) {
    editingProject.title = title;
    editingProject.summary = objective ? truncateProjectSummary(objective) : '等待补充项目目标';
    editingProject.objective = objective || '待补充项目目标';
    editingProject.wikiTopics = wikiTopics;
    editingProject.sourceFolders = sourceFolders;
    editingProject.monitoringType = monitoringType;
    editingProject.monitoringRules = monitoringRules;
    editingProject.operatingRules = operatingRules;
    editingProject.pushRule = pushRule;
    editingProject.updated = '现在';
    state.projectCreationOpen = false;
    state.projectEditingId = null;
    state.projectCreationMembers = [];
    state.projectCreationWikiTopics = [];
    state.projectWikiTopicPickerOpen = false;
    state.projectCreationFolders = [];
    state.projectMemberQuery = '';
    state.projectMemberPickerOpen = false;
    render();
    showToast('项目配置已保存');
    return;
  }
  const serial = state.projectSerial;
  const projectId = `project-draft-${serial}`;
  const project = buildNewProject(projectId, serial);
  project.title = title;
  project.summary = objective ? truncateProjectSummary(objective) : '等待补充项目目标';
  project.objective = objective || '待补充项目目标';
  project.wikiTopics = wikiTopics;
  project.sourceFolders = sourceFolders;
  project.members = [currentUserName, ...invitedPeople.map((member) => member.name)];
  project.agents = ['Snack', ...invitedAgents.map((member) => member.name)];
  project.rememberedPeople = [
    [currentUserName, '项目发起人，负责目标确认和执行授权'],
    ...invitedPeople.map((member) => [member.name, '受邀项目成员，参与项目协作和任务确认']),
    ...invitedAgents.map((member) => [member.name, `受邀 ${member.role}，按项目任务节点处理对应工作`]),
  ];
  project.monitoringType = monitoringType;
  project.monitoringRules = monitoringRules;
  project.operatingRules = operatingRules;
  project.pushRule = pushRule;
  state.projectSerial += 1;
  projectFolders.unshift(project);
  state.projectCreationOpen = false;
  state.projectEditingId = null;
  state.projectCreationWikiTopics = [];
  state.projectWikiTopicPickerOpen = false;
  state.projectCreationFolders = [];
  state.view = 'projectBoard';
  state.taskTab = 'projects';
  state.activeProject = projectId;
  state.activeSession = null;
  state.activeIssue = null;
  state.activeIssueTab = null;
  state.activeLooseSession = null;
  state.selectedAgent = 'Snack';
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  state.boardSidebarOpen = false;
  state.projectDetailOpen = true;
  state.memberSidebarOpen = false;
  state.taskFilterOpen = false;
  state.agentStatusOpen = false;
  state.renamingProjectId = null;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.composerProjectId = projectId;
  state.modelPickerOpen = false;
  state.projectPickerOpen = false;
  state.projectPickerQuery = '';
  render();
  scrollProjectHistoryToTop();
  showToast('项目已创建，信息已同步到任务看板');
}

function truncateProjectSummary(objective) {
  const normalized = objective.replace(/\s+/g, ' ');
  return normalized.length > 36 ? `${normalized.slice(0, 36)}…` : normalized;
}

function parseProjectMonitoringRules(formData) {
  const metrics = formData.getAll('monitoring-metric').map((value) => String(value).trim());
  const operators = formData.getAll('monitoring-operator').map((value) => String(value).trim());
  const values = formData.getAll('monitoring-value').map((value) => String(value).trim());
  const units = formData.getAll('monitoring-unit').map((value) => String(value).trim());
  const types = formData.getAll('monitoring-type').map((value) => String(value).trim());
  const sources = formData.getAll('monitoring-source').map((value) => String(value).trim());
  return metrics.map((metric, index) => ({
    metric,
    operator: operators[index] || '≥',
    value: values[index] || '',
    unit: units[index] || getMonitoringMetricInfo(metric)?.unit || '',
    type: types[index] || getMonitoringMetricInfo(metric)?.type || '',
    source: sources[index] || '',
  })).filter((rule) => rule.metric && rule.value);
}

function mergeProjectMonitoringOperatingRules(project, monitoringRules) {
  const previousMetrics = new Set((project?.monitoringRules || []).map((rule) => rule.metric));
  const preservedRules = (project?.operatingRules || []).filter(([title]) => !previousMetrics.has(title));
  const nextMonitoringRules = monitoringRules.map((rule) => {
    const valueWithUnit = rule.unit === '%'
      ? `${rule.value}${rule.unit}`
      : `${rule.value}${rule.unit ? ` ${rule.unit}` : ''}`;
    return [rule.metric, `${rule.operator} ${valueWithUnit}`];
  });
  return [...preservedRules, ...nextMonitoringRules];
}

function confirmProjectRename(input) {
  const projectId = input.dataset.projectTitleInput;
  const project = getProjectById(projectId);
  if (!project) return;
  project.title = input.value.trim() || '未命名项目';
  state.renamingProjectId = null;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  render();
}

function startProjectRename(projectId) {
  if (!getProjectById(projectId)) return;
  state.renamingProjectId = projectId;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  render();
}

function toggleProjectPin(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  let message = '';
  if (project.pinnedAt) {
    project.pinnedAt = null;
    message = '已取消置顶';
  } else {
    project.pinnedAt = Date.now();
    message = '项目已置顶';
  }
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  render();
  scrollProjectHistoryToTop();
  showToast(message);
}

function removeProjectFromSidebar(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  const confirmed = window.confirm(`确定要从左侧移除「${project.title}」吗？项目实体和已有任务不会删除。`);
  if (!confirmed) {
    state.openProjectMenuId = null;
    state.openProjectCreateMenuId = null;
    render();
    return;
  }
  project.removedFromSidebar = true;
  project.removedAt = Date.now();
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  if (state.composerProjectId === projectId) {
    const nextProject = getVisibleProjectFolders()[0];
    state.composerProjectId = nextProject ? nextProject.id : null;
  }
  if (state.renamingProjectId === projectId) state.renamingProjectId = null;
  if (state.activeProject === projectId) {
    const nextProject = getVisibleProjectFolders()[0];
    state.activeProject = nextProject ? nextProject.id : null;
    state.activeSession = null;
    state.activeIssue = null;
    state.activeIssueTab = null;
    state.activeLooseSession = null;
    state.boardSidebarOpen = false;
    state.memberSidebarOpen = false;
    state.taskFilterOpen = false;
    state.agentStatusOpen = false;
    state.view = nextProject ? 'projectBoard' : 'tasks';
    state.taskTab = 'projects';
  }
  render();
  scrollProjectHistoryToTop();
  showToast('已从左侧移除，项目实体未删除');
}

function scrollProjectHistoryToTop() {
  projectHistory.scrollTop = 0;
}

function submitProjectIntake(projectId) {
  const input = document.querySelector(`[data-ask-input="${projectId}"]`);
  if (!(input instanceof HTMLTextAreaElement)) return;
  const brief = input.value.trim();
  if (!brief) {
    showToast('先告诉 Snack 这个项目要做什么');
    input.focus();
    return;
  }
  if (isContinuousProjectBrief(brief)) {
    simulateComplexTaskBrief(projectId, brief, { autoSetup: true });
    return;
  }
  simulateOneOffProjectBrief(projectId, brief);
}

function isContinuousProjectBrief(brief) {
  const keywords = ['持续', '长期', '每天', '每日', '定时', '监控', '盯盘', '跟进', '提醒', '异常', '数据', '投放', '线索', '成本', '多人', '协作', '项目群'];
  const score = keywords.reduce((total, keyword) => total + (brief.includes(keyword) ? 1 : 0), 0);
  return score >= 2
    || (brief.includes('投放') && brief.includes('监控'))
    || (brief.includes('异常') && brief.includes('提醒'));
}

function simulateOneOffProjectBrief(projectId, brief) {
  const project = getProjectById(projectId);
  if (!project) return;
  const session = ensureProjectIntakeSession(project);
  if (session.messages.length) return;
  session.messages.push(
    ['田晓柔', brief, '刚刚'],
    [
      'Snack',
      '我先把它理解成一次项目对齐，还不能确定它需要持续跟进。我会先继续追问目标、交付物、参与人和是否需要周期性数据；如果你补充监控频率、异常提醒或多人协作规则，我会把它升级成持续跟进项目。',
      '刚刚',
    ],
  );
  state.view = 'project';
  state.activeProject = projectId;
  state.activeSession = session.id;
  render();
}

function simulateComplexTaskBrief(projectId, brief, options = {}) {
  const project = getProjectById(projectId);
  if (!project) return;
  const session = ensureProjectIntakeSession(project);
  if (session.messages.some((message) => message[1].includes('需要持续监控'))) return;
  const userBrief = brief || '@Snack 我想做一个吊车线索投放监控项目，重点看快手和巨量的线索成本、消耗节奏，异常时要提醒我确认调整。';
  const autoSetup = options.autoSetup === true;
  session.messages.push(
    ['田晓柔', userBrief, '刚刚'],
    [
      'Snack',
      autoSetup
        ? '这是一个需要持续监控、多人协作和后续执行的长时间任务。我会直接接入投放监控 mock，生成项目看板、项目群、Agent 团队和第一条监控链路。'
        : '这是一个需要持续监控、多人协作和后续执行的长时间任务。我建议帮你搭建项目看板，拉入投放Agent和数据监控Agent，并创建项目群一起处理。确认后我会创建任务看板、项目群和第一条监控链路。',
      '刚刚',
      autoSetup ? undefined : [{ type: 'confirmSetup', label: '确认搭建看板和Agent团队' }],
    ],
  );
  state.view = 'project';
  state.activeProject = projectId;
  state.activeSession = session.id;
  state.renamingProjectId = null;
  if (autoSetup) {
    confirmProjectSetup(projectId, { autoSetup: true, sourceBrief: userBrief });
    return;
  }
  render();
}

function confirmProjectSetup(projectId, options = {}) {
  const project = getProjectById(projectId);
  if (!project) return;
  const issueCode = project.mockIssueCode || 'ADS-101';
  if (project.taskCodes.includes(issueCode)) {
    openProjectSession(projectId, 'group');
    return;
  }
  project.title = project.title === '未命名项目' ? '吊车投放监控项目' : project.title;
  project.summary = '吊车线索投放监控与异常调整';
  project.objective = '持续监控快手和巨量吊车投放数据，异常时给出调整建议并跟进执行结果。';
  project.health = '运行中';
  project.agents = ['Snack', '投放Agent', '数据监控Agent'];
  project.members = ['田晓柔', 'Snack', '投放Agent', '数据监控Agent'];
  project.rememberedPeople = [
    ['田晓柔', '项目发起人，负责目标确认和执行授权'],
    ['投放Agent', '负责投放策略执行、计划调整和执行结果同步'],
    ['数据监控Agent', '负责每日数据推送、异常识别和调整建议'],
  ];
  project.pushRule = '数据监控Agent 每天 10:00 推送监控结果；异常时实时 @ 项目发起人确认。';
  project.operatingRules = [
    ['定时推送', '数据监控Agent 每天 10:00 推送监控结果。'],
    ['异常升级', '发现异常时实时 @ 项目负责人确认。'],
    ['执行确认', '投放Agent 必须在收到人的确认后执行调整。'],
    ['结果回写', '执行结果写入任务节点，并通知数据监控Agent继续复核。'],
  ];
  project.agentStatuses = [
    ['Snack', '待命', '项目协调、上下文整理和任务流转'],
    ['投放Agent', '工作中', '执行快手预算调整和素材替换'],
    ['数据监控Agent', '工作中', '继续监控调整后的 CPL 和消耗节奏'],
  ];
  project.taskCodes = [issueCode];
  const sourceBrief = options.sourceBrief
    || (project.sessions.find((item) => item.id === 'snack-intake') || project.sessions[0])?.messages.find((message) => message[0] === '田晓柔')?.[1]
    || '@Snack 我想做一个吊车线索投放监控项目，重点看快手和巨量的线索成本、消耗节奏，异常时要提醒我确认调整。';
  project.groupMessages = [
    ['田晓柔', sourceBrief, '刚刚'],
    ['Snack', '我识别这是持续投放监控项目，会把目标沉淀到项目看板，并拉起项目群和 Agent 分工。', '刚刚'],
    ['Snack', '项目群已创建。当前成员：田晓柔、Snack、投放Agent、数据监控Agent。田晓柔是项目发起人，负责目标确认和执行授权。', '刚刚'],
    ['Snack', '投放Agent 负责投放执行和调整落地；数据监控Agent 负责每日数据推送、异常识别和调整建议。需要时你可以继续拉入其他同事到这个项目。', '刚刚'],
    ['田晓柔', '@数据监控Agent 帮我每天监控快手和巨量吊车投放的线索成本、消耗节奏和素材点击率。', '刚刚'],
    ['数据监控Agent', '收到。我会每天 10:00 推送结果到群里；发现异常时会给出调整建议并 @ 你确认。', '刚刚'],
    ['数据监控Agent', '@田晓柔 今日异常：快手吊车计划 CPL 较 7 日均值上涨 31%，消耗节奏超出预算节奏 18%。建议将高成本计划预算下调 20%，并替换两组点击率下滑素材。是否确认创建执行任务？', '10:00'],
    ['田晓柔', '确认，先按这个方案跟进。', '10:03'],
    ['数据监控Agent', `已创建任务 ${issueCode}「快手吊车计划异常调整执行」，分配给投放Agent。你可以点击右侧项目任务打开任务看板查看详情。`, '10:04'],
  ];
  const session = project.sessions.find((item) => item.id === 'snack-intake') || project.sessions[0];
  const setupActions = [
    { type: 'group', label: '进入项目群' },
    { type: 'projectBoard', label: '打开项目看板' },
  ];
  if (options.autoSetup) {
    session.messages.push([
      'Snack',
      '已接上 mock 数据：项目看板、项目群、投放Agent、数据监控Agent 和快手吊车计划异常调整任务都已创建。',
      '刚刚',
      setupActions,
    ]);
  } else {
    session.messages.push(
      ['田晓柔', '确认，帮我搭建。', '刚刚'],
      [
        'Snack',
        '已完成：项目看板已创建，投放Agent和数据监控Agent已拉入项目群。点击左侧项目文件夹可以看到项目任务看板；在任务工作台也能看到当前你参与的运行中任务。',
        '刚刚',
        setupActions,
      ],
    );
  }
  if (!getIssueByCode(issueCode)) issues.push(buildMockExecutionIssue(projectId, issueCode));
  state.renamingProjectId = null;
  openProjectSession(projectId, 'group');
  if (options.autoSetup) showToast('已识别为持续跟进任务，并接入投放监控 mock');
}

function buildMockExecutionIssue(projectId, issueCode) {
  return {
    code: issueCode,
    title: '快手吊车计划异常调整执行',
    projectId,
    status: 'in_progress',
    issueType: '投放执行任务',
    owner: '投放Agent',
    reviewer: '田晓柔',
    priority: 'P0',
    stage: '数据复核',
    tag: '投放',
    desc: '数据监控Agent 发现快手吊车投放线索成本异常后创建任务，分配给投放Agent执行预算调整和素材替换，并通知数据监控Agent继续复核。',
    count: '5/6',
    predecessor: null,
    relatedTasks: [],
    source: '项目群聊 / 数据监控Agent 异常提醒',
    nodes: [
      { title: '发起监控', state: 'done', detail: '田晓柔在群里 @数据监控Agent，要求每天监控快手和巨量吊车投放数据。' },
      { title: '每日推送', state: 'done', detail: '数据监控Agent 设置每天 10:00 推送线索成本、消耗节奏和素材点击率。' },
      { title: '异常识别', state: 'done', detail: '快手 CPL 较 7 日均值上涨 31%，消耗节奏超预算节奏 18%。' },
      { title: '用户确认', state: 'done', detail: 'Snack 和数据监控Agent @田晓柔 确认调整建议，用户确认执行。' },
      { title: '投放执行', state: 'done', detail: '投放Agent 已收到任务，完成预算下调和衰退素材替换。' },
      { title: '数据复核', state: 'active', detail: '投放Agent 已通知数据监控Agent，数据监控Agent 正在观察调整后 CPL 和消耗节奏。' },
    ],
    evidence: ['快手吊车计划 CPL +31%', '消耗节奏超预算节奏 18%', '两组素材 CTR 连续下滑'],
    artifacts: ['异常监控摘要', '投放执行记录', '复核观察窗口'],
    activity: [
      ['数据监控Agent', '@田晓柔 发现快手吊车计划 CPL 异常，建议下调预算并替换衰退素材。', '10:00'],
      ['田晓柔', '确认执行。', '10:03'],
      ['数据监控Agent', `已创建任务 ${issueCode}，并分配给投放Agent。`, '10:04'],
      ['投放Agent', '已收到任务，开始执行快手计划预算调整和素材替换。', '10:05'],
      ['投放Agent', '执行完成：预算已下调 20%，两组衰退素材已替换。已通知数据监控Agent继续复核。', '10:24'],
      ['数据监控Agent', '已开启调整后观察窗口，明天 10:00 推送首轮对比结果。', '10:25'],
    ],
    comments: [['田晓柔', '执行动作需要保留记录，后续看线索质量。', '10:26']],
    logs: ['监控任务已建立', '投放Agent 执行完成', '数据监控Agent 复核中'],
  };
}

function setTaskTab(tab) {
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  if (tab === 'schedule') {
    state.meetingReturnView = ['tasks', 'projectBoard'].includes(state.view)
      ? state.view
      : (state.activeProject ? 'projectBoard' : 'tasks');
    state.taskTab = 'schedule';
    state.view = 'projectSchedule';
    state.activeProject = state.activeProject || 'snack-product-iteration';
    state.activeIssue = null;
    state.activeSession = null;
    state.selectedMeetingId = isMeetingSetupCompleted(state.activeProject)
      ? state.selectedMeetingId
      : null;
    getMeetingSetupDraft(state.activeProject);
    state.taskFilterOpen = false;
    state.agentStatusOpen = false;
    state.memberSidebarOpen = false;
    render();
    return;
  }
  state.taskTab = tab;
  state.view = tab === 'projects' && state.view === 'projectSchedule'
    ? (state.meetingReturnView || 'projectBoard')
    : 'tasks';
  state.activeIssue = tab === 'projects' ? state.activeIssueTab : null;
  state.taskFilterOpen = false;
  state.agentStatusOpen = false;
  state.memberSidebarOpen = false;
  render();
}

function setActiveTodoIssue(issueCode) {
  if (!getIssueByCode(issueCode)) return;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.view = 'tasks';
  state.taskTab = 'todos';
  state.activeTodoIssue = issueCode;
  state.activeIssue = null;
  state.activeLooseSession = null;
  state.logDocIssue = null;
  render();
}

function openConfirmationRevision(issueCode) {
  const issue = getIssueByCode(issueCode);
  if (!hasPendingConfirmation(issue)) return;
  if (!ensureCurrentUserCanReview(issue)) return;
  state.editingConfirmationIssue = issueCode;
  render();
  window.setTimeout(() => {
    const textarea = document.querySelector(`[data-confirmation-revision-form="${CSS.escape(issueCode)}"] textarea`);
    if (textarea instanceof HTMLTextAreaElement) textarea.focus();
  }, 0);
}

function cancelConfirmationRevision(issueCode) {
  if (state.editingConfirmationIssue !== issueCode) return;
  state.editingConfirmationIssue = null;
  render();
}

function confirmIssueExecution(issueCode) {
  const issue = getIssueByCode(issueCode);
  if (!hasPendingConfirmation(issue)) return;
  if (!ensureCurrentUserCanReview(issue)) return;
  const confirmation = issue.confirmation;
  confirmation.status = 'confirmed';
  confirmation.confirmedBy = currentUserName;
  confirmation.confirmedAt = '刚刚';
  confirmation.updatedAt = '刚刚';
  issue.stage = '执行调整';
  issue.count = '5/6';
  issue.nodes.forEach((node) => {
    if (node.title === '人工确认') {
      node.state = 'done';
      node.detail = `${currentUserName} 已确认方案 v${confirmation.version}，确认记录已写入任务日志。`;
    }
    if (node.title === '执行调整') {
      node.state = 'active';
      node.detail = '投放监控 Agent 已收到确认，正在通过 MCP 执行；无写权限的动作将生成投手操作清单。';
    }
  });
  issue.comments.push([currentUserName, `确认执行方案 v${confirmation.version}。`, '刚刚']);
  issue.activity.push(['投放监控 Agent', '已收到人工确认，任务进入执行调整节点。', '刚刚']);
  issue.logs.push(`方案 v${confirmation.version} 已由 ${currentUserName} 确认`);
  const project = getProjectById(issue.projectId);
  if (project) {
    project.groupMessages.push(
      [currentUserName, `确认执行 ${issue.code} 方案 v${confirmation.version}。`, '刚刚'],
      ['投放监控 Agent', `已收到确认，${issue.code} 已进入执行调整节点；执行结果会继续回写任务并同步到群聊。`, '刚刚'],
    );
  }
  state.editingConfirmationIssue = null;
  render();
  showToast('已确认执行，任务已进入执行节点');
}

function deferIssueExecution(issueCode) {
  const issue = getIssueByCode(issueCode);
  if (!hasPendingConfirmation(issue)) return;
  if (!ensureCurrentUserCanReview(issue)) return;
  const confirmation = issue.confirmation;
  confirmation.status = 'deferred';
  confirmation.deferredBy = currentUserName;
  confirmation.deferredAt = '刚刚';
  confirmation.updatedAt = '刚刚';
  issue.stage = '已暂缓';
  const confirmNode = issue.nodes.find((node) => node.title === '人工确认');
  if (confirmNode) confirmNode.detail = `${currentUserName} 选择暂不执行方案 v${confirmation.version}，任务保留在当前节点。`;
  issue.comments.push([currentUserName, `暂不执行方案 v${confirmation.version}。`, '刚刚']);
  issue.activity.push(['投放监控 Agent', '已暂停执行，保留当前方案和任务上下文。', '刚刚']);
  issue.logs.push(`方案 v${confirmation.version} 已由 ${currentUserName} 暂缓`);
  const project = getProjectById(issue.projectId);
  if (project) {
    project.groupMessages.push(
      [currentUserName, `暂不执行 ${issue.code} 方案 v${confirmation.version}。`, '刚刚'],
      ['投放监控 Agent', `已暂停 ${issue.code}，当前方案和任务上下文已保留。`, '刚刚'],
    );
  }
  state.editingConfirmationIssue = null;
  render();
  showToast('已暂缓执行，任务和方案已保留');
}

function submitConfirmationRevision(form) {
  const issueCode = form.dataset.confirmationRevisionForm;
  const issue = getIssueByCode(issueCode);
  if (!hasPendingConfirmation(issue)) return;
  if (!ensureCurrentUserCanReview(issue)) return;
  const formData = new FormData(form);
  const reason = String(formData.get('confirmationReason') || '').trim();
  if (!reason) {
    showToast('请先填写需要修改的地方');
    return;
  }
  const confirmation = issue.confirmation;
  confirmation.version += 1;
  confirmation.updatedAt = '刚刚';
  confirmation.revisionReason = reason;
  confirmation.plan = [
    confirmation.plan[0],
    ['调整约束', `已根据反馈调整：${reason}`],
    confirmation.plan[2],
  ];
  const confirmNode = issue.nodes.find((node) => node.title === '人工确认');
  if (confirmNode) confirmNode.detail = `已收到修改意见并重新分析，当前等待确认方案 v${confirmation.version}。`;
  issue.comments.push([currentUserName, `需要修改：${reason}`, '刚刚']);
  issue.activity.push(['投放监控 Agent', `已根据反馈重新分析并推送方案 v${confirmation.version}，等待再次确认。`, '刚刚']);
  issue.logs.push(`方案 v${confirmation.version - 1} 收到修改意见：${reason}`);
  const project = getProjectById(issue.projectId);
  if (project) {
    project.groupMessages.push(
      [currentUserName, `需要修改：${reason}`, '刚刚'],
      [
        '投放监控 Agent',
        `已根据你的反馈重新分析并生成方案 v${confirmation.version}，请再次确认。`,
        '刚刚',
        [{ type: 'confirmationCard', issueCode, version: confirmation.version }],
      ],
    );
  }
  state.editingConfirmationIssue = null;
  render();
  showToast(`已重新生成方案 v${confirmation.version}，等待再次确认`);
}

function openProject(projectId) {
  const project = getProjectById(projectId);
  if (project && isProjectIntakeBlank(project)) {
    openProjectSession(projectId, 'snack-intake');
    return;
  }
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.modelPickerOpen = false;
  state.projectPickerOpen = false;
  state.composerProjectId = projectId;
  state.view = 'projectBoard';
  state.taskTab = 'projects';
  state.activeProject = projectId;
  state.activeSession = null;
  state.activeIssue = null;
  state.activeIssueTab = null;
  state.activeLooseSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  state.boardSidebarOpen = false;
  state.projectDetailOpen = true;
  state.memberSidebarOpen = false;
  state.taskFilterOpen = false;
  state.agentStatusOpen = false;
  render();
}

function openProjectSession(projectId, sessionId) {
  const project = getProjectById(projectId);
  const session = project?.sessions.find((item) => item.id === sessionId);
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.modelPickerOpen = false;
  state.projectPickerOpen = false;
  state.composerProjectId = projectId;
  if (session?.kind === 'record-summary') {
    state.view = 'recordSummary';
    state.snackRecordSummaryId = session.recordingId;
    state.snackRecordSummaryProjectId = projectId;
    state.activeProject = projectId;
    state.activeSession = sessionId;
    state.activeIssue = null;
    state.activeLooseSession = null;
    state.agentMenuOpen = false;
    state.logDocIssue = null;
    state.boardSidebarOpen = false;
    state.memberSidebarOpen = false;
    state.taskFilterOpen = false;
    state.agentStatusOpen = false;
    render();
    scrollSnackRecordFollowup();
    return;
  }
  state.view = sessionId === 'meeting-schedule' ? 'projectSchedule' : 'project';
  if (sessionId === 'meeting-schedule') {
    state.meetingReturnView = 'projectBoard';
    state.taskTab = 'schedule';
    state.selectedMeetingId = isMeetingSetupCompleted(projectId) ? state.selectedMeetingId : null;
    getMeetingSetupDraft(projectId);
  }
  state.activeProject = projectId;
  state.activeSession = sessionId === 'meeting-schedule' ? null : sessionId;
  state.activeIssue = null;
  state.activeLooseSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  state.boardSidebarOpen = false;
  state.memberSidebarOpen = false;
  state.taskFilterOpen = false;
  state.agentStatusOpen = false;
  render();
}

function createMeetingIntakeSession(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  const serial = state.draftSerial;
  const session = {
    id: `meeting-intake-${serial}`,
    title: '新建会议日程',
    with: 'Snack',
    updated: '刚刚',
    icon: 'calendar-plus',
    kind: 'meeting-intake',
    stage: 'collecting-context',
    messages: [
      [
        'Snack',
        '我来帮你在这个项目中新建一个日程。先告诉我：这是一个什么日程、主题是什么、关于哪项业务、计划邀请哪些参会人，以及它还与谁有关。',
        '刚刚',
        [{ type: 'meetingIntakeGuide' }],
      ],
    ],
  };
  state.draftSerial += 1;
  project.sessions.unshift(session);
  project.updated = '现在';
  state.projectChatDraftProjectId = null;
  state.projectChatDraft = '';
  state.collapsedProjects = state.collapsedProjects.filter((id) => id !== projectId);
  openProjectSession(projectId, session.id);
  showToast('已在项目中新建会议日程会话');
}

function submitMeetingIntake(projectId, sessionId) {
  const project = getProjectById(projectId);
  const session = project?.sessions.find((item) => item.id === sessionId && item.kind === 'meeting-intake');
  if (!session) return;
  const input = document.querySelector(`[data-meeting-intake-input="${sessionId}"]`);
  if (!(input instanceof HTMLTextAreaElement)) return;
  const brief = input.value.trim();
  if (!brief) {
    showToast('先告诉 Snack 这个日程的主题、业务和相关人员');
    input.focus();
    return;
  }
  session.messages.push(
    [currentUserName, brief, '刚刚'],
    [
      'Snack',
      session.stage === 'collecting-context'
        ? '收到，我已经把日程类型、主题、业务背景和相关人员记在这个项目会话里。接下来请继续告诉我具体日期或重复频率、开始时间、预计时长，以及希望提前多久提醒；我会整理成日程供你确认。'
        : '收到，我会继续把这条补充合并进日程信息。还缺少的时间、频率或提醒方式，我会在这里继续向你确认。',
      '刚刚',
    ],
  );
  session.stage = 'collecting-time';
  session.updated = '刚刚';
  project.updated = '现在';
  state.projectChatDraftProjectId = null;
  state.projectChatDraft = '';
  render();
  showToast('日程信息已记录到项目会话');
}

function toggleAgentStatus() {
  state.agentStatusOpen = !state.agentStatusOpen;
  render();
}

function toggleProjectCollapse(projectId) {
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  const collapsed = state.collapsedProjects.includes(projectId);
  state.collapsedProjects = collapsed
    ? state.collapsedProjects.filter((id) => id !== projectId)
    : [...state.collapsedProjects, projectId];
  render();
}

function toggleProjectSessions(projectId) {
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  const expanded = state.expandedSessionLists.includes(projectId);
  state.expandedSessionLists = expanded
    ? state.expandedSessionLists.filter((id) => id !== projectId)
    : [...state.expandedSessionLists, projectId];
  render();
}

function toggleProjectMenu(projectId) {
  state.openProjectCreateMenuId = null;
  state.openProjectMenuId = state.openProjectMenuId === projectId ? null : projectId;
  render();
}

function toggleProjectCreateMenu(projectId) {
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = state.openProjectCreateMenuId === projectId ? null : projectId;
  render();
}

function runProjectMenuAction(action, projectId) {
  if (action === 'add-schedule') return startMeetingSetupGuide(projectId);
  if (action === 'rename') return startProjectRename(projectId);
  if (action === 'pin') return toggleProjectPin(projectId);
  if (action === 'remove') return removeProjectFromSidebar(projectId);
}

function startMeetingSetupGuide(projectId) {
  if (!getProjectById(projectId)) return;
  state.meetingSetupCompletedProjects = state.meetingSetupCompletedProjects
    .filter((completedProjectId) => completedProjectId !== projectId);
  delete state.meetingSetupDrafts[projectId];
  persistMeetingSetupCompletedProjects();
  openProjectSession(projectId, 'meeting-schedule');
}

function runProjectCreateAction(action, projectId) {
  if (action === 'single') return createSingleChat(projectId);
  if (action === 'group') return createGroupChat(projectId);
  state.openProjectCreateMenuId = null;
  render();
}

function openIssue(issueCode) {
  const issue = getIssueByCode(issueCode);
  if (!issue) return;
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  const currentView = ['tasks', 'projectBoard'].includes(state.view) ? state.view : 'projectBoard';
  state.view = currentView;
  state.taskTab = 'projects';
  state.activeIssue = issueCode;
  state.activeIssueTab = issueCode;
  state.openIssueTabs = state.openIssueTabs.includes(issueCode)
    ? state.openIssueTabs.filter((code) => getIssueByCode(code))
    : [...state.openIssueTabs.filter((code) => getIssueByCode(code)), issueCode];
  state.activeProject = issue.projectId;
  state.activeSession = null;
  state.activeLooseSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  state.boardSidebarOpen = false;
  state.memberSidebarOpen = false;
  render();
}

function setIssueWorkspaceTab(tab) {
  if (tab === 'board') {
    state.activeIssue = null;
    state.activeIssueTab = null;
    state.logDocIssue = null;
    render();
    return;
  }
  const issue = getIssueByCode(tab);
  if (!issue) return;
  state.taskTab = 'projects';
  state.view = ['tasks', 'projectBoard'].includes(state.view) ? state.view : 'projectBoard';
  state.activeIssue = issue.code;
  state.activeIssueTab = issue.code;
  state.openIssueTabs = state.openIssueTabs.includes(issue.code)
    ? state.openIssueTabs.filter((code) => getIssueByCode(code))
    : [...state.openIssueTabs.filter((code) => getIssueByCode(code)), issue.code];
  state.activeProject = issue.projectId;
  state.activeSession = null;
  state.activeLooseSession = null;
  state.logDocIssue = null;
  render();
}

function closeIssueTab(issueCode) {
  const previousTabs = state.openIssueTabs.filter((code) => getIssueByCode(code));
  const closedIndex = previousTabs.indexOf(issueCode);
  const nextTabs = previousTabs.filter((code) => code !== issueCode);
  state.openIssueTabs = nextTabs;
  if (state.logDocIssue === issueCode) state.logDocIssue = null;
  if (state.activeIssueTab !== issueCode) {
    render();
    return;
  }
  const nextCode = nextTabs[Math.min(Math.max(closedIndex, 0), nextTabs.length - 1)] || null;
  state.activeIssue = nextCode;
  state.activeIssueTab = nextCode;
  if (nextCode) {
    const nextIssue = getIssueByCode(nextCode);
    state.activeProject = nextIssue.projectId;
    state.view = ['tasks', 'projectBoard'].includes(state.view) ? state.view : 'projectBoard';
  }
  render();
}

function createSingleChat(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  const agentName = project.agents[0] || 'Snack';
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.view = 'chat';
  state.activeProject = projectId;
  state.selectedAgent = agentName;
  state.activeSession = null;
  state.activeIssue = null;
  state.activeLooseSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  state.boardSidebarOpen = false;
  state.memberSidebarOpen = false;
  state.taskFilterOpen = false;
  state.agentStatusOpen = false;
  render();
}

function createGroupChat(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;
  if (!project.groupMessages || !project.groupMessages.length) {
    project.groupMessages = [
      ['田晓柔', `创建「${project.title}」项目群。`, '刚刚'],
      ['Snack', '项目群已创建。我会把成员、Agent 和后续任务进展同步到这里。', '刚刚'],
    ];
  }
  if (state.collapsedProjects.includes(projectId)) {
    state.collapsedProjects = state.collapsedProjects.filter((id) => id !== projectId);
  }
  openProjectSession(projectId, 'group');
}

function openLooseSession(sessionId) {
  const session = getSortedLooseSessions().find((item) => item.id === sessionId);
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  if (session && ['recordSummary', 'record-summary'].includes(session.kind)) {
    state.view = 'recordSummary';
    state.snackRecordSummaryId = session.recordingId;
    state.snackRecordSummaryProjectId = null;
    state.activeLooseSession = session.id;
    state.activeProject = null;
    state.activeIssue = null;
    state.activeSession = null;
    state.agentMenuOpen = false;
    state.logDocIssue = null;
    render();
    scrollSnackRecordFollowup();
    return;
  }
  state.view = 'loose';
  state.activeLooseSession = sessionId;
  state.activeIssue = null;
  state.activeSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  if (session) state.selectedAgent = session.agent;
  render();
}

function openAgentChat(agentName) {
  state.openProjectMenuId = null;
  state.openProjectCreateMenuId = null;
  state.view = 'chat';
  state.selectedAgent = agentName;
  state.activeIssue = null;
  state.activeLooseSession = null;
  state.activeSession = null;
  state.agentMenuOpen = false;
  state.logDocIssue = null;
  render();
}

function toggleAgentMenu() {
  state.agentMenuOpen = !state.agentMenuOpen;
  render();
}

function selectProjectAgent(agentName) {
  state.selectedAgent = agentName;
  state.agentMenuOpen = false;
  render();
}

function setBoardSidebar(mode) {
  const nextOpen = mode === 'open' ? true : mode === 'close' ? false : !state.boardSidebarOpen;
  state.boardSidebarOpen = nextOpen;
  if (nextOpen) {
    state.memberSidebarOpen = false;
    state.agentStatusOpen = false;
  }
  render();
}

function setProjectDetailSidebar(mode) {
  const nextOpen = mode === 'open' ? true : mode === 'close' ? false : !state.projectDetailOpen;
  state.projectDetailOpen = nextOpen;
  if (!nextOpen) {
    state.memberManagerOpen = false;
    state.memberManagerQuery = '';
  }
  state.memberSidebarOpen = false;
  render();
}

function setMemberSidebar(mode) {
  const nextOpen = mode === 'open' ? true : mode === 'close' ? false : !state.memberSidebarOpen;
  state.memberSidebarOpen = nextOpen;
  if (!nextOpen) {
    state.memberManagerOpen = false;
    state.memberManagerQuery = '';
  }
  if (nextOpen) {
    state.boardSidebarOpen = false;
    state.agentStatusOpen = false;
  }
  render();
}

function setMemberPanelTab(tab) {
  state.memberPanelTab = tab === 'instructions' ? 'instructions' : 'members';
  if (state.memberPanelTab !== 'members') {
    state.memberManagerOpen = false;
    state.memberManagerQuery = '';
  }
  state.memberSidebarOpen = true;
  state.boardSidebarOpen = false;
  state.agentStatusOpen = false;
  render();
}

function toggleTaskFilter() {
  state.taskFilterOpen = !state.taskFilterOpen;
  render();
}

function setResourceTab(tab) {
  state.resourceTab = tab;
  render();
}

function setAgentTab(tab) {
  state.agentTab = tab;
  render();
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2000);
}

function openLogDoc(issueCode) {
  if (!getIssueByCode(issueCode)) return;
  state.logDocIssue = issueCode;
  render();
}

function closeLogDoc() {
  state.logDocIssue = null;
  render();
}

function handleMeetingClick(target, event) {
  if (target.dataset.meetingSetupAction) {
    handleMeetingSetupAction(target.dataset.meetingSetupAction, target.dataset.meetingSetupValue);
    return;
  }
  if (target.dataset.demoDevice) {
    state.demoDevice = target.dataset.demoDevice === 'mobile' ? 'mobile' : 'desktop';
    if (state.demoDevice === 'mobile') state.recordingCaptureMode = 'mic_only';
    render();
    return;
  }
  if (target.dataset.meetingSelect) {
    const meeting = getMeetingById(target.dataset.meetingSelect);
    if (!meeting) return;
    if (meeting.status === 'scheduled' && !meeting.brief) {
      openMeetingConversation(meeting, {
        draft: '帮我生成会前简报',
        focusComposer: true,
      });
      return;
    }
    if (meeting.status === 'brief_ready') {
      openMeetingConversation(meeting);
      return;
    }
    state.selectedMeetingId = meeting.id;
    state.meetingAgendaDate = meeting.date;
    render();
    return;
  }
  if (target.dataset.meetingDate) {
    state.meetingAgendaDate = target.dataset.meetingDate;
    render();
    return;
  }
  if (target.dataset.meetingWeek) {
    if (target.dataset.meetingWeek === 'today') state.meetingWeekOffset = 0;
    if (target.dataset.meetingWeek === 'previous') state.meetingWeekOffset -= 1;
    if (target.dataset.meetingWeek === 'next') state.meetingWeekOffset += 1;
    const dates = getDisplayedWeekDates();
    state.meetingAgendaDate = state.meetingWeekOffset === 0 ? '2026-07-31' : dates[0];
    state.selectedMeetingId = null;
    render();
    return;
  }
  if (target.dataset.meetingEvidence) {
    state.meetingTranscriptTime = transcriptTimestampToSeconds(target.dataset.meetingEvidence);
    state.meetingTranscriptOpen = true;
    state.meetingActionReviewOpen = false;
    render();
    return;
  }
  const action = target.dataset.meetingAction;
  if (!action) return;
  if (action === 'new') {
    createMeetingIntakeSession(state.activeProject || 'snack-product-iteration');
    return;
  }
  if (action === 'edit') {
    state.meetingModalId = target.dataset.meetingId || state.selectedMeetingId;
    render();
    return;
  }
  if (action === 'close-modal') {
    if (event?.target?.classList?.contains('meeting-modal-backdrop') || target.closest('button')) {
      state.meetingModalId = null;
      render();
    }
    return;
  }
  if (action === 'delete') {
    deleteMeeting(target.dataset.meetingId, target.dataset.meetingDeleteScope || 'occurrence');
    return;
  }
  if (action === 'open-group') {
    openProjectSession(state.activeProject || 'snack-product-iteration', 'group');
    return;
  }
  if (action === 'simulate-start') {
    simulateMeetingStart();
    return;
  }
  if (action === 'dismiss-notice') {
    state.meetingNoticeOpen = false;
    render();
    return;
  }
  if (action === 'request-record') {
    state.meetingNoticeOpen = false;
    state.meetingPermissionOpen = true;
    render();
    return;
  }
  if (action === 'cancel-permission') {
    state.meetingPermissionOpen = false;
    render();
    return;
  }
  if (action === 'grant-all' || action === 'grant-mic-only') {
    grantMeetingRecordingPermission(action === 'grant-mic-only' ? 'mic_only' : 'system_and_mic');
    return;
  }
  if (action === 'pause') {
    pauseMeetingRecording();
    return;
  }
  if (action === 'resume') {
    resumeMeetingRecording();
    return;
  }
  if (action === 'hide-recorder') {
    state.meetingRecorderHidden = true;
    render();
    return;
  }
  if (action === 'open-recorder') {
    state.meetingRecorderHidden = false;
    render();
    return;
  }
  if (action === 'end-recording') {
    state.meetingEndConfirmOpen = true;
    render();
    return;
  }
  if (action === 'continue-recording') {
    state.meetingEndConfirmOpen = false;
    render();
    return;
  }
  if (action === 'confirm-end') {
    startMeetingProcessing();
    return;
  }
  if (action === 'finish-processing') {
    finishMeetingProcessing();
    return;
  }
  if (action === 'open-session') {
    const meeting = getMeetingById(target.dataset.meetingId || state.selectedMeetingId);
    if (meeting) openMeetingConversation(meeting);
    return;
  }
  if (action === 'close-transcript') {
    state.meetingTranscriptOpen = false;
    render();
    return;
  }
  if (action === 'toggle-player') {
    const total = transcriptSegments[transcriptSegments.length - 1].start + 180;
    state.meetingTranscriptTime = (state.meetingTranscriptTime + 15) % total;
    render();
    return;
  }
  if (action === 'share') {
    state.meetingShareOpen = true;
    render();
    return;
  }
  if (action === 'close-share') {
    state.meetingShareOpen = false;
    render();
    return;
  }
  if (action === 'review-actions') {
    state.meetingActionReviewOpen = true;
    render();
    return;
  }
  if (action === 'close-action-review') {
    state.meetingActionReviewOpen = false;
    render();
    return;
  }
  if (action === 'advance') {
    advanceMeetingDemo();
    return;
  }
  if (action === 'reset') resetMeetingDemo();
}

function getSnackRecordDetectionResult(draft) {
  const override = new URLSearchParams(window.location.search).get('snackRecord');
  if (override === 'installed') return 'installed';
  if (override === 'missing') return 'missing';
  return draft.recordInstallStarted ? 'installed' : 'missing';
}

function startSnackRecordDetection(projectId, step = 'record') {
  const draft = getMeetingSetupDraft(projectId);
  const requestId = ++snackRecordDetectionSerial;
  draft.recordDetectionRequestId = requestId;
  draft.recordDetectionStatus = 'checking';
  draft.recordConfigured = null;
  draft.step = step;
  render();
  window.setTimeout(() => {
    const currentDraft = getMeetingSetupDraft(projectId);
    if (currentDraft.recordDetectionRequestId !== requestId) return;
    currentDraft.recordDetectionStatus = getSnackRecordDetectionResult(currentDraft);
    currentDraft.recordConfigured = currentDraft.recordDetectionStatus === 'installed' ? true : null;
    render();
    const thread = document.querySelector('.meeting-setup-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, snackRecordDetectionDelay);
}

function handleMeetingSetupAction(action, value) {
  const projectId = state.activeProject || 'snack-product-iteration';
  const draft = getMeetingSetupDraft(projectId);
  let shouldDetectRecord = false;
  let detectionStep = 'record';
  if (action === 'has-meetings') {
    draft.hasMeetings = true;
    draft.step = 'preparation';
  }
  if (action === 'no-meetings') {
    draft.hasMeetings = false;
    shouldDetectRecord = true;
  }
  if (action === 'set-lead') {
    draft.leadHours = Number(value) || 1;
    shouldDetectRecord = true;
  }
  if (action === 'record-download') {
    draft.recordConfigured = null;
    draft.usedRecordGuide = true;
    draft.recordInstallStarted = true;
    draft.step = 'record-guide';
  }
  if (action === 'record-recheck') {
    shouldDetectRecord = true;
    detectionStep = draft.usedRecordGuide ? 'record-recheck' : 'record';
  }
  if (action === 'record-continue' && draft.recordDetectionStatus === 'installed') {
    draft.recordConfigured = true;
    draft.step = 'complete';
  }
  if (action === 'record-skip') {
    draft.recordConfigured = false;
    draft.step = 'complete';
  }
  if (action === 'restart') {
    state.meetingSetupDrafts[projectId] = {
      step: 'intro',
      hasMeetings: null,
      meetingDescription: '',
      leadHours: 1,
      recordConfigured: null,
      usedRecordGuide: false,
      recordDetectionStatus: 'idle',
      recordInstallStarted: false,
      recordDetectionRequestId: ++snackRecordDetectionSerial,
    };
  }
  if (shouldDetectRecord) {
    startSnackRecordDetection(projectId, detectionStep);
    return;
  }
  if (action === 'skip' || action === 'open-calendar') {
    if (!state.meetingSetupCompletedProjects.includes(projectId)) {
      state.meetingSetupCompletedProjects.push(projectId);
      persistMeetingSetupCompletedProjects();
    }
    state.selectedMeetingId = null;
    render();
    showToast(action === 'skip' ? '已跳过首次配置，可随时在日历中补充' : '配置已保存，已进入会议日历');
    return;
  }
  render();
  window.setTimeout(() => {
    const thread = document.querySelector('.meeting-setup-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, 0);
}

function submitMeetingSetupDescription(form) {
  const projectId = state.activeProject || 'snack-product-iteration';
  const draft = getMeetingSetupDraft(projectId);
  const data = new FormData(form);
  const description = String(data.get('meetingDescription') || '').trim();
  if (!description) {
    showToast('请先填写会议安排');
    form.querySelector('[data-meeting-setup-input]')?.focus();
    return;
  }
  draft.meetingDescription = description;
  draft.step = 'preparation';
  render();
  window.setTimeout(() => {
    const thread = document.querySelector('.meeting-setup-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, 0);
}

function saveMeetingForm(form) {
  const data = new FormData(form);
  const formId = form.dataset.meetingForm;
  const isWeekly = data.get('meetingCadence') === 'weekly';
  const editScope = String(data.get('meetingEditScope') || 'occurrence');
  const memberNames = data.getAll('meetingMembers').map(String);
  if (!memberNames.length) {
    showToast('请至少选择一位参会人');
    return;
  }
  const payload = {
    projectId: state.activeProject || 'snack-product-iteration',
    title: String(data.get('meetingTitle') || '').trim(),
    date: String(data.get('meetingDate') || ''),
    startTime: String(data.get('meetingStartTime') || ''),
    duration: Number(data.get('meetingDuration') || 60),
    status: 'scheduled',
    memberNames,
    reminderMinutes: Number(data.get('meetingReminder') || 30),
    source: isWeekly ? 'Snack 周期日程' : 'Snack 日程',
    briefSources: data.getAll('meetingSources').map(String),
  };
  if (formId === 'new') {
    const meetingId = `meeting-demo-${Date.now()}`;
    if (isWeekly) {
      const seriesId = `meeting-series-${Date.now()}`;
      const nextMeetingId = `${meetingId}-next`;
      meetingSeries.push({
        id: seriesId,
        projectId: payload.projectId,
        title: payload.title,
        cadence: '每周',
        startTime: payload.startTime,
        duration: payload.duration,
        memberNames: [...payload.memberNames],
        reminderMinutes: payload.reminderMinutes,
        briefSources: [...payload.briefSources],
        nextOccurrenceId: nextMeetingId,
        isDemoCreated: true,
      });
      payload.seriesId = seriesId;
      meetingOccurrences.push({
        id: nextMeetingId,
        ...payload,
        date: formatMeetingDateISO(addMeetingDays(parseMeetingDate(payload.date), 7)),
        isDemoCreated: true,
      });
    }
    meetingOccurrences.push({ id: meetingId, ...payload, isDemoCreated: true });
    state.selectedMeetingId = meetingId;
    state.meetingAgendaDate = payload.date;
    showToast(`已创建${isWeekly ? '周期' : '单次'}会议`);
  } else {
    const meeting = getMeetingById(formId);
    if (!meeting) return;
    const existingSeriesId = meeting.seriesId;
    let seriesId = existingSeriesId;
    if (isWeekly && !seriesId) {
      seriesId = `meeting-series-${Date.now()}`;
      const nextMeetingId = `${meeting.id}-next`;
      meetingSeries.push({
        id: seriesId,
        projectId: payload.projectId,
        title: payload.title,
        cadence: '每周',
        startTime: payload.startTime,
        duration: payload.duration,
        memberNames: [...payload.memberNames],
        reminderMinutes: payload.reminderMinutes,
        briefSources: [...payload.briefSources],
        nextOccurrenceId: nextMeetingId,
        isDemoCreated: true,
      });
      meetingOccurrences.push({
        id: nextMeetingId,
        ...payload,
        seriesId,
        date: formatMeetingDateISO(addMeetingDays(parseMeetingDate(payload.date), 7)),
        isDemoCreated: true,
      });
    }
    if (isWeekly && seriesId && editScope === 'series') {
      meetingOccurrences
        .filter((occurrence) => occurrence.seriesId === seriesId)
        .forEach((occurrence) => Object.assign(occurrence, {
          ...payload,
          date: occurrence.id === meeting.id ? payload.date : occurrence.date,
          status: occurrence.status,
          seriesId,
        }));
      const series = meetingSeries.find((item) => item.id === seriesId);
      if (series) Object.assign(series, {
        title: payload.title,
        startTime: payload.startTime,
        duration: payload.duration,
        memberNames: [...payload.memberNames],
        reminderMinutes: payload.reminderMinutes,
        briefSources: [...payload.briefSources],
      });
    } else {
      Object.assign(meeting, { ...payload, status: meeting.status });
      if (isWeekly && seriesId) meeting.seriesId = seriesId;
    }
    if (!isWeekly && existingSeriesId) {
      if (editScope === 'series') {
        meetingOccurrences
          .filter((occurrence) => occurrence.seriesId === existingSeriesId)
          .forEach((occurrence) => {
            delete occurrence.seriesId;
            occurrence.source = 'Snack 日程';
          });
        const seriesIndex = meetingSeries.findIndex((item) => item.id === existingSeriesId);
        if (seriesIndex >= 0) meetingSeries.splice(seriesIndex, 1);
      } else {
        delete meeting.seriesId;
      }
      meeting.source = 'Snack 日程';
    }
    state.selectedMeetingId = meeting.id;
    state.meetingAgendaDate = meeting.date;
    showToast('会议日程已更新');
  }
  state.meetingModalId = null;
  render();
}

function deleteMeeting(meetingId, scope = 'occurrence') {
  const meeting = getMeetingById(meetingId);
  if (!meeting) return;
  const deletingSeries = scope === 'series' && meeting.seriesId;
  if (!window.confirm(`确认删除「${meeting.title}」${deletingSeries ? '整个周期系列' : '本次日程'}？这只会影响当前 Demo。`)) return;
  if (deletingSeries) {
    for (let index = meetingOccurrences.length - 1; index >= 0; index -= 1) {
      if (meetingOccurrences[index].seriesId === meeting.seriesId) meetingOccurrences.splice(index, 1);
    }
    const seriesIndex = meetingSeries.findIndex((series) => series.id === meeting.seriesId);
    if (seriesIndex >= 0) meetingSeries.splice(seriesIndex, 1);
  } else {
    const index = meetingOccurrences.indexOf(meeting);
    if (index >= 0) meetingOccurrences.splice(index, 1);
    if (meeting.seriesId) {
      const series = meetingSeries.find((item) => item.id === meeting.seriesId);
      const remaining = meetingOccurrences.filter((occurrence) => occurrence.seriesId === meeting.seriesId);
      if (series) series.nextOccurrenceId = remaining[0]?.id || null;
      if (!remaining.length) {
        const seriesIndex = meetingSeries.indexOf(series);
        if (seriesIndex >= 0) meetingSeries.splice(seriesIndex, 1);
      }
    }
  }
  state.meetingModalId = null;
  state.selectedMeetingId = null;
  render();
  showToast('会议已删除');
}

function simulateMeetingStart() {
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  meeting.status = 'upcoming';
  state.selectedMeetingId = meeting.id;
  state.meetingAgendaDate = meeting.date;
  state.meetingNoticeOpen = true;
  state.meetingRecorderHidden = false;
  render();
}

function grantMeetingRecordingPermission(captureMode) {
  const consent = document.querySelector('[data-meeting-consent]');
  if (!(consent instanceof HTMLInputElement) || !consent.checked) {
    showToast('请先确认已取得参会者同意');
    return;
  }
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  state.recordingCaptureMode = state.demoDevice === 'mobile' ? 'mic_only' : captureMode;
  state.meetingPermissionOpen = false;
  state.meetingRecorderHidden = false;
  state.meetingEndConfirmOpen = false;
  state.recordingSeconds = 0;
  meeting.status = 'recording';
  startRecordingTimer();
  render();
}

function startRecordingTimer() {
  stopRecordingTimer();
  recordingTimerId = window.setInterval(() => {
    state.recordingSeconds += 1;
    const timeNodes = document.querySelectorAll('.meeting-recording-time');
    timeNodes.forEach((node) => { node.textContent = formatRecordingTime(state.recordingSeconds); });
  }, 1000);
}

function stopRecordingTimer() {
  if (recordingTimerId !== null) {
    window.clearInterval(recordingTimerId);
    recordingTimerId = null;
  }
}

function pauseMeetingRecording() {
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  meeting.status = 'paused';
  stopRecordingTimer();
  render();
}

function resumeMeetingRecording() {
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  meeting.status = 'recording';
  startRecordingTimer();
  render();
}

function clearMeetingProcessingTimers() {
  meetingProcessingTimerIds.forEach((timerId) => window.clearTimeout(timerId));
  meetingProcessingTimerIds = [];
}

function startMeetingProcessing() {
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  stopRecordingTimer();
  clearMeetingProcessingTimers();
  state.meetingEndConfirmOpen = false;
  state.meetingRecorderHidden = true;
  meeting.status = 'transcribing';
  render();
  meetingProcessingTimerIds.push(window.setTimeout(() => {
    meeting.status = 'summary_generating';
    render();
  }, 1400));
  meetingProcessingTimerIds.push(window.setTimeout(() => {
    finishMeetingProcessing();
  }, 3200));
}

function finishMeetingProcessing() {
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  clearMeetingProcessingTimers();
  stopRecordingTimer();
  createMeetingSummarySession();
  meeting.status = 'needs_review';
  meeting.sessionId = 'product-weekly-20260731';
  state.meetingNoticeOpen = false;
  state.meetingPermissionOpen = false;
  state.meetingEndConfirmOpen = false;
  state.meetingRecorderHidden = true;
  openProjectSession('snack-product-iteration', meeting.sessionId);
}

function getMeetingConversationTitle(meeting) {
  const [, month, day] = meeting.date.split('-');
  return `${meeting.title}｜${month}-${day}`;
}

function buildMeetingConversationMessages(meeting) {
  if (meeting.brief) {
    return [
      ['Snack', `${meeting.title}将在 ${meeting.startTime} 开始。我已经汇总项目任务、群聊和上次会议遗留事项。`, '15:00', [{ type: 'meetingBrief', meetingId: meeting.id }]],
    ];
  }
  if (meeting.status === 'completed') {
    return [['Snack', `${meeting.title}已经结束，会议纪要和后续事项会继续沉淀在这个会话中。`, meeting.startTime]];
  }
  if (meeting.status === 'needs_review') {
    return [['Snack', `${meeting.title}的会议结果已经整理完成，请在这个会话中确认纪要和后续事项。`, meeting.startTime]];
  }
  return [['Snack', `已创建${meeting.title}。会前简报、会议提醒和会后纪要都会通过这个会话发送给你。`, meeting.startTime]];
}

function ensureMeetingConversation(meeting) {
  const project = getProjectById(meeting?.projectId);
  if (!project) return null;
  const sessionId = meeting.sessionId || meeting.id;
  meeting.sessionId = sessionId;
  let session = project.sessions.find((item) => item.id === sessionId);
  if (!session) {
    session = {
      id: sessionId,
      title: getMeetingConversationTitle(meeting),
      with: 'Snack',
      updated: meeting.status === 'brief_ready' ? '刚刚' : '今天',
      icon: 'message-square-text',
      messages: buildMeetingConversationMessages(meeting),
    };
    project.sessions.unshift(session);
  }
  if (!state.expandedSessionLists.includes(project.id)) state.expandedSessionLists.push(project.id);
  return session;
}

function openMeetingConversation(meeting, options = {}) {
  const session = ensureMeetingConversation(meeting);
  if (!session) return;
  if (typeof options.draft === 'string') {
    state.projectChatDraftProjectId = meeting.projectId;
    state.projectChatDraft = options.draft;
  }
  state.selectedMeetingId = null;
  openProjectSession(meeting.projectId, session.id);
  if (options.focusComposer) {
    window.setTimeout(() => {
      const input = document.querySelector(`[data-project-message="${meeting.projectId}"]`);
      if (input instanceof HTMLTextAreaElement) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  }
}

function createMeetingSummarySession() {
  const project = getProjectById('snack-product-iteration');
  const meeting = getMeetingById('product-weekly-20260731');
  if (!project || !meeting) return;
  const session = ensureMeetingConversation(meeting);
  if (!session) return;
  const hasAction = (type) => session.messages.some((message) => message[3]?.some((action) => action.type === type));
  if (!hasAction('meetingTranscript')) {
    session.messages.push(['Snack', '会议记录已完成，正在根据转写生成会议纪要。原始录音和完整转写默认仅你可见。', '17:02', [{ type: 'meetingTranscript', filename: '会议转写-产品周会-20260731.txt', meta: `${formatRecordingTime(Math.max(state.recordingSeconds, 2112))} · ${state.demoDevice === 'mobile' ? '移动端麦克风' : '桌面端系统音频 + 麦克风'}` }]]);
  }
  if (!hasAction('meetingSummary')) {
    session.messages.push(['Snack', '会议纪要已生成。行动项仍处于候选状态，请确认负责人和截止时间后再创建 Task Hub 任务。', '17:03', [{ type: 'meetingSummary' }]]);
  }
  session.updated = '刚刚';
}

function saveMeetingShare(form) {
  const data = new FormData(form);
  const members = data.getAll('shareMembers').map(String);
  if (!members.length) {
    showToast('请选择至少一位项目成员');
    return;
  }
  meetingSummary.shared = true;
  meetingSummary.sharedWith = members;
  state.meetingShareOpen = false;
  render();
  showToast(`会议摘要已模拟分享给 ${members.join('、')}`);
}

function saveMeetingActionReview(form) {
  const data = new FormData(form);
  const pending = actionCandidates.filter((action) => action.status !== 'created');
  for (const action of pending) {
    const assignees = data.getAll(`${action.id}-assignees`).map(String);
    if (!assignees.length) {
      showToast(`请为 ${action.code} 选择至少一位负责人`);
      return;
    }
    action.title = String(data.get(`${action.id}-title`) || action.title).trim();
    action.dueDate = String(data.get(`${action.id}-dueDate`) || action.dueDate);
    action.assignees = assignees;
  }
  pending.forEach(createMeetingIssue);
  const meeting = getMeetingById('product-weekly-20260731');
  if (meeting) meeting.status = 'completed';
  state.meetingActionReviewOpen = false;
  render();
  showToast(`已创建 ${pending.length} 个 Task Hub 任务`);
}

function createMeetingIssue(action) {
  if (issues.some((issue) => issue.code === action.code)) {
    action.status = 'created';
    return;
  }
  issues.push({
    code: action.code,
    title: action.title,
    projectId: action.projectId,
    status: 'backlog',
    issueType: '会议行动项',
    owner: action.assignees.join('、'),
    reviewer: currentUserName,
    priority: 'P1',
    stage: '任务确认完成',
    tag: '会议',
    desc: `${action.title}。由产品周会确认后创建，保留原始录音与转写证据链接。`,
    count: '1/4',
    predecessor: null,
    relatedTasks: actionCandidates.filter((item) => item.id !== action.id).map((item) => item.code),
    source: `产品周会 ${action.evidenceTime}`,
    nodes: [
      { title: '会议提出', state: 'done', detail: `来自产品周会 ${action.evidenceTime} 的行动项候选。` },
      { title: '管理者确认', state: 'done', detail: `${currentUserName} 已确认负责人和截止时间 ${action.dueDate}。` },
      { title: '任务执行', state: 'active', detail: `${action.assignees.join('、')} 负责推进。` },
      { title: '结果复核', state: 'waiting', detail: '完成后由管理者复核，并在下次产品周会中回顾。' },
    ],
    evidence: [`产品周会原始转写 ${action.evidenceTime}`, '管理者确认记录'],
    artifacts: ['会议纪要', '原始转写证据'],
    activity: [
      ['Snack', `从产品周会 ${action.evidenceTime} 提取行动项。`, '刚刚'],
      [currentUserName, `已确认负责人：${action.assignees.join('、')}；截止时间：${action.dueDate}。`, '刚刚'],
    ],
    comments: [],
    logs: [`来源：产品周会 ${action.evidenceTime}`, `负责人：${action.assignees.join('、')}`],
  });
  const project = getProjectById(action.projectId);
  if (project && !project.taskCodes.includes(action.code)) project.taskCodes.push(action.code);
  action.status = 'created';
}

function advanceMeetingDemo() {
  const meeting = getMeetingById('product-weekly-20260731');
  if (!meeting) return;
  if (['scheduled', 'brief_ready'].includes(meeting.status)) {
    simulateMeetingStart();
    return;
  }
  if (meeting.status === 'upcoming') {
    state.meetingPermissionOpen = true;
    state.meetingNoticeOpen = false;
    render();
    return;
  }
  if (['recording', 'paused'].includes(meeting.status)) {
    state.meetingEndConfirmOpen = true;
    state.meetingRecorderHidden = false;
    render();
    return;
  }
  if (['transcribing', 'summary_generating'].includes(meeting.status)) {
    finishMeetingProcessing();
    return;
  }
  if (meeting.status === 'needs_review') {
    createMeetingSummarySession();
    openProjectSession('snack-product-iteration', 'product-weekly-20260731');
    return;
  }
  if (meeting.status === 'completed') {
    openIssue(actionCandidates[0].code);
  }
}

function resetMeetingDemo() {
  stopRecordingTimer();
  clearMeetingProcessingTimers();
  meetingSeries.splice(0, meetingSeries.length, ...JSON.parse(JSON.stringify(initialMeetingSeries)));
  meetingOccurrences.splice(0, meetingOccurrences.length, ...JSON.parse(JSON.stringify(initialMeetingOccurrences)));
  const mainMeeting = getMeetingById('product-weekly-20260731');
  if (mainMeeting) {
    mainMeeting.status = 'brief_ready';
    mainMeeting.sessionId = 'product-weekly-20260731';
  }
  actionCandidates.forEach((action) => { action.status = 'pending'; });
  delete meetingSummary.shared;
  delete meetingSummary.sharedWith;
  for (let index = issues.length - 1; index >= 0; index -= 1) {
    if (issues[index].code.startsWith('MTG-')) issues.splice(index, 1);
  }
  const project = getProjectById('snack-product-iteration');
  if (project) {
    project.sessions = project.sessions.filter((session) => session.id !== 'product-weekly-20260731');
    project.taskCodes = project.taskCodes.filter((code) => !code.startsWith('MTG-'));
  }
  if (mainMeeting) ensureMeetingConversation(mainMeeting);
  state.meetingSetupCompletedProjects = state.meetingSetupCompletedProjects
    .filter((projectId) => projectId !== 'snack-product-iteration');
  delete state.meetingSetupDrafts['snack-product-iteration'];
  persistMeetingSetupCompletedProjects();
  Object.assign(state, {
    view: 'projectSchedule',
    taskTab: 'schedule',
    meetingReturnView: 'projectBoard',
    activeProject: 'snack-product-iteration',
    activeSession: null,
    meetingWeekOffset: 0,
    meetingAgendaDate: '2026-07-31',
    selectedMeetingId: null,
    meetingModalId: null,
    meetingNoticeOpen: false,
    meetingPermissionOpen: false,
    meetingEndConfirmOpen: false,
    meetingRecorderHidden: false,
    meetingTranscriptOpen: false,
    meetingShareOpen: false,
    meetingActionReviewOpen: false,
    meetingTranscriptTime: 0,
    recordingSeconds: 0,
    recordingCaptureMode: state.demoDevice === 'mobile' ? 'mic_only' : 'system_and_mic',
  });
  render();
  showToast('会议 Demo 和首次配置已重置');
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function handleBodyClick(event) {
  if (!(event.target instanceof Element)) return;
  if (suppressConversationClick) {
    event.preventDefault();
    event.stopPropagation();
    suppressConversationClick = false;
    return;
  }
  const clickedInsideSnackRecordPicker = event.target.closest('[data-record-context-picker], [data-record-member-picker]');
  const shouldCloseSnackRecordPicker = (state.snackRecordContextPickerOpen || state.snackRecordMemberPickerOpen)
    && !clickedInsideSnackRecordPicker;
  const snackRecordTarget = event.target.closest('[data-record-action]');
  if (snackRecordTarget) {
    if (shouldCloseSnackRecordPicker) {
      state.snackRecordContextPickerOpen = false;
      state.snackRecordMemberPickerOpen = false;
      state.snackRecordMemberQuery = '';
    }
    handleSnackRecordAction(snackRecordTarget);
    return;
  }
  if (shouldCloseSnackRecordPicker) {
    state.snackRecordContextPickerOpen = false;
    state.snackRecordMemberPickerOpen = false;
    state.snackRecordMemberQuery = '';
    renderSnackRecordDraftUpdate();
    return;
  }
  const meetingTarget = event.target.closest('[data-meeting-setup-action], [data-meeting-action], [data-meeting-select], [data-meeting-date], [data-meeting-week], [data-meeting-evidence], .meeting-demo-controls [data-demo-device]');
  if (meetingTarget) {
    handleMeetingClick(meetingTarget, event);
    return;
  }
  const clickedInsideMemberPicker = event.target.closest('[data-project-member-picker]');
  if (state.projectMemberPickerOpen && !clickedInsideMemberPicker) closeProjectMemberPicker();
  const clickedInsideWikiTopicPicker = event.target.closest('[data-project-wiki-topic-picker]');
  if (state.projectWikiTopicPickerOpen && !clickedInsideWikiTopicPicker) closeProjectWikiTopicPicker();
  const target = event.target.closest('[data-view], [data-create-project], [data-project-config], [data-project-detail-sidebar], [data-project-modal-close], [data-project-modal-backdrop], [data-create-issue], [data-issue-modal-close], [data-issue-modal-backdrop], [data-project-folder-remove], [data-project-wiki-topic-toggle], [data-project-wiki-topic-option], [data-project-member-picker], [data-project-member-search], [data-project-member-option], [data-project-member-remove], [data-monitoring-rule-recognize], [data-monitoring-rule-edit], [data-monitoring-rule-remove], [data-project-intake-submit], [data-meeting-intake-submit], [data-mock-action], [data-confirmation-action], [data-confirmation-cancel], [data-model-menu], [data-model-select], [data-project-picker], [data-project-context], [data-project-context-empty], [data-project-picker-search], [data-agent-status-toggle], [data-task-tab], [data-task-filter], [data-issue-tab], [data-close-issue-tab], [data-todo-inbox-issue], [data-issue-id], [data-log-doc], [data-close-log-doc], [data-project-open], [data-project-toggle], [data-project-sessions], [data-project-session], [data-project-menu], [data-project-action], [data-project-create-menu], [data-project-create-action], [data-loose-session], [data-board-sidebar], [data-member-sidebar], [data-member-tab], [data-member-manager-toggle], [data-member-manager-add], [data-member-manager-remove], [data-agent-tab], [data-agent-chat], [data-agent-menu], [data-agent-select], [data-resource-tab], [data-toast]');
  if (!target) {
    if (state.openProjectMenuId || state.openProjectCreateMenuId || state.modelPickerOpen || state.projectPickerOpen) {
      state.openProjectMenuId = null;
      state.openProjectCreateMenuId = null;
      state.modelPickerOpen = false;
      state.projectPickerOpen = false;
      render();
    }
    return;
  }
  const clickedProjectMenu = target.dataset.projectMenu || target.dataset.projectAction;
  const clickedProjectCreateMenu = target.dataset.projectCreateMenu || target.dataset.projectCreateAction;
  const clickedFloatingControl = target.dataset.modelMenu
    || target.dataset.modelSelect
    || target.dataset.projectPicker
    || target.dataset.projectContext
    || (target.dataset.projectContextEmpty !== undefined)
    || (target.dataset.projectPickerSearch !== undefined)
    || (target.dataset.projectWikiTopicToggle !== undefined)
    || target.dataset.projectWikiTopicOption
    || (target.dataset.projectMemberPicker !== undefined)
    || (target.dataset.projectMemberSearch !== undefined)
    || target.dataset.projectMemberOption
    || target.dataset.projectMemberRemove;
  if (state.openProjectMenuId && !clickedProjectMenu) state.openProjectMenuId = null;
  if (state.openProjectCreateMenuId && !clickedProjectCreateMenu) state.openProjectCreateMenuId = null;
  if (!clickedFloatingControl) {
    state.modelPickerOpen = false;
    state.projectPickerOpen = false;
  }
  if (target.dataset.projectModalClose !== undefined) return closeProjectCreationModal();
  if (target.dataset.projectModalBackdrop !== undefined) {
    if (event.target === target) closeProjectCreationModal();
    return;
  }
  if (target.dataset.issueModalClose !== undefined) return closeIssueCreationModal();
  if (target.dataset.issueModalBackdrop !== undefined) {
    if (event.target === target) closeIssueCreationModal();
    return;
  }
  if (target.dataset.projectDetailSidebar) return setProjectDetailSidebar(target.dataset.projectDetailSidebar);
  if (target.dataset.createIssue !== undefined) return openIssueCreationModal();
  if (target.dataset.projectConfig) return openProjectCreationModal(target.dataset.projectConfig);
  if (target.dataset.projectFolderRemove) return removeProjectFolder(target.dataset.projectFolderRemove);
  if (target.dataset.projectWikiTopicToggle !== undefined) return toggleProjectWikiTopicPicker();
  if (target.dataset.projectWikiTopicOption) return toggleProjectWikiTopic(target.dataset.projectWikiTopicOption);
  if (target.dataset.projectMemberOption) return selectProjectMember(target.dataset.projectMemberOption);
  if (target.dataset.projectMemberRemove) return removeProjectMember(target.dataset.projectMemberRemove);
  if (target.dataset.projectMemberSearch !== undefined || target.dataset.projectMemberPicker !== undefined) return openProjectMemberPicker();
  if (target.dataset.monitoringRuleRecognize !== undefined) return recognizeMonitoringRules(target);
  if (target.dataset.monitoringRuleEdit !== undefined) return editMonitoringRule(target);
  if (target.dataset.monitoringRuleRemove !== undefined) return removeMonitoringRule(target);
  if (target.dataset.modelMenu) return toggleModelPicker();
  if (target.dataset.modelSelect) return selectModel(target.dataset.modelSelect);
  if (target.dataset.projectPicker) return toggleProjectPicker();
  if (target.dataset.projectContext) return selectProjectContext(target.dataset.projectContext);
  if (target.dataset.projectContextEmpty !== undefined) return clearProjectContext();
  if (target.dataset.projectPickerSearch !== undefined) return;
  if (target.dataset.createProject !== undefined) return openProjectCreationModal();
  if (target.dataset.projectMenu) return toggleProjectMenu(target.dataset.projectMenu);
  if (target.dataset.projectAction) return runProjectMenuAction(target.dataset.projectAction, target.dataset.projectId);
  if (target.dataset.projectCreateMenu) return toggleProjectCreateMenu(target.dataset.projectCreateMenu);
  if (target.dataset.projectCreateAction) return runProjectCreateAction(target.dataset.projectCreateAction, target.dataset.projectId);
  if (target.dataset.projectIntakeSubmit) return submitProjectIntake(target.dataset.projectIntakeSubmit);
  if (target.dataset.meetingIntakeSubmit !== undefined) return submitMeetingIntake(target.dataset.projectId, target.dataset.sessionId);
  if (target.dataset.mockAction === 'complexBrief') return simulateComplexTaskBrief(target.dataset.projectId);
  if (target.dataset.mockAction === 'confirmSetup') return confirmProjectSetup(target.dataset.projectId);
  if (target.dataset.confirmationAction === 'confirm') return confirmIssueExecution(target.dataset.issueCode);
  if (target.dataset.confirmationAction === 'revise') return openConfirmationRevision(target.dataset.issueCode);
  if (target.dataset.confirmationAction === 'defer') return deferIssueExecution(target.dataset.issueCode);
  if (target.dataset.confirmationCancel) return cancelConfirmationRevision(target.dataset.confirmationCancel);
  if (target.dataset.agentStatusToggle !== undefined) return toggleAgentStatus();
  if (target.dataset.closeIssueTab) return closeIssueTab(target.dataset.closeIssueTab);
  if (target.dataset.issueTab) return setIssueWorkspaceTab(target.dataset.issueTab);
  if (target.dataset.todoInboxIssue) return setActiveTodoIssue(target.dataset.todoInboxIssue);
  if (target.dataset.logDoc) return openLogDoc(target.dataset.logDoc);
  if (target.dataset.closeLogDoc !== undefined) return closeLogDoc();
  if (target.dataset.issueId) return openIssue(target.dataset.issueId);
  if (target.dataset.taskFilter !== undefined) return toggleTaskFilter();
  if (target.dataset.projectSession) {
    const [projectId, sessionId] = target.dataset.projectSession.split(':');
    return openProjectSession(projectId, sessionId);
  }
  if (target.dataset.projectOpen) return openProject(target.dataset.projectOpen);
  if (target.dataset.projectToggle) return toggleProjectCollapse(target.dataset.projectToggle);
  if (target.dataset.projectSessions) return toggleProjectSessions(target.dataset.projectSessions);
  if (target.dataset.boardSidebar) return setBoardSidebar(target.dataset.boardSidebar);
  if (target.dataset.memberSidebar) return setMemberSidebar(target.dataset.memberSidebar);
  if (target.dataset.memberTab) return setMemberPanelTab(target.dataset.memberTab);
  if (target.dataset.memberManagerToggle !== undefined) return toggleMemberManager();
  if (target.dataset.memberManagerAdd) return addProjectMember(target.dataset.memberManagerAdd);
  if (target.dataset.memberManagerRemove) return removeProjectMemberFromProject(target.dataset.memberManagerRemove);
  if (target.dataset.looseSession) return openLooseSession(target.dataset.looseSession);
  if (target.dataset.agentMenu) return toggleAgentMenu();
  if (target.dataset.agentSelect) return selectProjectAgent(target.dataset.agentSelect);
  if (target.dataset.agentChat) return openAgentChat(target.dataset.agentChat);
  if (target.dataset.taskTab) return setTaskTab(target.dataset.taskTab);
  if (target.dataset.agentTab) return setAgentTab(target.dataset.agentTab);
  if (target.dataset.resourceTab) return setResourceTab(target.dataset.resourceTab);
  if (target.dataset.view) return setView(target.dataset.view);
  if (target.dataset.toast) {
    render();
    return showToast(target.dataset.toast);
  }
}

document.body.addEventListener('dragstart', handleConversationDragStart);
document.body.addEventListener('dragover', handleConversationDragOver);
document.body.addEventListener('drop', handleConversationDrop);
document.body.addEventListener('dragend', handleConversationDragEnd);
document.body.addEventListener('pointerdown', handleConversationPointerDown);
document.body.addEventListener('pointermove', handleConversationPointerMove);
document.body.addEventListener('pointerup', finishConversationPointerDrag);
document.body.addEventListener('pointercancel', cancelConversationPointerDrag);
document.body.addEventListener('click', handleBodyClick);
document.body.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.dataset.meetingSetupForm !== undefined) {
    event.preventDefault();
    submitMeetingSetupDescription(form);
    return;
  }
  if (form.dataset.meetingForm !== undefined) {
    event.preventDefault();
    saveMeetingForm(form);
    return;
  }
  if (form.dataset.meetingShareForm !== undefined) {
    event.preventDefault();
    saveMeetingShare(form);
    return;
  }
  if (form.dataset.meetingActionReviewForm !== undefined) {
    event.preventDefault();
    saveMeetingActionReview(form);
    return;
  }
  if (form.dataset.confirmationRevisionForm !== undefined) {
    event.preventDefault();
    submitConfirmationRevision(form);
    return;
  }
  if (form.dataset.projectCreateForm !== undefined) {
    event.preventDefault();
    createNewProject(form);
    return;
  }
  if (form.dataset.issueCreateForm !== undefined) {
    event.preventDefault();
    createManualIssue(form);
  }
});
document.body.addEventListener('input', (event) => {
  if (event.target instanceof HTMLInputElement && event.target.dataset.recordProjectName !== undefined) {
    state.snackRecordFollowupProjectName = event.target.value;
    return;
  }
  if (event.target instanceof HTMLInputElement && event.target.dataset.recordMemberSearch !== undefined) {
    state.snackRecordMemberQuery = event.target.value;
    state.snackRecordMemberPickerOpen = true;
    render();
    focusSnackRecordMemberSearch();
    return;
  }
  if (event.target instanceof HTMLInputElement && event.target.dataset.recordSearch !== undefined) {
    state.snackRecordQuery = event.target.value;
    if (snackRecordSearchTimerId !== null) window.clearTimeout(snackRecordSearchTimerId);
    snackRecordSearchTimerId = window.setTimeout(() => {
      snackRecordSearchTimerId = null;
      render();
      const input = document.querySelector('[data-record-search]');
      if (input instanceof HTMLInputElement) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 180);
    return;
  }
  if (event.target instanceof HTMLTextAreaElement && event.target.dataset.meetingSetupInput !== undefined) {
    const projectId = state.activeProject || 'snack-product-iteration';
    getMeetingSetupDraft(projectId).meetingDescription = event.target.value;
    return;
  }
  if (event.target instanceof HTMLTextAreaElement && event.target.dataset.projectMessage !== undefined) {
    state.projectChatDraftProjectId = event.target.dataset.projectMessage || null;
    state.projectChatDraft = event.target.value;
    return;
  }
  if (event.target instanceof HTMLTextAreaElement && event.target.dataset.monitoringRuleInput !== undefined) {
    syncMonitoringDraftState(event.target);
    return;
  }
  if (event.target instanceof HTMLInputElement && event.target.dataset.projectMemberSearch !== undefined) {
    state.projectMemberQuery = event.target.value;
    state.projectMemberPickerOpen = true;
    refreshProjectMemberPicker({ focusSearch: true });
    return;
  }
  if (event.target instanceof HTMLInputElement && event.target.dataset.memberManagerSearch !== undefined) {
    state.memberManagerQuery = event.target.value;
    render();
    syncMemberManagerSearchFocus();
    return;
  }
  if (event.target instanceof HTMLInputElement && event.target.dataset.projectPickerSearch !== undefined) {
    state.projectPickerQuery = event.target.value;
    render();
    syncProjectPickerSearchFocus();
  }
});
document.body.addEventListener('change', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.dataset.recordSelect !== undefined) {
    state.snackRecordSelection = target.checked
      ? [...new Set([...state.snackRecordSelection, target.dataset.recordSelect])]
      : state.snackRecordSelection.filter((id) => id !== target.dataset.recordSelect);
    render();
    return;
  }
  if (target instanceof HTMLInputElement && target.dataset.recordSelectAll !== undefined) {
    const visibleIds = getFilteredSnackRecordings().map((recording) => recording.id);
    state.snackRecordSelection = target.checked
      ? [...new Set([...state.snackRecordSelection, ...visibleIds])]
      : state.snackRecordSelection.filter((id) => !visibleIds.includes(id));
    render();
    return;
  }
  if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && target.dataset.recordSetting !== undefined) {
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
    state.snackRecordConfigDraft[target.dataset.recordSetting] = value;
    render();
    return;
  }
  if (target instanceof HTMLInputElement && target.dataset.recordLocalContextInput !== undefined) {
    handleSnackRecordLocalContextSelection(target);
    return;
  }
  if (!(target instanceof HTMLInputElement) || target.dataset.projectFolderInput === undefined) return;
  handleProjectFolderSelection(target);
});
document.body.addEventListener('focusin', (event) => {
  if (!(event.target instanceof HTMLInputElement) || event.target.dataset.projectMemberSearch === undefined) return;
  if (!state.projectMemberPickerOpen) openProjectMemberPicker();
});
document.body.addEventListener('focusout', (event) => {
  if (event.target instanceof HTMLInputElement && event.target.dataset.projectTitleInput) {
    confirmProjectRename(event.target);
  }
});
document.body.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLTextAreaElement && event.target.dataset.meetingIntakeInput && event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitMeetingIntake(state.activeProject || 'snack-product-iteration', event.target.dataset.meetingIntakeInput);
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && event.target instanceof HTMLTextAreaElement && event.target.dataset.monitoringRuleInput !== undefined) {
    const recognizeButton = event.target.closest('[data-monitoring-rules-editor]')?.querySelector('[data-monitoring-rule-recognize]');
    if (recognizeButton instanceof HTMLButtonElement && !recognizeButton.disabled) {
      event.preventDefault();
      recognizeMonitoringRules(recognizeButton);
    }
    return;
  }
  if (event.key === 'Escape' && state.editingConfirmationIssue) {
    event.preventDefault();
    cancelConfirmationRevision(state.editingConfirmationIssue);
    return;
  }
  if (event.key === 'Escape' && (
    state.meetingModalId
    || state.meetingNoticeOpen
    || state.meetingPermissionOpen
    || state.meetingEndConfirmOpen
    || state.meetingTranscriptOpen
    || state.meetingShareOpen
    || state.meetingActionReviewOpen
    || state.selectedMeetingId
  )) {
    state.meetingModalId = null;
    state.meetingNoticeOpen = false;
    state.meetingPermissionOpen = false;
    state.meetingEndConfirmOpen = false;
    state.meetingTranscriptOpen = false;
    state.meetingShareOpen = false;
    state.meetingActionReviewOpen = false;
    if (state.view === 'projectSchedule') state.selectedMeetingId = null;
    render();
    return;
  }
  if (event.key === 'Escape' && (state.snackRecordContextPickerOpen || state.snackRecordMemberPickerOpen)) {
    event.preventDefault();
    state.snackRecordContextPickerOpen = false;
    state.snackRecordMemberPickerOpen = false;
    state.snackRecordMemberQuery = '';
    renderSnackRecordDraftUpdate();
    return;
  }
  if (event.key === 'Escape' && state.projectMemberPickerOpen) {
    event.preventDefault();
    closeProjectMemberPicker();
    return;
  }
  if (event.key === 'Escape' && state.projectWikiTopicPickerOpen) {
    event.preventDefault();
    closeProjectWikiTopicPicker();
    return;
  }
  if (event.key === 'Escape' && state.projectCreationOpen) {
    closeProjectCreationModal();
    return;
  }
  if (event.key === 'Escape' && state.issueCreationOpen) {
    closeIssueCreationModal();
    return;
  }
  if (event.key === 'Escape' && (state.modelPickerOpen || state.projectPickerOpen || state.openProjectMenuId || state.openProjectCreateMenuId)) {
    state.modelPickerOpen = false;
    state.projectPickerOpen = false;
    state.openProjectMenuId = null;
    state.openProjectCreateMenuId = null;
    render();
    return;
  }
  if (event.target instanceof HTMLTextAreaElement && event.target.dataset.askInput && event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitProjectIntake(event.target.dataset.askInput);
    return;
  }
  if (!(event.target instanceof HTMLInputElement) || !event.target.dataset.projectTitleInput) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    confirmProjectRename(event.target);
  }
});
render();
