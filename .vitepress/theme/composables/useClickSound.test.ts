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
      const instance = { play: vi.fn().mockResolvedValue(undefined), volume: 0 }
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

  it('plays the shared default sound when no URL is provided', () => {
    const { playSound } = useClickSound()
    playSound()
    expect(AudioMock).toHaveBeenCalledWith('/mocked-base/button.click.ogg')
    expect(audioInstances[0]?.volume).toBe(0.3)
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

  it('sets the volume before starting playback', () => {
    AudioMock.mockImplementationOnce(() => {
      const instance = {
        volume: 0,
        play: vi.fn(() => {
          expect(instance.volume).toBe(0.7)
          return Promise.resolve()
        }),
      }
      return instance
    })

    useClickSound({ volume: 0.7 }).playSound('/button.click.ogg')
  })

  it('handles rejected playback promises', async () => {
    const play = vi.fn().mockRejectedValue(new Error('Playback blocked'))
    AudioMock.mockImplementationOnce(() => ({
      volume: 0,
      play,
    }))

    expect(() => useClickSound().playSound('/button.click.ogg')).not.toThrow()

    // Let Vitest detect any unhandled rejection after playback settles.
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(play).toHaveBeenCalledTimes(1)
  })

  it('returns no-op playSound during SSR without throwing', () => {
    vi.stubEnv('SSR', true)
    const { playSound } = useClickSound()
    expect(() => playSound('/button.click.ogg')).not.toThrow()
    expect(AudioMock).not.toHaveBeenCalled()
  })
})
