import { useState } from 'react';

// rules: { campo: (valor, valores) => 'mensaje de error' | '' }
export default function useForm(initial, rules) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const validateField = (name, vals = values) => {
    const rule = rules[name];
    const msg = rule ? rule(vals[name], vals) : '';
    setErrors(prev => ({ ...prev, [name]: msg }));
    return !msg;
  };

  // Valida todos los campos a la vez para marcar cada error. Devuelve la cantidad de errores.
  const validateAll = () => {
    const result = {};
    let count = 0;
    Object.keys(rules).forEach(name => {
      const msg = rules[name](values[name], values);
      result[name] = msg;
      if (msg) count += 1;
    });
    setErrors(result);
    return count;
  };

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    const next = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(next);
    if (errors[name]) validateField(name, next);   // si ya tenía error, revalida al escribir
  };

  const handleBlur = e => {
    if (e.target.type !== 'checkbox') validateField(e.target.name);
  };

  const setValue = (name, value) => setValues(prev => ({ ...prev, [name]: value }));
  const setFieldError = (name, msg) => setErrors(prev => ({ ...prev, [name]: msg }));
  const reset = (next = initial) => {
    setValues(next);
    setErrors({});
  };

  return { values, errors, handleChange, handleBlur, validateAll, setValue, setFieldError, reset };
}
