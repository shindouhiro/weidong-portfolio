<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useSoundFx } from '../../composables/useSoundFx'

const props = defineProps<{ animated: boolean }>()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const containerRef = useTemplateRef<HTMLDivElement>('container')
const motionActive = shallowRef(false)
const telemetry = shallowRef('ROT: -33.2° | PITCH: 0.0°')
const { playShockwave } = useSoundFx()

let frame = 0
let observer: ResizeObserver | undefined
let intersection: IntersectionObserver | undefined
let motionQuery: MediaQueryList | undefined
let scrollHost: Element | null = null
let visible = false
let lastTimestamp = 0
let lastTelemetryUpdate = 0
let scrollDirty = true
let scrollProgress = 0
let targetScrollProgress = 0
let phase = 0
let orbitalPhase = 0
let width = 500
let height = 460
let targetTiltX = 0
let targetTiltY = 0
let tiltX = 0
let tiltY = 0
let shockwaveRadius = 0
let shockwaveMaxRadius = 0
let shockwaveAlpha = 0
let shockwaveOriginX = 250
let shockwaveOriginY = 230
let radarAngle = 0

// 截面三角函数固定，避免在每帧的线框采样中重复计算。
const crossSection = Array.from({ length: 113 }, (_, index) => {
  const angle = index / 112 * Math.PI * 2
  return { cosine: Math.cos(angle), sine: Math.sin(angle) }
})
const orbits = [
  { radius: 204, pitch: 0.44, rotation: -0.34, speed: 0.42, color: '196, 243, 108' },
  { radius: 194, pitch: 0.64, rotation: 0.96, speed: -0.32, color: '115, 205, 218' },
]

function rotation() {
  return -0.58 + tiltX * 0.35 + scrollProgress * 0.9
}

function drawOrbit(context: CanvasRenderingContext2D, front: boolean) {
  for (const [index, orbit] of orbits.entries()) {
    const angle = orbit.rotation + scrollProgress * 0.5 + tiltX * 0.18
    context.save()
    context.rotate(angle)
    context.beginPath()
    context.ellipse(0, 0, orbit.radius, orbit.radius * orbit.pitch, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2)
    context.strokeStyle = `rgba(${orbit.color}, ${front ? 0.2 : 0.09})`
    context.lineWidth = 0.7
    context.stroke()

    for (let particle = 0; particle < 3; particle++) {
      const position = orbitalPhase * orbit.speed + particle * Math.PI * 2 / 3 + index
      const isFront = Math.sin(position) >= 0
      if (isFront !== front)
        continue

      const depth = (Math.sin(position) + 1) / 2
      // 少量离散尾迹提供运动方向，保持线框本身的视觉优先级。
      for (let trail = 9; trail >= 0; trail--) {
        const trailingPosition = position - trail * 0.035 * Math.sign(orbit.speed)
        const alpha = (1 - trail / 10) * (0.3 + depth * 0.6)
        context.beginPath()
        context.arc(Math.cos(trailingPosition) * orbit.radius, Math.sin(trailingPosition) * orbit.radius * orbit.pitch, trail === 0 ? 1.8 + depth : 1.1, 0, Math.PI * 2)
        context.fillStyle = `rgba(${orbit.color}, ${alpha})`
        context.fill()
      }
      const x = Math.cos(position) * orbit.radius
      const y = Math.sin(position) * orbit.radius * orbit.pitch
      const glow = context.createRadialGradient(x, y, 0, x, y, 10)
      glow.addColorStop(0, `rgba(${orbit.color}, 0.32)`)
      glow.addColorStop(1, `rgba(${orbit.color}, 0)`)
      context.fillStyle = glow
      context.fillRect(x - 10, y - 10, 20, 20)
    }
    context.restore()
  }
}

