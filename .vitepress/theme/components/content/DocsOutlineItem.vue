<script setup lang="ts">
import type { Header } from 'vitepress'

defineProps<{ headers: Header[]; activeSlug: string | null }>()
defineEmits<{ activate: [] }>()
</script>

<template>
  <ul class="outline-items">
    <li
      v-for="header in headers"
      :key="header.slug"
      :class="{ 'outline-group': header.level === 1 }"
    >
      <a
        :href="header.link"
        class="outline-link"
        :class="{ 'outline-main-title': header.level === 1, active: activeSlug === header.slug }"
        :style="{ '--outline-indent': Math.max(0, header.level - 2) }"
        :aria-current="activeSlug === header.slug ? 'location' : undefined"
        @click="$emit('activate')"
      >
        {{ header.title }}
      </a>
      <DocsOutlineItem
        v-if="header.children.length"
        :headers="header.children"
        :active-slug="activeSlug"
        @activate="$emit('activate')"
      />
    </li>
  </ul>
</template>

<style scoped>
.outline-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.outline-group:not(:first-child) {
  margin-top: var(--pixel-space-m);
}

.outline-link {
  display: block;
  padding: 0.3rem 0.75rem;
  padding-inline-start: calc(0.75rem + var(--outline-indent) * 0.75rem);
  border-left: 2px solid transparent;
  color: var(--pixel-color-text-muted);
  font-size: var(--pixel-font-size-m);
  line-height: 1.5;
  text-decoration: none;
  overflow-wrap: anywhere;
  transition:
    color var(--pixel-transition-fast),
    background-color var(--pixel-transition-fast);
}

.outline-main-title {
  font-family: var(--pixel-font-heading);
  font-size: var(--pixel-font-size-title);
  color: var(--pixel-color-text-solid);
  letter-spacing: 1px;
  padding-block: 0.5rem;
}

.outline-link:hover:not(:focus-visible) {
  color: var(--pixel-color-text-solid);
  background: var(--pixel-sidebar-hover-bg);
}

.outline-link.active {
  color: var(--pixel-brand-light);
  border-left-color: var(--pixel-brand);
  background: var(--pixel-sidebar-active-bg);
}
</style>
