<script setup lang="ts">
import type { Project, ProjectCategory } from '@resume/content'
import { ArrowUpRight, Sparkles, X } from '@lucide/vue'
import { projects } from '@resume/content'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { computed, shallowRef } from 'vue'
import { useCardSpotlight } from '../../composables/useCardSpotlight'
import GlitchText from '../effects/GlitchText.vue'
import ProjectCaseStudy from './ProjectCaseStudy.vue'
import ProjectVisual from './ProjectVisual.vue'

const category = shallowRef<ProjectCategory | 'all'>('all')
const { handleCardMouseMove, handleCardMouseLeave } = useCardSpotlight()

const categories: { id: ProjectCategory | 'all', label: string }[] = [
  { id: 'all', label: '全部项目' },
  { id: 'business', label: '企业业务' },
  { id: 'ai', label: 'AI 应用' },
  { id: 'visual', label: '可视化' },
]
const filters = categories.map(filter => ({
  ...filter,
  count: String(projects.filter(project => filter.id === 'all' || project.category === filter.id).length).padStart(2, '0'),
}))

const filteredProjects = computed<Project[]>(() =>
  projects.filter(
    project =>
      category.value === 'all' || project.category === category.value,
  ),
)
</script>

<template>
  <section id="projects" class="section page-width">
    <div class="section-heading">
      <div>
        <span class="section-eyebrow mono">
          <GlitchText text="01 / SELECTED WORK" />
        </span>
        <h2>把想法，变成<span class="heading-accent">作品。</span></h2>
        <p>企业业务、AI 应用与云原生编排，从复杂场景到稳定交付。</p>
      </div>
      <span class="section-side-note mono">
        IDEAS → SYSTEMS → IMPACT <ArrowUpRight :size="18" />
      </span>
    </div>
    <div
      class="project-filters flex flex-wrap items-center gap-2"
      aria-label="项目分类"
    >
      <button
        v-for="filter in filters"
        :id="`filter-${filter.id}`"
        :key="filter.id"
        :aria-pressed="category === filter.id"
        class="filter-button"
        :class="[{ selected: category === filter.id }]"
        @click="category = filter.id"
      >
        {{ filter.label }}<span>{{ filter.count }}</span>
      </button>
      <span class="filter-count mono" aria-live="polite">
        <Sparkles :size="10" class="inline mr-1 text-lime-400" />
        {{ filteredProjects.length }} PROJECTS
      </span>
    </div>
    <div class="project-grid">
      <DialogRoot v-for="project in filteredProjects" :key="project.id">
        <article
          class="project-card spotlight-card"
          @mousemove="handleCardMouseMove"
          @mouseleave="handleCardMouseLeave"
        >
          <DialogTrigger
            :id="`project-open-${project.id}`"
            class="project-trigger"
            :aria-label="`查看 ${project.name} 项目详情`"
          />
          <ProjectVisual :kind="project.id" />
          <div class="project-card-body">
            <div class="project-meta mono">
              <span>{{ project.categoryLabel }}</span><span>/ {{ project.number }}</span>
            </div>
            <div class="project-title-row">
              <h3>{{ project.name }}</h3>
              <span class="project-arrow"><ArrowUpRight :size="20" /></span>
            </div>
            <p class="project-subtitle">
              {{ project.subtitle }}
            </p>
            <p class="project-description">
              {{ project.description }}
            </p>
            <p class="project-role">
              <span>负责方向</span>{{ project.role }}
            </p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag-hover">{{ tag }}</span>
            </div>
            <div class="project-metric">
              <strong>{{ project.metric }}</strong>
              <span>{{ project.metricLabel }}</span>
              <span class="project-details-label">项目详情 ↗</span>
            </div>
          </div>
        </article>
        <DialogPortal>
          <DialogOverlay class="dialog-overlay" />
          <DialogContent
            :id="`project-dialog-${project.id}`"
            class="project-dialog"
          >
            <DialogClose
              :id="`project-close-${project.id}`"
              class="dialog-close icon-button"
              aria-label="关闭项目详情"
            >
              <X :size="22" />
            </DialogClose>
            <span class="section-eyebrow mono">PROJECT {{ project.number }} / {{ project.categoryLabel }}</span>
            <DialogTitle class="dialog-title">
              {{ project.name }}
            </DialogTitle>
            <DialogDescription class="dialog-description">
              {{ project.subtitle }} · {{ project.role }}
            </DialogDescription>
            <ProjectVisual :kind="project.id" />
            <ProjectCaseStudy :project="project" />
            <p class="dialog-note">
              成果与职责来自个人简历；上方为项目界面概念示意。
            </p>
            <DialogClose
              :id="`project-done-${project.id}`"
              class="button button-primary dialog-done"
            >
              继续探索 <ArrowUpRight :size="17" />
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  </section>
</template>
