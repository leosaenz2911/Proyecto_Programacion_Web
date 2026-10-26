// Capa de datos simulada (localStorage). En la 2.ª entrega se reemplaza por llamadas a la API.
const USERS_KEY = 'tablon_users';
const SESSION_KEY = 'tablon_session';

const SEED_USERS = [
  { id: 'USR-001', nombres: 'Rosa María', apellidos: 'Quispe Ríos', correo: '20201234@aloe.ulima.edu.pe', password: 'Rosa1234',
    carrera: 'Administración', ciclo: 'Cuarto', telefono: '987 654 321', puntoEncuentroPreferido: 'Biblioteca', rol: 'USUARIO', bloqueado: false },
  { id: 'USR-900', nombres: 'Julio', apellidos: 'Mendoza', correo: '20150001@aloe.ulima.edu.pe', password: 'Admin1234',
    carrera: 'Ingeniería de Sistemas', ciclo: 'Décimo', telefono: '', puntoEncuentroPreferido: 'Biblioteca', rol: 'ADMINISTRADOR', bloqueado: false },
  { id: 'USR-050', nombres: 'Marco Antonio', apellidos: 'Loayza Pinto', correo: '20189922@aloe.ulima.edu.pe', password: 'Marco1234',
    carrera: 'Comunicación', ciclo: 'Octavo', telefono: '', puntoEncuentroPreferido: 'Puerta 1', rol: 'USUARIO', bloqueado: true }
];

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUsers() {
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || 'null');
  if (!users) {
    users = SEED_USERS;
    saveUsers(users);
  }
  return users;
}

export function findByEmail(email) {
  const e = email.trim().toLowerCase();
  return getUsers().find(u => u.correo.toLowerCase() === e);
}

export function findById(id) {
  return getUsers().find(u => u.id === id);
}

export function createUser(data) {
  const user = {
    id: 'USR-' + Date.now(),
    nombres: data.nombres.trim(),
    apellidos: data.apellidos.trim(),
    correo: data.correo.trim().toLowerCase(),
    password: data.password,          // simulado: en la 2.ª entrega se almacena cifrada en el servidor
    carrera: data.carrera,
    ciclo: data.ciclo,
    telefono: '',
    puntoEncuentroPreferido: 'Biblioteca',
    rol: 'USUARIO',
    bloqueado: false
  };
  saveUsers([...getUsers(), user]);
  return user;
}

export function updateUser(user) {
  saveUsers(getUsers().map(u => (u.id === user.id ? user : u)));
  return user;
}

export const getSessionId = () => localStorage.getItem(SESSION_KEY);
export const setSessionId = id => localStorage.setItem(SESSION_KEY, id);
export const clearSession = () => localStorage.removeItem(SESSION_KEY);
