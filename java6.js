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
      state.pendingView = viewId;
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
  
  if (viewId === 'myRatingsView') {
      switchMyRatingsTab(document.getElementById('tabEmitidas') && document.getElementById('tabEmitidas').classList.contains('active') ? 'emitidas' : 'recibidas');
  }
  
  $('loginError').style.display = 'none';$('regAlert').style.display = 'none';
  window.scrollTo(0, 0);
}

function goHome() {
  showView(state.currentUser ? HOME_BY_ROLE[state.currentUser.rol] : 'landingView');
}

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
function validateForm(ids) { return ids.map(check).every(Boolean); }
function clearErrors(scopeId) {
  document.querySelectorAll('#' + scopeId + ' .error-msg').forEach(s => s.textContent = '');
  document.querySelectorAll('#' + scopeId + ' .is-invalid').forEach(i => i.classList.remove('is-invalid'));
}

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

function handleRegister(e) {
  e.preventDefault();
  const ids = ['regNombres', 'regApellidos', 'regEmail', 'regPassword', 'regConfirm', 'regCarrera', 'regCiclo', 'regTerms'];
  const nErr = ids.filter(id => !check(id)).length;
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
    password: $('regPassword').value,
    carrera: $('regCarrera').value,
    ciclo: $('regCiclo').value,
    telefono: '',
    puntoEncuentroPreferido: 'Biblioteca',
    rol: 'USUARIO',
    bloqueado: false
  });
  saveUsers(users);

  const email = $('regEmail').value.trim();$('registerForm').reset();
  clearErrors('registerForm');
  showToast('Cuenta creada. Ya puedes iniciar sesión.');
  showView('loginView');
  $('loginEmail').value = email;
}

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
  const dest = state.pendingView || HOME_BY_ROLE[user.rol];
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
  USUARIO: [['Catálogo', 'catalogView'], ['Mis publicaciones', 'misPublicacionesView'], ['Favoritos'], ['Ofertas'], ['Acuerdos'], ['Calificaciones', 'myRatingsView'], ['Mi cuenta', 'profileView']],
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
    $('navAvatar').textContent = (user.nombres[0] + user.apellidos[0]).toUpperCase();$('navUserName').textContent = user.nombres.split(' ')[0] + ' ' + user.apellidos.split(' ')[0];
  }
}

