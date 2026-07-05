<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import PixelButtonClassic from './PixelButtonClassic.vue'

const modelValue = defineModel<boolean>({ default: false })
const emits = defineEmits(['confirm'])
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确认',
  },
})
const visible = ref(false)
const opacity = ref(0)

const closeDialog = () => {
  modelValue.value = false
}

const onConfirm = () => {
  closeDialog()
  emits('confirm')
}

watch(modelValue, (newValue) => {
  if (newValue) {
    visible.value = true
    setTimeout(() => {
      opacity.value = 1
    }, 100)
  } else {
    opacity.value = 0
    setTimeout(() => {
      visible.value = false
    }, 300)
  }
})

onMounted(() => {
  if (modelValue.value) {
    visible.value = true
    opacity.value = 1
  }
})
</script>

<template>
  <div class="dialog-cover" v-if="visible" :style="{ opacity: opacity }" @click.self="closeDialog">
    <div class="dialog pixel-border" @click.stop>
      <text class="dialog-title" v-if="props.title.trim() !== ''">{{ props.title }}</text>
      <slot></slot>
      <slot name="footer">
        <div class="dialog-footer">
          <PixelButtonClassic class="dialog-footer-btn" @click="closeDialog">
            {{ props.cancelText }}
          </PixelButtonClassic>
          <PixelButtonClassic
            class="dialog-footer-btn"
            style="margin-left: 1rem"
            @click="onConfirm"
          >
            {{ props.confirmText }}
          </PixelButtonClassic>
        </div>
      </slot>
    </div>
  </div>
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
  z-index: 1024;

  transition: all 0.3s ease-in-out;
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
  margin-top: 1rem;
}

.dialog-footer-btn {
  width: 6rem;
}
</style>
