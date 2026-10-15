/* eslint-disable @typescript-eslint/no-explicit-any */
// 将构建期 frontmatter 索引转换为文档导航和卡片；不导入 Markdown 页面。

import type { SidebarItem, SidebarGroup, DocCard } from '../types/components'
import { isPublished } from './publication'
export type { SidebarItem, SidebarGroup, DocCard } from '../types/components'

type DocsModuleMap = Record<string, { __pageData?: { frontmatter?: Record<string, unknown> } }>

function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

function getFrontmatter(module: DocsModuleMap[string]): Record<string, any> {
  return module?.__pageData?.frontmatter || {}
}

export function buildSidebarNav(
  modules: DocsModuleMap,
  production = import.meta.env.PROD,
): SidebarGroup[] {
  const groups = new Map<string, { items: SidebarItem[]; groupOrder: number }>()

  for (const [path, module] of Object.entries(modules)) {
    const slug = getSlug(path)
    if (slug === 'index') continue
    const fm = getFrontmatter(module)
    if (!isPublished(fm, path) && production) continue
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

export function buildDocCards(
  modules: DocsModuleMap,
  production = import.meta.env.PROD,
): DocCard[] {
  return Object.entries(modules)
    .filter(([path]) => !path.endsWith('index.md'))
    .filter(([path, module]) => isPublished(getFrontmatter(module), path) || !production)
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
