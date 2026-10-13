# Audiovisual & Particle FX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为吴伟东作品集网站实现「音频律动与环境视效增强」：支持 3 种高质量 Canvas 背景模式（星轨/矩阵代码雨/能量网格）、Web Audio 声光共振脉冲、Header HUD 模式切换胶囊与量子光幕扫描过渡。

**Architecture:** 采用单 Canvas 多策略渲染模式（Strategy Pattern）与单一 RAF 循环；通过 `useSoundFx` 暴露响应式 `audioImpulse` 总线将合成音效的振幅传递给 Canvas 触发同心扩散与光晕脉冲；Header 增加 HUD 胶囊与微型跳动频谱。

**Tech Stack:** Vue 3, TypeScript, Web Audio API, Canvas 2D, Tailwind CSS, Vite.

## Global Constraints
- 包管理器使用 `pnpm`；
- 所有交互元素必须具备唯一描述性 `id`；
- 遵循 Vue 3 Composition API `<script setup lang="ts">`；
- 适配 `prefers-reduced-motion` 与动画暂停开关；
- 不破坏现有页面布局与排版。

---

### Task 1: 声光共振与背景模式状态管理 (State & Composable Contract)

**Files:**
- Modify: `src/composables/motionContext.ts`
- Modify: `src/composables/usePortfolio.ts`
- Modify: `src/composables/useSoundFx.ts`
- Modify: `src/App.vue`

**Interfaces:**
- Produces:
  - `BackgroundMode = 'stars' | 'matrix' | 'mesh'`
  - `backgroundModeKey: InjectionKey<Ref<BackgroundMode>>`
  - `usePortfolio().backgroundMode: Ref<BackgroundMode>`
  - `usePortfolio().setBackgroundMode(mode: BackgroundMode): void`
  - `useSoundFx().audioImpulse: ShallowRef<{ strength: number, timestamp: number } | null>`
  - `useSoundFx().playModeSwitch(): void`

- [ ] **Step 1: 更新 `motionContext.ts` 导出模式类型与注入键**

```ts
import type { InjectionKey, Ref, ShallowRef } from 'vue'

export type BackgroundMode = 'stars' | 'matrix' | 'mesh'
export const portfolioMotionKey: InjectionKey<ShallowRef<boolean>> = Symbol('portfolio-motion')
export const backgroundModeKey: InjectionKey<Ref<BackgroundMode>> = Symbol('background-mode')
```

- [ ] **Step 2: 更新 `usePortfolio.ts` 增加 `backgroundMode` 与持久化逻辑**

```ts
import type { BackgroundMode } from './motionContext'
// 在 usePortfolio 内部增加 backgroundMode 状态，读取并写入 localStorage('portfolio_bg_mode')
const backgroundMode = ref<BackgroundMode>(
  (localStorage.getItem('portfolio_bg_mode') as BackgroundMode) || 'stars'
)

function setBackgroundMode(mode: BackgroundMode) {
  backgroundMode.value = mode
  localStorage.setItem('portfolio_bg_mode', mode)
}
```

- [ ] **Step 3: 更新 `useSoundFx.ts` 增加 `audioImpulse` 总线与 `playModeSwitch` 赛博音效**

在 `useSoundFx.ts` 中维护模块级单例 `audioImpulse = shallowRef<{ strength: number, timestamp: number } | null>(null)`：
- 播放 `playHover()` 时触发 `triggerImpulse(0.25)`；
- 播放 `playClick()` 时触发 `triggerImpulse(0.55)`；
- 播放 `playShockwave()` 时触发 `triggerImpulse(1.0)`；
- 新增 `playModeSwitch()`：使用高通滤波由 320Hz 扫频至 880Hz（科技充能质感），并触发 `triggerImpulse(0.7)`。

- [ ] **Step 4: 在 `App.vue` 中注入 `backgroundMode` 并传递给组件**

```vue
const { animated, activeSection, toggleAnimation, backgroundMode, setBackgroundMode } = usePortfolio()
provide(backgroundModeKey, backgroundMode)
```
并在 `<InteractiveBackground>` 上传递 `:mode="backgroundMode"`。

