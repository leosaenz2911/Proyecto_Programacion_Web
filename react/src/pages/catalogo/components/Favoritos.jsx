import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalogo } from '../CatalogoContext.jsx';
import AvisoCard from './AvisoCard.jsx';
import EstadoVacio from './EstadoVacio.jsx';

const ORDENES = {
  recientes: { etiqueta: 'Guardados recientemente', fn: (a, b) => b.favTs - a.favTs },
  asc: { etiqueta: 'Precio ascendente', fn: (a, b) => a.precio - b.precio },
  desc: { etiqueta: 'Precio descendente', fn: (a, b) => b.precio - a.precio },
};

// Mockup 3.7. Los avisos vendidos NO se quitan de la lista: se marcan como vendidos y ofrecen avisos similares.
export default function Favoritos() {
  const { avisos, toggleFav } = useCatalogo();
  const navigate = useNavigate();
  const [orden, setOrden] = useState('recientes');

  const favoritos = avisos.filter(a => a.fav).sort(ORDENES[orden].fn);
  const vendidos = favoritos.filter(a => a.vendido).length;
  const subtitulo = `${favoritos.length} ${favoritos.length === 1 ? 'aviso guardado' : 'avisos guardados'}`
    + (vendidos ? ` · ${vendidos} ya se vendió` : '');
  const abrir = aviso => navigate(`/catalogo/aviso/${aviso.id}`);

  return (
    <div className="favoritos-section">
      <div className="favoritos-header">
        <div>
          <h1>Favoritos</h1>
          <span className="subtitle-text">{subtitulo}</span>
        </div>
        {favoritos.length > 0 && (
          <div className="sort-container">
            <label htmlFor="orden-favoritos">Ordenar por</label>
            <select id="orden-favoritos" className="form-select-sm" value={orden} onChange={e => setOrden(e.target.value)}>
              {Object.entries(ORDENES).map(([clave, o]) => <option key={clave} value={clave}>{o.etiqueta}</option>)}
            </select>
          </div>
        )}
      </div>

      {favoritos.length === 0 ? (
        <EstadoVacio
          titulo="Aún no tienes favoritos"
          texto="Toca el corazón en cualquier aviso para guardarlo y volver a él cuando quieras ofertar."
        >
          <button type="button" className="btn btn-primary" onClick={() => navigate('/catalogo')}>Explorar catálogo</button>
        </EstadoVacio>
      ) : (
        <div className="cards-grid favoritos-grid">
          {favoritos.map(aviso => (
            <AvisoCard key={aviso.id} aviso={aviso} enFavoritos onAbrir={abrir} onToggleFav={toggleFav} onSimilares={abrir} />
          ))}
        </div>
      )}
    </div>
  );
}
