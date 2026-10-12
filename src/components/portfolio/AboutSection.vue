<script setup lang="ts">
import { ArrowUpRight, GraduationCap } from '@lucide/vue'
import { profile } from '@resume/content'
</script>

<template>
  <section id="about" class="section about-section page-width">
    <div class="about-art" aria-hidden="true">
      <div class="about-bracket">
        {<span>keep<br /><em>creating</em><span class="about-cursor">_</span></span>}
      </div>
      <span class="mono">A DEVELOPER. A BUILDER. A LIFELONG LEARNER.</span>
      <div class="about-art-corner">
        ✳
      </div>
    </div>
    <div class="about-content">
      <span class="section-eyebrow mono">04 / BEHIND THE CODE</span>
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
        <span>保持好奇</span><span>认真构建</span><span>持续分享</span>
      </div>
      <div class="education">
        <GraduationCap :size="23" />
        <div>
          <strong>{{ profile.education }}</strong><span>{{ profile.major
          }}<span class="education-period mono">{{
            profile.educationPeriod
          }}</span></span>
        </div>
        <ArrowUpRight :size="17" />
      </div>
    </div>
  </section>
</template>
