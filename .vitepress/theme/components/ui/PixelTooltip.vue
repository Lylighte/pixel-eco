<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    position: 'top',
  },
)

const show = ref(false)

const arrowClass = computed(() => `pixel-tooltip--${props.position}`)
</script>

<template>
  <span
    class="pixel-tooltip"
    tabindex="0"
    @mouseenter="show = true"
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
  >
    <slot />
    <span v-if="show" class="pixel-tooltip__popup" :class="arrowClass">{{ text }}</span>
  </span>
</template>

<style scoped>
.pixel-tooltip {
  position: relative;
  display: inline-block;
  cursor: help;
  border-bottom: 1px dotted var(--pixel-color-text-muted);
}

.pixel-tooltip__popup {
  position: absolute;
  z-index: var(--pixel-z-tooltip);
  padding: 4px 8px;
  font-family: var(--pixel-font-code);
  font-size: var(--pixel-font-size-s);
  line-height: 1.4;
  color: var(--pixel-color-text);
  background: var(--pixel-color-bg-card);
  border: 2px solid var(--pixel-color-border);
  white-space: nowrap;
  pointer-events: none;
}

/* ── Positions ── */
.pixel-tooltip--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.pixel-tooltip--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.pixel-tooltip--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.pixel-tooltip--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}
</style>
