import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.jsx'
import NavBar from './components/ui/navBar.jsx'
import Footer from './components/ui/footer.jsx'
import "./i18n";



createRoot(document.getElementById('root')).render(
    
    <App />
    
)
