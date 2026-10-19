// @vitest-environment node
import { afterAll, describe, expect, it } from 'vitest'
import { createMarkdownRenderer, disposeMdItInstance, type Header } from 'vitepress'
import config from './config'
import { flattenOutline } from './theme/utils/docs-outline'

afterAll(() => disposeMdItInstance())

describe('compiled document headings', () => {
  it('extracts actual Markdown headings with matching anchors using the site configuration', async () => {
    const options = config({ command: 'serve', mode: 'development' }).markdown
    const md = await createMarkdownRenderer(process.cwd(), options)
    const env: { headers?: Header[] } = {}
    const html = md.render(
      [
        '# 主标题',
        '## 次标题',
        '### 节标题',
        '## 次标题',
        '# 主标题2 {#custom-title}',
        '#### 跳级',
        '##### 五级',
        '###### 六级',
        '',
        '下划线标题\n----------',
        '',
        '```md',
        '# 不收录的示例',
        '```',
      ].join('\n\n'),
      env,
    )
    const headers = flattenOutline(env.headers ?? [])
    expect(headers.map((item) => item.level)).toEqual([1, 2, 3, 2, 1, 4, 5, 6, 2])
    expect(headers.map((item) => item.slug)).toEqual([
      '主标题',
      '次标题',
      '节标题',
      '次标题-1',
      'custom-title',
      '跳级',
      '五级',
      '六级',
      '下划线标题',
    ])
    for (const header of headers) expect(html).toContain(`id="${header.slug}"`)
    expect(env.headers?.map((item) => item.slug)).toEqual(['主标题', 'custom-title'])
  }, 20000)
})
