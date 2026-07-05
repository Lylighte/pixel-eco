/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NewsCardData } from '../types/components'

vi.mock('./news-utils', async () => {
  const modules: Record<string, unknown> = {
    '../../../src/news/index.md': {
      __pageData: {
        frontmatter: {
          title: 'News',
          date: '2026-07-01',
          brief: 'Index page',
        },
      },
    },
    '../../../src/news/welcome.md': {
      __pageData: {
        frontmatter: {
          title: 'Welcome',
          date: '2026-06-20',
          brief: 'Welcome post',
          cover: '/background/44.jpg',
          category: '公告',
        },
      },
    },
    '../../../src/news/draft-post.md': {
      __pageData: {
        frontmatter: {
          title: 'Draft Post',
          date: '2026-06-25',
          brief: 'Still drafting',
          draft: true,
          category: '开发',
        },
      },
    },
    '../../../src/news/community-update.md': {
      __pageData: {
        frontmatter: {
          title: 'Community Update',
          date: '2026-06-15',
          category: '社区',
        },
      },
    },
  }

  function getSlug(path: string): string {
    const parts = path.replace(/\\/g, '/').split('/')
    return parts[parts.length - 1].replace('.md', '')
  }

  function getFrontmatter(module: any): Record<string, any> {
    return module?.__pageData?.frontmatter || {}
  }

  function buildNewsCards(): NewsCardData[] {
    return Object.entries(modules)
      .filter(([path]) => !path.endsWith('index.md'))
      .filter(([, module]) => {
        const fm = getFrontmatter(module)
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

  return { buildNewsCards }
})

const { buildNewsCards } = await import('./news-utils')

describe('buildNewsCards', () => {
  beforeEach(() => {
    vi.stubEnv('PROD', false)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('excludes index.md', () => {
    const cards = buildNewsCards()
    expect(cards.some((card) => card.link === '/news/index')).toBe(false)
  })

  it('excludes draft posts in PROD mode', () => {
    vi.stubEnv('PROD', true)
    const cards = buildNewsCards()
    expect(cards.some((card) => card.link === '/news/draft-post')).toBe(false)
  })

  it('includes draft posts outside PROD mode', () => {
    vi.stubEnv('PROD', false)
    const cards = buildNewsCards()
    expect(cards.some((card) => card.link === '/news/draft-post')).toBe(true)
  })

  it('sorts cards by date descending', () => {
    const cards = buildNewsCards()
    expect(cards.map((card) => card.date)).toEqual(['2026-06-25', '2026-06-20'])
  })

  it('filters out items without brief', () => {
    const cards = buildNewsCards()
    expect(cards.some((card) => card.link === '/news/community-update')).toBe(false)
  })

  it('falls back to defaults for missing fields', () => {
    const cards = buildNewsCards()
    const draftCard = cards.find((card) => card.link === '/news/draft-post')
    expect(draftCard?.image).toBe('/background/19.jpg')
    expect(draftCard?.category).toBe('开发')
  })
})
