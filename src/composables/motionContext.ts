import type { InjectionKey, Ref } from 'vue'

export type BackgroundMode = 'stars' | 'matrix' | 'mesh'

export const portfolioMotionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('portfolio-motion')
export const backgroundModeKey: InjectionKey<Ref<BackgroundMode>> = Symbol('background-mode')
