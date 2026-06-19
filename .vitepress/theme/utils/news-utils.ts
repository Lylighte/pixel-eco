// 共享工具：从 news/*.md 的 __pageData.frontmatter 自动构建新闻卡片列表
// 被 news/index.md 引用

export interface NewsCardData {
  title: string
  brief: string
  image: string
  link: string
  date: string
  category: string
}

const modules = import.meta.glob('../../../src/news/*.md', { eager: true })

function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

function getFrontmatter(module: any): Record<string, any> {
  return module?.__pageData?.frontmatter || {}
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
        title: fm.title || slug,
        brief: fm.brief || '',
        image: fm.cover || '/background/19.jpg',
        link: `/news/${slug}`,
        date: fm.date || '1970-01-01',
        category: fm.category || '未分类',
      }
    })
    .filter(c => c.brief)
    .sort((a, b) => b.date.localeCompare(a.date))
}