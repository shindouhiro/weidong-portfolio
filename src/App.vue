<script setup lang="ts">
import { provide, useTemplateRef } from 'vue'
import CustomCursor from './components/effects/CustomCursor.vue'
import InteractiveBackground from './components/effects/InteractiveBackground.vue'
import ScrollProgress from './components/effects/ScrollProgress.vue'
import AboutSection from './components/portfolio/AboutSection.vue'
import ContactSection from './components/portfolio/ContactSection.vue'
import ExperienceSection from './components/portfolio/ExperienceSection.vue'
import HeroSection from './components/portfolio/HeroSection.vue'
import ProjectsSection from './components/portfolio/ProjectsSection.vue'
import SiteHeader from './components/portfolio/SiteHeader.vue'
import SkillsSection from './components/portfolio/SkillsSection.vue'
import { portfolioMotionKey } from './composables/motionContext'
import { usePortfolio } from './composables/usePortfolio'
import { useScrollReveal } from './composables/useScrollReveal'

const { animated, activeSection, toggleAnimation } = usePortfolio()
provide(portfolioMotionKey, animated)
const main = useTemplateRef<HTMLElement>('main')
useScrollReveal(main, animated)
</script>

<template>
  <div class="portfolio" :class="{ 'motion-paused': !animated }">
    <!-- 交互星空背景 -->
    <InteractiveBackground :animated="animated" />

    <!-- 跟随光标与点击火花 -->
    <CustomCursor :animated="animated" />

    <!-- 阅读进度与章节定位 -->
    <ScrollProgress :active-section="activeSection" />

    <a id="skip-to-main" class="skip-link" href="#main-content">跳转到主要内容</a>
    <SiteHeader
      :animated="animated"
      :active-section="activeSection"
      @toggle-animation="toggleAnimation"
    />
    <main id="main-content" ref="main" class="relative z-10">
      <HeroSection :animated="animated" />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection :animated="animated" />
    </main>
  </div>
</template>
