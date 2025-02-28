import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:8000",
    //     changeOrigin: true,
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   },
    
    // }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
})
