import { defineLoader, type SiteConfig } from 'vitepress'
import { contentModules } from './content'
import { buildNewsCards } from './theme/utils/news-utils'
import { buildDocCards, buildSidebarNav } from './theme/utils/docs-nav'

export interface Collections {
  news: ReturnType<typeof buildNewsCards>
  docs: ReturnType<typeof buildDocCards>
  sidebar: ReturnType<typeof buildSidebarNav>
}

declare const data: Collections
export { data }

export default defineLoader({
  watch: ['../src/news/*.md', '../src/docs/*.md'],
  load(files): Collections {
    const config = (globalThis as typeof globalThis & { VITEPRESS_CONFIG: SiteConfig })
      .VITEPRESS_CONFIG
    const isDev = config.userConfig.vite?.define?.__CONTENT_DEV__ === 'true'
    const news = contentModules(
      files.filter((file) => /(^|\/)src\/news\//.test(file.replace(/\\/g, '/'))),
      isDev,
    )
    const docs = contentModules(
      files.filter((file) => /(^|\/)src\/docs\//.test(file.replace(/\\/g, '/'))),
      isDev,
    )
    return {
      news: buildNewsCards(news, !isDev),
      docs: buildDocCards(docs, !isDev),
      sidebar: buildSidebarNav(docs, !isDev),
    }
  },
})
