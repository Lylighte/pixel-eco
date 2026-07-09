import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { withBase } from 'vitepress'
import PixelButton3D from './PixelButton3D.vue'

vi.mock('vitepress', () => ({
  withBase: vi.fn((url: string) => `/mocked-base${url}`),
}))

describe('PixelButton3D', () => {
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
    const wrapper = mount(PixelButton3D, { slots: { default: '3D Button' } })
    expect(wrapper.text()).toBe('3D Button')
  })

  it('has the pixel-button-3d class', () => {
    const wrapper = mount(PixelButton3D)
    expect(wrapper.classes()).toContain('pixel-button-3d')
  })

  it('does not have is-pressed class initially', () => {
    const wrapper = mount(PixelButton3D)
    expect(wrapper.classes()).not.toContain('is-pressed')
  })

  it('adds is-pressed class on mousedown', async () => {
    const wrapper = mount(PixelButton3D)
    await wrapper.trigger('mousedown')
    expect(wrapper.classes()).toContain('is-pressed')
  })

  it('removes is-pressed class on mouseup', async () => {
    const wrapper = mount(PixelButton3D)
    await wrapper.trigger('mousedown')
    expect(wrapper.classes()).toContain('is-pressed')
    await wrapper.trigger('mouseup')
    expect(wrapper.classes()).not.toContain('is-pressed')
  })

  it('removes is-pressed class on mouseleave', async () => {
    const wrapper = mount(PixelButton3D)
    await wrapper.trigger('mousedown')
    expect(wrapper.classes()).toContain('is-pressed')
    await wrapper.trigger('mouseleave')
    expect(wrapper.classes()).not.toContain('is-pressed')
  })

  it('plays click sound on click using default soundUrl', async () => {
    const wrapper = mount(PixelButton3D)
    await wrapper.trigger('click')
    expect(withBase).toHaveBeenCalledWith('/button.click.ogg')
    expect(AudioMock).toHaveBeenCalledTimes(1)
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1)
  })

  it('uses custom soundUrl when provided', async () => {
    const wrapper = mount(PixelButton3D, { props: { soundUrl: '/custom.ogg' } })
    await wrapper.trigger('click')
    expect(withBase).toHaveBeenCalledWith('/custom.ogg')
  })

  it('applies custom height via style', () => {
    const wrapper = mount(PixelButton3D, { props: { height: '5rem' } })
    expect(wrapper.attributes('style')).toContain('5rem')
  })
})
