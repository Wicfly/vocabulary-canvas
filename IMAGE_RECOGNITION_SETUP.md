# 图像识别配置指南

## 功能说明

应用现在支持识别照片中的物品，并自动显示英文单词和定义。

## 配置方式

### 方式 1：使用 OpenAI Vision API（推荐）

这是最简单和准确的方式。

**步骤：**

1. 获取 OpenAI API Key
   - 访问 https://platform.openai.com/api-keys
   - 登录或注册账户
   - 创建新的 API Key

2. 在项目根目录的 `.env` 文件中添加：
   ```env
   VITE_OPENAI_API_KEY=sk-your-api-key-here
   ```

3. 重启开发服务器
   ```bash
   npm run dev
   ```

**优点：**
- ✅ 识别准确度高
- ✅ 支持多种物体识别
- ✅ 响应速度快

**费用：**
- 按使用量付费，约 $0.01 每张图片

---

### 方式 2：使用 Google Cloud Vision API

**步骤：**

1. 获取 Google Cloud Vision API Key
   - 访问 https://console.cloud.google.com/
   - 创建项目或选择现有项目
   - 启用 "Cloud Vision API"
   - 创建 API Key

2. 在 `.env` 文件中添加：
   ```env
   VITE_GOOGLE_VISION_API_KEY=your-api-key-here
   ```

3. 重启开发服务器

**优点：**
- ✅ 识别准确度高
- ✅ Google 的机器学习技术

**费用：**
- 每月前 1,000 次请求免费
- 之后按使用量付费

---

### 方式 3：无需配置（降级方案）

如果没有配置任何 API，应用会：
- ✅ 照片仍然可以添加到画布
- ✅ 显示默认名称 "Photo"
- ❌ 无法识别具体物品

## 使用流程

1. **拍照**
   - 点击搜索框旁边的圆形拍照按钮
   - 对准要识别的物品拍照

2. **自动识别**
   - 系统自动识别照片中的物品
   - 获取英文单词和定义

3. **查看结果**
   - 照片出现在画布上
   - 鼠标悬浮显示：
     - 英文单词（如 "apple", "book"）
     - 单词定义（如 "A round fruit with red or green skin")

## 示例

**拍照一个苹果：**
- 识别结果：`apple`
- 显示定义：`A round fruit with red or green skin`

**拍照一本书：**
- 识别结果：`book`
- 显示定义：`A written or printed work consisting of pages`

## 故障排除

### 识别失败

如果识别失败，可能的原因：

1. **API 未配置**
   - 检查 `.env` 文件中是否有 API Key
   - 查看浏览器控制台的错误信息

2. **API Key 无效**
   - 检查 API Key 是否正确
   - 确认 API Key 有足够的配额

3. **网络问题**
   - 检查网络连接
   - 确认可以访问 API 服务

### 识别不准确

- 确保照片清晰
- 确保物品在照片中明显可见
- 尝试从不同角度拍摄

## 当前配置状态

查看浏览器控制台（F12），拍照时会显示：
- ✅ 正在使用的识别 API
- ✅ 识别结果
- ❌ 任何错误信息

## 推荐配置

**最简单的方式：**
```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

只需一行配置即可开始使用！

## 相关文档

- `SAM3D_SETUP.md` - 3D 模型转换配置
- `故障排除.md` - 常见问题解决


