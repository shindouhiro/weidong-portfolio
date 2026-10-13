import type { InjectionKey, Ref } from 'vue'

export const portfolioMotionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('portfolio-motion')
