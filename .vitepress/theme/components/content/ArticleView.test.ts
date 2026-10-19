import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, ref } from 'vue'
import ArticleView from './ArticleView.vue'

const state = vi.hoisted(() => ({ path: '/community/news/current.html' }))
const news = reactive([
  { title: 'Newer', link: '/news/newer' },
  { title: 'Current', link: '/news/current' },
  { title: 'Older', link: '/news/older' },
])
vi.mock('../../../collections.data', () => ({
  data: {
    get news() {
      return news
    },
  },
}))
vi.mock('vitepress', () => ({
  useRoute: () => state,
  useData: () => ({ site: ref({ base: '/community/' }) }),
  withBase: (path: string) => `/community${path}`,
}))

describe('article navigation', () => {
  const play = vi.fn().mockResolvedValue(undefined)
  const AudioMock = vi.fn(() => ({ play, volume: 0 }))

  beforeEach(() => {
    state.path = '/community/news/current.html'
    vi.clearAllMocks()
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe.each(['[rel="prev"]', '[rel="next"]', '.article-back'])('%s sound', (selector) => {
    it.each([
      ['pointer', 1],
      ['keyboard', 0],
    ])('plays exactly once on %s activation', (_, detail) => {
      const wrapper = mount(ArticleView)
      // Prevent jsdom navigation while letting the real component click handlers run.
      wrapper.element.addEventListener('click', (event: Event) => event.preventDefault())
      expect(play).not.toHaveBeenCalled()
      // Native anchor activation with Enter dispatches a click with detail=0.
      wrapper
        .get(selector)
        .element.dispatchEvent(new MouseEvent('click', { detail, bubbles: true, cancelable: true }))
      expect(AudioMock).toHaveBeenCalledExactlyOnceWith('/community/button.click.ogg')
      expect(play).toHaveBeenCalledTimes(1)
      wrapper.unmount()
    })
  })

  it('links to older/newer articles and keeps the base exactly once', () => {
    const wrapper = mount(ArticleView)
    expect(wrapper.get('[rel="prev"]').attributes('href')).toBe('/community/news/older')
    expect(wrapper.get('[rel="next"]').attributes('href')).toBe('/community/news/newer')
    expect(wrapper.get('.article-back').attributes('href')).toBe('/community/news/')
  })

  it.each([
    ['/community/news/newer', true, false],
    ['/community/news/older/', false, true],
    ['/community/news/unknown.html', false, false],
  ])('handles collection boundaries: %s', (path, previous, next) => {
    state.path = path
    const wrapper = mount(ArticleView)
    expect(wrapper.find('[rel="prev"]').exists()).toBe(previous)
    expect(wrapper.find('[rel="next"]').exists()).toBe(next)
    expect(wrapper.find('.article-back').exists()).toBe(true)
  })

  it('keeps the list entry for a single article or an empty collection', async () => {
    const original = [...news]
    try {
      news.splice(0, news.length, original[1])
      const wrapper = mount(ArticleView)
      expect(wrapper.find('.article-adjacent').exists()).toBe(false)
      expect(wrapper.find('.article-back').exists()).toBe(true)
      news.splice(0)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.article-adjacent').exists()).toBe(false)
      expect(wrapper.find('.article-back').exists()).toBe(true)
    } finally {
      news.splice(0, news.length, ...original)
    }
  })
})
