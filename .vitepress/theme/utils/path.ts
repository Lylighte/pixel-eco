// VitePress SSR 期间 route.path 可能包含 base 前缀，手动剥离
// 以完整路径段匹配，兼容 base 有无尾斜杠。
export function stripBase(path: string, base: string): string {
  const prefix = base.replace(/\/+$/, '')
  if (prefix && prefix !== '.' && (path === prefix || path.startsWith(prefix + '/'))) {
    return path.slice(prefix.length) || '/'
  }
  return path
}
