<script lang="ts" setup>
import { useClickSound } from '../../composables/useClickSound'

interface Props {
  soundUrl?: string
}

withDefaults(defineProps<Props>(), {
  soundUrl: '/button.click.ogg',
})

const { playSound } = useClickSound({ defaultUrl: '/button.click.ogg', volume: 0.3 })
</script>

<template>
  <div class="pixel-button-classic" @click="playSound($props.soundUrl)">
    <div class="title">
      <slot />
    </div>
  </div>
</template>

<style lang="css" scoped>
.pixel-button-classic {
  display: inline-flex;
  align-items: center;
  height: 3rem;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  background: var(--pixel-btn-classic-bg);
  image-rendering: pixelated;
  border: var(--pixel-btn-border);
  box-sizing: border-box;
}

.pixel-button-classic[activated='true'] .title {
  background-color: var(--pixel-btn-classic-active-bg);
  text-shadow: var(--pixel-btn-classic-active-shadow);
  color: var(--pixel-btn-classic-active-text);
  box-shadow:
    inset -2px -4px var(--pixel-btn-classic-inset-dark),
    inset 2px 2px var(--pixel-btn-classic-inset-light);
}

.pixel-button-classic:hover .title {
  background-color: var(--pixel-btn-classic-active-bg);
  text-shadow: var(--pixel-btn-classic-active-shadow);
  color: var(--pixel-btn-classic-active-text);
}

.pixel-button-classic:active .title {
  box-shadow:
    inset -2px -4px var(--pixel-btn-classic-inset-dark),
    inset 2px 2px var(--pixel-btn-classic-inset-light);
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  align-self: stretch;
  padding-bottom: 0.3em;

  color: var(--pixel-btn-classic-text);
  text-shadow: var(--pixel-btn-classic-shadow);
  box-shadow:
    inset -2px -4px var(--pixel-btn-classic-inset-dark-strong),
    inset 2px 2px var(--pixel-btn-classic-inset-light-strong);
}
</style>
