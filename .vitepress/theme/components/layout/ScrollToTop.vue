<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PixelButton from '../ui/PixelButton.vue'

const scrollToTop = () => {
  if (typeof window === 'undefined') return
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

const shouldShow = ref(false)

let scrollHandler: (() => void) | null = null

onMounted(() => {
  scrollHandler = () => {
    shouldShow.value = window.scrollY > 200
  }
  window.addEventListener('scroll', scrollHandler)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <PixelButton
    class="scroll-to-top"
    :class="{ visible: shouldShow }"
    :tabindex="shouldShow ? 0 : -1"
    :aria-hidden="!shouldShow"
    aria-label="返回顶部"
    @click="scrollToTop"
  >
    ↑
  </PixelButton>
</template>

<style lang="css" scoped>
.scroll-to-top {
  font-size: var(--pixel-font-size-l);
  position: fixed;
  height: 3rem;
  width: 3rem;
  bottom: 0;
  right: 0;
  z-index: var(--pixel-z-overlay);
  transform: translateY(100%);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.scroll-to-top.visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}
</style>
