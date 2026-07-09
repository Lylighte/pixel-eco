import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelTimeline from './PixelTimeline.vue'

describe('PixelTimeline', () => {
  const items = [
    { date: '2026-01-01', title: '事件一', content: '内容一' },
    { date: '2026-02-01', title: '事件二', content: '内容二' },
    { date: '2026-03-01', title: '事件三', content: '内容三' },
  ]

  it('renders all items', () => {
    const wrapper = mount(PixelTimeline, { props: { items } })
    expect(wrapper.findAll('.pixel-timeline__item')).toHaveLength(3)
  })

  it('renders date, title and content for each item', () => {
    const wrapper = mount(PixelTimeline, { props: { items } })
    const cards = wrapper.findAll('.pixel-timeline__card')
    expect(cards[0]?.find('.pixel-timeline__date').text()).toBe('2026-01-01')
    expect(cards[0]?.find('.pixel-timeline__title').text()).toBe('事件一')
    expect(cards[0]?.find('.pixel-timeline__content').text()).toBe('内容一')
  })

  it('places odd-indexed items on the right', () => {
    const wrapper = mount(PixelTimeline, { props: { items } })
    const els = wrapper.findAll('.pixel-timeline__item')
    expect(els[0]?.classes()).not.toContain('pixel-timeline__item--right')
    expect(els[1]?.classes()).toContain('pixel-timeline__item--right')
    expect(els[2]?.classes()).not.toContain('pixel-timeline__item--right')
  })

  it('renders a node for each item', () => {
    const wrapper = mount(PixelTimeline, { props: { items } })
    expect(wrapper.findAll('.pixel-timeline__node')).toHaveLength(3)
  })

  it('renders nothing when items is empty', () => {
    const wrapper = mount(PixelTimeline, { props: { items: [] } })
    expect(wrapper.findAll('.pixel-timeline__item')).toHaveLength(0)
  })

  it('has the pixel-timeline root class', () => {
    const wrapper = mount(PixelTimeline, { props: { items: [] } })
    expect(wrapper.classes()).toContain('pixel-timeline')
  })
})
