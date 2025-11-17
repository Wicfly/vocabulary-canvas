# GitHub Pages 部署指南

## 方法一：使用 GitHub Actions（推荐）

这是最简单的方法，每次推送到 main 分支都会自动部署。

### 步骤 1: 初始化 Git 仓库

```bash
# 在项目目录下执行
git init
git add .
git commit -m "Initial commit"
```

### 步骤 2: 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 仓库名称填写：`vocabulary-canvas`（或你喜欢的名字）
3. 选择 **Public**（GitHub Pages 免费版需要公开仓库）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

### 步骤 3: 连接本地仓库到 GitHub

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
# 替换 vocabulary-canvas 为你的仓库名（如果不同）

git remote add origin https://github.com/YOUR_USERNAME/vocabulary-canvas.git
git branch -M main
git push -u origin main
```

### 步骤 4: 启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 "Source" 部分：
   - 选择 **GitHub Actions**
5. 保存设置

### 步骤 5: 更新仓库名称（如果需要）

如果仓库名不是 `vocabulary-canvas`，需要更新 `vite.config.js`：

```javascript
// 在 vite.config.js 中，将 'vocabulary-canvas' 改为你的仓库名
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'your-repo-name'
```

### 步骤 6: 推送代码触发部署

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push
```

### 步骤 7: 查看部署状态

1. 在 GitHub 仓库页面，点击 **Actions** 标签
2. 查看部署工作流的状态
3. 部署完成后，访问：`https://YOUR_USERNAME.github.io/vocabulary-canvas/`

---

## 方法二：使用 gh-pages 包（手动部署）

如果你更喜欢手动控制部署时机：

### 安装 gh-pages

```bash
npm install --save-dev gh-pages
```

### 部署

```bash
npm run deploy
```

首次部署需要配置：

```bash
# 在 package.json 中添加（如果还没有）
"homepage": "https://YOUR_USERNAME.github.io/vocabulary-canvas"
```

---

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件：
   ```
   yourdomain.com
   ```

2. 在 GitHub Pages 设置中启用自定义域名

3. 更新 `vite.config.js`：
   ```javascript
   base: '/'
   ```

---

## 常见问题

### 1. 页面显示 404

- 检查 `vite.config.js` 中的 `base` 路径是否正确
- 确保仓库名和 base 路径匹配

### 2. 资源加载失败

- 检查所有资源路径是否使用相对路径
- 确保 `base` 配置正确

### 3. 部署后样式丢失

- 运行 `npm run build` 确保构建成功
- 检查 `dist` 目录中的文件

### 4. 环境变量不工作

GitHub Pages 是静态托管，不支持服务端环境变量。如果需要使用环境变量：
- 使用 Vite 的环境变量前缀 `VITE_`
- 在构建时注入，而不是运行时

---

## 部署后的 URL

部署成功后，你的网站地址将是：
- `https://YOUR_USERNAME.github.io/vocabulary-canvas/`

记得将 `YOUR_USERNAME` 和 `vocabulary-canvas` 替换为你的实际值。

