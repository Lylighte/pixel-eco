import { describe, expect, it } from 'vitest'
import { stripBase } from './path'

describe('stripBase', () => {
  it('matches only a complete base segment', () => {
    expect(stripBase('/pixel-ecology/news', '/pixel-eco')).toBe('/pixel-ecology/news')
    expect(stripBase('/pixel-eco', '/pixel-eco/')).toBe('/')
    expect(stripBase('/pixel-eco/', '/pixel-eco/')).toBe('/')
  })

  it('returns path unchanged when base is "/"', () => {
    expect(stripBase('/news/welcome', '/')).toBe('/news/welcome')
  })

  it('returns path unchanged when base is "./"', () => {
    expect(stripBase('/news/welcome', './')).toBe('/news/welcome')
  })

  it('strips base when base is "/pixel-eco/" with trailing slash', () => {
    expect(stripBase('/pixel-eco/news/welcome', '/pixel-eco/')).toBe('/news/welcome')
  })

  it('strips base when base is "/pixel-eco" without trailing slash', () => {
    expect(stripBase('/pixel-eco/news/welcome', '/pixel-eco')).toBe('/news/welcome')
  })

  it('returns path unchanged when path does not start with base', () => {
    expect(stripBase('/other/news', '/pixel-eco/')).toBe('/other/news')
  })

  it('returns empty path unchanged', () => {
    expect(stripBase('', '/pixel-eco/')).toBe('')
  })
})
