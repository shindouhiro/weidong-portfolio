<script setup lang="ts">
defineProps<{
  tech: string[]
  animated: boolean
}>()
</script>

<template>
  <div class="tech-marquee-container" aria-label="主要技术栈">
    <div class="marquee-gradient-fade left" />
    <div class="marquee-label-badge mono">
      <span class="pulse-beacon" />
      <span>TECH TOOLKIT</span>
    </div>

    <div
      class="marquee-track"
      :class="{ 'is-paused': !animated }"
    >
      <div class="marquee-group">
        <span
          v-for="item in tech"
          :key="`g1-${item}`"
          class="tech-chip"
        >
          <span class="chip-glow" />
          <span class="chip-name">{{ item }}</span>
          <span class="chip-symbol">✳</span>
        </span>
      </div>
      <div class="marquee-group" aria-hidden="true">
        <span
          v-for="item in tech"
          :key="`g2-${item}`"
          class="tech-chip"
        >
          <span class="chip-glow" />
          <span class="chip-name">{{ item }}</span>
          <span class="chip-symbol">✳</span>
        </span>
      </div>
    </div>
    <div class="marquee-gradient-fade right" />
  </div>
</template>

<style scoped>
.tech-marquee-container {
  position: relative;
  border-block: 1px solid var(--border);
  background: rgba(23, 26, 20, 0.7);
  backdrop-filter: blur(8px);
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 64px;
}

.marquee-gradient-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 90px;
  z-index: 10;
  pointer-events: none;
}

.marquee-gradient-fade.left {
  left: 0;
  background: linear-gradient(90deg, #11130f 20%, transparent);
}

.marquee-gradient-fade.right {
  right: 0;
  background: linear-gradient(270deg, #11130f 20%, transparent);
}

.marquee-label-badge {
  position: relative;
  z-index: 12;
  margin-left: 28px;
  margin-right: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 4px;
  background: rgba(30, 36, 24, 0.9);
  border: 1px solid rgba(196, 243, 108, 0.25);
  color: var(--accent);
  font-size: 8px;
  letter-spacing: 1.5px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.pulse-beacon {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse-dot 1.8s infinite;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll-marquee 28s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

.marquee-track.is-paused {
  animation-play-state: paused;
}

.marquee-group {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 20px;
}

.tech-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(28, 34, 23, 0.6);
  border: 1px solid rgba(75, 92, 57, 0.4);
  color: #cdd8c1;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
  cursor: default;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1),
              border-color 0.2s,
              background-color 0.2s,
              color 0.2s,
              box-shadow 0.2s;
}

.tech-chip:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  background: rgba(38, 48, 30, 0.9);
  color: #ffffff;
  box-shadow: 0 0 16px rgba(196, 243, 108, 0.25);
}

.chip-symbol {
  color: #79945a;
  font-size: 10px;
  transition: transform 0.3s;
}

.tech-chip:hover .chip-symbol {
  color: var(--accent);
  transform: rotate(90deg);
}

@keyframes scroll-marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.7);
  }
}

@media (max-width: 768px) {
  .marquee-label-badge {
    margin-left: 12px;
    margin-right: 8px;
    padding: 5px 10px;
    font-size: 7px;
  }
  .tech-chip {
    padding: 6px 12px;
    font-size: 11px;
    gap: 8px;
  }
}
</style>
