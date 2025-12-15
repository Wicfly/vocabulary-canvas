# SAM 3D 配置指南

## 功能说明

本应用现在支持通过拍照将现实世界中的物体转换为 3D 模型并显示在画布上。该功能使用了 Meta 的 SAM 3D 技术。

## 设置步骤

### 1. 配置 SAM 3D API 端点

SAM 3D 模型通常需要在后端服务器上运行。您有以下几种选择：

#### 选项 A：使用您自己的后端服务

1. 设置一个运行 SAM 3D 模型的后端服务
2. 在项目根目录创建 `.env` 文件（如果还没有）
3. 添加以下配置：

```env
VITE_SAM3D_API_URL=https://your-backend-url.com/api/sam3d
```

#### 选项 B：使用 Hugging Face Inference API

1. 获取 Hugging Face API Token: https://huggingface.co/settings/tokens
2. 在 `.env` 文件中添加：

```env
VITE_HF_API_TOKEN=your_huggingface_token_here
VITE_HF_SAM3D_MODEL_ID=facebook/sam-3d
```

#### 选项 C：使用 Replicate API

1. 获取 Replicate API Token: https://replicate.com/account/api-tokens
2. 在 `.env` 文件中添加：

```env
VITE_REPLICATE_API_TOKEN=your_replicate_token_here
```

### 2. API 响应格式

您的 SAM 3D API 应该返回以下格式的 JSON 响应：

```json
{
  "modelUrl": "https://example.com/models/model.glb",
  "metadata": {
    "objectName": "apple",
    "name": "apple"
  }
}
```

或者返回 base64 编码的 3D 模型数据：

```json
{
  "modelData": "base64_encoded_model_data",
  "metadata": {
    "objectName": "apple"
  }
}
```

### 3. 支持的 3D 模型格式

- GLB (推荐，二进制格式，文件小)
- GLTF (JSON 格式)

### 4. 修改 API 调用逻辑

如果需要修改 API 调用逻辑，请编辑 `src/utils/sam3d.js` 文件。

## 使用说明

1. 点击搜索框旁边的圆形拍照按钮（黑色背景，白色相机图标）
2. 授予浏览器摄像头权限
3. 对准要拍摄的物体并拍照
4. 确认照片后，系统会：
   - 调用 SAM 3D API 将图像转换为 3D 模型
   - 识别物体名称
   - 获取单词定义
   - 在画布上显示 3D 模型

5. 鼠标悬浮在 3D 模型上可以查看物体名称和定义
6. 可以拖拽 3D 模型在画布上移动
7. 可以点击 3D 模型进行旋转查看

## 故障排除

### 摄像头无法访问
- 确保已授予浏览器摄像头权限
- 检查浏览器是否支持 `getUserMedia` API
- 尝试使用 HTTPS 连接（某些浏览器要求）

### 3D 模型加载失败
- 检查浏览器控制台的错误信息
- 确认 SAM 3D API 端点配置正确
- 检查网络连接
- 验证 API 返回的模型格式是否支持

### 模型不显示
- 检查模型 URL 是否可访问
- 确认模型格式为 GLB 或 GLTF
- 查看浏览器控制台是否有 Three.js 相关错误

## 技术栈

- **Three.js**: 3D 渲染引擎
- **@react-three/fiber**: React 的 Three.js 渲染器
- **@react-three/drei**: Three.js 的辅助工具库
- **Meta SAM 3D**: 图像到 3D 模型转换技术

## 开发说明

### 本地测试

如果没有配置 SAM 3D API，拍照功能仍然可以工作，但无法生成 3D 模型。您可以：

1. 使用模拟数据测试 UI
2. 设置本地后端服务运行 SAM 3D 模型
3. 使用 Hugging Face 或 Replicate 等云服务

### 性能优化

- 3D 模型文件应该尽量小（建议 < 5MB）
- 使用 GLB 格式而非 GLTF 可以减小文件大小
- 考虑使用模型压缩工具

## 参考资料

- [Meta SAM 3D GitHub](https://github.com/facebookresearch/sam-3d-objects)
- [Three.js 文档](https://threejs.org/docs/)
- [React Three Fiber 文档](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)



