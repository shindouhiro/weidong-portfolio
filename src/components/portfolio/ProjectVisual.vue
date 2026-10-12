<script setup lang="ts">
import {
  Activity,
  Box,
  Braces,
  CheckCircle2,
  Cpu,
  GitBranch,
  Layers,
  MessageSquare,
  Send,
  Sparkles,
  Terminal,
  Workflow,
} from '@lucide/vue'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{ kind: string }>()

// Live typewriter for NebulaAI
const nebulaStreamText = ref('')
const isTyping = ref(true)
const tokenSpeed = ref(142)
let streamTimer: ReturnType<typeof setTimeout> | undefined
const fullStreamMessage = 'Thinking beyond the ordinary. Incremental AST stream active.'

function startStreaming() {
  if (props.kind !== 'nebula')
    return
  let idx = 0
  nebulaStreamText.value = ''
  isTyping.value = true

  function step() {
    if (idx < fullStreamMessage.length) {
      nebulaStreamText.value = fullStreamMessage.slice(0, ++idx)
      tokenSpeed.value = 135 + Math.floor(Math.random() * 25)
      streamTimer = setTimeout(step, 45 + Math.random() * 35)
    }
    else {
      isTyping.value = false
      streamTimer = setTimeout(startStreaming, 3500)
    }
  }

  step()
}

// Live terminal log for CloudOS
const cloudStep = ref(0)
let cloudTimer: ReturnType<typeof setInterval> | undefined
const cloudLogs = [
  'JIT Mounting: dynamic link @ai/tools (0.8ms)',
  'SSOT Dependencies verified: 0 duplicates',
  'Iconify SVG pipeline: assets compiled',
  'Turbopack HMR ready on port 3000',
]

onMounted(() => {
  if (props.kind === 'nebula') {
    startStreaming()
  }
  else if (props.kind === 'cloudos') {
    cloudTimer = setInterval(() => {
      cloudStep.value = (cloudStep.value + 1) % cloudLogs.length
    }, 2400)
  }
})

onUnmounted(() => {
  clearTimeout(streamTimer)
  clearInterval(cloudTimer)
})
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

    <!-- CloudOS Visual -->
    <div v-if="kind === 'cloudos'" class="mini-window cloud-window">
      <div class="mini-window-top">
        <div class="window-dots">
          <i /><i /><i />
        </div>
        <span><Terminal :size="10" /> AI-CloudOS</span>
        <div class="cloud-status-badge mono">
          <span class="pulse-dot" /> BUILD OPTIMIZED
        </div>
      </div>
      <div class="cloud-body">
        <div class="mini-sidebar">
          <Layers :size="12" class="side-icon-active" />
          <Workflow :size="12" />
          <Braces :size="12" />
          <Box :size="12" />
        </div>
        <div class="cloud-content">
          <div class="mini-heading">
            Build something extraordinary
            <span>您的 AI 研发工作空间</span>
          </div>
          <div class="cloud-tiles">
            <div class="tile-active">
              <Cpu :size="16" />
              <span>AI 助手</span>
            </div>
            <div>
              <GitBranch :size="16" />
              <span>流程编排</span>
            </div>
            <div>
              <Braces :size="16" />
              <span>应用开发</span>
            </div>
          </div>
          <!-- Live Terminal Output -->
          <div class="cloud-console mono">
            <span class="console-prompt">&gt;</span>
            <span class="console-text">{{ cloudLogs[cloudStep] }}</span>
            <CheckCircle2 :size="10" class="console-check" />
          </div>
        </div>
      </div>
    </div>

    <!-- NebulaAI Visual -->
    <div v-else-if="kind === 'nebula'" class="mini-window nebula-window">
      <div class="mini-window-top">
        <span><Sparkles :size="11" /> NebulaAI Engine</span>
        <span class="mini-online mono">● STREAM {{ tokenSpeed }} T/S</span>
      </div>
      <div class="nebula-content">
        <div class="mini-message">
          <span class="message-avatar"><MessageSquare :size="13" /></span>
          <span>让复杂的想法，清晰地流动。</span>
        </div>
        <div class="mini-reply">
          <div class="reply-sparkle-wrap">
            <Sparkles :size="15" />
            <div class="equalizer-bars">
              <span class="bar bar-1" />
              <span class="bar bar-2" />
              <span class="bar bar-3" />
            </div>
          </div>
          <div>
            <div class="stream-text-box">
              <span>{{ nebulaStreamText }}</span>
              <span class="type-cursor" :class="{ 'cursor-blinking': !isTyping }">▍</span>
            </div>
            <div class="mini-code">
              const possibilities = <b>Infinity</b>; <span class="code-comment">// O(1) AST stream</span>
            </div>
          </div>
        </div>
        <div class="mini-input">
          <span>Ask anything, create everything...</span>
          <Send :size="11" />
        </div>
      </div>
    </div>

    <!-- ATC Topology Visual -->
    <div v-else class="topology-preview">
      <svg viewBox="0 0 340 170" class="topology-lines">
        <!-- Main Topology Circuit Paths -->
        <path
          id="topo-path-1"
          class="circuit-base-path"
          d="M75 80H136Q145 80 145 65V45H232"
        />
        <path
          id="topo-path-2"
          class="circuit-base-path"
          d="M75 80H136Q145 80 145 95V120H232"
        />
        <path
          id="topo-path-3"
          class="circuit-base-path"
          d="M260 45V120"
        />

        <!-- Animated Data Packets Traveling Along Paths -->
        <circle r="3.2" fill="#c4f36c" class="packet-glow">
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path="M75 80H136Q145 80 145 65V45H232"
          />
        </circle>
        <circle r="2.8" fill="#38bdf8" class="packet-glow">
          <animateMotion
            dur="2.8s"
            begin="0.8s"
            repeatCount="indefinite"
            path="M75 80H136Q145 80 145 95V120H232"
          />
        </circle>
        <circle r="2.5" fill="#4ade80" class="packet-glow">
          <animateMotion
            dur="1.8s"
            begin="0.4s"
            repeatCount="indefinite"
            path="M260 45V120"
          />
        </circle>
      </svg>

      <div class="topo-node node-gateway">
        <Box :size="18" />
        <span>Gateway<small>入口网关 (99.99%)</small></span>
        <span class="pulse-beacon" />
      </div>
      <div class="topo-node node-service">
        <Layers :size="17" />
        <span>Application<small>核心微服务</small></span>
        <span class="pulse-beacon green" />
      </div>
      <div class="topo-node node-storage">
        <Cpu :size="17" />
        <span>Database<small>分片数据集群</small></span>
        <span class="pulse-beacon cyan" />
      </div>
      <span class="topology-badge mono">
        <Activity :size="10" />
        <span class="status-dot" /> 1,280 NODES CONNECTED &bull; 0.8ms LATENCY
      </span>
    </div>

    <span class="concept-label">界面概念示意</span>
  </div>
