import type { BackgroundMode } from './motionContext'
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

const STORAGE_KEY = 'portfolio_bg_mode'

export function usePortfolio() {
  const animated = shallowRef(true)
  const activeSection = shallowRef('home')
  const backgroundMode = ref<BackgroundMode>('stars')

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'stars' || saved === 'matrix' || saved === 'mesh') {
      backgroundMode.value = saved
    }
  }

  function setBackgroundMode(mode: BackgroundMode) {
    backgroundMode.value = mode
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }

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
  return {
    animated,
    activeSection,
    toggleAnimation,
    backgroundMode,
    setBackgroundMode,
  }
}