function draw() {
  const context = canvas.value?.getContext('2d')
  if (!context || width <= 0 || height <= 0)
    return
  context.clearRect(0, 0, width, height)

  const scale = Math.min(width / 500, height / 460) * (1 - scrollProgress * 0.16)
  const cx = width * 0.5
  const cy = height * 0.49
  const baseRotation = rotation()
  const cosineRotation = Math.cos(baseRotation)
  const sineRotation = Math.sin(baseRotation)
  const pitchY = tiltY * 0.25

  context.save()
  context.translate(cx, cy)
  context.scale(scale, scale)

  const coreGlow = context.createRadialGradient(0, 0, 8, 0, 0, 165)
  coreGlow.addColorStop(0, `rgba(196, 243, 108, ${0.065 + Math.sin(orbitalPhase * 0.7) * 0.025})`)
  coreGlow.addColorStop(0.45, 'rgba(113, 193, 151, 0.025)')
  coreGlow.addColorStop(1, 'rgba(113, 193, 151, 0)')
  context.fillStyle = coreGlow
  context.fillRect(-165, -165, 330, 330)

  const radarGradient = context.createConicGradient(radarAngle, 0, 0)
  radarGradient.addColorStop(0, 'rgba(196, 243, 108, 0.06)')
  radarGradient.addColorStop(0.12, 'rgba(196, 243, 108, 0.01)')
  radarGradient.addColorStop(0.13, 'transparent')
  radarGradient.addColorStop(1, 'transparent')
  context.fillStyle = radarGradient
  context.beginPath()
  context.arc(0, 0, 180, 0, Math.PI * 2)
  context.fill()

  drawOrbit(context, false)

  // 前后轨道分层绘制，保留环面线框的纵深与鼠标倾斜反馈。
  for (let i = 0; i < 88; i++) {
    const u = i / 88 * Math.PI * 2
    const twist = u + phase
    const cosineTwist = Math.cos(twist)
    const sineTwist = Math.sin(twist)
    context.beginPath()
    let firstPoint = true
    for (const point of crossSection) {
      const radius = 130 + 49 * point.cosine
      const x = radius * cosineTwist
      const y = radius * sineTwist * (0.6 + pitchY) + point.sine * 46
      const depth = sineTwist * point.cosine
      const px = x * cosineRotation - y * sineRotation
      const py = x * sineRotation + y * cosineRotation
      if (firstPoint) {
        context.moveTo(px, py)
        firstPoint = false
      }
      else {
        context.lineTo(px + depth * 10, py)
      }
    }
    const brightness = (sineTwist + 1) / 2
    const shockwaveBoost = shockwaveAlpha * 0.4
    context.strokeStyle = `rgba(${160 + brightness * 40}, ${200 + brightness * 43}, ${76 + brightness * 26}, ${Math.min(1, 0.12 + brightness * 0.6 + shockwaveBoost)})`
    context.lineWidth = 0.75 + shockwaveBoost * 0.5
    context.stroke()
  }

  drawOrbit(context, true)
  context.restore()

  if (shockwaveAlpha > 0) {
    context.beginPath()
    context.arc(shockwaveOriginX, shockwaveOriginY, shockwaveRadius, 0, Math.PI * 2)
    context.strokeStyle = `rgba(196, 243, 108, ${shockwaveAlpha * 0.8})`
    context.lineWidth = 2.5 * scale
    context.stroke()

    if (shockwaveRadius > 25) {
      context.beginPath()
      context.arc(shockwaveOriginX, shockwaveOriginY, shockwaveRadius - 20, 0, Math.PI * 2)
      context.strokeStyle = `rgba(115, 205, 218, ${shockwaveAlpha * 0.5})`
      context.lineWidth = 1.2 * scale
      context.stroke()
    }
  }
}

function updateScroll() {
  if (!scrollDirty || !scrollHost)
    return
  const rect = scrollHost.getBoundingClientRect()
  targetScrollProgress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.85, 1)))
  scrollDirty = false
}

function animate(timestamp: number) {
  if (!motionActive.value)
    return

  const delta = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, 0.05) : 0
  lastTimestamp = timestamp
  const smoothing = 1 - Math.exp(-delta * 6)
  updateScroll()
  scrollProgress += (targetScrollProgress - scrollProgress) * smoothing
  phase = (phase + delta * 0.108) % (Math.PI * 2)
  orbitalPhase += delta
  radarAngle = (radarAngle + delta * 0.65) % (Math.PI * 2)
  tiltX += (targetTiltX - tiltX) * smoothing
  tiltY += (targetTiltY - tiltY) * smoothing

  if (shockwaveAlpha > 0) {
    shockwaveRadius += (shockwaveMaxRadius - shockwaveRadius) * (1 - Math.exp(-delta * 7.6))
    shockwaveAlpha = Math.max(0, shockwaveAlpha - delta * 1.2)
  }

  // HUD 每秒最多刷新四次，画布渲染不触发逐帧组件更新。
  if (timestamp - lastTelemetryUpdate >= 250) {
    telemetry.value = `ROT: ${(rotation() * 180 / Math.PI).toFixed(1)}° | PITCH: ${(tiltY * 15).toFixed(1)}°`
    lastTelemetryUpdate = timestamp
  }

  draw()
  frame = requestAnimationFrame(animate)
}

function restart() {
  cancelAnimationFrame(frame)
  lastTimestamp = 0
  scrollDirty = true
  const motionAllowed = props.animated && !motionQuery?.matches
  motionActive.value = motionAllowed && visible && !document.hidden
  if (!motionAllowed) {
    shockwaveAlpha = 0
    targetTiltX = tiltX = 0
    targetTiltY = tiltY = 0
    targetScrollProgress = scrollProgress = 0
  }
  if (visible && !document.hidden)
    draw()
  if (motionActive.value)
    frame = requestAnimationFrame(animate)
}

