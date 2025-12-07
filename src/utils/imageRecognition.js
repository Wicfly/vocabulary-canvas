// Image Recognition Service
// Recognizes objects in images and returns their English names

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY

/**
 * Recognize the main object in an image
 * @param {string} imageBase64 - Base64 encoded image data
 * @returns {Promise<string>} English name of the recognized object
 */
export const recognizeImage = async (imageBase64) => {
  // Remove data URL prefix if present
  const base64Data = imageBase64.includes(',') 
    ? imageBase64.split(',')[1] 
    : imageBase64

  // Try OpenAI Vision API first (if available)
  if (OPENAI_API_KEY) {
    try {
      return await recognizeWithOpenAI(base64Data)
    } catch (error) {
      console.warn('OpenAI Vision API failed, trying alternatives:', error)
    }
  }

  // Try Google Cloud Vision API (if available)
  if (GOOGLE_VISION_API_KEY) {
    try {
      return await recognizeWithGoogleVision(base64Data)
    } catch (error) {
      console.warn('Google Vision API failed:', error)
    }
  }

  // Fallback: Return null if no API is configured
  console.info('Image recognition API is not configured. Using default name. See IMAGE_RECOGNITION_SETUP.md')
  return null
}

/**
 * Recognize object using OpenAI Vision API
 */
async function recognizeWithOpenAI(base64Data) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // GPT-4o supports vision, or use 'gpt-4-turbo' if gpt-4o not available
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What is the main object in this image? Please respond with only the English word for the most prominent object, nothing else. If there are multiple objects, identify the most prominent one. Just return the word, no explanation, no punctuation.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`
              }
            }
          ]
        }
      ],
      max_tokens: 10
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const recognizedWord = data.choices[0]?.message?.content?.trim()
  
  if (!recognizedWord) {
    throw new Error('No word recognized from image')
  }

  // Clean up the response - remove punctuation and extra text
  const cleanWord = recognizedWord
    .replace(/[.,!?;:]/g, '') // Remove punctuation
    .split(/\s+/)[0] // Take first word only
    .toLowerCase()

  return cleanWord
}

/**
 * Recognize object using Google Cloud Vision API
 */
async function recognizeWithGoogleVision(base64Data) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Data
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 1
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 1
              }
            ]
          }
        ]
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Google Vision API error: ${response.status}`)
  }

  const data = await response.json()
  
  // Try to get object name from labels
  if (data.responses && data.responses[0]) {
    const response = data.responses[0]
    
    // First try object localization
    if (response.localizedObjectAnnotations && response.localizedObjectAnnotations.length > 0) {
      const object = response.localizedObjectAnnotations[0]
      return object.name.toLowerCase()
    }
    
    // Then try label detection
    if (response.labelAnnotations && response.labelAnnotations.length > 0) {
      const label = response.labelAnnotations[0]
      // Convert label description to a single word
      const words = label.description.toLowerCase().split(/\s+/)
      return words[0] // Return first word
    }
  }

  throw new Error('No object recognized from image')
}

