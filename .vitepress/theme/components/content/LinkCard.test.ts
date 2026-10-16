import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LinkCard from './LinkCard.vue'

vi.mock('vitepress', () => ({ withBase: (path: string) => `/community${path}` }))

describe('link card destinations', () => {
  it.each([
    'https://example.com/path',
    'http://example.com/',
    'HTTPS://example.com/path',
    'HtTp://example.com/',
    '//example.com/path',
  ])('opens external URL %s in a protected new tab without a base', (url) => {
    const wrapper = mount(LinkCard, { props: { link: { name: 'External', url } } })
    expect(wrapper.attributes('href')).toBe(url)
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener')
  })

  it('applies base once to internal destinations and stays in the same tab', () => {
    const wrapper = mount(LinkCard, {
      props: { link: { name: 'Docs', url: '/docs/quick-start' } },
    })
    expect(wrapper.attributes('href')).toBe('/community/docs/quick-start')
    expect(wrapper.attributes('target')).toBeUndefined()
    expect(wrapper.attributes('rel')).toBeUndefined()
  })
})
