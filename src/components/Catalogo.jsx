import AvisoCard from "./AvisoCard.jsx";
import FiltrosSidebar from "./FiltrosSidebar.jsx";

const FILTROS_ACTIVOS = [
  "Libros de texto",
  "Cálculo I",
  "S/ 40 - S/ 120",
  "Muy buen estado",
];

function Esqueletos() {
  return (
    <div className="skeleton-container">
      <div className="cards-grid">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="sk-img"></div>
            <div className="sk-line long"></div>
            <div className="sk-line short"></div>
          </div>
        ))}
      </div>
      <div className="loading-indicator">
        <span className="spinner"></span>
        <span>
          Buscando avisos... los esqueletos mantienen la altura de la tarjeta
          real para evitar saltos de maquetación.
        </span>
      </div>
    </div>
  );
}

function EstadoVacio({ onLimpiar }) {
  return (
    <div className="empty-state-box">
      <div className="empty-icon-bg">🔍</div>
      <h2>Ningún aviso coincide con tu búsqueda</h2>
      <p>
        Prueba con menos filtros o amplía el rango de precio. También puedes
        crear una alerta y te avisamos cuando alguien publique algo parecido.
      </p>
      <div className="empty-actions">
        <button className="btn btn-primary" onClick={onLimpiar}>
          Limpiar filtros
        </button>
        <button className="btn btn-secondary">Crear alerta de búsqueda</button>
      </div>
    </div>
  );
}

export default function Catalogo({
  resultados,
  cargando,
  terminoMostrado,
  onAbrir,
  onToggleFav,
  onLimpiar,
}) {
  const total = resultados.length;

  return (
    <main className="main-container view-section">
      <FiltrosSidebar />

      <section className="catalog-content">
        <div className="active-filters-bar">
          <span className="active-filters-label">Filtros activos:</span>
          {FILTROS_ACTIVOS.map((f) => (
            <span key={f} className="tag-filter">
              {f} <button className="btn-remove">✕</button>
            </span>
          ))}
          <button className="btn-link btn-clear-all" onClick={onLimpiar}>
            Limpiar todo
          </button>
        </div>

        <div className="catalog-bar">
          <div className="results-count">
            <strong>{total}</strong> avisos encontrados
            {terminoMostrado && <> para «{terminoMostrado}»</>}
          </div>
          <div className="sort-container">
            <label htmlFor="ordenar">Ordenar por</label>
            <select id="ordenar" className="form-select-sm" defaultValue="recientes">
              <option value="recientes">Más recientes</option>
              <option value="asc">Precio ascendente</option>
              <option value="desc">Precio descendente</option>
            </select>
          </div>
        </div>

        {cargando ? (
          <Esqueletos />
        ) : total === 0 ? (
          <EstadoVacio onLimpiar={onLimpiar} />
        ) : (
          <>
            <div className="cards-grid">
              {resultados.map((aviso) => (
                <AvisoCard
                  key={aviso.id}
                  aviso={aviso}
                  onAbrir={onAbrir}
                  onToggleFav={onToggleFav}
                />
              ))}
            </div>

            <div className="pagination">
              <span className="pagination-info">
                Mostrando 1-{total} de {total} resultados
              </span>
              <div className="pagination-controls">
                <button className="page-btn disabled">&lt;</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">&gt;</button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
