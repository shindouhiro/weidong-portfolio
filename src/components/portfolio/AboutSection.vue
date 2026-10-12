<script setup lang="ts">
import { ArrowUpRight, GraduationCap } from '@lucide/vue'
import { profile } from '@resume/content'
import { useCardSpotlight } from '../../composables/useCardSpotlight'
import GlitchText from '../effects/GlitchText.vue'

const { handleCardMouseMove, handleCardMouseLeave } = useCardSpotlight()
</script>

<template>
  <section id="about" class="section about-section page-width">
    <div
      class="about-art spotlight-card"
      aria-hidden="true"
      @mousemove="handleCardMouseMove"
      @mouseleave="handleCardMouseLeave"
    >
      <div class="about-bracket">
        {<span>keep<br /><em>creating</em><span class="about-cursor">_</span></span>}
      </div>
      <span class="mono">A DEVELOPER. A BUILDER. A LIFELONG LEARNER.</span>
      <div class="about-art-corner spin-star">
        ✳
      </div>
    </div>
    <div class="about-content">
      <span class="section-eyebrow mono">
        <GlitchText text="04 / BEHIND THE CODE" />
      </span>
      <h2>
        不止于代码。<br />更关乎<span class="heading-accent">可能性。</span>
      </h2>
      <p>
        我是吴伟东，一名喜欢解决复杂问题的前端工程师。我的实践横跨前端、后端与基础设施，也从未停止探索新的开发方式。
      </p>
      <p>
        我相信好的工程既要有清晰的架构，也要有细腻的体验。从一个交互细节到一套研发体系，我在意每一步如何让产品和团队变得更好。
      </p>
      <div class="about-principles">
        <span class="principle-pill">保持好奇</span>
        <span class="principle-pill">认真构建</span>
        <span class="principle-pill">持续分享</span>
      </div>
      <div class="education spotlight-card" @mousemove="handleCardMouseMove" @mouseleave="handleCardMouseLeave">
        <GraduationCap :size="23" class="edu-icon" />
        <div>
          <strong>{{ profile.education }}</strong>
          <span>
            {{ profile.major }}
            <span class="education-period mono">{{ profile.educationPeriod }}</span>
          </span>
        </div>
        <ArrowUpRight :size="17" class="edu-arrow" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.spin-star {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s;
}

.about-art:hover .spin-star {
  transform: rotate(45deg) scale(1.1);
  color: rgba(196, 243, 108, 0.25);
}

.principle-pill {
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1),
              background-color 0.2s,
              border-color 0.2s,
              box-shadow 0.2s;
}

.principle-pill:hover {
  transform: translateY(-2px);
  background: rgba(196, 243, 108, 0.15) !important;
  border-color: rgba(196, 243, 108, 0.5) !important;
  box-shadow: 0 0 12px rgba(196, 243, 108, 0.25);
}

.edu-icon {
  color: var(--accent);
  transition: transform 0.3s;
}

.education:hover .edu-icon {
  transform: scale(1.15) rotate(-5deg);
}

.edu-arrow {
  transition: transform 0.2s;
}

.education:hover .edu-arrow {
  transform: translate(3px, -3px);
  color: var(--accent);
}
</style>
