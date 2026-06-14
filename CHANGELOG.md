# Changelog

## Release 1.2.0

> 2026/06/14: 性能优化、站内搜索、8 个新 UI 组件、文档完善。

### 🚀 性能优化
- 所有图片添加显式 `width`/`height`，消除 CLS
- Hero 首图 `fetchpriority="high"`，其余懒加载
- 预加载 Ark Pixel CJK/Latin 关键字体，减少 LCP 延迟

### 🔍 站内搜索
- 基于 Pagefind 的独立搜索页面（`src/search.md`），构建时自动生成索引
- 导航栏新增搜索入口，零运行时外部依赖
- 支持中文分词，300ms 防抖，base 路径自适应

### 🧩 新 UI 组件（8 个）

| 组件 | 用途 |
|------|------|
| `PixelBadge` | 徽章标签，4 种颜色、2 种尺寸、空心样式 |
| `PixelCard` | 通用卡片容器，标题/图标/链接/悬停效果 |
| `PixelTooltip` | 悬浮提示，4 方向定位 |
| `PixelAccordion` | 折叠面板，键盘无障碍 |
| `PixelTabs` | 标签页切换，命名插槽内容分发 |
| `PixelTimeline` | 时间线，交替左右布局、移动端自适应 |
| `PixelProgress` | 进度条，4 种颜色、百分比显示 |
| `PixelImage` | 图片展示，懒加载 + 说明文字 |

### 🎨 样式修复
- 组件硬编码字号统一为 Design Tokens
- PixelTextarea 移除精灵图残留，边框与 PixelInput 对齐
- 输入框字体统一使用 Unifont
- HomeIntro 文字对齐跟随图片位置，移动端统一左对齐

### ✨ 功能增强
- HomeHero 支持多图轮播（fade 过渡、自动切换、悬停暂停）
- 首页启用三图轮播演示

### 📝 文档
- 所有文档适配当前项目状态（结构树、BASE_PATH、导航示例）
- 新增站内搜索配置说明
- CHANGELOG 精简，pre-release 三段合并为 12 步清理摘要

## Release 1.1.0

> 2026/06/11: SEO 页面级标签修复、部署实操文档完善、内容架构迁移、文档质量收尾。

### SEO 修复
- **config.ts**: 新增 `transformHead` 钩子，`canonical`/`og:url`/`og:title`/`og:description`/`twitter:title`/`twitter:description` 按页面动态生成
- **config.ts**: 全局 `head` 精简，移除被 `transformHead` 覆盖的页面级标签，移除 `as any` 类型规避
- **config.ts**: sitemap 添加 `transformItems` 过滤 `404.html`
- **404.md**: frontmatter 添加 `sitemap: false`（双保险）

### 内容架构迁移（Dev 1.0.2）
- **srcDir 迁移**：`index.md`、`about.md`、`404.md`、`news/`、`docs/` 统一移入 `src/`
- **public 迁移**：`public/` 移入 `src/public/`（VitePress `srcDir` 默认行为）
- **config.ts**：添加 `srcDir: 'src'`
- **README.md** / **quick-start.md**：结构树同步更新

### 路径配置变更（Dev 1.0.2）
- **默认 base** 从 `'./'` 改为 `'/'`，解决 `npm run dev` 导航嵌套和 `npm run preview` 空白页问题
- **CI 部署**：通过 `BASE_PATH` 环境变量注入子路径，行为不变
- **IS_RELATIVE** 逻辑随新默认值自动调整，SEO/OG/RSS 默认启用

### 文档质量收尾（Dev 1.0.1）
- **deployment.md**: 移除多余代码块结束标记
- **components.md**: PixelButton3D 高度默认值修正，PixelDialog 默认值中文化，全面改写覆盖全部 19 个组件
- **customization.md**: 修复页脚配置虚构字段，社交链接示例更新
- **quick-start.md**: 移除不存在的 `data/` 目录，补全项目结构树
- **news.md**: NewsCard 属性表补充 `button-text`
- **news/index.md**: 新闻卡片日期 `2025` → `2026`
- **about.md** / **SiteFooter.vue**: 占位 URL `example.com` → 实际仓库地址
- **config.ts**: 移除 `IS_DEV` 死代码

