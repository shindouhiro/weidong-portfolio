# 吴伟东 · 个人简历与作品集

一个以深色数字工作台为视觉方向的个人网站，使用 Vue 3、TypeScript、Tailwind CSS 与 Reka UI（Radix Vue 后继）。

## 本地运行

```sh
pnpm install
pnpm dev
```

默认地址：`http://localhost:5173`。

## 检查与构建

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

生产文件输出到 `dist/`，可以部署至任何静态托管平台。CI 安装请使用 `pnpm install --frozen-lockfile`。

## 内容维护

- `packages/resume-data/index.ts`：个人信息、项目成果、技术能力和工作经历。
- `public/resume.pdf`：下载按钮提供的三页 A4 排版简历。
- `src/components/portfolio/`：按职责划分的页面组件。
- `src/style.css`：设计变量、页面样式和响应式断点。
- `pnpm-workspace.yaml`：workspace 与统一依赖版本 Catalog。

项目卡片支持分类筛选和详情弹窗；联系区支持复制邮箱、邮件和电话链接。顶部动效按钮可暂停 Canvas 轨道动画，系统「减少动态效果」设置也会被尊重。外部项目预览为概念示意，未使用真实产品截图。

项目内容已根据 2026-10-13 新版简历更新：赛力斯企业培训平台、AI-CloudOS、NebulaAI 和 ATC。详情按业务场景、个人职责、技术方案、交付成果和技术栈分组；成果数据沿用简历，概念预览不展示未经提供的性能指标。

## 简历 PDF 模板

`docs/resume/content.json` 保存打印版内容，`scripts/build_resume.py` 统一维护排版。采用浅色墨绿版式、嵌入中文字体、可搜索文字、可点击联系方式以及三页固定分页。

安装网站依赖后，在 macOS 运行：

```sh
pnpm resume:pdf
cp output/pdf/吴伟东-前端工程师.pdf public/resume.pdf
```

PDF 生成通过 `uv` 管理 Python 脚本依赖；不参与网站 CI。默认使用系统 Heiti SC 字体及网站的 Outfit 字体。其他环境可通过 `RESUME_FONT_REGULAR`、`RESUME_FONT_BOLD` 和 `RESUME_FONT_INDEX` 指定中文 TrueType 字体。字体配置以中文字符覆盖完整为前提。

发布新的排版后，更新内容包中 `profile.resume` 的查询版本标记，避免浏览器继续使用旧的下载缓存。生成文件保留在 `output/pdf/`，线上版本通过 `public/resume.pdf` 发布。

简历中的 `2017.00` 不是有效月份，经历区域采用 `2015—2017` 年份范围；「至今」沿用原简历。

## GitHub Pages

线上地址：<https://shindouhiro.github.io/weidong-portfolio/>

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会通过 GitHub Actions 安装依赖、检查代码、构建并部署。构建使用 Pages 返回的站点子路径，因此脚本、字体、图标和 PDF 下载都能正确加载。

本地模拟相同部署路径：

```sh
VITE_BASE_PATH=/weidong-portfolio/ pnpm build
VITE_BASE_PATH=/weidong-portfolio/ pnpm preview
```

浏览 `http://localhost:4173/weidong-portfolio/`。本地开发继续使用 `pnpm dev`。
