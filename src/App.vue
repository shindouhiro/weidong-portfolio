<script setup lang="ts">
import AboutSection from './components/portfolio/AboutSection.vue'
import ContactSection from './components/portfolio/ContactSection.vue'
import ExperienceSection from './components/portfolio/ExperienceSection.vue'
import HeroSection from './components/portfolio/HeroSection.vue'
import ProjectsSection from './components/portfolio/ProjectsSection.vue'
import SiteHeader from './components/portfolio/SiteHeader.vue'
import SkillsSection from './components/portfolio/SkillsSection.vue'
import { usePortfolio } from './composables/usePortfolio'

const { animated, activeSection, toggleAnimation } = usePortfolio()
</script>

<template>
  <div class="portfolio" :class="{ 'motion-paused': !animated }">
    <a id="skip-to-main" class="skip-link" href="#main-content">跳转到主要内容</a>
    <SiteHeader
      :animated="animated"
      :active-section="activeSection"
      @toggle-animation="toggleAnimation"
    />
    <main id="main-content">
      <HeroSection :animated="animated" />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
    </main>
  </div>
</template>
