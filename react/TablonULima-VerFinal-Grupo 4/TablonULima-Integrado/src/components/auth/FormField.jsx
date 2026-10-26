// Campo de formulario: etiqueta + control + ayuda + error. Pasa `options` para un <select>,
// `children` para un control personalizado, o cualquier prop de <input>.
export default function FormField({ label, name, error, hint, options, placeholder, children, ...inputProps }) {
  const cls = error ? 'is-invalid' : '';
  let control = children;
  if (!control && options) {
    control = (
      <select id={name} name={name} className={cls} {...inputProps}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    );
  } else if (!control) {
    control = <input id={name} name={name} className={cls} placeholder={placeholder} {...inputProps} />;
  }
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {control}
      {hint && <span className="hint">{hint}</span>}
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
