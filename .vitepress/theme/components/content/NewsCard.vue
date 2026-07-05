<script lang="ts" setup>
import { withBase } from 'vitepress'
import PixelButton3D from '../ui/PixelButton3D.vue'

withDefaults(
  defineProps<{
    title: string
    brief?: string
    image?: string
    link: string
    buttonText?: string
  }>(),
  {
    brief: '',
    image: '',
    buttonText: '阅读更多',
  },
)
</script>

<template>
  <div class="overview-card">
    <picture class="overview-picture">
      <img
        v-if="$props.image"
        :src="withBase($props.image)"
        :alt="$props.title"
        loading="lazy"
        class="overview-img"
      />
    </picture>
    <div class="overview-content">
      <a :href="withBase($props.link)" class="overview-title">{{ $props.title }}</a>
      <p class="overview-brief">{{ $props.brief }}</p>
      <a :href="withBase($props.link)" class="overview-button-wrap">
        <PixelButton3D class="overview-button"> {{ $props.buttonText }} &gt; </PixelButton3D>
      </a>
    </div>
  </div>
</template>

<style lang="css" scoped>
.overview-card {
  display: flex;
  width: 100%;
  background-color: var(--pixel-card-bg);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.overview-picture {
  flex-shrink: 0;
  width: 40%;
  min-width: 200px;
  overflow: hidden;
}

.overview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.overview-img:hover {
  transform: scale(1.05);
}

.overview-content {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  flex: 1;
}

.overview-title {
  font-family: var(--pixel-font-heading);
  font-size: 1.25rem; /* 20px — Ark Pixel 对齐 */
  cursor: pointer;
  color: var(--pixel-color-text);
  text-decoration: none;
  user-select: none;
  margin-bottom: 0.5rem;
}

.overview-title:hover {
  color: var(--pixel-brand-light);
}

.overview-brief {
  flex: 1;
  color: var(--pixel-color-text-muted);
  margin: 0 0 1rem 0;
  user-select: none;
}

.overview-button-wrap {
  text-decoration: none;
  align-self: flex-start;
}

.overview-button {
  padding: 0.4rem 1rem;
}

@media screen and (max-width: 600px) {
  .overview-card {
    flex-direction: column;
  }
  .overview-picture {
    width: 100%;
    height: 200px;
  }
}
</style>
