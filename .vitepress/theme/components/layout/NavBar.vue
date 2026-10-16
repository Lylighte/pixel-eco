<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { stripBase } from '../../utils/path'
import { useClickSound } from '../../composables/useClickSound'
import type { NavItem } from '../../types/components'

const { theme, site } = useData()
const route = useRoute()

const { playSound } = useClickSound()

// Parse nav items from VitePress config
const navItems = computed<NavItem[]>(() => {
  const raw = theme.value.nav
  if (!raw || !Array.isArray(raw)) return []
  return raw.map((item: { text?: string; link?: string }) => ({
    name: item.text || '',
    url: item.link || '/',
  }))
})

// Active index tracking
const activeIndex = ref(0)

const updateActiveIndex = (path: string) => {
  const normalized = stripBase(path, site.value.base)
  let bestIdx = 0
  let bestLen = 0
  navItems.value.forEach((item, index) => {
    // Match: exact or prefix (e.g. /news/hello matches /news/)
    if (normalized.startsWith(item.url) && item.url.length > bestLen) {
      bestIdx = index
      bestLen = item.url.length
    }
  })
  activeIndex.value = bestIdx
}

// Watch route changes
watch(
  () => route.path,
  (path) => updateActiveIndex(path),
  { immediate: true },
)

const sliderStyle = computed(() => {
  const count = navItems.value.length
  if (count === 0) return {}
  return {
    width: `${100 / count}%`,
    transform: `translateX(${activeIndex.value * 100}%)`,
    transition: 'transform 0.5s ease',
  }
})
</script>

<template>
  <div v-if="navItems.length > 0" class="nav-container">
    <nav class="nav-bar">
      <a
        v-for="(item, index) in navItems"
        :key="index"
        class="nav-item"
        :href="withBase(item.url)"
        @click="playSound()"
      >
        {{ item.name }}
      </a>

      <div class="slider" :style="sliderStyle">
        <div class="slider-box" />
      </div>
    </nav>
  </div>
</template>

<style lang="css" scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  min-width: max-content;
  gap: 0.5rem;
  user-select: none;
  z-index: var(--pixel-z-nav);
}

.nav-bar {
  height: calc(1rem + 28px);
  display: flex;
  border-radius: 0;
  background-color: var(--pixel-nav-bg);
  border: var(--pixel-nav-border);
  position: relative;
  box-shadow: var(--pixel-nav-shadow);
  opacity: 1;
  overflow: hidden;
}

.nav-item {
  position: relative;
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  z-index: var(--pixel-z-raised);
  transition: color 0.3s ease;
  font-size: var(--pixel-font-size-m);
  color: var(--pixel-color-text);
  text-decoration: none;
  font-family: var(--pixel-font-heading);
}

.nav-item:hover:not(:focus-visible) {
  color: var(--pixel-nav-item-text-hover);
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: var(--pixel-z-base);
  box-sizing: border-box;
  padding: 4px;
}

.slider-box {
  box-sizing: border-box;
  background-color: var(--pixel-nav-slider-bg);
  border-radius: 0;
  border-top: 4px solid var(--pixel-nav-slider-border-top);
  border-bottom: 4px solid var(--pixel-nav-slider-border-bottom);
  height: 100%;
  width: 100%;
  box-shadow: var(--pixel-shadow-soft);
}

@media screen and (max-width: 480px) {
  .nav-item {
    padding: 8px 6px;
    font-size: var(--pixel-font-size-m);
  }
}
</style>
