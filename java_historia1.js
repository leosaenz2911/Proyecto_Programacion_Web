// ===== DATOS SIMULADOS (front) — en la 2.ª entrega pasan a la API/BD =====
const USERS_KEY = 'tablon_users', SESSION_KEY = 'tablon_session';
const SEED_USERS = [
  { id: 'USR-001', nombres: 'Rosa María', apellidos: 'Quispe Ríos', correo: '20201234@aloe.ulima.edu.pe', password: 'Rosa1234',
    carrera: 'Administración', ciclo: 'Cuarto', telefono: '987 654 321', puntoEncuentroPreferido: 'Biblioteca', rol: 'USUARIO', bloqueado: false },
  { id: 'USR-900', nombres: 'Julio', apellidos: 'Mendoza', correo: '20150001@aloe.ulima.edu.pe', password: 'Admin1234',
    carrera: 'Ingeniería de Sistemas', ciclo: 'Décimo', telefono: '', puntoEncuentroPreferido: 'Biblioteca', rol: 'ADMINISTRADOR', bloqueado: false },
  { id: 'USR-050', nombres: 'Marco Antonio', apellidos: 'Loayza Pinto', correo: '20189922@aloe.ulima.edu.pe', password: 'Marco1234',
    carrera: 'Comunicación', ciclo: 'Octavo', telefono: '', puntoEncuentroPreferido: 'Puerta 1', rol: 'USUARIO', bloqueado: true }
];

const state = { currentUser: null, pendingView: null, recoveryEmail: null };

const $ = id => document.getElementById(id);
const EMAIL_RE = /^[^\s@]+@aloe\.ulima\.edu\.pe$/i;
const PASS_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+([ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

// ===== RUTAS Y CONTROL DE ACCESO POR ROL =====
const HOME_BY_ROLE = { USUARIO: 'catalogView', ADMINISTRADOR: 'adminView' };
const ROUTES = {
  landingView: {}, catalogView: {}, deniedView: {},
  loginView: { guestOnly: true }, registerView: { guestOnly: true }, recoverView: { guestOnly: true },
  profileView: { roles: ['USUARIO', 'ADMINISTRADOR'] },
  // HU2: vistas de publicaciones reservadas al usuario autenticado
  misPublicacionesView: { roles: ['USUARIO'] },
  nuevoAvisoView: { roles: ['USUARIO'] },
  fotosAvisoView: { roles: ['USUARIO'] },
  adminView: { roles: ['ADMINISTRADOR'] }
};

function showView(viewId) {
  const route = ROUTES[viewId] || {};
  const user = state.currentUser;

  if (route.guestOnly && user) {
    viewId = HOME_BY_ROLE[user.rol];
  } else if (route.roles) {
    if (!user) {
      state.pendingView = viewId;            // vuelve aquí después de iniciar sesión
      showToast('Inicia sesión para continuar.', 'error');
      viewId = 'loginView';
    } else if (!route.roles.includes(user.rol)) {
      $('deniedMsg').textContent = 'Tu cuenta de ' + user.rol.toLowerCase() +
        ' no tiene permisos sobre esta sección, que es exclusiva del administrador del tablón. ' +
        'Si crees que se trata de un error, escribe a tablon@ulima.edu.pe.';
      viewId = 'deniedView';
    }
  }

  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  $(viewId).classList.add('active');
  renderTabs(viewId);
  if (viewId === 'profileView') fillProfile();
  // HU2: mantener contadores y filtros al volver a Mis publicaciones.
  if (viewId === 'misPublicacionesView') {
    actualizarContadoresMisPub();
    aplicarFiltroPublicaciones();
  }
  $('loginError').style.display = 'none';
  $('regAlert').style.display = 'none';
  window.scrollTo(0, 0);
}

function goHome() {
  showView(state.currentUser ? HOME_BY_ROLE[state.currentUser.rol] : 'landingView');
}

// ===== PERSISTENCIA =====
function loadUsers() {
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || 'null');
  if (!users) { users = SEED_USERS; saveUsers(users); }
  return users;
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function findUser(email) {
  return loadUsers().find(u => u.correo.toLowerCase() === email.trim().toLowerCase());
}
function persistUser(user) {
  const users = loadUsers();
  users[users.findIndex(u => u.id === user.id)] = user;
  saveUsers(users);
}

// ===== VALIDACIONES (una regla por campo; se usan en línea y al enviar) =====
const required = v => (v ? '' : 'Este campo es obligatorio.');
const nameRule = label => v => NAME_RE.test(v.trim()) ? '' : `Ingresa tus ${label} (solo letras).`;
const passRule = v => PASS_RE.test(v) ? '' : 'Mínimo 8 caracteres, una mayúscula y un número.';
const matchRule = otherId => v => v === $(otherId).value ? '' : 'Las contraseñas no coinciden.';
const emailRule = v => EMAIL_RE.test(v.trim()) ? '' : 'El correo debe terminar en @aloe.ulima.edu.pe.';

const rules = {
  loginEmail: emailRule,
  loginPassword: required,
  regNombres: nameRule('nombres'),
  regApellidos: nameRule('apellidos'),
  regEmail: v => emailRule(v) || (findUser(v) ? 'Ya existe una cuenta con este correo.' : ''),
  regPassword: passRule,
  regConfirm: matchRule('regPassword'),
  regCarrera: required,
  regCiclo: required,
  regTerms: v => v ? '' : 'Debes aceptar las normas para continuar.',
  recEmail: emailRule,
  newPass: passRule,
  newPassConfirm: matchRule('newPass'),
  profileNombres: nameRule('nombres'),
  profileApellidos: nameRule('apellidos'),
  profilePhone: v => !v.trim() || /^9\d{8}$/.test(v.replace(/\s/g, '')) ? '' : 'Ingresa un celular de 9 dígitos que empiece con 9.',
  pwdCurrent: required,
  pwdNew: passRule,
  pwdConfirm: matchRule('pwdNew')
};

function setError(id, msg) {
  const el = $(id);
  el.classList.toggle('is-invalid', !!msg);
  const span = $(id + 'Error');
  if (span) span.textContent = msg;
}
function check(id) {
  const el = $(id);
  const msg = rules[id](el.type === 'checkbox' ? el.checked : el.value);
  setError(id, msg);
  return !msg;
}
function validateForm(ids) { return ids.map(check).every(Boolean); }   // corre todas para marcar todos los errores
function clearErrors(scopeId) {
  document.querySelectorAll('#' + scopeId + ' .error-msg').forEach(s => s.textContent = '');
  document.querySelectorAll('#' + scopeId + ' .is-invalid').forEach(i => i.classList.remove('is-invalid'));
}

// ===== NOTIFICACIONES =====
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  $('toastArea').appendChild(t);
  setTimeout(() => t.remove(), 3800);
}
function togglePassword(id, btn) {
  const input = $(id);
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar';
}

// ===== REGISTRO =====
function handleRegister(e) {
  e.preventDefault();
  const ids = ['regNombres', 'regApellidos', 'regEmail', 'regPassword', 'regConfirm', 'regCarrera', 'regCiclo', 'regTerms'];
  const nErr = ids.filter(id => !check(id)).length;   // valida todos para marcar cada error
  if (nErr) {
    const box = $('regAlert');
    box.innerHTML = `<b>Revisa ${nErr} campo${nErr > 1 ? 's' : ''}.</b> Corrige lo marcado en rojo para continuar.`;
    box.style.display = 'block';
    return;
  }
  $('regAlert').style.display = 'none';

  const users = loadUsers();
  users.push({
    id: 'USR-' + Date.now(),
    nombres: $('regNombres').value.trim(),
    apellidos: $('regApellidos').value.trim(),
    correo: $('regEmail').value.trim().toLowerCase(),
    password: $('regPassword').value,            // simulado: en la 2.ª entrega se almacena cifrada en el servidor
    carrera: $('regCarrera').value,
    ciclo: $('regCiclo').value,
    telefono: '',
    puntoEncuentroPreferido: 'Biblioteca',
    rol: 'USUARIO',
    bloqueado: false
  });
  saveUsers(users);

  const email = $('regEmail').value.trim();
  $('registerForm').reset();
  clearErrors('registerForm');
  showToast('Cuenta creada. Ya puedes iniciar sesión.');
  showView('loginView');
  $('loginEmail').value = email;
}

// ===== LOGIN / LOGOUT =====
function loginFail(msg) {
  const box = $('loginError');
  box.textContent = msg;
  box.style.display = 'block';
}

function handleLogin(e) {
  e.preventDefault();
  $('loginError').style.display = 'none';
  if (!validateForm(['loginEmail', 'loginPassword'])) return;

  const user = findUser($('loginEmail').value);
  if (!user || user.password !== $('loginPassword').value) {
    return loginFail('No pudimos ingresar. El correo o la contraseña no coinciden.');
  }
  if (user.bloqueado) {
    return loginFail('Tu cuenta está bloqueada. Escribe a tablon@ulima.edu.pe.');
  }
  startSession(user);
  $('loginForm').reset();
}

function startSession(user) {
  state.currentUser = user;
  localStorage.setItem(SESSION_KEY, user.id);
  updateUI();
  showToast('Sesión iniciada.');
  const dest = state.pendingView || HOME_BY_ROLE[user.rol];   // redirección según rol
  state.pendingView = null;
  showView(dest);
}

function logout() {
  state.currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  updateUI();
  showToast('Cerraste sesión.');
  showView('landingView');
}

const TABS = {
  USUARIO: [['Catálogo', 'catalogView'], ['Mis publicaciones', 'misPublicacionesView'], ['Favoritos'], ['Ofertas'], ['Acuerdos'], ['Calificaciones'], ['Mi cuenta', 'profileView']],
  ADMINISTRADOR: [['Reportes', 'adminView'], ['Usuarios'], ['Tablero de métricas'], ['Categorías y cursos'], ['Normas del tablón']]
};

function goTab(view) {
  if (view) showView(view);
  else showToast('Esta vista pertenece a otra historia del grupo.', 'info');
}

function renderTabs(activeView) {
  const user = state.currentUser, nav = $('navTabs');
  nav.style.display = user ? 'flex' : 'none';
  if (!user) return;
  nav.className = 'tabs' + (user.rol === 'ADMINISTRADOR' ? ' admin' : '');
  // HU2: la pestaña permanece activa también al abrir Nuevo aviso o Fotografías.
  const tabActiva = ['nuevoAvisoView', 'fotosAvisoView'].includes(activeView)
    ? 'misPublicacionesView' : activeView;
  nav.innerHTML = TABS[user.rol].map(([label, view]) =>
    `<a class="${view === tabActiva ? 'active' : ''}" onclick="goTab(${view ? "'" + view + "'" : ''})">${label}</a>`).join('');
}

function setLocation(place) {
  $('profileLocation').value = place;
  document.querySelectorAll('#locChips .chip').forEach(c => c.classList.toggle('active', c.textContent === place));
}

function updateUI() {
  const user = state.currentUser;
  const badge = $('userRoleBadge');
  badge.textContent = user ? user.rol : 'VISITANTE';
  badge.className = 'role-badge role-' + (user ? user.rol.toLowerCase() : 'visitante');
  $('navAuthButtons').style.display = user ? 'none' : 'flex';
  $('navUserMenu').style.display = user ? 'flex' : 'none';
  $('navPublic').style.display = user ? 'none' : '';
  $('navSearch').style.display = user && user.rol === 'USUARIO' ? 'block' : 'none';
  // HU2: respetar la visibilidad del botón Publicar aviso según la sesión.
  actualizarBotonPublicarAviso();
  if (user) {
    $('navUserName').textContent = user.nombres.split(' ')[0] + ' ' + user.apellidos.split(' ')[0];
    renderAvatars();
  }
}

// ===== FOTO DE PERFIL =====
const MAX_AVATAR_MB = 2;

function paintAvatar(el, user, textEl) {
  const target = textEl || el;
  if (user.foto) {
    el.style.backgroundImage = `url(${user.foto})`;
    el.classList.add('has-photo');
    target.textContent = '';
  } else {
    el.style.backgroundImage = '';
    el.classList.remove('has-photo');
    target.textContent = (user.nombres[0] + user.apellidos[0]).toUpperCase();
  }
}

function renderAvatars() {
  const u = state.currentUser;
  if (!u) return;
  paintAvatar($('profileAvatar'), u, $('profileAvatarText'));
  paintAvatar($('navAvatar'), u);
  $('avatarRemoveBtn').style.display = u.foto ? 'inline-flex' : 'none';
}

function handleAvatarChange(e) {
  const file = e.target.files[0];
  e.target.value = '';                       // permite volver a elegir el mismo archivo
  if (!file) return;
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
    return showToast('Elige una imagen PNG, JPG o WEBP.', 'error');
  }
  if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
    return showToast(`La imagen no debe superar ${MAX_AVATAR_MB} MB.`, 'error');
  }
  const reader = new FileReader();
  reader.onload = () => resizeImage(reader.result, 256, dataUrl => {
    const u = state.currentUser;
    u.foto = dataUrl;
    persistUser(u);
    renderAvatars();
    showToast('Foto de perfil actualizada.');
  });
  reader.readAsDataURL(file);
}

