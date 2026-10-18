export const HOME_BY_ROLE = { USUARIO: '/catalogo', ADMINISTRADOR: '/admin' };

export const CARRERAS = [
  'Administración', 'Arquitectura', 'Comunicación', 'Contabilidad', 'Derecho', 'Economía',
  'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería de Sistemas', 'Marketing', 'Psicología'
];

export const CICLOS = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'];

export const PUNTOS_ENCUENTRO = [
  'Biblioteca', 'Puerta 1', 'Cafetería del pabellón E', 'Explanada central', 'Patio del pabellón H'
];

export const TABS = {
  USUARIO: [
    { label: 'Catálogo', to: '/catalogo' },
    { label: 'Mis publicaciones' },
    { label: 'Favoritos' },
    { label: 'Ofertas' },
    { label: 'Acuerdos' },
    { label: 'Calificaciones' },
    { label: 'Mi cuenta', to: '/mi-cuenta' }
  ],
  ADMINISTRADOR: [
    { label: 'Reportes', to: '/admin' },
    { label: 'Usuarios' },
    { label: 'Tablero de métricas' },
    { label: 'Categorías y cursos' },
    { label: 'Normas del tablón' }
  ]
};
