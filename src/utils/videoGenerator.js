// Video Generation Service using OpenAI API
// For adjectives and verbs, generate videos instead of images

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

/**
 * Generate a video for a word (adjective or verb) using OpenAI API
 * @param {string} word - The word to generate video for
 * @param {string} wordType - 'adjective' or 'verb'
 * @returns {Promise<string>} Video URL or blob URL
 */
export const generateVideo = async (word, wordType = 'verb') => {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured for video generation')
    return null
  }

  try {
    // Create a prompt based on word type
    let prompt = ''
    if (wordType === 'adjective') {
      prompt = `A short video showing something that is ${word}. Clear, simple, educational style.`
    } else {
      prompt = `A short video showing someone or something ${word}ing. Clear, simple, educational style.`
    }

    // Try OpenAI Sora API
    // Note: As of 2024, Sora API may not be publicly available yet
    // We'll try multiple possible endpoints
    
    const possibleEndpoints = [
      'https://api.openai.com/v1/video/generations',
      'https://api.openai.com/v1/videos/generations',
      'https://api.openai.com/v1/sora/generations'
    ]
    
    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sora-1.0', // Try different model names
            prompt: prompt,
            duration: 5,
            size: '1280x720',
          })
        })

        if (response.ok) {
          const data = await response.json()
          // Handle different response formats
          if (data.video_url) {
            return data.video_url
          } else if (data.url) {
            return data.url
          } else if (data.data && data.data[0] && data.data[0].url) {
            return data.data[0].url
          } else if (data.video) {
            // If base64 video data
            const blob = new Blob([data.video], { type: 'video/mp4' })
            return URL.createObjectURL(blob)
          } else if (data.file) {
            // If file object
            return data.file.url || data.file
          }
        } else if (response.status === 404 || response.status === 400) {
          // API endpoint doesn't exist, try next one
          continue
        }
      } catch (error) {
        // Try next endpoint
        continue
      }
    }
    
    // If all endpoints fail, use alternative method
    console.warn('OpenAI Sora API not available, using alternative method')
    return await generateVideoAlternative(word, wordType)
  } catch (error) {
    console.error('Video generation error:', error)
    throw error
  }
}

/**
 * Alternative video generation method
 * Since Sora might not be publicly available, we can:
 * 1. Use a placeholder video service
 * 2. Generate animated GIF from images
 * 3. Use a third-party video generation API
 */
async function generateVideoAlternative(word, wordType) {
  // Option 1: Use a video placeholder service
  // For now, we'll return null and the app will use the image as fallback
  // In production, you might want to:
  // - Use RunwayML API (https://runwayml.com)
  // - Use Pika Labs API
  // - Use Stability AI video generation
  // - Generate animated GIFs from multiple DALL-E images
  
  console.info(`Video generation for "${word}" - Sora API not yet publicly available. Using image as fallback.`)
  console.info('To enable video generation, you can:')
  console.info('1. Wait for OpenAI Sora API to become publicly available')
  console.info('2. Use a third-party video generation API (RunwayML, Pika, etc.)')
  console.info('3. Generate animated GIFs from multiple DALL-E images')
  
  // Return null to use image fallback
  return null
}

/**
 * Check if a word should have a video (adjectives and verbs)
 */
export const shouldGenerateVideo = (wordType) => {
  return wordType === 'non-noun' || wordType === 'verb' || wordType === 'adjective'
}

