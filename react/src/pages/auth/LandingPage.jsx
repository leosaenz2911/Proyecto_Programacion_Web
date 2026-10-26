import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = [
  ['fa-book', 'Libros de texto'], ['fa-calculator', 'Calculadoras'], ['fa-ruler-combined', 'Instrumentos de dibujo'],
  ['fa-file-lines', 'Apuntes y guías'], ['fa-laptop', 'Laptops y accesorios'], ['fa-shirt', 'Uniformes y mandiles'],
  ['fa-flask', 'Material de laboratorio']
];

// Datos de ejemplo; la tarjeta de aviso real es del módulo compartido (HU-2/HU-3)
const RECENT = [
  ['Cálculo de una variable — Stewart', 'S/ 95.00', 'Muy buen estado · Cálculo I'],
  ['Calculadora ClassWiz fx-991', 'S/ 120.00', 'Como nuevo · Física II'],
  ['Escuadras y escalímetro Faber', 'S/ 38.00', 'Buen estado · Dibujo Técnico'],
  ['Apuntes de Contabilidad General', 'S/ 25.00', 'Con marcas de uso']
];

const STEPS = [
  ['Publica tu aviso', 'Sube fotografías, indica el estado del producto y tu precio pedido.'],
  ['Recibe y negocia ofertas', 'Acepta, rechaza o contraoferta desde el hilo de negociación.'],
  ['Coordinen la entrega', 'Elijan punto y horario en el campus y confirmen la entrega.']
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <section>
      <div className="hero">
        <div className="wrap">
          <h1>Lo que a un compañero le sobra, a ti te sirve este ciclo</h1>
          <p className="sub">Libros, calculadoras e instrumentos de segunda mano publicados por estudiantes de la Universidad de Lima. Oferta, acuerda y recoge dentro del campus.</p>
          <form className="hero-search" onSubmit={e => { e.preventDefault(); navigate('/catalogo'); }}>
            <input type="search" placeholder="¿Qué estás buscando? Ej. Stewart Cálculo" />
            <button className="btn btn-primary">Buscar</button>
          </form>
          <div className="stats">
            <div><b>1,248</b><span>avisos activos</span></div>
            <div><b>S/ 62</b><span>precio mediano</span></div>
            <div><b>4.8</b><span>reputación media</span></div>
          </div>
        </div>
      </div>
      <div className="wrap">
        <p className="eyebrow" style={{ marginTop: 28 }}>Categorías destacadas</p>
        <div className="cats" style={{ marginTop: 12 }}>
          {CATEGORIES.map(([icon, name]) => (
            <div key={name} className="cat"><i className={`fa-solid ${icon}`} />{name}</div>
          ))}
        </div>
        <div className="section-head"><h2>Avisos recientes</h2><Link to="/catalogo">Ver todo el catálogo →</Link></div>
        <div className="recent">
          {RECENT.map(([title, price, meta]) => (
            <div key={title} className="item"><b>{title}</b><em>{price}</em>{meta}</div>
          ))}
        </div>
        <div className="integration-quicklinks">
          <Link className="btn btn-primary" to="/catalogo">Explorar catálogo</Link>
          <Link className="btn btn-secondary" to="/publicar">Publicar un aviso</Link>
        </div>
        <div className="steps3">
          {STEPS.map(([title, text], i) => (
            <div key={title} className="step3"><i>{i + 1}</i><div><b>{title}</b><span>{text}</span></div></div>
          ))}
        </div>
      </div>
    </section>
  );
}
