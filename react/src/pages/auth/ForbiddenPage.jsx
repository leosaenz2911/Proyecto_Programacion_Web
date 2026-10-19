import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HOME_BY_ROLE } from '../../utils/constants';

export default function ForbiddenPage() {
  const { user } = useAuth();
  return (
    <div className="wrap">
      <div className="empty">
        <div className="big-icon danger"><i className="fa-solid fa-lock" /></div>
        <h1>Acceso denegado</h1>
        <p className="sub">
          Tu cuenta de {user ? user.rol.toLowerCase() : 'visitante'} no tiene permisos sobre esta sección, que es exclusiva del
          administrador del tablón. Si crees que se trata de un error, escribe a tablon@ulima.edu.pe.
        </p>
        <Link className="btn btn-primary" to={user ? HOME_BY_ROLE[user.rol] : '/'}>Volver al catálogo</Link>
      </div>
    </div>
  );
}
