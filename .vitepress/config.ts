import { defineConfig, type HeadConfig } from 'vitepress'
import { RssPlugin } from 'vitepress-plugin-rss'
import { fileURLToPath } from 'node:url'
import { draftPages } from './content'
import { pageUrl, resolveDeployment } from './site-url'
import { includeRssPost } from './rss'
import { pixelBreakpoints } from './breakpoints'
import { devHmr } from './dev-hmr'

// ============================================================
// 一、品牌标识 — 自定义站点时只需修改此区域
// ============================================================
const GITHUB_USERNAME = 'Lylighte'
const REPO_NAME = 'pixel-eco'
const SITE_TITLE = 'Pixel Eco - Template Demo'
const SITE_DESCRIPTION = 'A pixel-styled portal template built with VitePress'
const SITE_AUTHOR = 'Pixel Eco Contributors'
const SITE_NAME_OG = 'Pixel Eco'
const COPYRIGHT_TEXT = '© 2026-Present Pixel Eco. 保留所有权利。'

// ============================================================
// 二、部署路径 — 通常无需修改
// ============================================================
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`

// ============================================================
// 三、VitePress 配置
// ============================================================
export default ({ command, mode }: { command: 'serve' | 'build'; mode: string }) => {
  // Preview uses serve + production; it must retain the production base.
  const IS_DEV = command === 'serve' && mode !== 'production'
  const {
    base: BASE_PATH,
    siteUrl: SITE_URL,
    origin: RSS_BASE,
  } = resolveDeployment(process.env, IS_DEV)
  const drafts = draftPages(fileURLToPath(new URL('../src/', import.meta.url)))
  return defineConfig({
    srcDir: 'src',
    scrollOffset: { selector: '.nav-container', padding: 24 },
    lang: 'zh-CN',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    head: [
      // 预加载首屏关键字体（减少 LCP 延迟）
      [
        'link',
        {
          rel: 'preload',
          href: `${BASE_PATH}fonts/ark-pixel-12px-proportional-zh_cn.otf.woff2`,
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ] as HeadConfig,
      [
        'link',
        {
          rel: 'preload',
          href: `${BASE_PATH}fonts/ark-pixel-12px-proportional-latin.otf.woff2`,
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ] as HeadConfig,

      ['link', { rel: 'icon', type: 'image/png', href: `${BASE_PATH}logo.png` }],

      // 全局 SEO 标签（页面级标签由 transformHead 动态生成）
      ...(SITE_URL
        ? [
            ['meta', { name: 'author', content: SITE_AUTHOR }] as HeadConfig,
            ['meta', { property: 'og:type', content: 'website' }] as HeadConfig,
            ['meta', { property: 'og:image', content: `${SITE_URL}logo.png` }] as HeadConfig,
            ['meta', { property: 'og:site_name', content: SITE_NAME_OG }] as HeadConfig,
            ['meta', { name: 'twitter:card', content: 'summary' }] as HeadConfig,
            ['meta', { name: 'twitter:image', content: `${SITE_URL}logo.png` }] as HeadConfig,
          ]
        : []),
    ],

    // 按页面动态生成 canonical / og:url / og:title / og:description / twitter:*
    transformHead({ pageData }): HeadConfig[] {
      if (!SITE_URL) return []

      const canonical = pageUrl(SITE_URL, pageData.relativePath)

      const pageTitle = pageData.title || SITE_TITLE
      const pageDesc = pageData.description || pageData.frontmatter.description || SITE_DESCRIPTION

      return [
        ['meta', { name: 'description', content: pageDesc }],
        ['link', { rel: 'canonical', href: canonical }],
        ['meta', { property: 'og:title', content: pageTitle }],
        ['meta', { property: 'og:description', content: pageDesc }],
        ['meta', { property: 'og:url', content: canonical }],
        ['meta', { name: 'twitter:title', content: pageTitle }],
        ['meta', { name: 'twitter:description', content: pageDesc }],
      ]
    },
    srcExclude: [
      'dev-notes/**',
      'AGENTS.md',
      'CHANGELOG.md',
      'README.md',
      'LICENSE',
      ...(IS_DEV ? [] : drafts),
    ],
    base: BASE_PATH,
    sitemap: SITE_URL
      ? {
          hostname: SITE_URL,
          transformItems(items) {
            return items.filter((item) => item.url !== '404.html')
          },
        }
      : undefined,
    markdown: {
      theme: 'github-dark',
      headers: { level: [1, 2, 3, 4, 5, 6] },
    },
    vite: {
      css: { postcss: { plugins: [pixelBreakpoints()] } },
      define: { __CONTENT_DEV__: JSON.stringify(IS_DEV) },
      plugins: [
        devHmr(),
        ...(RSS_BASE && !IS_DEV
          ? [
              RssPlugin({
                title: SITE_TITLE,
                baseUrl: RSS_BASE,
                assetsBaseUrl: SITE_URL.replace(/\/$/, ''),
                copyright: COPYRIGHT_TEXT,
                filename: 'feed.rss',
                icon: false,
                filter: (post) => includeRssPost(post, SITE_URL),
              }),
            ]
          : []),
      ],
    },
    themeConfig: {
      outline: { level: [1, 6], label: '本文目录' },
      nav: [
        { text: '首页', link: '/' },
        { text: '新闻', link: '/news/' },
        { text: '文档', link: '/docs/' },
        { text: '关于', link: '/about' },
        { text: '搜索', link: '/search' },
      ],
      socialLinks: [
        {
          icon: 'github',
          link: GITHUB_URL,
          ariaLabel: '仓库地址',
        },
      ],
      footer: {
        copyright: COPYRIGHT_TEXT,
      },
    },
  })
}
