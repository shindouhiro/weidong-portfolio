<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useSoundFx } from '../../composables/useSoundFx'

const props = defineProps<{ animated: boolean }>()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const containerRef = useTemplateRef<HTMLDivElement>('container')

let frame = 0
let observer: ResizeObserver | undefined
let intersection: IntersectionObserver | undefined
let visible = true
let phase = 0
let width = 500
let height = 460

// Interactive tilt & shockwave
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

const telemetry = ref('RAD: 0.00 | TILT: 0.0°')
const { playShockwave } = useSoundFx()

function draw() {
  const context = canvas.value?.getContext('2d')
  if (!context)
    return
  context.clearRect(0, 0, width, height)

  const scale = Math.min(width / 500, height / 460)
  const cx = width * 0.5
  const cy = height * 0.49
  const baseRotation = -0.58 + tiltX * 0.35
  const pitchY = tiltY * 0.25

  // 1. Draw radar sweep arc
  if (props.animated) {
    const radarGrad = context.createConicGradient(radarAngle, cx, cy)
    radarGrad.addColorStop(0, 'rgba(196, 243, 108, 0.06)')
    radarGrad.addColorStop(0.12, 'rgba(196, 243, 108, 0.01)')
    radarGrad.addColorStop(0.13, 'transparent')
    radarGrad.addColorStop(1, 'transparent')
    context.fillStyle = radarGrad
    context.beginPath()
    context.arc(cx, cy, 180 * scale, 0, Math.PI * 2)
    context.fill()
  }

  // 2. Draw 3D Parametric Torus Ribbons
  for (let i = 0; i < 100; i++) {
    const u = (i / 100) * Math.PI * 2
    context.beginPath()
    for (let j = 0; j <= 160; j++) {
      const v = (j / 160) * Math.PI * 2
      const twist = u + phase
      const radius = 130 + 49 * Math.cos(v)
      const x = radius * Math.cos(twist)
      const y = radius * Math.sin(twist) * (0.6 + pitchY) + Math.sin(v) * 46
      const depth = Math.sin(twist) * Math.cos(v)
      const px = (x * Math.cos(baseRotation) - y * Math.sin(baseRotation)) * scale + cx
      const py = (x * Math.sin(baseRotation) + y * Math.cos(baseRotation)) * scale + cy
      if (j === 0)
        context.moveTo(px, py)
      else context.lineTo(px + depth * 10 * scale, py)
    }
    const brightness = (Math.sin(u + phase) + 1) / 2
    const shockwaveBoost = shockwaveAlpha * 0.4
    context.strokeStyle = `rgba(${160 + brightness * 40}, ${200 + brightness * 43}, ${76 + brightness * 26}, ${Math.min(1, 0.12 + brightness * 0.6 + shockwaveBoost)})`
    context.lineWidth = (0.75 + shockwaveBoost * 0.5) * scale
    context.stroke()
  }

  // 3. Draw shockwave ripple on click
  if (shockwaveAlpha > 0) {
    context.beginPath()
    context.arc(shockwaveOriginX, shockwaveOriginY, shockwaveRadius, 0, Math.PI * 2)
    context.strokeStyle = `rgba(196, 243, 108, ${shockwaveAlpha * 0.8})`
    context.lineWidth = 2.5 * scale
    context.stroke()

    // Secondary echo ring
    if (shockwaveRadius > 25) {
      context.beginPath()
      context.arc(shockwaveOriginX, shockwaveOriginY, shockwaveRadius - 20, 0, Math.PI * 2)
      context.strokeStyle = `rgba(56, 189, 248, ${shockwaveAlpha * 0.5})`
      context.lineWidth = 1.2 * scale
      context.stroke()
    }
  }
}

function animate() {
  if (!props.animated || !visible)
    return

  phase += 0.0018
  radarAngle = (radarAngle + 0.015) % (Math.PI * 2)

  // Lerp tilts
  tiltX += (targetTiltX - tiltX) * 0.08
  tiltY += (targetTiltY - tiltY) * 0.08

  // Update shockwave
  if (shockwaveAlpha > 0) {
    shockwaveRadius += (shockwaveMaxRadius - shockwaveRadius) * 0.12
    shockwaveAlpha -= 0.02
    if (shockwaveAlpha < 0) {
      shockwaveAlpha = 0
    }
  }

  telemetry.value = `ROT: ${(baseRotationToDeg()).toFixed(1)}° | PITCH: ${(tiltY * 15).toFixed(1)}° | PHASE: ${(phase % (Math.PI * 2)).toFixed(2)}`

  draw()
  frame = requestAnimationFrame(animate)
}

function baseRotationToDeg() {
  return ((-0.58 + tiltX * 0.35) * 180) / Math.PI
}

function restart() {
  cancelAnimationFrame(frame)
  draw()
  if (props.animated && visible)
    frame = requestAnimationFrame(animate)
}

function onMouseMove(e: MouseEvent) {
  if (!containerRef.value)
    return
  const rect = containerRef.value.getBoundingClientRect()
  const nx = (e.clientX - rect.left) / rect.width - 0.5
  const ny = (e.clientY - rect.top) / rect.height - 0.5
  targetTiltX = nx
  targetTiltY = ny
}

function onMouseLeave() {
  targetTiltX = 0
  targetTiltY = 0
}

function onClick(e: MouseEvent) {
  if (!containerRef.value)
    return
  const rect = containerRef.value.getBoundingClientRect()
  shockwaveOriginX = e.clientX - rect.left
  shockwaveOriginY = e.clientY - rect.top
  shockwaveRadius = 5
  shockwaveMaxRadius = Math.max(rect.width, rect.height) * 0.8
  shockwaveAlpha = 1
  playShockwave()
}

watch(() => props.animated, restart)

onMounted(() => {
  if (!canvas.value)
    return
  observer = new ResizeObserver(([entry]) => {
    if (!entry || !canvas.value)
      return
    width = entry.contentRect.width
    height = entry.contentRect.height
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.value.width = width * ratio
    canvas.value.height = height * ratio
    canvas.value.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
    draw()
  })
  observer.observe(canvas.value)

  intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    restart()
  })
  intersection.observe(canvas.value)

  const container = containerRef.value
  if (container) {
    container.addEventListener('mousemove', onMouseMove, { passive: true })
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('click', onClick)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  intersection?.disconnect()
  const container = containerRef.value
  if (container) {
    container.removeEventListener('mousemove', onMouseMove)
    container.removeEventListener('mouseleave', onMouseLeave)
    container.removeEventListener('click', onClick)
  }
})
</script>

<template>
  <div
    ref="container"
    class="orbit-visual interactive-orbit"
    aria-hidden="true"
  >
    <div class="orbit-grid" />
    <div class="orbit-glow" />
    <span class="orbit-coordinate coordinate-top">FIG. 001 / INFINITE POSSIBILITIES [CLICK FOR SHOCKWAVE]</span>
    <span class="orbit-cross cross-one">+</span>
    <span class="orbit-cross cross-two">+</span>
    <canvas ref="canvas" class="orbit-canvas" />

    <!-- Cyber HUD Rings -->
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
  width: 280px;
  height: 280px;
  border: 1px dashed rgba(196, 243, 108, 0.12);
  border-radius: 50%;
  pointer-events: none;
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
