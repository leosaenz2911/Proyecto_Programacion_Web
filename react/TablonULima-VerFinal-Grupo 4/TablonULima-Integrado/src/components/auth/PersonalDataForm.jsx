import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { nameRule, phoneRule } from '../../utils/validators';
import FormField from './FormField';
import LocationPicker from './LocationPicker';

const rules = { nombres: nameRule('nombres'), apellidos: nameRule('apellidos'), telefono: phoneRule };
const toValues = u => ({
  nombres: u.nombres, apellidos: u.apellidos, telefono: u.telefono, puntoEncuentroPreferido: u.puntoEncuentroPreferido
});

export default function PersonalDataForm() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const form = useForm(toValues(user), rules);
  const { values, errors, handleChange, handleBlur } = form;

  const handleSubmit = e => {
    e.preventDefault();
    if (form.validateAll()) return showToast('No pudimos guardar. Revisa los campos marcados.', 'error');
    const patch = {
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      telefono: values.telefono.trim(),
      puntoEncuentroPreferido: values.puntoEncuentroPreferido
    };
    updateProfile(patch);
    form.reset(patch);
    showToast('Los cambios de tu cuenta se guardaron correctamente.');
  };

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <div className="card">
        <h2>Datos personales</h2>
        <div className="row2">
          <FormField label="Nombres" name="nombres" value={values.nombres} onChange={handleChange} onBlur={handleBlur} error={errors.nombres} />
          <FormField label="Apellidos" name="apellidos" value={values.apellidos} onChange={handleChange} onBlur={handleBlur} error={errors.apellidos} />
        </div>
        <div className="row2">
          <FormField label="Correo institucional" name="correo" type="email" value={user.correo} readOnly hint="No editable." />
          <FormField label="Teléfono de contacto" name="telefono" type="tel" placeholder="987 654 321"
            hint="Solo se comparte al cerrarse un acuerdo."
            value={values.telefono} onChange={handleChange} onBlur={handleBlur} error={errors.telefono} />
        </div>
      </div>
      <div className="card">
        <h2>Punto de encuentro preferido</h2>
        <p className="hint">Se propondrá por defecto al coordinar tus entregas.</p>
        <LocationPicker value={values.puntoEncuentroPreferido} onChange={v => form.setValue('puntoEncuentroPreferido', v)} />
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => form.reset(toValues(user))}>Descartar</button>
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </div>
      </div>
    </form>
  );
}