</template>

<style scoped>
.cloud-status-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 6px;
  color: var(--accent);
  letter-spacing: 0.5px;
}

.pulse-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  animation: pulse-glow 1.5s infinite;
}

.side-icon-active {
  color: var(--accent);
}

.tile-active {
  border-color: rgba(196, 243, 108, 0.45) !important;
  background: rgba(196, 243, 108, 0.12) !important;
  color: var(--accent) !important;
}

.cloud-console {
  margin-top: 8px;
  background: rgba(10, 14, 8, 0.85);
  border: 1px solid rgba(196, 243, 108, 0.2);
  border-radius: 3px;
  padding: 4px 7px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 6px;
  color: #9cb881;
}

.console-prompt {
  color: var(--accent);
}

.console-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.console-check {
  color: var(--accent);
  flex-shrink: 0;
}

.reply-sparkle-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.equalizer-bars {
  display: flex;
  gap: 2px;
  height: 10px;
  align-items: flex-end;
}

.equalizer-bars .bar {
  width: 2px;
  background: var(--accent);
  border-radius: 1px;
}

.bar-1 {
  height: 60%;
  animation: bar-dance 0.7s infinite alternate ease-in-out;
}
.bar-2 {
  height: 100%;
  animation: bar-dance 0.5s infinite alternate-reverse ease-in-out;
}
.bar-3 {
  height: 40%;
  animation: bar-dance 0.8s infinite alternate ease-in-out;
}

@keyframes bar-dance {
  0% {
    height: 20%;
  }
  100% {
    height: 100%;
  }
}

.stream-text-box {
  min-height: 22px;
  color: #d1d5db;
  font-size: 6px;
  line-height: 1.4;
}

.type-cursor {
  color: var(--accent);
  margin-left: 1px;
}

.cursor-blinking {
  animation: blink 1s step-end infinite;
}

.code-comment {
  color: #606d8a;
  font-style: italic;
}

/* Topology paths */
.circuit-base-path {
  stroke: rgba(122, 156, 104, 0.45);
  stroke-width: 1.5;
  stroke-dasharray: 4 2;
  animation: circuit-flow 30s linear infinite;
}

@keyframes circuit-flow {
  to {
    stroke-dashoffset: -100;
  }
}

.packet-glow {
  filter: drop-shadow(0 0 4px currentColor);
}

.pulse-beacon {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  margin-left: 4px;
}

.pulse-beacon.green {
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
}

.pulse-beacon.cyan {
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.5;
  }
}
</style>
