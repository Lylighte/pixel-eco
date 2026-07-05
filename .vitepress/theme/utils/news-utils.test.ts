import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildNewsCards } from './news-utils'

type ModuleMap = Record<string, { __pageData?: { frontmatter?: Record<string, unknown> } }>

const modules: ModuleMap = {
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

describe('buildNewsCards', () => {
  beforeEach(() => {
    vi.stubEnv('PROD', false)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('excludes index.md', () => {
    const cards = buildNewsCards(modules)
    expect(cards.some((card) => card.link === '/news/index')).toBe(false)
  })

  it('excludes draft posts in PROD mode', () => {
    vi.stubEnv('PROD', true)
    const cards = buildNewsCards(modules)
    expect(cards.some((card) => card.link === '/news/draft-post')).toBe(false)
  })

  it('includes draft posts outside PROD mode', () => {
    vi.stubEnv('PROD', false)
    const cards = buildNewsCards(modules)
    expect(cards.some((card) => card.link === '/news/draft-post')).toBe(true)
  })

  it('sorts cards by date descending', () => {
    const cards = buildNewsCards(modules)
    expect(cards.map((card) => card.date)).toEqual(['2026-06-25', '2026-06-20'])
  })

  it('filters out items without brief', () => {
    const cards = buildNewsCards(modules)
    expect(cards.some((card) => card.link === '/news/community-update')).toBe(false)
  })

  it('falls back to defaults for missing fields', () => {
    const cards = buildNewsCards(modules)
    const draftCard = cards.find((card) => card.link === '/news/draft-post')
    expect(draftCard?.image).toBe('/background/19.jpg')
    expect(draftCard?.category).toBe('开发')
  })
})
