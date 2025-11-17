# 🚀 Vercel 部署指南

## 问题诊断

如果 Vercel 部署后显示空白页面，通常是以下原因：

1. **Base Path 配置错误** - 已修复 ✅
2. **构建输出目录配置错误** - 已配置 ✅
3. **路由重写规则缺失** - 已添加 ✅

## ✅ 已完成的修复

1. **更新了 `vite.config.js`**
   - 自动检测 Vercel 环境
   - Vercel 部署时使用根路径 `/`
   - GitHub Pages 部署时使用仓库名路径

2. **创建了 `vercel.json`**
   - 配置了构建命令和输出目录
   - 添加了路由重写规则（SPA 必需）

## 📝 Vercel 部署步骤

### 方法 1：通过 Vercel 网站

1. 访问：https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择 `Wicfly/vocabulary-canvas` 仓库
5. **重要配置**：
   - Framework Preset: **Vite**
   - Root Directory: `./` (默认)
   - Build Command: `npm run build` (默认)
   - Output Directory: `dist` (默认)
   - Install Command: `npm install` (默认)
6. 点击 "Deploy"

### 方法 2：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录下部署
cd /Users/hope/Desktop/website
vercel

# 按照提示操作
# 首次部署选择：Set up and deploy
# 后续更新：vercel --prod
```

## 🔧 环境变量配置（可选）

如果需要配置环境变量（如 API keys）：

1. 在 Vercel 项目设置中
2. 进入 "Environment Variables"
3. 添加变量：
   - `VITE_BASE_PATH` = `/` (Vercel 使用根路径)
   - 其他 `VITE_*` 变量

## ✅ 验证部署

部署成功后：

1. **检查构建日志**
   - 确保构建成功
   - 没有错误信息

2. **检查网站**
   - 访问 Vercel 提供的 URL
   - 应该能看到完整的应用

3. **检查浏览器控制台**
   - 打开开发者工具（F12）
   - 查看是否有资源加载错误

## 🐛 常见问题

### 问题 1：仍然显示空白

**解决方案：**
- 检查浏览器控制台的错误信息
- 确保 `vercel.json` 文件已提交到仓库
- 重新部署项目

### 问题 2：资源 404 错误

**解决方案：**
- 确保 `vite.config.js` 中的 base 路径正确
- Vercel 应该使用 `/`
- 检查 `vercel.json` 中的 rewrites 规则

### 问题 3：样式丢失

**解决方案：**
- 确保 Tailwind CSS 配置正确
- 检查构建日志中是否有 CSS 构建错误

## 📝 更新代码

之后每次推送代码到 GitHub，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel 会自动检测并部署！

---

## 🎯 快速修复

如果之前部署失败，现在重新部署：

1. 在 Vercel 项目页面
2. 点击 "Redeploy" 或 "Deployments"
3. 选择最新的部署，点击 "Redeploy"

或者推送新代码触发自动部署。

