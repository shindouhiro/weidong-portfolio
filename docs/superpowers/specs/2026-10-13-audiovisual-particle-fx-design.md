# Audiovisual & Particle FX Design Spec

## 1. Overview & Objective
为吴伟东个人作品集网站实现 **「音频律动与环境视效增强 (Audiovisual & Particle FX)」**，在不引入重型三方依赖、保持 60fps 满帧性能与可访问性的前提下，实现高品质赛博级声光互动：
1. **多重背景视觉模式切换**：支持 3 种高质量 Canvas 渲染模式（Cosmic Stars 星空粒子、Matrix Rain 黑客矩阵雨、Energy Mesh 能量网格）；
2. **声光共振总线 (Audio-Visual Resonance)**：让 Web Audio 合成音效与背景图形产生物理级振幅与扩散波纹共振；
3. **顶部导航 HUD 胶囊控制与量子过场**：在 SiteHeader 中提供极客风格的 HUD 模式切换组件，切换时触发全屏量子扫描过渡光幕与专属系统音效；
4. **音频频谱实时跳动**：在音频切换按钮中集成微型均衡器（Equalizer），直观表达音频开启与共振状态。

---

## 2. Architecture & Data Flow

### 2.1 状态与 Composable 契约

```ts
export type BackgroundMode = 'stars' | 'matrix' | 'mesh'

export interface AudioImpulse {
  strength: number // 0.0 ~ 1.0 冲量强度
  frequency: number // 音频基频 (Hz)
  timestamp: number
}
```

- **`usePortfolio.ts`**:
  - 新增 `backgroundMode: Ref<BackgroundMode>`，初始读取 `localStorage.getItem('portfolio_bg_mode') || 'stars'`；
  - 导出 `setBackgroundMode(mode: BackgroundMode)`，持久化至 `localStorage`；
  - 在 `App.vue` 中通过 `provide(backgroundModeKey, backgroundMode)` 供全局订阅。
- **`useSoundFx.ts`**:
  - 新增 `audioImpulse: ShallowRef<AudioImpulse | null>`；
  - 在已有的 `playHover()`, `playClick()`, `playShockwave()` 中派发 `triggerImpulse(strength, freq)`；
  - 新增 `playModeSwitch()`：合成带有高通滤波扫描音色的赛博模式切换提示音；
  - 导出 `audioImpulse` 供背景 Canvas 订阅。

---

## 3. Component Details & Visual Specifications

### 3.1 `InteractiveBackground.vue`（统一 Canvas 渲染引擎）

- **单 Canvas 策略渲染 (Strategy Pattern)**：
  - 统一由单个 `requestAnimationFrame` 循环调度，依据当前 `backgroundMode` 运行对应策略：
  - **Strategy A: `CosmicStars`**
    - 漂浮粒子场与连线，环境扩散光斑（Lime, Emerald, Cyan）；
    - 响应 `audioImpulse`：粒子根据冲击波强度获得瞬时径向外推速度，光斑透明度产生瞬态微脉冲。
  - **Strategy B: `MatrixRain`**
    - 字体采用等宽科技字体（Outfit / monospace），字符包含十六进制数码 `0-9`, `A-F` 与科技片假名符号；
    - 首字符采用白光高亮并带有绿色辉光，尾流平滑衰减；
    - 鼠标排斥机制：鼠标半径 140px 内的字符向两侧推移力场，悬浮处产生明亮扰动；
    - 响应 `audioImpulse`：产生全屏字符闪烁和短暂加速坠落。
  - **Strategy C: `EnergyMesh`**
    - 3D 透视线条网格（Perspective Wireframe Wave）；
    - 基于复合同心正弦波与鼠标交互坐标产生拓扑起伏；
    - 响应 `audioImpulse`：从屏幕中心或鼠标位置向外辐射一道同心高亮能量波，使网格顶点剧烈波动后弹性平滑衰减。
- **量子扫描线过渡 (Quantum Transition)**：
  - 记录 `transitionProgress`（0 -> 1，耗时约 350ms）；
  - 绘制一条发光的量子激光扫描线横贯全屏；
  - 旧模式与新模式以扫描线为界进行切分或淡入淡出，平滑无闪烁。

### 3.2 `SiteHeader.vue`（顶部 HUD 模式切换胶囊）

- 在现有的 `toggle-sound` 和 `toggle-animation` 之间新增 HUD 模式切换组件：
  - `<div class="bg-mode-capsule" role="radiogroup" aria-label="背景视效模式">`
  - 包含 3 个紧凑型极客按钮：
    - `stars`: `[✦ 星轨]`
    - `matrix`: `[⚡ 矩阵]`
    - `mesh`: `[〰 能量]`
  - 当前激活项呈现 Lime 高亮背景、辉光边框与动态呼吸指示点；
  - 键盘操作支持方向键切换，具备语义化 `aria-checked` 与 `id`；
  - 点击时触发 `playModeSwitch()` 音效与全屏量子扫描。
- **音频开关频谱跳动 (Equalizer Bars)**：
  - 在 `toggle-sound` 按钮处于开启状态时，图标旁显示 3 条微型跳动频谱条（Mini Equalizer），随声效或定时微微跃动，强化赛博音频感知。

---

## 4. Performance, Accessibility & Resilience

1. **Performance (60fps)**:
   - 单一 Canvas 实例，复用离屏几何与数据结构，零 GC 垃圾回收压力；
   - 随窗口尺寸自适应粒子密度与列数，限制移动端最大计算量；
   - 页面不可见（`document.hidden`）或用户暂停动画时自动停掉 RAF。
2. **Accessibility (a11y)**:
   - 适配 `prefers-reduced-motion`：若用户开启降低动效，停用剧烈抖动与闪烁，降级为静态雅致渐变背景；
   - 保持所有可交互按钮具备独立 `id`、`aria-label` 与焦点键盘可达性。
3. **Responsive**:
   - 移动端窄屏下，HUD 胶囊自适应收缩为精炼单图标轮换按钮，防止导航栏挤压换行。

---

## 5. Verification Plan

1. **静态代码分析与构建**：
   - 运行 `pnpm lint` 检查 ESLint 规范；
   - 运行 `pnpm typecheck` 检查 TypeScript 类型；
   - 运行 `pnpm build` 确认生产打包成功。
2. **浏览器实机交互验证**：
   - 验证三种模式在桌面端与移动端正常切换，量子过场平滑无卡顿；
   - 验证点击、悬浮、模式切换音效触发时背景 Canvas 呈现共振脉冲；
   - 验证关闭动效/关闭音效后所有动效与音频正常静音或暂停；
   - 验证刷新页面后 `localStorage` 保存的背景模式正常恢复。
