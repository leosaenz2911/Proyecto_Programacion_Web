import { useEffect, useMemo, useState } from 'react';
import { useCatalogo } from '../CatalogoContext.jsx';
import { CATEGORIAS, ESTADOS, PRECIO_MAX } from '../avisos.js';

// Campo numérico «S/ 40»: se confirma al salir del campo o con Enter.
function PrecioInput({ valor, etiqueta, onConfirmar }) {
  const [texto, setTexto] = useState(String(valor));
  useEffect(() => setTexto(String(valor)), [valor]);

  const confirmar = () => {
    const n = Number(texto.replace(/[^\d]/g, ''));
    if (texto.trim() === '' || Number.isNaN(n)) { setTexto(String(valor)); return; }
    onConfirmar(Math.min(PRECIO_MAX, n));
  };

  return (
    <label className="price-box">
      <span>S/</span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={etiqueta}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        onBlur={confirmar}
        onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      />
    </label>
  );
}

export default function FiltrosSidebar() {
  const { filtros, toggleCategoria, toggleEstado, setCurso, setPrecio, limpiarFiltros, avisos } = useCatalogo();

  const cursos = useMemo(
    () => [...new Set(avisos.map(a => a.curso).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [avisos]
  );

  const { precioMin, precioMax } = filtros;
  const izquierda = (precioMin / PRECIO_MAX) * 100;
  const derecha = (precioMax / PRECIO_MAX) * 100;

  return (
    <aside className="filters-sidebar" aria-label="Filtros del catálogo">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button type="button" className="btn-link" onClick={limpiarFiltros}>Limpiar</button>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">CATEGORÍA</h4>
        {CATEGORIAS.map(c => (
          <label key={c.valor} className="checkbox-label">
            <input type="checkbox" checked={filtros.categorias.includes(c.valor)} onChange={() => toggleCategoria(c.valor)} />
            <span>{c.valor}</span>
            <span className="filter-count">{c.cuenta}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4 className="filter-title">CURSO ASOCIADO</h4>
        <select className="form-select" aria-label="Curso asociado" value={filtros.curso} onChange={e => setCurso(e.target.value)}>
          <option value="Todos">Todos los cursos</option>
          {cursos.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">RANGO DE PRECIO</h4>
        <div className="range-slider">
          <div className="slider-track" style={{ left: `${izquierda}%`, right: `${100 - derecha}%` }} />
          <input
            type="range" className="range-input" min={0} max={PRECIO_MAX} step={5} value={precioMin}
            aria-label="Precio mínimo" style={{ zIndex: precioMin > PRECIO_MAX - 20 ? 3 : 2 }}
            onChange={e => setPrecio(Math.min(Number(e.target.value), precioMax), precioMax)}
          />
          <input
            type="range" className="range-input" min={0} max={PRECIO_MAX} step={5} value={precioMax}
            aria-label="Precio máximo"
            onChange={e => setPrecio(precioMin, Math.max(Number(e.target.value), precioMin))}
          />
        </div>
        <div className="price-inputs">
          <PrecioInput valor={precioMin} etiqueta="Precio mínimo en soles" onConfirmar={n => setPrecio(Math.min(n, precioMax), precioMax)} />
          <PrecioInput valor={precioMax} etiqueta="Precio máximo en soles" onConfirmar={n => setPrecio(precioMin, Math.max(n, precioMin))} />
        </div>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">ESTADO DEL PRODUCTO</h4>
        {ESTADOS.map(e => (
          <label key={e} className="checkbox-label">
            <input type="checkbox" checked={filtros.estados.includes(e)} onChange={() => toggleEstado(e)} />
            <span>{e}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