// Recorta la imagen a un cuadrado y la reduce, para no llenar el límite de localStorage
function resizeImage(src, size, cb) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const s = Math.min(img.width, img.height);
    canvas.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
    cb(canvas.toDataURL('image/jpeg', 0.85));
  };
  img.src = src;
}

function removeAvatar() {
  const u = state.currentUser;
  delete u.foto;
  persistUser(u);
  renderAvatars();
  showToast('Foto eliminada.');
}

// ===== MI CUENTA =====
function fillProfile() {
  const u = state.currentUser;
  if (!u) return;
  clearErrors('profileView');
  $('profileName').textContent = `${u.nombres} ${u.apellidos}`;
  $('profileDetail').textContent = `${u.nombres} ${u.apellidos} · ${u.carrera}, ${u.ciclo.toLowerCase()} ciclo`;
  $('profileNombres').value = u.nombres;
  $('profileApellidos').value = u.apellidos;
  $('profileEmail').value = u.correo;
  $('profilePhone').value = u.telefono;
  setLocation(u.puntoEncuentroPreferido);
  $('passwordForm').reset();
  renderAvatars();
}

function handleUpdateProfile(e) {
  e.preventDefault();
  if (!state.currentUser) return;
  if (!validateForm(['profileNombres', 'profileApellidos', 'profilePhone'])) {
    showToast('No pudimos guardar. Revisa los campos marcados.', 'error');
    return;
  }
  const u = state.currentUser;
  u.nombres = $('profileNombres').value.trim();
  u.apellidos = $('profileApellidos').value.trim();
  u.telefono = $('profilePhone').value.trim();
  u.puntoEncuentroPreferido = $('profileLocation').value;
  persistUser(u);
  fillProfile();
  updateUI();
  showToast('Los cambios de tu cuenta se guardaron correctamente.');
}

