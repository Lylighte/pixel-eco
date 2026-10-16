---
layout: page
title: 组件参考
sidebarGroup: 内容创作
sidebarGroupOrder: 2
sidebarOrder: 2
cardDescription: 浏览所有 Pixel UI 和布局组件的在线演示。
cardImage: /background/15.jpg
---

<script setup>
import { ref } from 'vue'

const dialogOpen = ref(false)
const inputText = ref('')
const textareaText = ref('')
</script>

# 组件参考

`Ctrl + F` 快速查找组件名称。

所有内置 Pixel UI 组件均可直接在 Markdown 页面中使用。组件按功能分为四类：

| 用途 | 组件 |
|------|------|
| 我要一个按钮 | `PixelButton` / `PixelButtonClassic` / `PixelButton3D` |
| 我要输入框 | `PixelInput` / `PixelTextarea` |
| 我要弹窗 | `PixelDialog` |
| 我要徽章 | `PixelBadge` |
| 我要卡片 | `PixelCard` |
| 我要提示 | `PixelTooltip` |
| 我要折叠 | `PixelAccordion` |
| 我要标签页 | `PixelTabs` |
| 我要时间线 | `PixelTimeline` |
| 我要进度条 | `PixelProgress` |
| 我要展示图片 | `PixelImage` |
| 我要 Hero 横幅 | `HomeHero` |
| 我要图文区块 | `HomeIntro` |
| 我要新闻卡片 | `NewsCard` |
| 我要链接卡片 | `LinkCard` |
| 我要返回顶部 | `ScrollToTop` |

---

## `ui/` — 交互组件

可直接在 Markdown 页面中使用的交互控件。

### PixelButton

像素风格按钮，支持深色变体和点击音效。

<PixelButton>普通按钮</PixelButton>

<PixelButton dark>深色按钮</PixelButton>

<PixelButton sound-url="">静音按钮</PixelButton>

```html
<PixelButton>普通按钮</PixelButton>
<PixelButton dark>深色按钮</PixelButton>
<PixelButton sound-url="">静音按钮</PixelButton>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `dark` | `boolean` | `false` | 深色主题 |
| `sound-url` | `string` | `'/button.click.ogg'` | 点击音效 URL（设为空则静音） |

### PixelButtonClassic

全宽纹理按钮，带悬停高亮效果。

<PixelButtonClassic>Classic 按钮</PixelButtonClassic>

```html
<PixelButtonClassic>Classic 按钮</PixelButtonClassic>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `sound-url` | `string` | `'/button.click.ogg'` | 点击音效 URL |

### PixelButton3D

带深度效果的可按压 3D 按钮。

<div class="demo-3d-row">
  <PixelButton3D>3D 按钮</PixelButton3D>
  <PixelButton3D height="9rem">高 3D 按钮</PixelButton3D>
</div>

```html
<PixelButton3D>3D 按钮</PixelButton3D>
<PixelButton3D height="9rem">高 3D 按钮</PixelButton3D>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `height` | `string` | `'3.6rem'` | 按钮高度（CSS 值） |
| `sound-url` | `string` | `'/button.click.ogg'` | 点击音效 URL |

<style>
.demo-3d-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  min-height: 10rem;
}
</style>

### PixelInput

带像素边框的文本输入框。

<PixelInput v-model="inputText" placeholder="输入内容" aria-label="单行输入示例" />

<p v-if="inputText">你输入了：<strong>{{ inputText }}</strong></p>

```html
<PixelInput v-model="inputText" />
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `model-value` | `string` | `''` | v-model 绑定值 |

### PixelTextarea

带自动调整大小的多行文本输入。

<PixelTextarea v-model="textareaText" placeholder="输入多行内容" aria-label="多行输入示例" style="width:100%;min-height:6rem" />

