import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelProgress from './PixelProgress.vue'

describe('PixelProgress', () => {
  it('renders the track and fill', () => {
    const wrapper = mount(PixelProgress, { props: { value: 50 } })
    expect(wrapper.find('.pixel-progress__track').exists()).toBe(true)
    expect(wrapper.find('.pixel-progress__fill').exists()).toBe(true)
  })

  it('sets fill width to the given value', () => {
    const wrapper = mount(PixelProgress, { props: { value: 42 } })
    expect(wrapper.find('.pixel-progress__fill').attributes('style')).toContain('width: 42%')
  })

  it('clamps value below 0 to 0', () => {
    const wrapper = mount(PixelProgress, { props: { value: -10 } })
    expect(wrapper.find('.pixel-progress__fill').attributes('style')).toContain('width: 0%')
  })

  it('clamps value above 100 to 100', () => {
    const wrapper = mount(PixelProgress, { props: { value: 150 } })
    expect(wrapper.find('.pixel-progress__fill').attributes('style')).toContain('width: 100%')
  })

  it('applies accent color class by default', () => {
    const wrapper = mount(PixelProgress, { props: { value: 50 } })
    expect(wrapper.find('.pixel-progress__fill').classes()).toContain('pixel-progress__fill--accent')
  })

  it('applies custom color class', () => {
    const wrapper = mount(PixelProgress, { props: { value: 50, color: 'danger' } })
    expect(wrapper.find('.pixel-progress__fill').classes()).toContain('pixel-progress__fill--danger')
  })

  it('does not render header when no label and showValue is false', () => {
    const wrapper = mount(PixelProgress, { props: { value: 50 } })
    expect(wrapper.find('.pixel-progress__header').exists()).toBe(false)
  })

  it('renders label when provided', () => {
    const wrapper = mount(PixelProgress, { props: { value: 50, label: '进度' } })
    expect(wrapper.find('.pixel-progress__label').text()).toBe('进度')
  })

  it('renders clamped value when showValue is true', () => {
    const wrapper = mount(PixelProgress, { props: { value: 73, showValue: true } })
    expect(wrapper.find('.pixel-progress__value').text()).toBe('73%')
  })

  it('renders clamped value when value exceeds 100 and showValue is true', () => {
    const wrapper = mount(PixelProgress, { props: { value: 200, showValue: true } })
    expect(wrapper.find('.pixel-progress__value').text()).toBe('100%')
  })

  it('applies custom height via style', () => {
    const wrapper = mount(PixelProgress, { props: { value: 50, height: '24px' } })
    expect(wrapper.find('.pixel-progress__track').attributes('style')).toContain('height: 24px')
  })
})
