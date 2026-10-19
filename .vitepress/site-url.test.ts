import { describe, expect, it } from 'vitest'
import { pageUrl, resolveDeployment } from './site-url'

describe('deployment URL', () => {
  it('builds locally without inventing a public domain', () => {
    expect(resolveDeployment({})).toEqual({ siteUrl: '', origin: '', base: '/' })
    expect(resolveDeployment({ BASE_PATH: '/eco' }).base).toBe('/eco/')
  })
  it('normalizes the URL and derives base', () => {
    expect(resolveDeployment({ SITE_URL: 'https://example.com/eco' })).toEqual({
      siteUrl: 'https://example.com/eco/',
      origin: 'https://example.com',
      base: '/eco/',
    })
  })
  it('uses root in dev and configured base in production/preview', () => {
    const env = { SITE_URL: 'https://example.com/eco/' }
    expect(resolveDeployment(env, true).base).toBe('/')
    expect(resolveDeployment(env, false).base).toBe('/eco/')
  })
  it('accepts matching legacy overrides and rejects conflicting ones', () => {
    expect(
      resolveDeployment({ SITE_URL: 'https://example.com/eco', BASE_PATH: '/eco/' }).base,
    ).toBe('/eco/')
    expect(() =>
      resolveDeployment({ SITE_URL: 'https://example.com/eco', BASE_PATH: '/' }),
    ).toThrow('must match')
  })
  it.each([
    'file:///tmp/',
    'https://user:pass@example.com/',
    'https://example.com/?q=1',
    'https://example.com/#x',
  ])('rejects invalid SITE_URL %s', (SITE_URL) => {
    expect(() => resolveDeployment({ SITE_URL })).toThrow()
  })
  it.each(['./', 'eco', '//example.com/', '/eco?x', '/eco/../other/'])(
    'rejects invalid BASE_PATH %s',
    (BASE_PATH) => {
      expect(() => resolveDeployment({ BASE_PATH })).toThrow()
    },
  )
  it.each([
    ['index.md', 'https://example.com/eco/'],
    ['news/index.md', 'https://example.com/eco/news/'],
    ['news/welcome.md', 'https://example.com/eco/news/welcome.html'],
  ])('generates canonical for %s', (path, expected) => {
    expect(pageUrl('https://example.com/eco/', path)).toBe(expected)
  })
})
