// Text to Speech Service using OpenAI TTS API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

/**
 * Convert text to speech using OpenAI TTS API
 * @param {string} text - Text to convert to speech
 * @returns {Promise<string>} Blob URL of the audio file
 */
export const textToSpeech = async (text) => {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured for TTS')
    return null
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1', // or 'tts-1-hd' for higher quality
        input: text,
        voice: 'alloy', // Options: alloy, echo, fable, onyx, nova, shimmer
        speed: 1.0, // Speed from 0.25 to 4.0
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `TTS API error: ${response.status}`)
    }

    // Get audio blob
    const audioBlob = await response.blob()
    
    // Create a blob URL for playback
    const audioUrl = URL.createObjectURL(audioBlob)
    
    return audioUrl
  } catch (error) {
    console.error('Text to speech error:', error)
    throw error
  }
}

/**
 * Play audio from a blob URL
 * @param {string} audioUrl - Blob URL of the audio file
 */
export const playAudio = (audioUrl) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl)
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl) // Clean up blob URL after playback
      resolve()
    }
    
    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl) // Clean up on error
      reject(error)
    }
    
    audio.play().catch(reject)
  })
}

/**
 * Speak text using OpenAI TTS
 * @param {string} text - Text to speak
 */
export const speakText = async (text) => {
  try {
    const audioUrl = await textToSpeech(text)
    if (audioUrl) {
      await playAudio(audioUrl)
    }
  } catch (error) {
    console.error('Failed to speak text:', error)
    throw error
  }
}


