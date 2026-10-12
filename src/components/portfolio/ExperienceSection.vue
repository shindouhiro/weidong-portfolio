<script setup lang="ts">
import { ArrowUpRight, BriefcaseBusiness } from '@lucide/vue'
import { experiences } from '@resume/content'
import { useCardSpotlight } from '../../composables/useCardSpotlight'
import GlitchText from '../effects/GlitchText.vue'

const { handleCardMouseMove, handleCardMouseLeave } = useCardSpotlight()
</script>

<template>
  <section id="experience" class="section experience-section page-width">
    <div class="experience-intro">
      <span class="section-eyebrow mono">
        <GlitchText text="02 / THE JOURNEY" />
      </span>
      <h2>持续进化。<br /><span class="muted-heading">始终向前。</span></h2>
      <p>
        从全栈开发到前端架构，<br />在真实的问题里打磨技术，<br />在持续的创造中拓宽边界。
      </p>
      <span class="journey-mark holographic-text" aria-hidden="true">↗</span>
    </div>
    <div class="timeline neon-timeline">
      <div class="timeline-power-beam" />
      <article
        v-for="job in experiences"
        :key="job.id"
        class="timeline-item spotlight-card"
        :class="{ 'is-current': job.current }"
        @mousemove="handleCardMouseMove"
        @mouseleave="handleCardMouseLeave"
      >
        <span class="timeline-dot">
          <span v-if="job.current" class="timeline-dot-pulse" />
        </span>
        <div class="timeline-period mono">
          {{ job.period }}
          <span v-if="job.current" class="current-badge cyber-current-badge">当前 · ACTIVE</span>
        </div>
        <div class="timeline-title">
          <h3>{{ job.company }}</h3>
          <BriefcaseBusiness :size="17" class="timeline-icon" />
        </div>
        <p class="timeline-role">
          {{ job.role }}
        </p>
        <p class="timeline-summary">
          {{ job.summary }}
        </p>
        <ul class="timeline-achievements">
          <li v-for="achievement in job.achievements" :key="achievement">
            <ArrowUpRight :size="12" class="achievement-arrow" />{{ achievement }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.neon-timeline {
  position: relative;
}

.timeline-power-beam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1px;
  width: 2px;
  background: linear-gradient(180deg, var(--accent) 0%, rgba(196, 243, 108, 0.4) 60%, transparent 100%);
  box-shadow: 0 0 10px rgba(196, 243, 108, 0.5);
  pointer-events: none;
}

.timeline-dot-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  animation: ping-dot 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.cyber-current-badge {
  background: rgba(196, 243, 108, 0.15) !important;
  color: var(--accent) !important;
  border-color: rgba(196, 243, 108, 0.4) !important;
  box-shadow: 0 0 8px rgba(196, 243, 108, 0.2);
}

.holographic-text {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s;
  cursor: default;
}

.holographic-text:hover {
  color: var(--accent);
  transform: translate(10px, -10px) scale(1.05);
  text-shadow: 0 0 30px rgba(196, 243, 108, 0.5);
}

.achievement-arrow {
  transition: transform 0.2s;
  flex-shrink: 0;
}

.timeline-item:hover .achievement-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

@keyframes ping-dot {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
</style>
