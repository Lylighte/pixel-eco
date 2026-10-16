import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelButton from './PixelButton.vue'
import PixelButtonClassic from './PixelButtonClassic.vue'
import PixelButton3D from './PixelButton3D.vue'

vi.mock('../../composables/useClickSound', () => ({
  useClickSound: () => ({ playSound: vi.fn() }),
}))

describe.each([PixelButton, PixelButtonClassic, PixelButton3D])(
  'pixel button keyboard access',
  (component) => {
    it('is focusable and activates once with Enter or a released Space', async () => {
      const wrapper = mount(component, { slots: { default: '操作' } })
      expect(wrapper.attributes('role')).toBe('button')
      expect(wrapper.attributes('tabindex')).toBe('0')
      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toHaveLength(1)
      await wrapper.trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toHaveLength(1)
      await wrapper.trigger('keyup', { key: ' ' })
      expect(wrapper.emitted('click')).toHaveLength(2)
      wrapper.unmount()
    })
  },
)