function fillProfile() {
  const u = state.currentUser;
  if (!u) return;
  clearErrors('profileView');
  $('profileName').textContent = `${u.nombres} ${u.apellidos}`;
  $('profileAvatar').textContent = (u.nombres[0] + u.apellidos[0]).toUpperCase();$('profileDetail').textContent = `${u.nombres} ${u.apellidos} · ${u.carrera}, ${u.ciclo.toLowerCase()} ciclo`;
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
  state.recoveryEmail = $('recEmail').value.trim().toLowerCase();$('recSentTo').textContent = state.recoveryEmail;
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

// ==========================================
// PARTE 6: REPUTACIÓN Y CALIFICAR (Añadido)
// ==========================================
ROUTES.myRatingsView = { roles: ['USUARIO'] };
ROUTES.rateView = { roles: ['USUARIO'] };
ROUTES.publicProfileView = { roles: ['USUARIO', 'ADMINISTRADOR'] };

let pendingAgreements = [
    {
        id: 'A-2201', productTitle: 'Juego de escuadras y escalímetro Faber', date: '01/09/2026', location: 'Patio del pabellón H',
        price: 'S/ 34.00', counterpart: { id: 'U-205', name: 'Carla Huamaní Bravo', rol: 'Compradora', career: 'Arquitectura, sexto ciclo' },
        deadline: '08/09/2026'
    },
    {
        id: 'A-2109', productTitle: 'Cálculo - Larson, tomo I', date: '26/08/2026', location: 'Puerta 1',
        price: 'S/ 70.00', counterpart: { id: 'U-301', name: 'Iván Palomino Rojas', rol: 'Vendedor', career: 'Economía, quinto ciclo' },
        deadline: '02/09/2026'
    }
];

let mySentRatings = [];
let myReceivedRatings = [
    { authorId: 'U-402', authorName: 'Lucía Ramírez Ccahuana', stars: 5, date: '15/08/2026', text: 'Todo excelente, el libro estaba en perfectas condiciones y fue muy puntual.' },
    { authorId: 'U-505', authorName: 'Sebastián Ochoa Núñez', stars: 4, date: '02/08/2026', text: 'Buen vendedor, aunque tuvimos que cambiar la hora a último minuto.' }
];

let activeAgreementToRate = null;

function switchMyRatingsTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('countEmitidas').textContent = `(${mySentRatings.length + pendingAgreements.length})`;
    document.getElementById('countRecibidas').textContent = `(${myReceivedRatings.length})`;

    let html = '';
    let avg = 0;

    if(tab === 'emitidas') {
        document.getElementById('tabEmitidas').classList.add('active');
        document.getElementById('summaryTabTitle').textContent = 'PESTAÑA «EMITIDAS»';
        
        pendingAgreements.forEach(ag => {
            html += `
            <div class="review-item" style="border-left: 4px solid var(--err);">
                <div class="review-header" style="align-items: center; margin:0;">
                    <div>
                        <strong class="review-item-title">${ag.productTitle}</strong>
                        <p class="hint" style="margin-top:4px;">${ag.id} a ${ag.counterpart.name} • Entregado el ${ag.date}</p>
                    </div>
                    <button class="btn btn-primary" onclick="openRateForm('${ag.id}')">Calificar</button>
                </div>
            </div>`;
        });

        mySentRatings.forEach(r => {
            avg += r.stars;
            html += `
            <div class="review-item">
                <div class="review-header">
                    <div>
                        <strong class="review-item-title" onclick="openPublicProfile('${r.targetId}', '${r.targetName}')">${r.agreement} - a ${r.targetName}</strong>
                        <div style="color:var(--terracota); font-size:18px; margin-top:4px; letter-spacing: 2px;">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
                    </div>
                    <div style="text-align: right;">
                        <button class="btn btn-ghost" style="padding: 4px 10px; font-size:13px; border: 1px solid var(--border); margin-bottom:8px;">Editar</button>
                        <div class="review-date">${r.date}</div>
                    </div>
                </div>
                <p class="review-text" style="color: ${r.text ? 'inherit' : 'var(--muted)'}">${r.text || 'Sin comentario.'}</p>
            </div>`;
        });

        if (mySentRatings.length > 0) avg = (avg / mySentRatings.length).toFixed(1);

    } else {
        document.getElementById('tabRecibidas').classList.add('active');
        document.getElementById('summaryTabTitle').textContent = 'PESTAÑA «RECIBIDAS»';
        
        myReceivedRatings.forEach(r => {
            avg += r.stars;
            html += `
            <div class="review-item" style="border-bottom: 1px solid var(--border); border-radius:0; box-shadow:none; padding: 24px 32px; border-left:none; border-top:none; border-right:none;">
                <div class="review-header">
                    <div style="color:var(--terracota); font-size:18px; letter-spacing: 2px;">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
                    <div class="review-date">${r.date}</div>
                </div>
                <p class="review-text">${r.text}</p>
                <div class="review-author" onclick="openPublicProfile('${r.authorId}', '${r.authorName}')">
                    <div style="width: 24px; height: 24px; background:var(--border); border-radius:50%; display:flex; align-items:center; justify-content:center; color: var(--muted); font-size: 10px; font-weight: 800;">${getInitials(r.authorName)}</div> 
                    ${r.authorName}
                </div>
            </div>`;
        });

        if (myReceivedRatings.length > 0) avg = (avg / myReceivedRatings.length).toFixed(1);
    }
    
    document.getElementById('myRatingsList').innerHTML = html || '<p class="hint" style="padding: 24px;">No hay calificaciones para mostrar.</p>';
    
    const count = tab === 'emitidas' ? mySentRatings.length : myReceivedRatings.length;
    document.getElementById('summaryAvg').textContent = count > 0 ? avg : '0.0';
    document.getElementById('summaryCount').textContent = `promedio de ${count} calificaciones`;
    document.getElementById('summaryStars').textContent = count > 0 ? '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg)) : '☆☆☆☆☆';
    
    document.getElementById('summaryBadge').style.display = (tab === 'recibidas' && avg >= 4.5 && count >= 10) ? 'inline-block' : 'none';
}

function openRateForm(agreementId) {
    activeAgreementToRate = pendingAgreements.find(a => a.id === agreementId);
    if (!activeAgreementToRate) return;

    document.getElementById('rateAgreementCode').textContent = activeAgreementToRate.id;
    document.getElementById('rateTitle').textContent = `¿Cómo te fue con ${activeAgreementToRate.counterpart.name.split(' ')[0]}?`;
    document.getElementById('rateProductName').textContent = activeAgreementToRate.productTitle;
    document.getElementById('rateAgreementDetails').textContent = `Acuerdo ${activeAgreementToRate.id} • entregado el ${activeAgreementToRate.date} • ${activeAgreementToRate.location}`;
    document.getElementById('ratePrice').textContent = activeAgreementToRate.price;
    document.getElementById('rateCounterpartRole').textContent = `• ${activeAgreementToRate.counterpart.rol.toLowerCase()}: ${activeAgreementToRate.counterpart.name}`;
    document.getElementById('rateDeadlineText').textContent = `Puedes editar tu calificación hasta el ${activeAgreementToRate.deadline} (7 días después de la entrega). Luego queda fija.`;

    resetRateForm();
    showView('rateView');
}

