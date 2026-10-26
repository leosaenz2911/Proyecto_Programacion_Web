// Cada regla recibe (valor, valoresDelFormulario) y devuelve '' si es válida o el mensaje de error.
export const EMAIL_RE = /^[^\s@]+@aloe\.ulima\.edu\.pe$/i;
export const PASS_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
export const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+([ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

export const required = v => (v ? '' : 'Este campo es obligatorio.');
export const nameRule = label => v => (NAME_RE.test(v.trim()) ? '' : `Ingresa tus ${label} (solo letras).`);
export const emailRule = v => (EMAIL_RE.test(v.trim()) ? '' : 'El correo debe terminar en @aloe.ulima.edu.pe.');
export const passRule = v => (PASS_RE.test(v) ? '' : 'Mínimo 8 caracteres, una mayúscula y un número.');
export const matchRule = otherName => (v, values) => (v === values[otherName] ? '' : 'Las contraseñas no coinciden.');
export const termsRule = v => (v ? '' : 'Debes aceptar las normas para continuar.');
export const phoneRule = v =>
  !v.trim() || /^9\d{8}$/.test(v.replace(/\s/g, '')) ? '' : 'Ingresa un celular de 9 dígitos que empiece con 9.';
