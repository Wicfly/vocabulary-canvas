// Internationalization translations

export const translations = {
  en: {
    // Word Input
    'wordInput.placeholder': 'Add a word...',
    'wordInput.add': 'Add',
    'wordInput.camera': 'Take Photo',
    'wordInput.error': 'Failed to add word. Please try again.',
    'wordInput.error.empty': 'Please enter a word',
    
    // Camera Modal
    'camera.cancel': 'Cancel',
    'camera.capture': 'Take Photo',
    'camera.retake': 'Retake',
    'camera.confirm': 'Confirm',
    'camera.error': 'Cannot access camera. Please ensure camera permissions are granted.',
    
    // Canvas
    'canvas.empty': 'Add nouns to see them here',
    'canvas.zoomIn': 'Zoom In',
    'canvas.zoomOut': 'Zoom Out',
    'canvas.reset': 'Reset View',
    
    // Categories
    'category.main': 'Main',
    'category.kitchen': 'Kitchen',
    'category.home': 'Home',
    
    // Sidebar
    'sidebar.canvas': 'Canvas',
    'sidebar.gallery': 'Gallery',
    'sidebar.signIn': 'Sign In',
    'sidebar.signOut': 'Sign Out',
    
    // Gallery
    'gallery.empty': 'Add non-noun words to see them here',
    'gallery.delete': 'Delete',
    
    // Word Sticker
    'wordSticker.delete': 'Delete',
  },
  zh: {
    // Word Input
    'wordInput.placeholder': '添加单词...',
    'wordInput.add': '添加',
    'wordInput.camera': '拍照',
    'wordInput.error': '添加单词失败，请重试。',
    'wordInput.error.empty': '请输入单词',
    
    // Camera Modal
    'camera.cancel': '取消',
    'camera.capture': '拍照',
    'camera.retake': '重拍',
    'camera.confirm': '确认',
    'camera.error': '无法访问摄像头。请确保已授予摄像头权限。',
    
    // Canvas
    'canvas.empty': '添加名词以查看它们',
    'canvas.zoomIn': '放大',
    'canvas.zoomOut': '缩小',
    'canvas.reset': '重置视图',
    
    // Categories
    'category.main': '主',
    'category.kitchen': '厨房',
    'category.home': '家',
    
    // Sidebar
    'sidebar.canvas': '画布',
    'sidebar.gallery': '图库',
    'sidebar.signIn': '登录',
    'sidebar.signOut': '登出',
    
    // Gallery
    'gallery.empty': '添加非名词单词以查看它们',
    'gallery.delete': '删除',
    
    // Word Sticker
    'wordSticker.delete': '删除',
  }
}

export const useTranslation = (language = 'en') => {
  const t = (key) => {
    return translations[language]?.[key] || key
  }
  return { t, language }
}

