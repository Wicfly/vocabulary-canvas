# 🔥 Firebase 登录配置指南

## 📋 概述

本项目已集成 Firebase Authentication，支持以下登录方式：
- 📧 邮箱/密码登录
- 🔵 Google 登录
- 🐙 GitHub 登录

用户数据存储在 Firebase Firestore 中，支持跨设备同步。

## 🚀 设置步骤

### 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 **"Add project"**（添加项目）
3. 输入项目名称（例如：`vocabulary-canvas`）
4. 选择是否启用 Google Analytics（可选）
5. 点击 **"Create project"**（创建项目）

### 2. 启用 Authentication

1. 在 Firebase Console 中，点击左侧菜单的 **Authentication**
2. 点击 **"Get started"**（开始使用）
3. 在 **Sign-in method**（登录方式）标签页中，启用以下登录方式：

#### 📧 邮箱/密码登录
- 点击 **Email/Password**
- 启用 **Email/Password** 和 **Email link (passwordless sign-in)**（可选）
- 点击 **Save**（保存）

#### 🔵 Google 登录
- 点击 **Google**
- 启用 Google 登录
- 输入项目支持邮箱（可选）
- 点击 **Save**（保存）

#### 🐙 GitHub 登录
- 点击 **GitHub**
- 启用 GitHub 登录
- 需要先创建 GitHub OAuth App：
  1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
  2. 点击 **"New OAuth App"**
  3. 填写应用信息：
     - **Application name**: Vocabulary Canvas
     - **Homepage URL**: `https://your-domain.com`
     - **Authorization callback URL**: `https://your-project-id.firebaseapp.com/__/auth/handler`
  4. 复制 **Client ID** 和 **Client secret**
  5. 在 Firebase Console 中填入这些信息
- 点击 **Save**（保存）

### 3. 创建 Firestore 数据库

1. 在 Firebase Console 中，点击左侧菜单的 **Firestore Database**
2. 点击 **"Create database"**（创建数据库）
3. 选择 **"Start in test mode"**（测试模式开始）
   - ⚠️ **注意**：测试模式允许所有读写，仅用于开发
   - 生产环境需要配置安全规则
4. 选择数据库位置（选择离您最近的区域）
5. 点击 **"Enable"**（启用）

### 4. 配置安全规则（可选，但推荐）

在 Firestore Database 的 **Rules**（规则）标签页中，添加以下规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

点击 **"Publish"**（发布）保存规则。

### 5. 获取 Firebase 配置信息

1. 在 Firebase Console 中，点击左侧菜单的 **Project settings**（项目设置）
2. 滚动到 **"Your apps"**（您的应用）部分
3. 点击 **Web** 图标（`</>`）
4. 输入应用昵称（例如：`vocabulary-canvas-web`）
5. 复制 Firebase 配置对象

### 6. 配置环境变量

在项目根目录的 `.env` 文件中添加 Firebase 配置：

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**示例：**
```env
VITE_FIREBASE_API_KEY=AIzaSyExample123456789
VITE_FIREBASE_AUTH_DOMAIN=vocabulary-canvas.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vocabulary-canvas
VITE_FIREBASE_STORAGE_BUCKET=vocabulary-canvas.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 7. 配置授权域名（用于 Google/GitHub 登录）

1. 在 Firebase Console 中，进入 **Authentication** > **Settings**（设置）
2. 滚动到 **Authorized domains**（授权域名）
3. 添加您的域名（例如：`localhost` 用于开发，`your-domain.com` 用于生产）

## ✅ 验证配置

1. 重启开发服务器：
   ```bash
   npm run dev
   ```

2. 打开应用，点击 **Sign In**（登录）按钮

3. 测试登录功能：
   - 尝试使用邮箱/密码注册新账户
   - 尝试使用 Google 登录
   - 尝试使用 GitHub 登录

## 🔒 安全注意事项

### 1. 环境变量保护

- ✅ `.env` 文件已在 `.gitignore` 中，不会被提交到 Git
- ✅ Firebase API Key 是公开的，但需要配置授权域名
- ✅ 使用 Firestore 安全规则保护数据

### 2. Firestore 安全规则

**开发环境（测试模式）：**
```javascript
allow read, write: if request.time < timestamp.date(2024, 12, 31);
```

**生产环境（推荐）：**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. 授权域名

确保只添加可信的域名到授权域名列表。

## 📊 数据存储结构

用户数据存储在 Firestore 的 `users` 集合中：

```
users/
  └── {userId}/
      ├── nounsByCategory: { main: [], kitchen: [], home: [] }
      ├── nonNouns: []
      ├── updatedAt: Timestamp
```

## 🐛 故障排除

### 问题：登录按钮点击无反应

**解决方案：**
- 检查浏览器控制台是否有错误
- 确认 Firebase 配置信息是否正确
- 确认授权域名是否已配置

### 问题：Google/GitHub 登录失败

**解决方案：**
- 确认在 Firebase Console 中已启用相应的登录方式
- 确认授权域名已添加
- 检查 GitHub OAuth App 配置是否正确

### 问题：数据未同步

**解决方案：**
- 确认用户已登录（检查 Sidebar 中的用户信息）
- 检查 Firestore 安全规则是否允许读写
- 查看浏览器控制台是否有错误信息

### 问题：Firestore 权限错误

**解决方案：**
- 检查 Firestore 安全规则
- 确认用户已通过认证（`request.auth != null`）
- 确认用户 ID 匹配（`request.auth.uid == userId`）

## 📚 相关文档

- [Firebase Authentication 文档](https://firebase.google.com/docs/auth)
- [Firestore 文档](https://firebase.google.com/docs/firestore)
- [Firebase 安全规则](https://firebase.google.com/docs/firestore/security/get-started)

## 🆘 需要帮助？

如有问题，请查看：
- Firebase Console 中的错误日志
- 浏览器开发者工具的控制台
- [Firebase 支持](https://firebase.google.com/support)