```html
<PixelTextarea v-model="textareaText" />
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `model-value` | `string` | `''` | v-model 绑定值 |

### PixelDialog

带标题、内容插槽和底部按钮的模态对话框。

<PixelButton @click="dialogOpen = true">打开对话框</PixelButton>

<PixelDialog v-model="dialogOpen" title="确认操作" @confirm="dialogOpen = false">
  <p>你确定要继续吗？</p>
  <p style="color:var(--pixel-color-text-muted);font-size:var(--pixel-font-size-m)">此操作无法撤销。</p>
</PixelDialog>

```html
<PixelButton @click="dialogOpen = true">打开对话框</PixelButton>

<PixelDialog
  v-model="dialogOpen"
  title="确认操作"
  cancel-text="取消"
  confirm-text="确认"
  @confirm="dialogOpen = false"
>
  <p>你确定要继续吗？</p>
</PixelDialog>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `model-value` | `boolean` | `false` | v-model 控制显示/隐藏 |
| `title` | `string` | `''` | 对话框标题 |
| `cancel-text` | `string` | `'取消'` | 取消按钮文字 |
| `confirm-text` | `string` | `'确认'` | 确认按钮文字 |
| `@confirm` | event | — | 点击确认按钮时触发 |

### PixelBadge

像素风格徽章，支持四种颜色类型、两种尺寸和空心样式。

<PixelBadge type="info">v1.1.0</PixelBadge>
<PixelBadge type="success">已完成</PixelBadge>
<PixelBadge type="warning">注意</PixelBadge>
<PixelBadge type="danger">重要</PixelBadge>
<PixelBadge type="info" outline>空心</PixelBadge>

```html
<PixelBadge type="info">v1.1.0</PixelBadge>
<PixelBadge type="success">已完成</PixelBadge>
<PixelBadge type="warning">注意</PixelBadge>
<PixelBadge type="danger">重要</PixelBadge>
<PixelBadge type="info" outline>空心</PixelBadge>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | 颜色类型 |
| `size` | `'sm' \| 'md'` | `'md'` | 尺寸 |
| `outline` | `boolean` | `false` | 空心样式 |

### PixelCard

像素风格卡片容器，支持标题、图标、链接和悬停效果。

<PixelCard title="快速开始" icon="🚀">
  几分钟内启动你的像素风格站点。
</PixelCard>

<PixelCard title="GitHub 仓库" icon="📦" href="https://github.com/Lylighte/pixel-eco">
  点击访问项目源码。
</PixelCard>

```html
<PixelCard title="快速开始" icon="🚀">
  几分钟内启动你的像素风格站点。
</PixelCard>

<PixelCard title="GitHub 仓库" icon="📦" href="https://github.com/Lylighte/pixel-eco">
  点击访问项目源码。
</PixelCard>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | `string` | `''` | 卡片标题 |
| `icon` | `string` | `''` | 标题图标（emoji 或文本） |
| `href` | `string` | `''` | 可选链接，有值时整卡可点击 |
| `hoverable` | `boolean` | `true` | 是否启用悬停效果 |

### PixelTooltip

像素风格悬浮提示，鼠标悬停或聚焦时显示。

<PixelTooltip text="HyperText Markup Language">
  HTML
</PixelTooltip>

```html
<PixelTooltip text="HyperText Markup Language">
  HTML
</PixelTooltip>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `text` | `string` | 必填 | 提示内容 |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 弹出方向 |

### PixelAccordion

像素风格折叠面板，点击标题展开/收起内容。

<PixelAccordion title="什么是 Pixel Eco？">
  一个像素风格的 VitePress 静态站点模板，内置丰富的像素 UI 组件。
</PixelAccordion>

<PixelAccordion title="默认展开" open>
  设置 <code>open</code> 属性可让面板默认展开。
</PixelAccordion>

```html
<PixelAccordion title="什么是 Pixel Eco？">
  一个像素风格的 VitePress 静态站点模板。
</PixelAccordion>

<PixelAccordion title="默认展开" open>
  设置 open 属性可让面板默认展开。
