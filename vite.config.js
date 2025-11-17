import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages部署配置
// 如果仓库名是 vocabulary-canvas，则base为 '/vocabulary-canvas/'
// 如果使用自定义域名，则base为 '/'
// 默认使用仓库名作为base路径
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'vocabulary-canvas'
const base = process.env.NODE_ENV === 'production' ? `/${repositoryName}/` : '/'

export default defineConfig({
  plugins: [react()],
  base: base,
})

