import { describe, expect, it } from 'vitest'
import { stripBase } from './path'

// 复制现有内联实现作为等价性基线
const stripBaseBaseline = (path: string, base: string): string => {
  if (base && base !== '/' && base !== './' && path.startsWith(base)) {
    return path.slice(base.length - 1)
  }
  return path
}

describe('stripBase', () => {
  it('matches the inline baseline implementation', () => {
    const cases = [
      { path: '/', base: '/' },
      { path: '/news', base: '/' },
      { path: '/news', base: './' },
      { path: '/pixel-eco/news', base: '/pixel-eco/' },
      { path: '/pixel-eco/news', base: '/pixel-eco' },
      { path: '/other/news', base: '/pixel-eco/' },
      { path: '', base: '/pixel-eco/' },
      { path: '/pixel-eco/', base: '/pixel-eco/' },
      { path: '/pixel-eco/docs', base: '/pixel-eco' },
    ]

    for (const { path, base } of cases) {
      expect(stripBase(path, base)).toBe(stripBaseBaseline(path, base))
    }
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
    // 内联实现假设 base 含尾部斜杠；无尾斜杠时保留 base 最后一个字符
    expect(stripBase('/pixel-eco/news/welcome', '/pixel-eco')).toBe('o/news/welcome')
  })

  it('returns path unchanged when path does not start with base', () => {
    expect(stripBase('/other/news', '/pixel-eco/')).toBe('/other/news')
  })

  it('returns empty path unchanged', () => {
    expect(stripBase('', '/pixel-eco/')).toBe('')
  })
})
