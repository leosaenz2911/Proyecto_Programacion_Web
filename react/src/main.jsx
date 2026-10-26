import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { OfertaProvider } from './context/ofertaContext';
import { CatalogoProvider } from './pages/catalogo/CatalogoContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <OfertaProvider>
          <CatalogoProvider>
            <App />
          </CatalogoProvider>
        </OfertaProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);
