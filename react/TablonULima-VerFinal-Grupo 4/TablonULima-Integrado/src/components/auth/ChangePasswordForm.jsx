import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { matchRule, passRule, required } from '../../utils/validators';
import PasswordField from './PasswordField';

const rules = { current: required, nueva: passRule, confirm: matchRule('nueva') };
const initial = { current: '', nueva: '', confirm: '' };

export default function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const { showToast } = useToast();
  const form = useForm(initial, rules);
  const { values, errors, handleChange, handleBlur } = form;
  const bind = name => ({ name, value: values[name], onChange: handleChange, onBlur: handleBlur, error: errors[name] });

  const handleSubmit = e => {
    e.preventDefault();
    if (form.validateAll()) return;
    const result = changePassword(values.current, values.nueva);
    if (!result.ok) return form.setFieldError(result.field, result.message);
    form.reset();
    showToast('Contraseña actualizada.');
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>Cambiar contraseña</h2>
      <PasswordField label="Contraseña actual" {...bind('current')} />
      <div className="row2">
        <PasswordField label="Nueva contraseña" hint="Mínimo 8 caracteres, una mayúscula y un número." {...bind('nueva')} />
        <PasswordField label="Confirmar nueva contraseña" {...bind('confirm')} />
      </div>
      <div className="form-actions"><button type="submit" className="btn btn-secondary">Actualizar contraseña</button></div>
    </form>
  );
}
