<script setup lang="ts">
import { ArrowUpRight, Menu, Pause, Play, Volume2, VolumeX, X } from '@lucide/vue'
import { shallowRef } from 'vue'
import { useSoundFx } from '../../composables/useSoundFx'

defineProps<{ animated: boolean, activeSection: string }>()
defineEmits<{ toggleAnimation: [] }>()

const menuOpen = shallowRef(false)
const { soundEnabled, toggleSound } = useSoundFx()

const links = [
  { id: 'projects', label: '精选项目' },
  { id: 'experience', label: '工作经历' },
  { id: 'skills', label: '技术栈' },
  { id: 'about', label: '关于我' },
]
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
      <div class="header-actions flex items-center gap-3">
        <!-- Sound FX Toggle Button -->
        <button
          id="toggle-sound"
          class="icon-button"
          :class="{ 'is-active-sound': soundEnabled }"
          :aria-label="soundEnabled ? '关闭赛博音效' : '开启赛博音效'"
          :aria-pressed="soundEnabled"
          :title="soundEnabled ? '关闭音效' : '开启赛博音效'"
          @click="toggleSound"
        >
          <Volume2 v-if="soundEnabled" :size="16" />
          <VolumeX v-else :size="16" />
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
          <Pause v-if="animated" :size="16" />
          <Play v-else :size="16" />
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

.is-active-sound {
  color: var(--accent) !important;
  border-color: rgba(196, 243, 108, 0.4) !important;
  box-shadow: 0 0 10px rgba(196, 243, 108, 0.25);
}
</style>
