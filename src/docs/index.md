---
layout: page
---

<script setup>
import { data as collections } from '../../.vitepress/collections.data'
</script>

# 文档

这里包含使用和自定义本模板所需的一切内容。所有文档均为标准 Markdown 文件 — 直接在 `docs/` 目录中编辑即可。

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; padding: 2rem 0;">

<LinkCard v-for="card in collections.docs" :key="card.url" :link="card" />

</div>
