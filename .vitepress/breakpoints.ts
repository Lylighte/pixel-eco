import { readFileSync } from 'node:fs'

// Media queries cannot resolve CSS custom properties in the browser. Expand only
// breakpoint tokens at build time, keeping vars.css as the single source of truth.
export function pixelBreakpoints() {
  const css = readFileSync(new URL('./theme/styles/vars.css', import.meta.url), 'utf8')
  const tokens = new Map(
    [...css.matchAll(/(--pixel-break-(?:mobile|small)):\s*(\d+px)\s*;/g)].map(([, name, value]) => [
      name,
      value,
    ]),
  )
  return {
    postcssPlugin: 'pixel-breakpoints',
    AtRule: {
      media(rule: { params: string }) {
        rule.params = rule.params.replace(/var\((--pixel-break-[\w-]+)\)/g, (_, name) => {
          const value = tokens.get(name)
          if (!value) throw new Error(`Unknown breakpoint token: ${name}`)
          return value
        })
      },
    },
  }
}
