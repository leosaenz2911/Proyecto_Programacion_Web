import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useCatalogo } from '../CatalogoContext.jsx';
import { VENDEDORES } from '../avisos.js';
import { estrellas, iniciales } from '../formato.js';
import AvisoCard from './AvisoCard.jsx';
import EstadoVacio from './EstadoVacio.jsx';

// Mockup 3.8 · perfil público del vendedor con reputación.
export default function PerfilVendedor({ vendedorId }) {
  const { avisos, toggleFav } = useCatalogo();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [pestana, setPestana] = useState('todos');

  const vendedor = VENDEDORES[vendedorId];
  if (!vendedor) {
    return (
      <section className="seller-profile-section">
        <EstadoVacio titulo="No encontramos a este vendedor" texto="El perfil que buscas no existe o ya no está disponible.">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/catalogo')}>Explorar catálogo</button>
        </EstadoVacio>
      </section>
    );
  }

  const suyos = avisos.filter(a => a.vendedorId === vendedor.id);
  const activos = suyos.filter(a => !a.vendido);
  const vendidos = suyos.filter(a => a.vendido);
  const lista = pestana === 'activos' ? activos : pestana === 'vendidos' ? vendidos : suyos;
  const pills = [
    ['todos', `Todos · ${suyos.length}`],
    ['activos', `Activos · ${activos.length}`],
    ['vendidos', `Vendidos · ${vendidos.length}`],
  ];

  return (
    <section className="seller-profile-section">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/catalogo">Catálogo</Link>
        <span aria-hidden="true"> &gt; </span>Perfil de {vendedor.nombre}
      </nav>

      <div className="seller-card-header">
        <div className="seller-main-info">
          <div className="avatar-initials avatar-xl" aria-hidden="true">{iniciales(vendedor.nombre)}</div>
          <div className="seller-details">
            <div className="seller-title-row">
              <h1>{vendedor.nombre}</h1>
              {vendedor.confiable && <span className="chip-badge chip-success">Vendedora confiable</span>}
            </div>
            <p className="seller-meta">{vendedor.carrera} · {vendedor.ciclo} ciclo · en el tablón desde {vendedor.desdeLargo}</p>
            <div className="rating-row">
              <strong className="rating-value">{vendedor.rating.toFixed(1)}</strong>
              <span className="stars" aria-hidden="true">{estrellas(vendedor.rating)}</span>
              <span className="rating-count">({vendedor.calificaciones} calificaciones recibidas)</span>
            </div>
          </div>
        </div>

        <div className="seller-metrics-group">
          <div className="metric-item"><span className="metric-num">{vendedor.cerrados}</span><span className="metric-lbl">acuerdos cerrados</span></div>
          <div className="metric-item"><span className="metric-num">{activos.length}</span><span className="metric-lbl">avisos activos</span></div>
          <div className="metric-item"><span className="metric-num">{vendedor.responde}</span><span className="metric-lbl">responde en</span></div>
          <button type="button" className="btn-link btn-report" onClick={() => showToast('Esta vista pertenece a otra historia del grupo.', 'info')}>Reportar usuario</button>
        </div>
      </div>

      <div className="seller-section-block">
        <div className="section-title-bar">
          <h2>Avisos publicados</h2>
          <div className="pills-filter" role="tablist" aria-label="Filtrar avisos">
            {pills.map(([clave, etiqueta]) => (
              <button key={clave} type="button" role="tab" aria-selected={pestana === clave} className={`pill-btn${pestana === clave ? ' active' : ''}`} onClick={() => setPestana(clave)}>
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        {lista.length === 0 ? (
          <p className="seller-empty">No hay avisos en esta categoría.</p>
        ) : (
          <div className="cards-grid seller-grid">
            {lista.map(aviso => (
              <AvisoCard key={aviso.id} aviso={aviso} mostrarCurso={false} onAbrir={a => navigate(`/catalogo/aviso/${a.id}`)} onToggleFav={user?.rol === 'USUARIO' && !aviso.vendido ? toggleFav : undefined} />
            ))}
          </div>
        )}
      </div>

      <div className="seller-section-block">
        <h2>Últimas calificaciones recibidas</h2>
        {vendedor.resenas.length === 0 ? (
          <p className="seller-empty">Este vendedor aún no muestra calificaciones recientes.</p>
        ) : (
          <div className="reviews-grid">
            {vendedor.resenas.map(r => (
              <div key={r.fecha} className="review-card">
                <div className="review-header">
                  <span className="stars-gold" aria-label={`${r.estrellas} de 5 estrellas`}>{estrellas(r.estrellas)}</span>
                  <span className="review-date">{r.fecha}</span>
                </div>
                <p className="review-text">{r.texto}</p>
                <div className="review-author">{r.autor}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
