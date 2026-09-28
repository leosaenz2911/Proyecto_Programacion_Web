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
  USUARIO: [['Catálogo', 'catalogView'], ['Mis publicaciones'], ['Favoritos'], ['Ofertas'], ['Acuerdos'], ['Calificaciones'], ['Mi cuenta', 'profileView']],
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
  nav.innerHTML = TABS[user.rol].map(([label, view]) =>
    `<a class="${view === activeView ? 'active' : ''}" onclick="goTab(${view ? "'" + view + "'" : ''})">${label}</a>`).join('');
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
  if (user) {
    $('navAvatar').textContent = (user.nombres[0] + user.apellidos[0]).toUpperCase();
    $('navUserName').textContent = user.nombres.split(' ')[0] + ' ' + user.apellidos.split(' ')[0];
  }
}

// ===== MI CUENTA =====
function fillProfile() {
  const u = state.currentUser;
  if (!u) return;
  clearErrors('profileView');
  $('profileName').textContent = `${u.nombres} ${u.apellidos}`;
  $('profileAvatar').textContent = (u.nombres[0] + u.apellidos[0]).toUpperCase();
  $('profileDetail').textContent = `${u.nombres} ${u.apellidos} · ${u.carrera}, ${u.ciclo.toLowerCase()} ciclo`;
  $('profileNombres').value = u.nombres;
  $('profileApellidos').value = u.apellidos;
  $('profileEmail').value = u.correo;
  $('profilePhone').value = u.telefono;
  setLocation(u.puntoEncuentroPreferido);
  $('passwordForm').reset();
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