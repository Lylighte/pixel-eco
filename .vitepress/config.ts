import { defineConfig } from 'vitepress'
import { RssPlugin } from 'vitepress-plugin-rss'

// ============================================================
// 基础配置
// ============================================================
const GITHUB_USERNAME = 'Lylighte'
const REPO_NAME = 'pixel-eco'

// 部署基础路径
// - 默认 './' 相对路径，dist 可随意移动，nginx 本地部署等
// - CI 部署时通过环境变量 BASE_PATH 覆盖（如 /pixel-eco/）
// - configure-pages@v4 返回无尾部斜杠，此处强制补齐
const BASE_PATH = (process.env.BASE_PATH || './').replace(/\/?$/, '/')
const IS_RELATIVE = BASE_PATH === './'

const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`
const IS_DEV = process.argv[2] === 'dev'

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
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  head: [
    // Favicon: relative 模式跳过（子页路径会解析错误），CI 绝对路径模式正常
    ...(IS_RELATIVE ? [] : [
      ['link', { rel: 'icon', type: 'image/png', href: `${BASE_PATH}logo.png` }],
    ]),

    // SEO / Open Graph / Twitter Card — 仅在非 relative 模式启用
    ...(SITE_URL ? [
      ['meta', { name: 'description', content: SITE_DESCRIPTION }] as any,
      ['meta', { name: 'author', content: 'Pixel Eco Contributors' }] as any,
      ['link', { rel: 'canonical', href: SITE_URL }] as any,
      ['meta', { property: 'og:type', content: 'website' }] as any,
      ['meta', { property: 'og:title', content: SITE_TITLE }] as any,
      ['meta', { property: 'og:description', content: SITE_DESCRIPTION }] as any,
      ['meta', { property: 'og:url', content: SITE_URL }] as any,
      ['meta', { property: 'og:image', content: `${SITE_URL}logo.png` }] as any,
      ['meta', { property: 'og:site_name', content: 'Pixel Eco' }] as any,
      ['meta', { name: 'twitter:card', content: 'summary' }] as any,
      ['meta', { name: 'twitter:title', content: SITE_TITLE }] as any,
      ['meta', { name: 'twitter:description', content: SITE_DESCRIPTION }] as any,
      ['meta', { name: 'twitter:image', content: `${SITE_URL}logo.png` }] as any,
    ] : []),
  ],
  srcExclude: ['dev-notes/**', 'AGENTS.md', 'CHANGELOG.md', 'README.md', 'LICENSE'],
  base: IS_DEV ? '/' : BASE_PATH,
  sitemap: SITE_URL ? {
    hostname: SITE_URL,
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
