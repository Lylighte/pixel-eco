<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String as () => 'accent' | 'success' | 'warning' | 'danger',
    default: 'accent',
  },
  showValue: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '16px',
  },
})

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))
</script>

<template>
  <div class="pixel-progress">
    <div v-if="label || showValue" class="pixel-progress__header">
      <span v-if="label" class="pixel-progress__label">{{ label }}</span>
      <span v-if="showValue" class="pixel-progress__value">{{ clampedValue }}%</span>
    </div>
    <div
      class="pixel-progress__track"
      :style="{ height: height }"
    >
      <div
        class="pixel-progress__fill"
        :class="`pixel-progress__fill--${color}`"
        :style="{ width: clampedValue + '%' }"
      />
    </div>
  </div>
</template>

<style scoped>
.pixel-progress {
  margin-bottom: 12px;
}

.pixel-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.pixel-progress__label {
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-text-muted);
}

.pixel-progress__value {
  font-family: var(--pixel-font-code);
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-text);
}

/* ── 轨道 ── */
.pixel-progress__track {
  width: 100%;
  background: var(--pixel-color-bg-card);
  border: 2px solid var(--pixel-color-border);
  overflow: hidden;
}

/* ── 填充 ── */
.pixel-progress__fill {
  height: 100%;
  transition: width 0.3s ease;
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.2),
    inset -2px -2px 0 rgba(0, 0, 0, 0.2);
}

.pixel-progress__fill--accent {
  background: var(--pixel-color-accent);
}

.pixel-progress__fill--success {
  background: #3a7d3a;
}

.pixel-progress__fill--warning {
  background: #d4a017;
}

.pixel-progress__fill--danger {
  background: #a53a3a;
}
</style>