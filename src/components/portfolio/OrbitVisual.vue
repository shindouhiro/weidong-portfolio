<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

const props = defineProps<{ animated: boolean }>()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let frame = 0
let observer: ResizeObserver | undefined
let intersection: IntersectionObserver | undefined
let visible = true
let phase = 0
let width = 500
let height = 460

function draw() {
  const context = canvas.value?.getContext('2d')
  if (!context)
    return
  context.clearRect(0, 0, width, height)
  const scale = Math.min(width / 500, height / 460)
  const cx = width * 0.5
  const cy = height * 0.49
  const rotation = -0.58
  for (let i = 0; i < 100; i++) {
    const u = (i / 100) * Math.PI * 2
    context.beginPath()
    for (let j = 0; j <= 160; j++) {
      const v = (j / 160) * Math.PI * 2
      const twist = u + phase
      const radius = 130 + 49 * Math.cos(v)
      const x = radius * Math.cos(twist)
      const y = radius * Math.sin(twist) * 0.6 + Math.sin(v) * 46
      const depth = Math.sin(twist) * Math.cos(v)
      const px = (x * Math.cos(rotation) - y * Math.sin(rotation)) * scale + cx
      const py = (x * Math.sin(rotation) + y * Math.cos(rotation)) * scale + cy
      if (j === 0)
        context.moveTo(px, py)
      else context.lineTo(px + depth * 10 * scale, py)
    }
    const brightness = (Math.sin(u + phase) + 1) / 2
    context.strokeStyle = `rgba(${160 + brightness * 40}, ${200 + brightness * 43}, ${76 + brightness * 26}, ${0.12 + brightness * 0.6})`
    context.lineWidth = 0.75 * scale
    context.stroke()
  }
}

function animate() {
  if (!props.animated || !visible)
    return
  phase += 0.0018
  draw()
  frame = requestAnimationFrame(animate)
}

function restart() {
  cancelAnimationFrame(frame)
  draw()
  if (props.animated && visible)
    frame = requestAnimationFrame(animate)
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
})
onUnmounted(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  intersection?.disconnect()
})
</script>

<template>
  <div class="orbit-visual" aria-hidden="true">
    <div class="orbit-grid" />
    <div class="orbit-glow" />
    <span class="orbit-coordinate coordinate-top">FIG. 001 / INFINITE POSSIBILITIES</span>
    <span class="orbit-cross cross-one">+</span><span class="orbit-cross cross-two">+</span>
    <canvas ref="canvas" class="orbit-canvas" />
    <div class="floating-tag tag-top">
      <span class="status-dot" /> SYSTEM ONLINE
    </div>
    <div class="floating-tag tag-code">
      &lt;/&gt;
    </div>
    <div class="floating-tag tag-bottom">
      BUILD. BREAK. CREATE. <span>↗</span>
    </div>
    <div class="orbit-caption">
      <span>CREATIVE ENGINEERING</span><span>∞</span>
    </div>
  </div>
</template>
