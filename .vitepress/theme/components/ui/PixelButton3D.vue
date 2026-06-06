<script lang="ts" setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'

defineProps({
  height: {
    type: String,
    default: '3.6rem',
  },
  soundUrl: {
    type: String,
    default: '/button.click.ogg',
  },
})

const pressed = ref(false)

const soundOn = (url: string) => {
  if (!url) return
  const audio = new Audio(withBase(url))
  audio.play()
  audio.volume = 0.3
}
</script>

<template>
  <div
    class="pixel-button-3d"
    :class="{ 'is-pressed': pressed }"
    :style="{
      height: pressed ? `calc(${$props.height} - var(--pixel-btn-3d-offset))` : $props.height,
    }"
    @click="soundOn($props.soundUrl)"
    @mousedown="pressed = true"
    @mouseup="pressed = false"
    @mouseleave="pressed = false"
  >
    <slot></slot>
  </div>
</template>

<style lang="css" scoped>
.pixel-button-3d {
  display: inline-flex;
  flex-direction: column;
  padding: 1rem 2rem;
  position: relative;
  cursor: pointer;
  user-select: none;
  background-color: var(--pixel-btn-3d-bg);
  border: 2px solid var(--pixel-btn-3d-border);
  transition: all 0.1s ease-in-out;
  box-shadow: var(--pixel-shadow-hard);
  box-sizing: border-box;
}

.pixel-button-3d:hover::after {
  background-color: var(--pixel-btn-3d-hover-overlay);
}

.pixel-button-3d.is-pressed {
  transform: translateY(var(--pixel-btn-3d-offset));
  margin-bottom: var(--pixel-btn-3d-offset);
}

.pixel-button-3d.is-pressed::after {
  box-shadow:
    2px 2px 0 0 var(--pixel-btn-3d-highlight) inset,
    -2px -2px 0 0 var(--pixel-btn-3d-shadow-bottom) inset;
}

.pixel-button-3d::after {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  box-shadow:
    0 calc(-1 * var(--pixel-btn-3d-offset)) 0 0 var(--pixel-btn-3d-shadow-top) inset,
    2px 2px 0 0 var(--pixel-btn-3d-highlight) inset,
    -2px calc(-1 * var(--pixel-btn-3d-offset) - 4px) 0 0 var(--pixel-btn-3d-shadow-bottom) inset;
  mix-blend-mode: hard-light;
  pointer-events: none;
  transition: all 0.1s ease-in-out;
}
</style>
