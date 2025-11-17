// Simple noun detection using common patterns
// For MVP, we'll use a basic heuristic approach
// In production, you might want to use a proper NLP library or API

const COMMON_NOUN_SUFFIXES = ['tion', 'sion', 'ness', 'ment', 'ity', 'er', 'or', 'ist', 'ism']
const COMMON_NOUN_PATTERNS = [
  'chair', 'table', 'book', 'car', 'house', 'dog', 'cat', 'tree', 'flower',
  'apple', 'water', 'fire', 'earth', 'sun', 'moon', 'star', 'cloud', 'rain',
  'person', 'friend', 'teacher', 'student', 'doctor', 'nurse', 'artist',
  'computer', 'phone', 'laptop', 'keyboard', 'mouse', 'screen', 'window',
  'door', 'wall', 'floor', 'ceiling', 'room', 'kitchen', 'bathroom',
  'bird', 'fish', 'horse', 'cow', 'sheep', 'pig', 'chicken',
  'city', 'country', 'mountain', 'river', 'ocean', 'lake', 'forest',
  'food', 'bread', 'milk', 'cheese', 'meat', 'fruit', 'vegetable',
  'clothes', 'shirt', 'pants', 'shoes', 'hat', 'jacket', 'dress'
]

const COMMON_VERBS = [
  'run', 'walk', 'jump', 'sit', 'stand', 'eat', 'drink', 'sleep', 'wake',
  'think', 'know', 'understand', 'learn', 'teach', 'read', 'write', 'speak',
  'listen', 'hear', 'see', 'watch', 'look', 'feel', 'touch', 'smell', 'taste',
  'go', 'come', 'leave', 'arrive', 'start', 'stop', 'begin', 'end', 'finish',
  'work', 'play', 'study', 'help', 'need', 'want', 'like', 'love', 'hate',
  'make', 'do', 'get', 'give', 'take', 'put', 'bring', 'send', 'receive',
  'open', 'close', 'turn', 'move', 'push', 'pull', 'lift', 'carry', 'hold'
]

const COMMON_ADJECTIVES = [
  'good', 'bad', 'big', 'small', 'large', 'little', 'long', 'short', 'tall',
  'wide', 'narrow', 'thick', 'thin', 'heavy', 'light', 'fast', 'slow', 'quick',
  'hot', 'cold', 'warm', 'cool', 'new', 'old', 'young', 'fresh', 'stale',
  'clean', 'dirty', 'beautiful', 'ugly', 'pretty', 'handsome', 'nice', 'mean',
  'happy', 'sad', 'angry', 'excited', 'calm', 'nervous', 'afraid', 'brave',
  'smart', 'stupid', 'clever', 'wise', 'foolish', 'kind', 'cruel', 'gentle',
  'strong', 'weak', 'hard', 'soft', 'smooth', 'rough', 'sharp', 'dull',
  'bright', 'dark', 'light', 'heavy', 'loud', 'quiet', 'noisy', 'silent'
]

// Use dictionary API to get accurate part of speech
export const classifyWord = async (word) => {
  const lowerWord = word.toLowerCase().trim()
  
  // First check our known lists (fast)
  if (COMMON_VERBS.includes(lowerWord)) {
    return 'non-noun'
  }
  
  if (COMMON_ADJECTIVES.includes(lowerWord)) {
    return 'non-noun'
  }
  
  if (COMMON_NOUN_PATTERNS.includes(lowerWord)) {
    return 'noun'
  }
  
  // Try to get accurate classification from dictionary API
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${lowerWord}`)
    if (response.ok) {
      const data = await response.json()
      if (data && data[0] && data[0].meanings) {
        // Check all meanings to find if any is a noun
        for (const meaning of data[0].meanings) {
          if (meaning.partOfSpeech === 'noun') {
            return 'noun'
          }
        }
        // If no noun found, it's non-noun
        return 'non-noun'
      }
    }
  } catch (error) {
    console.warn('Dictionary API error, using heuristics:', error)
  }
  
  // Fallback to heuristics
  // Check for common noun suffixes
  for (const suffix of COMMON_NOUN_SUFFIXES) {
    if (lowerWord.endsWith(suffix)) {
      return 'noun'
    }
  }
  
  // If word ends with 'ing', 'ed', 'ly', it's likely not a noun
  if (lowerWord.endsWith('ing') || lowerWord.endsWith('ed') || lowerWord.endsWith('ly')) {
    return 'non-noun'
  }
  
  // Default: assume noun (most common case for vocabulary learning)
  return 'noun'
}

