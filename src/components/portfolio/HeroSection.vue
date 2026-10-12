<script setup lang="ts">
import { ArrowDown, ArrowUpRight, Download, Globe } from '@lucide/vue'
import { profile } from '@resume/content'
import { publicAssetUrl } from '../../utils/publicAsset'
import Github from './GithubIcon.vue'
import OrbitVisual from './OrbitVisual.vue'

defineProps<{ animated: boolean }>()
const tech = [
  'React',
  'Angular',
  'Vue',
  'TypeScript',
  'Next.js',
  'React Flow',
  'Node.js',
  'AI Engineering',
]
</script>

<template>
  <section id="home" class="hero-section page-width">
    <div class="hero-layout">
      <div class="hero-copy">
        <div class="hero-eyebrow mono">
          <span class="small-line" /> FRONTEND ENGINEER & CREATIVE BUILDER
        </div>
        <p class="hero-greeting">
          你好，我是 <strong>{{ profile.name }}</strong><span class="greeting-wave">↗</span>
        </p>
        <h1 class="hero-title">
          <span class="sr-only">吴伟东，前端工程师。</span>
          代码有逻辑。<br /><span>创造无边界。</span><span class="title-period">*</span>
        </h1>
        <p class="hero-description">
          以前端为起点，以创造为驱动。<br />专注 AI
          应用、工程架构与可视化，让复杂的技术成为流畅的体验。
        </p>
        <div class="hero-buttons flex flex-wrap items-center gap-3">
          <a
            id="hero-view-projects"
            href="#projects"
            class="button button-primary"
          >探索我的项目 <ArrowUpRight :size="18" /></a>
          <a
            id="hero-download-resume"
            :href="publicAssetUrl(profile.resume)"
            download="吴伟东-前端工程师.pdf"
            class="button button-outline"
          ><Download :size="16" /> 下载简历</a>
        </div>
        <div class="hero-socials flex items-center gap-5">
          <a
            id="hero-github"
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
          ><Github :size="16" /> GitHub <ArrowUpRight :size="12" /></a>
          <a
            id="hero-blog"
            :href="profile.website"
            target="_blank"
            rel="noopener noreferrer"
          ><Globe :size="16" /> 个人博客 <ArrowUpRight :size="12" /></a>
          <span class="hero-social-divider" /><span class="hero-location">开放视野 · 不限地点</span>
        </div>
      </div>
      <div class="hero-art">
        <OrbitVisual :animated="animated" />
        <div class="code-note mono">
          <span class="code-comment">// 始终保持好奇</span><br /><span
            class="code-purple"
          >const</span>
          developer = {<br />&nbsp;&nbsp;mindset:
          <span class="code-green">'never stop building'</span>,<br />&nbsp;&nbsp;possibilities:
          <span class="code-green">Infinity</span><br />}
        </div>
      </div>
    </div>
    <div class="hero-bottom">
      <div class="hero-stat">
        <strong>10<span>+</span></strong><span>年开发与实践</span>
      </div>
      <div class="hero-stat">
        <strong>30%<span>↑</span></strong><span>工程构建效率提升</span>
      </div>
      <div class="hero-stat">
        <strong>O(1)</strong><span>AI 增量渲染复杂度</span>
      </div>
      <a id="hero-scroll" href="#projects" class="scroll-hint mono">SCROLL TO EXPLORE <span><ArrowDown :size="16" /></span></a>
    </div>
  </section>
  <div class="tech-strip" aria-label="主要技术栈">
    <div class="page-width tech-strip-inner">
      <span class="tech-strip-label mono">MY TOOLKIT</span><span v-for="item in tech" :key="item" class="tech-strip-item">{{ item }}<span>✳</span></span>
    </div>
  </div>
</template>
