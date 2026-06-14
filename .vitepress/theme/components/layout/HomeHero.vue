<script lang="ts" setup>
import { withBase } from 'vitepress'

defineProps({
  title: { type: String, default: 'Your Organization' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  logo: { type: String, default: '/logo.png' },
  background: { type: String, default: '' },
})
</script>

<template>
  <div class="hero">
    <img
      v-if="$props.background"
      :src="withBase($props.background)"
      alt="hero"
      class="hero-image"
      width="1200"
      height="640"
      fetchpriority="high"
    />
    <div v-else class="hero-gradient"></div>
    <div class="hero-overlay">
      <div class="logo-area">
        <img v-if="$props.logo" :src="withBase($props.logo)" alt="logo" class="hero-logo" width="80" height="80" />
        <h1 class="hero-title">{{ $props.title }}</h1>
        <p v-if="$props.subtitle" class="hero-subtitle">{{ $props.subtitle }}</p>
        <p v-if="$props.description" class="hero-desc">{{ $props.description }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.hero {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-bottom: 3rem;
  min-height: 40rem;
  position: relative;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: var(--pixel-hero-gradient);
}

.hero-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 40rem;
  display: flex;
  align-items: center;
}

.logo-area {
  width: var(--pixel-hero-content-width, 40%);
  min-width: var(--pixel-hero-content-min-width, 25rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  padding-left: var(--pixel-hero-padding-inline);
  padding-right: var(--pixel-hero-padding-inline);
  background-color: var(--pixel-hero-overlay);
  backdrop-filter: blur(2px);
  justify-content: center;
  align-self: stretch;
  text-shadow: var(--pixel-shadow-text);
  animation: fade-in-left 0.8s ease;
}

.hero-logo {
  height: 5rem;
  width: auto;
  user-select: none;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--pixel-hero-title-color);
  margin: 0;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--pixel-brand-light);
  margin: 0.5rem 0 0 0;
}

.hero-desc {
  font-size: 1.15rem;
  font-weight: bold;
  margin-top: 1rem;
  color: var(--pixel-color-text);
}

@media screen and (max-width: 623px) {
  .logo-area {
    width: 100%;
    min-width: unset;
  }
}
</style>
