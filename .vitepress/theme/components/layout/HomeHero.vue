<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    description?: string
    logo?: string
    background?: string
    backgrounds?: string[]
    interval?: number
    transition?: 'fade' | 'slide'
  }>(),
  {
    title: 'Your Organization',
    subtitle: '',
    description: '',
    logo: '/logo.png',
    background: '',
    backgrounds: () => [],
    interval: 5000,
    transition: 'fade',
  },
)

// ── 轮播状态 ──
const currentIndex = ref(0)
const isTransitioning = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let observer: IntersectionObserver | null = null
const heroRef = ref<HTMLElement | null>(null)

const isCarousel = computed(() => props.backgrounds.length > 0)
const images = computed(() =>
  isCarousel.value ? props.backgrounds : props.background ? [props.background] : [],
)
const total = computed(() => images.value.length)

// ── 切换到指定索引 ──
function goTo(index: number) {
  if (isTransitioning.value || total.value <= 1) return
  isTransitioning.value = true
  currentIndex.value = index
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

// ── 下一张 ──
function next() {
  goTo((currentIndex.value + 1) % total.value)
}

// ── 自动轮播 ──
function startTimer() {
  if (!isCarousel.value || props.interval <= 0 || total.value <= 1) return
  stopTimer()
  timer = setInterval(next, props.interval)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// ── 暂停 / 恢复 ──
function pause() {
  stopTimer()
}
function resume() {
  startTimer()
}

// ── 生命周期 ──
onMounted(() => {
  startTimer()
  if (heroRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          resume()
        } else {
          pause()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(heroRef.value)
  }
})

onUnmounted(() => {
  stopTimer()
  observer?.disconnect()
})
</script>

<template>
  <div ref="heroRef" class="hero" @mouseenter="pause" @mouseleave="resume">
    <!-- 单图模式（向后兼容） -->
    <img
      v-if="!isCarousel && $props.background"
      :src="withBase($props.background)"
      alt="hero"
      class="hero-image"
      width="1200"
      height="640"
      fetchpriority="high"
    />

    <!-- 轮播模式 -->
    <template v-if="isCarousel">
      <img
        v-for="(bg, i) in backgrounds"
        :key="i"
        :src="withBase(bg)"
        alt="hero"
        class="hero-image hero-carousel-image"
        :class="{
          'hero-carousel--active': i === currentIndex,
          'hero-carousel--fading': isTransitioning && i === currentIndex,
        }"
        width="1200"
        height="640"
        :fetchpriority="i === 0 ? 'high' : undefined"
        :loading="i === 0 ? undefined : 'lazy'"
      />
    </template>

    <!-- 无背景图时显示渐变 -->
    <div v-if="images.length === 0" class="hero-gradient" />

    <div class="hero-overlay">
      <div class="logo-area">
        <img
          v-if="$props.logo"
          :src="withBase($props.logo)"
          alt="logo"
          class="hero-logo"
          width="80"
          height="80"
        />
        <h1 class="hero-title">
          {{ $props.title }}
        </h1>
        <p v-if="$props.subtitle" class="hero-subtitle">
          {{ $props.subtitle }}
        </p>
        <p v-if="$props.description" class="hero-desc">
          {{ $props.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.hero {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-bottom: 3rem;
  min-height: 40rem;
  position: relative;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── 轮播过渡 ── */
.hero-carousel-image {
  opacity: 0;
  transition: opacity 0.8s ease;
  z-index: var(--pixel-z-base);
}

.hero-carousel--active {
  opacity: 1;
  z-index: var(--pixel-z-raised);
}

.hero-carousel--fading {
  opacity: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: var(--pixel-hero-gradient);
}

.hero-overlay {
  position: relative;
  z-index: var(--pixel-z-content);
  width: 100%;
  min-height: 40rem;
  display: flex;
  align-items: center;
}

.logo-area {
  width: var(--pixel-hero-content-width, 40%);
  min-width: var(--pixel-hero-content-min-width, 25rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  padding-left: var(--pixel-hero-padding-inline);
  padding-right: var(--pixel-hero-padding-inline);
  background-color: var(--pixel-hero-overlay);
  backdrop-filter: blur(2px);
  justify-content: center;
  align-self: stretch;
  text-shadow: var(--pixel-shadow-text);
  animation: fade-in-left 0.8s ease;
}

.hero-logo {
  height: 5rem;
  width: auto;
  user-select: none;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: var(--pixel-font-size-l);
  color: var(--pixel-hero-title-color);
  margin: 0;
}

.hero-subtitle {
  font-size: var(--pixel-font-size-l);
  color: var(--pixel-brand-light);
  margin: 0.5rem 0 0 0;
}

.hero-desc {
  font-size: var(--pixel-font-size-title);
  margin-top: 1rem;
  color: var(--pixel-color-text);
}

@media screen and (max-width: 623px) {
  .logo-area {
    width: 100%;
    min-width: unset;
  }
}
</style>
