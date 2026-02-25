// SAM 3D API Service
// This function calls the SAM 3D API to convert an image to a 3D model

const SAM3D_API_URL = import.meta.env.VITE_SAM3D_API_URL
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN
const HF_SAM3D_MODEL_ID = import.meta.env.VITE_HF_SAM3D_MODEL_ID || 'facebook/sam-3d'
const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN

/**
 * Convert an image to a 3D model using Meta's SAM 3D
 * @param {string} imageBase64 - Base64 encoded image data
 * @returns {Promise<Object>} 3D model data (GLB/GLTF format or similar)
 */
export const convertImageTo3D = async (imageBase64) => {
  // Remove data URL prefix if present
  const base64Data = imageBase64.includes(',') 
    ? imageBase64.split(',')[1] 
    : imageBase64

  // Try custom API first
  if (SAM3D_API_URL) {
    try {
      return await convertWithCustomAPI(base64Data)
    } catch (error) {
      console.warn('Custom SAM 3D API failed, trying alternatives:', error)
    }
  }

  // Try Hugging Face API
  if (HF_API_TOKEN) {
    try {
      return await convertWithHuggingFace(base64Data)
    } catch (error) {
      console.warn('Hugging Face API failed, trying alternatives:', error)
    }
  }

  // Try Replicate API
  if (REPLICATE_API_TOKEN) {
    try {
      return await convertWithReplicate(base64Data)
    } catch (error) {
      console.warn('Replicate API failed:', error)
    }
  }

  // If no API is configured, return null instead of throwing error
  // This allows the caller to use a fallback (use photo as regular image)
  console.info('SAM 3D API is not configured. Photo will be used as regular image. See SAM3D_SETUP.md for configuration.')
  return null
}

/**
 * Convert using custom backend API
 */
async function convertWithCustomAPI(base64Data) {
  const response = await fetch(SAM3D_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Data,
      format: 'glb',
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  
  return {
    modelUrl: data.modelUrl || data.url || data.model_url,
    modelData: data.modelData || data.data,
    metadata: data.metadata || {
      objectName: data.objectName || data.name || 'Object'
    }
  }
}

/**
 * Convert using Hugging Face Inference API
 */
async function convertWithHuggingFace(base64Data) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_SAM3D_MODEL_ID}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: base64Data
        }
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Hugging Face API error: ${response.status}`)
  }

  const data = await response.json()
  
  return {
    modelUrl: data.modelUrl || data.url,
    modelData: data.modelData || data.data,
    metadata: data.metadata || {
      objectName: data.objectName || 'Object'
    }
  }
}

/**
 * Convert using Replicate API
 */
async function convertWithReplicate(base64Data) {
  // Replicate API implementation
  // You'll need to adapt this based on Replicate's SAM 3D model API
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'your-model-version-id',
      input: {
        image: `data:image/jpeg;base64,${base64Data}`
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Replicate API error: ${response.status}`)
  }

  const data = await response.json()
  
  // Replicate returns a prediction that you need to poll
  // This is a simplified version - you may need to implement polling
  return {
    modelUrl: data.output?.modelUrl || data.output,
    metadata: {
      objectName: data.output?.objectName || 'Object'
    }
  }
}


