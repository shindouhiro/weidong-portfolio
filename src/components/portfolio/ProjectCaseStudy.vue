<script setup lang="ts">
import type { Project } from '@resume/content'

defineProps<{ project: Project }>()
</script>

<template>
  <div class="case-study">
    <section class="case-section">
      <h3><span class="mono">01</span> 业务场景</h3>
      <p>{{ project.context }}</p>
    </section>
    <section class="case-section">
      <h3><span class="mono">02</span> 我的职责</h3>
      <p>{{ project.responsibilities }}</p>
    </section>
    <section class="case-section">
      <h3><span class="mono">03</span> 关键技术方案</h3>
      <ul class="solution-list">
        <li v-for="solution in project.solutions" :key="solution.title">
          <h4>{{ solution.title }}</h4>
          <p>{{ solution.detail }}</p>
        </li>
      </ul>
    </section>
    <section class="case-section">
      <h3><span class="mono">04</span> 交付成果</h3>
      <dl class="outcome-grid grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div v-for="outcome in project.outcomes" :key="outcome.label">
          <dt>{{ outcome.label }}</dt>
          <dd>{{ outcome.value }}</dd>
        </div>
      </dl>
      <p v-if="project.outcomeNote" class="outcome-note">
        {{ project.outcomeNote }}
      </p>
    </section>
    <section class="case-section">
      <h3><span class="mono">05</span> 技术栈</h3>
      <dl class="stack-list">
        <div v-for="group in project.stack" :key="group.label">
          <dt>{{ group.label }}</dt>
          <dd class="project-tags">
            <span v-for="item in group.items" :key="item">{{ item }}</span>
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.case-section {
  margin-top: 26px;
}
.case-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
}
.case-section h3 span {
  color: var(--accent);
  font-size: 9px;
}
.case-section p {
  font-size: 12px;
  line-height: 1.95;
  color: #b2bea6;
  overflow-wrap: anywhere;
}
.solution-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.solution-list li {
  border-left: 2px solid #4c6234;
  background: #20271a;
  padding: 14px 16px;
  border-radius: 0 5px 5px 0;
}
.solution-list h4 {
  font-size: 12px;
  font-weight: 500;
  color: #dfebd0;
  margin-bottom: 5px;
}
.outcome-grid {
  margin: 0;
}
.outcome-grid > div {
  padding: 17px 14px;
  border: 1px solid #3f5130;
  border-radius: 6px;
  background: linear-gradient(135deg, #2b371f, #1d2517);
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
}
.outcome-grid dt {
  font-size: 10px;
  color: #a6b698;
}
.outcome-grid dd {
  margin: 0;
  font-size: 23px;
  color: var(--accent);
  line-height: 1.3;
}
.case-section .outcome-note {
  margin-top: 12px;
  font-size: 10px;
  color: #98a68c;
}
.stack-list {
  margin: 0;
  display: grid;
  gap: 13px;
}
.stack-list dt {
  color: #a9b89a;
  font-size: 10px;
}
.stack-list dd {
  margin: 8px 0 0;
}
@media (max-width: 560px) {
  .outcome-grid > div {
    padding: 14px;
  }
  .outcome-grid dd {
    font-size: 21px;
  }
}
</style>
