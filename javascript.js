// ESTADO GLOBAL SIMULADO DE SESIÓN
const state = {
  currentUser: null // null indica VISITANTE; al autenticarse contendrá la info del usuario
};


function showView(viewId) {
  const views = document.querySelectorAll('.view-section');
  views.forEach(v => v.classList.remove('active'));

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }
}

// Validar correo institucional (@aloe.ulima.edu.pe)
function validateEmailInput() {
  const emailInput = document.getElementById('regEmail');
  const errorMsg = document.getElementById('regEmailError');
  const emailValue = emailInput.value.trim();

  if (!emailValue.endsWith('@aloe.ulima.edu.pe')) {
    emailInput.classList.add('is-invalid');
    errorMsg.textContent = 'El correo debe terminar en @aloe.ulima.edu.pe';
    return false;
  } else {
    emailInput.classList.remove('is-invalid');
    errorMsg.textContent = '';
    return true;
  }
}


function handleRegister(e) {
  e.preventDefault();

  if (!validateEmailInput()) {
    alert('Por favor, ingresa un correo institucional válido.');
    return;
  }

  const nombres = document.getElementById('regNombres').value;
  const apellidos = document.getElementById('regApellidos').value;
  const correo = document.getElementById('regEmail').value;
  const carrera = document.getElementById('regCarrera').value;
  const ciclo = document.getElementById('regCiclo').value;

  // Registrar usuario en el estado
  state.currentUser = {
    id: "USR-" + Date.now(),
    nombres,
    apellidos,
    correo,
    carrera,
    ciclo,
    telefono: "Sin registrar",
    puntoEncuentroPreferido: "Biblioteca",
    rol: "USUARIO"
  };

  updateUI();
  alert('¡Cuenta creada con éxito!');
  showView('profileView');
}

// Manejo del Login
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;

  if (!email.endsWith('@aloe.ulima.edu.pe')) {
    alert('Acceso no permitido: Ingresa con tu correo institucional.');
    return;
  }


  state.currentUser = {
    id: "USR-001",
    nombres: "Rosa María",
    apellidos: "Quispe Ríos",
    correo: email,
    carrera: "Administración",
    ciclo: "Cuarto",
    telefono: "987 654 321",
    puntoEncuentroPreferido: "Biblioteca",
    rol: "USUARIO"
  };

  updateUI();
  showView('profileView');
}


function logout() {
  state.currentUser = null;
  updateUI();
  showView('landingView');
}


function updateUI() {
  const roleBadge = document.getElementById('userRoleBadge');
  const authBtns = document.getElementById('navAuthButtons');
  const userMenu = document.getElementById('navUserMenu');

  if (state.currentUser) {
    roleBadge.textContent = state.currentUser.rol;
    authBtns.style.display = 'none';
    userMenu.style.display = 'flex';


    document.getElementById('profileName').textContent = `\({state.currentUser.nombres}\){state.currentUser.apellidos}`;
    document.getElementById('profileDetail').textContent = `\({state.currentUser.carrera} | Ciclo\){state.currentUser.ciclo}`;
    document.getElementById('profilePhone').value = state.currentUser.telefono;
    document.getElementById('profileLocation').value = state.currentUser.puntoEncuentroPreferido;
  } else {
    roleBadge.textContent = 'VISITANTE';
    authBtns.style.display = 'flex';
    userMenu.style.display = 'none';
  }
}


function handleUpdateProfile(e) {
  e.preventDefault();
  if (state.currentUser) {
    state.currentUser.telefono = document.getElementById('profilePhone').value;
    state.currentUser.puntoEncuentroPreferido = document.getElementById('profileLocation').value;
    alert('Los cambios de tu cuenta han sido guardados.');
  }
}

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





