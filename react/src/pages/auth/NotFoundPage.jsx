import { Link, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="wrap">
      <div className="empty">
        <div className="err-code">404</div>
        <h1>Este aviso ya no está en el tablón</h1>
        <p className="sub">Puede que el vendedor lo haya retirado o que el enlace esté mal escrito. Busca algo parecido en el catálogo.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/catalogo">Ir al catálogo</Link>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Volver atrás</button>
        </div>
      </div>
    </div>
  );
}
