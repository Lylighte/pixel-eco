import { withBase } from 'vitepress'

const DEFAULT_SOUND_URL = '/button.click.ogg'
const DEFAULT_SOUND_VOLUME = 0.3

export function useClickSound(options?: { defaultUrl?: string; volume?: number }): {
  playSound: (url?: string) => void
} {
  if (import.meta.env.SSR) {
    return { playSound: () => {} }
  }

  const { defaultUrl = DEFAULT_SOUND_URL, volume = DEFAULT_SOUND_VOLUME } = options ?? {}

  const playSound = (url?: string): void => {
    const resolvedUrl = url ?? defaultUrl
    if (!resolvedUrl) return

    const audio = new Audio(withBase(resolvedUrl))
    audio.volume = volume
    void audio.play().catch(() => {})
  }

  return { playSound }
}
