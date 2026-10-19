import { defineConfig } from 'vitest/config'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

// Reuse VitePress's Vue compiler plugin for component regression tests.
const require = createRequire(import.meta.url)
const { default: vue } = await import(
  pathToFileURL(
    require.resolve('@vitejs/plugin-vue', { paths: [require.resolve('vitepress/package.json')] }),
  ).href
)

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.vitepress/dist/**', '.vitepress/cache/**'],
  },
})
