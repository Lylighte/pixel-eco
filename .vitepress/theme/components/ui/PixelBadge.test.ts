import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelBadge from './PixelBadge.vue'

describe('PixelBadge', () => {
  it('renders default slot content', () => {
    const wrapper = mount(PixelBadge, { slots: { default: '新' } })
    expect(wrapper.text()).toBe('新')
  })

  it('has the pixel-badge class', () => {
    const wrapper = mount(PixelBadge)
    expect(wrapper.classes()).toContain('pixel-badge')
  })

  it('applies info type by default', () => {
    const wrapper = mount(PixelBadge)
    expect(wrapper.classes()).toContain('pixel-badge--info')
  })

  it('applies custom type class', () => {
    const wrapper = mount(PixelBadge, { props: { type: 'success' } })
    expect(wrapper.classes()).toContain('pixel-badge--success')
  })

  it('supports all four types', () => {
    for (const type of ['info', 'success', 'warning', 'danger'] as const) {
      const wrapper = mount(PixelBadge, { props: { type } })
      expect(wrapper.classes()).toContain(`pixel-badge--${type}`)
    }
  })

  it('applies md size by default', () => {
    const wrapper = mount(PixelBadge)
    expect(wrapper.classes()).toContain('pixel-badge--md')
  })

  it('applies sm size class when provided', () => {
    const wrapper = mount(PixelBadge, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('pixel-badge--sm')
  })

  it('does not add outline class by default', () => {
    const wrapper = mount(PixelBadge)
    expect(wrapper.classes()).not.toContain('pixel-badge--outline')
  })

  it('adds outline class when outline prop is true', () => {
    const wrapper = mount(PixelBadge, { props: { outline: true } })
    expect(wrapper.classes()).toContain('pixel-badge--outline')
  })

  it('renders as a span element', () => {
    const wrapper = mount(PixelBadge)
    expect(wrapper.element.tagName).toBe('SPAN')
  })
})
