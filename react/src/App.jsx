import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { GuestOnly, RequireRole } from './routes/ProtectedRoute';
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import AccountPage from './pages/auth/AccountPage';
import ForbiddenPage from './pages/auth/ForbiddenPage';
import NotFoundPage from './pages/auth/NotFoundPage';
import CatalogPlaceholder from './pages/auth/CatalogPlaceholder';
import AdminPlaceholder from './pages/auth/AdminPlaceholder';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalogo" element={<CatalogPlaceholder />} />

          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/registro" element={<GuestOnly><RegisterPage /></GuestOnly>} />
          <Route path="/recuperar" element={<GuestOnly><RecoverPasswordPage /></GuestOnly>} />

          <Route path="/mi-cuenta" element={<RequireRole roles={['USUARIO', 'ADMINISTRADOR']}><AccountPage /></RequireRole>} />
          <Route path="/admin" element={<RequireRole roles={['ADMINISTRADOR']}><AdminPlaceholder /></RequireRole>} />

          <Route path="/acceso-denegado" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
