import { createRoot } from 'react-dom/client'
import './shadcn.css'
import App from './App'

// Ensure the app element exists
const appElement = document.getElementById('app')
if (!appElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(appElement)
root.render(<App />)

// Hot Module Replacement for development
if (import.meta.hot) {
  import.meta.hot.accept()
}
