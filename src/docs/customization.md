---
layout: page
---

# 自定义

让模板成为你自己的——更改品牌标识、颜色和布局。

## 站点标识

编辑 `.vitepress/config.ts` 顶部的变量：

```ts
const GITHUB_USERNAME = 'Lylighte'   // 替换为你的 GitHub 用户名
const REPO_NAME = 'pixel-eco'        // 替换为你的仓库名
```

这两个变量会自动推导 GitHub Pages 地址、SEO 元标签和 RSS 订阅地址。

### 部署路径

`BASE_PATH` 环境变量控制站点部署的子路径：

| 场景 | BASE_PATH | 说明 |
|------|-----------|------|
| 本地开发 | 不设置（默认 `/`） | 根路径，`npm run dev` 直接访问 |
| GitHub Pages | CI 自动注入 | `configure-pages@v4` 自动设置 |
| Netlify / Vercel | 设为 `/` | 根路径部署 |
| 自定义域名 | 设为 `/` | 根路径部署 |

非 relative 模式下（`BASE_PATH` 为绝对路径），SEO 元标签、Open Graph、Twitter Card、sitemap 和 RSS 会自动启用。可通过 `SITE_URL` 环境变量覆盖自动推导的站点地址。

```ts
// RSS 只需域名，不含子路径
const RSS_BASE = IS_RELATIVE ? '' : `https://${GITHUB_USERNAME}.github.io`
```

## Logo

替换 `public/logo.png` 为你自己的 Logo。Logo 会出现在导航栏和首页 Hero 中。

- **`public/logo.png`** — 主 Logo（192×192 PNG）
- **`public/logo.svg`** — 设计源文件（8×8 viewBox）
- **`public/favicon.ico`** — 浏览器标签页图标

## 导航

在 `config.ts` 中添加、移除或重新排序导航项：

```ts
themeConfig: {
  nav: [
    { text: '首页', link: '/' },
    { text: '新闻', link: '/news/' },
    { text: '文档', link: '/docs/' },
    { text: '搜索', link: '/search' },
    { text: '关于', link: '/about' },
  ],
}
```

## 颜色

所有颜色在 `.vitepress/theme/styles/vars.css` 中定义为 CSS 自定义属性。覆盖它们以匹配你的品牌：

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `--pixel-brand` | `#d84b4b` | 品牌主色 |
| `--pixel-brand-light` | `#e48181` | 浅色（悬停态） |
| `--pixel-brand-dark` | `#7e1b1b` | 深色（按下态） |
| `--pixel-gray-light` | `#747271` | 浅灰（边框） |
| `--pixel-gray` | `#3d3938` | 中灰（卡片背景） |
| `--pixel-gray-dark` | `#262524` | 深灰（表面） |
| `--pixel-dark` | `#171615` | 页面背景 |
| `--background-card` | `#313131` | 卡片/面板背景 |

示例 — 切换为蓝色主题：

```css
:root {
  --pixel-brand: #2563eb;
  --pixel-brand-light: #60a5fa;
  --pixel-brand-dark: #1d4ed8;
}
```

## 背景图片

替换 `public/background/` 中的图片：

| 文件 | 使用位置 |
|------|----------|
| `15.jpg` | 首页 / 关于页 |
| `19.jpg` | 首页特色栏目 |
| `28.jpg` | 新闻 / 文档卡片 |
| `44.jpg` | 首页 / 新闻卡片 |
| `bgbtn.png` | Classic 按钮纹理 |

## 页脚

在 `config.ts` 中编辑页脚：

```ts
footer: {
  copyright: '© 2026-Present Pixel Eco. 保留所有权利。',
}
```

## 社交链接

添加 GitHub、Bilibili、QQ 等社交链接：

```ts
socialLinks: [
  { icon: 'github', link: 'https://github.com/你' },
  { icon: 'bilibili', link: 'https://space.bilibili.com/你' },
  { icon: 'qq', link: 'https://你的QQ群链接' },
]
```

模板内置了 `github`、`bilibili`、`qq` 三个图标组件。VitePress 还内置了 `twitter`、`discord`、`youtube` 等图标，详见 [VitePress 文档](https://vitepress.dev/zh/reference/default-theme-nav#social-links)。

## 站内搜索

项目使用 Pagefind 提供独立搜索页面。搜索索引在 `npm run build` 时自动生成。

### 启用/禁用

搜索页面 `src/search.md` 默认存在，导航栏已包含入口。如需移除：

1. 删除 `src/search.md`
2. 在 `config.ts` 导航栏中移除 `{ text: '搜索', link: '/search' }`
3. 删除 `pagefind.json` 和 `package.json` 中的 `postbuild` 脚本

### 自定义搜索样式

编辑 `src/search.md` 中的 `<style>` 块，修改输入框和搜索结果的像素风格。

### 排除页面

在 `pagefind.json` 中配置 `exclude_selectors` 排除不需要索引的 UI 区域：

```json
{
  "exclude_selectors": ["nav", "footer", ".pixel-search"]
}
```

## 文档管理

添加、修改或删除文档页面，并同步更新侧边栏导航。

### 新建文档页

在 `docs/` 目录下创建 `.md` 文件：

```bash
docs/my-guide.md
```

顶部添加 YAML frontmatter：

```md
---
layout: page
---
```

### 更新侧边栏

文档侧边栏导航硬编码在 `DocsSidebar.vue` 中：

**文件位置：** `.vitepress/theme/components/content/DocsSidebar.vue`

定位到 `nav` 数组，按以下结构编辑：

```ts
const nav = [
  {
    title: '分组名称',
    items: [
      { text: '页面标题', link: '/docs/quick-start' },
      { text: '页面标题', link: '/docs/my-guide' },
    ],
  },
]
```

| 字段 | 描述 |
|------|------|
| `title` | 分组标题（如"入门指南""内容创作"） |
| `items[].text` | 侧边栏显示的文字 |
| `items[].link` | 页面链接，`/docs/文件名` |

### 添加到文档首页

在 `docs/index.md` 中添加对应的 `<LinkCard>`：

```html
<LinkCard :link="{ name: '指南名称', url: '/docs/my-guide', image: '/background/19.jpg', description: '简短描述' }" />
```
