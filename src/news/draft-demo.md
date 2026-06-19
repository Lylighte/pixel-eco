---
title: 草稿示例
date: 2026-07-01
cover: /background/19.jpg
category: 公告
brief: 这是一篇草稿，仅在开发环境可见。
draft: true
---

# 草稿示例

这篇内容只在 `npm run dev` 时出现在新闻列表中。

生产构建（`npm run build`）时，此页面仍会生成但不会出现在新闻列表页。

## 使用方法

在 frontmatter 中设置 `draft: true`：

```yaml
---
draft: true
---
```

开发时正常撰写，准备发布时移除 `draft` 行或将值改为 `false`。