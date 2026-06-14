---
layout: page
title: 搜索
navbar: true
---

<script setup>
import { onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const { site } = useData()
const query = ref('')
const results = ref([])
const loading = ref(false)
const noResults = ref(false)
const error = ref('')
let pagefind = null
let debounceTimer = null

onMounted(async () => {
  try {
    const base = site.value.base
    const basePath = base + 'pagefind/'
    // 使用 new Function 绕过 Vite 对 import() 的静态分析
    const pf = await new Function('path', 'return import(path)')(basePath + 'pagefind.js')
    await pf.init({ basePath })
    pagefind = pf
  } catch (e) {
    error.value = '搜索索引加载失败，请稍后重试。'
    console.error('Pagefind init error:', e)
  }
})

function doSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const q = query.value.trim()
    if (!q) {
      results.value = []
      noResults.value = false
      return
    }
    if (!pagefind) return

    loading.value = true
    error.value = ''
    try {
      const search = await pagefind.search(q)
      if (!search.results.length) {
        results.value = []
        noResults.value = true
      } else {
        noResults.value = false
        const processed = await Promise.all(
          search.results.map(async (r) => {
            const data = await r.data()
            return {
              url: withBase(data.url),
              title: data.meta?.title || data.url,
              excerpt: data.excerpt,
            }
          })
        )
        results.value = processed
      }
    } catch (e) {
      error.value = '搜索出错，请重试。'
      console.error('Pagefind search error:', e)
    } finally {
      loading.value = false
    }
  }, 300)
}
</script>

<style>
/* ── 搜索输入框 ── */
.pixel-search-input {
  width: 100%;
  padding: 8px 12px;
  font-family: var(--pixel-font-code);
  font-size: 16px;
  background: var(--pixel-color-bg-card);
  color: var(--pixel-color-text);
  border: 2px solid var(--pixel-color-border);
  outline: none;
  box-sizing: border-box;
}

.pixel-search-input:focus {
  border-color: var(--pixel-color-accent);
  box-shadow: 2px 2px 0 var(--pixel-color-accent);
}

/* ── 搜索结果 ── */
.pixel-search-results {
  margin-top: 16px;
}

.search-result-item {
  display: block;
  padding: 12px;
  margin-top: 8px;
  border: 2px solid var(--pixel-color-border);
  text-decoration: none;
  color: var(--pixel-color-text);
}

.search-result-item:hover {
  border-color: var(--pixel-color-accent);
  background: var(--pixel-color-bg-card);
}

.result-title {
  display: block;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 4px;
}

.result-excerpt {
  display: block;
  font-size: 13px;
  color: var(--pixel-color-text-muted);
}

.result-excerpt :deep(mark) {
  background: var(--pixel-color-accent-soft);
  color: var(--pixel-color-accent);
}

/* ── 状态提示 ── */
.no-results,
.search-loading,
.search-error {
  text-align: center;
  padding: 32px;
  color: var(--pixel-color-text-muted);
}

.search-error {
  color: var(--pixel-color-accent);
}
</style>

<div class="pixel-search" data-pagefind-ignore="true">

# 站内搜索

输入关键词，搜索站内相关内容。

<div class="pixel-search-input-wrap">
  <input
    v-model="query"
    type="text"
    placeholder="输入关键词搜索..."
    class="pixel-search-input"
    @input="doSearch"
    autofocus
  />
</div>

<div v-if="loading" class="search-loading">搜索中...</div>
<div v-else-if="error" class="search-error">{{ error }}</div>
<div v-else-if="noResults" class="no-results">没有找到相关结果</div>
<div v-else class="pixel-search-results">
  <a
    v-for="(item, i) in results"
    :key="i"
    :href="item.url"
    class="search-result-item"
  >
    <span class="result-title">{{ item.title }}</span>
    <span class="result-excerpt" v-html="item.excerpt"></span>
  </a>
</div>

</div>