### 部署文档
- **deployment-guide.md**: 新增实操步骤（构建→上传→权限修复→Nginx→验证），补充 403/SELinux/404 排错表
- **README.md**: 部署节补充自定义域名 + Nginx 说明，新增平台部署表

### 项目治理
- 清理 8 个已完成计划文件，`dev-notes/` 仅保留部署指南
- **config.ts**: 三段式重组——品牌标识/部署路径/VitePress 配置分离，提取 `SITE_AUTHOR`/`SITE_NAME_OG`/`COPYRIGHT_TEXT` 常量，自定义站点只需修改第一段 7 个常量

## Release 1.0.0

> 2026/06/07: 正式发布版本。经过多个阶段的重构和完善，模板功能完备、设计统一、文档完善，适合使用。

- `about.md` 改为占位内容。

由于经历对生产环境配置问题的大范围更改，代码现状可能并不够清晰，期待后续版本逐步优化重构，提升代码质量和可维护性。

## pre-release

> 从原始 Minecraft 组织门户 SPA 到通用像素风格 VitePress 模板的完整转型。

### 项目溯源

本模板源自一个 Minecraft 组织门户项目（Vite + Vue 3 SPA，含后端 API、管理后台），经过以下清理步骤转型为通用静态站点模板：

| 步骤 | 内容 |
|------|------|
| 1. 剥离后端 | 删除 `src/api/`（8 个 API 文件）、管理/认证视图（8 个）、耦合组件（TreeViewer、PdfViewer），重写为静态数据驱动 |
| 2. 迁移 VitePress | SPA → VitePress 静态站点，移植 12 个风格组件，创建 6 个 Markdown 页面替代 SPA 视图 |
| 3. 清理资源 | 移除 PDF.js（~10MB）、NMO 专属资源、62 张背景图 → 精选 4 张；删除旧 SPA 入口/路由/数据层 |
| 4. 去 Minecraft 化 | 组件名 `MinecraftButton` → `PixelButton`，CSS 变量 `--minecraft-*` → `--pixel-*`，移除游戏特有术语 |
| 5. 文档体系 | 旧 SPA DocsBrowser → 原生 `.md` + `DocsSidebar.vue`，5 个真实指南替代 8 个占位文档 |
| 6. 像素字体 | 三层字体栈：Ark Pixel（标题）+ Monocraft（代码）+ Unifont（正文），Monocraft TTF→woff2 缩减 82% |
| 7. Design Tokens | `vars.css` 三层架构（Primitives/Semantic/Component），16 个组件硬编码 → CSS 变量 |
| 8. 品牌换色 | 主题色绿 `#3c8527` → 红 `#d84b4b`，变量名 `--pixel-green*` → `--pixel-brand*` |
| 9. 纯 CSS 化 | 12 张精灵图 PNG → `box-shadow`/`border` 纯 CSS，删除 `bgbtn.jpg` |
| 10. 像素打磨 | 字体抗锯齿优化、字号对齐 12px 网格、颜色提亮、Logo 设计 |
| 11. 全站中文化 | 所有页面、文档、组件文本中文化 |
| 12. 发布准备 | SEO/OG/Sitemap/RSS、图片懒加载、CI/CD 自动部署、Dev 动态 base 路径 |

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | VitePress 1.6 |
| 前端 | Vue 3.5 + TypeScript 5.8 |
| 字体 | Ark Pixel（标题）+ Monocraft（代码）+ Unifont（正文）|
| 主题色 | 红色 `#d84b4b`（`--pixel-brand*` 变量）|
| 构建 | `npx vitepress build`，约 2.5s |
| 输出 | 纯静态，无后端依赖 |