import { isPublished } from './theme/utils/publication'

// The plugin uses origin for article URLs, but root-relative cover paths are
// template assets relative to the site's base, not the domain root.
export function includeRssPost(
  post: { frontmatter: Record<string, unknown>; filepath: string },
  siteUrl: string,
): boolean {
  if (!isPublished(post.frontmatter, post.filepath) || !post.frontmatter.category) return false
  const cover = post.frontmatter.cover
  if (typeof cover === 'string' && cover.startsWith('/') && !cover.startsWith('//')) {
    post.frontmatter.cover = new URL(cover.slice(1), siteUrl).href
  }
  return true
}
