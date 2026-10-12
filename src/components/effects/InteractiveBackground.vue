<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

const props = defineProps<{
  animated: boolean
}>()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

interface GlowOrb {
  x: number
  y: number
  targetX: number
  targetY: number
  radius: number
  color: string
  alpha: number
  speed: number
}

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
let animationFrameId = 0
let width = 0
let height = 0
let mouseX = -1000
let mouseY = -1000

const particles: Particle[] = []
const orbs: GlowOrb[] = []

const colors = [
  'rgba(196, 243, 108, ', // accent lime
  'rgba(74, 222, 128, ', // emerald
  'rgba(56, 189, 248, ', // cyan
]

function initOrbs() {
  orbs.length = 0
  orbs.push(
    {
      x: width * 0.2,
      y: height * 0.2,
      targetX: width * 0.25,
      targetY: height * 0.35,
      radius: Math.min(width, height) * 0.45,
      color: 'rgba(196, 243, 108, 0.04)',
      alpha: 0.04,
      speed: 0.003,
    },
    {
      x: width * 0.8,
      y: height * 0.5,
      targetX: width * 0.75,
      targetY: height * 0.6,
      radius: Math.min(width, height) * 0.5,
      color: 'rgba(34, 197, 94, 0.03)',
      alpha: 0.03,
      speed: 0.002,
    },
    {
      x: width * 0.5,
      y: height * 0.85,
      targetX: width * 0.45,
      targetY: height * 0.8,
      radius: Math.min(width, height) * 0.4,
      color: 'rgba(56, 189, 248, 0.025)',
      alpha: 0.025,
      speed: 0.0025,
    },
  )
}

function initParticles() {
  particles.length = 0
  const count = Math.min(Math.floor((width * height) / 22000), 55)

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas)
    return
  width = window.innerWidth
  height = window.innerHeight

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  if (particles.length === 0) {
    initParticles()
    initOrbs()
  }
  draw()
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas)
    return
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  ctx.clearRect(0, 0, width, height)

  // 1. Draw ambient glowing orbs
  for (const orb of orbs) {
    if (props.animated) {
      orb.x += (orb.targetX - orb.x) * orb.speed
      orb.y += (orb.targetY - orb.y) * orb.speed

      if (Math.abs(orb.targetX - orb.x) < 2 && Math.abs(orb.targetY - orb.y) < 2) {
        orb.targetX = Math.random() * width
        orb.targetY = Math.random() * height
      }
    }

    const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
    grad.addColorStop(0, orb.color)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 2. Draw connections between particles
  const maxDistance = 110
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < maxDistance) {
        const lineAlpha = (1 - dist / maxDistance) * 0.12
        ctx.strokeStyle = `rgba(196, 243, 108, ${lineAlpha})`
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }

  // 3. Draw particles & mouse interaction
  for (const p of particles) {
    if (props.animated) {
      p.x += p.vx
      p.y += p.vy

      // Mouse repulsion
      if (mouseX > 0 && mouseY > 0) {
        const mdx = p.x - mouseX
        const mdy = p.y - mouseY
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < 130 && mDist > 0) {
          const force = (130 - mDist) / 130
          p.x += (mdx / mDist) * force * 1.8
          p.y += (mdy / mDist) * force * 1.8
        }
      }

      // Wrap boundaries
      if (p.x < -10)
        p.x = width + 10
      else if (p.x > width + 10)
        p.x = -10
      if (p.y < -10)
        p.y = height + 10
      else if (p.y > height + 10)
        p.y = -10
    }

    ctx.fillStyle = `${p.color}${p.alpha})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop() {
  if (!props.animated)
    return
  draw()
  animationFrameId = requestAnimationFrame(loop)
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function onMouseLeave() {
  mouseX = -1000
  mouseY = -1000
}

watch(
  () => props.animated,
  (val) => {
    cancelAnimationFrame(animationFrameId)
    draw()
    if (val) {
      animationFrameId = requestAnimationFrame(loop)
    }
  },
)

onMounted(() => {
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  if (props.animated) {
    animationFrameId = requestAnimationFrame(loop)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <div class="interactive-bg-wrapper" aria-hidden="true">
    <canvas ref="canvas" class="interactive-bg-canvas" />
    <div class="cyber-grid-overlay" />
    <div class="cyber-vignette" />
  </div>
</template>

<style scoped>
.interactive-bg-wrapper {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.interactive-bg-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.cyber-grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(196, 243, 108, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196, 243, 108, 0.015) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%);
}

.cyber-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent 60%, rgba(17, 19, 15, 0.7) 100%);
}
</style>
