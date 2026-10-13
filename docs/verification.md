# 验证记录

## 2026-10-13 新版简历内容更新

- `pnpm lint` 与 `VITE_BASE_PATH=/weidong-portfolio/ pnpm build` 通过，构建包含 Vue / TypeScript 类型检查。
- 全部 4 项、企业业务 1 项、AI 应用 2 项、可视化 1 项，筛选结果正确。
- 四个项目的结构化详情正确渲染；赛力斯包含考试一致性、认证权限、实时通知与 AG-UI 集成等内容。
- Escape 关闭赛力斯详情后，焦点返回 `project-open-seres`；弹窗默认聚焦关闭按钮。
- 320px 下详情内容宽与滚动宽均为 286px；320px、390px、890px 及默认 1280px 页面无横向溢出。
- 320px 下「幂等交卷」保持单行，详情提示换行，避免成果文字被挤断。
- 桌面与平板采用两列项目卡片，窄屏单列；技术方案与成果区可滚动阅读。
- 最终浏览器控制台没有 error / warning；链接和按钮均有 ID，详情打开后无重复 ID。
- 下载 PDF 与用户本次提供的新版 PDF SHA-256 一致；作品演示链接和 SEO 文案已同步。
- 下方记录保留为初版验证历史。

日期：2026-10-12

## 工程检查

- `pnpm lint`：通过。
- `pnpm build`：通过，包含 `vue-tsc -b` 类型检查，输出 `dist/`。
- 最终独立预览标签页：没有 console error / warning。

## 浏览器交互

- 项目筛选：AI 应用显示 2 个项目，可视化显示 1 个，全部显示 3 个。
- ATC / NebulaAI 详情：正确显示对应职责、技术栈与成果。
- Escape 关闭弹窗：弹窗消失，焦点返回 `project-open-atc`。
- 动效开关：暂停与恢复状态正确切换。
- 邮箱复制：显示「邮箱已复制，期待你的来信。」。
- 简历下载：成功下载原始 PDF。
- 移动导航：展开菜单后可跳转技术栈，随后自动收起。
- 交互元素：所有链接和按钮均有 ID，未发现重复 ID。

## 响应式

- 1440px：三列项目卡片，每列 380px，没有页面横向溢出。
- 890px：桌面导航与页面正常，没有页面横向溢出。
- 390px：单列项目、双列技能、移动菜单正常；弹窗宽 358px，没有页面横向溢出。
- 320px：修复联系区装饰箭头导致的溢出，最终 scrollWidth 等于视口宽度 320px。

最终首屏截图：`docs/previews/portfolio-desktop.jpg`。

## GitHub Pages 子路径验证

- `pnpm lint` 与 `VITE_BASE_PATH=/weidong-portfolio/ pnpm build`：通过。
- 在 `/weidong-portfolio/` 本地生产预览中，页面完整渲染。
- JS、CSS、favicon、图标文件和 PDF：均返回 200。
- PDF 内容头为 `%PDF-`，下载目标保留部署子路径。
