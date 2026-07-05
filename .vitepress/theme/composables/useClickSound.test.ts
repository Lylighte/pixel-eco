import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { withBase } from 'vitepress'
import { useClickSound } from './useClickSound'

vi.mock('vitepress', () => ({
  withBase: vi.fn((url: string) => `/mocked-base${url}`),
}))

describe('useClickSound', () => {
  const audioInstances: Array<{ play: ReturnType<typeof vi.fn>; volume: number }> = []
  const AudioMock = vi.fn()

  beforeEach(() => {
    audioInstances.length = 0
    AudioMock.mockImplementation(() => {
      const instance = { play: vi.fn(), volume: 0 }
      audioInstances.push(instance)
      return instance
    })
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('does not create Audio when URL is empty', () => {
    const { playSound } = useClickSound()
    playSound('')
    expect(AudioMock).not.toHaveBeenCalled()
  })

  it('does not create Audio when no URL is provided and defaultUrl is missing', () => {
    const { playSound } = useClickSound()
    playSound()
    expect(AudioMock).not.toHaveBeenCalled()
  })

  it('plays sound with default volume 0.3 and resolves URL via withBase', () => {
    const { playSound } = useClickSound()
    playSound('/button.click.ogg')
    expect(withBase).toHaveBeenCalledWith('/button.click.ogg')
    expect(AudioMock).toHaveBeenCalledTimes(1)
    expect(AudioMock).toHaveBeenCalledWith('/mocked-base/button.click.ogg')
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1)
    expect(audioInstances[0]?.volume).toBe(0.3)
  })

  it('falls back to defaultUrl when url argument is omitted', () => {
    const { playSound } = useClickSound({ defaultUrl: '/default.ogg' })
    playSound()
    expect(withBase).toHaveBeenCalledWith('/default.ogg')
    expect(AudioMock).toHaveBeenCalledTimes(1)
  })

  it('uses custom volume when provided', () => {
    const { playSound } = useClickSound({ volume: 0.7 })
    playSound('/button.click.ogg')
    expect(audioInstances[0]?.volume).toBe(0.7)
  })

  it('returns no-op playSound during SSR without throwing', () => {
    vi.stubEnv('SSR', true)
    const { playSound } = useClickSound()
    expect(() => playSound('/button.click.ogg')).not.toThrow()
    expect(AudioMock).not.toHaveBeenCalled()
  })
})
