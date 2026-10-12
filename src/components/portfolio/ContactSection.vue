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
import { onUnmounted, shallowRef } from 'vue'
import Github from './GithubIcon.vue'

const copyMessage = shallowRef('')
const copied = shallowRef(false)
let timeout: ReturnType<typeof setTimeout> | undefined
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    copyMessage.value = '邮箱已复制，期待你的来信。'
  }
  catch {
    copyMessage.value = '复制失败，请选择下方邮箱地址复制，或点击发送邮件。'
  }
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    copied.value = false
    copyMessage.value = ''
  }, 4000)
}
onUnmounted(() => clearTimeout(timeout))
</script>

<template>
  <section id="contact" class="contact-section page-width">
    <span class="section-eyebrow mono">05 / WHAT'S NEXT?</span>
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
          class="button button-primary"
        >说声你好 <ArrowUpRight :size="18" /></a>
      </div>
    </div>
    <div class="contact-bottom">
      <div class="contact-email-wrap">
        <a
          id="contact-email-address"
          class="contact-email"
          :href="`mailto:${profile.email}`"
        >{{ profile.email }} <ArrowUpRight :size="23" /></a><button
          id="contact-copy-email"
          class="icon-button"
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
        <a id="contact-phone" :href="`tel:${profile.phone}`"><Phone :size="15" />{{ profile.phone }}</a><a
          id="contact-github"
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        ><Github :size="16" />GitHub <ArrowUpRight :size="12" /></a><a
          id="contact-website"
          :href="profile.website"
          target="_blank"
          rel="noopener noreferrer"
        ><Globe :size="16" />博客 <ArrowUpRight :size="12" /></a>
      </div>
    </div>
  </section>
  <footer class="site-footer page-width">
    <span class="footer-signature">w<span>.</span></span><span class="footer-copy">© {{ new Date().getFullYear() }} 吴伟东<span>用热爱构建，以好奇驱动。</span></span><span class="footer-built mono"><Mail :size="12" /> MADE WITH CODE & CURIOSITY</span><a id="footer-back-top" href="#home" class="back-top">回到顶部 <ArrowUpRight :size="15" /></a>
  </footer>
</template>
