import { describe, expect, it } from 'vitest'
import type { Header } from 'vitepress'
import { activeOutlineSlug, flattenOutline, resolveOutline } from './docs-outline'

function header(level: number, slug: string, children: Header[] = []): Header {
  return { level, slug, title: slug, link: `#${slug}`, children }
}

describe('document outline', () => {
  const headers = [
    header(1, 'first', [header(2, 'a', [header(3, 'detail')])]),
    header(1, 'second', [header(2, 'b', [header(6, 'deep')])]),
  ]

  it('keeps every H1 and all six heading levels by default', () => {
    expect(flattenOutline(resolveOutline(headers).headers).map((item) => item.slug)).toEqual([
      'first',
      'a',
      'detail',
      'second',
      'b',
      'deep',
    ])
    expect(resolveOutline([header(4, 'standalone')]).headers[0].level).toBe(4)
  })

  it('promotes excluded nodes in place without attaching their children to another H1', () => {
    const result = resolveOutline(headers, [1, 6], ['second']).headers
    expect(result.map((item) => item.slug)).toEqual(['first', 'b'])
    expect(result[0].children.map((item) => item.slug)).toEqual(['a'])
    expect(result[1].children[0].slug).toBe('deep')
    expect(headers[1].slug).toBe('second')
  })

  it('supports level ranges, single levels, deep and disabled outlines', () => {
    expect(
      flattenOutline(resolveOutline(headers, [1, 2]).headers).map((item) => item.level),
    ).toEqual([1, 2, 1, 2])
    expect(resolveOutline(headers, 3).headers.map((item) => item.slug)).toEqual(['detail'])
    expect(resolveOutline(headers, 'deep').headers.map((item) => item.slug)).toEqual(['a', 'b'])
    expect(resolveOutline(headers, false).headers).toEqual([])
    expect(resolveOutline([], { label: '章节' })).toEqual({ headers: [], label: '章节' })
  })

  it('preserves compiler-assigned links, identical labels and custom IDs', () => {
    const input = [
      { ...header(2, '配置'), title: '配置' },
      { ...header(2, '配置-1'), title: '配置' },
      { ...header(2, 'custom:id'), title: '配置' },
    ]
    expect(resolveOutline(input).headers.map((item) => item.link)).toEqual([
      '#配置',
      '#配置-1',
      '#custom:id',
    ])
  })

  it('selects the last passed heading, handles short final sections and empty pages', () => {
    const positions = [
      { slug: 'first', top: 120 },
      { slug: 'next', top: 124 },
    ]
    expect(activeOutlineSlug(positions, 76)).toBeNull()
    expect(activeOutlineSlug(positions, 122)).toBe('first')
    expect(activeOutlineSlug(positions, 124)).toBe('next')
    expect(activeOutlineSlug(positions, 76, true)).toBe('next')
    expect(activeOutlineSlug([], 76, true)).toBeNull()
  })
})
