import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelAccordion from './PixelAccordion.vue'

vi.mock('vitepress', () => ({ withBase: (path: string) => path }))

describe('pixel accordion activation sound', () => {
  const play = vi.fn().mockResolvedValue(undefined)
  const AudioMock = vi.fn(() => ({ play, volume: 0 }))

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('plays exactly once per toggle', async () => {
    const wrapper = mount(PixelAccordion, { props: { title: '详情' } })
    const header = wrapper.get('.pixel-accordion__header')
    expect(play).not.toHaveBeenCalled()

    await header.trigger('click')
    expect(AudioMock).toHaveBeenCalledExactlyOnceWith('/button.click.ogg')
    expect(play).toHaveBeenCalledTimes(1)
    expect(header.attributes('aria-expanded')).toBe('true')

    await header.trigger('click')
    expect(play).toHaveBeenCalledTimes(2)
    expect(header.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
