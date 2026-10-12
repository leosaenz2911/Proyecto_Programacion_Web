// ===== DATOS SIMULADOS (front) — en la 2.ª entrega pasan a la API/BD =====
const USERS_KEY = 'tablon_users', SESSION_KEY = 'tablon_session';
const SEED_USERS = [
  {
    id: 'USR-001', nombres: 'Rosa María', apellidos: 'Quispe Ríos', correo: '20201234@aloe.ulima.edu.pe', password: 'Rosa1234',
    carrera: 'Administración', ciclo: 'Cuarto', telefono: '987 654 321', puntoEncuentroPreferido: 'Biblioteca', rol: 'USUARIO', bloqueado: false
  },
  {
    id: 'USR-900', nombres: 'Julio', apellidos: 'Mendoza', correo: '20150001@aloe.ulima.edu.pe', password: 'Admin1234',
    carrera: 'Ingeniería de Sistemas', ciclo: 'Décimo', telefono: '', puntoEncuentroPreferido: 'Biblioteca', rol: 'ADMINISTRADOR', bloqueado: false
  },
  {
    id: 'USR-050', nombres: 'Marco Antonio', apellidos: 'Loayza Pinto', correo: '20189922@aloe.ulima.edu.pe', password: 'Marco1234',
    carrera: 'Comunicación', ciclo: 'Octavo', telefono: '', puntoEncuentroPreferido: 'Puerta 1', rol: 'USUARIO', bloqueado: true
  }
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



/*PARTE 2 : PUBLICACIONES : SEBASTIAM SOLORZANO */
// Filtro por estado de busqueda //

let misPublicacionesActivo = 'todos';
let misPubtexto = '';

// Funcion para el boton de filtros , si es : Publicado ,vendido , Pausado //
function filtrarMisPublicaciones(estado) {
  misPublicacionesActivo = estado;
  const chips = document.querySelectorAll('#misPubFiltros .chip');
  chips.forEach(c => c.classList.toggle('chip-active', c.dataset.filtro === estado));
  aplicarFiltroPublicaciones();
}
// Funcion para la barra de busqueda de publicaciones en avisos//

function buscarMisPublicaciones(texto) {
  misPubtexto = texto.trim().toLowerCase();
  aplicarFiltroPublicaciones();
}

// Funcion para aplicar filtro asignado//
function aplicarFiltroPublicaciones() {
  const filas = document.querySelectorAll('#misPubTbody tr');
  let visibles = 0;

  // Realiza el recorrido de todas las filas donde en cada avance se suma mas 1 al visible , si queda en 0 se salta al estado vacio y oculta la tabla //

  filas.forEach(fila => {
    const coincidenciaEstado = misPublicacionesActivo === 'todos' || fila.dataset.estado === misPublicacionesActivo;
    const titulo = fila.querySelectorAll('.aviso-titulo , .Titulo-aviso , .Titulo-aviso-alternativo')?.textContent.toLowerCase() || '';
    const coincidenciaTexto = misPubtexto === '' || titulo.includes(misPubtexto);
    const visible = coincidenciaEstado && coincidenciaTexto;
    fila.style.display = visible ? '' : 'none';
    if (visible) visibles++;
  });

  // actualiza estado vacío, visibilidad de la tabla y el contador //
  const vacio = document.getElementById('misPubVacio');
  const tabla = document.querySelector('.tabla-avisos');
  const conteo = document.getElementById('misPubConteo');
  if (vacio) vacio.style.display = visibles === 0 ? 'block' : 'none';
  if (tabla) tabla.style.display = visibles === 0 ? 'none' : 'table';
  if (conteo) conteo.textContent = `Mostrando ${visibles} de ${filas.length} avisos`;

}

// Funcion para el boton de nuevo aviso
function abrirNuevoAviso(){
  showView('nuevoAvisoView');
}

function actualizarBotonPublicarAviso() {
  const boton = document.getElementById('btnPublicarAvisoSebas')

  if(!boton) return;

  if(state.currentUser && state.currentUser.rol === 'USUARIO'){
    boton.style.display = 'infline-flex';
  }else {

    boton.style.display= 'none';
  }
  document.addEventListener('DOMContentLoaded', () => {
    actualizarBotonPublicarAviso();
  });
}

function validarPublicacion() {

  const titulo = document.getElementById('nuevoTitulo').value.trim();
  const descripcion = document.getElementById('nuevoDescripcion').value.trim();
  const categoria = document.getElementById('nuevoCategoria').value;
  const curso = document.getElementById('nuevoCurso').value;
  const precio = document.getElementById('nuevoPrecio').value;
  const minimo = document.getElementById('nuevoMinimo').value;

  const condicionSeleccionada =
    document.querySelector('.condiciones .chip-active');

  const alerta =
    document.getElementById('errorPublicarAviso');

  /* Verifica si falta algún campo */
  const hayError =
    titulo === '' ||
    descripcion === '' ||
    categoria === '' ||
    curso === '' ||
    precio === '' ||
    minimo === '' ||
    !condicionSeleccionada;

  if (hayError) {
    alerta.style.display = 'block';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  } else {
    alerta.style.display = 'none';
    alert('El aviso puede publicarse');
  }
}


/*PARTE 2.5 : PUBLICACIONES : SEBASTIAM SOLORZANO */
// CARGA DE FOTOGRAFIAS //

const FOTOS_MAX = 6;                              // máximo de imágenes
const FOTOS_MAX_BYTES = 5 * 1024 * 1024;          // 5 MB por imagen
const FOTOS_TIPOS = ['image/jpeg', 'image/png'];  // solo JPG y PNG
const MODO_DEMO = true;


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
  if (!prev || !portada) return;
  prev.classList.add('con-foto');
  prev.style.backgroundImage = `url(${portada.src})`;
  prev.style.backgroundSize = 'cover';
  prev.style.backgroundPosition = 'center';
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










