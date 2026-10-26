import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { TAM_PAGINA, useCatalogo } from '../CatalogoContext.jsx';
import AvisoCard from './AvisoCard.jsx';
import EstadoVacio from './EstadoVacio.jsx';
import FiltrosSidebar from './FiltrosSidebar.jsx';

// Mockup 3.3: esqueletos con la misma altura que la tarjeta real (panel de filtros, chips, contador y 8 tarjetas).
function Esqueletos() {
  return (
    <div className="main-container" aria-busy="true">
      <aside className="filters-sidebar sk-sidebar" aria-hidden="true">
        <div className="sk-line w60" />
        <div className="sk-line w90" /><div className="sk-line w80" /><div className="sk-line w90" /><div className="sk-line w70" />
        <div className="sk-block" />
        <div className="sk-line w50" />
        <div className="sk-line w90" /><div className="sk-line w70" />
        <div className="sk-pair"><div className="sk-block" /><div className="sk-block" /></div>
      </aside>
      <section className="catalog-content">
        <div className="sk-chips" aria-hidden="true">
          <span className="sk-chip" /><span className="sk-chip" /><span className="sk-chip" />
        </div>
        <div className="catalog-bar" aria-hidden="true">
          <div className="sk-line w30" style={{ margin: 0 }} />
          <div className="sk-select" />
        </div>
        <div className="cards-grid" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton-card">
              <div className="sk-img" />
              <div className="sk-line long" />
              <div className="sk-price" />
              <div className="sk-line short" />
            </div>
          ))}
        </div>
        <div className="loading-indicator" role="status">
          <span className="spinner" aria-hidden="true" />
          <span>Buscando avisos… los esqueletos mantienen la altura de la tarjeta real para evitar saltos de maquetación.</span>
        </div>
      </section>
    </div>
  );
}

function Paginacion({ total, pagina, totalPaginas, tam, onIr }) {
  const desde = (pagina - 1) * tam + 1;
  const hasta = Math.min(pagina * tam, total);
  return (
    <div className="pagination">
      <span className="pagination-info">Mostrando {desde}–{hasta} de {total} resultados</span>
      <nav className="pagination-controls" aria-label="Paginación">
        <button type="button" className="page-btn" disabled={pagina === 1} onClick={() => onIr(pagina - 1)} aria-label="Página anterior">‹</button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
          <button key={n} type="button" className={`page-btn${n === pagina ? ' active' : ''}`} aria-current={n === pagina ? 'page' : undefined} onClick={() => onIr(n)}>{n}</button>
        ))}
        <button type="button" className="page-btn" disabled={pagina === totalPaginas} onClick={() => onIr(pagina + 1)} aria-label="Página siguiente">›</button>
      </nav>
    </div>
  );
}

export default function Catalogo() {
  const {
    avisos, cargando, terminoMostrado, chips, filtros, resultados, visibles, pagina, totalPaginas, orden,
    setOrden, setPagina, quitarChip, limpiarFiltros, limpiarBusqueda, toggleFav,
  } = useCatalogo();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const total = resultados.length;
  const abrir = aviso => navigate(`/catalogo/aviso/${aviso.id}`);

  // «Quizá te interese»: avisos disponibles del mismo curso filtrado (o los más recientes).
  const sugerencias = useMemo(() => {
    const libres = avisos.filter(a => !a.vendido).sort((a, b) => b.publicadoISO.localeCompare(a.publicadoISO));
    const delCurso = filtros.curso === 'Todos' ? [] : libres.filter(a => a.curso === filtros.curso);
    return [...delCurso, ...libres.filter(a => !delCurso.includes(a))].slice(0, 4);
  }, [avisos, filtros.curso]);

  const crearAlerta = () => {
    if (!user) { navigate('/login', { state: { from: '/catalogo', needLogin: true } }); return; }
    showToast('Alerta creada. Te avisaremos cuando alguien publique algo parecido.');
  };

  if (cargando) return <Esqueletos />;

  return (
    <div className="main-container">
      <FiltrosSidebar />

      <section className="catalog-content">
        {chips.length > 0 && (
          <div className="active-filters-bar">
            <span className="active-filters-label">Filtros activos:</span>
            {chips.map(chip => (
              <span key={chip.clave} className="tag-filter">
                {chip.etiqueta}
                <button type="button" className="btn-remove" aria-label={`Quitar filtro ${chip.etiqueta}`} onClick={() => quitarChip(chip)}>✕</button>
              </span>
            ))}
            <button type="button" className="btn-link btn-clear-all" onClick={limpiarFiltros}>Limpiar todo</button>
          </div>
        )}

        <div className="catalog-bar">
          <div className="results-count" role="status">
            <strong>{total}</strong> {total === 1 ? 'aviso encontrado' : 'avisos encontrados'}
            {terminoMostrado && <> para «{terminoMostrado}»</>}
          </div>
          {total > 0 && (
            <div className="sort-container">
              <label htmlFor="ordenar">Ordenar por</label>
              <select id="ordenar" className="form-select-sm" value={orden} onChange={e => setOrden(e.target.value)}>
                <option value="recientes">Más recientes</option>
                <option value="asc">Precio ascendente</option>
                <option value="desc">Precio descendente</option>
              </select>
            </div>
          )}
        </div>

        {total === 0 ? (
          <>
            <EstadoVacio
              titulo="Ningún aviso coincide con tu búsqueda"
              texto="Prueba con menos filtros o amplía el rango de precio. También puedes crear una alerta y te avisamos cuando alguien publique algo parecido."
            >
              <button type="button" className="btn btn-primary" onClick={chips.length ? limpiarFiltros : limpiarBusqueda}>
                {chips.length ? 'Limpiar filtros' : 'Limpiar búsqueda'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={crearAlerta}>Crear alerta de búsqueda</button>
            </EstadoVacio>

            <div className="suggestions">
              <h4 className="filter-title">QUIZÁ TE INTERESE</h4>
              <div className="cards-grid">
                {sugerencias.map(a => <AvisoCard key={a.id} aviso={a} onAbrir={abrir} />)}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="cards-grid">
              {visibles.map(aviso => (
                <AvisoCard key={aviso.id} aviso={aviso} onAbrir={abrir} onToggleFav={user?.rol === 'USUARIO' ? toggleFav : undefined} />
              ))}
            </div>
            <Paginacion total={total} pagina={pagina} totalPaginas={totalPaginas} tam={TAM_PAGINA} onIr={setPagina} />
          </>
        )}
      </section>
    </div>
  );
}
