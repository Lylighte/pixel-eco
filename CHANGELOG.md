# Changelog

## Dev 1.1.2

> 2026/06/14: 文档适配当前项目状态。

### 文档更新
- **quick-start.md**: 项目结构树补充 `search.md`、`pagefind.json`、`icons/` 目录，组件数更新为 13
- **customization.md**: BASE_PATH 默认值修正（`./` → `/`），导航示例添加搜索入口，新增站内搜索配置说明
- **news.md**: frontmatter 日期示例 `2025` → `2026`
- **deployment.md**: 部署模式表更新，移除已废弃的 relative 模式

## Dev 1.1.1

> 2026/06/14: Lighthouse 性能优化、HomeHero 轮播功能。

### 性能优化
- **HomeHero.vue**: hero 图片添加 `width`/`height` 和 `fetchpriority="high"`
- **HomeHero.vue**: logo 图片添加 `width`/`height`
- **HomeIntro.vue**: intro 图片添加 `width`/`height`
- **ArticleView.vue**: 封面图和头像添加 `width`/`height`
- **config.ts**: 预加载 Ark Pixel CJK/Latin 字体，减少 LCP 延迟

### 新功能
- **HomeHero.vue**: 新增 `backgrounds`/`interval`/`transition` props，支持多图轮播
- **HomeHero.vue**: 轮播模式：fade 过渡、自动切换、鼠标悬停暂停、IntersectionObserver 视口外暂停
- **HomeHero.vue**: 首张图 `fetchpriority="high"`，其余懒加载；向后兼容单图 `background` 用法
- **src/index.md**: 首页启用三图轮播演示
- **components.md**: 补充轮播模式文档，移除文档页内 HomeHero 实际渲染（避免出格）
- **search.md**: 新增独立搜索页面，基于 Pagefind 构建时索引，支持中文搜索
- **package.json**: 添加 `postbuild` 钩子自动生成 Pagefind 索引，添加 `build:search` 调试脚本
- **pagefind.json**: 配置排除导航、页脚等公共 UI 区域
- **config.ts**: 导航栏添加搜索入口
- **PixelBadge.vue**: 新增像素徽章组件，支持 info/success/warning/danger 四种类型、sm/md 尺寸、outline 空心样式
- **PixelCard.vue**: 新增像素卡片容器，支持标题/图标/链接/悬停效果
- **PixelTooltip.vue**: 新增像素悬浮提示，支持 top/bottom/left/right 四个方向
- **PixelAccordion.vue**: 新增像素折叠面板，支持默认展开、键盘无障碍
- **PixelTabs.vue**: 新增像素标签页切换，支持命名插槽内容分发
- **PixelTimeline.vue**: 新增像素时间线，交替左右布局、移动端自适应单列
- **PixelProgress.vue**: 新增像素进度条，支持 4 种颜色、百分比显示、自定义高度

### 样式修复
- **PixelBadge.vue / PixelCard.vue / PixelAccordion.vue**: 硬编码字号统一为 Design Tokens
- **PixelTextarea.vue**: 移除精灵图残留 `border-image`，边框样式与 PixelInput 对齐
- **PixelInput.vue / PixelTextarea.vue**: 添加 `font-family: var(--pixel-font-body)`，统一使用 Unifont
- **PixelTabs.vue**: 内容区字号改为正文字号 `--pixel-font-size-m`
- **HomeIntro.vue**: 文字对齐跟随图片位置（图右文左、图左文右），移动端统一左对齐
- **PixelTimeline.vue**: 移除 `pixel-border`，文字对齐跟随左右布局
- **components.md**: 补充 5 个新组件文档，添加 `Ctrl+F` 搜索提示

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