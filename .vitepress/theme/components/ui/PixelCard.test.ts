import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { withBase } from 'vitepress'
import PixelCard from './PixelCard.vue'

vi.mock('vitepress', () => ({
  withBase: vi.fn((url: string) => `/mocked-base${url}`),
}))

describe('PixelCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders default slot content', () => {
    const wrapper = mount(PixelCard, { slots: { default: '卡片内容' } })
    expect(wrapper.text()).toContain('卡片内容')
  })

  it('renders as a div when no href is provided', () => {
    const wrapper = mount(PixelCard)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as an anchor when href is provided', () => {
    const wrapper = mount(PixelCard, { props: { href: '/about' } })
    expect(wrapper.element.tagName).toBe('A')
  })

  it('passes href through withBase', () => {
    mount(PixelCard, { props: { href: '/about' } })
    expect(withBase).toHaveBeenCalledWith('/about')
  })

  it('does not set href attribute when no href provided', () => {
    const wrapper = mount(PixelCard)
    expect(wrapper.attributes('href')).toBeUndefined()
  })

  it('renders title in header when provided', () => {
    const wrapper = mount(PixelCard, { props: { title: '卡片标题' } })
    expect(wrapper.find('.pixel-card__title').text()).toBe('卡片标题')
  })

  it('renders icon in header when provided', () => {
    const wrapper = mount(PixelCard, { props: { icon: '★' } })
    expect(wrapper.find('.pixel-card__icon').text()).toBe('★')
  })

  it('does not render header when neither title nor icon provided', () => {
    const wrapper = mount(PixelCard)
    expect(wrapper.find('.pixel-card__header').exists()).toBe(false)
  })

  it('renders header when only icon is provided', () => {
    const wrapper = mount(PixelCard, { props: { icon: '★' } })
    expect(wrapper.find('.pixel-card__header').exists()).toBe(true)
    expect(wrapper.find('.pixel-card__title').exists()).toBe(false)
  })

  it('adds hoverable class by default', () => {
    const wrapper = mount(PixelCard)
    expect(wrapper.classes()).toContain('pixel-card--hoverable')
  })

  it('does not add hoverable class when hoverable is false', () => {
    const wrapper = mount(PixelCard, { props: { hoverable: false } })
    expect(wrapper.classes()).not.toContain('pixel-card--hoverable')
  })

  it('has the pixel-card and pixel-border classes', () => {
    const wrapper = mount(PixelCard)
    expect(wrapper.classes()).toContain('pixel-card')
    expect(wrapper.classes()).toContain('pixel-border')
  })
})
