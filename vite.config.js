import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages部署配置
// 如果仓库名是 vocabulary-canvas，则base为 '/vocabulary-canvas/'
// 如果使用自定义域名，则base为 '/'
// 默认使用仓库名作为base路径
// 可以通过环境变量 VITE_BASE_PATH 覆盖
function getBasePath() {
  // 优先使用环境变量
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH
  }
  
  // 在GitHub Actions中，使用GITHUB_REPOSITORY环境变量
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    return `/${repoName}/`
  }
  
  // 生产环境默认使用仓库名（需要在GitHub Pages设置中配置）
  // 开发环境使用根路径
  if (process.env.NODE_ENV === 'production') {
    return '/vocabulary-canvas/' // 默认仓库名，需要根据实际仓库名修改
  }
  
  return '/'
}

export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
})

