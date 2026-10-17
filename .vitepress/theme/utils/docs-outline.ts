import type { Header } from 'vitepress'

export type OutlineLevel = number | [number, number] | 'deep'
export type OutlineSetting = false | OutlineLevel | { level?: OutlineLevel; label?: string }

export function resolveOutline(
  headers: Header[],
  setting: OutlineSetting = [1, 6],
  excluded: string[] = [],
): { headers: Header[]; label: string } {
  const label =
    setting && typeof setting === 'object' && !Array.isArray(setting)
      ? setting.label || '本文目录'
      : '本文目录'
  if (setting === false) return { headers: [], label }

  const level =
    typeof setting === 'object' && !Array.isArray(setting) ? (setting.level ?? [1, 6]) : setting
  const [min, max] = level === 'deep' ? [2, 6] : typeof level === 'number' ? [level, level] : level
  const excludedSlugs = new Set(excluded)

  // Filter the existing tree, promoting children in place. Rebuilding from a
  // filtered flat list could attach them to an unrelated preceding H1.
  function filter(items: Header[]): Header[] {
    return items.flatMap((item) => {
      const children = filter(item.children)
      return item.level < min || item.level > max || excludedSlugs.has(item.slug)
        ? children
        : [{ ...item, children }]
    })
  }

  return { headers: filter(headers), label }
}

export function flattenOutline(headers: Header[]): Header[] {
  return headers.flatMap((header) => [header, ...flattenOutline(header.children)])
}

export function activeOutlineSlug(
  headings: { slug: string; top: number }[],
  offset: number,
  atBottom = false,
): string | null {
  if (atBottom) return headings.at(-1)?.slug ?? null
  let active: string | null = null
  for (const heading of headings) {
    if (heading.top <= offset + 1) active = heading.slug
  }
  return active
}