</PixelAccordion>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | `string` | 必填 | 折叠标题 |
| `open` | `boolean` | `false` | 默认展开 |

### PixelTabs

像素风格标签页切换，通过命名插槽分发内容。

<PixelTabs :tabs="['JavaScript', 'TypeScript', 'Python']">
  <template #tab-0>

```js
console.log('Hello from JavaScript!')
```

  </template>
  <template #tab-1>

```ts
const msg: string = 'Hello from TypeScript!'
console.log(msg)
```

  </template>
  <template #tab-2>

```python
print('Hello from Python!')
```

  </template>
</PixelTabs>

```html
<PixelTabs :tabs="['JavaScript', 'TypeScript', 'Python']">
  <template #tab-0>
    ...JavaScript 内容...
  </template>
  <template #tab-1>
    ...TypeScript 内容...
  </template>
  <template #tab-2>
    ...Python 内容...
  </template>
</PixelTabs>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `tabs` | `string[]` | 必填 | 标签页名称列表 |
| `active` | `number` | `0` | 默认激活索引 |

### PixelTimeline

像素风格时间线，交替左右布局，移动端自动切换为单列。

<PixelTimeline :items="[
  { date: '2026-06', title: 'Dev 1.1.1', content: '性能优化、搜索、5 个新组件' },
  { date: '2026-06', title: 'Release 1.1.0', content: 'SEO 修复、内容架构迁移' },
  { date: '2026-05', title: 'Release 1.0.0', content: '首个正式版本发布' },
]" />

```html
<PixelTimeline :items="[
  { date: '2026-06', title: 'Dev 1.1.1', content: '性能优化、搜索' },
  { date: '2026-06', title: 'Release 1.1.0', content: 'SEO 修复' },
  { date: '2026-05', title: 'Release 1.0.0', content: '首个正式版本' },
]" />
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `items` | `{ date, title, content }[]` | 必填 | 时间线条目，每项含日期、标题、内容 |

### PixelProgress

像素风格进度条，支持四种颜色和百分比显示。

<PixelProgress :value="75" label="项目进度" show-value />
<PixelProgress :value="60" color="success" label="已完成" show-value />
<PixelProgress :value="30" color="warning" label="进行中" />
<PixelProgress :value="90" color="danger" label="高风险" show-value />

```html
<PixelProgress :value="75" label="项目进度" show-value />
<PixelProgress :value="60" color="success" label="已完成" show-value />
<PixelProgress :value="30" color="warning" label="进行中" />
<PixelProgress :value="90" color="danger" label="高风险" show-value />
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `value` | `number` | 必填 | 进度值 (0-100) |
| `label` | `string` | `''` | 进度条标签 |
| `color` | `'accent' \| 'success' \| 'warning' \| 'danger'` | `'accent'` | 颜色类型 |
| `show-value` | `boolean` | `false` | 是否显示百分比 |
| `height` | `string` | `'16px'` | 进度条高度 |

---

## `layout/` — 布局组件

用于构建页面结构和区域划分。

### HomeHero

首页大图横幅，支持标题、副标题、描述、Logo 和自定义背景。支持单图或轮播模式。

> 此组件设计为全宽渲染，不适合在文档内容区直接预览。请在实际页面中使用。

```html
<!-- 单图模式 -->
<HomeHero
  title="像素生态"
  subtitle="创意驱动的社区"
  description="一个像素风格的静态站点模板"
/>

<!-- 轮播模式 -->
<HomeHero
  title="像素生态"
  :backgrounds="['/background/44.jpg', '/background/15.jpg', '/background/19.jpg']"
  :interval="4000"
