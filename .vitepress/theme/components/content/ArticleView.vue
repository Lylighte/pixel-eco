<script lang="ts" setup>
import { withBase } from 'vitepress'
import type { Author } from '../../types/components.ts'

defineProps<{
  title?: string
  author?: Author
  date?: string
  endDate?: string
  cover?: string
  category?: string
}>()
</script>

<template>
  <article class="article-view">
    <!-- Cover -->
    <div v-if="cover" class="article-cover">
      <img :src="withBase(cover)" :alt="title" width="1200" height="384" />
      <div v-if="category" class="article-cover-category">
        {{ category }}
      </div>
    </div>

    <div class="article-body">
      <!-- Author sidebar -->
      <aside v-if="author" class="article-author">
        <div class="article-author-avatar pixel-border">
          <img :src="withBase(author.avatar)" :alt="author.name" width="64" height="64" />
        </div>
        <div class="article-author-name">
          {{ author.name }}
        </div>
        <div v-if="author.tags" class="article-author-tags">
          <span
            v-for="tag in author.tags"
            :key="tag.text"
            class="article-author-tag"
            :style="{ backgroundColor: tag.bg, color: tag.color }"
            >{{ tag.text }}</span
          >
        </div>
        <div class="article-author-meta">
          <div v-if="date && !endDate">
            <span class="meta-label">发布于</span>
            <span class="meta-value">{{ date }}</span>
          </div>
          <div v-else-if="date && endDate">
            <span class="meta-label">持续时间</span>
            <span class="meta-value">{{ date }} ~ {{ endDate }}</span>
          </div>
        </div>
      </aside>

      <!-- Markdown content -->
      <main class="article-content">
        <h1 v-if="title" class="article-title">
          {{ title }}
        </h1>
        <div class="article-text vp-doc">
          <slot />
        </div>
      </main>
    </div>
  </article>
</template>

<style scoped>
.article-view {
  padding-top: 4rem;
}

.article-cover {
  position: relative;
  width: 100%;
  height: 24rem;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.article-cover-category {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: var(--pixel-article-category-bg);
  color: var(--pixel-brand-light);
  padding: 0.25rem 0.75rem;
  font-size: var(--pixel-font-size-m);
  border: 1px solid var(--pixel-brand);
}

.article-body {
  display: flex;
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  gap: 2rem;
}

.article-author {
  flex-shrink: 0;
  width: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
}

.article-author-avatar {
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  padding: 5px;
  background-color: var(--pixel-border-fill);
}

.article-author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  display: block;
}

.article-author-name {
  margin-top: 0.5rem;
  font-size: var(--pixel-font-size-m);
}

.article-author-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
  justify-content: center;
}

.article-author-tag {
  font-size: var(--pixel-font-size-s);
  padding: 0.1rem 0.4rem;
}

.article-author-meta {
  margin-top: 1rem;
  font-size: var(--pixel-font-size-s);
  color: var(--pixel-color-text-muted);
  text-align: center;
  line-height: 1.6;
}

.meta-label {
  display: block;
  font-size: var(--pixel-font-size-s);
}

.meta-value {
  display: block;
  color: var(--pixel-color-text-muted);
}

.article-content {
  flex: 1;
  min-width: 0;
  max-width: 48rem;
}

.article-title {
  font-size: var(--pixel-font-size-l);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--pixel-gray);
}

@media screen and (max-width: 768px) {
  .article-body {
    flex-direction: column;
  }
  .article-author {
    flex-direction: row;
    width: 100%;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    padding-top: 0;
  }
  .article-author-avatar {
    width: 3rem;
    height: 3rem;
  }
  .article-author-meta {
    margin-top: 0;
    margin-left: auto;
    text-align: right;
  }
}
</style>