- [ ] **Step 5: 验证类型与测试构建**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/composables/motionContext.ts src/composables/usePortfolio.ts src/composables/useSoundFx.ts src/App.vue
git commit -m "feat: 新增背景模式状态与声光共振总线"
```

---

### Task 2: 统一多策略 Canvas 渲染引擎 (`InteractiveBackground.vue`)

**Files:**
- Modify: `src/components/effects/InteractiveBackground.vue`

**Interfaces:**
- Consumes:
  - `mode: BackgroundMode`
  - `animated: boolean`
  - `useSoundFx().audioImpulse`
- Produces:
  - 全屏多模式渲染，包含 Cosmic Stars、Matrix Rain、Energy Mesh；
  - 模式切换触发 350ms 全屏量子扫描线过渡；
  - 音频脉冲触发几何与粒子共振反馈。

- [ ] **Step 1: 编写 MatrixRain 策略算法**
  - 包含列初始化、片假名/十六进制字符随机下落；
  - 鼠标移动扰动力场（计算距离推移字符坐标）；
  - 捕获 `audioImpulse` 增强字符亮度和闪烁度。

- [ ] **Step 2: 编写 EnergyMesh 策略算法**
  - 包含 3D 透视线条网格（Perspective Grid），基于双重正弦波 `Math.sin(u) * Math.cos(v)` 计算高度；
  - 鼠标位置生成局部网格隆起；
  - 捕获 `audioImpulse` 生成同心辐射能量波。

- [ ] **Step 3: 优化现有 CosmicStars 策略与量子扫描过场**
  - 将现有粒子与发光球体整理为 Stars 策略，加入 `audioImpulse` 冲击波反馈；
  - 增加 `transitionState`: 当 `props.mode` 变化时，触发 350ms 激光扫描光幕，平滑过度画面。

- [ ] **Step 4: 挂载与销毁监听器**
  - 保持窗口尺寸自适应（DPR 优化）；
  - 监听 `audioImpulse` 变化并更新当前激活策略中的瞬时能量。

- [ ] **Step 5: 验证代码质量与类型**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/effects/InteractiveBackground.vue
git commit -m "feat: 实现多策略 Canvas 背景与声光共振渲染引擎"
```

---

### Task 3: Header HUD 模式切换胶囊与音频微型频谱 (`SiteHeader.vue`)

**Files:**
- Modify: `src/components/portfolio/SiteHeader.vue`

**Interfaces:**
- Consumes:
  - `usePortfolio().backgroundMode`
  - `usePortfolio().setBackgroundMode`
  - `useSoundFx().soundEnabled`
  - `useSoundFx().playModeSwitch`
- Produces:
  - 顶部 HUD 胶囊切换按钮 `[✦ 星轨] [⚡ 矩阵] [〰 能量]`；
  - 音频按钮内部 3-bar 微型跳动 Equalizer；
  - 语义化 a11y 标签与全键盘可达性。

- [ ] **Step 1: 在 Header 中添加 HUD 胶囊模板**

在 `SiteHeader.vue` 的音效按钮旁新增模式切换器：
```vue
<div class="hud-mode-capsule" role="radiogroup" aria-label="背景视效模式">
  <button
    v-for="m in modes"
    :id="`bg-mode-${m.id}`"
    :key="m.id"
    role="radio"
    :aria-checked="backgroundMode === m.id"
    class="hud-mode-button"
    :class="{ 'is-active': backgroundMode === m.id }"
    @click="changeMode(m.id)"
  >
    <component :is="m.icon" :size="12" />
    <span class="hud-mode-label">{{ m.label }}</span>
  </button>
</div>
```

- [ ] **Step 2: 在音频切换按钮增加 Mini Equalizer**

当 `soundEnabled` 为 true 时，在声音图标后方展示 3 条跳动音柱：
```vue
<span v-if="soundEnabled" class="header-mini-equalizer">
  <span class="eq-bar bar-1" />
  <span class="eq-bar bar-2" />
  <span class="eq-bar bar-3" />
</span>
```

- [ ] **Step 3: 添加专属 CSS 样式与响应式断点**
  - 胶囊采用赛博边框、毛玻璃背景（`rgba(17, 21, 14, 0.7)`）与 Lime 高亮；
  - 移动端（屏幕宽度小于 768px）隐藏文本标签仅保留图标，保持导航栏整洁不折行。

- [ ] **Step 4: 验证构建与类型**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/SiteHeader.vue
git commit -m "feat: 在 Header 增加 HUD 模式切换胶囊与跳动频谱"
```

---

### Task 4: 全局样式微调与全链路端到端验证

**Files:**
- Modify: `src/style.css` (如有必要)
- Docs: `docs/verification.md`

- [ ] **Step 1: 运行 Lint 与 Typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: 0 errors

- [ ] **Step 2: 运行生产打包构建**

Run: `pnpm build`
Expected: Vite build succeeds with 0 errors

- [ ] **Step 3: 启动 Dev 服务并实机验证**

Run: `pnpm dev`
- 验证星轨、矩阵雨、能量网格切换流畅；
- 验证全屏量子激光过场与模式切换音效；
- 验证点击与激波触发时背景产生同心声光共振；
- 验证刷新网页后所选模式持久化生效。

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: 完成音频律动与环境视效增强全链路交付"
```
