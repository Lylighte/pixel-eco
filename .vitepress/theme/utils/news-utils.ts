/* eslint-disable @typescript-eslint/no-explicit-any */
// 共享工具：从 news/*.md 的 __pageData.frontmatter 自动构建新闻卡片列表
// 被 news/index.md 引用

import type { NewsCardData } from '../types/components'
export type { NewsCardData } from '../types/components'

type NewsModuleMap = Record<string, { __pageData?: { frontmatter?: Record<string, unknown> } }>

// 用函数包装 import.meta.glob，使单元测试注入 mock 时不会触发 glob 评估
function loadDefaultModules(): NewsModuleMap {
  return import.meta.glob('../../../src/news/*.md', { eager: true })
}

function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

function getFrontmatter(module: NewsModuleMap[string]): Record<string, any> {
  return module?.__pageData?.frontmatter || {}
}

export function buildNewsCards(modules: NewsModuleMap = loadDefaultModules()): NewsCardData[] {
  return Object.entries(modules)
    .filter(([path]) => !path.endsWith('index.md'))
    .filter(([, module]) => {
      const fm = getFrontmatter(module)
      // 生产构建时排除草稿
      if (fm.draft && import.meta.env.PROD) return false
      return true
    })
    .map(([path, module]) => {
      const fm = getFrontmatter(module)
      const slug = getSlug(path)
      return {
        title: fm.title || slug,
        brief: fm.brief || '',
        image: fm.cover || '/background/19.jpg',
        link: `/news/${slug}`,
        date: fm.date || '1970-01-01',
        category: fm.category || '未分类',
      }
    })
    .filter((c) => c.brief)
    .sort((a, b) => b.date.localeCompare(a.date))
}
