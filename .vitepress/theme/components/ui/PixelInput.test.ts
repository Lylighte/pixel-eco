import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelInput from './PixelInput.vue'

describe('PixelInput', () => {
  it('renders an input element', () => {
    const wrapper = mount(PixelInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('has the pixel-input class', () => {
    const wrapper = mount(PixelInput)
    expect(wrapper.find('input').classes()).toContain('pixel-input')
  })

  it('is a text input by default', () => {
    const wrapper = mount(PixelInput)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('reflects the model value in the input', () => {
    const wrapper = mount(PixelInput, { props: { modelValue: 'hello' } })
    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('emits update:modelValue when typing', async () => {
    const wrapper = mount(PixelInput)
    const input = wrapper.find('input')
    await input.setValue('typed')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['typed'])
  })

  it('defaults to empty string', () => {
    const wrapper = mount(PixelInput)
    expect(wrapper.find('input').element.value).toBe('')
  })
})
