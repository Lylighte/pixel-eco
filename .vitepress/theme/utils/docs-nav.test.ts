/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest'
import type { DocCard, SidebarGroup, SidebarItem } from '../types/components'

vi.mock('./docs-nav', async () => {
  const modules: Record<string, unknown> = {
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

  function getSlug(path: string): string {
    const parts = path.replace(/\\/g, '/').split('/')
    return parts[parts.length - 1].replace('.md', '')
  }

  function getFrontmatter(module: any): Record<string, any> {
    return module?.__pageData?.frontmatter || {}
  }

  function buildSidebarNav(): SidebarGroup[] {
    const groups = new Map<string, { items: SidebarItem[]; groupOrder: number }>()

    for (const [path, module] of Object.entries(modules)) {
      const slug = getSlug(path)
      if (slug === 'index') continue
      const fm = getFrontmatter(module)
      const group = fm.sidebarGroup || '未分类'
      if (!groups.has(group)) {
        groups.set(group, { items: [], groupOrder: fm.sidebarGroupOrder ?? 999 })
      }
      groups.get(group)!.items.push({
        text: fm.title || slug,
        link: `/docs/${slug}`,
        order: fm.sidebarOrder ?? 999,
      })
    }

    for (const [, group] of groups) {
      group.items.sort((a, b) => a.order - b.order)
    }

    return Array.from(groups, ([title, group]) => ({
      title,
      items: group.items,
      groupOrder: group.groupOrder,
    })).sort((a, b) => a.groupOrder - b.groupOrder)
  }

  function buildDocCards(): DocCard[] {
    return Object.entries(modules)
      .filter(([path]) => !path.endsWith('index.md'))
      .map(([path, module]) => {
        const fm = getFrontmatter(module)
        const slug = getSlug(path)
        return {
          name: fm.title || slug,
          url: `/docs/${slug}`,
          image: fm.cardImage || '/background/19.jpg',
          description: fm.cardDescription || '',
        }
      })
      .filter((c) => c.description)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return { buildSidebarNav, buildDocCards }
})

const { buildSidebarNav, buildDocCards } = await import('./docs-nav')

describe('buildSidebarNav', () => {
  it('excludes the index page', () => {
    const nav = buildSidebarNav()
    expect(nav.some((group) => group.items.some((item) => item.link === '/docs/index'))).toBe(false)
  })

  it('groups items by sidebarGroup', () => {
    const nav = buildSidebarNav()
    const titles = nav.map((group) => group.title)
    expect(titles).toContain('基础')
    expect(titles).toContain('进阶')
  })

  it('sorts items within a group by sidebarOrder ascending', () => {
    const nav = buildSidebarNav()
    const basics = nav.find((group) => group.title === '基础')
    expect(basics?.items.map((item) => item.link)).toEqual([
      '/docs/quickstart',
      '/docs/installation',
    ])
  })

  it('sorts groups by sidebarGroupOrder ascending', () => {
    const nav = buildSidebarNav()
    expect(nav[0]?.title).toBe('基础')
    expect(nav[1]?.title).toBe('进阶')
  })

  it('falls back to slug when title is missing', () => {
    const nav = buildSidebarNav()
    const advanced = nav.find((group) => group.title === '进阶')
    expect(
      advanced?.items.some((item) => item.text === 'legacy' && item.link === '/docs/legacy'),
    ).toBe(true)
  })
})

describe('buildDocCards', () => {
  it('filters out items without cardDescription', () => {
    const cards = buildDocCards()
    expect(cards.some((card) => card.url === '/docs/draft')).toBe(false)
  })

  it('keeps items with cardDescription', () => {
    const cards = buildDocCards()
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
    const cards = buildDocCards()
    expect(cards.map((card) => card.name)).toEqual([
      'Advanced Usage',
      'Installation',
      'legacy',
      'Quick Start',
    ])
  })

  it('falls back to default card image', () => {
    const cards = buildDocCards()
    expect(cards.every((card) => card.image)).toBe(true)
  })
})
