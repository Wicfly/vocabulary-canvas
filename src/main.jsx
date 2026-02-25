import React from 'react'
import ReactDOM from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
)

