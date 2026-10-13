import type { Ref } from 'vue'
import { onMounted, onUnmounted, watch } from 'vue'

const revealSelector = [
  '.section-heading',
  '.project-card',
  '.experience-intro',
  '.timeline-item',
  '.skill-card',
  '.about-art',
  '.about-content',
  '.contact-heading',
  '.contact-bottom',
].join(', ')

export function useScrollReveal(root: Readonly<Ref<HTMLElement | null>>, animated: Readonly<Ref<boolean>>) {
  const elements = new Set<HTMLElement>()
  let observer: IntersectionObserver | undefined
  let mutations: MutationObserver | undefined

  function reveal(element: HTMLElement) {
    element.dataset.revealed = 'true'
  }

  function register(element: HTMLElement) {
    if (elements.has(element))
      return

    elements.add(element)
    const siblings = element.parentElement ? [...element.parentElement.children] : []
    const index = siblings.filter(sibling => sibling.matches(revealSelector)).indexOf(element)
    element.style.setProperty('--reveal-delay', `${Math.max(0, index % 3) * 85}ms`)
    element.dataset.reveal = ''

    // 首屏及关闭动效时直接显示，避免内容闪烁或隐藏。
    if (!animated.value || element.getBoundingClientRect().top < window.innerHeight * 0.94)
      reveal(element)

    observer?.observe(element)
  }

  function scan(element: HTMLElement) {
    if (element.matches(revealSelector))
      register(element)
    element.querySelectorAll<HTMLElement>(revealSelector).forEach(register)
  }

  function onFocus(event: FocusEvent) {
    if (event.target instanceof Element) {
      const element = event.target.closest<HTMLElement>('[data-reveal]')
      if (element)
        reveal(element)
    }
  }

  watch(animated, (enabled) => {
    if (!enabled)
      elements.forEach(reveal)
  })

  onMounted(() => {
    if (!root.value || typeof IntersectionObserver === 'undefined')
      return

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement
        element.dataset.motionVisible = String(entry.isIntersecting)
        if (entry.isIntersecting)
          reveal(element)
      }
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' })

    scan(root.value)
    root.value.addEventListener('focusin', onFocus)

    // 分类切换后只处理新增内容，避免重新隐藏已阅读的卡片。
    mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement)
            scan(node)
        }
      }
      for (const element of elements) {
        if (!root.value?.contains(element)) {
          observer?.unobserve(element)
          elements.delete(element)
        }
      }
    })
    mutations.observe(root.value, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    mutations?.disconnect()
    root.value?.removeEventListener('focusin', onFocus)
    elements.clear()
  })
}
