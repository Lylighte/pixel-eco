# Pixel Eco 模板

基于 VitePress 的像素风格静态站点模板，内置像素 UI 组件。适用于社区门户、组织主页、创意项目展示等场景。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | VitePress 1.6 + Vue 3.5 |
| 语言 | TypeScript 5.8 |
| 输出 | 纯静态 HTML/CSS/JS |
| 字体 | Ark Pixel（标题）+ Monocraft（代码）+ Unifont（正文） |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/Lylighte/pixel-eco.git
cd pixel-eco

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173` 即可看到像素风格首页。

## 项目结构

```
pixel-eco/
├── .vitepress/
│   ├── config.ts              # 站点配置（标题、导航等）
│   └── theme/
│       ├── index.ts           # 主题入口（注册组件）
│       ├── Layout.vue         # 自定义页面布局
│       ├── components/
│       │   ├── ui/            # 按钮、输入框、对话框
│       │   ├── layout/        # Hero、页脚、返回顶部
│       │   └── content/       # 卡片、侧边栏
│       └── styles/            # CSS 变量、字体、动画
├── index.md                   # 首页
├── about.md                   # 关于页
├── news/                      # 新闻文章
├── docs/                      # 文档页面
└── public/                    # 静态资源
    ├── logo.png               # 站点 Logo（主）
    ├── logo.svg               # 站点 Logo（设计源文件）
    ├── favicon.ico            # 浏览器图标
    ├── background/            # 背景图片
    └── fonts/                 # 像素字体文件
```

## 自定义

### 基本设置

编辑 `.vitepress/config.ts` 修改站点标题、描述和导航：

```ts
export default defineConfig({
  title: '像素生态',
  description: '创意驱动的社区',
  // ...
})
```

### 替换资源

| 文件 | 用途 |
|------|------|
| `public/logo.png` | 站点 Logo（主，192×192） |
| `public/logo.svg` | 站点 Logo（设计源文件） |
| `public/favicon.ico` | 浏览器标签页图标 |
| `public/background/15.jpg` | 首页 / 关于页配图 |
| `public/background/19.jpg` | 首页特色栏目配图 |
| `public/background/28.jpg` | 新闻 / 文档卡片配图 |
| `public/background/44.jpg` | 首页 / 新闻卡片配图 |
| `public/background/bgbtn.png` | Classic 按钮纹理 |

### 编辑内容

所有页面内容均为 Markdown 文件，存放在仓库根目录：

| 文件 | 内容 |
|------|------|
| `index.md` | 首页（Hero + 特色栏目） |
| `about.md` | 关于页面 |
| `news/index.md` | 新闻列表 |
| `news/welcome.md` | 示例新闻文章 |
| `news/community-update.md` | 示例新闻文章 |
| `docs/index.md` | 文档中心 |

### 添加新闻

在 `news/` 目录下新建 `.md` 文件，添加 frontmatter：

```md
---
title: 我的新文章
date: 2025-07-01
author:
  name: 作者名
  avatar: /background/44.jpg
cover: /background/44.jpg
category: 公告
---

# 我的新文章

正文内容……
```

然后在 `news/index.md` 中添加对应的 `<NewsCard>`。

### CSS 变量

在 `.vitepress/theme/styles/vars.css` 中自定义颜色：

```css
:root {
  --pixel-brand: #d84b4b;        /* 品牌主色 */
  --pixel-brand-light: #e48181;  /* 浅色（悬停态） */
  --pixel-brand-dark: #7e1b1b;   /* 深色（按下态） */
  --pixel-dark: #171615;         /* 页面背景 */
  --background-card: #313131;    /* 卡片背景 */
}
```

### 字体方案

模板使用三层像素字体栈：

| 层级 | 字体 | 应用于 |
|------|------|--------|
| 标题 | Ark Pixel 12px | `h1`–`h6` |
| 代码 | Monocraft | `code`、`pre`、`kbd`、`samp` |
| 正文 | Unifont | 默认正文 |

字体文件位于 `public/fonts/`，`@font-face` 声明在 `.vitepress/theme/styles/fonts.css`。

**替换字体：**

1. 将 `.woff2` 或 `.ttf` 文件放入 `public/fonts/`
2. 更新 `fonts.css` 中的 `@font-face`
3. 更新 `vars.css` 中的 `font-family`

**移除像素字体：**

1. 删除 `public/fonts/` 目录
2. 从 `.vitepress/theme/index.ts` 中移除 `import './styles/fonts.css'`
3. 从 `vars.css` 中移除标题/代码的 `font-family` 规则

**可选像素正文** — 给任意元素添加 `class="pixel-text"` 即可使用全像素渲染。

## 内置组件

| 组件 | 说明 |
|------|------|
| `PixelButton` | 像素按钮（普通/深色/静音） |
| `PixelButtonClassic` | 全宽纹理按钮 |
| `PixelButton3D` | 3D 立体按钮（可调高度） |
| `PixelInput` | 像素风格文本输入框 |
| `PixelTextarea` | 像素风格多行文本框 |
| `PixelDialog` | 模态对话框 |
| `HomeHero` | 首页大图横幅 |
| `HomeIntro` | 首页图文介绍（支持左右布局） |
| `NewsCard` | 新闻卡片 |
| `LinkCard` | 链接卡片（自动识别内外链） |
| `DocsSidebar` | 文档侧边栏导航 |
| `ScrollToTop` | 返回顶部按钮 |
| `.pixel-border` | 像素边框工具类 |

详见 [组件参考](/docs/components)。

## 构建与部署

```bash
# 生产构建
npm run build

# 本地预览构建结果
npm run preview
```

构建产物在 `.vitepress/dist/`，可部署到任意静态托管服务（GitHub Pages、Netlify、Vercel 等）。

## 项目起源

本模板最初源自一个 Minecraft 社区门户项目，灵感来源于 [neco](https://github.com/RandomLemon/neco)。经过多阶段重构转型为通用像素风格静态站点模板。感谢所有开源依赖的作者和贡献者。

## 许可证

MIT
