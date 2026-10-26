import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { emailRule, matchRule, passRule } from '../../utils/validators';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';

const STEPS = ['Paso 1 · Correo', 'Paso 2 · Enlace', 'Paso 3 · Nueva contraseña'];

function RecoverEmailStep({ onSent }) {
  const form = useForm({ email: '' }, { email: emailRule });
  const handleSubmit = e => {
    e.preventDefault();
    if (form.validateAll()) return;
    onSent(form.values.email.trim().toLowerCase());
  };
  return (
    <form className="recover-step" onSubmit={handleSubmit} noValidate>
      <h1>Ingresa tu correo institucional</h1>
      <p className="sub">Te enviaremos un enlace para crear una nueva contraseña. El enlace vence en 30 minutos.</p>
      <FormField label="Correo institucional" name="email" type="email" placeholder="20201234@aloe.ulima.edu.pe"
        value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} />
      <div className="form-foot">
        <Link to="/login"><b>Volver al inicio de sesión</b></Link>
        <button type="submit" className="btn btn-primary">Enviar enlace</button>
      </div>
    </form>
  );
}

function RecoverSentStep({ email, onOpenLink, onBack }) {
  return (
    <div className="recover-step" style={{ textAlign: 'center' }}>
      <div className="big-icon"><i className="fa-regular fa-envelope" /></div>
      <h1>Revisa tu correo</h1>
      <p className="sub">Enviamos el enlace a <b>{email}</b>. Si no lo ves, revisa la carpeta de correo no deseado.</p>
      <button className="btn btn-primary btn-block" onClick={onOpenLink}>Simular clic en el enlace del correo</button>
      <p className="demo">Demo: el proyecto no envía correos reales.</p>
      <button className="btn btn-secondary btn-block" onClick={onBack}>Usar otro correo</button>
    </div>
  );
}

const newPassRules = { pass: passRule, confirm: matchRule('pass') };

function RecoverNewPasswordStep({ email }) {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const form = useForm({ pass: '', confirm: '' }, newPassRules);
  const { values, errors, handleChange, handleBlur } = form;

  const handleSubmit = e => {
    e.preventDefault();
    if (form.validateAll()) return;
    resetPassword(email, values.pass);
    showToast('Listo. Ya puedes iniciar sesión con tu nueva contraseña.');
    navigate('/login');
  };

  return (
    <form className="recover-step" onSubmit={handleSubmit} noValidate>
      <h1>Crea tu nueva contraseña</h1>
      <div style={{ marginTop: 16 }}>
        <PasswordField label="Nueva contraseña" name="pass" hint="Mínimo 8 caracteres, con una mayúscula y un número."
          value={values.pass} onChange={handleChange} onBlur={handleBlur} error={errors.pass} />
      </div>
      <PasswordField label="Confirmar contraseña" name="confirm"
        value={values.confirm} onChange={handleChange} onBlur={handleBlur} error={errors.confirm} />
      <button type="submit" className="btn btn-primary btn-block">Guardar contraseña</button>
    </form>
  );
}

export default function RecoverPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  return (
    <div className="wrap">
      <div className="steps-bar">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item${i + 1 <= step ? ' active' : ''}`}><span></span>{label}</div>
        ))}
      </div>
      <div className="card card-mid" style={{ marginBottom: 48 }}>
        {step === 1 && <RecoverEmailStep onSent={e => { setEmail(e); setStep(2); }} />}
        {step === 2 && <RecoverSentStep email={email} onOpenLink={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <RecoverNewPasswordStep email={email} />}
      </div>
    </div>
  );
}
