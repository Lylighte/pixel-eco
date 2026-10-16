// 将构建期 frontmatter 索引转换为文档导航和卡片；不导入 Markdown 页面。

import type { SidebarItem, SidebarGroup, DocCard } from '../types/components'
import { isPublished } from './publication'
import {
  DEFAULT_COVER_IMAGE,
  getFrontmatter,
  getSlug,
  type ContentModuleMap,
} from './content-utils'
export type { SidebarItem, SidebarGroup, DocCard } from '../types/components'

export function buildSidebarNav(
  modules: ContentModuleMap,
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
  modules: ContentModuleMap,
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
        image: fm.cardImage || DEFAULT_COVER_IMAGE,
        description: fm.cardDescription || '',
      }
    })
    .filter((c) => c.description)
    .sort((a, b) => a.name.localeCompare(b.name))
}
