import { withBase } from 'vitepress'

export function useClickSound(options?: { defaultUrl?: string; volume?: number }): {
  playSound: (url?: string) => void
} {
  if (import.meta.env.SSR) {
    return { playSound: () => {} }
  }

  const { defaultUrl, volume = 0.3 } = options ?? {}

  const playSound = (url?: string): void => {
    const resolvedUrl = url ?? defaultUrl
    if (!resolvedUrl) return

    const audio = new Audio(withBase(resolvedUrl))
    audio.play()
    audio.volume = volume
  }

  return { playSound }
}
