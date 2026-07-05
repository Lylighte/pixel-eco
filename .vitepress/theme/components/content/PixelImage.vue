<script lang="ts" setup>
import { withBase } from 'vitepress'

withDefaults(
  defineProps<{
    src: string
    alt?: string
    caption?: string
    width?: number
    height?: number
    lazy?: boolean
  }>(),
  {
    alt: '',
    caption: '',
    width: 800,
    height: 600,
    lazy: true,
  },
)
</script>

<template>
  <figure class="pixel-image">
    <img
      :src="withBase(src)"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="lazy ? 'lazy' : undefined"
      class="pixel-image__img"
    >
    <figcaption
      v-if="caption"
      class="pixel-image__caption"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.pixel-image {
  margin: 16px 0;
  text-align: center;
}

.pixel-image__img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  image-rendering: pixelated;
}

.pixel-image__caption {
  margin-top: 8px;
  font-family: var(--pixel-font-code);
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-text-muted);
}
</style>
