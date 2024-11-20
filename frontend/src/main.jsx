import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Context from './Context/Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Context>
      <title>Web Shop</title>
      <App />
    </Context>
  </StrictMode>,
)
