/* eslint-disable @typescript-eslint/no-explicit-any */
// 将构建期 frontmatter 索引转换为新闻卡片；不导入 Markdown 页面。

import type { NewsCardData } from '../types/components'
import { isPublished } from './publication'
export type { NewsCardData } from '../types/components'

type NewsModuleMap = Record<string, { __pageData?: { frontmatter?: Record<string, unknown> } }>

function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

function getFrontmatter(module: NewsModuleMap[string]): Record<string, any> {
  return module?.__pageData?.frontmatter || {}
}

export function buildNewsCards(
  modules: NewsModuleMap,
  production = import.meta.env.PROD,
): NewsCardData[] {
  return Object.entries(modules)
    .filter(([path]) => !path.endsWith('index.md'))
    .filter(([, module]) => {
      const fm = getFrontmatter(module)
      // 生产构建时排除草稿
      if (!isPublished(fm) && production) return false
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
