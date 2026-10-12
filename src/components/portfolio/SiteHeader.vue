<script setup lang="ts">
import { ArrowUpRight, Menu, Pause, Play, X } from '@lucide/vue'
import { shallowRef } from 'vue'

defineProps<{ animated: boolean, activeSection: string }>()
defineEmits<{ toggleAnimation: [] }>()
const menuOpen = shallowRef(false)
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
        class="brand flex items-center gap-3"
        aria-label="吴伟东，返回首页"
      >
        <span class="brand-mark">w<span>.</span></span>
        <span class="brand-name">吴伟东<span>DEVELOPER & CREATOR</span></span>
      </a>
      <nav class="desktop-nav flex items-center gap-8" aria-label="主导航">
        <a
          v-for="link in links"
          :id="`nav-${link.id}`"
          :key="link.id"
          :href="`#${link.id}`"
          :class="{ active: activeSection === link.id }"
        >{{ link.label }}</a>
      </nav>
      <div class="header-actions flex items-center gap-4">
        <button
          id="toggle-animation"
          class="icon-button"
          :aria-label="animated ? '暂停视觉动效' : '开启视觉动效'"
          :aria-pressed="animated"
          @click="$emit('toggleAnimation')"
        >
          <Pause v-if="animated" :size="16" /><Play v-else :size="16" />
        </button>
        <a id="header-contact" class="contact-link" href="#contact">聊聊合作 <ArrowUpRight :size="16" /></a>
        <button
          id="toggle-mobile-menu"
          class="icon-button mobile-menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" /><Menu v-else :size="22" />
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