function handleChangePassword(e) {
  e.preventDefault();
  if (!validateForm(['pwdCurrent', 'pwdNew', 'pwdConfirm'])) return;
  const u = state.currentUser;
  if ($('pwdCurrent').value !== u.password) { setError('pwdCurrent', 'La contraseña actual no es correcta.'); return; }
  if ($('pwdNew').value === u.password) { setError('pwdNew', 'La nueva contraseña debe ser distinta de la actual.'); return; }
  u.password = $('pwdNew').value;
  persistUser(u);
  $('passwordForm').reset();
  clearErrors('passwordForm');
  showToast('Contraseña actualizada.');
}

// ===== RECUPERAR CONTRASEÑA (3 pasos) =====
function startRecovery() {
  $('recoverStep1').reset();
  clearErrors('recoverStep1');
  goRecoverStep(1);
  showView('recoverView');
}

function goRecoverStep(n) {
  ['recoverStep1', 'recoverStep2', 'recoverStep3'].forEach((id, i) => {
    $(id).style.display = i + 1 === n ? 'block' : 'none';
    $('stepBar' + (i + 1)).classList.toggle('active', i + 1 <= n);
  });
}

function handleRecoverEmail(e) {
  e.preventDefault();
  if (!check('recEmail')) return;
  state.recoveryEmail = $('recEmail').value.trim().toLowerCase();
  $('recSentTo').textContent = state.recoveryEmail;   // mensaje neutro: no revela si la cuenta existe
  goRecoverStep(2);
}

function openRecoveryLink() {
  $('recoverStep3').reset();
  clearErrors('recoverStep3');
  goRecoverStep(3);
}

function handleNewPassword(e) {
  e.preventDefault();
  if (!validateForm(['newPass', 'newPassConfirm'])) return;
  const user = findUser(state.recoveryEmail || '');
  if (user) { user.password = $('newPass').value; persistUser(user); }
  state.recoveryEmail = null;
  showToast('Listo. Ya puedes iniciar sesión con tu nueva contraseña.');
  showView('loginView');
}

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', () => {
  // validación en línea: al salir del campo, y al escribir si ya tiene error
  Object.keys(rules).forEach(id => {
    const el = $(id);
    el.addEventListener('blur', () => check(id));
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (el.classList.contains('is-invalid')) check(id); });
  });

  // restaurar sesión
  const saved = localStorage.getItem(SESSION_KEY);
  const user = saved && loadUsers().find(u => u.id === saved && !u.bloqueado);
  if (user) state.currentUser = user; else localStorage.removeItem(SESSION_KEY);
  updateUI();
  goRecoverStep(1);
  goHome();
});

// ===== HU2: Persistencia local de avisos (prototipo sin servidor) =====
// Los avisos añadidos se guardan por propietario; nunca sobrescriben las cuentas de HU1.
const HU2_STORAGE_KEY = 'tablon_hu2_avisos';
let hu2AvisoEnEdicion = null;

