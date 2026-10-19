import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelTabs from './PixelTabs.vue'

vi.mock('../../composables/useClickSound', () => ({
  useClickSound: () => ({ playSound: vi.fn() }),
}))

describe('PixelTabs', () => {
  it('renders all tab labels', () => {
    const wrapper = mount(PixelTabs, {
      props: { tabs: ['概览', '详情', '设置'] },
    })
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]?.text()).toBe('概览')
    expect(tabs[1]?.text()).toBe('详情')
    expect(tabs[2]?.text()).toBe('设置')
  })

  it('marks the first tab active by default', () => {
    const wrapper = mount(PixelTabs, { props: { tabs: ['A', 'B'] } })
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    expect(tabs[0]?.classes()).toContain('pixel-tabs__tab--active')
    expect(tabs[1]?.classes()).not.toContain('pixel-tabs__tab--active')
  })

  it('marks the tab at active prop as active', () => {
    const wrapper = mount(PixelTabs, { props: { tabs: ['A', 'B', 'C'], active: 2 } })
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    expect(tabs[2]?.classes()).toContain('pixel-tabs__tab--active')
    expect(tabs[0]?.classes()).not.toContain('pixel-tabs__tab--active')
  })

  it('sets aria-selected correctly for active and inactive tabs', () => {
    const wrapper = mount(PixelTabs, { props: { tabs: ['A', 'B'], active: 1 } })
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    expect(tabs[0]?.attributes('aria-selected')).toBe('false')
    expect(tabs[1]?.attributes('aria-selected')).toBe('true')
  })

  it('switches active tab on click', async () => {
    const wrapper = mount(PixelTabs, { props: { tabs: ['A', 'B', 'C'] } })
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    await tabs[2]?.trigger('click')
    expect(tabs[2]?.classes()).toContain('pixel-tabs__tab--active')
    expect(tabs[0]?.classes()).not.toContain('pixel-tabs__tab--active')
  })

  it('renders the active slot content', () => {
    const wrapper = mount(PixelTabs, {
      props: { tabs: ['A', 'B'], active: 1 },
      slots: { 'tab-0': '内容A', 'tab-1': '内容B' },
    })
    expect(wrapper.find('.pixel-tabs__content').text()).toBe('内容B')
  })

  it('updates slot content when switching tabs', async () => {
    const wrapper = mount(PixelTabs, {
      props: { tabs: ['A', 'B'] },
      slots: { 'tab-0': '内容A', 'tab-1': '内容B' },
    })
    expect(wrapper.find('.pixel-tabs__content').text()).toBe('内容A')
    const tabs = wrapper.findAll('.pixel-tabs__tab')
    await tabs[1]?.trigger('click')
    expect(wrapper.find('.pixel-tabs__content').text()).toBe('内容B')
  })

  it('has role tablist, tab, and tabpanel for a11y', () => {
    const wrapper = mount(PixelTabs, { props: { tabs: ['A'] } })
    expect(wrapper.find('.pixel-tabs__nav').attributes('role')).toBe('tablist')
    expect(wrapper.find('.pixel-tabs__tab').attributes('role')).toBe('tab')
    expect(wrapper.find('.pixel-tabs__content').attributes('role')).toBe('tabpanel')
  })
})
