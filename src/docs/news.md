---
layout: page
title: 新闻指南
sidebarGroup: 内容创作
sidebarGroupOrder: 2
sidebarOrder: 1
cardDescription: 使用 frontmatter、NewsCard 和 Markdown 撰写文章。
cardImage: /background/28.jpg
---

# 新闻指南

使用丰富的格式和元数据撰写并发布新闻文章。

## 创建文章

在 `news/` 目录下新建 `.md` 文件：

```
news/my-first-post.md
```

## Frontmatter

每篇新闻文章顶部需要 YAML frontmatter：

```yaml
---
title: 我的第一篇文章
date: 2026-06-05
author:
  name: 你的名字
  avatar: /background/bgbtn.png
  tags:
    - text: 公告
      color: '#fff'
      bg: '#d84b4b'
cover: /background/44.jpg
category: 综合
---
```

| 字段 | 必填 | 描述 |
|------|:----:|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期（YYYY-MM-DD） |
| `author.name` | 否 | 作者显示名称 |
| `author.avatar` | 否 | 作者头像图片路径 |
| `author.tags` | 否 | 标签徽章（text、color、bg） |
| `cover` | 否 | 封面图路径 |
| `category` | 否 | 文章分类标签 |

## 添加到新闻列表

创建文章后，在 `news/index.md` 中添加 `<NewsCard>`：

```html
<NewsCard
  title="我的第一篇文章"
  brief="显示在卡片预览中的简短描述。"
  image="/background/44.jpg"
  link="/news/my-first-post"
/>
```

| 属性 | 描述 |
|------|------|
| `title` | 卡片标题 |
| `brief` | 简短描述文字 |
| `image` | 卡片背景图片 |
| `link` | 文章链接 |
| `button-text` | 按钮文字（默认 `'阅读更多'`） |

## Markdown 功能

VitePress 支持完整的 Markdown 及其扩展语法：

### 代码块

```ts
const greeting = '你好，世界！'
console.log(greeting)
```

### 提示块

::: tip
这是一条有用的提示。
:::

::: warning
这是一条警告。
:::

::: danger
这是一条危险警告。
:::

### 图片

```md
![替代文字](/path/to/image.png)
```

### 表格

| 表头 1 | 表头 2 | 表头 3 |
|--------|--------|--------|
| 行 1   | 数据   | 更多   |
| 行 2   | 数据   | 更多   |

### 链接

```md
[内部链接](/docs/quick-start)
[外部链接](https://example.com)
```

## 提示

- 使用 16:9 宽高比的 `cover` 图片效果最佳
- `brief` 描述控制在 150 字以内，保持卡片布局整洁
- 新闻文章按 `date` 排序 — 使用 ISO 格式（`YYYY-MM-DD`）
