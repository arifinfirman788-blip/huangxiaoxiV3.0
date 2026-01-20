import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // 仅在生产构建时使用 GitHub Pages 的 base 路径
    base: command === 'build' ? '/huangxiaoxiV3.0/' : '/',
  }
})
