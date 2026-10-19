import assert from 'node:assert/strict'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vitepress'

const root = fileURLToPath(new URL('../', import.meta.url))
const fixture = join(root, 'src/docs/verify-hmr-fixture.md')
const loaderUrl = '/@fs/' + join(root, '.vitepress/collections.data.ts').replaceAll('\\', '/')
const options = {
  host: '127.0.0.1',
  port: 0,
  // Replay the HMR pipeline explicitly, avoiding duplicate filesystem events.
  watch: { ignored: ['**/*'] },
}

function writeFixture(title) {
  writeFileSync(fixture, `---\ntitle: ${title}\ndraft: true\n---\n\n# ${title}\n`)
}

async function hotUpdate(server, file) {
  file = file.replaceAll('\\', '/')
  await server.pluginContainer.watchChange(file, { event: 'update' })
  server.moduleGraph.onFileChange(file)
  const context = {
    file,
    timestamp: Date.now(),
    modules: [...(server.moduleGraph.getModulesByFile(file) ?? [])],
    read: async () => readFileSync(file, 'utf8'),
    server,
  }
  // This is Vite 5's update path: run every plugin in HMR order, then propagate
  // the resulting modules through the real module graph. No browser or proxy.
  for (const hook of server.config.getSortedPluginHooks('handleHotUpdate')) {
    const filtered = await hook(context)
    if (filtered) context.modules = filtered
  }
  assert(context.modules.every(Boolean), `Undefined HMR module for ${file}`)
  for (const module of new Set(context.modules)) await server.reloadModule(module)
  return context.modules
}

assert(!existsSync(fixture), `Refusing to replace existing file: ${fixture}`)
let first
let second
try {
  writeFixture('PixelHmrInitial')
  first = await createServer(root, options)
  await first.listen()
  assert((await first.transformRequest(loaderUrl)).code.includes('PixelHmrInitial'))
  // A changed lockfile starts dependency scanning in the background. Let the
  // initial request crawl finish before closing either short-lived server.
  await first.waitForRequestsIdle()
  await first.close()
  first = undefined

  // VitePress's process-wide loader map still contains the old loader, but the
  // recreated server has only loaded the Markdown page, not its collection yet.
  second = await createServer(root, options)
  await second.listen()
  await second.transformRequest('/docs/verify-hmr-fixture.md')
  assert(!second.moduleGraph.getModuleById(loaderUrl.slice('/@fs/'.length)))
  const markdown = second.moduleGraph.getModuleById(fixture.replaceAll('\\', '/'))
  assert(markdown, 'Markdown was not added to the module graph')
  writeFixture('PixelHmrRestarted')
  assert((await hotUpdate(second, fixture)).includes(markdown), 'Document HMR was lost')
  console.log('Verified: document HMR after server recreation, before collection loading')

  assert((await second.transformRequest(loaderUrl)).code.includes('PixelHmrRestarted'))
  writeFixture('PixelHmrUpdated')
  const loader = second.moduleGraph.getModuleById(loaderUrl.slice('/@fs/'.length))
  assert((await hotUpdate(second, fixture)).includes(loader), 'Collection HMR was lost')
  const updated = (await second.transformRequest(loaderUrl)).code
  assert(
    updated.includes('PixelHmrUpdated'),
    'Collection did not refresh after editing frontmatter',
  )
  assert(!updated.includes('PixelHmrRestarted'), 'Collection retained stale frontmatter')
  console.log('Verified: loaded collections refresh after editing document frontmatter')

  await hotUpdate(second, join(root, '.vitepress/theme/utils/docs-nav.ts'))
  assert((await second.transformRequest(loaderUrl)).code.includes('PixelHmrUpdated'))
  console.log('Verified: collection dependency HMR')
  await second.waitForRequestsIdle()
} finally {
  if (existsSync(fixture)) unlinkSync(fixture)
  await first?.close()
  await second?.close()
}
