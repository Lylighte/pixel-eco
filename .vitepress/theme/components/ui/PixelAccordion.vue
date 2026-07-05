<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const isOpen = ref(props.open)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="pixel-accordion" :class="{ 'pixel-accordion--open': isOpen }">
    <button class="pixel-accordion__header" @click="toggle" :aria-expanded="isOpen">
      <span class="pixel-accordion__arrow">{{ isOpen ? '▼' : '▶' }}</span>
      <span class="pixel-accordion__title">{{ title }}</span>
    </button>
    <div v-show="isOpen" class="pixel-accordion__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pixel-accordion {
  border: 2px solid var(--pixel-color-border);
  margin-bottom: 8px;
}

.pixel-accordion--open {
  border-color: var(--pixel-color-accent);
}

.pixel-accordion__header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  font-family: var(--pixel-font-heading);
  font-size: var(--pixel-font-size-m);
  color: var(--pixel-color-text);
  background: var(--pixel-color-bg-card);
  border: none;
  cursor: pointer;
  text-align: left;
}

.pixel-accordion__header:hover {
  background: var(--pixel-color-accent-soft);
}

.pixel-accordion__arrow {
  font-size: var(--pixel-font-size-s);
  line-height: 1;
  flex-shrink: 0;
}

.pixel-accordion__title {
  flex: 1;
}

.pixel-accordion__body {
  padding: 12px;
  font-size: var(--pixel-font-size-m);
  color: var(--pixel-color-text-muted);
  line-height: var(--pixel-line-height);
  border-top: 2px solid var(--pixel-color-border);
}
</style>
