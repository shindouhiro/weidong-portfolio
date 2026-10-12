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
        <span class="section-eyebrow mono">03 / MY CAPABILITIES</span>
        <h2>工具在变，<span class="heading-accent">创造力不变。</span></h2>
        <p>跨越框架与语言，选择适合问题的工具。</p>
      </div>
      <span class="section-side-note mono">ALWAYS LEARNING <Sparkles :size="19" /></span>
    </div>
    <div class="skills-grid">
      <article v-for="group in skillGroups" :key="group.id" class="skill-card">
        <div class="skill-card-top">
          <component
            :is="icons[group.icon as keyof typeof icons]"
            :size="23"
            :stroke-width="1.5"
          /><span class="mono">{{ group.number }}</span>
        </div>
        <h3>{{ group.title }}</h3>
        <p class="skill-subtitle mono">
          {{ group.subtitle }}
        </p>
        <div class="skill-tags">
          <span v-for="item in group.items" :key="item">{{ item }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
