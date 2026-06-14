---
layout: page
---

# 部署

构建站点并部署到静态托管服务。

## 构建

```bash
npm run build
```

输出目录为 `.vitepress/dist/`，包含静态 HTML、CSS、JS 和资源文件，可直接用于部署。

### 部署模式

项目通过 `BASE_PATH` 环境变量区分两种模式：

| 模式 | BASE_PATH | SEO / RSS | 适用场景 |
|------|-----------|-----------|---------|
| **absolute**（默认） | `/` | 自动开启 | 本地开发、自定义域名 |
| **子路径** | `/repo-name/` | 自动开启 | GitHub Pages 项目站点 |

GitHub Pages 用户无需手动设置——CI 工作流会自动注入。Netlify / Vercel 用户需在平台环境变量中设置 `BASE_PATH=/`。

## 本地预览

```bash
npm run preview
```

在本地预览构建结果，确认一切正常后再部署。

## 部署到 GitHub Pages

1. 将仓库推送到 GitHub
2. 进入仓库 **Settings → Pages**
3. 将 **Source** 设置为 **GitHub Actions**
4. 推送后 Actions 会自动构建部署

项目已自带 `.github/workflows/deploy.yml`，无需额外创建。每次推送 `main` 分支都会自动构建并发布。

## 部署到 Netlify

1. 在 Netlify 中连接你的 Git 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.vitepress/dist`
4. 添加环境变量：`BASE_PATH` = `/`
5. 部署！

## 部署到 Vercel

1. 在 Vercel 中导入你的 Git 仓库
2. 框架预设：**VitePress**
3. 添加环境变量：`BASE_PATH` = `/`
4. Vercel 会自动检测构建设置 — 点击部署即可

## 自定义域名

所有平台都支持自定义域名。请参考各平台的文档配置 DNS 和 SSL。