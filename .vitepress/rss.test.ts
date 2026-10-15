import { describe, expect, it } from 'vitest'
import { includeRssPost } from './rss'

describe('RSS publication and assets', () => {
  it('excludes drafts and non-news pages', () => {
    expect(
      includeRssPost(
        { filepath: 'draft.md', frontmatter: { draft: true, category: 'News' } },
        'https://example.com/eco/',
      ),
    ).toBe(false)
    expect(
      includeRssPost({ filepath: 'docs.md', frontmatter: {} }, 'https://example.com/eco/'),
    ).toBe(false)
  })
  it('resolves template covers under the site subpath', () => {
    const post = {
      filepath: 'news.md',
      frontmatter: { category: 'News', cover: '/background/15.jpg' },
    }
    expect(includeRssPost(post, 'https://example.com/eco/')).toBe(true)
    expect(post.frontmatter.cover).toBe('https://example.com/eco/background/15.jpg')
  })
  it('keeps externally hosted covers', () => {
    const post = {
      filepath: 'news.md',
      frontmatter: { category: 'News', cover: 'https://cdn.example.com/photo.jpg' },
    }
    includeRssPost(post, 'https://example.com/eco/')
    expect(post.frontmatter.cover).toBe('https://cdn.example.com/photo.jpg')
  })
})
