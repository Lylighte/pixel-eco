<script lang="ts" setup>
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    tabs: string[]
    active?: number
  }>(),
  {
    active: 0,
  },
)

const activeIndex = ref(props.active)

function setActive(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="pixel-tabs">
    <div class="pixel-tabs__nav" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="pixel-tabs__tab"
        :class="{ 'pixel-tabs__tab--active': activeIndex === index }"
        role="tab"
        :aria-selected="activeIndex === index"
        @click="setActive(index)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="pixel-tabs__content" role="tabpanel">
      <slot :name="`tab-${activeIndex}`" />
    </div>
  </div>
</template>

<style scoped>
.pixel-tabs {
  border: 2px solid var(--pixel-color-border);
}

.pixel-tabs__nav {
  display: flex;
  border-bottom: 2px solid var(--pixel-color-border);
  background: var(--pixel-color-bg-card);
}

.pixel-tabs__tab {
  flex: 1;
  padding: 8px 16px;
  font-family: var(--pixel-font-code);
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-text-muted);
  background: transparent;
  border: none;
  border-right: 2px solid var(--pixel-color-border);
  cursor: pointer;
  transition: background var(--pixel-transition-fast);
}

.pixel-tabs__tab:last-child {
  border-right: none;
}

.pixel-tabs__tab:hover {
  background: var(--pixel-color-accent-soft);
}

.pixel-tabs__tab--active {
  color: var(--pixel-color-text);
  background: var(--pixel-color-bg);
  border-bottom: 2px solid var(--pixel-color-accent);
  margin-bottom: -2px;
}

.pixel-tabs__content {
  padding: 16px;
  font-size: var(--pixel-font-size-m);
  line-height: var(--pixel-line-height);
}
</style>
