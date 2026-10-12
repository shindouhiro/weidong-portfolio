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
- `public/resume.pdf`：下载按钮提供的原始简历。
- `src/components/portfolio/`：按职责划分的页面组件。
- `src/style.css`：设计变量、页面样式和响应式断点。
- `pnpm-workspace.yaml`：workspace 与统一依赖版本 Catalog。

项目卡片支持分类筛选和详情弹窗；联系区支持复制邮箱、邮件和电话链接。顶部动效按钮可暂停 Canvas 轨道动画，系统「减少动态效果」设置也会被尊重。外部项目预览为概念示意，未使用真实产品截图。

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
