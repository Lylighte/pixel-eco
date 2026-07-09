import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { withBase } from 'vitepress'
import PixelButton from './PixelButton.vue'

vi.mock('vitepress', () => ({
  withBase: vi.fn((url: string) => `/mocked-base${url}`),
}))

describe('PixelButton', () => {
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
    const wrapper = mount(PixelButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies base class by default', () => {
    const wrapper = mount(PixelButton)
    expect(wrapper.classes()).toContain('pixel-button')
    expect(wrapper.classes()).not.toContain('dark')
  })

  it('applies dark class when dark prop is true', () => {
    const wrapper = mount(PixelButton, { props: { dark: true } })
    expect(wrapper.classes()).toContain('dark')
  })

  it('plays click sound on click using default soundUrl', async () => {
    const wrapper = mount(PixelButton, { slots: { default: 'Go' } })
    await wrapper.trigger('click')
    expect(withBase).toHaveBeenCalledWith('/button.click.ogg')
    expect(AudioMock).toHaveBeenCalledTimes(1)
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1)
  })

  it('uses custom soundUrl when provided', async () => {
    const wrapper = mount(PixelButton, { props: { soundUrl: '/custom.ogg' } })
    await wrapper.trigger('click')
    expect(withBase).toHaveBeenCalledWith('/custom.ogg')
  })

  it('plays sound with volume 0.3', async () => {
    const wrapper = mount(PixelButton)
    await wrapper.trigger('click')
    expect(audioInstances[0]?.volume).toBe(0.3)
  })
})
