import { PERFILES } from './ratingsData';

export const iniciales = nombre => nombre.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
export const primerNombre = nombre => nombre.split(' ')[0];

export function Estrellas({ valor, grande = false }) {
  const n = Math.round(valor);
  return (
    <span className={`hu6-stars${grande ? ' hu6-stars-lg' : ''}`} aria-label={`${valor} de 5 estrellas`}>
      {'★'.repeat(n)}<span className="hu6-stars-off">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export const Miniatura = ({ src, alt = '', size = 64 }) => (
  <img className="hu6-thumb" src={src} alt={alt} style={{ width: size, height: size }}
    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/logo_ulima.png'; }} />
);

export const Avatar = ({ nombre, size = 28 }) => (
  <span className="hu6-avatar" style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) }}>{iniciales(nombre)}</span>
);

// Datos de presentación de la persona a la que se califica o que califica.
export function infoPersona(id, nombre) {
  const p = PERFILES[id];
  return p ? { ...p } : { nombre, carrera: 'Estudiante de la Universidad de Lima', ciclo: null, desde: null, rating: 0, total: 0, acuerdos: 0 };
}
