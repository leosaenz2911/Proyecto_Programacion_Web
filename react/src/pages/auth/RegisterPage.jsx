import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { findByEmail } from '../../services/userService';
import { CARRERAS, CICLOS } from '../../utils/constants';
import { emailRule, matchRule, nameRule, passRule, required, termsRule } from '../../utils/validators';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';

const rules = {
  nombres: nameRule('nombres'),
  apellidos: nameRule('apellidos'),
  correo: v => emailRule(v) || (findByEmail(v) ? 'Ya existe una cuenta con este correo.' : ''),
  password: passRule,
  confirm: matchRule('password'),
  carrera: required,
  ciclo: required,
  terms: termsRule
};

const initial = { nombres: '', apellidos: '', correo: '', password: '', confirm: '', carrera: '', ciclo: '', terms: false };

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const form = useForm(initial, rules);
  const [errorCount, setErrorCount] = useState(0);
  const { values, errors, handleChange, handleBlur } = form;
  const bind = name => ({ name, value: values[name], onChange: handleChange, onBlur: handleBlur, error: errors[name] });

  const handleSubmit = e => {
    e.preventDefault();
    const count = form.validateAll();
    setErrorCount(count);
    if (count) return;
    register(values);
    showToast('Cuenta creada. Ya puedes iniciar sesión.');
    navigate('/login', { state: { email: values.correo.trim() } });
  };

  return (
    <div className="wrap center-page">
      <div className="card card-narrow">
        <h1>Crear cuenta</h1>
        <p className="sub">Solo para estudiantes con correo institucional. La cuenta se activa al confirmar el correo.</p>
        {errorCount > 0 && (
          <div className="alert alert-error">
            <b>Revisa {errorCount} campo{errorCount > 1 ? 's' : ''}.</b> Corrige lo marcado en rojo para continuar.
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="row2">
            <FormField label="Nombres" placeholder="Ej. Rosa María" {...bind('nombres')} />
            <FormField label="Apellidos" placeholder="Ej. Quispe Ríos" {...bind('apellidos')} />
          </div>
          <FormField label="Correo institucional" type="email" placeholder="codigo@aloe.ulima.edu.pe" {...bind('correo')} />
          <div className="row2">
            <PasswordField label="Contraseña" hint="Mínimo 8 caracteres, una mayúscula y un número." {...bind('password')} />
            <PasswordField label="Confirmar contraseña" {...bind('confirm')} />
          </div>
          <div className="row2">
            <FormField label="Carrera" options={CARRERAS} placeholder="Selecciona una opción" {...bind('carrera')} />
            <FormField label="Ciclo" options={CICLOS} placeholder="Selecciona ciclo" {...bind('ciclo')} />
          </div>
          <div className="field">
            <label className="check-label">
              <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} />
              Acepto las normas de convivencia del tablón y el registro de mis acuerdos.
            </label>
            {errors.terms && <span className="error-msg">{errors.terms}</span>}
          </div>
          <div className="form-actions">
            <Link className="btn btn-ghost" to="/login">Cancelar</Link>
            <button type="submit" className="btn btn-primary">Crear cuenta</button>
          </div>
        </form>
      </div>
    </div>
  );
}
