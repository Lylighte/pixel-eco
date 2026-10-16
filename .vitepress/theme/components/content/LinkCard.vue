<template>
  <a
    class="link-card"
    :href="isExternal(link.url) ? link.url : withBase(link.url)"
    :target="isExternal(link.url) ? '_blank' : undefined"
    :rel="isExternal(link.url) ? 'noopener' : undefined"
  >
    <img v-if="link.image" :src="withBase(link.image)" alt="" loading="lazy" class="link-bg" />
    <div class="link-content">
      <p>{{ link.name }}</p>
      <span v-if="link.description">{{ link.description }}</span>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'

const isExternal = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://')
}

defineProps<{
  link: {
    name: string
    url: string
    image?: string
    description?: string
  }
}>()
</script>

<style scoped>
.link-card {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 15rem;
  height: 15rem;
  border-top: 2px solid var(--pixel-brand-light);
  border-left: 2px solid var(--pixel-brand);
  border-right: 2px solid var(--pixel-brand);
  border-bottom: 2px solid var(--pixel-brand-dark);
  background-color: var(--pixel-card-bg);
  box-shadow: var(--pixel-card-shadow);
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.link-card:hover {
  transform: scale(1.05);
}

.link-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.link-content {
  position: relative;
  z-index: var(--pixel-z-raised);
  margin-top: auto;
  padding: 0.5rem 1rem;
  background-color: var(--pixel-linkcard-overlay-bg);
  user-select: none;
}

.link-content p {
  font-family: var(--pixel-font-heading);
  font-size: 1.25rem; /* 20px — Ark Pixel 对齐 */
  font-weight: bold;
  margin: 0;
  color: var(--pixel-linkcard-title-color);
}

.link-content span {
  font-size: 0.85rem;
  color: var(--pixel-color-text-muted);
}
</style>