function initRateLogic() {
  const rateTexts = ["Malo", "Regular", "Aceptable", "Bueno", "Excelente"];
  const chipsData = ["Puntualidad", "Buena comunicación", "Producto como se describía", "Flexibilidad con el horario"];
  document.getElementById('rateChips').innerHTML = chipsData.map(c => `<button type="button" class="chip">${c}</button>`).join('');

  const stars = document.querySelectorAll('#rateStars span');
  const hint = document.getElementById('rateHint');
  const btnSubmit = document.getElementById('btnSubmitRate');
  const commentBox = document.getElementById('rateComment');
  const countDisplay = document.getElementById('rateCount');

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => highlightStars(index + 1));
    star.addEventListener('mouseout', () => highlightStars(window.currentRating || 0));
    star.addEventListener('click', () => {
      window.currentRating = index + 1;
      highlightStars(window.currentRating);
      hint.innerHTML = `<strong style="color: var(--ink); font-size:15px;">${window.currentRating} de 5</strong> - ${rateTexts[index]}`;
      btnSubmit.disabled = false;
    });
  });

  function highlightStars(count) { stars.forEach((s, i) => s.className = i < count ? 'active' : ''); }
  document.querySelectorAll('#rateChips .chip').forEach(chip => chip.addEventListener('click', () => chip.classList.toggle('active')));
  if (commentBox) {
    commentBox.addEventListener('input', (e) => countDisplay.textContent = `${e.target.value.length}/300 caracteres. Evita datos personales.`);
  }
}

function resetRateForm() {
    window.currentRating = 0;
    document.querySelectorAll('#rateStars span').forEach(s => s.className = '');
    document.querySelectorAll('#rateChips .chip').forEach(c => c.classList.remove('active'));
    document.getElementById('rateComment').value = '';
    document.getElementById('rateCount').textContent = '0/300 caracteres. Evita datos personales.';
    document.getElementById('rateHint').innerHTML = 'Selecciona un puntaje para publicar tu calificación.';
    document.getElementById('btnSubmitRate').disabled = true;
}

function submitRating(event) {
  event.preventDefault();
  const ratingStars = window.currentRating;
  const commentTxt = document.getElementById('rateComment').value;

  mySentRatings.unshift({
      targetId: activeAgreementToRate.counterpart.id,
      targetName: activeAgreementToRate.counterpart.name,
      agreement: activeAgreementToRate.id,
      stars: ratingStars,
      date: 'Hoy',
      text: commentTxt,
      editable: true
  });

  pendingAgreements = pendingAgreements.filter(a => a.id !== activeAgreementToRate.id);
  showToast("Calificación publicada correctamente.");
  showView('myRatingsView'); 
}

function openPublicProfile(userId, userName = "Usuario") {
    document.getElementById('profileAvatarHU6').textContent = getInitials(userName);
    document.getElementById('profileNameHU6').textContent = userName;
    document.getElementById('profileCareerHU6').textContent = `Arquitectura - sexto ciclo - en el tablón desde marzo de 2026`;
    document.getElementById('profileAvgStarsHU6').innerHTML = `4.8 <span style="color:var(--terracota); font-size:24px;">★</span>`;
    document.getElementById('profileTotalReviewsHU6').textContent = `de 11 calificaciones recibidas`;
    document.getElementById('profileAgreementsHU6').textContent = '12';
    document.getElementById('profileBadgeHU6').style.display = 'inline-block';
    
    document.getElementById('publicReviewsList').innerHTML = `
        <div class="review-item" style="border-radius:0; border-bottom:1px solid var(--border); box-shadow:none; padding:24px 32px; border-left:none; border-top:none; border-right:none;">
            <div class="review-header">
                <div style="color:var(--terracota); font-size:18px; letter-spacing:2px;">★★★★★</div>
                <div class="review-date">17/08/2026</div>
            </div>
            <p class="review-text">Llegó puntual a la Biblioteca y el producto estaba tal como lo describió.</p>
            <div class="review-author"><div class="author-avatar-sm">AC</div> Andrés Castillo Paredes</div>
        </div>
        <div class="review-item" style="border-radius:0; box-shadow:none; padding:24px 32px; border:none;">
            <div class="review-header">
                <div style="color:var(--terracota); font-size:18px; letter-spacing:2px;">★★★★☆</div>
                <div class="review-date">09/08/2026</div>
            </div>
            <p class="review-text">Aceptó mi contraoferta sin problema y coordinamos rápido por el hilo.</p>
            <div class="review-author"><div class="author-avatar-sm">RQ</div> Rosa Quispe Ríos</div>
        </div>
    `;

    showView('publicProfileView');
}

function getInitials(name) { return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase(); }

// Inicializamos todo
document.addEventListener('DOMContentLoaded', () => {
  initRateLogic();
  
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('blur', () => check(id));
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (el.classList.contains('is-invalid')) check(id); });
    }
  });

  const saved = localStorage.getItem(SESSION_KEY);
  const user = saved && loadUsers().find(u => u.id === saved && !u.bloqueado);
  if (user) state.currentUser = user; else localStorage.removeItem(SESSION_KEY);
  
  updateUI();
  goRecoverStep(1);
  goHome();
});