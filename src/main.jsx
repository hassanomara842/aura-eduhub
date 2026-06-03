import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { initTelemetry } from './utils/telemetry';
import App from './App.jsx'

initTelemetry();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
