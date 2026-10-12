<script setup lang="ts">
import { ArrowUp } from '@lucide/vue'
import { onMounted, onUnmounted, shallowRef } from 'vue'

defineProps<{
  activeSection: string
}>()

const progress = shallowRef(0)
const showBackTop = shallowRef(false)

function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    progress.value = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)))
  }
  showBackTop.value = scrollTop > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="scroll-hud-container" aria-hidden="true">
    <!-- Top Glowing Laser Beam -->
    <div class="scroll-progress-track">
      <div
        class="scroll-progress-bar"
        :style="{ width: `${progress}%` }"
      >
        <span class="laser-head" />
      </div>
    </div>

    <!-- Floating Sci-Fi HUD Float Pill -->
    <div
      class="scroll-hud-pill mono"
      :class="{ 'is-visible': showBackTop }"
      @click="scrollToTop"
    >
      <div class="hud-status">
        <span class="hud-dot" />
        <span class="hud-text">SYS.{{ activeSection.toUpperCase() }}</span>
      </div>
      <span class="hud-divider">/</span>
      <span class="hud-percent">{{ progress }}%</span>
      <button class="hud-top-btn" aria-label="回到顶部">
        <ArrowUp :size="12" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.scroll-hud-container {
  pointer-events: none;
}

.scroll-progress-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: rgba(196, 243, 108, 0.05);
  z-index: 100;
}

.scroll-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #4ade80, #c4f36c);
  position: relative;
  box-shadow: 0 0 10px rgba(196, 243, 108, 0.7), 0 0 4px #c4f36c;
  transition: width 0.08s linear;
}

.laser-head {
  position: absolute;
  right: 0;
  top: -2px;
  width: 6px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px #ffffff, 0 0 15px var(--accent);
}

.scroll-hud-pill {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 10px;
  letter-spacing: 0.8px;
  background: rgba(24, 27, 21, 0.85);
  border: 1px solid rgba(196, 243, 108, 0.25);
  border-radius: 20px;
  color: #a6b896;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.2s, background 0.2s;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
}

.scroll-hud-pill.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-hud-pill:hover {
  border-color: var(--accent);
  background: rgba(30, 36, 26, 0.95);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(196, 243, 108, 0.25);
}

.hud-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hud-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  animation: pulse-dot 2s infinite ease-in-out;
}

.hud-divider {
  color: rgba(196, 243, 108, 0.3);
}

.hud-percent {
  color: var(--accent);
  font-weight: 600;
}

.hud-top-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(196, 243, 108, 0.15);
  border-radius: 50%;
  color: var(--accent);
  margin-left: 2px;
  padding: 0;
  transition: transform 0.2s;
}

.scroll-hud-pill:hover .hud-top-btn {
  transform: translateY(-2px);
  background: var(--accent);
  color: #11130f;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

@media (max-width: 640px) {
  .scroll-hud-pill {
    bottom: 16px;
    right: 16px;
    padding: 5px 10px;
    font-size: 9px;
  }
}
</style>
