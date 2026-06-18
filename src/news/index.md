---
layout: page
---

# 新闻

在这里了解我们社区的最新动态、活动预告和重要公告。

<script setup>
import { buildNewsCards } from '../../.vitepress/theme/utils/news-utils'

const cards = buildNewsCards()
</script>

<NewsCard
  v-for="card in cards"
  :key="card.link"
  :title="card.title"
  :brief="card.brief"
  :image="card.image"
  :link="card.link"
/>

