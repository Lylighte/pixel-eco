// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { pixelBreakpoints } from './breakpoints'

describe('media-query breakpoint tokens', () => {
  it('expands both tokens before CSS reaches the browser', () => {
    const rule = {
      params: '(max-width: var(--pixel-break-compact)), (max-width: var(--pixel-break-layout))',
    }
    pixelBreakpoints().AtRule.media(rule)
    expect(rule.params).toBe('(max-width: 640px), (max-width: 768px)')
  })

  it('fails the build for an unknown breakpoint instead of silently disabling a query', () => {
    expect(() =>
      pixelBreakpoints().AtRule.media({ params: '(width: var(--pixel-break-typo))' }),
    ).toThrow('Unknown breakpoint token')
  })
})
