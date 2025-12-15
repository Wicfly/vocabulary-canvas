// Category Classifier
// Classifies words into different canvas categories

const KITCHEN_ITEMS = [
  'knife', 'fork', 'spoon', 'plate', 'bowl', 'cup', 'glass', 'mug',
  'pot', 'pan', 'kettle', 'microwave', 'oven', 'refrigerator', 'fridge',
  'stove', 'sink', 'dish', 'cutting board', 'blender', 'toaster',
  'coffee', 'tea', 'milk', 'juice', 'water', 'bread', 'cheese',
  'apple', 'banana', 'orange', 'tomato', 'onion', 'garlic', 'carrot',
  'potato', 'rice', 'pasta', 'salt', 'pepper', 'sugar', 'flour',
  'egg', 'chicken', 'meat', 'fish', 'vegetable', 'fruit', 'food'
]

const HOME_ITEMS = [
  'phone', 'smartphone', 'laptop', 'computer', 'tablet', 'tv', 'television',
  'remote', 'charger', 'cable', 'headphone', 'speaker', 'camera',
  'bed', 'pillow', 'blanket', 'sheet', 'mattress',
  'sofa', 'couch', 'chair', 'table', 'desk', 'lamp', 'light',
  'window', 'door', 'wall', 'floor', 'ceiling', 'room',
  'bathroom', 'toilet', 'shower', 'bathtub', 'towel', 'soap',
  'mirror', 'shelf', 'cabinet', 'drawer', 'closet', 'wardrobe',
  'clock', 'calendar', 'picture', 'frame', 'plant', 'flower'
]

const MAIN_ITEMS = [
  // Default category for items that don't fit into specific categories
  'person', 'people', 'man', 'woman', 'child', 'baby',
  'dog', 'cat', 'bird', 'fish', 'animal',
  'car', 'bus', 'train', 'plane', 'bike', 'bicycle',
  'book', 'pen', 'pencil', 'paper', 'notebook',
  'bag', 'backpack', 'wallet', 'key', 'umbrella'
]

/**
 * Classify a word into a canvas category
 * @param {string} word - The word to classify
 * @returns {string} Category name: 'main', 'kitchen', 'home', etc.
 */
export const classifyCategory = (word) => {
  if (!word) return 'main'
  
  const lowerWord = word.toLowerCase().trim()
  
  // Check kitchen items
  for (const item of KITCHEN_ITEMS) {
    if (lowerWord === item || lowerWord.includes(item) || item.includes(lowerWord)) {
      return 'kitchen'
    }
  }
  
  // Check home items
  for (const item of HOME_ITEMS) {
    if (lowerWord === item || lowerWord.includes(item) || item.includes(lowerWord)) {
      return 'home'
    }
  }
  
  // Default to main
  return 'main'
}

/**
 * Get all available categories
 * @param {string} language - Language code ('en' or 'zh')
 */
export const getCategories = (language = 'en') => {
  const translations = {
    en: {
      main: 'Main',
      kitchen: 'Kitchen',
      home: 'Home'
    },
    zh: {
      main: '主',
      kitchen: '厨房',
      home: '家'
    }
  }
  
  const names = translations[language] || translations.en
  
  return [
    { id: 'main', name: names.main, icon: '📋' },
    { id: 'kitchen', name: names.kitchen, icon: '🍳' },
    { id: 'home', name: names.home, icon: '🏠' }
  ]
}



