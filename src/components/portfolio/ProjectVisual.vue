<script setup lang="ts">
import {
  Box,
  Braces,
  ChevronRight,
  Command,
  Cpu,
  GitBranch,
  Layers,
  MessageSquare,
  Send,
  Sparkles,
  Workflow,
} from '@lucide/vue'

defineProps<{ kind: string }>()
</script>

<template>
  <div class="project-visual" :class="`visual-${kind}`" aria-hidden="true">
    <span class="visual-label mono">{{
      kind === "cloudos"
        ? "AI POWERED WORKSPACE"
        : kind === "nebula"
          ? "INTELLIGENCE, IN FLOW"
          : "CONNECT THE COMPLEX"
    }}</span>
    <div v-if="kind === 'cloudos'" class="mini-window cloud-window">
      <div class="mini-window-top">
        <div class="window-dots">
          <i /><i /><i />
        </div>
        <span>AI-CloudOS</span><Command :size="10" />
      </div>
      <div class="cloud-body">
        <div class="mini-sidebar">
          <Layers :size="12" /><Workflow :size="12" /><Braces :size="12" /><Box
            :size="12"
          />
        </div>
        <div class="cloud-content">
          <div class="mini-heading">
            Build something extraordinary<span>您的 AI 研发工作空间</span>
          </div>
          <div class="cloud-tiles">
            <div><Cpu :size="18" /><span>AI 助手</span></div>
            <div><GitBranch :size="18" /><span>流程编排</span></div>
            <div><Braces :size="18" /><span>应用开发</span></div>
          </div>
          <div class="mini-input">
            <Sparkles :size="11" /> 描述你的下一个想法…
            <ChevronRight :size="11" />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="kind === 'nebula'" class="mini-window nebula-window">
      <div class="mini-window-top">
        <span><Sparkles :size="11" /> NebulaAI</span><span class="mini-online">● Online</span>
      </div>
      <div class="nebula-content">
        <div class="mini-message">
          <span class="message-avatar"><MessageSquare :size="13" /></span><span>让复杂的想法，清晰地呈现。</span>
        </div>
        <div class="mini-reply">
          <Sparkles :size="15" />
          <div>
            <span>Thinking beyond the ordinary.</span>
            <div class="skeleton-line" />
            <div class="skeleton-line short" />
            <div class="mini-code">
              const possibilities = <b>Infinity</b>;<span class="type-cursor">▍</span>
            </div>
          </div>
        </div>
        <div class="mini-input">
          Ask anything, create everything.<Send :size="11" />
        </div>
      </div>
    </div>
    <div v-else class="topology-preview">
      <svg viewBox="0 0 340 170" class="topology-lines">
        <path
          d="M75 80H136Q145 80 145 65V45H232M75 80H136Q145 80 145 95V120H232M260 45V120"
        />
      </svg>
      <div class="topo-node node-gateway">
        <Box :size="18" /><span>Gateway<small>入口服务</small></span><i />
      </div>
      <div class="topo-node node-service">
        <Layers :size="17" /><span>Application<small>应用服务</small></span><i />
      </div>
      <div class="topo-node node-storage">
        <Cpu :size="17" /><span>Database<small>数据服务</small></span><i />
      </div>
      <span class="topology-badge"><span class="status-dot" /> ALL SYSTEMS CONNECTED</span>
    </div>
    <span class="concept-label">界面概念示意</span>
  </div>
</template>
