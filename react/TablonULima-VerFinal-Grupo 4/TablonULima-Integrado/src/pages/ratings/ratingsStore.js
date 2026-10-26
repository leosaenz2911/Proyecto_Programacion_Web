// Estado compartido de Calificaciones. Vive fuera de React para que, al ir a Ofertas o Acuerdos y volver,
// las calificaciones publicadas se conserven (igual que Ofertas y Acuerdos, se reinicia al recargar la página).
import { useSyncExternalStore } from 'react';
import { DATOS_ROSA, DATOS_VACIOS, ROSA_ID } from './ratingsData';

let state = {};
const listeners = new Set();
const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };
const getState = () => state;

const datosDe = userId => state[userId] || (userId === ROSA_ID ? DATOS_ROSA : DATOS_VACIOS);

export function actualizar(userId, fn) {
  state = { ...state, [userId]: fn(datosDe(userId)) };
  listeners.forEach(l => l());
}

export function useRatings(userId) {
  const snapshot = useSyncExternalStore(subscribe, getState);
  return snapshot[userId] || (userId === ROSA_ID ? DATOS_ROSA : DATOS_VACIOS);
}
