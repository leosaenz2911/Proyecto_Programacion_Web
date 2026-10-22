const CATEGORIAS = [
  { valor: "Libros de texto", cuenta: 48, marcado: true },
  { valor: "Calculadoras", cuenta: 22 },
  { valor: "Instrumentos de dibujo", cuenta: 17 },
  { valor: "Apuntes y guías", cuenta: 31 },
];

const ESTADOS = [
  { valor: "Como nuevo" },
  { valor: "Muy buen estado", marcado: true },
  { valor: "Buen estado" },
];

// Panel de filtros (maqueta estática, igual que en el HTML original)
export default function FiltrosSidebar() {
  return (
    <aside className="filters-sidebar">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button className="btn-link">Limpiar</button>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">CATEGORÍA</h4>
        {CATEGORIAS.map((c) => (
          <label key={c.valor} className="checkbox-label">
            <input type="checkbox" name="categoria" value={c.valor} defaultChecked={c.marcado} />
            <span>{c.valor}</span>
            <span className="filter-count">{c.cuenta}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4 className="filter-title">CURSO ASOCIADO</h4>
        <select className="form-select" defaultValue="Cálculo I">
          <option value="Todos">Todos los cursos</option>
          <option value="Cálculo I">Cálculo I</option>
          <option value="Física II">Física II</option>
          <option value="Química General">Química General</option>
        </select>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">RANGO DE PRECIO</h4>
        <div className="range-slider">
          <div className="slider-track"></div>
          <div className="range-thumb left" style={{ left: "20%" }}></div>
          <div className="range-thumb right" style={{ left: "60%" }}></div>
        </div>
        <div className="price-inputs">
          <div className="price-box">
            <span>S/</span> <input type="text" defaultValue="40" />
          </div>
          <div className="price-box">
            <span>S/</span> <input type="text" defaultValue="120" />
          </div>
        </div>
      </div>

      <div className="filter-group">
        <h4 className="filter-title">ESTADO DEL PRODUCTO</h4>
        {ESTADOS.map((e) => (
          <label key={e.valor} className="checkbox-label">
            <input type="checkbox" name="estado" value={e.valor} defaultChecked={e.marcado} />
            <span>{e.valor}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
