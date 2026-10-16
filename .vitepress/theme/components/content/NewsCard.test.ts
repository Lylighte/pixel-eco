import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsCard from './NewsCard.vue'

vi.mock('vitepress', () => ({ withBase: (path: string) => `/community${path}` }))

describe('news card activation sound', () => {
  const play = vi.fn().mockResolvedValue(undefined)
  const AudioMock = vi.fn(() => ({ play, volume: 0 }))

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each([
    ['link pointer click', '.overview-button-wrap', 1],
    ['inner button pointer click', '.overview-button', 1],
    ['link keyboard activation', '.overview-button-wrap', 0],
  ])('plays exactly once for %s', (_, selector, detail) => {
    // Mount the real PixelButton3D and useClickSound to catch duplicate playback
    // when a pointer click bubbles from the inner button to its parent link.
    const wrapper = mount(NewsCard, {
      props: { title: 'Article', link: '/news/welcome' },
    })
    wrapper.element.addEventListener('click', (event: Event) => event.preventDefault())
    const link = wrapper.get('.overview-button-wrap')
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/community/news/welcome')
    expect(wrapper.get('.overview-button').attributes('tabindex')).toBe('-1')
    expect(play).not.toHaveBeenCalled()
    // Enter on a native anchor emits click(detail=0); do not add a second
    // keydown playback path that would double-play with the native click.
    wrapper
      .get(selector)
      .element.dispatchEvent(new MouseEvent('click', { detail, bubbles: true, cancelable: true }))
    expect(AudioMock).toHaveBeenCalledExactlyOnceWith('/community/button.click.ogg')
    expect(play).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
