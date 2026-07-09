import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelTooltip from './PixelTooltip.vue'

describe('PixelTooltip', () => {
  it('renders default slot content', () => {
    const wrapper = mount(PixelTooltip, {
      props: { text: '提示文字' },
      slots: { default: '悬停我' },
    })
    expect(wrapper.text()).toContain('悬停我')
  })

  it('does not show popup initially', () => {
    const wrapper = mount(PixelTooltip, { props: { text: '提示' } })
    expect(wrapper.find('.pixel-tooltip__popup').exists()).toBe(false)
  })

  it('shows popup with text on mouseenter', async () => {
    const wrapper = mount(PixelTooltip, {
      props: { text: '提示文字' },
      slots: { default: '目标' },
    })
    await wrapper.find('.pixel-tooltip').trigger('mouseenter')
    const popup = wrapper.find('.pixel-tooltip__popup')
    expect(popup.exists()).toBe(true)
    expect(popup.text()).toBe('提示文字')
  })

  it('hides popup on mouseleave', async () => {
    const wrapper = mount(PixelTooltip, { props: { text: '提示' } })
    await wrapper.find('.pixel-tooltip').trigger('mouseenter')
    expect(wrapper.find('.pixel-tooltip__popup').exists()).toBe(true)
    await wrapper.find('.pixel-tooltip').trigger('mouseleave')
    expect(wrapper.find('.pixel-tooltip__popup').exists()).toBe(false)
  })

  it('shows popup on focusin', async () => {
    const wrapper = mount(PixelTooltip, { props: { text: '提示' } })
    await wrapper.find('.pixel-tooltip').trigger('focusin')
    expect(wrapper.find('.pixel-tooltip__popup').exists()).toBe(true)
  })

  it('hides popup on focusout', async () => {
    const wrapper = mount(PixelTooltip, { props: { text: '提示' } })
    await wrapper.find('.pixel-tooltip').trigger('focusin')
    expect(wrapper.find('.pixel-tooltip__popup').exists()).toBe(true)
    await wrapper.find('.pixel-tooltip').trigger('focusout')
    expect(wrapper.find('.pixel-tooltip__popup').exists()).toBe(false)
  })

  it('applies top position class by default', async () => {
    const wrapper = mount(PixelTooltip, { props: { text: '提示' } })
    await wrapper.find('.pixel-tooltip').trigger('mouseenter')
    expect(wrapper.find('.pixel-tooltip__popup').classes()).toContain('pixel-tooltip--top')
  })

  it('applies custom position class', async () => {
    const wrapper = mount(PixelTooltip, {
      props: { text: '提示', position: 'bottom' },
    })
    await wrapper.find('.pixel-tooltip').trigger('mouseenter')
    expect(wrapper.find('.pixel-tooltip__popup').classes()).toContain('pixel-tooltip--bottom')
  })

  it('supports all four positions', async () => {
    for (const position of ['top', 'bottom', 'left', 'right'] as const) {
      const wrapper = mount(PixelTooltip, { props: { text: '提示', position } })
      await wrapper.find('.pixel-tooltip').trigger('mouseenter')
      expect(wrapper.find('.pixel-tooltip__popup').classes()).toContain(`pixel-tooltip--${position}`)
    }
  })
})
