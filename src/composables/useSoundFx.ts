import { shallowRef } from 'vue'

export interface AudioImpulse {
  strength: number
  frequency: number
  timestamp: number
}

const soundEnabled = shallowRef(false)
const audioImpulse = shallowRef<AudioImpulse | null>(null)

let audioCtx: AudioContext | null = null

function triggerImpulse(strength: number, frequency: number) {
  audioImpulse.value = {
    strength,
    frequency,
    timestamp: performance.now(),
  }
}

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
      triggerImpulse(0.6, 880)
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
    triggerImpulse(0.2, 440)
  }

  function playClick() {
    playTone(660, 0.06, 'sine', 0.035)
    triggerImpulse(0.45, 660)
  }

  function playShockwave() {
    playTone(180, 0.25, 'sawtooth', 0.04)
    triggerImpulse(1.0, 180)
  }

  function playModeSwitch() {
    if (soundEnabled.value) {
      try {
        const ctx = getAudioContext()
        if (ctx) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(320, ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.12)
          gain.gain.setValueAtTime(0.04, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.15)
        }
      }
      catch {
        // Audio interrupted
      }
    }
    triggerImpulse(0.85, 880)
  }

  return {
    soundEnabled,
    audioImpulse,
    toggleSound,
    playHover,
    playClick,
    playShockwave,
    playModeSwitch,
  }
}
