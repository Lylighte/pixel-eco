import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PixelDialog from './PixelDialog.vue'

vi.mock('vitepress', () => ({
  withBase: vi.fn((url: string) => `/mocked-base${url}`),
}))

describe('PixelDialog', () => {
  const AudioMock = vi.fn()

  beforeEach(() => {
    AudioMock.mockImplementation(() => ({ play: vi.fn(), volume: 0 }))
    vi.stubGlobal('Audio', AudioMock)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('is hidden when modelValue is false', () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: false } })
    expect(wrapper.find('.dialog-cover').exists()).toBe(false)
  })

  it('is visible when modelValue is true on mount', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    expect(wrapper.find('.dialog-cover').exists()).toBe(true)
  })

  it('renders title when provided', async () => {
    const wrapper = mount(PixelDialog, {
      props: { modelValue: true, title: '确认操作' },
    })
    await nextTick()
    expect(wrapper.find('.dialog-title').text()).toBe('确认操作')
  })

  it('does not render title element when title is empty', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    expect(wrapper.find('.dialog-title').exists()).toBe(false)
  })

  it('renders default slot content', async () => {
    const wrapper = mount(PixelDialog, {
      props: { modelValue: true },
      slots: { default: '<p>正文内容</p>' },
    })
    await nextTick()
    expect(wrapper.text()).toContain('正文内容')
  })

  it('shows default cancel and confirm text', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    const buttons = wrapper.findAll('.dialog-footer-btn')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]?.text()).toBe('取消')
    expect(buttons[1]?.text()).toBe('确认')
  })

  it('uses custom cancel and confirm text', async () => {
    const wrapper = mount(PixelDialog, {
      props: { modelValue: true, cancelText: '返回', confirmText: '提交' },
    })
    await nextTick()
    const buttons = wrapper.findAll('.dialog-footer-btn')
    expect(buttons[0]?.text()).toBe('返回')
    expect(buttons[1]?.text()).toBe('提交')
  })

  it('emits modelValue false when clicking the cover backdrop', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    await wrapper.find('.dialog-cover').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('does not close when clicking inside the dialog body', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    await wrapper.find('.dialog').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes and emits confirm when confirm button clicked', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    const buttons = wrapper.findAll('.dialog-footer-btn')
    await buttons[1]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('closes without emitting confirm when cancel button clicked', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    const buttons = wrapper.findAll('.dialog-footer-btn')
    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('becomes visible when modelValue changes from false to true', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: false } })
    expect(wrapper.find('.dialog-cover').exists()).toBe(false)
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.dialog-cover').exists()).toBe(true)
  })

  it('hides after close animation timeout completes', async () => {
    const wrapper = mount(PixelDialog, { props: { modelValue: true } })
    await nextTick()
    await wrapper.setProps({ modelValue: false })
    // dialog still visible during 300ms fade-out
    expect(wrapper.find('.dialog-cover').exists()).toBe(true)
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(wrapper.find('.dialog-cover').exists()).toBe(false)
  })

  it('renders custom footer slot instead of default buttons', async () => {
    const wrapper = mount(PixelDialog, {
      props: { modelValue: true },
      slots: { footer: '<button class="custom-btn">自定义</button>' },
    })
    await nextTick()
    expect(wrapper.find('.custom-btn').exists()).toBe(true)
    expect(wrapper.findAll('.dialog-footer-btn')).toHaveLength(0)
  })
})
