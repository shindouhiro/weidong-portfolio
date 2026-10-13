<script setup lang="ts">
import type { BackgroundMode } from '../../composables/motionContext'
import {
  Activity,
  ArrowUpRight,
  Binary,
  Menu,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from '@lucide/vue'
import { shallowRef } from 'vue'
import { useSoundFx } from '../../composables/useSoundFx'

const props = withDefaults(
  defineProps<{
    animated: boolean
    activeSection: string
    backgroundMode?: BackgroundMode
  }>(),
  {
    backgroundMode: 'stars',
  },
)

const emit = defineEmits<{
  toggleAnimation: []
  changeBackgroundMode: [mode: BackgroundMode]
}>()

const menuOpen = shallowRef(false)
const { soundEnabled, toggleSound, playModeSwitch } = useSoundFx()

const links = [
  { id: 'projects', label: '精选项目' },
  { id: 'experience', label: '工作经历' },
  { id: 'skills', label: '技术栈' },
  { id: 'about', label: '关于我' },
]

const bgModes: { id: BackgroundMode, label: string, icon: typeof Sparkles }[] = [
  { id: 'stars', label: '星轨', icon: Sparkles },
  { id: 'matrix', label: '矩阵', icon: Binary },
  { id: 'mesh', label: '能量', icon: Activity },
]

function selectMode(mode: BackgroundMode) {
  if (props.backgroundMode !== mode) {
    emit('changeBackgroundMode', mode)
    playModeSwitch()
  }
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner page-width flex items-center justify-between">
      <a
        id="brand-home"
        href="#home"
        class="brand flex items-center gap-3 group"
        aria-label="吴伟东，返回首页"
      >
        <span class="brand-mark group-hover:scale-105 transition-transform duration-300">
          w<span>.</span>
        </span>
        <span class="brand-name">吴伟东<span>DEVELOPER & CREATOR</span></span>
      </a>

      <nav class="desktop-nav flex items-center gap-8" aria-label="主导航">
        <a
          v-for="link in links"
          :id="`nav-${link.id}`"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav-link"
          :class="{ active: activeSection === link.id }"
        >
          <span class="nav-dot" />
          {{ link.label }}
        </a>
      </nav>

      <div class="header-actions flex items-center gap-2 sm:gap-3">
        <!-- HUD 背景视效模式切换胶囊 -->
        <div
          class="hud-mode-capsule"
          role="radiogroup"
          aria-label="背景视效模式"
        >
          <button
            v-for="m in bgModes"
            :id="`bg-mode-${m.id}`"
            :key="m.id"
            role="radio"
            :aria-checked="backgroundMode === m.id"
            :aria-label="`切换背景为${m.label}模式`"
            class="hud-mode-btn"
            :class="{ 'is-active': backgroundMode === m.id }"
            @click="selectMode(m.id)"
          >
            <component :is="m.icon" :size="12" class="hud-mode-icon" />
            <span class="hud-mode-text">{{ m.label }}</span>
          </button>
        </div>

        <!-- Sound FX Toggle Button with Equalizer -->
        <button
          id="toggle-sound"
          class="icon-button sound-button"
          :class="{ 'is-active-sound': soundEnabled }"
          :aria-label="soundEnabled ? '关闭赛博音效' : '开启赛博音效'"
          :aria-pressed="soundEnabled"
          :title="soundEnabled ? '关闭音效' : '开启赛博音效'"
          @click="toggleSound"
        >
          <Volume2 v-if="soundEnabled" :size="15" />
          <VolumeX v-else :size="15" />
          <span v-if="soundEnabled" class="sound-mini-eq" aria-hidden="true">
            <span class="eq-line line-1" />
            <span class="eq-line line-2" />
            <span class="eq-line line-3" />
          </span>
        </button>

        <!-- Animation Toggle Button -->
        <button
          id="toggle-animation"
          class="icon-button"
          :aria-label="animated ? '暂停视觉动效' : '开启视觉动效'"
          :aria-pressed="animated"
          :title="animated ? '暂停动效' : '开启视觉动效'"
          @click="$emit('toggleAnimation')"
        >
          <Pause v-if="animated" :size="15" />
          <Play v-else :size="15" />
        </button>

        <a id="header-contact" class="contact-link" href="#contact">
          聊聊合作 <ArrowUpRight :size="16" />
        </a>

        <button
          id="toggle-mobile-menu"
          class="icon-button mobile-menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" />
          <Menu v-else :size="22" />
        </button>
      </div>
    </div>

    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      class="mobile-navigation"
      aria-label="移动端导航"
    >
      <a
        v-for="link in links"
        :id="`mobile-nav-${link.id}`"
        :key="link.id"
        :href="`#${link.id}`"
        @click="menuOpen = false"
      >{{ link.label }} <ArrowUpRight :size="18" /></a>
      <a id="mobile-nav-contact" href="#contact" @click="menuOpen = false">聊聊合作 <ArrowUpRight :size="18" /></a>
      <div class="mobile-mode-row flex items-center justify-between pt-3 border-t border-[#c4f36c]/15">
        <span class="text-xs text-[#8c9e78] font-mono">背景视效模式</span>
        <div class="hud-mode-capsule">
          <button
            v-for="m in bgModes"
            :id="`mobile-bg-mode-${m.id}`"
            :key="m.id"
            role="radio"
            :aria-checked="backgroundMode === m.id"
            class="hud-mode-btn"
            :class="{ 'is-active': backgroundMode === m.id }"
            @click="selectMode(m.id)"
          >
            <component :is="m.icon" :size="12" />
            <span>{{ m.label }}</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.nav-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s, transform 0.2s;
}

.nav-link.active .nav-dot {
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 0 6px var(--accent);
}

/* HUD 模式切换胶囊 */
.hud-mode-capsule {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  background: rgba(18, 22, 16, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(196, 243, 108, 0.2);
  border-radius: 9999px;
  gap: 2px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
}

.hud-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: "Outfit", sans-serif;
  color: #8c9e78;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.hud-mode-btn:hover {
  color: #d1fa8b;
  border-color: rgba(196, 243, 108, 0.3);
  background: rgba(196, 243, 108, 0.06);
}

.hud-mode-btn.is-active {
  color: #141f0a;
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
  box-shadow: 0 0 12px rgba(196, 243, 108, 0.45);
}

.hud-mode-btn.is-active .hud-mode-icon {
  color: #141f0a;
}

.hud-mode-icon {
  flex-shrink: 0;
}

/* 音效跳动均衡器 */
.sound-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.is-active-sound {
  color: var(--accent) !important;
  border-color: rgba(196, 243, 108, 0.45) !important;
  box-shadow: 0 0 10px rgba(196, 243, 108, 0.3);
}

.sound-mini-eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 9px;
  margin-left: 2px;
}

.eq-line {
  width: 1.5px;
  background: var(--accent);
  border-radius: 1px;
}

.line-1 {
  height: 50%;
  animation: eq-bounce 0.65s infinite alternate ease-in-out;
}

.line-2 {
  height: 100%;
  animation: eq-bounce 0.45s infinite alternate-reverse ease-in-out;
}

.line-3 {
  height: 35%;
  animation: eq-bounce 0.8s infinite alternate ease-in-out;
}

@keyframes eq-bounce {
  0% {
    height: 25%;
  }
  100% {
    height: 100%;
  }
}

@media (max-width: 768px) {
  .hud-mode-text {
    display: none;
  }
  .hud-mode-btn {
    padding: 5px 6px;
  }
}

@media (max-width: 480px) {
  .hud-mode-capsule {
    display: none;
  }
}
</style>
