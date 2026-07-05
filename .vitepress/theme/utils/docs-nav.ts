// 共享工具：从 docs/*.md 的 __pageData.frontmatter 自动构建侧边栏导航和索引页卡片
// 被 DocsSidebar.vue 和 docs/index.md 共同引用
// 通过 @theme alias 确保 Vite 不创建重复模块实例

import type { SidebarItem, SidebarGroup, DocCard } from '../types/components'
export type { SidebarItem, SidebarGroup, DocCard } from '../types/components'

// VitePress 编译 .md 时会将 frontmatter 注入 __pageData 导出
const modules = import.meta.glob('../../../src/docs/*.md', { eager: true })

function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

function getFrontmatter(module: any): Record<string, any> {
  return module?.__pageData?.frontmatter || {}
}

export function buildSidebarNav(): SidebarGroup[] {
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

export function buildDocCards(): DocCard[] {
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
    .filter(c => c.description)
    .sort((a, b) => a.name.localeCompare(b.name))
}