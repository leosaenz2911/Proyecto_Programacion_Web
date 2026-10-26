// TEMPORAL: el Footer oficial lo implementa el grupo en el módulo compartido.
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ marginTop: 'auto' }}>
      <span>Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600</span>
      <div>
        <a>Normas del tablón</a><a>Mesa de ayuda</a><a>tablon@ulima.edu.pe</a>
        <Link to="/admin">Demo: ruta admin</Link><Link to="/ruta-inexistente">Demo: 404</Link>
      </div>
    </footer>
  );
}
