// @vitest-environment node
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { contentModules, draftPages } from './content'
import { isPublished } from './theme/utils/publication'
import { buildDocCards, buildSidebarNav } from './theme/utils/docs-nav'

const roots: string[] = []
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })))

describe('publication', () => {
  it('accepts boolean draft values only', () => {
    expect(isPublished({})).toBe(true)
    expect(isPublished({ draft: false })).toBe(true)
    expect(isPublished({ draft: true })).toBe(false)
    expect(() => isPublished({ draft: 'false' }, 'example.md')).toThrow('example.md')
  })

  it('excludes nested draft pages and removes their data before serialization', () => {
    const root = mkdtempSync(join(tmpdir(), 'pixel-content-'))
    roots.push(root)
    mkdirSync(join(root, 'docs', 'nested'), { recursive: true })
    mkdirSync(join(root, 'public'))
    const draft = join(root, 'docs', 'nested', 'hidden.md')
    const published = join(root, 'docs', 'visible.md')
    writeFileSync(
      draft,
      '---\ntitle: Hidden\ndraft: true\ncardDescription: Secret card\n---\nSECRET_BODY',
    )
    writeFileSync(
      published,
      '---\ntitle: Visible\ncardDescription: Public card\ndate: 2026-10-14\n---\nPUBLIC_BODY',
    )
    writeFileSync(join(root, 'public', 'asset.md'), '---\ndraft: true\n---')
    expect(draftPages(root)).toEqual(['docs/nested/hidden.md'])
    const prod = contentModules([draft, published], false)
    expect(Object.keys(prod)).toHaveLength(1)
    expect(JSON.stringify(prod)).not.toMatch(/Hidden|Secret|BODY/)
    expect(Object.values(prod)[0].__pageData.frontmatter.date).toBe('2026-10-14')
    const dev = contentModules([draft, published], true)
    expect(Object.keys(dev)).toHaveLength(2)
    expect(
      buildSidebarNav(dev, true)
        .flatMap((g) => g.items)
        .some((i) => i.text === 'Hidden'),
    ).toBe(false)
    expect(buildDocCards(dev, true).some((i) => i.name === 'Hidden')).toBe(false)
    expect(buildDocCards(dev, false).some((i) => i.name === 'Hidden')).toBe(true)
    writeFileSync(draft, '---\ntitle: Now published\ndraft: false\n---')
    expect(draftPages(root)).toEqual([])
    expect(Object.keys(contentModules([draft, published], false))).toHaveLength(2)
  })
})
