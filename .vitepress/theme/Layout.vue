<script lang="ts" setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import NavBar from './components/layout/NavBar.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import ScrollToTop from './components/layout/ScrollToTop.vue'
import ArticleView from './components/content/ArticleView.vue'
import DocsSidebar from './components/content/DocsSidebar.vue'

const { frontmatter, site } = useData()
const route = useRoute()

// VitePress SSR 期间 route.path 可能包含 base 前缀，手动剥离
const stripBase = (path: string) => {
  const base = site.value.base
  if (base && base !== '/' && base !== './' && path.startsWith(base)) {
    return path.slice(base.length - 1)
  }
  return path
}

const hasHero = computed(() => !!frontmatter.value.hasHero)

const isNewsPost = computed(() => {
  const path = stripBase(route.path)
  return path.startsWith('/news/') && path !== '/news/' && path !== '/news'
})

// Docs sub-pages get a sidebar layout; /docs/ itself is the index (no sidebar)
const isDocsPage = computed(() => {
  const path = stripBase(route.path)
  return path.startsWith('/docs/') && path !== '/docs/' && path !== '/docs'
})

const articleProps = computed(() => {
  if (!isNewsPost.value) return null
  const fm = frontmatter.value
  return {
    title: fm.title,
    author: fm.author,
    date: fm.date,
    endDate: fm.endDate,
    cover: fm.cover,
    category: fm.category,
  }
})
</script>

<template>
  <div class="pixel-layout">
    <NavBar />
    <main class="main-content">
      <Transition name="page" mode="out-in">
        <div v-if="isDocsPage" class="docs-layout" :key="route.path">
          <DocsSidebar />
          <div class="page-container vp-doc">
            <Content />
          </div>
        </div>
        <ArticleView v-else-if="articleProps" v-bind="articleProps" :key="route.path">
          <Content />
        </ArticleView>
        <div v-else class="page-container vp-doc" :class="{ 'with-hero': hasHero }" :key="route.path">
          <Content />
        </div>
      </Transition>
    </main>
    <SiteFooter />
    <ScrollToTop />
  </div>
</template>

<style>
/* ── Match VitePress dark palette to Pixel ── */
.pixel-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--pixel-color-bg);
}

.main-content {
  flex: 1;
}

/* Remove default VitePress nav, sidebar, doc footer */
.pixel-layout :deep(.VPNav),
.pixel-layout :deep(.VPSidebar),
.pixel-layout :deep(.VPDocFooter),
.pixel-layout :deep(.VPLocalNav) {
  display: none;
}

/* Constrain text-heavy pages (about, etc.) for readability */
.page-container {
  max-width: 72rem;
  margin: 0 auto;
  padding: 5rem 1.5rem 2rem;
}

.page-container.with-hero {
  padding-top: 0;
}

/* Docs layout: sidebar + content */
.docs-layout {
  display: flex;
  min-height: calc(100vh - 5rem);
  padding-top: 5rem;
}

.docs-layout .page-container {
  flex: 1;
  min-width: 0;
}

@media screen and (max-width: 768px) {
  .docs-layout {
    flex-direction: column;
  }
}
</style>
