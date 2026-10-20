import { useAuth } from '../../context/AuthContext';
import PersonalDataForm from '../../components/auth/PersonalDataForm';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import ProfileCard from '../../components/auth/ProfileCard';

export default function AccountPage() {
  const { user } = useAuth();
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Mi cuenta</h1>
        <p className="sub">{user.nombres} {user.apellidos} · {user.carrera}, {user.ciclo.toLowerCase()} ciclo</p>
      </div>
      <div className="account-grid">
        <div className="stack">
          <PersonalDataForm />
          <ChangePasswordForm />
        </div>
        <aside className="stack"><ProfileCard /></aside>
      </div>
    </div>
  );
}
