---
layout: page
title: 部署
sidebarGroup: 入门指南
sidebarGroupOrder: 1
sidebarOrder: 3
cardDescription: 构建生产版本并部署到静态托管。
cardImage: /background/44.jpg
---

# 部署

构建站点并部署到静态托管服务。

## 构建

```bash
npm run build
```

输出目录为 `.vitepress/dist/`，包含静态 HTML、CSS、JS 和资源文件，可直接用于部署。

### 部署模式

通过 `SITE_URL` 设置完整公开地址，包含部署子路径。尾部斜杠会自动补齐，生产 `base`、canonical、Open Graph 地址、RSS 和 sitemap 都从此地址推导。仓库链接独立配置。

| SITE_URL | 生产 base | 公开地址元数据 / RSS / sitemap |
|----------|-----------|------------------------------|
| 不设置 | `/` | 不生成；仍保留标题、描述等普通元数据 |
| `https://example.com/` | `/` | 启用 |
| `https://example.com/community/` | `/community/` | 启用 |

PowerShell 示例：

```powershell
$env:SITE_URL = 'https://example.com/community/'
npm run build
npm run preview
```

Linux / macOS：

```bash
SITE_URL=https://example.com/community/ npm run build
SITE_URL=https://example.com/community/ npm run preview
```

预览子路径构建时，应使用与构建相同的环境变量，然后访问预览日志显示的子路径地址。开发服务器默认使用 `/`，不需要在本地访问生产子路径。地址仅接受 HTTP/HTTPS，不允许用户名、密码、查询参数或片段。

`BASE_PATH` 保留兼容：单独配置时可用于无公开域名的子路径构建；同时设置 `SITE_URL` 时，两者的路径必须一致，否则构建报错。`BASE_PATH=./` 不再支持，请迁移到 `/` 或 `/community/` 等绝对子路径。不要再从 GitHub 用户名推导站点公开地址。

首页的 canonical 为站点根地址；栏目 `index.md` 使用目录地址（如 `/news/`）；普通文章保留 `.html`（如 `/news/welcome.html`）。

### 草稿与生产输出

任何内容页面设置 `draft: true` 后，在开发环境可查看；生产构建不生成该页面，也不包含在新闻列表、文档卡片、侧边栏、RSS、sitemap 或 Pagefind 中。只能使用布尔值 `true` / `false`，不要写字符串 `"false"`。

已发布页面不要手写指向草稿的链接，生产构建会按断链处理。草稿不提供访问权限管理；`src/public/` 中的静态文件仍会复制到输出目录。新闻和文档的自动列表目前只收集各自目录的顶层 Markdown。

运行 `npm run test:build` 可验证无公开域名、根路径、自定义子路径和 Pages 构建，以及已发布页面改为草稿后旧产物被移除。此检查会重建 `.vitepress/dist/`，最后留下 Pages 测试地址的构建；正式部署前请用自己的配置重新构建。

## 本地预览

```bash
npm run preview
```

在本地预览构建结果，确认一切正常后再部署。

## 部署到 GitHub Pages

1. 将仓库推送到 GitHub
2. 进入仓库 **Settings → Pages**
3. 将 **Source** 设置为 **GitHub Actions**
4. 进入 **Actions → 部署到 GitHub Pages → Run workflow** 手动发布

项目已自带 `.github/workflows/deploy.yml`，使用 Node.js 22。当前仅支持 `workflow_dispatch` 手动触发；工作流从 `actions/configure-pages` 的 `base_url` 注入完整 `SITE_URL`，包括 Pages 自定义域名或项目子路径。

## 部署到 Netlify

1. 在 Netlify 中连接你的 Git 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.vitepress/dist`
4. 添加环境变量：`SITE_URL` = 站点完整公开地址（如 `https://example.netlify.app/`）
5. 部署！

## 部署到 Vercel

1. 在 Vercel 中导入你的 Git 仓库
2. 框架预设：**VitePress**
3. 添加环境变量：`SITE_URL` = 站点完整公开地址（如 `https://example.vercel.app/`）
4. Vercel 会自动检测构建设置 — 点击部署即可

## 自定义域名

所有平台都支持自定义域名。请参考各平台的文档配置 DNS 和 SSL。

如需在 Caddy 上显式设置 RSS / sitemap 的 UTF-8 响应头，可以使用以下配置；网站服务配置与模板构建相互独立。子路径部署需相应修改匹配路径。

```text
header /feed.rss {
    Content-Type "application/rss+xml; charset=utf-8"
    defer
}
header /sitemap.xml {
    Content-Type "application/xml; charset=utf-8"
    defer
}
```
