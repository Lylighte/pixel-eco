<script lang="ts" setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import NavBar from './components/layout/NavBar.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import ScrollToTop from './components/layout/ScrollToTop.vue'
import ArticleView from './components/content/ArticleView.vue'
import DocsSidebar from './components/content/DocsSidebar.vue'
import { stripBase } from './utils/path'

const { frontmatter, site } = useData()
const route = useRoute()

const hasHero = computed(() => !!frontmatter.value.hasHero)
const isReadingPage = computed(
  () =>
    stripBase(route.path, site.value.base)
      .replace(/\.html$/, '')
      .replace(/\/$/, '') === '/about',
)

const isNewsPost = computed(() => {
  const path = stripBase(route.path, site.value.base)
  return path.startsWith('/news/') && path !== '/news/' && path !== '/news'
})

// Docs sub-pages get a sidebar layout; /docs/ itself is the index (no sidebar)
const isDocsPage = computed(() => {
  const path = stripBase(route.path, site.value.base)
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
    <main class="main-content" data-pagefind-body="1">
      <!-- Outer transition persists across layout switches; docs sidebar stays
           stable while only the inner content transitions between doc pages. -->
      <Transition name="page" mode="out-in">
        <div v-if="isDocsPage" :key="'docs-layout'" class="docs-layout">
          <DocsSidebar />
          <Transition name="page" mode="out-in">
            <div :key="route.path" class="page-container vp-doc">
              <Content />
            </div>
          </Transition>
        </div>
        <ArticleView v-else-if="articleProps" v-bind="articleProps" :key="route.path">
          <Content />
        </ArticleView>
        <div
          v-else
          :key="route.path"
          class="page-container vp-doc"
          :class="{ 'with-hero': hasHero, 'reading-page': isReadingPage }"
        >
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
  padding: calc(var(--pixel-nav-height) + var(--pixel-space-l)) 1.5rem 2rem;
}

.page-container.with-hero {
  padding-top: 0;
}

/* Constrain only prose; Hero and other layout components keep their existing width. */
.page-container.reading-page
  > div
  > div
  > :is(h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, table, hr) {
  max-width: 48rem;
  margin-inline: auto;
}

/* Docs layout: sidebar + content */
.docs-layout {
  display: flex;
  min-height: calc(100vh - var(--pixel-nav-height) - var(--pixel-space-l));
  padding-top: calc(var(--pixel-nav-height) + var(--pixel-space-l));
}

.docs-layout .page-container {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding-top: var(--pixel-space-l);
}

@media screen and (max-width: var(--pixel-break-layout)) {
  .docs-layout {
    flex-direction: column;
  }
}
</style>
