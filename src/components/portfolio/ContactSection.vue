<script setup lang="ts">
import {
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  Mail,
  Phone,
} from '@lucide/vue'
import { profile } from '@resume/content'
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import GlitchText from '../effects/GlitchText.vue'
import Github from './GithubIcon.vue'

const props = withDefaults(defineProps<{ animated?: boolean }>(), {
  animated: true,
})

const contactRef = useTemplateRef<HTMLElement>('contactRef')
const isVisible = shallowRef(false)
const motionStyle = computed(() => ({
  '--contact-motion-state': props.animated && isVisible.value ? 'running' : 'paused',
}))
const copyMessage = shallowRef('')
const copied = shallowRef(false)
let timeout: ReturnType<typeof setTimeout> | undefined
let visibilityObserver: IntersectionObserver | undefined

onMounted(() => {
  if (!contactRef.value)
    return

  visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible.value = entry?.isIntersecting ?? false
  })
  visibilityObserver.observe(contactRef.value)
})

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    copyMessage.value = '邮箱已复制，期待你的来信。'
  }
  catch {
    copied.value = false
    copyMessage.value = '复制失败，请选择下方邮箱地址复制，或点击发送邮件。'
  }
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    copied.value = false
    copyMessage.value = ''
  }, 4000)
}

onUnmounted(() => {
  clearTimeout(timeout)
  visibilityObserver?.disconnect()
})
</script>

<template>
  <section
    id="contact"
    ref="contactRef"
    class="contact-section page-width"
    :class="{ 'contact-motion-disabled': !animated }"
    :style="motionStyle"
  >
    <div class="contact-atmosphere" aria-hidden="true">
      <span class="contact-outline">LET’S BUILD</span>
      <span class="contact-aurora contact-aurora-green" />
      <span class="contact-aurora contact-aurora-cyan" />
      <span class="contact-orbit contact-orbit-outer" />
      <span class="contact-orbit contact-orbit-inner" />
      <span class="contact-scan" />
    </div>
    <span class="section-eyebrow mono">
      <GlitchText text="05 / WHAT'S NEXT?" />
    </span>
    <div class="contact-heading">
      <h2>下一个精彩，<br />一起<span>构建。</span><sup>↗</sup></h2>
      <div class="contact-description">
        <span class="contact-star" aria-hidden="true">✳</span>
        <p>
          一个想法、一场交流，或一次合作。<br />好的事情，总是从一句你好开始。
        </p>
        <a
          id="contact-send-email"
          :href="`mailto:${profile.email}`"
          class="button button-primary shimmer-button"
        >说声你好 <ArrowUpRight :size="18" /></a>
      </div>
    </div>
    <div class="contact-bottom">
      <div class="contact-email-wrap">
        <a
          id="contact-email-address"
          class="contact-email"
          :href="`mailto:${profile.email}`"
        >
          {{ profile.email }} <ArrowUpRight :size="23" />
        </a>
        <button
          id="contact-copy-email"
          class="icon-button contact-copy-button"
          :class="{ 'is-copied': copied }"
          :aria-label="copied ? '邮箱已复制' : '复制邮箱地址'"
          @click="copyEmail"
        >
          <Check v-if="copied" :size="18" /><Copy v-else :size="18" />
        </button>
        <p class="copy-feedback" role="status">
          {{ copyMessage }}
        </p>
      </div>
      <div class="contact-other">
        <a id="contact-phone" :href="`tel:${profile.phone}`"><Phone :size="15" />{{ profile.phone }}</a>
        <a
          id="contact-github"
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        ><Github :size="16" />GitHub <ArrowUpRight :size="12" /></a>
        <a
          id="contact-website"
          :href="profile.website"
          target="_blank"
          rel="noopener noreferrer"
        ><Globe :size="16" />作品演示 <ArrowUpRight :size="12" /></a>
      </div>
    </div>
  </section>
  <footer class="site-footer page-width">
    <span class="footer-signature">w<span>.</span></span>
    <span class="footer-copy">© {{ new Date().getFullYear() }} 吴伟东<span>用热爱构建，以好奇驱动。</span></span>
    <span class="footer-built mono"><Mail :size="12" /> MADE WITH CODE & CURIOSITY</span>
    <a id="footer-back-top" href="#home" class="back-top">回到顶部 <ArrowUpRight :size="15" /></a>
  </footer>
