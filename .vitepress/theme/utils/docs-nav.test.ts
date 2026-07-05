import { describe, expect, it } from 'vitest'
import { buildDocCards, buildSidebarNav } from './docs-nav'

type ModuleMap = Record<string, { __pageData?: { frontmatter?: Record<string, unknown> } }>

const modules: ModuleMap = {
  '../../../src/docs/index.md': {
    __pageData: {
      frontmatter: {
        title: '文档中心',
        sidebarGroup: '导航',
        sidebarOrder: 0,
      },
    },
  },
  '../../../src/docs/installation.md': {
    __pageData: {
      frontmatter: {
        title: 'Installation',
        sidebarGroup: '基础',
        sidebarGroupOrder: 1,
        sidebarOrder: 2,
        cardDescription: 'How to install the project',
      },
    },
  },
  '../../../src/docs/quickstart.md': {
    __pageData: {
      frontmatter: {
        title: 'Quick Start',
        sidebarGroup: '基础',
        sidebarGroupOrder: 1,
        sidebarOrder: 1,
        cardDescription: 'Get started quickly',
      },
    },
  },
  '../../../src/docs/advanced.md': {
    __pageData: {
      frontmatter: {
        title: 'Advanced Usage',
        sidebarGroup: '进阶',
        sidebarGroupOrder: 2,
        sidebarOrder: 1,
        cardDescription: 'Advanced topics',
      },
    },
  },
  '../../../src/docs/draft.md': {
    __pageData: {
      frontmatter: {
        title: 'Draft',
        sidebarGroup: '进阶',
        sidebarGroupOrder: 2,
        sidebarOrder: 2,
      },
    },
  },
  '../../../src/docs/legacy.md': {
    __pageData: {
      frontmatter: {
        sidebarGroup: '进阶',
        sidebarGroupOrder: 2,
        sidebarOrder: 3,
        cardDescription: 'Legacy guide',
      },
    },
  },
}

describe('buildSidebarNav', () => {
  it('excludes the index page', () => {
    const nav = buildSidebarNav(modules)
    expect(nav.some((group) => group.items.some((item) => item.link === '/docs/index'))).toBe(false)
  })

  it('groups items by sidebarGroup', () => {
    const nav = buildSidebarNav(modules)
    const titles = nav.map((group) => group.title)
    expect(titles).toContain('基础')
    expect(titles).toContain('进阶')
  })

  it('sorts items within a group by sidebarOrder ascending', () => {
    const nav = buildSidebarNav(modules)
    const basics = nav.find((group) => group.title === '基础')
    expect(basics?.items.map((item) => item.link)).toEqual([
      '/docs/quickstart',
      '/docs/installation',
    ])
  })

  it('sorts groups by sidebarGroupOrder ascending', () => {
    const nav = buildSidebarNav(modules)
    expect(nav[0]?.title).toBe('基础')
    expect(nav[1]?.title).toBe('进阶')
  })

  it('falls back to slug when title is missing', () => {
    const nav = buildSidebarNav(modules)
    const advanced = nav.find((group) => group.title === '进阶')
    expect(
      advanced?.items.some((item) => item.text === 'legacy' && item.link === '/docs/legacy'),
    ).toBe(true)
  })
})

describe('buildDocCards', () => {
  it('filters out items without cardDescription', () => {
    const cards = buildDocCards(modules)
    expect(cards.some((card) => card.url === '/docs/draft')).toBe(false)
  })

  it('keeps items with cardDescription', () => {
    const cards = buildDocCards(modules)
    expect(cards.map((card) => card.url)).toEqual(
      expect.arrayContaining([
        '/docs/advanced',
        '/docs/installation',
        '/docs/legacy',
        '/docs/quickstart',
      ]),
    )
  })

  it('sorts cards by name alphabetically', () => {
    const cards = buildDocCards(modules)
    expect(cards.map((card) => card.name)).toEqual([
      'Advanced Usage',
      'Installation',
      'legacy',
      'Quick Start',
    ])
  })

  it('falls back to default card image', () => {
    const cards = buildDocCards(modules)
    expect(cards.every((card) => card.image)).toBe(true)
  })
})
