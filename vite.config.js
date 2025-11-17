import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署配置
// Vercel: base = '/' (根路径)
// GitHub Pages: base = '/vocabulary-canvas/' (仓库名路径)
// 可以通过环境变量 VITE_BASE_PATH 覆盖
function getBasePath() {
  // 优先使用环境变量
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH
  }
  
  // Vercel 部署（检测 VERCEL 环境变量）
  if (process.env.VERCEL) {
    return '/'
  }
  
  // GitHub Actions 部署（检测 GITHUB_REPOSITORY 环境变量）
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    return `/${repoName}/`
  }
  
  // 默认：生产环境使用仓库名路径（GitHub Pages），开发环境使用根路径
  if (process.env.NODE_ENV === 'production') {
    // 如果没有检测到 Vercel，假设是 GitHub Pages
    return '/vocabulary-canvas/'
  }
  
  return '/'
}

export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
})