function leerAvisosHu2() {
  try { return JSON.parse(localStorage.getItem(HU2_STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function guardarAvisosHu2(avisos) {
  try { localStorage.setItem(HU2_STORAGE_KEY, JSON.stringify(avisos)); return true; }
  catch { showToast('No se pudo guardar en este navegador: almacenamiento lleno.', 'error'); return false; }
}

// Se crean nodos de texto (no HTML desde el usuario) para evitar inyección de contenido.
function crearFilaHu2(aviso) {
  const tr = document.createElement('tr');
  tr.dataset.propietario = aviso.propietario;
  tr.dataset.estado = aviso.estado;
  tr.dataset.hu2Id = aviso.id;
  const td = () => { const x = document.createElement('td'); tr.appendChild(x); return x; };
  const fotoCelda = td();
  const foto = document.createElement('div'); foto.className = 'foto-para-imagen';
  fotoCelda.appendChild(foto);
  const datos = td();
  const nombre = document.createElement('span'); nombre.className = 'Titulo-aviso'; nombre.textContent = aviso.titulo || 'Aviso sin título';
  const meta = document.createElement('span'); meta.className = 'aviso-meta';
  meta.textContent = [aviso.categoria, aviso.curso, aviso.condicion].filter(Boolean).join(' · ');
  datos.append(nombre, meta);
  const precio = td(); precio.className = 'celda-precio';
  precio.textContent = Number.isFinite(Number(aviso.precio)) && aviso.precio !== ''
    ? `S/ ${Number(aviso.precio).toFixed(2)}` : '—';
  const estadoCelda = td(); const badge = document.createElement('span'); badge.className = 'badge ' + ESTADOS_AVISO[aviso.estado].badge;
  badge.textContent = ESTADOS_AVISO[aviso.estado].texto; estadoCelda.appendChild(badge);
  const ofertas = td(); ofertas.className = 'celda-ofertas'; ofertas.textContent = aviso.estado === 'vendido' ? 'Cerrado' : 'Sin ofertas';
  const fecha = td(); fecha.className = 'Celda-Fecha'; fecha.textContent = aviso.estado === 'borrador' ? 'Sin publicar' : aviso.fecha;
  const acciones = td(); const boton = document.createElement('button'); boton.type = 'button';
  boton.className = 'Boton-para-acciones-tabla'; boton.textContent = 'Acciones ▾'; acciones.appendChild(boton);
  if (aviso.estado === 'pausado') tr.classList.add('fila-resaltada');
  return tr;
}

// Se restauran los avisos en cada carga de página sin tocar las 6 filas de demostración.
function restaurarAvisosHu2() {
  const tbody = $('misPubTbody');
  tbody.querySelectorAll('tr[data-hu2-id]').forEach(f => f.remove());
  leerAvisosHu2().forEach(aviso => {
    if (ESTADOS_AVISO[aviso.estado]) tbody.appendChild(crearFilaHu2(aviso));
  });
}

function guardarFormularioComoAviso(estado) {
  const u = state.currentUser;
  if (!u || u.rol !== 'USUARIO') return;
  const lista = leerAvisosHu2();
  const id = hu2AvisoEnEdicion || `AV-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
  const aviso = {
    id, propietario: u.id, estado,
    titulo: $('nuevoTitulo').value.trim(), descripcion: $('nuevoDescripcion').value.trim(),
    categoria: $('nuevoCategoria').value, curso: $('nuevoCurso').value,
    condicion: document.querySelector('#condicionesAviso .chip-active')?.textContent.trim() || '',
    precio: $('nuevoPrecio').value.trim(), minimo: $('nuevoMinimo').value.trim(),
    fecha: fechaHoy()
  };
  const idx = lista.findIndex(a => a.id === id);
  if (idx >= 0) lista[idx] = aviso; else lista.push(aviso);
  if (!guardarAvisosHu2(lista)) return;
  hu2AvisoEnEdicion = null;
  restaurarAvisosHu2();
  // Se limpian los datos temporales del formulario antes de crear otro aviso.
  validacionAvisoVisible = false;
  camposAvisoTocados.clear();
  state.fotosAviso = [];
  fotosAviso = [];
  renderFotos();
  // HU2: al comenzar otro aviso, no conservar bordes/mensajes rojos anteriores.
  document.querySelectorAll('#nuevoAvisoView .campo-error').forEach(e => e.classList.remove('campo-error'));
  $('seccionFotosNuevoAviso').classList.remove('seccion-con-error');
  CAMPOS_NUEVO_AVISO.forEach(([id, mensajeId]) => mostrarErrorNuevoAviso(id, mensajeId, ''));
  $('nuevoTitulo').value = ''; $('nuevoDescripcion').value = '';
  $('nuevoCategoria').value = ''; $('nuevoCurso').selectedIndex = 0;
  $('nuevoPrecio').value = ''; $('nuevoMinimo').value = '';
  document.querySelectorAll('#condicionesAviso .chip').forEach(c => c.classList.remove('chip-active'));
  $('errorPublicarAviso').style.display = 'none';
  $('camposCorregirAviso').hidden = true;
  $('notaBorradorAviso').hidden = true;
  $('cancelarNuevoAviso').hidden = false;
  $('btnPublicarNuevoAviso').disabled = false;
  sincronizarFotosNuevoAviso();
  showView('misPublicacionesView');
  showToast(estado === 'borrador' ? 'Borrador guardado en este navegador.' : 'Éxito. Tu aviso se publicó correctamente.');
}

// Los avisos del usuario conservan cambios de estado y eliminación tras recargar.
function actualizarAvisoHu2EnStorage(fila, nuevoEstado) {
  if (!fila?.dataset.hu2Id) return;
  const lista = leerAvisosHu2();
  const aviso = lista.find(a => a.id === fila.dataset.hu2Id);
  if (aviso) { aviso.estado = nuevoEstado; if (nuevoEstado === 'publicado') aviso.fecha = fechaHoy(); guardarAvisosHu2(lista); }
}
function borrarAvisoHu2EnStorage(fila) {
  if (!fila?.dataset.hu2Id) return;
  guardarAvisosHu2(leerAvisosHu2().filter(a => a.id !== fila.dataset.hu2Id));
}

document.addEventListener('DOMContentLoaded', restaurarAvisosHu2);

// ===== HU2: Funciones de los apartados 2.1–2.6 =====
/*PARTE 2 : PUBLICACIONES : SEBASTIAM SOLORZANO */
// Filtro por estado de busqueda //

let misPublicacionesActivo = 'todos';
let misPubtexto = '';

// Las seis filas del mockup 2.1 pertenecen a Rosa (USR-001).
// Una nueva cuenta no debe verlas como propias: comienza en el estado 2.2.
function filasDeMisPublicaciones() {
  return [...document.querySelectorAll('#misPubTbody tr')]
    .filter(fila => fila.dataset.propietario === state.currentUser?.id);
}

function filtrarMisPublicaciones(estado) {
  misPublicacionesActivo = estado;
  document.querySelectorAll('#misPubFiltros .chip').forEach(chip => {
    chip.classList.toggle('chip-active', chip.dataset.filtro === estado);
  });
  aplicarFiltroPublicaciones();
}

function buscarMisPublicaciones(texto) {
  misPubtexto = texto.trim().toLowerCase();
  aplicarFiltroPublicaciones();
}

function verComoFuncionaTablon() {
  showView('landingView');
  document.querySelector('#landingView .steps3')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function limpiarBusquedaMisPub() {
  $('misPubBuscar').value = '';
  misPubtexto = '';
  filtrarMisPublicaciones('todos');
}

function aplicarFiltroPublicaciones() {
  const propias = filasDeMisPublicaciones();
  const todas = [...document.querySelectorAll('#misPubTbody tr')];
  let visibles = 0;

  todas.forEach(fila => {
    const propia = propias.includes(fila);
    const estadoCoincide = misPublicacionesActivo === 'todos' || fila.dataset.estado === misPublicacionesActivo;
    const titulo = fila.querySelector('.Titulo-aviso, .Titulo-aviso-alternativo')?.textContent.toLowerCase() || '';
    const textoCoincide = !misPubtexto || titulo.includes(misPubtexto);
    const mostrar = propia && estadoCoincide && textoCoincide;
    fila.style.display = mostrar ? '' : 'none';
    if (mostrar) visibles++;
  });

  const noTieneAvisos = propias.length === 0;
  $('misPubSinAvisos').style.display = noTieneAvisos ? 'flex' : 'none';
  $('misPubVacio').style.display = !noTieneAvisos && visibles === 0 ? 'block' : 'none';
  document.querySelector('#misPublicacionesView .tabla-avisos').style.display = visibles ? 'table' : 'none';
  document.querySelector('#misPublicacionesView .paginacion').style.display = visibles ? 'flex' : 'none';
  document.querySelector('#misPublicacionesView .search-inline').style.display = noTieneAvisos ? 'none' : 'block';
  $('misPubConteo').textContent = `Mostrando ${visibles} de ${propias.length} avisos`;
}

// Funcion para el boton de nuevo aviso
function abrirNuevoAviso(){
  showView('nuevoAvisoView');
}

function actualizarBotonPublicarAviso() {
  const boton = $('btnPublicarAvisoSebas');
  if (boton) boton.style.display = state.currentUser?.rol === 'USUARIO' ? 'inline-flex' : 'none';
}

// ===== 2.4: VALIDACIONES DE NUEVO AVISO =====
// Cada error tiene un mensaje (debajo del campo) y un nombre (panel lateral).
const CAMPOS_NUEVO_AVISO = [
  ['nuevoTitulo', 'errorNuevoTitulo', 'Título del aviso'],
  ['nuevoDescripcion', 'errorNuevoDescripcion', 'Descripción'],
  ['nuevoCategoria', 'errorNuevoCategoria', 'Categoría'],
  ['nuevoCurso', 'errorNuevoCurso', 'Curso asociado'],
  ['nuevoCondicion', 'errorNuevoCondicion', 'Estado del producto'],
  ['nuevoPrecio', 'errorNuevoPrecio', 'Precio pedido'],
  ['nuevoMinimo', 'errorNuevoMinimo', 'Monto mínimo'],
  ['nuevoFotos', 'errorNuevoFotos', 'Fotografías']
];
let validacionAvisoVisible = false; // La alerta general aparece al intentar publicar.
const camposAvisoTocados = new Set(); // 2.4: validar campos individuales al salir de ellos.

function validarDatosNuevoAviso() {
  const titulo = $('nuevoTitulo').value.trim();
  const descripcion = $('nuevoDescripcion').value.trim();
  const precioTexto = $('nuevoPrecio').value.trim();
  const minimoTexto = $('nuevoMinimo').value.trim();
  const precio = Number(precioTexto);
  const minimo = Number(minimoTexto);
  const fotosReales = (state.fotosAviso || []).filter(f => !!f.src);
  const err = {};

  // 2.4: Validaciones del mockup (título, categoría, monto mínimo y foto).
  if (titulo.length < 15) err.nuevoTitulo = 'El título debe tener al menos 15 caracteres e incluir autor o modelo.';
  if (!descripcion) err.nuevoDescripcion = 'Ingresa una descripción del producto.';
  if (!$('nuevoCategoria').value) err.nuevoCategoria = 'Este campo es obligatorio.';
  if (!$('nuevoCurso').value) err.nuevoCurso = 'Selecciona un curso asociado.';
  if (!document.querySelector('#condicionesAviso .chip-active')) err.nuevoCondicion = 'Selecciona el estado del producto.';
  if (!precioTexto || !Number.isFinite(precio) || precio <= 0) err.nuevoPrecio = 'Ingresa un precio mayor que cero.';
  if (!minimoTexto || !Number.isFinite(minimo) || minimo < 0) err.nuevoMinimo = 'Ingresa un monto mínimo válido.';
  else if (precioTexto && precio > 0 && minimo > precio) err.nuevoMinimo = 'El mínimo no puede ser mayor que el precio pedido.';
  if (fotosReales.length === 0) err.nuevoFotos = 'Necesitas al menos una fotografía para publicar.';
  return err;
}

function mostrarErrorNuevoAviso(id, spanId, mensaje) {
  const input = $(id);
  const mensajeNodo = $(spanId);
  let marco = id === 'nuevoMinimo' ? $('contenedorMinimo') : input;
  if (id === 'nuevoPrecio') marco = $('nuevoPrecio').closest('.input-precio');
  if (id === 'nuevoFotos') marco = $('nuevoFotosZona');
  if (id === 'nuevoCondicion') marco = $('condicionesAviso');

  marco?.classList.toggle('campo-error', !!mensaje);
  if (input && input.tagName !== 'DIV') input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  if (mensajeNodo) {
    mensajeNodo.textContent = mensaje || '';
    // En fotografías, el error está dentro del recuadro y se muestra allí.
    mensajeNodo.style.display = mensaje ? 'block' : 'none';
  }
}

function actualizarVistaPreviaAviso() {
  const titulo = $('nuevoTitulo').value.trim();
  const precio = Number($('nuevoPrecio').value);
  $('previewTituloAviso').textContent = titulo || 'Título del aviso';
  $('previewPrecioAviso').textContent = Number.isFinite(precio) && precio > 0 ? `S/ ${precio.toFixed(2)}` : 'S/ 0.00';
  const elegida = document.querySelector('#condicionesAviso .chip-active')?.textContent.trim() || '';
  document.querySelector('#nuevoAvisoView .preview-meta').textContent = [elegida, $('nuevoCurso').value].filter(Boolean).join(' · ');
  $('contadorTituloAviso').textContent = `Incluye autor y edición: así lo buscan tus compañeros. ${titulo.length}/80 caracteres.`;
  const cantidad = (state.fotosAviso || []).filter(f => !!f.src).length;
  $('contadorFotosNuevoAviso').textContent = cantidad ? `${cantidad} de 6 fotografías. Arrastra las miniaturas para reordenarlas.` : 'Agrega hasta 6 fotografías para mostrar el producto.';
  $('nuevoFotosZona').hidden = cantidad > 0;
  $('galeriaNuevoAviso').hidden = cantidad === 0;
  $('previewSinFotoAviso').hidden = cantidad > 0;
}

function actualizarValidacionNuevoAviso() {
  actualizarVistaPreviaAviso();
  if (!validacionAvisoVisible) {
    // 2.4: sombreado rojo sólo para los campos ya revisados (onblur).
    const erroresLocales = validarDatosNuevoAviso();
    CAMPOS_NUEVO_AVISO.filter(([id]) => camposAvisoTocados.has(id))
      .forEach(([id, mensajeId]) => mostrarErrorNuevoAviso(id, mensajeId, erroresLocales[id]));
    return;
  }
  const errores = validarDatosNuevoAviso();
  CAMPOS_NUEVO_AVISO.forEach(([id, mensajeId]) => mostrarErrorNuevoAviso(id, mensajeId, errores[id]));

  // El mockup aplica también un borde rojo a toda la sección de fotografías.
  $('seccionFotosNuevoAviso').classList.toggle('seccion-con-error', !!errores.nuevoFotos);
  const lista = CAMPOS_NUEVO_AVISO.filter(([id]) => errores[id]);
  const n = lista.length;
  $('errorPublicarAviso').style.display = n ? 'block' : 'none';
  $('camposCorregirAviso').hidden = n === 0;
  $('consejoNuevoAviso').hidden = n > 0;
  $('notaBorradorAviso').hidden = n === 0;
  $('cancelarNuevoAviso').hidden = n > 0;
  $('btnPublicarNuevoAviso').disabled = n > 0;
  $('listaErroresAviso').replaceChildren(...lista.map(([, , etiqueta]) => {
    const li = document.createElement('li');
    li.textContent = etiqueta;
    return li;
  }));
  if (n) {
    const nombres = lista.map(([, , etiqueta]) => etiqueta.toLowerCase());
    $('resumenErroresAviso').textContent = `Revisa ${n} campo${n === 1 ? '' : 's'}: ${nombres.join(', ')}.`;
  }
}

function validarPublicacion() {
  // 2.4: Sólo al intentar publicar aparece el recuadro rojo superior.
  validacionAvisoVisible = true;
  actualizarValidacionNuevoAviso();
  if (Object.keys(validarDatosNuevoAviso()).length) {
    window.scrollTo({ top: 0, behavior: 'instant' }); // Conserva breadcrumb y título visibles.
    return;
  }
  // HU2: Publicar el aviso en el listado local del usuario (sin servidor).
  guardarFormularioComoAviso('publicado');
}

function guardarBorradorNuevoAviso() {
  // 2.4: Los datos básicos del borrador se guardan localmente incluso si hay errores.
  const clave = 'tablon_borrador_nuevo_' + (state.currentUser?.id || 'demo');
  const datos = Object.fromEntries(['nuevoTitulo','nuevoDescripcion','nuevoCategoria','nuevoCurso','nuevoPrecio','nuevoMinimo'].map(id => [id, $(id).value]));
  datos.condicion = document.querySelector('#condicionesAviso .chip-active')?.textContent.trim() || '';
  localStorage.setItem(clave, JSON.stringify(datos));
  // HU2: además del respaldo temporal, el borrador se refleja en Mis publicaciones.
  guardarFormularioComoAviso('borrador');
}

// Actualiza los errores al corregir un campo, sin interferir con otros formularios.
document.addEventListener('DOMContentLoaded', () => {
  ['nuevoTitulo','nuevoDescripcion','nuevoCategoria','nuevoCurso','nuevoPrecio','nuevoMinimo'].forEach(id => {
    const campo = $(id);
    campo.addEventListener('input', actualizarValidacionNuevoAviso);
    campo.addEventListener('change', actualizarValidacionNuevoAviso);
    campo.addEventListener('blur', () => {
      camposAvisoTocados.add(id);
      actualizarValidacionNuevoAviso();
    });
  });
  // 2.4: Importes en soles siempre con dos decimales, sin cambiar su valor numérico.
  ['nuevoPrecio', 'nuevoMinimo'].forEach(id => {
    const campo = $(id);
    const formatoSoles = () => {
      const texto = campo.value.trim();
      const importe = Number(texto);
      if (texto !== '' && Number.isFinite(importe)) campo.value = importe.toFixed(2);
    };
    formatoSoles(); // Ejemplo inicial: S/ 95.00, S/ 70.00.
    campo.addEventListener('blur', () => {
      formatoSoles(); // Ejemplo al escribir 60: S/ 60.00.
      actualizarValidacionNuevoAviso();
    });
  });
  actualizarVistaPreviaAviso();
});

function elegirCondicion(boton) {
  document.querySelectorAll('#condicionesAviso .chip')
    .forEach(c => c.classList.remove('chip-active'));
  boton.classList.add('chip-active');
  actualizarValidacionNuevoAviso(); // 2.4: borra el error al seleccionar una condición.
}


/*PARTE 2.5 : PUBLICACIONES : SEBASTIAM SOLORZANO */
// CARGA DE FOTOGRAFIAS //

const FOTOS_MAX = 6;                              // máximo de imágenes
const FOTOS_MAX_BYTES = 5 * 1024 * 1024;          // 5 MB por imagen
const FOTOS_TIPOS = ['image/jpeg', 'image/png'];  // solo JPG y PNG
const MODO_DEMO = false; // HU2: archivos reales, no miniaturas ficticias del mockup.


/*Estado . Las fotos es un objeto que posee : { id ,nombre , estado , progreso , mensajeError}*/

//estado puede ser: 'ok' | 'subiendo' | 'error'

let fotosAviso = [];
let fotoArrastradaId = null;      // id de la miniatura que se está reordenando
let fotoSeq = 0;                  // contador para generar ids únicos
const temporizadoresFotos = {};   // un setInterval por cada foto que está subiendo
 
const nuevoIdFoto = () => 'foto-' + (++fotoSeq);
 
// Las fotos "activas" son las que ocupan un cupo de las 6 (las fallidas no cuentan)
const fotosActivas = () => fotosAviso.filter(f => f.estado !== 'error');
 
// Evita que un nombre de archivo con < > se interprete como HTML
const escaparHTML = t => t.replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
 
/* ---------- 3. VALIDACIÓN DE CADA ARCHIVO ---------- */
// Devuelve el texto del error, o '' si el archivo es válido
function validarArchivoFoto(archivo) {
  if (!FOTOS_TIPOS.includes(archivo.type)) return 'Solo se admiten imágenes JPG o PNG';
  if (archivo.size > FOTOS_MAX_BYTES) return 'La imagen supera 5 MB';
  return '';
}
 
/* ---------- 4. RECIBIR ARCHIVOS (por clic o por arrastre) ---------- */
function procesarArchivos(lista) {
  let huboError = false, limite = false;
 
  Array.from(lista).forEach(archivo => {
    const foto = {
      id: nuevoIdFoto(),
      nombre: archivo.name.replace(/\.[^.]+$/, ''),   // nombre sin extensión
      src: null, progreso: 0
    };
 
    const motivo = validarArchivoFoto(archivo);
    if (motivo) {                                      // archivo inválido -> tarjeta roja
      foto.estado = 'error';
      foto.mensajeError = motivo;
      fotosAviso.push(foto);
      huboError = true;
      return;
    }
    if (fotosActivas().length >= FOTOS_MAX) { limite = true; return; }
 
    foto.src = URL.createObjectURL(archivo);           // URL temporal para previsualizar la imagen
    foto.estado = 'subiendo';
    fotosAviso.push(foto);
    simularSubida(foto);
  });
 
  if (huboError) showToast('Error. Una imagen no se pudo subir. Revísala e inténtalo otra vez.', 'error');
  if (limite) showToast('Límite alcanzado. Ya tienes 6 de 6 fotografías; elimina una para agregar otra.', 'info');
  renderFotos();
}
 
/* ---------- 5. SIMULAR LA SUBIDA (en la 2.ª entrega será la API real) ---------- */
function simularSubida(foto) {
  clearInterval(temporizadoresFotos[foto.id]);
  temporizadoresFotos[foto.id] = setInterval(() => {
    foto.progreso = Math.min(100, foto.progreso + 6 + Math.random() * 10);
    if (foto.progreso >= 100) {
      clearInterval(temporizadoresFotos[foto.id]);
      foto.estado = 'ok';
      renderFotos();                      // al terminar sí redibujamos todo
    } else {
      actualizarProgreso(foto);           // mientras sube solo tocamos la barra (sin parpadeo)
    }
  }, 150);
}
 
function actualizarProgreso(foto) {
  const tile = document.querySelector(`[data-id="${foto.id}"]`);
  if (!tile) return;
  tile.querySelector('.barra-progreso span').style.width = foto.progreso + '%';
  tile.querySelector('.subida-texto').textContent = `Subiendo ${Math.round(foto.progreso)} %`;
}
 
/* ---------- 6. DIBUJAR LAS MINIATURAS ---------- */
function htmlTile(foto, esPrincipal) {
  // a) Subiendo -> barra de progreso
  if (foto.estado === 'subiendo') {
    return `<div class="foto-tile subiendo" data-id="${foto.id}">
      <div class="barra-progreso"><span style="width:${foto.progreso}%"></span></div>
      <p class="subida-texto">Subiendo ${Math.round(foto.progreso)} %</p>
    </div>`;
  }
  // b) Error -> tarjeta roja con "Reintentar"
  if (foto.estado === 'error') {
    return `<div class="foto-tile fallida" data-id="${foto.id}">
      <span class="fallida-titulo">No se pudo subir</span>
      <span class="fallida-detalle">${escaparHTML(foto.mensajeError)}</span>
      <button type="button" class="fallida-reintentar" onclick="reintentarFoto('${foto.id}')">Reintentar</button>
    </div>`;
  }
  // c) OK -> miniatura (imagen real o rayas si es de demostración)
  const contenido = foto.src
    ? `<img src="${foto.src}" alt="${escaparHTML(foto.nombre)}">`
    : `<span class="foto-caption">${escaparHTML(foto.nombre)}</span>`;
  const accion = esPrincipal
    ? `<span class="foto-badge">Principal</span>`
    : `<button type="button" class="foto-hacer-principal" onclick="hacerPrincipal('${foto.id}')">Hacer principal</button>`;
  return `<div class="foto-tile ok${esPrincipal ? ' principal' : ''}" data-id="${foto.id}" draggable="true">
    ${contenido}${accion}
    <button type="button" class="foto-quitar" aria-label="Quitar fotografía" onclick="quitarFoto('${foto.id}')"><i class="fa-solid fa-xmark"></i></button>
  </div>`;
}
 
function renderFotos() {
  const primeraOk = fotosAviso.find(f => f.estado === 'ok');   // la primera "ok" es la portada
  const activas = fotosActivas().length;
 
  const tiles = fotosAviso.map(f => htmlTile(f, f === primeraOk)).join('');
  const botonAgregar = activas < FOTOS_MAX
    ? `<button type="button" class="foto-tile agregar" onclick="$('inputFotos').click()">
         <i class="fa-solid fa-plus"></i><span>Agregar</span></button>`
    : '';                                                       // con 6 fotos ya no se muestra
 
  $('fotosGrid').innerHTML = tiles + botonAgregar;
  $('fotosContador').textContent = `${activas} de ${FOTOS_MAX} fotografías`;
}
 
/* ---------- 7. ACCIONES SOBRE UNA MINIATURA ---------- */
function quitarFoto(id) {
  clearInterval(temporizadoresFotos[id]);
  fotosAviso = fotosAviso.filter(f => f.id !== id);
  renderFotos();
}
 
function hacerPrincipal(id) {
  const i = fotosAviso.findIndex(f => f.id === id);
  const [foto] = fotosAviso.splice(i, 1);
  fotosAviso.unshift(foto);               // pasar al inicio = pasar a ser la portada
  renderFotos();
}
 
function reintentarFoto(id) {
  quitarFoto(id);                         // se descarta la fallida...
  $('inputFotos').click();                // ...y se abre el selector para elegir otra
}
 
/* ---------- 8. REORDENAR ARRASTRANDO (HTML5 drag & drop) ---------- */
function limpiarIndicadoresDrop() {
  document.querySelectorAll('.drop-antes, .drop-despues')
    .forEach(t => t.classList.remove('drop-antes', 'drop-despues'));
}
 
// ¿el cursor está en la mitad izquierda o derecha de la miniatura?
const cursorDespues = (e, tile) => {
  const r = tile.getBoundingClientRect();
  return e.clientX > r.left + r.width / 2;
};
 
function iniciarArrastreMiniaturas() {
  const grid = $('fotosGrid');
 
  grid.addEventListener('dragstart', e => {
    const tile = e.target.closest('.foto-tile.ok');
    if (!tile) return;
    fotoArrastradaId = tile.dataset.id;
    tile.classList.add('arrastrada');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', fotoArrastradaId);   // Firefox lo exige
    $('panelReorden').classList.add('activo');
  });
 
  grid.addEventListener('dragover', e => {
    const tile = e.target.closest('.foto-tile.ok');
    if (!fotoArrastradaId || !tile || tile.dataset.id === fotoArrastradaId) return;
    e.preventDefault();                                       // permite soltar aquí
    limpiarIndicadoresDrop();
    tile.classList.add(cursorDespues(e, tile) ? 'drop-despues' : 'drop-antes');   // barra terracota
  });
 
  grid.addEventListener('drop', e => {
    const tile = e.target.closest('.foto-tile.ok');
    if (!fotoArrastradaId || !tile || tile.dataset.id === fotoArrastradaId) return;
    e.preventDefault();
 
    const desde = fotosAviso.findIndex(f => f.id === fotoArrastradaId);
    const [movida] = fotosAviso.splice(desde, 1);                       // 1) la saco de su lugar
    let hasta = fotosAviso.findIndex(f => f.id === tile.dataset.id);    // 2) busco el destino
    if (cursorDespues(e, tile)) hasta++;
    fotosAviso.splice(hasta, 0, movida);                                // 3) la inserto
    renderFotos();
  });
 
  grid.addEventListener('dragend', () => {
    fotoArrastradaId = null;
    limpiarIndicadoresDrop();
    $('panelReorden').classList.remove('activo');
    document.querySelectorAll('.arrastrada').forEach(t => t.classList.remove('arrastrada'));
  });
}
 
/* ---------- 9. ZONA DE ARRASTRE PARA ARCHIVOS ---------- */
function iniciarDropzone() {
  const zona = $('dropzoneFotos'), input = $('inputFotos');
  const esArchivo = e => e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files');
 
  zona.addEventListener('click', () => input.click());
  zona.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
 
  ['dragenter', 'dragover'].forEach(ev => zona.addEventListener(ev, e => {
    if (!esArchivo(e)) return;
    e.preventDefault();
    zona.classList.add('arrastrando');
  }));
  zona.addEventListener('dragleave', () => zona.classList.remove('arrastrando'));
  zona.addEventListener('drop', e => {
    if (!esArchivo(e)) return;
    e.preventDefault();
    zona.classList.remove('arrastrando');
    procesarArchivos(e.dataTransfer.files);
  });
 
  input.addEventListener('change', () => {
    procesarArchivos(input.files);
    input.value = '';        // permite volver a elegir el mismo archivo
  });
}
 
/* ---------- 10. GUARDAR / CANCELAR ---------- */
function guardarFotos() {
  // las subidas reales deben terminar (la miniatura "pausada" de la demo no cuenta)
  if (fotosAviso.some(f => f.estado === 'subiendo' && !f.pausada)) {
    showToast('Espera a que terminen las subidas.', 'info');
    return;
  }
  const listas = fotosAviso.filter(f => f.estado === 'ok');
  if (!listas.length) {
    showToast('Error. Necesitas al menos una fotografía para guardar.', 'error');
    return;
  }
  state.fotosAviso = listas.map(f => ({ nombre: f.nombre, src: f.src }));   // se guarda en el estado global
  sincronizarFotosNuevoAviso();
  showToast(`Éxito. Se guardaron ${listas.length} fotografía${listas.length > 1 ? 's' : ''}. La primera será la portada del aviso.`);
  showView('nuevoAvisoView');
}
 
function cancelarFotos() {
  showView('nuevoAvisoView');
}
 
// Refleja la portada en la "Vista previa de la tarjeta" de la 2.3
function sincronizarFotosNuevoAviso() {
  const prev = document.querySelector('.preview-imagen');
  const portada = (state.fotosAviso || []).find(f => f.src);
  if (!prev) return;
  if (!portada) {
    prev.classList.remove('con-foto');
    prev.style.backgroundImage = '';
    actualizarValidacionNuevoAviso();
    return;
  }
  prev.classList.add('con-foto');
  prev.style.backgroundImage = `url(${portada.src})`;
  prev.style.backgroundSize = 'cover';
  prev.style.backgroundPosition = 'center';
  actualizarValidacionNuevoAviso(); // 2.4: al guardar fotos, quitar el aviso rojo de fotografías.
}
 
/* ---------- 11. ARRANQUE ---------- */
function cargarFotosDemo() {
  fotosAviso = [
    { id: nuevoIdFoto(), nombre: 'portada', src: null, estado: 'ok' },
    { id: nuevoIdFoto(), nombre: 'lomo', src: null, estado: 'ok' },
    { id: nuevoIdFoto(), nombre: 'hojas interiores', src: null, estado: 'ok' },
    { id: nuevoIdFoto(), nombre: 'foto 4', src: null, estado: 'subiendo', progreso: 62, pausada: true },
    { id: nuevoIdFoto(), nombre: 'foto 5', estado: 'error', mensajeError: 'La imagen supera 5 MB' }
  ];
}
 
document.addEventListener('DOMContentLoaded', () => {
  if (MODO_DEMO) cargarFotosDemo();
  iniciarDropzone();
  iniciarArrastreMiniaturas();
  renderFotos();
});

/* ===== PARTE 2.6 : MODALES DE ESTADO Y ELIMINACIÓN · SEBASTIAM SOLORZANO ===== */
let filaAccion = null;   // <tr> del aviso sobre el que se está actuando

const ESTADOS_AVISO = {
  publicado: { badge: 'publicado-azul',   texto: 'Publicado' },
  pausado:   { badge: 'publicado-yellow', texto: 'Pausado'   },
  borrador:  { badge: 'publicado-borrador', texto: 'Borrador' },
  vendido:   { badge: 'publicado-verde',  texto: 'Vendido'   }
};

// Estados a los que se puede pasar desde cada estado actual
const TRANSICIONES = {
  publicado: ['pausado', 'vendido'],
  pausado:   ['publicado', 'vendido'],
  borrador:  ['publicado']
};

/* ---------- Lectura de datos de la fila ---------- */
const tituloDeFila = fila => fila.querySelector('.Titulo-aviso, .Titulo-aviso-alternativo').textContent.trim();
const ofertasDeFila = fila => {
  const celda = fila.querySelector('.celda-ofertas-datos-incluidos');
  return celda ? parseInt(celda.textContent, 10) || 0 : 0;
};
const fechaHoy = () => new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

/* ---------- Menú "Acciones" ---------- */
function iniciarMenuAcciones() {
  // Un solo listener en el <tbody>: funciona para todas las filas, incluso las que se agreguen después
  $('misPubTbody').addEventListener('click', e => {
    const boton = e.target.closest('.Boton-para-acciones-tabla');
    if (!boton) return;
    e.stopPropagation();
    filaAccion = boton.closest('tr');

    const menu = $('menuAcciones');
    menu.style.display = 'block';
    const r = boton.getBoundingClientRect();
    menu.style.top = (r.bottom + window.scrollY + 4) + 'px';
    menu.style.left = (r.right + window.scrollX - menu.offsetWidth) + 'px';
  });
  document.addEventListener('click', cerrarMenuAcciones);
}
function cerrarMenuAcciones() { $('menuAcciones').style.display = 'none'; }

/* ---------- Abrir / cerrar modales ---------- */
function cerrarModales() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}

/* ---------- Modal: cambio de estado ---------- */
function abrirModalEstado() {
  const estado = filaAccion.dataset.estado;
  if (estado === 'vendido') {
    showToast('Un aviso vendido ya no puede cambiar de estado.', 'info');
    return;
  }
  $('modalEstadoTexto').textContent =
    `«${tituloDeFila(filaAccion)}» dejará de aparecer en el catálogo si lo marcas como vendido.`;

  // Solo quedan habilitadas las opciones que tienen sentido desde el estado actual
  document.querySelectorAll('input[name="nuevoEstado"]').forEach(radio => {
    radio.checked = false;
    radio.disabled = !TRANSICIONES[estado].includes(radio.value);
    radio.closest('.modal-opcion').classList.toggle('modal-opcion-off', radio.disabled);
  });
  $('modalEstadoAviso').style.display = 'none';
  $('btnConfirmarEstado').disabled = true;
  $('modalEstado').style.display = 'flex';
}

function alElegirEstado() {
  const elegido = document.querySelector('input[name="nuevoEstado"]:checked');
  $('btnConfirmarEstado').disabled = !elegido;

  const aviso = $('modalEstadoAviso');
  const n = ofertasDeFila(filaAccion);
  if (elegido && elegido.value === 'vendido' && n > 0) {
    aviso.innerHTML = '<strong>Atención.</strong> ' + (n === 1
      ? 'La oferta activa de este aviso quedará sin efecto y se avisará al comprador.'
      : `Las ${n} ofertas activas de este aviso quedarán sin efecto y se avisará a los compradores.`);
    aviso.style.display = 'block';
  } else {
    aviso.style.display = 'none';
  }
}

function confirmarCambioEstado() {
  const elegido = document.querySelector('input[name="nuevoEstado"]:checked');
  if (!elegido) return;

  const fila = filaAccion;
  const antes = fila.dataset.estado;
  const nuevo = elegido.value;
  const n = ofertasDeFila(fila);
  const celdaOfertas = fila.children[4];

  // 1) Actualiza la fila: estado, badge y resaltado
  fila.dataset.estado = nuevo;
  const badge = fila.querySelector('.badge');
  badge.className = 'badge ' + ESTADOS_AVISO[nuevo].badge;
  badge.textContent = ESTADOS_AVISO[nuevo].texto;
  fila.classList.toggle('fila-resaltada', nuevo === 'pausado');

  // 2) Ajustes según el cambio
  if (nuevo === 'vendido') {                       // las ofertas quedan cerradas
    celdaOfertas.className = 'celda-ofertas';
    celdaOfertas.textContent = n > 0 ? 'Cerrado con 1' : '-';
  }
  if (antes === 'borrador' && nuevo === 'publicado') {   // se publica por primera vez
    fila.querySelector('.Celda-Fecha').textContent = fechaHoy();
    celdaOfertas.className = 'celda-ofertas';
    celdaOfertas.textContent = 'Sin ofertas';
  }

  // HU2: actualizar también el registro local del aviso.
  actualizarAvisoHu2EnStorage(fila, nuevo);
  // 3) Cierra, refresca contadores/filtros y avisa
  cerrarModales();
  actualizarContadoresMisPub();
  aplicarFiltroPublicaciones();
  const mensajes = {
    vendido:   'Éxito. El aviso se marcó como vendido y salió del catálogo.',
    pausado:   'Éxito. El aviso se pausó y ya no aparece en el catálogo.',
    publicado: 'Éxito. El aviso se publicó de nuevo en el catálogo.'
  };
  showToast(mensajes[nuevo], 'success');
}

/* ---------- Modal: eliminar aviso ---------- */
function abrirModalEliminar() {
  const n = ofertasDeFila(filaAccion);
  $('modalEliminarTexto').textContent =
    `Vas a eliminar «${tituloDeFila(filaAccion)}». Esta acción no se puede deshacer.`;

  const aviso = $('modalEliminarAviso');
  if (n > 0) {
    aviso.textContent = n === 1
      ? 'El aviso tiene 1 oferta activa. Se rechazará automáticamente al eliminarlo.'
      : `El aviso tiene ${n} ofertas activas. Se rechazarán automáticamente al eliminarlo.`;
    aviso.style.display = 'block';
  } else {
    aviso.style.display = 'none';
  }

  $('confirmarEliminarInput').value = '';
  $('btnConfirmarEliminar').disabled = true;
  $('modalEliminar').style.display = 'flex';
  $('confirmarEliminarInput').focus();
}

function validarConfirmacionEliminar() {
  $('btnConfirmarEliminar').disabled = $('confirmarEliminarInput').value.trim() !== 'ELIMINAR';
}

function confirmarEliminar() {
  if ($('confirmarEliminarInput').value.trim() !== 'ELIMINAR') return;
  const n = ofertasDeFila(filaAccion);

  borrarAvisoHu2EnStorage(filaAccion); // HU2: elimina el registro local.
  filaAccion.remove();
  filaAccion = null;

  cerrarModales();
  actualizarContadoresMisPub();
  aplicarFiltroPublicaciones();   // si ya no queda ninguna fila, muestra el estado vacío (2.2)

  let msg = 'Aviso eliminado.';
  if (n === 1) msg = 'Aviso eliminado. Se rechazó 1 oferta activa y se notificó al comprador.';
  if (n > 1)   msg = `Aviso eliminado. Se rechazaron ${n} ofertas activas y se notificó a los compradores.`;
  showToast(msg, 'success');
}

/* ---------- Contadores de los chips y del resumen ---------- */
function actualizarContadoresMisPub() {
  const filas = filasDeMisPublicaciones();
  const cuenta = estado => filas.filter(f => f.dataset.estado === estado).length;
  const etiquetas = {
    todos:     ['Todos', filas.length],
    publicado: ['Publicados', cuenta('publicado')],
    pausado:   ['Pausados', cuenta('pausado')],
    borrador:  ['Borradores', cuenta('borrador')],
    vendido:   ['Vendidos', cuenta('vendido')]
  };
  document.querySelectorAll('#misPubFiltros .chip').forEach(chip => {
    const [texto, n] = etiquetas[chip.dataset.filtro];
    chip.textContent = `${texto} · ${n}`;
  });

  const ofertas = filas.reduce((suma, f) => suma + ofertasDeFila(f), 0);
  $('misPubResumen').textContent = filas.length === 0
    ? 'Ningún aviso todavía'
    : `${filas.length} ${filas.length === 1 ? 'aviso' : 'avisos'} · ${ofertas} ${ofertas === 1 ? 'oferta' : 'ofertas'} por responder`;
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarMenuAcciones();

  // Clic en el fondo oscuro cierra el modal
  document.querySelectorAll('.modal-overlay').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) cerrarModales(); }));

  // Escape cierra modales y menú
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarModales(); cerrarMenuAcciones(); }
  });
});
