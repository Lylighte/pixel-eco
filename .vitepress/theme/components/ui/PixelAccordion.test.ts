import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelAccordion from './PixelAccordion.vue'

describe('PixelAccordion', () => {
  it('renders the title', () => {
    const wrapper = mount(PixelAccordion, { props: { title: '常见问题' } })
    expect(wrapper.find('.pixel-accordion__title').text()).toBe('常见问题')
  })

  it('is closed by default', () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T' } })
    expect(wrapper.find('.pixel-accordion').classes()).not.toContain('pixel-accordion--open')
    // v-show sets inline display:none
    const body = wrapper.find('.pixel-accordion__body').element as HTMLElement
    expect(body.style.display).toBe('none')
  })

  it('is open when open prop is true', () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T', open: true } })
    expect(wrapper.find('.pixel-accordion').classes()).toContain('pixel-accordion--open')
    const body = wrapper.find('.pixel-accordion__body').element as HTMLElement
    expect(body.style.display).not.toBe('none')
  })

  it('shows right-pointing arrow when closed', () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T' } })
    expect(wrapper.find('.pixel-accordion__arrow').text()).toBe('▶')
  })

  it('shows down-pointing arrow when open', () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T', open: true } })
    expect(wrapper.find('.pixel-accordion__arrow').text()).toBe('▼')
  })

  it('toggles open state on header click', async () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T' } })
    let body = wrapper.find('.pixel-accordion__body').element as HTMLElement
    expect(body.style.display).toBe('none')
    await wrapper.find('.pixel-accordion__header').trigger('click')
    body = wrapper.find('.pixel-accordion__body').element as HTMLElement
    expect(body.style.display).not.toBe('none')
    await wrapper.find('.pixel-accordion__header').trigger('click')
    body = wrapper.find('.pixel-accordion__body').element as HTMLElement
    expect(body.style.display).toBe('none')
  })

  it('updates aria-expanded on toggle', async () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T' } })
    expect(wrapper.find('.pixel-accordion__header').attributes('aria-expanded')).toBe('false')
    await wrapper.find('.pixel-accordion__header').trigger('click')
    expect(wrapper.find('.pixel-accordion__header').attributes('aria-expanded')).toBe('true')
  })

  it('renders default slot content in body', () => {
    const wrapper = mount(PixelAccordion, {
      props: { title: 'T', open: true },
      slots: { default: '<p>折叠内容</p>' },
    })
    expect(wrapper.find('.pixel-accordion__body').text()).toContain('折叠内容')
  })

  it('uses a button element for the header', () => {
    const wrapper = mount(PixelAccordion, { props: { title: 'T' } })
    expect(wrapper.find('.pixel-accordion__header').element.tagName).toBe('BUTTON')
  })
})
