import { defineConfig, type HeadConfig } from 'vitepress'
import { RssPlugin } from 'vitepress-plugin-rss'

// ============================================================
// 基础配置
// ============================================================
const GITHUB_USERNAME = 'Lylighte'
const REPO_NAME = 'pixel-eco'

// 部署基础路径
// - Dev 模式强制 '/'（避免相对路径导航嵌套 bug）
// - 默认 '/'，本地开发、预览、根路径部署均正常
// - CI 部署时通过环境变量 BASE_PATH 覆盖（如 /pixel-eco/）
// - configure-pages@v4 返回无尾部斜杠，此处强制补齐
const IS_DEV = process.argv[2] === 'dev'
const BASE_PATH = IS_DEV ? '/' : (process.env.BASE_PATH || '/').replace(/\/?$/, '/')
const IS_RELATIVE = BASE_PATH === './'

const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`

// 非 relative 模式下推导 SITE_URL（用于 SEO/OG/sitemap）
// 可通过 SITE_URL 环境变量覆盖，否则按 GitHub Pages 惯例推导
const SITE_URL = IS_RELATIVE
  ? ''
  : (process.env.SITE_URL || `https://${GITHUB_USERNAME}.github.io${BASE_PATH}`)

// RSS baseUrl 只需域名，不含子路径（插件内部处理 base）
const RSS_BASE = IS_RELATIVE ? '' : `https://${GITHUB_USERNAME}.github.io`

const SITE_TITLE = 'Pixel Eco - Template Demo'
const SITE_DESCRIPTION = 'A pixel-styled portal template built with VitePress'

export default defineConfig({
  srcDir: 'src',
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  head: [
    // Favicon: relative 模式跳过（子页路径会解析错误），CI 绝对路径模式正常
    ...(IS_RELATIVE ? [] : [
      ['link', { rel: 'icon', type: 'image/png', href: `${BASE_PATH}logo.png` }],
    ]),

    // 全局 SEO 标签（页面级标签由 transformHead 动态生成）
    ...(SITE_URL ? [
      ['meta', { name: 'author', content: 'Pixel Eco Contributors' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:image', content: `${SITE_URL}logo.png` }],
      ['meta', { property: 'og:site_name', content: 'Pixel Eco' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:image', content: `${SITE_URL}logo.png` }],
    ] : []),
  ],

  // 按页面动态生成 canonical / og:url / og:title / og:description / twitter:*
  transformHead({ pageData }): HeadConfig[] {
    if (!SITE_URL) return []

    // 首页 index.md → 根路径，其他页面 → 对应 .html
    const isIndex = pageData.relativePath === 'index.md'
    const pagePath = isIndex ? '' : pageData.relativePath.replace(/\.md$/, '.html')
    const pageUrl = isIndex ? SITE_URL : `${SITE_URL}${pagePath}`

    const pageTitle = pageData.title || SITE_TITLE
    const pageDesc = pageData.description || pageData.frontmatter.description || SITE_DESCRIPTION

    return [
      ['meta', { name: 'description', content: pageDesc }],
      ['link', { rel: 'canonical', href: pageUrl }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDesc }],
      ['meta', { property: 'og:url', content: pageUrl }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDesc }],
    ]
  },
  srcExclude: ['dev-notes/**', 'AGENTS.md', 'CHANGELOG.md', 'README.md', 'LICENSE'],
  base: BASE_PATH,
  sitemap: SITE_URL ? {
    hostname: SITE_URL,
    transformItems(items) {
      return items.filter(item => item.url !== '404.html')
    },
  } : undefined,
  markdown: {
    theme: 'github-dark',
  },
  vite: {
    plugins: [
      ...(RSS_BASE ? [RssPlugin({
        title: SITE_TITLE,
        baseUrl: RSS_BASE,
        copyright: '© 2026-Present Pixel Eco. 保留所有权利。',
        filename: 'feed.rss',
        icon: false,
        filter: (post: any) => post.frontmatter?.category,
      })] : []),
    ],
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '新闻', link: '/news/' },
      { text: '关于', link: '/about' },
      { text: '文档', link: '/docs/' },
    ],
    socialLinks: [
      { icon: 'github', link: GITHUB_URL, text: '仓库地址' } as any,
    ],
    footer: {
      copyright: '© 2026-Present Pixel Eco. 保留所有权利。',
    },
  },
})
