<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    as?: string
    animated?: boolean
    triggerOnHover?: boolean
    autoStart?: boolean
    speed?: number
  }>(),
  {
    as: 'span',
    animated: true,
    triggerOnHover: true,
    autoStart: true,
    speed: 30,
  },
)

const displayText = ref(props.text)
const isGlitching = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const glyphs = '01#%&*+-/=?@_~^<>[]{}ABCDEF'

function scramble() {
  if (!props.animated) {
    displayText.value = props.text
    return
  }

  clearTimeout(timer)
  isGlitching.value = true

  const target = props.text
  const length = target.length
  let iteration = 0

  function frame() {
    displayText.value = target
      .split('')
      .map((char, index) => {
        if (char === ' ' || char === '\n')
          return char
        if (index < iteration) {
          return target[index]
        }
        return glyphs[Math.floor(Math.random() * glyphs.length)]
      })
      .join('')

    if (iteration < length) {
      iteration += 1 / 2
      timer = setTimeout(frame, props.speed)
    }
    else {
      displayText.value = target
      isGlitching.value = false
    }
  }

  frame()
}

function onMouseEnter() {
  if (props.triggerOnHover && !isGlitching.value) {
    scramble()
  }
}

watch(
  () => props.text,
  () => {
    scramble()
  },
)

onMounted(() => {
  if (props.autoStart) {
    setTimeout(scramble, 100)
  }
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <component
    :is="as"
    class="glitch-text"
    :class="{ 'is-glitching': isGlitching }"
    @mouseenter="onMouseEnter"
  >
    {{ displayText }}
  </component>
</template>

<style scoped>
.glitch-text {
  display: inline-block;
  transition: color 0.15s ease;
}

.glitch-text.is-glitching {
  color: var(--accent);
  text-shadow: 0 0 8px rgba(196, 243, 108, 0.4);
}
</style>
