# 验证记录

## 2026-10-13 视觉特效增强

- `pnpm lint`、`pnpm typecheck`、`pnpm build` 全部通过；最终新建预览标签页无 console error / warning。
- 首屏新增双轨道、尾迹光粒子与核心光晕，滚动控制环面旋转与收缩；代码检查确认离屏、后台、暂停和系统减动均停止首屏帧循环。
- 章节按组显现；卡片进入视口后边缘动画运行，离开视口后暂停；键盘聚焦可触发扫描线，聚焦内容保持可见。
- AI 分类显示 AI-CloudOS、NebulaAI；全部分类恢复四个项目；NebulaAI 弹窗 Escape 关闭后焦点返回原按钮。
- 关闭动效后所有待入场元素显示、四张卡片边缘动画均为 paused、自定义光标隐藏；ATC 弹窗保持不透明且入场动画为 none。
- 联系区进入视口后极光动画运行；邮箱复制显示成功提示与绿色勾选反馈；首屏离开视口后处于停止状态。
- 1280px、390px、320px 页面均无横向溢出，320px 圆环区域宽度为 280px；移动导航跳转后正常关闭。
- 页面按钮与链接无缺失 ID，未发现重复 ID。窄屏预览结束后恢复默认视口。
- 系统减动分支经过代码检查，未更改用户的系统偏好。
- 预览截图：`docs/previews/visual-effects-desktop.jpg`、`docs/previews/visual-effects-contact.jpg`、`docs/previews/visual-effects-mobile.jpg`。

## 2026-10-13 下载简历 PDF 美化

- PDF 为三页 A4，无空白页；逐页渲染检查，无文字裁切、重叠或标题与正文跨页。
- 中文 Heiti SC 与展示用 Outfit 字体已嵌入；PDF 保留可搜索、可复制文字。
- 打印版内容 JSON 的全部文字或链接均可在 PDF 文字及链接注释中找到；四个项目、四段经历和教育信息完整。
- 邮箱、电话、GitHub 与作品演示共四个可点击链接。
- 字形边界校验通过；三页均无页面外文字。统一页码为 01 / 03、02 / 03、03 / 03。
- 排版脚本在绘制前检查页面内容高度，超出可用空间时终止生成。
- `pnpm lint` 与 GitHub Pages 子路径构建通过；下载链接追加版本标记，避免旧 PDF 缓存。

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
