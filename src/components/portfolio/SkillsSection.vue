<script setup lang="ts">
import {
  Code2,
  Layers,
  Server,
  Sparkles,
  Terminal,
  Workflow,
} from '@lucide/vue'
import { skillGroups } from '@resume/content'
import { useCardSpotlight } from '../../composables/useCardSpotlight'
import GlitchText from '../effects/GlitchText.vue'

const { handleCardMouseMove, handleCardMouseLeave } = useCardSpotlight()

const icons = {
  code: Code2,
  layers: Layers,
  workflow: Workflow,
  server: Server,
  sparkles: Sparkles,
  terminal: Terminal,
}
</script>

<template>
  <section id="skills" class="section skills-section page-width">
    <div class="section-heading">
      <div>
        <span class="section-eyebrow mono">
          <GlitchText text="03 / MY CAPABILITIES" />
        </span>
        <h2>工具在变，<span class="heading-accent">创造力不变。</span></h2>
        <p>跨越框架与语言，选择适合问题的工具。</p>
      </div>
      <span class="section-side-note mono">ALWAYS LEARNING <Sparkles :size="19" class="text-lime-400" /></span>
    </div>
    <div class="skills-grid">
      <article
        v-for="group in skillGroups"
        :key="group.id"
        class="skill-card spotlight-card"
        @mousemove="handleCardMouseMove"
        @mouseleave="handleCardMouseLeave"
      >
        <div class="skill-card-top">
          <component
            :is="icons[group.icon as keyof typeof icons]"
            :size="23"
            :stroke-width="1.5"
            class="skill-icon-glow"
          />
          <span class="mono">{{ group.number }}</span>
        </div>
        <h3>{{ group.title }}</h3>
        <p class="skill-subtitle mono">
          {{ group.subtitle }}
        </p>
        <div class="skill-tags">
          <span
            v-for="item in group.items"
            :key="item"
            class="interactive-skill-pill"
          >
            {{ item }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.skill-icon-glow {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s, filter 0.3s;
}

.skill-card:hover .skill-icon-glow {
  color: var(--accent);
  transform: scale(1.15) rotate(3deg);
  filter: drop-shadow(0 0 8px rgba(196, 243, 108, 0.6));
}

.interactive-skill-pill {
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1),
              background-color 0.2s,
              border-color 0.2s,
              color 0.2s,
              box-shadow 0.2s;
  cursor: default;
}

.interactive-skill-pill:hover {
  transform: translateY(-2px);
  background: rgba(196, 243, 108, 0.15) !important;
  border-color: rgba(196, 243, 108, 0.6) !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(196, 243, 108, 0.3);
}
</style>
