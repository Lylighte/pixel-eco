import type { Plugin } from 'vitepress'

export function devHmr(): Plugin {
  return {
    name: 'pixel:dev-hmr',
    apply: 'serve',
    enforce: 'post',
    handleHotUpdate(context) {
      // VitePress 1.6 keeps data-loader records across server recreation. A
      // loader not yet requested in the new server has no module-graph node,
      // but vitepress:data still appends its undefined lookup to this list.
      // Run after that plugin and retain all actual HMR modules.
      return context.modules.filter((module) => module != null)
    },
  }
}
