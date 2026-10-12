# 吴伟东个人简历网站

## 设计方向
深色数字工作台：暖黑背景、荧光绿强调色、Outfit 英文字体与中文无衬线字体。采用非对称首屏、程序生成的立体轨道装置、精细网格和项目概念预览，突出工程与创造力。简历提供全部履历事实，项目概念图不冒充真实产品截图。

## 组件边界
- App：组合页面、共享动效状态与滚动定位。
- SiteHeader：导航、移动菜单与动效开关；动效通过 props / emits 传递。
- HeroSection：个人介绍、关键数据与 OrbitVisual 主视觉。
- OrbitVisual：Canvas 轨道绘制、尺寸观察与动效清理；接收 animated 属性。
- ProjectsSection：分类过滤和基于 Reka UI（Radix Vue 后继）的可访问详情弹窗。
- ProjectVisual：三种项目的概念预览；接收项目类型。
- ExperienceSection：工作经历时间线。
- SkillsSection：技术能力分类展示。
- AboutSection：工作理念和教育。
- ContactSection：邮件、电话、外部链接与复制反馈。
- packages/resume-data：维护个人信息、项目、技能与经历的单一数据来源。

## 实现步骤
1. 配置 pnpm workspace / catalogs、Tailwind 与 antfu ESLint。
2. 整理简历内容，完成视觉与页面交互，保留原 PDF 下载。
3. 运行类型检查、Lint、构建，浏览器检查桌面和移动端、项目筛选、弹窗键盘、下载与复制。

## 内容处理
简历中 2017.00 的结束月份不合法，页面使用 2015—2017 的年份范围。简历中的「至今」沿用来源表述。页面不自行推断求职状态和精确工作地点。
