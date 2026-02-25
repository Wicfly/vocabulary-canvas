# Vocabulary Canvas

A minimal, aesthetic tool for visually learning vocabulary using AI-generated images.

## Features

- 🎨 **Visual Vocabulary Learning**: Learn words through AI-generated images
- 📝 **Smart Classification**: Automatically categorizes words as nouns (canvas) or non-nouns (gallery)
- 🖱️ **Interactive Canvas**: Drag and drop noun stickers on a beautiful dot-grid canvas
- 📚 **Book Gallery**: Browse non-noun words in an elegant book-style gallery with page-flip animations
- 💾 **Local Storage**: All your vocabulary is saved automatically in your browser
- 🎯 **Smart Image Search**: Automatically finds images from multiple sources (OpenAI DALL-E, Unsplash, or free image APIs)
- ⚡ **Fast Loading**: Images are automatically compressed to 200x200 for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional):
   ```env
   # Option 1: OpenAI DALL-E API (for AI-generated images)
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Option 2: Unsplash API (recommended for free image search)
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   
   # Option 3: Google Custom Search API (for image search)
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   VITE_GOOGLE_CX=your_custom_search_engine_id_here
   ```
   
   > **Note**: 
   > - **No API key needed!** The app works without any API keys using free image services
   > - If you have an OpenAI API key, it will be used first for AI-generated images
   > - If you have an Unsplash Access Key (free), it will search for relevant images
   > - If no API keys are available, the app automatically uses free image services (Picsum, Unsplash Source)
   > - All images are automatically compressed to 200x200 for fast loading
   > - To get a free Unsplash Access Key: https://unsplash.com/developers

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to GitHub Pages or any static hosting service.

## Project Structure

```
website/
├── src/
│   ├── components/
│   │   ├── WordInput.jsx          # Word input form
│   │   ├── NounCanvas.jsx         # Draggable canvas for nouns
│   │   ├── WordSticker.jsx        # Individual word sticker component
│   │   └── VocabularyGallery.jsx  # Book-style gallery for non-nouns
│   ├── utils/
│   │   ├── storage.js             # LocalStorage utilities
│   │   ├── wordClassifier.js      # Word classification logic
│   │   └── imageGenerator.js      # AI image generation service
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Usage

1. **Add a Word**: Type a vocabulary word in the input field and click "Add Word"
2. **View Nouns**: Nouns automatically appear on the canvas as draggable stickers
3. **View Other Words**: Non-noun words appear in the gallery with page navigation
4. **Interact**: 
   - Drag noun stickers around the canvas
   - Hover over stickers to see word definitions
   - Delete words using the delete button in tooltips
5. **Auto-Save**: All changes are automatically saved to your browser's local storage

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Framer Motion**: Smooth animations
- **React DnD**: Drag and drop functionality
- **OpenAI DALL-E API**: AI image generation (optional)
- **Unsplash API**: Free image search (recommended, optional)
- **Picsum Photos**: Free placeholder images (automatic fallback)
- **Google Custom Search API**: Image search (optional)

## Future Enhancements

- Flashcard mode
- AI-generated example sentences
- Word packs (TOEFL/IELTS themes)
- Export canvas as image or PDF
- Multi-language support
- Mobile version

## License

MIT

