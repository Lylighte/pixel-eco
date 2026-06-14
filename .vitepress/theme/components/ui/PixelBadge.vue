<script lang="ts" setup>
defineProps({
  type: {
    type: String as () => 'info' | 'success' | 'warning' | 'danger',
    default: 'info',
  },
  size: {
    type: String as () => 'sm' | 'md',
    default: 'md',
  },
  outline: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <span
    class="pixel-badge"
    :class="[
      `pixel-badge--${$props.type}`,
      `pixel-badge--${$props.size}`,
      { 'pixel-badge--outline': $props.outline },
    ]"
  >
    <slot />
  </span>
</template>

<style scoped>
.pixel-badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--pixel-font-code);
  font-size: var(--pixel-font-size-s);
  line-height: 1;
  padding: 2px 8px;
  border: 2px solid;
  image-rendering: pixelated;
  user-select: none;
}

/* ── Sizes ── */
.pixel-badge--sm {
  font-size: 0.625rem;
  padding: 1px 6px;
}

.pixel-badge--md {
  font-size: var(--pixel-font-size-s);
  padding: 2px 8px;
}

/* ── Types ── */
.pixel-badge--info {
  color: #fff;
  background: #3a6ea5;
  border-color: #2a5a8a;
}

.pixel-badge--success {
  color: #fff;
  background: #3a7d3a;
  border-color: #2a6a2a;
}

.pixel-badge--warning {
  color: #000;
  background: #d4a017;
  border-color: #b08810;
}

.pixel-badge--danger {
  color: #fff;
  background: #a53a3a;
  border-color: #8a2a2a;
}

/* ── Outline variant ── */
.pixel-badge--outline.pixel-badge--info {
  color: #5a9ed5;
  background: transparent;
}

.pixel-badge--outline.pixel-badge--success {
  color: #5aad5a;
  background: transparent;
}

.pixel-badge--outline.pixel-badge--warning {
  color: #e4b030;
  background: transparent;
}

.pixel-badge--outline.pixel-badge--danger {
  color: #d55a5a;
  background: transparent;
}
</style>