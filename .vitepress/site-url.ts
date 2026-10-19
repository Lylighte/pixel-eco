export function normalizeBase(value: string): string {
  if (value === './')
    throw new Error('BASE_PATH=./ is no longer supported. Use / or an absolute subpath.')
  if (!value.startsWith('/') || value.startsWith('//') || /[?#\\]/.test(value)) {
    throw new Error('BASE_PATH must be / or an absolute path such as /community/.')
  }
  if (new URL(value, 'https://local.invalid').pathname !== value) {
    throw new Error('BASE_PATH must not contain dot segments or unescaped characters.')
  }
  return value.replace(/\/+$/, '') + '/'
}

export function resolveDeployment(env: { SITE_URL?: string; BASE_PATH?: string }, isDev = false) {
  let siteUrl = ''
  let origin = ''
  let publicBase = '/'
  if (env.SITE_URL) {
    const url = new URL(env.SITE_URL)
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error(
        'SITE_URL must be an HTTP(S) site URL without credentials, query, or fragment.',
      )
    }
    publicBase = normalizeBase(url.pathname)
    origin = url.origin
    siteUrl = origin + publicBase
  }
  if (env.BASE_PATH) {
    const override = normalizeBase(env.BASE_PATH)
    if (siteUrl && override !== publicBase) {
      throw new Error(`BASE_PATH (${override}) must match SITE_URL pathname (${publicBase}).`)
    }
    publicBase = override
  }
  return { siteUrl, origin, base: isDev ? '/' : publicBase }
}

// Paths are relative to srcDir; directory index pages use their directory URL.
export function pagePath(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
}

export function pageUrl(siteUrl: string, relativePath: string): string {
  return new URL(pagePath(relativePath), siteUrl).href
}
