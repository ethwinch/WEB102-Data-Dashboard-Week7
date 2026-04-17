import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Header from './routes/Header'
import Details from './routes/Details'
import NotFound from './routes/NotFound'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<App />}/>
            <Route path="city/:cityName" element={<Details />}/>
          </Route>
          <Route path="*" element={<NotFound />}/>
      </Routes>
  </BrowserRouter>
)
