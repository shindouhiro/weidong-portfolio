<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { portfolioMotionKey } from '../../composables/motionContext'
import { useSoundFx } from '../../composables/useSoundFx'

const props = defineProps<{
  animated: boolean
}>()

interface Spark {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

const isFinePointer = ref(false)
const isVisible = ref(false)
const isHovering = ref(false)
const isClicking = ref(false)
const portfolioMotion = inject(portfolioMotionKey, shallowRef(true))
const documentVisible = shallowRef(true)
const motionEnabled = computed(() => props.animated && portfolioMotion.value && documentVisible.value)

const mouseX = shallowRef(-100)
const mouseY = shallowRef(-100)
const ringX = shallowRef(-100)
const ringY = shallowRef(-100)

const sparks = ref<Spark[]>([])
let sparkIdCounter = 0
let animFrame = 0

const { playClick, playHover } = useSoundFx()

function onMouseMove(e: MouseEvent) {
  if (!isFinePointer.value || !motionEnabled.value)
    return
  if (!isVisible.value) {
    ringX.value = e.clientX
    ringY.value = e.clientY
  }
  isVisible.value = true
  mouseX.value = e.clientX
  mouseY.value = e.clientY

  // 根据交互目标切换光标状态。
  const target = e.target as HTMLElement | null
  if (target) {
    const interactive = target.closest('a, button, [role="button"], .project-card, .skill-card, .filter-button, .timeline-item, input, .dialog-close')
    if (interactive && !isHovering.value) {
      isHovering.value = true
      playHover()
    }
    else if (!interactive && isHovering.value) {
      isHovering.value = false
    }
  }
  startPhysics()
}

function onMouseDown(e: MouseEvent) {
  if (!isFinePointer.value || !motionEnabled.value)
    return
  isClicking.value = true
  playClick()
  createSparks(e.clientX, e.clientY)
}

function onMouseUp() {
  isClicking.value = false
}

function onMouseLeave() {
  isVisible.value = false
  stopPhysics()
}

function createSparks(x: number, y: number) {
  if (!motionEnabled.value)
    return
  const count = 10
  const colors = ['#c4f36c', '#4ade80', '#38bdf8', '#ffffff']

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const speed = Math.random() * 3.5 + 2
    sparks.value.push({
      id: ++sparkIdCounter,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    })
  }

  // 限制同时保留的火花数量。
  if (sparks.value.length > 50) {
    sparks.value = sparks.value.slice(-30)
  }
}

function updatePhysics() {
  animFrame = 0
  if (!motionEnabled.value)
    return

  if (isFinePointer.value && isVisible.value) {
    // 平滑跟随外环。
    const ease = isHovering.value ? 0.35 : 0.2
    ringX.value += (mouseX.value - ringX.value) * ease
    ringY.value += (mouseY.value - ringY.value) * ease

    // 更新点击火花。
    if (sparks.value.length > 0) {
      for (let i = sparks.value.length - 1; i >= 0; i--) {
        const s = sparks.value[i]
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.92
        s.vy *= 0.92
        s.alpha -= 0.035
        if (s.alpha <= 0) {
          sparks.value.splice(i, 1)
        }
      }
    }
    animFrame = requestAnimationFrame(updatePhysics)
  }
}

function startPhysics() {
  if (!animFrame && motionEnabled.value && isFinePointer.value && isVisible.value)
    animFrame = requestAnimationFrame(updatePhysics)
}

function stopPhysics() {
  cancelAnimationFrame(animFrame)
  animFrame = 0
  sparks.value = []
  isClicking.value = false
  isHovering.value = false
}

function onVisibilityChange() {
  documentVisible.value = !document.hidden
}

watch(motionEnabled, (enabled) => {
  if (enabled) {
    startPhysics()
  }
  else {
    stopPhysics()
    isVisible.value = false
  }
})

onMounted(() => {
  onVisibilityChange()
  document.addEventListener('visibilitychange', onVisibilityChange)
  isFinePointer.value = window.matchMedia('(pointer: fine)').matches
  if (isFinePointer.value) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
  }
})

onUnmounted(() => {
  stopPhysics()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <div
    v-if="motionEnabled && isFinePointer && isVisible"
    class="custom-cursor-container"
    aria-hidden="true"
  >
    <!-- 跟随鼠标的环境聚光 -->
    <div
      class="cursor-ambient-torch"
      :style="{
        transform: `translate3d(${mouseX}px, ${mouseY}px, 0)`,
      }"
    />

    <!-- 中心定位光点 -->
    <div
      class="cursor-dot"
      :class="{ clicking: isClicking, hovering: isHovering }"
      :style="{
        transform: `translate3d(${mouseX}px, ${mouseY}px, 0)`,
      }"
    />

    <!-- 磁吸外环与准星 -->
    <div
      class="cursor-ring"
      :class="{
        hovering: isHovering,
        clicking: isClicking,
      }"
      :style="{
        transform: `translate3d(${ringX}px, ${ringY}px, 0)`,
      }"
    >
      <div v-if="isHovering" class="reticle-corner top-left" />
      <div v-if="isHovering" class="reticle-corner top-right" />
      <div v-if="isHovering" class="reticle-corner bottom-left" />
      <div v-if="isHovering" class="reticle-corner bottom-right" />
    </div>

    <!-- 点击火花 -->
    <div
      v-for="s in sparks"
      :key="s.id"
      class="cursor-spark"
      :style="{
        transform: `translate3d(${s.x}px, ${s.y}px, 0)`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        backgroundColor: s.color,
        opacity: s.alpha,
      }"
    />
  </div>
</template>

<style scoped>
.custom-cursor-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.cursor-ambient-torch {
  position: absolute;
  top: -250px;
  left: -250px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196, 243, 108, 0.08) 0%, rgba(196, 243, 108, 0.015) 45%, transparent 70%);
  will-change: transform;
  pointer-events: none;
}

.cursor-dot {
  position: absolute;
  top: -3px;
  left: -3px;
  width: 6px;
  height: 6px;
  background-color: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent);
  will-change: transform;
  transition: transform 0.05s ease-out, width 0.15s, height 0.15s, background-color 0.15s;
}

.cursor-dot.hovering {
  background-color: #ffffff;
  transform: scale(1.5);
  box-shadow: 0 0 12px #ffffff;
}

.cursor-dot.clicking {
  transform: scale(0.6);
}

.cursor-ring {
  position: absolute;
  top: -16px;
  left: -16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(196, 243, 108, 0.45);
  box-shadow: 0 0 12px rgba(196, 243, 108, 0.2);
  will-change: transform;
  transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              top 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              left 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.2s ease,
              border-radius 0.25s ease;
}

.cursor-ring.hovering {
  top: -24px;
  left: -24px;
  width: 48px;
  height: 48px;
  border-color: rgba(196, 243, 108, 0.85);
  background: rgba(196, 243, 108, 0.08);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(196, 243, 108, 0.35);
}

.cursor-ring.clicking {
  transform: scale(0.85);
  border-color: #ffffff;
}

.reticle-corner {
  position: absolute;
  width: 6px;
  height: 6px;
  border-color: var(--accent);
  border-style: solid;
}

.top-left {
  top: -1px;
  left: -1px;
  border-width: 2px 0 0 2px;
}

.top-right {
  top: -1px;
  right: -1px;
  border-width: 2px 2px 0 0;
}

.bottom-left {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2px 2px;
}

.bottom-right {
  bottom: -1px;
  right: -1px;
  border-width: 0 2px 2px 0;
}

.cursor-spark {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: 0 0 8px currentColor;
  will-change: transform, opacity;
}
</style>
