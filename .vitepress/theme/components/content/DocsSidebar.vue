<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as collections } from '../../../collections.data'
import { stripBase } from '../../utils/path'
import { useClickSound } from '../../composables/useClickSound'

const { site } = useData()
const route = useRoute()
const { playSound } = useClickSound()

const nav = computed(() => collections.sidebar)

const collapsed = ref<Record<string, boolean>>({})

const toggle = (title: string) => {
  collapsed.value[title] = !collapsed.value[title]
  playSound()
}

const isActive = (link: string) => {
  const path = stripBase(route.path, site.value.base)
  return path === link || path === link + '.html'
}
</script>

<template>
  <nav class="docs-sidebar">
    <div class="sidebar-title">文档</div>
    <template v-for="group in nav" :key="group.title">
      <div class="sidebar-group">
        <div
          class="sidebar-group-header"
          role="button"
          tabindex="0"
          :aria-expanded="!collapsed[group.title]"
          @click="toggle(group.title)"
          @keydown.enter.prevent="toggle(group.title)"
          @keydown.space.prevent
          @keyup.space.prevent="toggle(group.title)"
        >
          <span class="sidebar-arrow">{{ collapsed[group.title] ? '▶' : '▼' }}</span>
          <span class="sidebar-group-name">{{ group.title }}</span>
        </div>
        <div v-if="!collapsed[group.title]" class="sidebar-items">
          <a
            v-for="item in group.items"
            :key="item.link"
            :href="withBase(item.link)"
            class="sidebar-item"
            :class="{ active: isActive(item.link) }"
            @click="playSound()"
          >
            {{ item.text }}
          </a>
        </div>
      </div>
    </template>
  </nav>
</template>

<style scoped>
.docs-sidebar {
  width: 14rem;
  flex-shrink: 0;
  padding: 1rem 0;
  background: var(--pixel-sidebar-bg);
  border-right: var(--pixel-sidebar-border);
  min-height: calc(100vh - var(--pixel-nav-height) - var(--pixel-space-l));
  overflow-y: auto;
}

.sidebar-title {
  font-family: var(--pixel-font-heading);
  font-size: var(--pixel-font-size-m);
  padding: 0 1rem 0.75rem 1rem;
  color: var(--pixel-brand-light);
  border-bottom: 1px solid var(--pixel-gray);
  margin-bottom: 0.5rem;
}

.sidebar-group-header {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 1rem;
  cursor: pointer;
  user-select: none;
  color: var(--pixel-color-text-muted);
}

.sidebar-group-header:hover:not(:focus-visible) {
  background: var(--pixel-sidebar-hover-bg);
}

.sidebar-arrow {
  font-size: var(--pixel-font-size-s);
  width: 0.75rem;
}

.sidebar-group-name {
  font-family: var(--pixel-font-heading);
  font-size: var(--pixel-font-size-m);
}

.sidebar-items {
  padding-left: 1.5rem;
}

.sidebar-item {
  display: block;
  padding: 0.3rem 1rem;
  font-size: var(--pixel-font-size-m);
  color: var(--pixel-color-text-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.sidebar-item:hover:not(:focus-visible) {
  color: var(--pixel-color-text);
}

.sidebar-item.active {
  color: var(--pixel-brand-light);
  border-left-color: var(--pixel-brand);
  background: var(--pixel-sidebar-active-bg);
}

@media screen and (max-width: var(--pixel-break-layout)) {
  .docs-sidebar {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: var(--pixel-sidebar-border);
  }
}
</style>
