import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AvatarUploader from './AvatarUploader';

export default function ProfileCard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
    showToast('Cerraste sesión.');
  };

  return (
    <div className="card profile-card">
      <AvatarUploader user={user} />
      <h2>{user.nombres} {user.apellidos}</h2>
      <span className="badge-ok"><i className="fa-solid fa-circle-check" /> Verificado</span>
      <hr />
      <p className="eyebrow">Cerrar sesión</p>
      <p className="hint" style={{ margin: '6px 0 12px' }}>En este dispositivo.</p>
      <button className="btn btn-secondary btn-block" onClick={handleLogout}>Salir</button>
    </div>
  );
}
