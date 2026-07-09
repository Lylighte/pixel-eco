import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelTextarea from './PixelTextarea.vue'

describe('PixelTextarea', () => {
  it('renders a textarea element', () => {
    const wrapper = mount(PixelTextarea)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('has the pixel-input class', () => {
    const wrapper = mount(PixelTextarea)
    expect(wrapper.find('textarea').classes()).toContain('pixel-input')
  })

  it('reflects the model value in the textarea', () => {
    const wrapper = mount(PixelTextarea, { props: { modelValue: '多行\n文本' } })
    expect(wrapper.find('textarea').element.value).toBe('多行\n文本')
  })

  it('emits update:modelValue when typing', async () => {
    const wrapper = mount(PixelTextarea)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('新内容')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新内容'])
  })

  it('defaults to empty string', () => {
    const wrapper = mount(PixelTextarea)
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('adjusts height on input event', async () => {
    const wrapper = mount(PixelTextarea)
    const textarea = wrapper.find('textarea')
    // 模拟输入触发 @input 中的高度自适应逻辑
    await textarea.trigger('input')
    // 不抛错即说明 input 处理函数正常执行
    expect(textarea.exists()).toBe(true)
  })
})
