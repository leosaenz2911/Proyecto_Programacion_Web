import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { emailRule, required } from '../../utils/validators';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';

const rules = { email: emailRule, password: required };

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [loginError, setLoginError] = useState('');
  const form = useForm({ email: location.state?.email || '', password: '' }, rules);

  // Llegó aquí desde una ruta protegida sin sesión
  useEffect(() => {
    if (location.state?.needLogin) showToast('Inicia sesión para continuar.', 'error');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = e => {
    e.preventDefault();
    setLoginError('');
    if (form.validateAll()) return;
    const result = login(form.values.email, form.values.password);
    if (!result.ok) return setLoginError(result.message);
    showToast('Sesión iniciada.');   // GuestOnly redirige a la ruta pendiente o a la vista principal del rol
  };

  return (
    <section className="auth-split">
      <div className="auth-photo">
        <div className="quote">
          «Vendí mis libros de Cálculo en tres días y compré los de Física del ciclo siguiente.»
          <small>Rosa María Quispe Ríos · Administración</small>
        </div>
      </div>
      <div className="auth-form">
        <div className="box">
          <h1>Iniciar sesión</h1>
          <p className="sub">Usa tu correo institucional @aloe.ulima.edu.pe para ofertar, publicar y coordinar entregas.</p>
          {loginError && <div className="alert alert-error">{loginError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Correo institucional" name="email" type="email" placeholder="20201234@aloe.ulima.edu.pe"
              value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
            <PasswordField label="Contraseña" name="password" toggle
              value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.password} />
            <div className="form-foot"><span></span><Link to="/recuperar">¿Olvidaste tu contraseña?</Link></div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">Ingresar</button>
          </form>
          <p className="switch">¿No tienes cuenta? <Link to="/registro"><b>Crear cuenta</b></Link></p>
          <p className="demo">
            Demo: <code>20201234@aloe.ulima.edu.pe</code> / <code>Rosa1234</code> · admin: <code>20150001@aloe.ulima.edu.pe</code> / <code>Admin1234</code>
          </p>
        </div>
      </div>
    </section>
  );
}
