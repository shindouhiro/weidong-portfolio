import { shallowRef } from 'vue'

const soundEnabled = shallowRef(false)

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined')
    return null
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      audioCtx = new AudioCtx()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function useSoundFx() {
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    if (soundEnabled.value) {
      playTone(520, 0.08, 'sine', 0.05)
      setTimeout(playTone, 60, 880, 0.12, 'sine', 0.05)
    }
  }

  function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.04) {
    if (!soundEnabled.value)
      return
    try {
      const ctx = getAudioContext()
      if (!ctx)
        return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq * 0.5), ctx.currentTime + duration)

      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)
    }
    catch {
      // Audio not permitted or interrupted
    }
  }

  function playHover() {
    playTone(440, 0.04, 'triangle', 0.015)
  }

  function playClick() {
    playTone(660, 0.06, 'sine', 0.035)
  }

  function playShockwave() {
    playTone(180, 0.25, 'sawtooth', 0.04)
  }

  return {
    soundEnabled,
    toggleSound,
    playHover,
    playClick,
    playShockwave,
  }
}
