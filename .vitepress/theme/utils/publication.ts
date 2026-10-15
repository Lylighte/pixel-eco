export function isPublished(frontmatter: Record<string, unknown>, source = 'content'): boolean {
  if (frontmatter.draft !== undefined && typeof frontmatter.draft !== 'boolean') {
    throw new Error(`${source}: draft must be a boolean (true or false).`)
  }
  return frontmatter.draft !== true
}
