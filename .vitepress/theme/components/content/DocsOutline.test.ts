import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, onUnmounted, ref } from 'vue'
import type { Header } from 'vitepress'
import DocsOutline from './DocsOutline.vue'

const page = ref<{ headers: Header[] }>({ headers: [] })
const frontmatter = ref<Record<string, unknown>>({})
const theme = ref({ outline: { level: [1, 6], label: '本文目录' } })
const contentCallbacks = new Set<() => void>()
vi.mock('vitepress', () => ({
  useData: () => ({ page, frontmatter, theme }),
  getScrollOffset: () => 76,
  withBase: (path: string) => `/community${path}`,
  onContentUpdated: (callback: () => void) => {
    contentCallbacks.add(callback)
    onUnmounted(() => contentCallbacks.delete(callback))
  },
}))

function header(level: number, slug: string, children: Header[] = []): Header {
  return { level, slug, title: slug, link: `#${slug}`, children }
}

describe('document outline rendering and reading position', () => {
  const play = vi.fn().mockResolvedValue(undefined)
  const scrollTo = vi.fn()
  const disconnect = vi.fn()
  const frames = new Map<number, FrameRequestCallback>()
  let frameId = 0
  let wrapper: ReturnType<typeof mount> | undefined

  async function flush() {
    await nextTick()
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((callback) => callback(0))
    await nextTick()
  }

  function heading(id: string, top: number, hidden = false) {
    const element = document.getElementById(id)!
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, top - window.scrollY, 200, 30),
    )
    vi.spyOn(element, 'getClientRects').mockReturnValue(
      (hidden ? [] : [new DOMRect(0, 0, 200, 30)]) as unknown as DOMRectList,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    frames.clear()
    frontmatter.value = {}
    page.value = {
      headers: [
        header(1, '主标题', [header(2, '次标题', [header(3, '节标题')])]),
        header(1, '主标题2'),
      ],
    }
    document.body.innerHTML =
      '<div id="docs-content"><h1 id="主标题">主标题</h1><h2 id="次标题">次标题</h2><h3 id="节标题">节标题</h3><h1 id="主标题2">主标题2</h1></div>'
    heading('主标题', 100)
    heading('次标题', 300)
    heading('节标题', 500)
    heading('主标题2', 1600)
    vi.stubGlobal(
      'Audio',
      vi.fn(() => ({ play, volume: 0 })),
    )
    vi.stubGlobal('scrollY', 0)
    vi.stubGlobal('innerHeight', 600)
    vi.stubGlobal('scrollTo', scrollTo)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback)
      return frameId
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(() => ({ observe: vi.fn(), disconnect })),
    )
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000)
    history.replaceState({}, '', '/')
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('emphasizes each H1, aligns H2 and indents H3 while preserving nested lists', async () => {
    wrapper = mount(DocsOutline, { props: { contentReady: true } })
    const links = wrapper.findAll('.outline-link')
    expect(links.map((link) => link.attributes('href'))).toEqual([
      '#主标题',
      '#次标题',
      '#节标题',
      '#主标题2',
    ])
    expect(wrapper.findAll('.outline-main-title').map((link) => link.text())).toEqual([
      '主标题',
      '主标题2',
    ])
    expect(
      links.map((link) => (link.element as HTMLElement).style.getPropertyValue('--outline-indent')),
    ).toEqual(['0', '0', '1', '0'])
    expect(wrapper.findAll('.outline-items .outline-items').length).toBe(2)
    expect(wrapper.attributes()).toHaveProperty('data-pagefind-ignore')
    links[1].element.addEventListener('click', (event) => event.preventDefault())
    await links[1].trigger('click')
    expect(play).toHaveBeenCalledTimes(1)
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
  })

  it('tracks scrolling without modifying history, skips hidden headings and releases listeners', async () => {
    wrapper = mount(DocsOutline, { props: { contentReady: true } })
    await flush()
    expect(wrapper.find('[aria-current]').exists()).toBe(false)
    vi.stubGlobal('scrollY', 250)
    window.dispatchEvent(new Event('scroll'))
    await flush()
    expect(wrapper.get('[aria-current]').attributes('href')).toBe('#次标题')
    expect(location.hash).toBe('')
    heading('节标题', 500, true)
    vi.stubGlobal('scrollY', 500)
    window.dispatchEvent(new Event('resize'))
    await flush()
    expect(wrapper.get('[aria-current]').attributes('href')).toBe('#次标题')
    vi.stubGlobal('scrollY', 1400)
    window.dispatchEvent(new Event('scroll'))
    await flush()
    expect(wrapper.get('[aria-current]').attributes('href')).toBe('#主标题2')
    wrapper.unmount()
    wrapper = undefined
    frames.clear()
    window.dispatchEvent(new Event('scroll'))
    expect(frames.size).toBe(0)
    expect(contentCallbacks.size).toBe(0)
    expect(disconnect).toHaveBeenCalled()
  })

  it('waits for the entering content before restoring an encoded deep link', async () => {
    history.replaceState({}, '', '/#%E8%8A%82%E6%A0%87%E9%A2%98')
    wrapper = mount(DocsOutline, { props: { contentReady: false } })
    await flush()
    expect(scrollTo).not.toHaveBeenCalled()
    await wrapper.setProps({ contentReady: true })
    await flush()
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 424, behavior: 'instant' })
    contentCallbacks.forEach((callback) => callback())
    await flush()
    expect(scrollTo).toHaveBeenCalledTimes(1)
  })

  it('restores saved history positions instead of jumping back to the fragment', async () => {
    history.replaceState({ scrollPosition: 900 }, '', '/#%E8%8A%82%E6%A0%87%E9%A2%98')
    wrapper = mount(DocsOutline, { props: { contentReady: false } })
    await flush()
    expect(scrollTo).not.toHaveBeenCalled()
    await wrapper.setProps({ contentReady: true })
    await flush()
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 900, behavior: 'instant' })
  })

  it('replaces stale headings and supports page-level exclusions and disabled outlines', async () => {
    wrapper = mount(DocsOutline, { props: { contentReady: true } })
    vi.stubGlobal('scrollY', 250)
    window.dispatchEvent(new Event('scroll'))
    await flush()
    await wrapper.setProps({ contentReady: false })
    expect(wrapper.find('[aria-current]').exists()).toBe(false)
    page.value = { headers: [header(4, 'new')] }
    document.getElementById('docs-content')!.innerHTML = '<h4 id="new">new</h4>'
    heading('new', 300)
    await wrapper.setProps({ contentReady: true })
    await flush()
    expect(wrapper.findAll('.outline-link').map((item) => item.text())).toEqual(['new'])
    expect(wrapper.get('[aria-current]').attributes('href')).toBe('#new')
    frontmatter.value = { outlineExclude: ['new'] }
    await flush()
    expect(wrapper.find('nav').exists()).toBe(false)
    frontmatter.value = { outline: false }
    await flush()
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})
