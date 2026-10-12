<script setup lang="ts">
import { publicAssetUrl } from '../../utils/publicAsset'

withDefaults(defineProps<{ size?: number }>(), { size: 16 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 19 19" fill="currentColor" aria-hidden="true">
    <use :href="publicAssetUrl('/icons.svg#github-icon')" />
  </svg>
</template>
