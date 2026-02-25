# API 配置说明

## 图片生成选项

应用支持三种图片获取方式，按优先级排序：

### 1. OpenAI DALL-E API（推荐 - AI 生成图片）

**优点**：生成高质量、定制化的图片，完全符合词汇含义

**配置步骤**：
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key
3. 在 `.env` 文件中添加：
   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```

**费用**：按使用量付费，约 $0.04 每张图片

---

### 2. Google Custom Search API（搜索现有图片）

**优点**：使用真实图片，可能更准确

**配置步骤**：
1. **获取 Google API Key**：
   - 访问 https://console.cloud.google.com/
   - 创建项目或选择现有项目
   - 启用 "Custom Search API"
   - 创建 API Key

2. **创建 Custom Search Engine**：
   - 访问 https://programmablesearchengine.google.com/
   - 点击 "Add" 创建新的搜索引擎
   - 在 "Sites to search" 中输入：`*`（搜索整个网络）
   - 保存后获取 **Search Engine ID (CX)**

3. 在 `.env` 文件中添加：
   ```env
   VITE_GOOGLE_API_KEY=AIzaSy...
   VITE_GOOGLE_CX=your_custom_search_engine_id
   ```

**费用**：每天前 100 次搜索免费，之后按使用量付费

---

### 3. Unsplash Placeholder（无需配置）

**优点**：完全免费，无需 API Key

**说明**：如果前两种方式都不可用，应用会自动使用 Unsplash 的占位图片服务

---

## 当前配置

根据您提供的 API Key，当前配置为：

```env
VITE_GOOGLE_API_KEY=AIzaSyD4DIZZFbB3Yg9GR5UcmkPux46t58x0PWU
```

**重要提示**：
- 您的 API Key 已配置 ✅
- 但 Google Custom Search API **还需要 Custom Search Engine ID (CX)** 才能工作
- 如果没有 CX，应用会自动使用 Unsplash 占位图片

**下一步**：
1. 访问 https://programmablesearchengine.google.com/
2. 创建 Custom Search Engine
3. 获取 CX ID
4. 在 `.env` 文件中添加：`VITE_GOOGLE_CX=your_cx_id`

或者，如果您想使用 OpenAI DALL-E，可以添加：
```env
VITE_OPENAI_API_KEY=sk-...
```

---

## 测试配置

启动应用后，在浏览器控制台查看日志：
- 如果看到 "Google API key found but Custom Search Engine ID (CX) is missing"，说明需要添加 CX
- 如果看到 "No OpenAI API key found"，说明正在使用占位图片
- 如果图片正常显示，说明配置成功！

