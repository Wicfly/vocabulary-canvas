// Text to Speech Service using OpenAI TTS API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

/**
 * Convert text to speech using OpenAI TTS API
 * @param {string} text - Text to convert to speech
 * @returns {Promise<string>} Blob URL of the audio file
 */
export const textToSpeech = async (text) => {
  if (!OPENAI_API_KEY) {
    const errorMsg = 'OpenAI API key not configured for TTS. Please check your .env file.'
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  try {
    console.log('Sending TTS request for:', text)
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
      const errorMsg = errorData.error?.message || `TTS API error: ${response.status} ${response.statusText}`
      console.error('TTS API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorMsg)
    }

    // Get audio blob
    const audioBlob = await response.blob()
    console.log('Audio blob received, size:', audioBlob.size)
    
    // Create a blob URL for playback
    const audioUrl = URL.createObjectURL(audioBlob)
    console.log('Audio URL created:', audioUrl)
    
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
    
    audio.onloadeddata = () => {
      console.log('Audio loaded successfully')
    }
    
    audio.oncanplay = () => {
      console.log('Audio can play')
    }
    
    audio.onended = () => {
      console.log('Audio playback ended')
      URL.revokeObjectURL(audioUrl) // Clean up blob URL after playback
      resolve()
    }
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error)
      console.error('Audio error details:', {
        code: audio.error?.code,
        message: audio.error?.message
      })
      URL.revokeObjectURL(audioUrl) // Clean up on error
      reject(new Error(`Audio playback failed: ${audio.error?.message || 'Unknown error'}`))
    }
    
    audio.play().then(() => {
      console.log('Audio playback started')
    }).catch(error => {
      console.error('Failed to start audio playback:', error)
      URL.revokeObjectURL(audioUrl)
      reject(error)
    })
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



