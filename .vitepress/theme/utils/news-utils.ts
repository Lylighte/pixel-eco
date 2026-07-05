// 共享工具：从 news/*.md 的 __pageData.frontmatter 自动构建新闻卡片列表
// 被 news/index.md 引用

import type { NewsCardData } from '../types/components'
export type { NewsCardData } from '../types/components'

const modules = import.meta.glob('../../../src/news/*.md', { eager: true })

function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

interface FrontmatterModule {
  __pageData?: {
    frontmatter?: Record<string, unknown>
  }
}

function getString(fm: Record<string, unknown>, key: string): string | undefined {
  const value = fm[key]
  return typeof value === 'string' ? value : undefined
}

function getFrontmatter(module: unknown): Record<string, unknown> {
  return (module as FrontmatterModule).__pageData?.frontmatter || {}
}

export function buildNewsCards(): NewsCardData[] {
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
        title: getString(fm, 'title') || slug,
        brief: getString(fm, 'brief') || '',
        image: getString(fm, 'cover') || '/background/19.jpg',
        link: `/news/${slug}`,
        date: getString(fm, 'date') || '1970-01-01',
        category: getString(fm, 'category') || '未分类',
      }
    })
    .filter((c) => c.brief)
    .sort((a, b) => b.date.localeCompare(a.date))
}
