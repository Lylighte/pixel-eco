import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { withBase } from 'vitepress'
import PixelButtonClassic from './PixelButtonClassic.vue'

vi.mock('vitepress', () => ({
  withBase: vi.fn((url: string) => `/mocked-base${url}`),
}))

describe('PixelButtonClassic', () => {
  const AudioMock = vi.fn()
  const audioInstances: Array<{ play: ReturnType<typeof vi.fn>; volume: number }> = []

  beforeEach(() => {
    audioInstances.length = 0
    AudioMock.mockImplementation(() => {
      const instance = { play: vi.fn(), volume: 0 }
      audioInstances.push(instance)
      return instance
    })
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders default slot content', () => {
    const wrapper = mount(PixelButtonClassic, { slots: { default: 'Classic' } })
    expect(wrapper.text()).toBe('Classic')
  })

  it('has the pixel-button-classic class', () => {
    const wrapper = mount(PixelButtonClassic)
    expect(wrapper.classes()).toContain('pixel-button-classic')
  })

  it('plays click sound on click using default soundUrl', async () => {
    const wrapper = mount(PixelButtonClassic)
    await wrapper.trigger('click')
    expect(withBase).toHaveBeenCalledWith('/button.click.ogg')
    expect(AudioMock).toHaveBeenCalledTimes(1)
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1)
  })

  it('uses custom soundUrl when provided', async () => {
    const wrapper = mount(PixelButtonClassic, { props: { soundUrl: '/custom.ogg' } })
    await wrapper.trigger('click')
    expect(withBase).toHaveBeenCalledWith('/custom.ogg')
  })
})
