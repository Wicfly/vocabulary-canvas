# 🔐 API Key 配置说明

## ⚠️ 重要安全提示

**您的 API Key 是敏感信息，请勿分享给他人！**

## 📝 配置步骤

### 1. 创建 `.env` 文件

在项目根目录创建 `.env` 文件：

```bash
# 在项目根目录执行
touch .env
```

### 2. 添加您的 API Key

在 `.env` 文件中添加：

```env
VITE_OPENAI_API_KEY=your-api-key-here
```

**注意：**
- 将 `your-api-key-here` 替换为您的实际 API Key
- 不要将 `.env` 文件提交到 Git（已在 `.gitignore` 中配置）

### 3. 重启开发服务器

配置完成后，重启开发服务器：

```bash
npm run dev
```

## ✅ 安全检查

### 已配置的保护措施

1. **`.gitignore` 已配置**
   - `.env` 文件已被忽略
   - `.env.*` 文件已被忽略
   - 不会意外提交到 Git

2. **代码检查**
   - 已确认没有敏感文件被提交到仓库
   - API Key 只存在于本地 `.env` 文件

## 🔒 额外安全建议

### 1. 将仓库设为私有（推荐）

如果仓库包含敏感信息或您不希望公开代码：

1. 访问 GitHub 仓库页面
2. 点击 **Settings**（设置）
3. 滚动到 **Danger Zone**（危险区域）
4. 点击 **Change visibility**（更改可见性）
5. 选择 **Make private**（设为私有）

### 2. 使用 GitHub Secrets（用于 CI/CD）

如果使用 GitHub Actions 或其他 CI/CD：

1. 在仓库设置中添加 Secrets
2. 使用 `${{ secrets.OPENAI_API_KEY }}` 引用

### 3. 定期轮换 API Key

- 定期检查 API 使用情况
- 如果怀疑泄露，立即轮换 API Key
- 在 OpenAI 控制台撤销旧 Key

## 📚 相关文件

- `.env` - 本地环境变量（不提交到 Git）
- `.env.example` - 示例文件（可选，可以提交）
- `.gitignore` - Git 忽略规则

## 🆘 如果 API Key 泄露

如果您的 API Key 意外泄露：

1. **立即撤销**
   - 登录 OpenAI 控制台
   - 删除或撤销泄露的 API Key

2. **创建新 Key**
   - 生成新的 API Key
   - 更新本地 `.env` 文件

3. **检查使用情况**
   - 查看 API 使用日志
   - 确认是否有异常使用

## 📞 需要帮助？

如有问题，请查看：
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Vite 环境变量文档](https://vitejs.dev/guide/env-and-mode.html)