</template>

<style scoped>
.contact-section {
  position: relative;
  isolation: isolate;
}

.contact-atmosphere {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  mask-image: linear-gradient(transparent, #000 12%, #000 85%, transparent);
}

.contact-outline {
  position: absolute;
  top: 2%;
  left: -0.01em;
  width: 100%;
  color: transparent;
  -webkit-text-stroke: 1px rgb(196 255 135 / 13%);
  font-size: clamp(60px, 12.8vw, 176px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.065em;
  white-space: nowrap;
}

.contact-aurora {
  position: absolute;
  width: 75%;
  height: 70%;
  border-radius: 50%;
  animation: contact-aurora-drift 14s ease-in-out infinite alternate;
  animation-play-state: var(--contact-motion-state, paused);
}

.contact-aurora-green {
  top: 12%;
  left: -18%;
  background: radial-gradient(ellipse, rgb(150 239 72 / 12%), transparent 68%);
}

.contact-aurora-cyan {
  top: 14%;
  right: -12%;
  background: radial-gradient(ellipse, rgb(75 224 180 / 9%), transparent 68%);
  animation-duration: 19s;
  animation-direction: alternate-reverse;
}

.contact-orbit {
  position: absolute;
  top: 6%;
  left: 25%;
  width: 72%;
  height: 80%;
  border: 1px solid rgb(164 229 126 / 12%);
  border-radius: 50%;
  transform: rotate(-18deg);
}

.contact-orbit::after {
  position: absolute;
  inset: -1px;
  border: 1px solid transparent;
  border-top-color: rgb(190 255 127 / 40%);
  border-radius: inherit;
  content: '';
  animation: contact-orbit-travel 28s linear infinite;
  animation-play-state: var(--contact-motion-state, paused);
}

.contact-orbit-inner {
  top: 16%;
  left: 32%;
  width: 59%;
  height: 61%;
  border-color: rgb(100 209 190 / 10%);
  transform: rotate(14deg);
}

.contact-orbit-inner::after {
  border-top-color: rgb(100 209 190 / 24%);
  animation-duration: 38s;
  animation-direction: reverse;
}

.contact-scan {
  position: absolute;
  inset: 0;
  border-right: 1px solid rgb(198 255 139 / 35%);
  opacity: 0;
  mask-image: linear-gradient(transparent 15%, #000, transparent 85%);
  animation: contact-scan-pass 12s ease-in-out infinite;
  animation-play-state: var(--contact-motion-state, paused);
}

.contact-copy-button {
  position: relative;
  transition: color 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
}

.contact-copy-button.is-copied {
  color: #14210b;
  background: var(--accent);
  box-shadow: 0 0 24px rgb(190 255 127 / 25%);
}

.contact-copy-button.is-copied::after {
  position: absolute;
  inset: -2px;
  border: 1px solid var(--accent);
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  content: '';
  animation: contact-copy-pulse 700ms ease-out;
  animation-play-state: var(--contact-motion-state, paused);
}

@keyframes contact-aurora-drift {
  from {
    transform: translate3d(-4%, 2%, 0) scale(0.9);
    opacity: 0.65;
  }
  to {
    transform: translate3d(10%, -6%, 0) scale(1.12);
    opacity: 1;
  }
}

@keyframes contact-orbit-travel {
  to {
    transform: rotate(360deg);
  }
}

@keyframes contact-scan-pass {
  0%, 15% {
    transform: translateX(-100%);
    opacity: 0;
  }
  22%, 65% {
    opacity: 1;
  }
  75%, 100% {
    transform: translateX(0);
    opacity: 0;
  }
}

@keyframes contact-copy-pulse {
  from {
    opacity: 0.7;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.7);
  }
}

.contact-motion-disabled .contact-copy-button,
.contact-motion-disabled .contact-copy-button::after {
  transition: none;
  animation: none;
}

@media (max-width: 640px) {
  .contact-outline {
    top: 4%;
    font-size: 14vw;
  }

  .contact-orbit {
    left: -10%;
    width: 120%;
    height: 70%;
  }

  .contact-orbit-inner {
    top: 18%;
    left: 8%;
    width: 90%;
    height: 46%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-aurora,
  .contact-orbit::after,
  .contact-scan,
  .contact-copy-button::after {
    animation: none;
  }

  .contact-copy-button {
    transition: none;
  }
}
</style>
