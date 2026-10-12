<script setup lang="ts">
import { ArrowUpRight, BriefcaseBusiness } from '@lucide/vue'
import { experiences } from '@resume/content'
</script>

<template>
  <section id="experience" class="section experience-section page-width">
    <div class="experience-intro">
      <span class="section-eyebrow mono">02 / THE JOURNEY</span>
      <h2>持续进化。<br /><span class="muted-heading">始终向前。</span></h2>
      <p>
        从全栈开发到前端架构，<br />在真实的问题里打磨技术，<br />在持续的创造中拓宽边界。
      </p>
      <span class="journey-mark" aria-hidden="true">↗</span>
    </div>
    <div class="timeline">
      <article
        v-for="job in experiences"
        :key="job.id"
        class="timeline-item"
        :class="{ 'is-current': job.current }"
      >
        <span class="timeline-dot" />
        <div class="timeline-period mono">
          {{ job.period
          }}<span v-if="job.current" class="current-badge">当前</span>
        </div>
        <div class="timeline-title">
          <h3>{{ job.company }}</h3>
          <BriefcaseBusiness :size="17" />
        </div>
        <p class="timeline-role">
          {{ job.role }}
        </p>
        <p class="timeline-summary">
          {{ job.summary }}
        </p>
        <ul class="timeline-achievements">
          <li v-for="achievement in job.achievements" :key="achievement">
            <ArrowUpRight :size="12" />{{ achievement }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
