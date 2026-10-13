export const profile = {
  name: '吴伟东',
  englishName: 'WEIDONG WU',
  role: '前端工程师 / 技术负责人',
  email: 'shindouhiro@gmail.com',
  phone: '19147835461',
  github: 'https://github.com/shindouhiro',
  website: 'https://shindouhiro.github.io/hikaru/projects/demos.html',
  resume: '/resume.pdf',
  education: '广东岭南职业技术学院',
  major: '计算机网络 · 大专',
  educationPeriod: '2010.09 — 2013.06',
}

export type ProjectCategory = 'business' | 'ai' | 'visual'

export interface Project {
  id: string
  number: string
  name: string
  subtitle: string
  category: ProjectCategory
  categoryLabel: string
  role: string
  description: string
  context: string
  responsibilities: string
  tags: string[]
  metric: string
  metricLabel: string
  solutions: { title: string, detail: string }[]
  outcomes: { value: string, label: string }[]
  stack: { label: string, items: string[] }[]
  outcomeNote?: string
}

export const projects: Project[] = [
  {
    id: 'seres',
    number: '01',
    name: '赛力斯',
    subtitle: '企业培训与学习管理平台',
    category: 'business',
    categoryLabel: '企业业务 / 全栈开发',
    role: '前后端业务开发 / 工程建设',
    description: '贯通课程学习、在线考试与培训审批，用可靠的业务链路连接管理端、学员端和 AI 学习助手。',
    context: '面向企业员工培训与岗位能力提升，建设管理端、学员端及登录门户。覆盖课程与课件、题库与考试、培训报名审批、岗位晋升、证书和统计报表，形成培训任务下发、学习跟踪、考试评估与结果管理的完整流程。',
    responsibilities: '负责课程学习、在线考试、培训审批与统计报表等前后端业务开发，完成页面交互、接口设计、数据持久化及联调，并参与前端模块化、认证权限、实时通知与 AI 集成的建设。',
    tags: ['React 18', 'Spring Boot 4', 'SSE / AG-UI'],
    metric: '幂等交卷',
    metricLabel: '考试计时与提交一致性',
    solutions: [
      { title: '模块化与数据精度', detail: '基于 React、TypeScript 与 TanStack Router 按业务划分页面、服务和 Hooks；通过 pnpm Workspace / Catalogs 共享类型与公共能力，将长整型 ID 统一以字符串传输，避免 JavaScript 数值精度丢失。' },
      { title: '认证与访问边界', detail: '使用 Sa-Token 校验登录与接口权限，结合角色及数据范围约束访问；通过 Spring Cloud Gateway 统一 API 入口、路由转发和跨域处理。' },
      { title: '考试计时与幂等提交', detail: '持久化服务端开考时间，避免刷新页面重置计时；结合数据库唯一约束、行锁与事务控制，实现幂等交卷，避免重复提交和重复计次。' },
      { title: '实时通知与 AI 学习助手', detail: '以 WebSocket 和 Redis 管理站内通知与在线状态，在业务事务提交后触发通知；通过 SSE 消费 AG-UI 流式事件，支持会话管理和历史消息回显。' },
      { title: '测试、迁移与部署', detail: '使用 Liquibase 管理数据库版本；以 Vitest、React Testing Library、Playwright 与 JUnit 验证业务流程，通过 Docker 和 Nginx 支持容器化部署。' },
    ],
    outcomes: [
      { value: '业务闭环', label: '学习 → 考试 → 培训结果' },
      { value: '一致性', label: '服务端计时 / 幂等交卷' },
      { value: 'AI 集成', label: 'AG-UI 事件 / 会话回显' },
    ],
    stack: [
      { label: '前端', items: ['React 18', 'TypeScript', 'Vite', 'TanStack Router', 'Ant Design / Pro Components', 'Tailwind CSS', 'ahooks'] },
      { label: '后端', items: ['Java', 'Spring Boot 4', 'Spring Cloud Gateway', 'MyBatis-Flex', 'Sa-Token', 'MapStruct'] },
      { label: '数据与通信', items: ['MySQL', 'Redis', 'Liquibase', 'WebSocket', 'SSE / AG-UI'] },
      { label: '工程与测试', items: ['pnpm Workspace / Catalogs', 'Maven 多模块', 'ESLint', 'Vitest', 'React Testing Library', 'Playwright', 'JUnit', 'Docker', 'Nginx', 'OpenAPI / Knife4j'] },
    ],
  },
  {
    id: 'cloudos',
    number: '02',
    name: 'AI-CloudOS',
    subtitle: '数智化研发平台',
    category: 'ai',
    categoryLabel: 'AI 工程化',
    role: '核心架构师 / 全栈负责人',
    description: '以 Angular 与 pnpm Monorepo 搭建 AI 驱动的研发底座，支撑营销交互、流程系统与多端应用开发。',
    context: '面向营销交互、流程系统和多端应用的研发需求，以统一的工程架构、依赖治理和资产流水线支撑 AI 驱动开发。',
    responsibilities: '负责核心架构与全栈交付，设计 Monorepo、依赖治理、CI 规范和 AI 脚本集成方式，基于 Angular 与 RxJS 完成复杂系统单人交付。',
    tags: ['Angular', 'RxJS', 'pnpm Monorepo'],
    metric: '30%+',
    metricLabel: '构建效率提升',
    solutions: [
      { title: '统一依赖与工程规范', detail: '设计 pnpm Monorepo 与单源真相（SSOT）依赖治理，提升构建效率与 CI 稳定性；建立 @antfu/eslint-config 和 CI 门禁，统一代码规范。' },
      { title: '按需加载的资产流水线', detail: '构建 Iconify SVG → JSON 资产流水线，通过按需加载降低首屏体积。' },
      { title: 'AI 脚本动态挂载', detail: '设计 JIT Mounting，通过符号链接动态挂载 AI 脚本，提升复杂功能开发效率，验证 AI 与工程化结合的研发模式。' },
    ],
    outcomes: [
      { value: '30%+', label: '构建效率提升' },
      { value: '90%+', label: '代码风格问题减少' },
      { value: '20%+', label: '首屏体积降低' },
    ],
    stack: [
      { label: '应用与架构', items: ['Angular', 'RxJS', 'pnpm Monorepo', 'SSOT'] },
      { label: '研发工程', items: ['@antfu/eslint-config', 'CI 门禁', 'Iconify', 'JIT Mounting'] },
    ],
  },
  {
    id: 'nebula',
    number: '03',
    name: 'NebulaAI',
    subtitle: '企业级 AI Agent 平台',
    category: 'ai',
    categoryLabel: 'AI 交互体验',
    role: '流式渲染重构 / 性能优化',
    description: '重构 AI 长文本流式渲染链路，以增量解析替代全量重绘，优化打字机体验与 DOM 更新稳定性。',
    context: '基于 Next.js 与 SWR 构建企业级 AI Agent 平台，支持多端部署与系统集成。重点解决流式输出中，长文本反复解析与重绘带来的卡顿。',
    responsibilities: '负责流式渲染链路重构、增量解析与 DOM 更新优化，让持续增长的 AI 输出保持流畅和稳定。',
    tags: ['Next.js', 'SWR', 'streamdown'],
    metric: 'O(1)',
    metricLabel: '每次增量更新复杂度',
    solutions: [
      { title: '渲染链路重构', detail: '引入 streamdown 替代 react-markdown，调整 AI 输出的流式渲染链路。' },
      { title: '增量解析与局部更新', detail: '使用 Incremental Parsing 实现增量更新，避免每次输出都对完整文本进行解析与重绘，消除长文本卡顿。' },
      { title: '稳定的打字机体验', detail: '优化 DOM 更新与渲染稳定性，使文本持续输出时保持流畅的打字机效果。' },
    ],
    outcomes: [
      { value: 'O(1)', label: '每次增量更新复杂度' },
      { value: '增量更新', label: '避免全文解析与重绘' },
      { value: '稳定输出', label: '优化长文本打字机体验' },
    ],
    stack: [
      { label: '应用与数据', items: ['Next.js', 'SWR'] },
      { label: '渲染优化', items: ['streamdown', 'Incremental Parsing', 'DOM 更新'] },
    ],
    outcomeNote: 'O(1) 为简历所述增量更新的复杂度，限定于该项目的流式渲染优化场景。',
  },
  {
    id: 'atc',
    number: '04',
    name: 'ATC',
    subtitle: '云原生应用拓扑编排平台',
    category: 'visual',
    categoryLabel: '可视化编排',
    role: '架构设计 / 3 人团队负责人',
    description: '基于 React Flow 打造应用拓扑与调度画布，支持千级节点交互、配置驱动 UI 和大文件分片上传，已在阿里云上线。',
    context: '基于 React 与 React Flow 构建云原生可视化架构工具，实现应用拓扑设计与调度管理，支持复杂业务编排。平台已在阿里云上线。',
    responsibilities: '负责架构设计、任务拆分和 Code Review，带领 3 人团队推进落地；深度定制流程图引擎并优化大规模节点交互性能。',
    tags: ['React', 'React Flow', 'TypeScript'],
    metric: '< 1s',
    metricLabel: '大规模节点操作延迟',
    solutions: [
      { title: '配置驱动的业务编排', detail: '设计 DDD Schema 与 TypeScript 类型系统，实现配置驱动 UI；将节点、连线与业务表单绑定，支持复杂业务编排。' },
      { title: '设计工具级交互', detail: '实现撤销重做、分组与自动布局，优化大规模节点渲染，使操作延迟降至 1 秒以内。' },
      { title: '大文件与长列表优化', detail: '支持 Jar / Docker 大文件分片上传，并通过虚拟列表优化长列表交互。' },
    ],
    outcomes: [
      { value: '< 1s', label: '大规模节点操作延迟' },
      { value: '阿里云', label: '平台已上线' },
      { value: '3 人', label: '带领团队推进落地' },
    ],
    stack: [
      { label: '可视化与架构', items: ['React', 'React Flow', 'TypeScript', 'DDD Schema'] },
      { label: '交互与性能', items: ['撤销重做', '自动布局', '分片上传', '虚拟列表'] },
    ],
  },
]