/>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | `string` | `'Your Organization'` | 主标题 |
| `subtitle` | `string` | `''` | 副标题 |
| `description` | `string` | `''` | 描述文字 |
| `logo` | `string` | `'/logo.png'` | Logo 图片路径 |
| `background` | `string` | `''` | 单张背景图路径（不设置则使用渐变背景） |
| `backgrounds` | `string[]` | `[]` | 多张背景图，传入后启用轮播模式 |
| `interval` | `number` | `5000` | 自动切换间隔 (ms)，设为 0 停止自动切换 |
| `transition` | `'fade' \| 'slide'` | `'fade'` | 轮播过渡效果 |

> **注意**：`background` 和 `backgrounds` 互斥。传入 `backgrounds` 后 `background` 将被忽略。鼠标悬停 Hero 区域时轮播暂停。

### HomeIntro

图文介绍区块，支持左右布局切换。

<HomeIntro
  title="特色栏目"
  description="这里是文字介绍内容，图片显示在右侧（默认）。设置 right 属性可将图片切换到左侧。"
  image="/background/19.jpg"
/>

```html
<HomeIntro
  title="特色栏目"
  description="这里是文字介绍内容。"
  image="/background/19.jpg"
/>
<!-- 图片居左 -->
<HomeIntro
  title="特色栏目"
  description="图片在左侧显示。"
  image="/background/19.jpg"
  right
/>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | `string` | 必填 | 区块标题 |
| `description` | `string` | `''` | 描述文字 |
| `image` | `string` | `''` | 图片路径 |
| `right` | `boolean` | `false` | 图片居左（默认居右） |

### SiteFooter

全站页脚，包含版权信息和社交图标。**由 Layout 自动渲染，无需手动使用。**

| 属性 | 类型 | 默认值 | 描述 |
|:----:|:----:|:------:|:----:|
| 无 | — | — | 无需传参 |

### NavBar

顶部导航栏，支持点击音效。**由 Layout 自动渲染，无需手动使用。**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| 无 | — | — | 无需传参 |

### ScrollToTop

返回顶部按钮，页面滚动后右下角浮现。**全局注册，直接使用即可。**

<ScrollToTop />

```html
<!-- 通常放在 Layout 末尾，或 Markdown 页面底部 -->
<ScrollToTop />
```

| 属性 | 类型 | 默认值 | 描述 |
|:----:|:----:|:------:|:----:|
| 无 | — | — | 无需传参 |

---

## `content/` — 内容组件

用于展示结构化内容，如文章、卡片等。

### PixelImage

像素风格图片展示，支持懒加载和说明文字。

<PixelImage src="/background/19.jpg" alt="示例图片" caption="像素风格图片说明文字" />

```html
<PixelImage src="/background/19.jpg" alt="示例图片" caption="说明文字" />
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `src` | `string` | 必填 | 图片路径 |
| `alt` | `string` | `''` | 替代文本 |
| `caption` | `string` | `''` | 图片下方说明文字 |
| `width` | `number` | `800` | 图片宽度 |
| `height` | `number` | `600` | 图片高度 |
| `lazy` | `boolean` | `true` | 是否懒加载 |

### NewsCard

新闻列表卡片，带标题、描述、背景图和按钮。

<div style="display:flex;gap:1rem;flex-wrap:wrap">
  <NewsCard
    title="示例文章"
    brief="这是一篇示例文章的简短描述。"
    image="/background/44.jpg"
    link="/news/welcome"
  />
</div>

```html
<NewsCard
  title="示例文章"
  brief="这是一篇示例文章的简短描述。"
  image="/background/44.jpg"
  link="/news/welcome"
/>
```

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | `string` | 必填 | 卡片标题 |
| `brief` | `string` | `''` | 简短描述 |
| `image` | `string` | `''` | 卡片背景图片 |
| `link` | `string` | 必填 | 文章链接 |
| `button-text` | `string` | `'阅读更多'` | 按钮文字 |

### LinkCard

链接卡片网格，自动识别内外链（外链新标签打开，内链使用 `withBase`）。

