import assert from 'node:assert/strict'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
  statSync,
  mkdtempSync,
  rmdirSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { JSDOM } from 'jsdom'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, '.vitepress/dist')
const fixtures = ['news', 'docs'].map((section) =>
  join(root, `src/${section}/verify-publication-fixture.md`),
)
const marker = 'PixelPublicationFixtureSecret74291'
const temporary = mkdtempSync(join(tmpdir(), 'pixel-eco-verify-'))
const notFoundSnapshot = join(temporary, '404.html')
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
  // VitePress intentionally leaves #app empty in 404.html and mounts it on the
  // client. Capture its actual SSR render through the public build hook so the
  // same link/resource checks cover the custom 404 without changing the output.
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import { build } from 'vitepress'
    import { writeFileSync } from 'node:fs'
    await build(process.cwd(), {
      onAfterConfigResolve(config) {
        const original = config.transformHtml
        config.transformHtml = async (html, id, context) => {
          if (context.page === '404.md') writeFileSync(process.argv[1], context.content)
          return original ? await original(html, id, context) : html
        }
      }
    })
  `,
      notFoundSnapshot,
    ],
    { cwd: root, env, stdio: 'pipe' },
  )
  run('node_modules/pagefind/lib/runner/bin.cjs', ['--site', '.vitepress/dist'], env)
  return env
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : [path]
  })
}

function verifyPaths(html, page, siteUrl) {
  const url = new URL(siteUrl)
  const base = url.pathname.replace(/\/?$/, '/')
  const document = new JSDOM(html).window.document
  let localReferences = 0
  for (const element of document.querySelectorAll('[href], [src]')) {
    for (const attribute of ['href', 'src']) {
      const value = element.getAttribute(attribute)
      if (!value || value.startsWith('#')) continue
      const target = new URL(value, new URL(page, url.origin + base))
      if (target.origin !== url.origin) continue
      const path = decodeURIComponent(target.pathname)
      assert(path.startsWith(base), `Missing base in ${page}: ${value}`)
      if (base !== '/') {
        assert(!path.includes(base + base.slice(1)), `Duplicate base in ${page}: ${value}`)
      }
      const local = join(dist, path.slice(base.length))
      assert(
        [local, local + '.html', join(local, 'index.html')].some(
          (file) => existsSync(file) && statSync(file).isFile(),
        ),
        `Missing link or resource in ${page}: ${value}`,
      )
      localReferences++
    }
  }
  assert(localReferences > 0, `No local references checked in ${page}`)
  return document
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
  for (const page of [
    'index.html',
    'docs/index.html',
    'docs/quick-start.html',
    '404.html',
    'news/welcome.html',
    'news/community-update.html',
  ]) {
    let html = readFileSync(join(dist, page), 'utf8')
    if (page === '404.html') {
      html = html.replace(
        '<div id="app"></div>',
        `<div id="app">${readFileSync(notFoundSnapshot, 'utf8')}</div>`,
      )
    }
    const document = verifyPaths(html, page, siteUrl)
    if (page === '404.html') {
      assert.equal(document.querySelector('.not-found-link')?.getAttribute('href'), base)
      assert.equal(
        document.querySelector('.not-found-image')?.getAttribute('src'),
        base + '404.png',
      )
    }
    if (page.startsWith('news/')) {
      assert.equal(document.querySelector('.article-back')?.getAttribute('href'), base + 'news/')
      assert(document.querySelector('.article-neighbor'), `Missing article navigation: ${page}`)
    }
  }
  for (const file of files(join(dist, 'assets')).filter((file) => file.endsWith('.css'))) {
    assert(
      !/@media[^{}]*var\(--pixel-break-/.test(readFileSync(file, 'utf8')),
      `Unexpanded breakpoint in ${file}`,
    )
  }
  // Prove the checker detects both regressions, including the original 404 link.
  if (base !== '/') {
    assert.throws(() => verifyPaths('<a href="/">Home</a>', '404.html', siteUrl), /Missing base/)
    assert.throws(
      () => verifyPaths(`<img src="${base}${base.slice(1)}logo.png">`, 'index.html', siteUrl),
      /Duplicate base/,
    )
  }
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
    'https://example.com/community/',
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
  if (existsSync(notFoundSnapshot)) unlinkSync(notFoundSnapshot)
  rmdirSync(temporary)
}
