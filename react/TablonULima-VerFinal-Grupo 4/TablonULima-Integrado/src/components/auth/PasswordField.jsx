import { useState } from 'react';
import FormField from './FormField';

// toggle=true agrega el botón Mostrar/Ocultar (como en el login).
export default function PasswordField({ label, name, error, hint, toggle = false, ...inputProps }) {
  const [show, setShow] = useState(false);
  const cls = error ? 'is-invalid' : '';
  const input = (
    <input id={name} name={name} className={cls} type={toggle && show ? 'text' : 'password'} placeholder="••••••••••" {...inputProps} />
  );
  return (
    <FormField label={label} name={name} error={error} hint={hint}>
      {toggle ? (
        <div className="pass-wrap">
          {input}
          <button type="button" className="pass-toggle" onClick={() => setShow(s => !s)}>{show ? 'Ocultar' : 'Mostrar'}</button>
        </div>
      ) : input}
    </FormField>
  );
}
