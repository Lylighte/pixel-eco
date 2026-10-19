import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DocsSidebar from './DocsSidebar.vue'

vi.mock('vitepress', () => ({
  withBase: (path: string) => `/community${path}`,
  useData: () => ({ site: ref({ base: '/community/' }) }),
  useRoute: () => ({ path: '/community/docs/quick-start' }),
}))

vi.mock('../../../collections.data', () => ({
  data: {
    sidebar: [
      {
        title: '入门指南',
        items: [
          { text: '快速开始', link: '/docs/quick-start' },
          { text: '自定义', link: '/docs/customization' },
        ],
      },
    ],
  },
}))

describe('docs sidebar activation sound', () => {
  const play = vi.fn().mockResolvedValue(undefined)
  const AudioMock = vi.fn(() => ({ play, volume: 0 }))

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('plays exactly once per item link click', async () => {
    const wrapper = mount(DocsSidebar)
    const link = wrapper.get('.sidebar-item')
    link.element.addEventListener('click', (event: Event) => event.preventDefault())
    expect(link.attributes('href')).toBe('/community/docs/quick-start')
    expect(play).not.toHaveBeenCalled()

    await link.trigger('click')
    expect(AudioMock).toHaveBeenCalledExactlyOnceWith('/community/button.click.ogg')
    expect(play).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('plays exactly once per group toggle, for pointer and keyboard', async () => {
    const wrapper = mount(DocsSidebar)
    const header = wrapper.get('.sidebar-group-header')

    await header.trigger('click')
    expect(play).toHaveBeenCalledTimes(1)
    expect(header.attributes('aria-expanded')).toBe('false')

    await header.trigger('keydown.enter')
    expect(play).toHaveBeenCalledTimes(2)
    expect(header.attributes('aria-expanded')).toBe('true')

    await header.trigger('keyup.space')
    expect(play).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })
})
