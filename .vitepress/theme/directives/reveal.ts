import type { Directive } from 'vue'

// Scroll-triggered entrance for portal pages (home/about). The hidden state is
// added client-side only, so SSR HTML and no-JS environments stay fully visible.
// Once revealed, the observer disconnects — scrolling back never replays it.

export interface RevealOptions {
  delay?: number
}

export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  beforeMount(el) {
    el.classList.add('reveal-hidden')
  },
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.remove('reveal-hidden')
      return
    }
    const delay = binding.value?.delay ?? 0
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (delay > 0) el.style.transitionDelay = `${delay}ms`
          el.classList.add('reveal-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
  },
}
