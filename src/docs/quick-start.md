---
layout: page
title: 快速开始
sidebarGroup: 入门指南
sidebarGroupOrder: 1
sidebarOrder: 1
cardDescription: 安装、运行并了解项目结构。
cardImage: /background/19.jpg
---

# 快速开始

几分钟内启动你的像素风格站点。

## 环境要求

- **Node.js** 22 或更高版本
- 代码编辑器（推荐 VS Code）

## 搭建步骤

```bash
# 克隆仓库
git clone https://github.com/Lylighte/pixel-eco.git
cd pixel-eco

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173`，即可看到像素主题的首页。

## 项目结构

```
pixel-eco/
├── src/                       # 内容源文件
│   ├── index.md               # 首页
│   ├── about.md               # 关于页面
│   ├── search.md              # 站内搜索页面
│   ├── 404.md                 # 404 页面
│   ├── news/                  # 新闻文章
│   ├── docs/                  # 文档页面
│   └── public/                # 静态资源
│       ├── logo.png           # 站点 Logo（主）
│       ├── logo.svg           # 站点 Logo（设计源文件）
│       ├── favicon.ico        # 浏览器标签页图标
│       ├── 404.png            # 404 页面图片
│       ├── button.click.ogg   # 按钮点击音效
│       ├── background/        # 背景图片
│       └── fonts/             # 像素字体（Ark Pixel、Monocraft、Unifont）
├── .vitepress/
│   ├── config.ts              # 站点配置（标题、导航等）
│   └── theme/
│       ├── index.ts           # 主题入口（注册组件）
│       ├── Layout.vue         # 自定义页面布局
│       ├── components/        # Pixel UI 组件
│       │   ├── ui/            # 按钮、输入框、徽章、卡片等 13 个组件
│       │   ├── layout/        # Hero、页脚、返回顶部
│       │   ├── content/       # 卡片、侧边栏
│       │   └── icons/         # 社交图标
│       └── styles/            # CSS 变量、字体、动画
├── pagefind.json              # 搜索索引配置
├── package.json
├── tsconfig.json
└── README.md
```

## 关键文件

| 文件 | 用途 |
|------|------|
| `.vitepress/config.ts` | 站点标题、导航链接、社交链接 |
| `.vitepress/theme/styles/vars.css` | 调色板和 CSS 变量 |
| `src/index.md` | 首页内容 |
| `src/public/logo.png` | 站点 Logo |

## 下一步

- **[自定义](/docs/customization)** — 修改颜色、Logo 和背景
- **[新闻指南](/docs/news)** — 撰写第一篇新闻文章
- **[组件参考](/docs/components)** — 探索可用 UI 组件
- **[部署](/docs/deployment)** — 构建并发布你的站点