function onScroll() {
  scrollDirty = true
}

function onPointerMove(event: PointerEvent) {
  if (!containerRef.value || !motionActive.value || event.pointerType === 'touch')
    return
  const rect = containerRef.value.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0)
    return
  targetTiltX = (event.clientX - rect.left) / rect.width - 0.5
  targetTiltY = (event.clientY - rect.top) / rect.height - 0.5
}

function onPointerLeave() {
  targetTiltX = 0
  targetTiltY = 0
}

function onClick(event: MouseEvent) {
  if (!containerRef.value || !motionActive.value)
    return
  const rect = containerRef.value.getBoundingClientRect()
  shockwaveOriginX = event.clientX - rect.left
  shockwaveOriginY = event.clientY - rect.top
  shockwaveRadius = 5
  shockwaveMaxRadius = Math.max(rect.width, rect.height) * 0.8
  shockwaveAlpha = 1
  playShockwave()
}

watch(() => props.animated, restart)

onMounted(() => {
  if (!canvas.value)
    return
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', restart)
  document.addEventListener('visibilitychange', restart)
  window.addEventListener('scroll', onScroll, { passive: true })
  scrollHost = containerRef.value?.closest('section') ?? containerRef.value

  observer = new ResizeObserver(([entry]) => {
    if (!entry || !canvas.value)
      return
    width = entry.contentRect.width
    height = entry.contentRect.height
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.value.width = width * ratio
    canvas.value.height = height * ratio
    canvas.value.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
    scrollDirty = true
    if (!document.hidden)
      draw()
  })
  observer.observe(canvas.value)

  intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    restart()
  })
  intersection.observe(canvas.value)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  intersection?.disconnect()
  motionQuery?.removeEventListener('change', restart)
  document.removeEventListener('visibilitychange', restart)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    id="hero-orbit-visual"
    ref="container"
    class="orbit-visual interactive-orbit"
    :class="{ 'orbit-motion-paused': !motionActive }"
    aria-hidden="true"
    @pointermove.passive="onPointerMove"
    @pointerleave="onPointerLeave"
    @click="onClick"
  >
    <div class="orbit-grid" />
    <div class="orbit-glow" />
    <span class="orbit-coordinate coordinate-top">FIG. 001 / INFINITE POSSIBILITIES [CLICK FOR SHOCKWAVE]</span>
    <span class="orbit-cross cross-one">+</span>
    <span class="orbit-cross cross-two">+</span>
    <canvas ref="canvas" class="orbit-canvas" />

    <!-- 环绕核心的细刻度准星 -->
    <div class="hud-center-reticle" />

    <div class="floating-tag tag-top cyber-glow-pill">
      <span class="status-dot animate-ping-custom" /> SYSTEM ONLINE
    </div>
    <div class="floating-tag tag-code cyber-glow-pill">
      &lt;/&gt;
    </div>
    <div class="floating-tag tag-bottom cyber-glow-pill">
      BUILD. BREAK. CREATE. <span>↗</span>
    </div>
    <div class="orbit-caption">
      <span>CREATIVE ENGINEERING</span>
      <span class="telemetry-readout mono">{{ telemetry }}</span>
      <span>∞</span>
    </div>
  </div>
</template>

<style scoped>
.interactive-orbit {
  cursor: crosshair;
  transition: transform 0.2s ease;
}

.interactive-orbit:hover {
  filter: drop-shadow(0 0 25px rgba(196, 243, 108, 0.15));
}

.hud-center-reticle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(56%, 280px);
  aspect-ratio: 1;
  border: 1px dashed rgba(196, 243, 108, 0.12);
  border-radius: 50%;
  pointer-events: none;
  animation: orbit-reticle-turn 36s linear infinite;
}

.cyber-glow-pill {
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s, border-color 0.3s;
}

.cyber-glow-pill:hover {
  transform: scale(1.1) rotate(0deg) !important;
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(196, 243, 108, 0.4);
}

.telemetry-readout {
  font-size: 7px;
  color: #7b8e64;
  letter-spacing: 0.8px;
}

.animate-ping-custom {
  animation: ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.orbit-motion-paused .animate-ping-custom,
.orbit-motion-paused .hud-center-reticle {
  animation-play-state: paused;
}

.orbit-motion-paused .cyber-glow-pill {
  transition: none;
}

@keyframes orbit-reticle-turn {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .interactive-orbit,
  .cyber-glow-pill {
    transition: none;
  }

  .animate-ping-custom,
  .hud-center-reticle {
    animation: none;
  }
}

@keyframes ping-soft {
  0% {
    box-shadow: 0 0 0 0 rgba(196, 243, 108, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(196, 243, 108, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(196, 243, 108, 0);
  }
}
</style>
