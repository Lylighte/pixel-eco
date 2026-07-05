// VitePress SSR 期间 route.path 可能包含 base 前缀，手动剥离
// base 含尾部斜杠时保留开头的 /
export function stripBase(path: string, base: string): string {
  if (base && base !== '/' && base !== './' && path.startsWith(base)) {
    return path.slice(base.length - 1)
  }
  return path
}
