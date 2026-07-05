import { defineConfig } from 'vitest/config'

// docs-nav.ts 和 news-utils.ts 在模块加载时通过 import.meta.glob 引用 src/docs/*.md
// 与 src/news/*.md。VitePress 在生产构建中由内置插件解析这些 .md 模块，但 Vitest
// 不会加载 VitePress 配置。提供 .md 模块的合成空壳，让 glob 评估可以完成；测试
// 通过参数注入自己的 mock，不会使用这些合成模块。
const mdStubPlugin = {
  name: 'vitest-md-stub',
  enforce: 'pre' as const,
  load(id: string) {
    if (id.includes('/src/docs/') && id.endsWith('.md')) {
      return {
        code: 'export default {}; export const __pageData = { frontmatter: {} };',
        map: null,
      }
    }
    if (id.includes('/src/news/') && id.endsWith('.md')) {
      return {
        code: 'export default {}; export const __pageData = { frontmatter: {} };',
        map: null,
      }
    }
    return null
  },
}

export default defineConfig({
  plugins: [mdStubPlugin],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.vitepress/dist/**', '.vitepress/cache/**'],
  },
})
