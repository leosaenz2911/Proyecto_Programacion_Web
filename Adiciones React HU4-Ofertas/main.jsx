import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { OfertaProvider } from './context/OfertaContext.jsx'
import OfertasPage from './pages/OfertasPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <OfertasPage />
  },
  {
    path: "/ofertas",
    element: <OfertasPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OfertaProvider>
      <RouterProvider router={router} />
    </OfertaProvider>
  </StrictMode>,
)
