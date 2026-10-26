import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useCatalogo } from './CatalogoContext';
import Catalogo from './components/Catalogo.jsx';
import DetalleAviso from './components/DetalleAviso.jsx';
import EstadoVacio from './components/EstadoVacio.jsx';
import Favoritos from './components/Favoritos.jsx';
import PerfilVendedor from './components/PerfilVendedor.jsx';
import './catalogo.css';

// vista: 'lista' (/catalogo) · 'detalle' (/catalogo/aviso/:id) · 'perfil' (/catalogo/vendedor/:id) · 'favoritos' (/favoritos)
export default function CatalogoPage({ vista = 'lista' }) {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { getAviso } = useCatalogo();

  // Al cambiar de pantalla se vuelve al inicio de la página.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const aviso = vista === 'detalle' ? getAviso(id) : null;

  return (
    <div className="catalogo-app">
      {vista === 'lista' && <Catalogo />}
      {vista === 'favoritos' && <Favoritos />}
      {vista === 'perfil' && <PerfilVendedor vendedorId={id} />}
      {vista === 'detalle' && (aviso ? <DetalleAviso key={aviso.id} aviso={aviso} /> : (
        <div className="detail-section">
          <EstadoVacio titulo="Este aviso ya no está disponible" texto="Puede que se haya retirado o que el enlace sea incorrecto.">
            <Link className="btn btn-primary" to="/catalogo">Explorar catálogo</Link>
          </EstadoVacio>
        </div>
      ))}
    </div>
  );
}
