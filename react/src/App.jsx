import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import TablonApp from './modules/tablon/TablonApp';
import './modules/tablon/tablon.css';
import AdminPlaceholder from './pages/auth/AdminPlaceholder';
import Historia6 from './pages/ratings/Historia6';
import Ofertas from './components/Ofertas/Ofertas';
import CatalogoPage from './pages/catalogo/CatalogoPage';
import MisAcuerdos from './pages/acuerdos/MisAcuerdos';

// El Catálogo (/catalogo, /catalogo/aviso/:id, /catalogo/vendedor/:id y /favoritos) es un módulo React propio: src/pages/catalogo.
// Cada historia se mantiene en su módulo; comparten React Router, sesión y estilo base.
const TABLON_VIEWS = {
  '/mis-publicaciones': 'misPublicacionesView',
  '/publicar': 'nuevoAvisoView',
  '/fotografias': 'fotosAvisoView',
  '/tablon': 'landingView',
  '/tablon/publicaciones': 'misPublicacionesView',
  '/tablon/publicar': 'nuevoAvisoView',
};

export default function App() {
  const { pathname } = useLocation();
  const isTablon = pathname in TABLON_VIEWS;
  const isCorePage = !isTablon;

  return (
    <>
      {isCorePage && <Header />}
      {isCorePage && (
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/catalogo" element={<CatalogoPage vista="lista" />} />
            <Route path="/catalogo/aviso/:id" element={<CatalogoPage vista="detalle" />} />
            <Route path="/catalogo/vendedor/:id" element={<CatalogoPage vista="perfil" />} />
            <Route path="/favoritos" element={<RequireRole roles={['USUARIO']}><CatalogoPage vista="favoritos" /></RequireRole>} />
            <Route path="/tablon/catalogo" element={<Navigate to="/catalogo" replace />} />
            <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/registro" element={<GuestOnly><RegisterPage /></GuestOnly>} />
            <Route path="/recuperar" element={<GuestOnly><RecoverPasswordPage /></GuestOnly>} />
            <Route path="/mi-cuenta" element={<RequireRole roles={['USUARIO', 'ADMINISTRADOR']}><AccountPage /></RequireRole>} />
            <Route path="/ofertas" element={<RequireRole roles={['USUARIO']}><Ofertas /></RequireRole>} />
            <Route path="/calificaciones" element={<RequireRole roles={['USUARIO']}><Historia6 /></RequireRole>} />
            <Route path="/admin" element={<RequireRole roles={['ADMINISTRADOR']}><AdminPlaceholder /></RequireRole>} />
            <Route path="/acceso-denegado" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/acuerdos" element={<MisAcuerdos />} />
          </Routes>
        </main>
      )}
      {isCorePage && <Footer />}
      {/* Este árbol se monta una sola vez para conservar las funciones y listeners
          de las publicaciones al cambiar entre apartados. No hay un segundo React root. */}
      <div style={{ display: isTablon ? 'block' : 'none' }}>
        <div className="tablon-app">
          <TablonApp active={isTablon} targetView={TABLON_VIEWS[pathname]} />
        </div>
      </div>
    </>
  );
}
