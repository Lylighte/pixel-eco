---
layout: page
---

# 新闻

在这里了解我们社区的最新动态、活动预告和重要公告。

<script setup>
import { data as collections } from '../../.vitepress/collections.data'
</script>

<NewsCard
  v-for="card in collections.news"
  :key="card.link"
  :title="card.title"
  :brief="card.brief"
  :image="card.image"
  :link="card.link"
/>
