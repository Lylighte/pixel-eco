<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as collections } from '../../../collections.data'
import { stripBase } from '../../utils/path'

const { site } = useData()
const route = useRoute()

const nav = computed(() => collections.sidebar)

const collapsed = ref<Record<string, boolean>>({})

const toggle = (title: string) => {
  collapsed.value[title] = !collapsed.value[title]
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
        <div class="sidebar-group-header" @click="toggle(group.title)">
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
  min-height: calc(100vh - 8rem);
  overflow-y: auto;
}

.sidebar-title {
  font-family: var(--pixel-font-heading);
  font-weight: bold;
  font-size: 1rem;
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

.sidebar-group-header:hover {
  background: var(--pixel-sidebar-hover-bg);
}

.sidebar-arrow {
  font-size: 0.65rem;
  width: 0.75rem;
}

.sidebar-group-name {
  font-family: var(--pixel-font-heading);
  font-size: 0.9rem;
}

.sidebar-items {
  padding-left: 1.5rem;
}

.sidebar-item {
  display: block;
  padding: 0.3rem 1rem;
  font-size: 0.85rem;
  color: var(--pixel-color-text-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.sidebar-item:hover {
  color: var(--pixel-color-text);
}

.sidebar-item.active {
  color: var(--pixel-brand-light);
  border-left-color: var(--pixel-brand);
  background: var(--pixel-sidebar-active-bg);
}

@media screen and (max-width: 768px) {
  .docs-sidebar {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: var(--pixel-sidebar-border);
  }
}
</style>
