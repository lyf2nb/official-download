import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/official-download': {
                target: 'http://localhost:8088',
                changeOrigin: true,
            },
        }
    }
})
