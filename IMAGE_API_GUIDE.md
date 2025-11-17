# 图片API配置指南

## 图片获取优先级

应用会按以下顺序尝试获取图片：

1. **OpenAI DALL-E** (如果配置了 API Key)
   - AI生成的高质量图片
   - 需要付费API

2. **Unsplash 官方API** (如果配置了 Access Key)
   - 免费，高质量图片
   - 推荐使用！
   - 获取方式：https://unsplash.com/developers

3. **Unsplash Source** (无需API Key)
   - 免费但不太稳定
   - 自动尝试

4. **Picsum Photos** (完全免费，无需API Key)
   - 随机图片，但稳定可靠
   - 自动压缩到200x200

## 无需API Key即可使用

**好消息！** 即使不配置任何API Key，应用也能正常工作：
- 自动使用 Picsum Photos 提供图片
- 图片自动压缩到 200x200 像素
- 加载速度快，完全免费

## 推荐配置：Unsplash Access Key

为了获得更好的图片质量（与单词相关），建议获取免费的 Unsplash Access Key：

### 步骤：

1. 访问 https://unsplash.com/developers
2. 注册/登录账户
3. 点击 "New Application"
4. 填写应用信息（可以随便填）
5. 获取 Access Key
6. 在 `.env` 文件中添加：
   ```env
   VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

### 优势：

- ✅ 完全免费
- ✅ 图片与搜索词相关
- ✅ 高质量图片
- ✅ 自动压缩，加载快速

## 图片压缩说明

所有图片都会自动：
- 压缩到 **200x200** 像素
- 质量设置为 **80%**
- 自动裁剪适配
- 使用 WebP 格式（如果支持）

这确保了：
- ⚡ 快速加载
- 💾 节省带宽
- 📱 移动端友好

## 当前配置状态

查看浏览器控制台（F12），添加单词时会显示：
- 正在尝试哪个API
- 是否成功获取图片
- 使用的图片URL

如果看到 "Using fallback image service"，说明正在使用免费的 Picsum Photos。

