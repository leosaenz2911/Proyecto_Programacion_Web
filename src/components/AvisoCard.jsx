export default function AvisoCard({
  aviso,
  onAbrir,
  onToggleFav,
  mostrarCurso = true,
}) {
  return (
    <article
      className="card"
      onClick={onAbrir ? () => onAbrir(aviso) : undefined}
    >
      <div className="card-img-placeholder">
        {onToggleFav && (
          <button
            className={`btn-fav ${aviso.fav ? "active" : ""}`}
            aria-label={aviso.fav ? "Quitar de favoritos" : "Guardar en favoritos"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(aviso.id);
            }}
          >
            {aviso.fav ? "🧡" : "🤍"}
          </button>
        )}
      </div>
      <div className="card-body">
        <h4 className="card-title">{aviso.titulo}</h4>
        <div className="card-price">{aviso.precio}</div>
        <div className="card-details">
          {mostrarCurso ? `${aviso.estado} · ${aviso.curso}` : aviso.estado}
        </div>
      </div>
    </article>
  );
}
