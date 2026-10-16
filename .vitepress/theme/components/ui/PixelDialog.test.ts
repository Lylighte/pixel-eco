import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelDialog from './PixelDialog.vue'

vi.mock('../../composables/useClickSound', () => ({
  useClickSound: () => ({ playSound: vi.fn() }),
}))

const wrappers: ReturnType<typeof mount>[] = []

function mountDialog(modelValue = true) {
  const wrapper = mount(PixelDialog, {
    props: { modelValue, title: '确认操作' },
    slots: { default: '<p>对话框内容</p>' },
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('PixelDialog', () => {
  it('renders an initially open dialog with accessible metadata and valid title markup', () => {
    const wrapper = mountDialog()
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-label')).toBe('确认操作')
    expect(dialog.get('.dialog-title').element.tagName).toBe('SPAN')
    expect(dialog.text()).toContain('对话框内容')
  })

  it('follows the model through rapid open, close and reopen updates', async () => {
    const wrapper = mountDialog(false)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await wrapper.setProps({ modelValue: true })
    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('closes on Escape only while open and cleans up its listener on unmount', async () => {
    const wrapper = mountDialog(false)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ modelValue: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    const removeListener = vi.spyOn(document, 'removeEventListener')
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    wrapper.unmount()
    expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeListener.mockRestore()
  })

  it('closes on the backdrop and cancel button, but not on content clicks', async () => {
    const wrapper = mountDialog()
    await wrapper.get('.dialog').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('.dialog-cover').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])

    const cancelWrapper = mountDialog()
    await cancelWrapper.get('.dialog-footer-btn').trigger('click')
    expect(cancelWrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(cancelWrapper.emitted('confirm')).toBeUndefined()
  })

  it('closes and emits confirm from the confirm button', async () => {
    const wrapper = mountDialog()
    await wrapper.findAll('.dialog-footer-btn')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })
})
