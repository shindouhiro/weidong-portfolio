<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import type { BackgroundMode } from '../../composables/motionContext'
import { useSoundFx } from '../../composables/useSoundFx'

const props = withDefaults(
  defineProps<{
    animated: boolean
    mode?: BackgroundMode
  }>(),
  {
    mode: 'stars',
  },
)

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

interface MatrixColumn {
  x: number
  y: number
  speed: number
  length: number
  chars: string[]
  nextChange: number
}

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const { audioImpulse } = useSoundFx()

let animationFrameId = 0
let width = 0
let height = 0
let mouseX = -1000
let mouseY = -1000
let lastTime = 0

// 音频物理冲量能量 (0.0 ~ 2.0，自然平滑衰减)
let impulseEnergy = 0

// 量子光幕扫描过场 (0.0 ~ 1.0)
let transitionProgress = 1
let transitionOldMode: BackgroundMode = 'stars'
let transitionNewMode: BackgroundMode = 'stars'

// --- 模式 1: Cosmic Stars 状态 ---
const particles: Particle[] = []
const orbs: GlowOrb[] = []
const starColors = [
  'rgba(196, 243, 108, ', // accent lime
  'rgba(74, 222, 128, ', // emerald
  'rgba(56, 189, 248, ', // cyan
]

// --- 模式 2: Matrix Rain 状态 ---
const matrixCols: MatrixColumn[] = []
const MATRIX_CHARS = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ<>{}/*+~#%'

// --- 模式 3: Energy Mesh 状态 ---
let meshTime = 0
let meshRipplePhase = 0

function randomChar(): string {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
}

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
      color: starColors[Math.floor(Math.random() * starColors.length)],
    })
  }
}

function initMatrix() {
  matrixCols.length = 0
  const colWidth = 22
  const colCount = Math.floor(width / colWidth) + 1

  for (let i = 0; i < colCount; i++) {
    const len = Math.floor(Math.random() * 16) + 12
    const chars: string[] = []
    for (let c = 0; c < len; c++) {
      chars.push(randomChar())
    }
    matrixCols.push({
      x: i * colWidth + 4,
      y: (Math.random() * -height) * 1.2,
      speed: Math.random() * 2.2 + 1.4,
      length: len,
      chars,
      nextChange: Math.random() * 20,
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

  initParticles()
  initOrbs()
  initMatrix()
  draw()
}

// ---------------- 策略 1: 星轨粒子 ----------------
function drawStars(ctx: CanvasRenderingContext2D, _dt: number, alphaMultiplier = 1) {
  if (alphaMultiplier <= 0)
    return

  ctx.save()
  ctx.globalAlpha = alphaMultiplier

  // 1. 光团
  for (const orb of orbs) {
    if (props.animated) {
      orb.x += (orb.targetX - orb.x) * orb.speed
      orb.y += (orb.targetY - orb.y) * orb.speed
      if (Math.abs(orb.targetX - orb.x) < 2 && Math.abs(orb.targetY - orb.y) < 2) {
        orb.targetX = Math.random() * width
        orb.targetY = Math.random() * height
      }
    }
    const currentRadius = orb.radius * (1 + impulseEnergy * 0.15)
    const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentRadius)
    grad.addColorStop(0, orb.color)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 2. 粒子连线
  const maxDistance = 110 + impulseEnergy * 25
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < maxDistance) {
        const lineAlpha = (1 - dist / maxDistance) * (0.12 + impulseEnergy * 0.15)
        ctx.strokeStyle = `rgba(196, 243, 108, ${lineAlpha})`
        ctx.lineWidth = 0.6 + impulseEnergy * 0.4
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }

  // 3. 粒子运动与排斥
  for (const p of particles) {
    if (props.animated) {
      const speedMult = 1 + impulseEnergy * 0.8
      p.x += p.vx * speedMult
      p.y += p.vy * speedMult

      if (mouseX > 0 && mouseY > 0) {
        const mdx = p.x - mouseX
        const mdy = p.y - mouseY
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < 140 && mDist > 0) {
          const force = (140 - mDist) / 140
          p.x += (mdx / mDist) * force * (2.2 + impulseEnergy * 2.0)
          p.y += (mdy / mDist) * force * (2.2 + impulseEnergy * 2.0)
        }
      }

      if (p.x < -10)
        p.x = width + 10
      else if (p.x > width + 10)
        p.x = -10
      if (p.y < -10)
        p.y = height + 10
      else if (p.y > height + 10)
        p.y = -10
    }

    const currentRadius = p.radius * (1 + impulseEnergy * 0.4)
    ctx.fillStyle = `${p.color}${Math.min(1, p.alpha + impulseEnergy * 0.3)})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

// ---------------- 策略 2: 黑客矩阵雨 ----------------
function drawMatrix(ctx: CanvasRenderingContext2D, dt: number, alphaMultiplier = 1) {
  if (alphaMultiplier <= 0)
    return

  ctx.save()
  ctx.globalAlpha = alphaMultiplier
  ctx.font = '13px "Outfit", monospace'
  ctx.textAlign = 'center'

  const charHeight = 18

  for (const col of matrixCols) {
    if (props.animated) {
      const fallSpeed = (col.speed + impulseEnergy * 4.5) * (dt * 60)
      col.y += fallSpeed
      col.nextChange -= dt * 60
      if (col.nextChange <= 0) {
        const idx = Math.floor(Math.random() * col.chars.length)
        col.chars[idx] = randomChar()
        col.nextChange = Math.random() * 15 + 5
      }

      // 触底重置到顶部随机位置
      if (col.y - col.length * charHeight > height) {
        col.y = -Math.random() * 120
        col.speed = Math.random() * 2.2 + 1.4
      }
    }

    // 鼠标水平力场推开
    let offsetX = 0
    if (mouseX > 0 && mouseY > 0) {
      const distToMouse = Math.abs(col.x - mouseX)
      if (distToMouse < 100) {
        const force = (100 - distToMouse) / 100
        offsetX = (col.x < mouseX ? -1 : 1) * force * 24
      }
    }

    const drawX = col.x + offsetX

    for (let i = 0; i < col.length; i++) {
      const charY = col.y - i * charHeight
      if (charY < -20 || charY > height + 20)
        continue

      const isHead = i === 0
      const ratio = 1 - i / col.length

      if (isHead) {
        ctx.fillStyle = impulseEnergy > 0.4 ? '#ffffff' : 'rgba(230, 255, 180, 0.95)'
        ctx.shadowColor = 'rgba(196, 243, 108, 0.8)'
        ctx.shadowBlur = 8 + impulseEnergy * 6
      }
      else {
        ctx.shadowBlur = 0
        const alpha = Math.min(1, (ratio * 0.65 + impulseEnergy * 0.25))
        ctx.fillStyle = `rgba(100, 230, 120, ${alpha})`
      }

      ctx.fillText(col.chars[i] || '0', drawX, charY)
    }
  }

  ctx.restore()
}

// ---------------- 策略 3: 赛博 3D 能量网格 ----------------
function drawMesh(ctx: CanvasRenderingContext2D, dt: number, alphaMultiplier = 1) {
  if (alphaMultiplier <= 0)
    return

  ctx.save()
  ctx.globalAlpha = alphaMultiplier

  if (props.animated) {
    meshTime += dt * 1.2
    meshRipplePhase += dt * (3.0 + impulseEnergy * 4.0)
  }

  // 视平线与 3D 透视参数
  const horizonY = height * 0.42
  const gridWidth = width * 1.5
  const gridStartX = (width - gridWidth) / 2
  const rows = 28
  const cols = 36

  ctx.lineWidth = 1 + impulseEnergy * 0.6

  // 1. 绘制纵向线条（向透视消失点汇聚）
  for (let c = 0; c <= cols; c++) {
    const colRatio = c / cols
    const bottomX = gridStartX + gridWidth * colRatio
    const topX = width * 0.5 + (bottomX - width * 0.5) * 0.08

    ctx.beginPath()
    for (let r = 0; r <= rows; r++) {
      const rowRatio = r / rows
      // 深度透视曲线
      const depth = Math.pow(rowRatio, 1.8)
      const px = topX + (bottomX - topX) * depth
      const baseY = horizonY + (height - horizonY) * depth

      // 正弦能量波与音频涟漪
      const wave = Math.sin(c * 0.35 + meshTime) * Math.cos(r * 0.45 + meshTime * 0.8) * 16 * depth

      let mouseElevation = 0
      if (mouseX > 0 && mouseY > 0) {
        const mDist = Math.hypot(px - mouseX, baseY - mouseY)
        if (mDist < 160) {
          mouseElevation = (1 - mDist / 160) * -22 * depth
        }
      }

      const rippleDist = Math.hypot(px - width * 0.5, baseY - height * 0.7)
      const rippleWave = Math.sin(rippleDist * 0.035 - meshRipplePhase) * impulseEnergy * 18 * depth

      const finalY = baseY + wave + mouseElevation + rippleWave

      if (r === 0)
        ctx.moveTo(px, finalY)
      else
        ctx.lineTo(px, finalY)
    }

    const colGlow = Math.abs(colRatio - 0.5)
    ctx.strokeStyle = `rgba(196, 243, 108, ${Math.max(0.04, (0.35 - colGlow * 0.3) * (0.5 + impulseEnergy * 0.5))})`
    ctx.stroke()
  }

  // 2. 绘制横向线条
  for (let r = 1; r <= rows; r++) {
    const rowRatio = r / rows
    const depth = Math.pow(rowRatio, 1.8)
    const baseY = horizonY + (height - horizonY) * depth

    ctx.beginPath()
    for (let c = 0; c <= cols; c++) {
      const colRatio = c / cols
      const bottomX = gridStartX + gridWidth * colRatio
      const topX = width * 0.5 + (bottomX - width * 0.5) * 0.08
      const px = topX + (bottomX - topX) * depth

      const wave = Math.sin(c * 0.35 + meshTime) * Math.cos(r * 0.45 + meshTime * 0.8) * 16 * depth

      let mouseElevation = 0
      if (mouseX > 0 && mouseY > 0) {
        const mDist = Math.hypot(px - mouseX, baseY - mouseY)
        if (mDist < 160) {
          mouseElevation = (1 - mDist / 160) * -22 * depth
        }
      }

      const rippleDist = Math.hypot(px - width * 0.5, baseY - height * 0.7)
      const rippleWave = Math.sin(rippleDist * 0.035 - meshRipplePhase) * impulseEnergy * 18 * depth

      const finalY = baseY + wave + mouseElevation + rippleWave

      if (c === 0)
        ctx.moveTo(px, finalY)
      else
        ctx.lineTo(px, finalY)
    }

    const lineAlpha = (rowRatio * 0.45 + impulseEnergy * 0.3) * (r === rows ? 0.7 : 1)
    ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.85, lineAlpha)})`
    ctx.stroke()
  }

  // 3. 远端地平线发光体
  const horizonGlow = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 30)
  horizonGlow.addColorStop(0, 'rgba(0, 0, 0, 0)')
  horizonGlow.addColorStop(0.6, `rgba(196, 243, 108, ${0.12 + impulseEnergy * 0.2})`)
  horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = horizonGlow
  ctx.fillRect(0, horizonY - 40, width, 70)

  ctx.restore()
}

// ---------------- 量子激光扫描过渡线 ----------------
function drawQuantumScan(ctx: CanvasRenderingContext2D, progress: number) {
  const scanY = progress * height

  // 1. 扫描光束
  const grad = ctx.createLinearGradient(0, scanY - 35, 0, scanY + 15)
  grad.addColorStop(0, 'rgba(196, 243, 108, 0)')
  grad.addColorStop(0.6, 'rgba(196, 243, 108, 0.25)')
  grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.75)')
  grad.addColorStop(1, 'rgba(56, 189, 248, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, scanY - 35, width, 50)

  // 2. 核心激光亮线
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(196, 243, 108, 1)'
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.moveTo(0, scanY)
  ctx.lineTo(width, scanY)
  ctx.stroke()
  ctx.shadowBlur = 0
}

function renderMode(ctx: CanvasRenderingContext2D, mode: BackgroundMode, dt: number, alpha: number) {
  if (mode === 'stars')
    drawStars(ctx, dt, alpha)
  else if (mode === 'matrix')
    drawMatrix(ctx, dt, alpha)
  else if (mode === 'mesh')
    drawMesh(ctx, dt, alpha)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas)
    return
  const ctx = canvas.getContext('2d')
  if (!ctx || width <= 0 || height <= 0)
    return

  const now = performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now

  // 能量自然平滑衰减
  if (impulseEnergy > 0) {
    impulseEnergy = Math.max(0, impulseEnergy - dt * 2.2)
  }

  ctx.clearRect(0, 0, width, height)

  // 判断是否处于量子过渡态
  if (transitionProgress < 1) {
    if (props.animated) {
      transitionProgress += dt / 0.35 // 约 350ms 完成
    }
    else {
      transitionProgress = 1
    }

    if (transitionProgress >= 1) {
      transitionProgress = 1
      renderMode(ctx, transitionNewMode, dt, 1)
    }
    else {
      // 交叉渲染旧模式与新模式
      renderMode(ctx, transitionOldMode, dt, 1 - transitionProgress)
      renderMode(ctx, transitionNewMode, dt, transitionProgress)
      drawQuantumScan(ctx, transitionProgress)
    }
  }
  else {
    renderMode(ctx, props.mode, dt, 1)
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

// 监听模式变化触发量子过渡
watch(
  () => props.mode,
  (newMode, oldMode) => {
    if (oldMode && newMode !== oldMode) {
      transitionOldMode = oldMode
      transitionNewMode = newMode
      transitionProgress = 0
    }
    draw()
  },
)

// 监听动画启停
watch(
  () => props.animated,
  (val) => {
    cancelAnimationFrame(animationFrameId)
    draw()
    if (val) {
      lastTime = performance.now()
      animationFrameId = requestAnimationFrame(loop)
    }
  },
)

// 监听音频物理冲量触发共振
watch(audioImpulse, (impulse) => {
  if (impulse && props.animated) {
    impulseEnergy = Math.min(2.0, impulseEnergy + impulse.strength * 1.3)
  }
})

onMounted(() => {
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  if (props.animated) {
    lastTime = performance.now()
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