export const experiences = [
  { id: 'xingyun', period: '2021.05 — 至今', company: '深圳行云创新科技有限公司', role: '前端负责人', current: true, summary: '聚焦 AI 研发范式、前端工程化与云原生可视化，推动复杂产品从架构到交付。', achievements: ['Monorepo 与 SSOT 治理，构建效率提升 30%+', 'AI 辅助研发与 JIT Mounting，团队交付效率提升 30%', '增量解析、千级节点交互、全链路 CI 门禁'] },
  { id: 'shengye', period: '2019.09 — 2021.05', company: '盛业信息技术服务有限公司', role: '前端小组长', current: false, summary: '打造可复用的前端基础能力，兼顾业务体验、权限体系与团队质量。', achievements: ['CSS Variables 动态换肤系统', 'ECharts / D3.js 数据与拓扑可视化', 'RBAC 权限路由、公共组件与 Code Review 规范'] },
  { id: 'chuangwei', period: '2015 — 2017', company: '深圳创伟云科科技有限公司', role: 'Rails 工程师', current: false, summary: '参与多租户后台、核心业务 API 与自动化部署，积累完整的全栈交付经验。', achievements: ['Ruby on Rails 多店铺管理系统', 'ActiveRecord 查询优化，报表生成效率提升 30%', 'Capistrano / Mina 部署与 Nginx + Puma 服务'] },
  { id: 'tiandi', period: '2014.06 — 2015.11', company: '天地网科技有限公司', role: 'Rails 工程师', current: false, summary: '从高质量页面还原到后台 API，探索跨端应用与前端基础设施。', achievements: ['UI / UX 实现与后台 JSON 接口', '微信生态、支付集成与 Hybrid 跨端开发', '数据可视化与前端基础架构'] },
]

