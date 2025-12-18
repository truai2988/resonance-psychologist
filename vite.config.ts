import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                legal: resolve(__dirname, 'legal.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                apply: resolve(__dirname, 'apply.html'),
            },
        },
    },
})
