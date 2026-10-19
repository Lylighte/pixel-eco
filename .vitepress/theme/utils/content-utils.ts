export const DEFAULT_COVER_IMAGE = '/background/19.jpg'

export type ContentModuleMap = Record<
  string,
  { __pageData?: { frontmatter?: Record<string, unknown> } }
>

export function getSlug(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1].replace('.md', '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFrontmatter(module: ContentModuleMap[string]): Record<string, any> {
  return module?.__pageData?.frontmatter || {}
}
