import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  integrations: [react(), svelte()],
  server: {
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
})
