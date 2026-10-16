<script lang="ts" setup>
import { withBase } from 'vitepress'

withDefaults(
  defineProps<{
    title: string
    description?: string
    image?: string
    right?: boolean
  }>(),
  {
    description: '',
    image: '',
    right: false,
  },
)
</script>

<template>
  <div class="intro-box">
    <div v-if="!$props.image" class="intro-center">
      <div class="intro-text">
        <p>{{ $props.title }}</p>
        <span>{{ $props.description }}</span>
      </div>
    </div>
    <div v-else :class="$props.right ? 'intro-left' : 'intro-right'">
      <img
        :src="withBase($props.image)"
        alt="image"
        loading="lazy"
        class="intro-image pixel-border"
        width="600"
        height="338"
      />
      <div class="intro-text">
        <p>{{ $props.title }}</p>
        <span>{{ $props.description }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.intro-box {
  width: 100%;
  max-width: 1200px;
  padding: 2rem 1rem;
  margin: 0 auto;
  animation: fade-in 0.8s ease;
}

.intro-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1rem;
}

.intro-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.intro-left {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 2rem;
}

.intro-image {
  width: 40%;
  min-width: 300px;
  height: auto;
  object-fit: cover;
}

.intro-text {
  flex: 1;
}

.intro-right .intro-text {
  text-align: left;
}

.intro-left .intro-text {
  text-align: right;
}

.intro-text p {
  font-size: var(--pixel-font-size-l);
  margin: 0 0 1rem 0;
  color: var(--pixel-color-text);
}

.intro-text span {
  font-size: var(--pixel-font-size-m);
  line-height: 1.6;
  color: var(--pixel-color-text-muted);
}

@media screen and (max-width: var(--pixel-break-small)) {
  .intro-right,
  .intro-left {
    flex-direction: column;
  }

  .intro-right .intro-text,
  .intro-left .intro-text {
    text-align: left;
  }

  .intro-image {
    width: 100%;
    min-width: unset;
  }
}
</style>
