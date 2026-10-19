import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { vReveal } from './reveal'

const Host = defineComponent({
  props: { delay: { type: Number, default: undefined } },
  template: `<div v-reveal="delay === undefined ? undefined : { delay }">内容</div>`,
})

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void

let ioCallback: IOCallback | null = null
const observe = vi.fn()
const disconnect = vi.fn()

class IntersectionObserverMock {
  constructor(cb: IOCallback) {
    ioCallback = cb
  }
  observe = observe
  disconnect = disconnect
}

const mountHost = (delay?: number) =>
  mount(Host, { props: { delay }, global: { directives: { reveal: vReveal } } })

describe('v-reveal directive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ioCallback = null
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hides on mount, reveals on intersect, then disconnects (once)', () => {
    const wrapper = mountHost()
    const el = wrapper.element
    expect(el.classList.contains('reveal-hidden')).toBe(true)
    expect(observe).toHaveBeenCalledWith(el)

    ioCallback?.([{ isIntersecting: false }])
    expect(el.classList.contains('reveal-visible')).toBe(false)
    expect(disconnect).not.toHaveBeenCalled()

    ioCallback?.([{ isIntersecting: true }])
    expect(el.classList.contains('reveal-visible')).toBe(true)
    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it('applies transition delay when requested', () => {
    const wrapper = mountHost(120)
    ioCallback?.([{ isIntersecting: true }])
    expect(wrapper.element.style.transitionDelay).toBe('120ms')
  })

  it('stays visible when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const wrapper = mountHost()
    expect(wrapper.element.classList.contains('reveal-hidden')).toBe(false)
  })
})
