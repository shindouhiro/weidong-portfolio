<script setup lang="ts">
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
import { usePortfolio } from './composables/usePortfolio'

const { animated, activeSection, toggleAnimation } = usePortfolio()
</script>

<template>
  <div class="portfolio" :class="{ 'motion-paused': !animated }">
    <!-- Cyberpunk Canvas Starfield Background -->
    <InteractiveBackground :animated="animated" />

    <!-- Interactive Magnetic Cursor & Sparks -->
    <CustomCursor :animated="animated" />

    <!-- Scroll Progress Laser & HUD Locator -->
    <ScrollProgress :active-section="activeSection" />

    <a id="skip-to-main" class="skip-link" href="#main-content">跳转到主要内容</a>
    <SiteHeader
      :animated="animated"
      :active-section="activeSection"
      @toggle-animation="toggleAnimation"
    />
    <main id="main-content" class="relative z-10">
      <HeroSection :animated="animated" />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
    </main>
  </div>
</template>
