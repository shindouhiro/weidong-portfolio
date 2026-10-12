import { onMounted, onUnmounted, shallowRef } from 'vue'

export function usePortfolio() {
  const animated = shallowRef(true)
  const activeSection = shallowRef('home')
  let observer: IntersectionObserver | undefined
  let motionPreference: MediaQueryList | undefined

  function syncMotion() {
    animated.value = !motionPreference?.matches
  }

  function toggleAnimation() {
    animated.value = !animated.value
  }

  onMounted(() => {
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    syncMotion()
    motionPreference.addEventListener('change', syncMotion)
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting)
          activeSection.value = entry.target.id
      }
    }, { rootMargin: '-15% 0px -55% 0px' })
    document.querySelectorAll('main section[id]').forEach(section => observer?.observe(section))
  })
  onUnmounted(() => {
    observer?.disconnect()
    motionPreference?.removeEventListener('change', syncMotion)
  })
  return { animated, activeSection, toggleAnimation }
}
