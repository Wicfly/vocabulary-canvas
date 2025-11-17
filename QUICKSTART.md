# 快速启动指南

## 安装和运行

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量（可选）**
   
   创建 `.env` 文件（可选，如果不配置将使用占位图片）：
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   > 获取 OpenAI API Key: https://platform.openai.com/api-keys
   > 
   > 如果没有 API Key，应用会自动使用 Unsplash 的占位图片

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   
   访问 `http://localhost:5173`

## 使用说明

1. **添加词汇**
   - 在输入框中输入一个英文单词
   - 点击 "Add Word" 按钮
   - 系统会自动：
     - 判断单词是名词还是其他词性
     - 生成对应的图片
     - 获取单词定义

2. **名词画布**
   - 名词会自动出现在左侧的画布上
   - 可以拖拽移动名词贴纸
   - 鼠标悬停查看单词和定义
   - 点击删除按钮移除单词

3. **词汇画廊**
   - 非名词单词会出现在右侧的书本式画廊中
   - 使用左右箭头翻页
   - 每页显示最多3个单词

4. **自动保存**
   - 所有数据自动保存到浏览器本地存储
   - 刷新页面后数据不会丢失

## 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist` 目录，可以部署到任何静态托管服务。

## 部署到 GitHub Pages

1. 构建项目：`npm run build`
2. 将 `dist` 目录的内容推送到 GitHub
3. 在 GitHub 仓库设置中启用 GitHub Pages
4. 选择 `dist` 目录作为源

## 故障排除

- **图片不显示**：检查网络连接，或配置 OpenAI API Key
- **拖拽不工作**：确保使用现代浏览器（Chrome、Firefox、Safari、Edge）
- **数据丢失**：检查浏览器是否允许本地存储

