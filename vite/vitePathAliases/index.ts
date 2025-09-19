import type { Plugin } from 'vite'

export function vitePathAliases(): Plugin {
  return {
    name: 'vite-path-aliases',
    enforce: 'pre',
    config(config, { command }) {
      console.log('config', config)
      console.log('command', command)

      return config
    },
  }
}
