import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelTabs from './PixelTabs.vue'

vi.mock('vitepress', () => ({ withBase: (path: string) => path }))

describe('pixel tabs activation sound', () => {
  const play = vi.fn().mockResolvedValue(undefined)
  const AudioMock = vi.fn(() => ({ play, volume: 0 }))

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('plays exactly once per tab activation', async () => {
    const wrapper = mount(PixelTabs, { props: { tabs: ['甲', '乙'] } })
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    expect(play).not.toHaveBeenCalled()

    await tabs[1].trigger('click')
    expect(AudioMock).toHaveBeenCalledExactlyOnceWith('/button.click.ogg')
    expect(play).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.$el.querySelector('.pixel-tabs__tab--active').textContent).toBe('乙')

    await tabs[1].trigger('click')
    expect(play).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
})
