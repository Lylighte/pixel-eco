import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { getScrollOffset, onContentUpdated, type Header } from 'vitepress'
import { activeOutlineSlug, flattenOutline } from '../utils/docs-outline'

export function useDocsOutline(
  headers: Ref<Header[]>,
  contentReady: Ref<boolean>,
  contentId: string,
) {
  const activeSlug = ref<string | null>(null)
  let mounted = false
  let disposed = false
  let frame = 0
  let root: HTMLElement | null = null
  let observer: ResizeObserver | undefined
  let targets: { slug: string; element: HTMLElement }[] = []
  let initialHashPending = true

  function update() {
    frame = 0
    if (!contentReady.value) return
    const headings = targets
      .filter(({ element }) => element.isConnected && element.getClientRects().length > 0)
      .map(({ slug, element }) => ({ slug, top: element.getBoundingClientRect().top }))
    const atBottom =
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    activeSlug.value = activeOutlineSlug(headings, getScrollOffset(), atBottom)
  }

  function schedule() {
    if (mounted && !disposed && !frame) frame = requestAnimationFrame(update)
  }

  function bind() {
    if (!mounted || disposed) return
    observer?.disconnect()
    root?.removeEventListener('load', schedule, true)
    root = document.getElementById(contentId)
    targets = flattenOutline(headers.value).flatMap(({ slug }) => {
      const element = document.getElementById(slug)
      return element && root?.contains(element) ? [{ slug, element }] : []
    })
    if (root) {
      observer?.observe(root)
      root.addEventListener('load', schedule, true)
    }

    // The router may have attempted the deep link while the out-in transition
    // was still removing the old page. Correct it once the new page has entered.
    if (contentReady.value && root && initialHashPending) {
      initialHashPending = false
      const savedScroll = window.history.state?.scrollPosition
      let id = ''
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        // A malformed fragment should not break the document navigation.
      }
      const target = id ? document.getElementById(id) : null
      if (typeof savedScroll === 'number' && savedScroll > 0) {
        // The router's earlier popstate restoration may have been clamped while
        // the out-in transition had no new content in the document yet.
        window.scrollTo({ top: savedScroll, behavior: 'instant' })
      } else if (target && root.contains(target)) {
        const padding = Number.parseFloat(getComputedStyle(target).paddingTop) || 0
        window.scrollTo({
          top: window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + padding,
          behavior: 'instant',
        })
      }
    }
    schedule()
  }

  onContentUpdated(bind)
  watch(
    [headers, contentReady],
    () => {
      if (!contentReady.value) activeSlug.value = null
      bind()
    },
    { flush: 'post' },
  )

  onMounted(() => {
    mounted = true
    if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    bind()
    void document.fonts?.ready.then(() => {
      if (!disposed) schedule()
    })
  })

  onUnmounted(() => {
    disposed = true
    cancelAnimationFrame(frame)
    observer?.disconnect()
    root?.removeEventListener('load', schedule, true)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('hashchange', schedule)
  })

  return { activeSlug }
}
