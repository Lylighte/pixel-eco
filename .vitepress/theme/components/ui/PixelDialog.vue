<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import PixelButtonClassic from './PixelButtonClassic.vue'

const modelValue = defineModel<boolean>({ default: false })
const emits = defineEmits(['confirm'])
const props = withDefaults(
  defineProps<{
    title?: string
    cancelText?: string
    confirmText?: string
  }>(),
  {
    title: '',
    cancelText: '取消',
    confirmText: '确认',
  },
)
const closeDialog = () => {
  modelValue.value = false
}

const onConfirm = () => {
  closeDialog()
  emits('confirm')
}

const onKeydown = (event: KeyboardEvent) => {
  if (modelValue.value && event.key === 'Escape') closeDialog()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="dialog">
    <div v-if="modelValue" class="dialog-cover" @click.self="closeDialog">
      <div
        class="dialog pixel-border"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title.trim() || undefined"
        @click.stop
      >
        <span v-if="props.title.trim() !== ''" class="dialog-title">
          {{ props.title }}
        </span>
        <slot />
        <slot name="footer">
          <div class="dialog-footer">
            <PixelButtonClassic class="dialog-footer-btn" @click="closeDialog">
              {{ props.cancelText }}
            </PixelButtonClassic>
            <PixelButtonClassic class="dialog-footer-btn" @click="onConfirm">
              {{ props.confirmText }}
            </PixelButtonClassic>
          </div>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style lang="css" scoped>
.dialog-cover {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--pixel-color-bg-overlay);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--pixel-z-dialog);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.dialog-enter-active {
  transition-delay: 0.1s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;

  padding: 1rem;
  z-index: var(--pixel-z-dialog);
  min-width: 720px;

  transition: all 0.3s ease-in-out;
}

@media screen and (max-width: 768px) {
  .dialog {
    min-width: 360px;
    width: 90vw;
  }
}

.dialog-title {
  font-family: var(--pixel-font-heading);
  font-size: 1.25rem; /* 20px — Ark Pixel 对齐 */
  font-weight: bold;
  margin-bottom: 1rem;
  user-select: none;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.dialog-footer-btn {
  width: 6rem;
}
</style>
