<script lang="ts" setup>
defineProps<{
  items: { date: string; title: string; content: string }[]
}>()
</script>

<template>
  <div class="pixel-timeline">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="pixel-timeline__item"
      :class="{ 'pixel-timeline__item--right': index % 2 === 1 }"
    >
      <div class="pixel-timeline__node" />
      <div class="pixel-timeline__card">
        <span class="pixel-timeline__date">{{ item.date }}</span>
        <span class="pixel-timeline__title">{{ item.title }}</span>
        <p class="pixel-timeline__content">
          {{ item.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pixel-timeline {
  position: relative;
  padding: 16px 0;
}

/* ── 中轴线 ── */
.pixel-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--pixel-color-border);
  transform: translateX(-50%);
}

/* ── 条目 ── */
.pixel-timeline__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-left: calc(50% + 24px);
}

.pixel-timeline__item--right {
  padding-left: 0;
  padding-right: calc(50% + 24px);
  flex-direction: row-reverse;
}

/* ── 节点 ── */
.pixel-timeline__node {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 10px;
  height: 10px;
  background: var(--pixel-color-accent);
  border: 2px solid var(--pixel-color-border-dark);
  transform: translateX(-50%);
  flex-shrink: 0;
}

/* ── 卡片 ── */
.pixel-timeline__card {
  flex: 1;
  max-width: 100%;
  padding: 12px;
  text-align: left;
}

.pixel-timeline__item--right .pixel-timeline__card {
  text-align: right;
}

.pixel-timeline__date {
  display: block;
  font-family: var(--pixel-font-code);
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-accent);
  margin-bottom: 4px;
}

.pixel-timeline__title {
  display: block;
  font-family: var(--pixel-font-heading);
  font-size: var(--pixel-font-size-m);
  color: var(--pixel-color-text);
  margin-bottom: 4px;
}

.pixel-timeline__content {
  margin: 0;
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-text-muted);
  line-height: var(--pixel-line-height);
}

/* ── 移动端：统一左侧布局 ── */
@media (max-width: var(--pixel-break-mobile)) {
  .pixel-timeline::before {
    left: 16px;
  }

  .pixel-timeline__item,
  .pixel-timeline__item--right {
    padding-left: 40px;
    padding-right: 0;
    flex-direction: row;
  }

  .pixel-timeline__item--right .pixel-timeline__card {
    text-align: left;
  }

  .pixel-timeline__node {
    left: 16px;
  }
}
</style>
