export const profile = {
  name: '吴伟东',
  englishName: 'WEIDONG WU',
  role: '前端工程师 / 技术负责人',
  email: 'shindouhiro@gmail.com',
  phone: '19147835461',
  github: 'https://github.com/shindouhiro',
  website: 'https://shindou.icu',
  resume: '/resume.pdf',
  education: '广东岭南职业技术学院',
  major: '计算机网络 · 大专',
  educationPeriod: '2010.09 — 2013.06',
}

export interface Project {
  id: string
  number: string
  name: string
  subtitle: string
  category: 'ai' | 'visual'
  categoryLabel: string
  role: string
  description: string
  tags: string[]
  metric: string
  metricLabel: string
  highlights: string[]
}

export const projects: Project[] = [
  {
    id: 'cloudos',
    number: '01',
    name: 'AI-CloudOS',
    subtitle: '数智化研发平台',
    category: 'ai',
    categoryLabel: 'AI 工程化',
    role: '核心架构师 / 全栈负责人',
    description: '从架构到交付，构建 AI 驱动的研发平台，让复杂系统的开发更高效、更有序。',
    tags: ['Angular', 'RxJS', 'Monorepo'],
    metric: '30%+',
    metricLabel: '构建效率提升',
    highlights: ['设计 pnpm Monorepo 架构与单源真相（SSOT）依赖治理，构建效率提升 30%+。', '建立 @antfu/eslint-config 与 CI 门禁，代码风格问题减少 90%+。', '搭建 Iconify 资产流水线，SVG 转 JSON 并按需加载，首屏体积降低 20%+。', '设计 JIT Mounting，以符号链接动态挂载 AI 脚本，提升复杂功能开发效率。', '基于 Angular 与 RxJS 完成复杂系统单人交付，验证 AI 与工程化结合的研发模式。'],
  },
  {
    id: 'nebula',
    number: '02',
    name: 'NebulaAI',
    subtitle: '企业级 AI Agent 平台',
    category: 'ai',
    categoryLabel: 'AI 交互体验',
    role: '流式渲染与性能优化',
    description: '让 AI 的每一次输出自然流动。用增量解析，解决长文本流式渲染的性能瓶颈。',
    tags: ['Next.js', 'SWR', 'Streamdown'],
    metric: 'O(1)',
    metricLabel: '增量渲染复杂度',
    highlights: ['基于 Next.js 与 SWR 构建企业级 AI Agent 平台，支持多端部署与系统集成。', '重构流式渲染链路，以 streamdown 替代 react-markdown。', '引入 Incremental Parsing，避免长文本的全量解析与重绘。', '将每次增量更新的渲染复杂度降至 O(1)，消除长文本卡顿。', '优化 DOM 更新与渲染稳定性，实现流畅的打字机体验。'],
  },
  {
    id: 'atc',
    number: '03',
    name: 'ATC',
    subtitle: '云原生应用拓扑编排平台',
    category: 'visual',
    categoryLabel: '可视化编排',
    role: '架构设计 / 3 人团队负责人',
    description: '把云原生架构变成可视化画布，连接复杂业务与直觉操作。已在阿里云上线。',
    tags: ['React', 'React Flow', 'TypeScript'],
    metric: '< 1s',
    metricLabel: '大规模节点操作延迟',
    highlights: ['设计 DDD Schema 与 TypeScript 类型系统，实现配置驱动 UI。', '深度定制流程图引擎，将节点、连线与业务表单绑定。', '实现撤销重做、分组和自动布局等设计工具级交互。', '优化大规模节点渲染，将操作延迟降至 1 秒以内。', '实现 Jar / Docker 大文件分片上传与虚拟列表优化。', '负责架构设计、任务拆分与 Code Review，带领 3 人团队落地。'],
  },
]

export const experiences = [
  { id: 'xingyun', period: '2021.05 — 至今', company: '深圳行云创新科技有限公司', role: '前端负责人', current: true, summary: '聚焦 AI 研发范式、前端工程化与云原生可视化，推动复杂产品从架构到交付。', achievements: ['Monorepo 与 SSOT 治理，构建效率提升 30%+', 'AI 辅助研发与 JIT Mounting，团队交付效率提升 30%', '增量解析、千级节点交互、全链路 CI 门禁'] },
  { id: 'shengye', period: '2019.09 — 2021.05', company: '盛业信息技术服务有限公司', role: '前端小组长', current: false, summary: '打造可复用的前端基础能力，兼顾业务体验、权限体系与团队质量。', achievements: ['CSS Variables 动态换肤系统', 'ECharts / D3.js 数据与拓扑可视化', 'RBAC 权限路由、公共组件与 Code Review 规范'] },
  { id: 'chuangwei', period: '2015 — 2017', company: '深圳创伟云科科技有限公司', role: 'Rails 工程师', current: false, summary: '参与多租户后台、核心业务 API 与自动化部署，积累完整的全栈交付经验。', achievements: ['Ruby on Rails 多店铺管理系统', 'ActiveRecord 查询优化，报表生成效率提升 30%', 'Capistrano / Mina 部署与 Nginx + Puma 服务'] },
  { id: 'tiandi', period: '2014.06 — 2015.11', company: '天地网科技有限公司', role: 'Rails 工程师', current: false, summary: '从高质量页面还原到后台 API，探索跨端应用与前端基础设施。', achievements: ['UI / UX 实现与后台 JSON 接口', '微信生态、支付集成与 Hybrid 跨端开发', '数据可视化与前端基础架构'] },
]

export const skillGroups = [
  { id: 'frontend', number: '01', title: '界面与交互', subtitle: 'FRONTEND', icon: 'code', items: ['React', 'Angular', 'Vue', 'TypeScript', 'Tailwind CSS'] },
  { id: 'engineering', number: '02', title: '架构与工程化', subtitle: 'ENGINEERING', icon: 'layers', items: ['pnpm Monorepo', 'Vite', 'Webpack', 'Rollup', 'CI/CD'] },
  { id: 'visualization', number: '03', title: '可视化与数据', subtitle: 'VISUALIZATION', icon: 'workflow', items: ['React Flow', 'D3.js', 'RxJS', 'Valtio', 'React Query', 'SWR'] },
  { id: 'backend', number: '04', title: '全栈与基础设施', subtitle: 'FULL STACK', icon: 'server', items: ['Node.js', 'Ruby', 'PHP', 'Docker', 'Nginx', 'Kubernetes'] },
  { id: 'ai', number: '05', title: 'AI 辅助研发', subtitle: 'AI WORKFLOW', icon: 'sparkles', items: ['Claude Code', 'Codex CLI', 'OpenCode', 'Cursor', 'Antigravity'] },
  { id: 'tools', number: '06', title: '开发者工作流', subtitle: 'DEVELOPER TOOLS', icon: 'terminal', items: ['Neovim', 'LazyGit', 'Yazi', 'tmux', 'GitHub Actions', 'Jenkins'] },
]
