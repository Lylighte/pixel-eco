<script lang="ts" setup>
import { withBase } from 'vitepress'

defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
  soundUrl: {
    type: String,
    default: '/button.click.ogg',
  },
})

const soundOn = (url: string) => {
  if (!url) return
  const audio = new Audio(withBase(url))
  audio.play()
  audio.volume = 0.3
}
</script>

<template>
  <div
    :class="$props.dark ? 'pixel-button dark' : 'pixel-button'"
    @click="soundOn($props.soundUrl)"
  >
    <slot></slot>
  </div>
</template>

<style lang="css" scoped>
.pixel-button {
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--pixel-btn-text);
  padding: 1rem;
  outline: 2px solid transparent;
  border: 2px solid transparent;
  background-color: var(--pixel-btn-bg-base);
  box-shadow:
    inset 2px 2px 0 0 var(--pixel-btn-shadow-light),
    inset -2px -2px 0 0 var(--pixel-btn-shadow-dark);
  cursor: pointer;
}

.pixel-button.dark {
  color: var(--pixel-btn-text-hover);
  outline: 2px solid transparent;
  background-color: var(--pixel-btn-bg-dark);
  box-shadow:
    inset 2px 2px 0 0 var(--pixel-btn-shadow-light),
    inset -2px -2px 0 0 var(--pixel-btn-shadow-dark);
}

.pixel-button:hover {
  color: var(--pixel-btn-text-hover);
  outline: 2px solid var(--pixel-btn-outline-hover);
  background-color: var(--pixel-btn-bg-hover);
  box-shadow:
    inset 2px 2px 0 0 var(--pixel-btn-shadow-light-hover),
    inset -2px -2px 0 0 var(--pixel-btn-shadow-dark-hover);
}

.pixel-button:active {
  background-color: var(--pixel-btn-bg-active);
  box-shadow:
    inset -2px -2px 0 0 var(--pixel-btn-shadow-light),
    inset 2px 2px 0 0 var(--pixel-btn-shadow-dark);
}

.pixel-button:active:hover {
  color: var(--pixel-btn-text-hover);
  outline: 2px solid var(--pixel-btn-outline-hover);
  background-color: var(--pixel-btn-bg-hover);
  box-shadow:
    inset -2px -2px 0 0 var(--pixel-btn-shadow-light-hover),
    inset 2px 2px 0 0 var(--pixel-btn-shadow-dark-hover);
}
</style>