export const skillGroups = [
  { id: 'frontend', number: '01', title: '界面与交互', subtitle: 'FRONTEND', icon: 'code', items: ['React', 'Angular', 'Vue', 'TypeScript', 'Tailwind CSS', 'TanStack Router', 'Ant Design'] },
  { id: 'engineering', number: '02', title: '架构与工程化', subtitle: 'ENGINEERING', icon: 'layers', items: ['pnpm Monorepo', 'Vite', 'Webpack', 'Rollup', 'CI/CD', 'pnpm Catalogs'] },
  { id: 'visualization', number: '03', title: '可视化与数据', subtitle: 'VISUALIZATION', icon: 'workflow', items: ['React Flow', 'D3.js', 'RxJS', 'Valtio', 'React Query', 'SWR'] },
  { id: 'backend', number: '04', title: '全栈与基础设施', subtitle: 'FULL STACK', icon: 'server', items: ['Java / Spring Boot', 'Node.js', 'Ruby', 'PHP', 'MySQL / Redis', 'Docker', 'Nginx', 'Kubernetes'] },
  { id: 'ai', number: '05', title: 'AI 辅助研发', subtitle: 'AI WORKFLOW', icon: 'sparkles', items: ['Claude Code', 'Codex CLI', 'OpenCode', 'Cursor', 'Antigravity'] },
  { id: 'tools', number: '06', title: '开发者工作流', subtitle: 'DEVELOPER TOOLS', icon: 'terminal', items: ['Neovim', 'LazyGit', 'Yazi', 'tmux', 'GitHub Actions', 'Jenkins', 'Vitest', 'Playwright', 'JUnit'] },
]
