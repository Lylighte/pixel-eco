<script lang="ts" setup>
withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md'
    outline?: boolean
  }>(),
  {
    type: 'info',
    size: 'md',
    outline: false,
  },
)
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
  font-size: var(--pixel-font-size-s);
  padding: 1px 6px;
}

.pixel-badge--md {
  font-size: var(--pixel-font-size-s);
  padding: 2px 8px;
}

/* ── Types ── */
.pixel-badge--info {
  color: var(--pixel-color-text-solid);
  background: var(--pixel-color-info);
  border-color: var(--pixel-color-info-border);
}

.pixel-badge--success {
  color: var(--pixel-color-text-solid);
  background: var(--pixel-color-success);
  border-color: var(--pixel-color-success-border);
}

.pixel-badge--warning {
  color: var(--pixel-color-text-inverse);
  background: var(--pixel-color-warning);
  border-color: var(--pixel-color-warning-border);
}

.pixel-badge--danger {
  color: var(--pixel-color-text-solid);
  background: var(--pixel-color-danger);
  border-color: var(--pixel-color-danger-border);
}

/* ── Outline variant ── */
.pixel-badge--outline.pixel-badge--info {
  color: var(--pixel-color-info-light);
  background: transparent;
}

.pixel-badge--outline.pixel-badge--success {
  color: var(--pixel-color-success-light);
  background: transparent;
}

.pixel-badge--outline.pixel-badge--warning {
  color: var(--pixel-color-warning-light);
  background: transparent;
}

.pixel-badge--outline.pixel-badge--danger {
  color: var(--pixel-color-danger-light);
  background: transparent;
}
</style>
