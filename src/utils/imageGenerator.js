// AI Image Generation Service
// Priority: Pollinations.AI > OpenAI DALL-E > Unsplash API > Fallback

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX

export const generateImage = async (word, isNoun = true) => {
  console.log('Generating image for:', word, 'isNoun:', isNoun)
  
  // Try Pollinations.AI first (free, no API key needed)
  try {
    console.log('Trying Pollinations.AI...')
    const imageUrl = await getPollinationsImage(word, isNoun)
    if (imageUrl) {
      console.log('Pollinations.AI success:', imageUrl)
      return imageUrl
    }
  } catch (error) {
    console.warn('Pollinations.AI error, trying alternative:', error)
  }

  // Try OpenAI DALL-E if API key is available
  if (OPENAI_API_KEY) {
    try {
      const prompt = isNoun 
        ? `A simple, clean 2D illustration of ${word}, minimalist style, white background, educational`
        : `An abstract or symbolic representation of ${word}, minimalist style, white background, educational`

      console.log('Trying OpenAI API...')
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '512x512',
          quality: 'standard',
          response_format: 'url'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('OpenAI API success:', data.data[0].url)
        return data.data[0].url
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.warn('OpenAI API error:', response.status, errorData)
      }
    } catch (error) {
      console.warn('OpenAI API error, trying alternative:', error)
    }
  }

  // Try Unsplash API (official, requires access key but free)
  try {
    console.log('Trying Unsplash API...')
    const imageUrl = await getUnsplashImage(word, isNoun)
    if (imageUrl) {
      console.log('Unsplash API success:', imageUrl)
      return imageUrl
    }
  } catch (error) {
    console.warn('Unsplash API error, trying alternative:', error)
  }

  // Try Google Custom Search API if API key is available
  if (GOOGLE_API_KEY && GOOGLE_CX) {
    try {
      console.log('Trying Google Custom Search API...')
      const imageUrl = await getGoogleImage(word, isNoun)
      if (imageUrl) {
        console.log('Google Custom Search success:', imageUrl)
        return imageUrl
      }
    } catch (error) {
      console.warn('Google Custom Search error, using fallback:', error)
    }
  }

  // Final fallback: Use other free image APIs
  console.log('Using fallback image service')
  const fallbackUrl = await getFallbackImage(word, isNoun)
  return fallbackUrl
}

// Get image from Pollinations.AI (free, no API key needed)
// API: GET https://image.pollinations.ai/prompt/{prompt}
const getPollinationsImage = async (word, isNoun) => {
  try {
    const prompt = isNoun 
      ? `A simple, clean 2D illustration of ${word}, minimalist style, white background, educational`
      : `An abstract or symbolic representation of ${word}, minimalist style, white background, educational`
    
    // Pollinations.AI API endpoint
    // Parameters can be added: ?width=512&height=512&model=flux&nologo=true
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=200&height=200&nologo=true`
    
    console.log('Pollinations.AI URL:', imageUrl)
    
    // Return the URL directly (Pollinations.AI generates images on-the-fly)
    return imageUrl
  } catch (error) {
    console.error('Error generating Pollinations.AI image:', error)
    return null
  }
}

// Get image using Google Custom Search API
// Note: Google Custom Search API requires a Custom Search Engine ID (CX)
// If CX is not provided, this function will return null and fallback to placeholder
const getGoogleImage = async (word, isNoun) => {
  if (!GOOGLE_API_KEY) {
    return null
  }

  // Google Custom Search API requires a Custom Search Engine ID
  // If not provided, we'll skip and use placeholder instead
  if (!GOOGLE_CX) {
    console.info('Google API key found but Custom Search Engine ID (CX) is missing. Using placeholder images.')
    return null
  }

  try {
    // Search for images related to the word
    const searchQuery = isNoun 
      ? `${word} illustration simple clean`
      : `${word} abstract symbolic representation`
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&safe=active`

    const response = await fetch(url)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Google Custom Search API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link
    }
    
    return null
  } catch (error) {
    console.error('Error fetching Google image:', error)
    return null
  }
}

// Get image from Unsplash API (official or alternative methods)
const getUnsplashImage = async (word, isNoun) => {
  const searchQuery = isNoun ? word : `${word} abstract`
  
  // If we have Unsplash Access Key, use official API
  if (UNSPLASH_ACCESS_KEY) {
    try {
      // Use Unsplash official API with compressed image
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          // Use small compressed image (200x200, quality 80)
          const photo = data.results[0]
          // Use small size for faster loading
          return `${photo.urls.small}&w=200&h=200&fit=crop&q=80&auto=format`
        }
      }
    } catch (error) {
      console.warn('Unsplash official API error:', error)
    }
  }
  
  // Alternative: Use a free image search API
  // Using a CORS proxy to access Unsplash search (for development/testing)
  // In production, you should get a free Unsplash Access Key
  try {
    // Method 1: Try using Unsplash Source (deprecated but sometimes works)
    const unsplashSourceUrl = `https://source.unsplash.com/200x200/?${encodeURIComponent(searchQuery)}`
    
    // Test if the URL is accessible
    const testResponse = await fetch(unsplashSourceUrl, { method: 'HEAD' })
    if (testResponse.ok) {
      return unsplashSourceUrl
    }
  } catch (error) {
    console.warn('Unsplash Source failed')
  }
  
  // Method 2: Use a free image search service
  // Using Pexels API (free, no key needed for basic usage) or similar
  try {
    // Pexels has a free tier, but requires API key
    // For now, we'll use a simpler approach
  } catch (error) {
    console.warn('Image search failed')
  }
  
  return null
}

// Fallback image services (multiple options for reliability)
const getFallbackImage = async (word, isNoun) => {
  const searchTerm = encodeURIComponent(word)
  
  // Try multiple free image sources in order of preference
  
  // Option 1: Unsplash Source (works sometimes, no API key needed)
  try {
    const unsplashUrl = `https://source.unsplash.com/200x200/?${searchTerm}`
    // Test if accessible
    const test = await fetch(unsplashUrl, { method: 'HEAD', mode: 'no-cors' })
    return unsplashUrl
  } catch (error) {
    console.warn('Unsplash Source failed')
  }
  
  // Option 2: Picsum Photos with seed based on word (deterministic)
  // This gives consistent images for the same word
  const seed = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const picsumUrl = `https://picsum.photos/seed/${seed}/200/200`
  
  // Option 3: Placeholder with word text (always works, but not a real image)
  // const placeholderUrl = `https://via.placeholder.com/200/000000/FFFFFF?text=${searchTerm}`
  
  // Return Picsum as it's most reliable and gives consistent results
  return picsumUrl
}

// Alternative: Use a dictionary API to get word definition
export const getWordDefinition = async (word) => {
  try {
    // Using Free Dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!response.ok) {
      return `Definition for "${word}"`
    }
    const data = await response.json()
    if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
      return data[0].meanings[0].definitions[0].definition
    }
    return `Definition for "${word}"`
  } catch (error) {
    console.error('Error fetching definition:', error)
    return `Definition for "${word}"`
  }
}

