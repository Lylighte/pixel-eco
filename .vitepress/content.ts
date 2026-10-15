import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import { isPublished } from './theme/utils/publication'

export function markdownFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'public' || entry.name.startsWith('.')) return []
    const path = join(root, entry.name)
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : []
  })
}

export function readContent(file: string) {
  const frontmatter = matter(readFileSync(file, 'utf8')).data as Record<string, unknown>
  isPublished(frontmatter, file)
  return frontmatter
}

export function draftPages(srcDir: string): string[] {
  return markdownFiles(srcDir)
    .filter((file) => !isPublished(readContent(file), file))
    .map((file) => relative(srcDir, file).replace(/\\/g, '/'))
}

// Only these fields are serialized to browser-side collection indexes.
const indexFields = [
  'title',
  'date',
  'brief',
  'cover',
  'category',
  'draft',
  'sidebarGroup',
  'sidebarGroupOrder',
  'sidebarOrder',
  'cardImage',
  'cardDescription',
]

export function contentModules(files: string[], isDev: boolean) {
  const modules: Record<string, { __pageData: { frontmatter: Record<string, unknown> } }> = {}
  for (const file of files) {
    const fm = readContent(file)
    if (!isDev && !isPublished(fm, file)) continue
    modules[file.replace(/\\/g, '/')] = {
      __pageData: {
        frontmatter: Object.fromEntries(
          indexFields
            .filter((key) => key in fm)
            .map((key) => [
              key,
              fm[key] instanceof Date ? fm[key].toISOString().slice(0, 10) : fm[key],
            ]),
        ),
      },
    }
  }
  return modules
}
