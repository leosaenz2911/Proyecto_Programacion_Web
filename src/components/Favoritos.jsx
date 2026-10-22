import AvisoCard from "./AvisoCard.jsx";

export default function Favoritos({ favoritos, onToggleFav, onExplorar }) {
  return (
    <div className="favoritos-section view-section">
      <div className="favoritos-header">
        <div>
          <h2>Favoritos</h2>
          <span className="subtitle-text">
            {favoritos.length} {favoritos.length === 1 ? "aviso guardado" : "avisos guardados"}
          </span>
        </div>
        <div className="sort-container">
          <label>Ordenar por</label>
          <select className="form-select-sm">
            <option>Guardados recientemente</option>
          </select>
        </div>
      </div>

      {favoritos.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-icon-bg">🧡</div>
          <h2>Aún no tienes favoritos</h2>
          <p>
            Toca el corazón en cualquier aviso para guardarlo y volver a él
            cuando quieras ofertar.
          </p>
          <button className="btn btn-primary" onClick={onExplorar}>
            Explorar catálogo
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {favoritos.map((aviso) => (
            <AvisoCard key={aviso.id} aviso={aviso} onToggleFav={onToggleFav} />
          ))}
        </div>
      )}
    </div>
  );
}
