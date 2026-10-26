import { soles } from '../formato.js';

export function Corazon({ lleno }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill={lleno ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M12 21C5 16.5 2 12.5 2 8.8 2 6.1 4.1 4 6.7 4c1.9 0 3.7 1 5.3 3 1.600-2 3.400-3 5.300-3C19.900 4 22 6.100 22 8.800c0 3.700-3 7.700-10 12.200z" />
    </svg>
  );
}

// Tarjeta de aviso (Sistema de diseño · «Tarjeta de aviso»).
// enFavoritos: muestra «Quitar de favoritos» o, si ya se vendió, «Ya se vendió · fecha» + «Ver avisos similares».
export default function AvisoCard({
  aviso,
  onAbrir,
  onToggleFav,
  onSimilares,
  mostrarCurso = true,
  enFavoritos = false,
}) {
  const vendido = Boolean(aviso.vendido);
  const detalle = mostrarCurso ? `${aviso.estado} · ${aviso.curso || aviso.categoria}` : aviso.estado;
  const abrir = onAbrir ? () => onAbrir(aviso) : undefined;

  return (
    <article
      className={`card${vendido ? ' card-vendido' : ''}${abrir ? ' card-clicable' : ''}`}
      onClick={abrir}
      onKeyDown={abrir ? e => { if (e.key === 'Enter') abrir(); } : undefined}
      tabIndex={abrir ? 0 : undefined}
      role={abrir ? 'link' : undefined}
      aria-label={abrir ? `${aviso.titulo}, ${soles(aviso.precio)}` : undefined}
    >
      <div className="card-img-placeholder">
        {aviso.imagen && <img className="card-img" src={aviso.imagen} alt={aviso.titulo} loading="lazy" />}
        {vendido && <span className="pill-vendido">Vendido</span>}
        {onToggleFav && (
          <button
            type="button"
            className={`btn-fav${aviso.fav ? ' active' : ''}`}
            aria-label={aviso.fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            aria-pressed={aviso.fav}
            onClick={e => { e.stopPropagation(); onToggleFav(aviso.id); }}
            onKeyDown={e => e.stopPropagation()}
          >
            <Corazon lleno />
          </button>
        )}
      </div>
      <div className="card-body">
        <h4 className="card-title">{aviso.titulo}</h4>
        <div className="card-price">{soles(aviso.precio)}</div>
        {enFavoritos && vendido ? (
          <>
            <div className="card-details">{detalle}</div>
            <div className="card-sold-note">Ya se vendió · {aviso.vendido}</div>
            <button type="button" className="btn-link card-link" onClick={e => { e.stopPropagation(); onSimilares?.(aviso); }}>
              Ver avisos similares
            </button>
          </>
        ) : (
          <>
            <div className="card-details">{detalle}</div>
            {enFavoritos && (
              <button type="button" className="btn-link card-link" onClick={e => { e.stopPropagation(); onToggleFav(aviso.id); }}>
                Quitar de favoritos
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