<div style="display:flex;gap:1rem;flex-wrap:wrap">
  <LinkCard :link="{ name: '快速开始', url: '/docs/quick-start', image: '/background/19.jpg', description: '几分钟内启动站点' }" />
  <LinkCard :link="{ name: 'Pixel Eco', url: 'https://github.com/Lylighte/pixel-eco', description: 'GitHub 仓库' }" />
</div>

```html
<LinkCard :link="{
  name: '快速开始',
  url: '/docs/quick-start',
  image: '/background/19.jpg',
  description: '几分钟内启动站点'
}" />
```

| 属性 | 类型 | 描述 |
|------|------|------|
| `link` | `object` | 必填。包含以下字段： |
| `link.name` | `string` | 卡片标题 |
| `link.url` | `string` | 链接地址（自动识别内外链） |
| `link.image` | `string` | （可选）卡片背景图片 |
| `link.description` | `string` | （可选）描述文字 |

### DocsSidebar

文档侧边栏导航，可折叠。**由 Layout 自动渲染，无需手动使用。**

| 属性 | 类型 | 默认值 | 描述 |
|:----:|:----:|:------:|:----:|
| 无 | — | — | 无需传参 |

### ArticleView

新闻文章详情页布局，含封面图、作者信息、日期和标签。**由 Layout 自动渲染，无需手动使用。**

| 属性 | 类型 | 描述 |
|------|------|------|
| `title` | `string` | 文章标题 |
| `author` | `object` | 作者信息 `{ name, avatar, tags? }` |
| `date` | `string` | 发布日期 |
| `end-date` | `string` | （可选）结束日期 |
| `cover` | `string` | 封面图路径 |
| `category` | `string` | 文章分类 |

---

## 字号阶梯

全站仅使用以下四档字号，以 16px 根字号对齐像素字体；组件样式引用令牌，不使用任意小数或相对正文缩放的 `em` 字号。

| 令牌 | 字号 | 用途 |
|------|------|------|
| `--pixel-font-size-s` | 0.75rem / 12px | 标签、元信息、辅助说明 |
| `--pixel-font-size-m` | 1rem / 16px | 正文、输入框、导航、三级标题 |
| `--pixel-font-size-title` | 1.25rem / 20px | 二级标题、卡片标题 |
| `--pixel-font-size-l` | 1.5rem / 24px | 一级标题、主标题 |

正文使用 Unifont，标题使用 Ark Pixel，代码使用 Monocraft；保留现有字体栈，不通过缩放、合成粗体或合成斜体制造层级。

### 正文与无障碍示例

正文统一为 16px / 1.7。**重要强调**使用强调色，*补充强调*使用像素底边；[正文链接](/docs/quick-start)与 [`代码链接`](/docs/components#pixelbutton) 使用虚线下划线，悬停时改为实线。使用 Tab 键可以同时看到链接下划线和焦点框。

> 引用在新闻、文档与关于页共用强调色硬边框和暗色背景。

<p>文本标记：<mark>需要关注的内容</mark>；键盘操作：<kbd>Tab</kbd>、<kbd>Enter</kbd>、<kbd>Space</kbd>。</p>

## `icons/` — 图标组件

图标组件通常由 `SiteFooter` 内部使用，也可在自定义布局中直接引用。

| 组件 | 用途 | 说明 |
|------|------|------|
| `GithubIcon` | GitHub 社交图标 | 深色圆形背景，白色 Octocat 标志 |
| `BilibiliIcon` | Bilibili 社交图标 | 粉色圆形背景，白色 B 站标志 |
| `QQIcon` | QQ 社交图标 | 圆形背景，企鹅标志 |

---

## 边框工具类

使用 `.pixel-border` 类为任意元素添加像素风格边框。

<div class="pixel-border" style="padding:2rem;text-align:center;max-width:400px;margin:1rem auto">
  <p><code>.pixel-border</code> 内部的内容</p>
</div>

```html
<div class="pixel-border">
  <p>内容放在 .pixel-border 内部</p>
</div>
```
