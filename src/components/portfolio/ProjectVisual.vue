<script setup lang="ts">
import {
  Activity,
  Box,
  Braces,
  CheckCircle2,
  Cpu,
  GitBranch,
  GraduationCap,
  Layers,
  MessageSquare,
  Send,
  Sparkles,
  Terminal,
  Workflow,
} from '@lucide/vue'
import { onMounted, onUnmounted, shallowRef } from 'vue'

const props = defineProps<{ kind: string }>()

// NebulaAI 流式文本概念演示
const nebulaStreamText = shallowRef('')
const isTyping = shallowRef(true)
let streamTimer: ReturnType<typeof setTimeout> | undefined
const fullStreamMessage = '增量解析持续输出，避免长文本的全量重绘，让每一次回应清晰流动。'

function startStreaming() {
  if (props.kind !== 'nebula')
    return
  let idx = 0
  nebulaStreamText.value = ''
  isTyping.value = true

  function step() {
    if (idx < fullStreamMessage.length) {
      nebulaStreamText.value = fullStreamMessage.slice(0, ++idx)
      streamTimer = setTimeout(step, 45 + Math.random() * 35)
    }
    else {
      isTyping.value = false
      streamTimer = setTimeout(startStreaming, 3500)
    }
  }

  step()
}

// CloudOS 工程能力概念演示
const cloudStep = shallowRef(0)
let cloudTimer: ReturnType<typeof setInterval> | undefined
const cloudLogs = [
  'JIT Mounting · AI 脚本动态挂载',
  'SSOT · 单源真相依赖治理',
  'Iconify · SVG → JSON 按需加载',
  'Angular + RxJS · 复杂业务交付',
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
      kind === "seres"
        ? "LEARN. ASSESS. GROW."
        : kind === "cloudos"
          ? "AI POWERED WORKSPACE"
          : kind === "nebula"
            ? "INTELLIGENCE, IN FLOW"
            : "CONNECT THE COMPLEX"
    }}</span>

    <!-- 企业学习平台概念示意 -->
    <div v-if="kind === 'seres'" class="mini-window learning-window">
      <div class="mini-window-top">
        <span><GraduationCap :size="12" /> 赛力斯 · 企业学习平台</span>
        <span class="learning-portal">管理端 / 学员端</span>
      </div>
      <div class="learning-content">
        <div class="learning-heading">
          让学习，连接岗位成长。
          <span class="mono">TRAINING → CAPABILITY</span>
        </div>
        <div class="learning-flow">
          <div><Layers :size="16" /><strong>课程学习</strong><span>课件 / 学习跟踪</span></div>
          <div><CheckCircle2 :size="16" /><strong>在线考试</strong><span>服务端计时 / 幂等交卷</span></div>
          <div><GraduationCap :size="16" /><strong>培训结果</strong><span>证书 / 岗位晋升</span></div>
        </div>
        <div class="learning-assistant">
          <Sparkles :size="11" /><span>AI 学习助手</span>
          <span class="mono">SSE / AG-UI</span>
        </div>
      </div>
    </div>

    <!-- CloudOS 工作空间概念示意 -->
    <div v-else-if="kind === 'cloudos'" class="mini-window cloud-window">
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
          <!-- 工程能力轮播 -->
          <div class="cloud-console mono">
            <span class="console-prompt">&gt;</span>
            <span class="console-text">{{ cloudLogs[cloudStep] }}</span>
            <CheckCircle2 :size="10" class="console-check" />
          </div>
        </div>
      </div>
    </div>

    <!-- NebulaAI 流式交互概念示意 -->
    <div v-else-if="kind === 'nebula'" class="mini-window nebula-window">
      <div class="mini-window-top">
        <span><Sparkles :size="11" /> NebulaAI Engine</span>
        <span class="mini-online mono">● STREAM PREVIEW</span>
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
              <b>Incremental Parsing</b> <span class="code-comment">// 增量更新</span>
            </div>
          </div>
        </div>
        <div class="mini-input">
          <span>Ask anything, create everything...</span>
          <Send :size="11" />
        </div>
      </div>
    </div>

    <!-- ATC 拓扑概念示意 -->
    <div v-else class="topology-preview">
      <svg viewBox="0 0 340 170" class="topology-lines">
        <!-- 拓扑连接路径 -->
        <path
          class="circuit-base-path"
          d="M75 80H136Q145 80 145 65V45H232"
        />
        <path
          class="circuit-base-path"
          d="M75 80H136Q145 80 145 95V120H232"
        />
        <path
          class="circuit-base-path"
          d="M260 45V120"
        />

        <!-- 沿路径移动的数据粒子 -->
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
        <span>Gateway<small>入口网关</small></span>
        <span class="pulse-beacon" />
      </div>
      <div class="topo-node node-service">
        <Layers :size="17" />
        <span>Application<small>核心微服务</small></span>
        <span class="pulse-beacon green" />
      </div>
      <div class="topo-node node-storage">
        <Cpu :size="17" />
        <span>Database<small>数据存储</small></span>
        <span class="pulse-beacon cyan" />
      </div>
      <span class="topology-badge mono">
        <Activity :size="10" />
        <span class="status-dot" /> REACT FLOW &bull; CONFIG-DRIVEN UI
      </span>
    </div>

    <span class="concept-label">界面概念示意</span>
  </div>
</template>

<style scoped>
.mini-window {
  max-width: 370px;
}
.visual-seres {
  background: radial-gradient(ellipse at 50% 75%, #234d4b, #172b2c 80%);
}
.visual-seres .visual-label,
.visual-seres .concept-label {
  color: #7bb5af;
}
.learning-window {
  background: #102b2bea;
  border-color: #4c8e866b;
  transform: perspective(1000px) rotateY(-5deg) rotateX(6deg) rotateZ(-2deg);
}
.learning-window .mini-window-top {
  color: #b6e1d7;
  border-color: #4c8e863b;
}
.learning-portal {
  font-size: 6px;
  color: #8fb9ac;
}
.learning-content {
  padding: 12px;
}
.learning-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 9px;
  color: #d7f1e5;
}
.learning-heading span {
  font-size: 5px;
  color: #7ba399;
}
.learning-flow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-top: 12px;
}
.learning-flow > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 8px 6px;
  border: 1px solid #497d704f;
  background: #1b3a35;
  border-radius: 4px;
  color: #a7dcb2;
}
.learning-flow strong {
  font-size: 7px;
  font-weight: 500;
}
.learning-flow span {
  font-size: 5px;
  color: #8bb7a5;
}
.learning-assistant {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 6px;
  color: #b3e5ba;
}
.learning-assistant span:last-child {
  margin-left: auto;
  color: #86b7a1;
}
@media (max-width: 560px) {
  .learning-heading span {
    display: none;
  }
}
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

/* 拓扑路径流动效果 */
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
