import assert from 'node:assert/strict'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, '.vitepress/dist')
const fixtures = ['news', 'docs'].map((section) =>
  join(root, `src/${section}/verify-publication-fixture.md`),
)
const marker = 'PixelPublicationFixtureSecret74291'
const cleanEnv = { ...process.env }
delete cleanEnv.SITE_URL
delete cleanEnv.BASE_PATH

function run(script, args, env) {
  execFileSync(process.execPath, [join(root, script), ...args], { cwd: root, env, stdio: 'pipe' })
}

function build(siteUrl, draft) {
  for (const file of fixtures) {
    writeFileSync(
      file,
      `---\ntitle: ${marker}\ndraft: ${draft}\nbrief: ${marker}\ncategory: Test\ncardDescription: ${marker}\ndate: 2026-10-14\n---\n\n${marker}\n`,
    )
  }
  const env = { ...cleanEnv, ...(siteUrl ? { SITE_URL: siteUrl } : {}) }
  run('node_modules/vitepress/bin/vitepress.js', ['build'], env)
  run('node_modules/pagefind/lib/runner/bin.cjs', ['--site', '.vitepress/dist'], env)
  return env
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : [path]
  })
}

function verify(siteUrl) {
  assert(readFileSync(join(dist, 'news/index.html'), 'utf8').includes('overview-title'))
  assert(readFileSync(join(dist, 'docs/index.html'), 'utf8').includes('快速开始'))
  assert(readFileSync(join(dist, 'docs/quick-start.html'), 'utf8').includes('部署'))
  for (const section of ['news', 'docs']) {
    assert(!existsSync(join(dist, section, 'verify-publication-fixture.html')))
  }
  assert(!existsSync(join(dist, 'news/draft-demo.html')))
  for (const file of files(dist)) {
    if (/\.(html|js|json|xml|rss)$/.test(file)) {
      assert(!readFileSync(file, 'utf8').includes(marker), `Draft data leaked into ${file}`)
    }
    if (file.endsWith('.pf_fragment')) {
      assert(
        !gunzipSync(readFileSync(file)).toString().includes(marker),
        `Draft entered search index: ${file}`,
      )
    }
  }
  const home = readFileSync(join(dist, 'index.html'), 'utf8')
  if (!siteUrl) {
    assert(!home.includes('rel="canonical"'))
    assert(!home.includes('property="og:url"'))
    assert(!existsSync(join(dist, 'feed.rss')))
    assert(!existsSync(join(dist, 'sitemap.xml')))
    return
  }
  const url = new URL(siteUrl)
  const base = url.pathname.replace(/\/?$/, '/')
  const normalized = url.origin + base
  for (const [path, expected] of [
    ['index.html', normalized],
    ['news/index.html', normalized + 'news/'],
    ['news/welcome.html', normalized + 'news/welcome.html'],
  ]) {
    const html = readFileSync(join(dist, path), 'utf8')
    assert(html.includes(`rel="canonical" href="${expected}"`), `Wrong canonical: ${path}`)
    assert(html.includes(`property="og:url" content="${expected}"`))
    assert(html.includes(`href="${base}logo.png"`))
    for (const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
      if (match[1].startsWith(base + 'assets/') || match[1].startsWith(base + 'fonts/')) {
        assert(existsSync(join(dist, match[1].slice(base.length))), `Missing resource: ${match[1]}`)
      }
    }
  }
  const rss = readFileSync(join(dist, 'feed.rss'), 'utf8')
  assert(rss.includes(`<link>${normalized}</link>`))
  assert(rss.includes(`<link>${normalized}news/welcome.html</link>`))
  assert(rss.includes(`url="${normalized}background/`))
  assert(!rss.includes('draft-demo'))
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
  assert(sitemap.includes(`<loc>${normalized}news/</loc>`))
  assert(!sitemap.includes('draft-demo'))
  assert(!sitemap.includes('404.html'))
}

for (const file of fixtures) assert(!existsSync(file), `Refusing to replace existing file: ${file}`)
try {
  // Seed an actual published output first, then prove the next build removes it.
  build('https://example.com/community/', false)
  assert(existsSync(join(dist, 'news/verify-publication-fixture.html')))
  for (const path of ['news/index.html', 'docs/index.html', 'docs/quick-start.html']) {
    assert(
      readFileSync(join(dist, path), 'utf8').includes(marker),
      `Published fixture missing from ${path}`,
    )
  }
  for (const siteUrl of [
    undefined,
    'https://example.com/',
    'https://example.com/community',
    'https://demo.github.io/pixel-eco/',
  ]) {
    build(siteUrl, true)
    verify(siteUrl)
    console.log(`Verified: ${siteUrl || 'local without SITE_URL'}`)
  }
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString())
  if (error.stderr) console.error(error.stderr.toString())
  throw error
} finally {
  for (const file of fixtures) if (existsSync(file)) unlinkSync(file)
}
