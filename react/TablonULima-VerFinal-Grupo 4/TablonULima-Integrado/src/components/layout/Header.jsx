// TEMPORAL: el Header/NavTabs oficial lo implementa el grupo en el módulo compartido.
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { HOME_BY_ROLE, TABS } from '../../utils/constants';
import Avatar from '../auth/Avatar';
import { useCatalogo } from '../../pages/catalogo/CatalogoContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { busqueda, setBusqueda, buscar } = useCatalogo();
  const role = user ? user.rol : 'VISITANTE';
  const enCatalogo = pathname === '/catalogo' || pathname.startsWith('/catalogo/');

  const handleLogout = () => {
    navigate('/');
    logout();
    showToast('Cerraste sesión.');
  };

  return (
    <header className="topbar">
      <div className="topbar-main">
        <Link className="brand" to={user ? HOME_BY_ROLE[user.rol] : '/'}>
          <img className="brand-logo" src="/img/logo_ulima.png" alt="" /><span>Tablón ULima</span>
        </Link>

        {!user && (
          <nav className="nav-links">
            <Link to="/catalogo">Catálogo</Link><Link to="/">Cómo funciona</Link><a>Normas del tablón</a><a>Ayuda</a>
          </nav>
        )}

        {(user?.rol === 'USUARIO' || (!user && enCatalogo)) && (
          <form className="nav-search" role="search" onSubmit={e => { e.preventDefault(); buscar(); navigate('/catalogo'); }}>
            <input type="search" aria-label="Buscar avisos" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar libros, calculadoras, apuntes…" />
          </form>
        )}

        <div className="nav-right">
          {user?.rol === 'USUARIO' && <Link className="btn btn-primary btn-publicar" to="/publicar">Publicar aviso</Link>}
          <span className={`role-badge role-${role.toLowerCase()}`}>{role}</span>
          {user ? (
            <div id="navUserMenu">
              <Link className="user-chip" to="/mi-cuenta">
                <Avatar user={user} size="sm" />
                <span>{user.nombres.split(' ')[0] + ' ' + user.apellidos.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-secondary" onClick={handleLogout}>Salir</button>
            </div>
          ) : (
            <div id="navAuthButtons">
              <Link className="btn btn-ghost" to="/login">Ingresar</Link>
              <Link className="btn btn-primary" to="/registro">Crear cuenta</Link>
            </div>
          )}
        </div>
      </div>

      {user && (
        <nav className={`tabs${user.rol === 'ADMINISTRADOR' ? ' admin' : ''}`}>
          {TABS[user.rol].map(tab =>
            tab.to ? (
              <Link key={tab.label} to={tab.to} className={pathname === tab.to || pathname.startsWith(tab.to + '/') ? 'active' : ''}>{tab.label}</Link>
            ) : (
              <a key={tab.label} onClick={() => showToast('Esta vista pertenece a otra historia del grupo.', 'info')}>{tab.label}</a>
            )
          )}
        </nav>
      )}
    </header>
  );
}
