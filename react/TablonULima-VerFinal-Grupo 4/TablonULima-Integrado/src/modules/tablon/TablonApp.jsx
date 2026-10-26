/**
 * Vistas trasladadas desde html_historia1.html al árbol de React.
 * El estado y validaciones del prototipo se conservan en legacy.js
 * como capa de compatibilidad durante esta migración.
 */
import React, { useEffect } from 'react';
import * as legacy from './legacy.js';

export default function TablonApp({ active, targetView }) {
  useEffect(() => {
    legacy.initializeLegacy();
  }, []);

  // Las cuentas y la sesión son compartidas con los módulos originales.
  useEffect(() => {
    if (!active) return;
    legacy.refreshFromSharedSession();
    legacy.showView(targetView || (legacy.getCurrentRole() === 'ADMINISTRADOR' ? 'adminView' : legacy.getCurrentRole() === 'USUARIO' ? 'catalogView' : 'landingView'));
  }, [active, targetView]);

  return (
    <>
      <header className={"topbar"}>
        <div className={"topbar-main"}>
          <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} className={"brand"} onClick={(event) => { legacy.goHome(); }}>
            <img className={"brand-logo"} src="/img/logo_ulima.png" alt={""} />
            <span>
              {"Tablón ULima"}
            </span>
          </a>
          <nav className={"nav-links"} id={"navPublic"}>
            <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('catalogView'); }}>
              {"Catálogo"}
            </a>
            <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('landingView'); }}>
              {"Cómo funciona"}
            </a>
            <a>
              {"Normas del tablón"}
            </a>
            <a>
              {"Ayuda"}
            </a>
          </nav>
          <form className={"nav-search"} id={"navSearch"} style={{ "display": "none" }} onSubmit={(event) => { event.preventDefault(); legacy.showView('catalogView'); }}>
            <input type={"search"} placeholder={"Buscar libros, calculadoras, apuntes…"} />
          </form>
          <div className={"nav-right"}>
            <button type={"button"} id={"btnPublicarAvisoSebas"} className={"btn-publicar-sebas"} style={{ "display": "none" }} onClick={(event) => { legacy.showView('nuevoAvisoView'); }}>
              {"Publicar aviso"}
            </button>
            <span className={"role-badge role-visitante"} id={"userRoleBadge"}>
              {"VISITANTE"}
            </span>
            <div id={"navAuthButtons"}>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} className={"btn btn-ghost"} onClick={(event) => { legacy.showView('loginView'); }}>
                {"Ingresar"}
              </a>
              <button className={"btn btn-primary"} onClick={(event) => { legacy.showView('registerView'); }}>
                {"Crear cuenta"}
              </button>
            </div>
            <div id={"navUserMenu"} style={{ "display": "none" }}>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} className={"user-chip"} onClick={(event) => { legacy.showView('profileView'); }}>
                <span className={"avatar-sm"} id={"navAvatar"}>
                  {"RQ"}
                </span>
                <span id={"navUserName"}></span>
              </a>
              <button className={"btn btn-secondary"} onClick={(event) => { legacy.logout(); }}>
                {"Salir"}
              </button>
            </div>
          </div>
        </div>
        <nav className={"tabs"} id={"navTabs"} style={{ "display": "none" }}></nav>
      </header>
      <div id={"toastArea"} aria-live={"polite"}></div>
      <main>
        <section id={"landingView"} className={"view-section active"}>
          <div className={"hero"}>
            <div className={"wrap"}>
              <h1>
                {"Lo que a un compañero le sobra, a ti te sirve este ciclo"}
              </h1>
              <p className={"sub"}>
                {"Libros, calculadoras e instrumentos de segunda mano publicados por estudiantes de la Universidad de Lima. Oferta, acuerda y recoge dentro del campus."}
              </p>
              <form className={"hero-search"} onSubmit={(event) => { event.preventDefault(); legacy.showView('catalogView'); }}>
                <input type={"search"} placeholder={"¿Qué estás buscando? Ej. Stewart Cálculo"} />
                <button className={"btn btn-primary"}>
                  {"Buscar"}
                </button>
              </form>
              <div className={"stats"}>
                <div>
                  <b>
                    {"1,248"}
                  </b>
                  <span>
                    {"avisos activos"}
                  </span>
                </div>
                <div>
                  <b>
                    {"S/ 62"}
                  </b>
                  <span>
                    {"precio mediano"}
                  </span>
                </div>
                <div>
                  <b>
                    {"4.8"}
                  </b>
                  <span>
                    {"reputación media"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={"wrap"}>
            <p className={"eyebrow"} style={{ "marginTop": "28px" }}>
              {"Categorías destacadas"}
            </p>
            <div className={"cats"} style={{ "marginTop": "12px" }}>
              <div className={"cat"}>
                <i className={"fa-solid fa-book"}></i>
                {"Libros de texto"}
              </div>
              <div className={"cat"}>
                <i className={"fa-solid fa-calculator"}></i>
                {"Calculadoras"}
              </div>
              <div className={"cat"}>
                <i className={"fa-solid fa-ruler-combined"}></i>
                {"Instrumentos de dibujo"}
              </div>
              <div className={"cat"}>
                <i className={"fa-solid fa-file-lines"}></i>
                {"Apuntes y guías"}
              </div>
              <div className={"cat"}>
                <i className={"fa-solid fa-laptop"}></i>
                {"Laptops y accesorios"}
              </div>
              <div className={"cat"}>
                <i className={"fa-solid fa-shirt"}></i>
                {"Uniformes y mandiles"}
              </div>
              <div className={"cat"}>
                <i className={"fa-solid fa-flask"}></i>
                {"Material de laboratorio"}
              </div>
            </div>
            <div className={"section-head"}>
              <h2>
                {"Avisos recientes"}
              </h2>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('catalogView'); }}>
                {"Ver todo el catálogo →"}
              </a>
            </div>
            <div className={"recent"}>
              <div className={"item"}>
                <b>
                  {"Cálculo de una variable — Stewart"}
                </b>
                <em>
                  {"S/ 95.00"}
                </em>
                {"Muy buen estado · Cálculo I"}
              </div>
              <div className={"item"}>
                <b>
                  {"Calculadora ClassWiz fx-991"}
                </b>
                <em>
                  {"S/ 120.00"}
                </em>
                {"Como nuevo · Física II"}
              </div>
              <div className={"item"}>
                <b>
                  {"Escuadras y escalímetro Faber"}
                </b>
                <em>
                  {"S/ 38.00"}
                </em>
                {"Buen estado · Dibujo Técnico"}
              </div>
              <div className={"item"}>
                <b>
                  {"Apuntes de Contabilidad General"}
                </b>
                <em>
                  {"S/ 25.00"}
                </em>
                {"Con marcas de uso"}
              </div>
            </div>
            <div className={"steps3"}>
              <div className={"step3"}>
                <i>
                  {"1"}
                </i>
                <div>
                  <b>
                    {"Publica tu aviso"}
                  </b>
                  <span>
                    {"Sube fotografías, indica el estado del producto y tu precio pedido."}
                  </span>
                </div>
              </div>
              <div className={"step3"}>
                <i>
                  {"2"}
                </i>
                <div>
                  <b>
                    {"Recibe y negocia ofertas"}
                  </b>
                  <span>
                    {"Acepta, rechaza o contraoferta desde el hilo de negociación."}
                  </span>
                </div>
              </div>
              <div className={"step3"}>
                <i>
                  {"3"}
                </i>
                <div>
                  <b>
                    {"Coordinen la entrega"}
                  </b>
                  <span>
                    {"Elijan punto y horario en el campus y confirmen la entrega."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"loginView"} className={"view-section"}>
          <div className={"auth-split"}>
            <div className={"auth-photo"}>
              <div className={"quote"}>
                {"«Vendí mis libros de Cálculo en tres días y compré los de Física del ciclo siguiente.»"}
                <small>
                  {"Rosa María Quispe Ríos · Administración"}
                </small>
              </div>
            </div>
            <div className={"auth-form"}>
              <div className={"box"}>
                <h1>
                  {"Iniciar sesión"}
                </h1>
                <p className={"sub"}>
                  {"Usa tu correo institucional @aloe.ulima.edu.pe para ofertar, publicar y coordinar entregas."}
                </p>
                <div className={"alert alert-error"} id={"loginError"} style={{ "display": "none" }}></div>
                <form id={"loginForm"} onSubmit={(event) => { legacy.handleLogin(event); }} novalidate={""}>
                  <div className={"field"}>
                    <label htmlFor={"loginEmail"}>
                      {"Correo institucional"}
                    </label>
                    <input type={"email"} id={"loginEmail"} placeholder={"20201234@aloe.ulima.edu.pe"} />
                    <span className={"error-msg"} id={"loginEmailError"}></span>
                  </div>
                  <div className={"field"}>
                    <label htmlFor={"loginPassword"}>
                      {"Contraseña"}
                    </label>
                    <div className={"pass-wrap"}>
                      <input type={"password"} id={"loginPassword"} placeholder={"••••••••••"} />
                      <button type={"button"} className={"pass-toggle"} onClick={(event) => { legacy.togglePassword('loginPassword', event.currentTarget); }}>
                        {"Mostrar"}
                      </button>
                    </div>
                    <span className={"error-msg"} id={"loginPasswordError"}></span>
                  </div>
                  <div className={"form-foot"}>
                    <span></span>
                    <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.startRecovery(); }}>
                      {"¿Olvidaste tu contraseña?"}
                    </a>
                  </div>
                  <button type={"submit"} className={"btn btn-primary btn-block btn-lg"}>
                    {"Ingresar"}
                  </button>
                </form>
                <p className={"switch"}>
                  {"¿No tienes cuenta? "}
                  <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('registerView'); }}>
                    <b>
                      {"Crear cuenta"}
                    </b>
                  </a>
                </p>
                <p className={"demo"}>
                  {"Demo: "}
                  <code>
                    {"20201234@aloe.ulima.edu.pe"}
                  </code>
                  {" / "}
                  <code>
                    {"Rosa1234"}
                  </code>
                  {" · admin: "}
                  <code>
                    {"20150001@aloe.ulima.edu.pe"}
                  </code>
                  {" / "}
                  <code>
                    {"Admin1234"}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id={"registerView"} className={"view-section"}>
          <div className={"wrap center-page"}>
            <div className={"card card-narrow"}>
              <h1>
                {"Crear cuenta"}
              </h1>
              <p className={"sub"}>
                {"Solo para estudiantes con correo institucional. La cuenta se activa al confirmar el correo."}
              </p>
              <div className={"alert alert-error"} id={"regAlert"} style={{ "display": "none" }}></div>
              <form id={"registerForm"} onSubmit={(event) => { legacy.handleRegister(event); }} novalidate={""}>
                <div className={"row2"}>
                  <div className={"field"}>
                    <label htmlFor={"regNombres"}>
                      {"Nombres"}
                    </label>
                    <input type={"text"} id={"regNombres"} placeholder={"Ej. Rosa María"} />
                    <span className={"error-msg"} id={"regNombresError"}></span>
                  </div>
                  <div className={"field"}>
                    <label htmlFor={"regApellidos"}>
                      {"Apellidos"}
                    </label>
                    <input type={"text"} id={"regApellidos"} placeholder={"Ej. Quispe Ríos"} />
                    <span className={"error-msg"} id={"regApellidosError"}></span>
                  </div>
                </div>
                <div className={"field"}>
                  <label htmlFor={"regEmail"}>
                    {"Correo institucional"}
                  </label>
                  <input type={"email"} id={"regEmail"} placeholder={"codigo@aloe.ulima.edu.pe"} />
                  <span className={"error-msg"} id={"regEmailError"}></span>
                </div>
                <div className={"row2"}>
                  <div className={"field"}>
                    <label htmlFor={"regPassword"}>
                      {"Contraseña"}
                    </label>
                    <input type={"password"} id={"regPassword"} placeholder={"••••••••••"} />
                    <span className={"hint"}>
                      {"Mínimo 8 caracteres, una mayúscula y un número."}
                    </span>
                    <span className={"error-msg"} id={"regPasswordError"}></span>
                  </div>
                  <div className={"field"}>
                    <label htmlFor={"regConfirm"}>
                      {"Confirmar contraseña"}
                    </label>
                    <input type={"password"} id={"regConfirm"} placeholder={"••••••••••"} />
                    <span className={"error-msg"} id={"regConfirmError"}></span>
                  </div>
                </div>
                <div className={"row2"}>
                  <div className={"field"}>
                    <label htmlFor={"regCarrera"}>
                      {"Carrera"}
                    </label>
                    <select id={"regCarrera"}>
                      <option value={""}>
                        {"Selecciona una opción"}
                      </option>
                      <option>
                        {"Administración"}
                      </option>
                      <option>
                        {"Arquitectura"}
                      </option>
                      <option>
                        {"Comunicación"}
                      </option>
                      <option>
                        {"Contabilidad"}
                      </option>
                      <option>
                        {"Derecho"}
                      </option>
                      <option>
                        {"Economía"}
                      </option>
                      <option>
                        {"Ingeniería Civil"}
                      </option>
                      <option>
                        {"Ingeniería Industrial"}
                      </option>
                      <option>
                        {"Ingeniería de Sistemas"}
                      </option>
                      <option>
                        {"Marketing"}
                      </option>
                      <option>
                        {"Psicología"}
                      </option>
                    </select>
                    <span className={"error-msg"} id={"regCarreraError"}></span>
                  </div>
                  <div className={"field"}>
                    <label htmlFor={"regCiclo"}>
                      {"Ciclo"}
                    </label>
                    <select id={"regCiclo"}>
                      <option value={""}>
                        {"Selecciona ciclo"}
                      </option>
                      <option>
                        {"Primer"}
                      </option>
                      <option>
                        {"Segundo"}
                      </option>
                      <option>
                        {"Tercer"}
                      </option>
                      <option>
                        {"Cuarto"}
                      </option>
                      <option>
                        {"Quinto"}
                      </option>
                      <option>
                        {"Sexto"}
                      </option>
                      <option>
                        {"Séptimo"}
                      </option>
                      <option>
                        {"Octavo"}
                      </option>
                      <option>
                        {"Noveno"}
                      </option>
                      <option>
                        {"Décimo"}
                      </option>
                    </select>
                    <span className={"error-msg"} id={"regCicloError"}></span>
                  </div>
                </div>
                <div className={"field"}>
                  <label className={"check-label"}>
                    <input type={"checkbox"} id={"regTerms"} />
                    {"Acepto las normas de convivencia del tablón y el registro de mis acuerdos."}
                  </label>
                  <span className={"error-msg"} id={"regTermsError"}></span>
                </div>
                <div className={"form-actions"}>
                  <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} className={"btn btn-ghost"} onClick={(event) => { legacy.showView('loginView'); }}>
                    {"Cancelar"}
                  </a>
                  <button type={"submit"} className={"btn btn-primary"}>
                    {"Crear cuenta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section id={"recoverView"} className={"view-section"}>
          <div className={"wrap"}>
            <div className={"steps-bar"}>
              <div className={"step-item"} id={"stepBar1"}>
                <span></span>
                {"Paso 1 · Correo"}
              </div>
              <div className={"step-item"} id={"stepBar2"}>
                <span></span>
                {"Paso 2 · Enlace"}
              </div>
              <div className={"step-item"} id={"stepBar3"}>
                <span></span>
                {"Paso 3 · Nueva contraseña"}
              </div>
            </div>
            <div className={"card card-mid"} style={{ "marginBottom": "48px" }}>
              <form id={"recoverStep1"} className={"recover-step"} onSubmit={(event) => { legacy.handleRecoverEmail(event); }} novalidate={""}>
                <h1>
                  {"Ingresa tu correo institucional"}
                </h1>
                <p className={"sub"}>
                  {"Te enviaremos un enlace para crear una nueva contraseña. El enlace vence en 30 minutos."}
                </p>
                <div className={"field"}>
                  <label htmlFor={"recEmail"}>
                    {"Correo institucional"}
                  </label>
                  <input type={"email"} id={"recEmail"} placeholder={"20201234@aloe.ulima.edu.pe"} />
                  <span className={"error-msg"} id={"recEmailError"}></span>
                </div>
                <div className={"form-foot"}>
                  <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('loginView'); }}>
                    <b>
                      {"Volver al inicio de sesión"}
                    </b>
                  </a>
                  <button type={"submit"} className={"btn btn-primary"}>
                    {"Enviar enlace"}
                  </button>
                </div>
              </form>
              <div id={"recoverStep2"} className={"recover-step"} style={{ "textAlign": "center" }}>
                <div className={"big-icon"}>
                  <i className={"fa-regular fa-envelope"}></i>
                </div>
                <h1>
                  {"Revisa tu correo"}
                </h1>
                <p className={"sub"}>
                  {"Enviamos el enlace a "}
                  <b id={"recSentTo"} />
                  {". Si no lo ves, revisa la carpeta de correo no deseado."}
                </p>
                <button className={"btn btn-primary btn-block"} onClick={(event) => { legacy.openRecoveryLink(); }}>
                  {"Simular clic en el enlace del correo"}
                </button>
                <p className={"demo"}>
                  {"Demo: el proyecto no envía correos reales."}
                </p>
                <button className={"btn btn-secondary btn-block"} onClick={(event) => { legacy.goRecoverStep(1); }}>
                  {"Usar otro correo"}
                </button>
              </div>
              <form id={"recoverStep3"} className={"recover-step"} onSubmit={(event) => { legacy.handleNewPassword(event); }} novalidate={""}>
                <h1>
                  {"Crea tu nueva contraseña"}
                </h1>
                <div className={"field"} style={{ "marginTop": "16px" }}>
                  <label htmlFor={"newPass"}>
                    {"Nueva contraseña"}
                  </label>
                  <input type={"password"} id={"newPass"} placeholder={"••••••••••"} />
                  <span className={"hint"}>
                    {"Mínimo 8 caracteres, con una mayúscula y un número."}
                  </span>
                  <span className={"error-msg"} id={"newPassError"}></span>
                </div>
                <div className={"field"}>
                  <label htmlFor={"newPassConfirm"}>
                    {"Confirmar contraseña"}
                  </label>
                  <input type={"password"} id={"newPassConfirm"} placeholder={"••••••••••"} />
                  <span className={"error-msg"} id={"newPassConfirmError"}></span>
                </div>
                <button type={"submit"} className={"btn btn-primary btn-block"}>
                  {"Guardar contraseña"}
                </button>
              </form>
            </div>
          </div>
        </section>
        <section id={"profileView"} className={"view-section"}>
          <div className={"wrap"}>
            <div className={"page-head"}>
              <h1>
                {"Mi cuenta"}
              </h1>
              <p className={"sub"} id={"profileDetail"}></p>
            </div>
            <div className={"account-grid"}>
              <div className={"stack"}>
                <form id={"profileForm"} className={"stack"} onSubmit={(event) => { legacy.handleUpdateProfile(event); }} novalidate={""}>
                  <div className={"card"}>
                    <h2>
                      {"Datos personales"}
                    </h2>
                    <div className={"row2"}>
                      <div className={"field"}>
                        <label htmlFor={"profileNombres"}>
                          {"Nombres"}
                        </label>
                        <input type={"text"} id={"profileNombres"} />
                        <span className={"error-msg"} id={"profileNombresError"}></span>
                      </div>
                      <div className={"field"}>
                        <label htmlFor={"profileApellidos"}>
                          {"Apellidos"}
                        </label>
                        <input type={"text"} id={"profileApellidos"} />
                        <span className={"error-msg"} id={"profileApellidosError"}></span>
                      </div>
                    </div>
                    <div className={"row2"}>
                      <div className={"field"}>
                        <label htmlFor={"profileEmail"}>
                          {"Correo institucional"}
                        </label>
                        <input type={"email"} id={"profileEmail"} readOnly={true} />
                        <span className={"hint"}>
                          {"No editable."}
                        </span>
                      </div>
                      <div className={"field"}>
                        <label htmlFor={"profilePhone"}>
                          {"Teléfono de contacto"}
                        </label>
                        <input type={"tel"} id={"profilePhone"} placeholder={"987 654 321"} />
                        <span className={"hint"}>
                          {"Solo se comparte al cerrarse un acuerdo."}
                        </span>
                        <span className={"error-msg"} id={"profilePhoneError"}></span>
                      </div>
                    </div>
                  </div>
                  <div className={"card"}>
                    <h2>
                      {"Punto de encuentro preferido"}
                    </h2>
                    <p className={"hint"}>
                      {"Se propondrá por defecto al coordinar tus entregas."}
                    </p>
                    <input type={"hidden"} id={"profileLocation"} />
                    <div className={"chips"} id={"locChips"}>
                      <button type={"button"} className={"chip"} onClick={(event) => { legacy.setLocation('Biblioteca'); }}>
                        {"Biblioteca"}
                      </button>
                      <button type={"button"} className={"chip"} onClick={(event) => { legacy.setLocation('Puerta 1'); }}>
                        {"Puerta 1"}
                      </button>
                      <button type={"button"} className={"chip"} onClick={(event) => { legacy.setLocation('Cafetería del pabellón E'); }}>
                        {"Cafetería del pabellón E"}
                      </button>
                      <button type={"button"} className={"chip"} onClick={(event) => { legacy.setLocation('Explanada central'); }}>
                        {"Explanada central"}
                      </button>
                      <button type={"button"} className={"chip"} onClick={(event) => { legacy.setLocation('Patio del pabellón H'); }}>
                        {"Patio del pabellón H"}
                      </button>
                    </div>
                    <div className={"form-actions"}>
                      <button type={"button"} className={"btn btn-ghost"} onClick={(event) => { legacy.fillProfile(); }}>
                        {"Descartar"}
                      </button>
                      <button type={"submit"} className={"btn btn-primary"}>
                        {"Guardar cambios"}
                      </button>
                    </div>
                  </div>
                </form>
                <form id={"passwordForm"} className={"card"} onSubmit={(event) => { legacy.handleChangePassword(event); }} novalidate={""}>
                  <h2>
                    {"Cambiar contraseña"}
                  </h2>
                  <div className={"field"}>
                    <label htmlFor={"pwdCurrent"}>
                      {"Contraseña actual"}
                    </label>
                    <input type={"password"} id={"pwdCurrent"} placeholder={"••••••••••"} />
                    <span className={"error-msg"} id={"pwdCurrentError"}></span>
                  </div>
                  <div className={"row2"}>
                    <div className={"field"}>
                      <label htmlFor={"pwdNew"}>
                        {"Nueva contraseña"}
                      </label>
                      <input type={"password"} id={"pwdNew"} placeholder={"••••••••••"} />
                      <span className={"hint"}>
                        {"Mínimo 8 caracteres, una mayúscula y un número."}
                      </span>
                      <span className={"error-msg"} id={"pwdNewError"}></span>
                    </div>
                    <div className={"field"}>
                      <label htmlFor={"pwdConfirm"}>
                        {"Confirmar nueva contraseña"}
                      </label>
                      <input type={"password"} id={"pwdConfirm"} placeholder={"••••••••••"} />
                      <span className={"error-msg"} id={"pwdConfirmError"}></span>
                    </div>
                  </div>
                  <div className={"form-actions"}>
                    <button type={"submit"} className={"btn btn-secondary"}>
                      {"Actualizar contraseña"}
                    </button>
                  </div>
                </form>
              </div>
              <aside className={"stack"}>
                <div className={"card profile-card"}>
                  <div className={"avatar avatar-edit"} id={"profileAvatar"} onClick={(event) => { document.getElementById('avatarInput').click(); }} title={"Cambiar foto"} tabIndex={"0"}>
                    <span id={"profileAvatarText"}>
                      {"RQ"}
                    </span>
                    <span className={"avatar-overlay"}>
                      <i className={"fa-solid fa-camera"}></i>
                    </span>
                  </div>
                  <input type={"file"} id={"avatarInput"} accept={"image/png,image/jpeg,image/webp"} style={{ "display": "none" }} onChange={(event) => { legacy.handleAvatarChange(event); }} />
                  <button type={"button"} className={"btn btn-ghost"} id={"avatarRemoveBtn"} onClick={(event) => { legacy.removeAvatar(); }} style={{ "display": "none", "margin": "8px auto 0" }}>
                    {"Quitar foto"}
                  </button>
                  <h2 id={"profileName"}></h2>
                  <span className={"badge-ok"}>
                    <i className={"fa-solid fa-circle-check"}></i>
                    {" Verificado"}
                  </span>
                  <hr />
                  <p className={"eyebrow"}>
                    {"Cerrar sesión"}
                  </p>
                  <p className={"hint"} style={{ "margin": "6px 0 12px" }}>
                    {"En este dispositivo."}
                  </p>
                  <button className={"btn btn-secondary btn-block"} onClick={(event) => { legacy.logout(); }}>
                    {"Salir"}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>
        <section id={"catalogView"} className={"view-section"}>
          <div className={"wrap"}>
            <div className={"card empty"}>
              <div className={"big-icon"}>
                <i className={"fa-solid fa-book-open"}></i>
              </div>
              <h2>
                {"Catálogo"}
              </h2>
              <p className={"sub"}>
                {"Vista principal del rol USUARIO. Aquí se integra la HU-3."}
              </p>
            </div>
          </div>
        </section>
        <section id={"adminView"} className={"view-section"}>
          <div className={"wrap"}>
            <div className={"card empty"}>
              <div className={"big-icon"}>
                <i className={"fa-solid fa-inbox"}></i>
              </div>
              <h2>
                {"Bandeja de reportes"}
              </h2>
              <p className={"sub"}>
                {"Vista principal del rol ADMINISTRADOR. Aquí se integra la HU-7."}
              </p>
            </div>
          </div>
        </section>
        <section id={"deniedView"} className={"view-section"}>
          <div className={"wrap"}>
            <div className={"empty"}>
              <div className={"big-icon danger"}>
                <i className={"fa-solid fa-lock"}></i>
              </div>
              <h1>
                {"Acceso denegado"}
              </h1>
              <p className={"sub"} id={"deniedMsg"}></p>
              <button className={"btn btn-primary"} onClick={(event) => { legacy.goHome(); }}>
                {"Volver al catálogo"}
              </button>
            </div>
          </div>
        </section>
        <section id={"misPublicacionesView"} className={"view-section"}>
          <div className={"page-header"}>
            <div>
              <h2>
                {"Mis publicaciones"}
              </h2>
              <p className={"Subtitulo"} id={"misPubResumen"}>
                {"6 avisos · 9 ofertas por responder"}
              </p>
            </div>
            <button className={"Boton-PrimarioBiblioteca"} onClick={(event) => { legacy.showView('nuevoAvisoView'); }}>
              {"\n          Nuevo aviso\n        "}
            </button>
          </div>
          <div className={"filter-bar"}>
            <div className={"chip-group"} id={"misPubFiltros"}>
              <button className={"chip chip-active"} data-filtro={"todos"} onClick={(event) => { legacy.filtrarMisPublicaciones('todos'); }}>
                {"Todos ·\n            6"}
              </button>
              <button className={"chip"} data-filtro={"publicado"} onClick={(event) => { legacy.filtrarMisPublicaciones('publicado'); }}>
                {"Publicados ·\n            3"}
              </button>
              <button className={"chip"} data-filtro={"pausado"} onClick={(event) => { legacy.filtrarMisPublicaciones('pausado'); }}>
                {"Pausados · 1"}
              </button>
              <button className={"chip"} data-filtro={"borrador"} onClick={(event) => { legacy.filtrarMisPublicaciones('borrador'); }}>
                {"Borradores ·\n            1"}
              </button>
              <button className={"chip"} data-filtro={"vendido"} onClick={(event) => { legacy.filtrarMisPublicaciones('vendido'); }}>
                {"Vendidos · 1"}
              </button>
            </div>
            <div className={"search-inline"}>
              <i className={"fa-solid fa-magnifying-glass"}></i>
              <input type={"text"} id={"misPubBuscar"} placeholder={"Buscar en mis avisos…"} onInput={(event) => { legacy.buscarMisPublicaciones(event.currentTarget.value); }} />
            </div>
          </div>
          <table className={"tabla-avisos"}>
            <thead>
              <tr>
                <th>
                  {"Foto"}
                </th>
                <th>
                  {"Aviso"}
                </th>
                <th>
                  {"Precio"}
                </th>
                <th>
                  {"Estado"}
                </th>
                <th>
                  {"Ofertas"}
                </th>
                <th>
                  {"Publicado"}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody id={"misPubTbody"}>
              <tr data-propietario={"USR-001"} data-estado={"publicado"} data-demo-id={"seed-1"}>
                <td>
                  <div className={"foto-para-imagen"}><img src="/img/publicaciones/calculo-stewart.jpg" alt="Libro Cálculo de una variable de Stewart" loading="lazy" decoding="async" /></div>
                </td>
                <td>
                  <span className={"Titulo-aviso"}>
                    {"Cálculo de una variable - Stewart, 8.a ed."}
                  </span>
                  <span className={"aviso-meta"}>
                    {"Libros de texto . Cálculo I . Muy buen estado"}
                  </span>
                </td>
                <td className={"celda-precio"}>
                  {"S/ 95.00"}
                </td>
                <td>
                  <span className={"badge publicado-azul"}>
                    {"Publicado"}
                  </span>
                </td>
                <td className={"celda-ofertas-datos-incluidos"}>
                  {"4 ofertas"}
                </td>
                <td className={"Celda-Fecha"}>
                  {"18/08/2026"}
                </td>
                <td>
                  <button className={"Boton-para-acciones-tabla"}>
                    {"Acciones"}
                    <i className={"fa-solid fa-chevron"}></i>
                  </button>
                </td>
              </tr>
              <tr data-propietario={"USR-001"} data-estado={"publicado"} data-demo-id={"seed-2"}>
                <td>
                  <div className={"foto-para-imagen"}><img src="/img/publicaciones/calculadora-classwiz.jpg" alt="Calculadora científica Casio" loading="lazy" decoding="async" /></div>
                </td>
                <td>
                  <span className={"Titulo-aviso"}>
                    {"Calculadora científica ClassWiz fx-991"}
                  </span>
                  <span className={"aviso-meta"}>
                    {"Calculadoras · Física II · Como nuevo"}
                  </span>
                </td>
                <td className={"celda-precio"}>
                  {"S/ 120.00"}
                </td>
                <td>
                  <span className={"badge publicado-azul"}>
                    {"Publicado"}
                  </span>
                </td>
                <td className={"celda-ofertas-datos-incluidos"}>
                  {"3 ofertas"}
                </td>
                <td className={"Celda-Fecha"}>
                  {"22/08/2026"}
                </td>
                <td>
                  <button className={"Boton-para-acciones-tabla"}>
                    {"Acciones"}
                    <i className={"fa-solid fa-chevron"}></i>
                  </button>
                </td>
              </tr>
              <tr data-propietario={"USR-001"} data-estado={"pausado"} className={"fila-resaltada"} data-demo-id={"seed-3"}>
                <td>
                  <div className={"foto-para-imagen"}><img src="/img/publicaciones/juego-escuadras.jpg" alt="Juego de escuadras" loading="lazy" decoding="async" /></div>
                </td>
                <td>
                  <span className={"Titulo-aviso-alternativo"}>
                    {"Juego de escuadras y escalímetro Faber"}
                  </span>
                  <span className={"aviso-meta"}>
                    {"Instrumentos de dibujo · Dibujo Técnico · Buen estado"}
                  </span>
                </td>
                <td className={"celda-precio"}>
                  {"S/ 38.00"}
                </td>
                <td>
                  <span className={"badge publicado-yellow"}>
                    {"Pausado"}
                  </span>
                </td>
                <td className={"celda-ofertas-datos-incluidos"}>
                  {"2 ofertas"}
                </td>
                <td className={"Celda-Fecha"}>
                  {"10/08/2026"}
                </td>
                <td>
                  <button className={"Boton-para-acciones-tabla"}>
                    {"Acciones"}
                    <i className={"fa-solid fa-chevron"}></i>
                  </button>
                </td>
              </tr>
              <tr data-propietario={"USR-001"} data-estado={"publicado"} data-demo-id={"seed-4"}>
                <td>
                  <div className={"foto-para-imagen"}><img src="/img/publicaciones/apuntes-contabilidad.jpg" alt="Apuntes de contabilidad financiera" loading="lazy" decoding="async" /></div>
                </td>
                <td>
                  <span className={"Titulo-aviso"}>
                    {"Apuntes de Contabilidad General — 2 ciclos"}
                  </span>
                  <span className={"aviso-meta"}>
                    {"Apuntes y guías · Contabilidad General · Con marcas de uso"}
                  </span>
                </td>
                <td className={"celda-precio"}>
                  {"S/ 25.00"}
                </td>
                <td>
                  <span className={"badge publicado-azul"}>
                    {"Publicado"}
                  </span>
                </td>
                <td className={"celda-ofertas"}>
                  {"Sin ofertas"}
                </td>
                <td className={"Celda-Fecha"}>
                  {"29/08/2026"}
                </td>
                <td>
                  <button className={"Boton-para-acciones-tabla"}>
                    {"Acciones"}
                    <i className={"fa-solid fa-chevron"}></i>
                  </button>
                </td>
              </tr>
              <tr data-propietario={"USR-001"} data-estado={"borrador"} data-demo-id={"seed-5"}>
                <td>
                  <div className={"foto-vacia"}><img src="/img/publicaciones/mandil-laboratorio.jpg" alt="Mandil blanco de laboratorio" loading="lazy" decoding="async" /></div>
                </td>
                <td>
                  <span className={"Titulo-aviso"}>
                    {"Mandil de laboratorio talla M"}
                  </span>
                  <span className={"aviso-meta"}>
                    {"Uniformes y mandiles · Química General · Buen estado"}
                  </span>
                </td>
                <td className={"celda-precio"}>
                  {"S/ 45.00"}
                </td>
                <td>
                  <span className={"badge publicado-borrador"}>
                    {"Borrador"}
                  </span>
                </td>
                <td className={"celda-ofertas"}>
                  {"-"}
                </td>
                <td className={"Celda-Fecha"}>
                  {"Sin publicar"}
                </td>
                <td>
                  <button className={"Boton-para-acciones-tabla"}>
                    {"Acciones"}
                    <i className={"fa-solid fa-chevron"}></i>
                  </button>
                </td>
              </tr>
              <tr data-propietario={"USR-001"} data-estado={"vendido"} data-demo-id={"seed-6"}>
                <td>
                  <div className={"foto-para-imagen"}></div>
                </td>
                <td>
                  <span className={"Titulo-aviso"}>
                    {"Física para ciencias e ingeniería — Serway, tomo I"}
                  </span>
                  <span className={"aviso-meta"}>
                    {"Libros de texto · Física II · Buen estado"}
                  </span>
                </td>
                <td className={"celda-precio"}>
                  {"S/ 110.00"}
                </td>
                <td>
                  <span className={"badge publicado-verde"}>
                    {"Vendido"}
                  </span>
                </td>
                <td className={"celda-ofertas"}>
                  {"Cerrado con 1"}
                </td>
                <td className={"Celda-Fecha"}>
                  {"05/08/2026"}
                </td>
                <td>
                  <button className={"Boton-para-acciones-tabla"}>
                    {"Acciones"}
                    <i className={"fa-solid fa-chevron"}></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div id={"misPubSinAvisos"} className={"mis-pub-sin-avisos"} style={{ "display": "none" }}>
            <div className={"mis-pub-sin-avisos-contenido"}>
              <div className={"mis-pub-sin-avisos-icono"} aria-hidden={"true"}></div>
              <h2>
                {"Todavía no publicas nada"}
              </h2>
              <p>
                {"Ese libro del ciclo pasado le puede servir a alguien esta semana. Publicar un\n            aviso toma menos de tres minutos."}
              </p>
              <button type={"button"} className={"btn btn-primary"} onClick={(event) => { legacy.showView('nuevoAvisoView'); }}>
                {"\n            Crear mi primer aviso\n          "}
              </button>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} className={"mis-pub-enlace-ayuda"} onClick={(event) => { legacy.verComoFuncionaTablon(); }}>
                {"\n            Ver cómo funciona el tablón\n          "}
              </a>
            </div>
          </div>
          <div className={"estado-vacio"} id={"misPubVacio"} style={{ "display": "none" }}>
            <div className={"estado-vacio-icono"}>
              <i className={"fa-regular fa-folder-open"}></i>
            </div>
            <h3>
              {"Ningún aviso coincide"}
            </h3>
            <p className={"subtitle"}>
              {"Prueba con otro filtro o borra la búsqueda para ver todos tus avisos."}
            </p>
            <button className={"btn btn-primary"} onClick={(event) => { legacy.limpiarBusquedaMisPub(); }}>
              {"Ver todos mis avisos"}
            </button>
          </div>
          <div className={"paginacion"}>
            <span id={"misPubConteo"}>
              {"Mostrando 6 de 6 avisos"}
            </span>
            <div className={"Botones-paginacion"}>
              <button className={"bton-pagina"}>
                <i className={"fa-solid fa-chevron-left"}></i>
              </button>
              <button className={"bton-central-pagina"}>
                {"1"}
              </button>
              <button className={"bton-pagina"}>
                <i className={"fa-solid fa-chevron-right"}></i>
              </button>
            </div>
          </div>
        </section>
        <section id={"nuevoAvisoView"} className={"view-section"}>
          <div className={"nuevo-aviso-contenedor"}>
            <div className={"breadcrumb"}>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('misPublicacionesView'); }}>
                {"Mis publicaciones"}
              </a>
              <span>
                {"›"}
              </span>
              <span>
                {"Nuevo aviso"}
              </span>
            </div>
            <h1>
              {"Nuevo aviso"}
            </h1>
            <div id={"errorPublicarAviso"} className={"alerta-publicacion-error"} role={"alert"} aria-live={"polite"}>
              <strong>
                {"No pudimos publicar el aviso."}
              </strong>
              <span id={"resumenErroresAviso"}>
                {"Revisa los campos marcados en rojo."}
              </span>
            </div>
            <div className={"nuevo-aviso-grid"}>
              <div className={"nuevo-aviso-formulario"}>
                <div className={"seccion-aviso"}>
                  <h2>
                    {"1 · Producto"}
                  </h2>
                  <div className={"field"}>
                    <label htmlFor={"nuevoTitulo"}>
                      {"Título del aviso"}
                    </label>
                    <input type={"text"} id={"nuevoTitulo"} maxLength={"80"} defaultValue={"Cálculo de una variable — Stewart, 8.ª ed."} aria-describedby={"errorNuevoTitulo"} />
                    <span id={"errorNuevoTitulo"} className={"mensaje-campo-error"}>
                      {"\n                  El título debe tener al menos 15 caracteres e incluir autor o modelo.\n                "}
                    </span>
                    <span className={"hint"} id={"contadorTituloAviso"}>
                      {"\n                  Incluye autor y edición: así lo buscan tus compañeros.\n                "}
                    </span>
                  </div>
                  <div className={"field"}>
                    <label htmlFor={"nuevoDescripcion"}>
                      {"Descripción"}
                    </label>
                    <textarea id={"nuevoDescripcion"} aria-describedby={"errorNuevoDescripcion"} defaultValue={"Usado un ciclo en Cálculo I. Tapa firme, sin hojas sueltas, algunas anotaciones a lápiz en los capítulos 3 y 4. Incluye el separador original.\n        "} />
                    <span id={"errorNuevoDescripcion"} className={"mensaje-campo-error"}>
                      {"Ingresa una descripción del producto."}
                    </span>
                  </div>
                  <div className={"fila-formulario"}>
                    <div className={"field"}>
                      <label htmlFor={"nuevoCategoria"}>
                        {"Categoría"}
                      </label>
                      <select id={"nuevoCategoria"} aria-describedby={"errorNuevoCategoria"}>
                        <option value={""}>
                          {"Selecciona"}
                        </option>
                        <option value={"Libros de texto"}>
                          {"Libros de texto"}
                        </option>
                        <option value={"Calculadoras"}>
                          {"Calculadoras"}
                        </option>
                        <option value={"Instrumentos de dibujo"}>
                          {"Instrumentos de dibujo"}
                        </option>
                        <option value={"Apuntes y guías"}>
                          {"Apuntes y guías"}
                        </option>
                      </select>
                      <span id={"errorNuevoCategoria"} className={"mensaje-campo-error"}>
                        {"\n                    Este campo es obligatorio.\n                  "}
                      </span>
                    </div>
                    <div className={"field"}>
                      <label htmlFor={"nuevoCurso"}>
                        {"Curso asociado"}
                      </label>
                      <select id={"nuevoCurso"} aria-describedby={"errorNuevoCurso"}>
                        <option>
                          {"Cálculo I"}
                        </option>
                        <option>
                          {"Física II"}
                        </option>
                        <option>
                          {"Estadística Aplicada"}
                        </option>
                      </select>
                      <span id={"errorNuevoCurso"} className={"mensaje-campo-error"}>
                        {"Selecciona un curso asociado."}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={"seccion-aviso"}>
                  <h2>
                    {"2 · Condición"}
                  </h2>
                  <label>
                    {"Estado del producto"}
                  </label>
                  <div className={"condiciones"} id={"condicionesAviso"}>
                    <button type={"button"} className={"chip"} onClick={(event) => { legacy.elegirCondicion(event.currentTarget); }}>
                      {"Como nuevo"}
                    </button>
                    <button type={"button"} className={"chip chip-active"} onClick={(event) => { legacy.elegirCondicion(event.currentTarget); }}>
                      {"Muy buen estado"}
                    </button>
                    <button type={"button"} className={"chip"} onClick={(event) => { legacy.elegirCondicion(event.currentTarget); }}>
                      {"Buen estado"}
                    </button>
                    <button type={"button"} className={"chip"} onClick={(event) => { legacy.elegirCondicion(event.currentTarget); }}>
                      {"Con marcas de uso"}
                    </button>
                  </div>
                  <p className={"hint"}>
                    {"\n                Sé honesto: la calificación después del acuerdo depende de esto.\n              "}
                  </p>
                  <span id={"errorNuevoCondicion"} className={"mensaje-campo-error"}>
                    {"Selecciona el estado del producto."}
                  </span>
                </div>
                <div className={"columna-precio-fotos"}>
                  <div className={"seccion-aviso"}>
                    <h2>
                      {"3 · Precio"}
                    </h2>
                    <div className={"field precio-field"}>
                      <label>
                        {"Precio pedido"}
                      </label>
                      <div className={"input-precio"}>
                        <span>
                          {"S/"}
                        </span>
                        <input type={"number"} id={"nuevoPrecio"} defaultValue={"95.00"} min={"0.01"} step={"0.01"} aria-describedby={"errorNuevoPrecio"} />
                      </div>
                      <span id={"errorNuevoPrecio"} className={"mensaje-campo-error"}>
                        {"Ingresa un precio mayor que cero."}
                      </span>
                      <span className={"hint"}>
                        {"\n                    Rango sugerido para este título: S/ 80 – S/ 110.\n                  "}
                      </span>
                    </div>
                    <label className={"switch-ofertas"}>
                      <input id="aceptaOfertasMenores"
                        type="checkbox"
                        defaultChecked={true} />
                      <span className={"slider-ofertas"}></span>
                      <span>
                        {"Acepto ofertas por un monto menor"}
                      </span>
                    </label>
                    <div className={"field precio-field"} id="campoMinimoAviso">
                      <label>
                        {"Monto mínimo que aceptarás"}
                      </label>
                      <div className={"input-precio"} id={"contenedorMinimo"}>
                        <span>
                          {"S/"}
                        </span>
                        <input type={"number"} id={"nuevoMinimo"} defaultValue={"70.00"} min={"0"} step={"0.01"} aria-describedby={"errorNuevoMinimo"} />
                      </div>
                      <span id={"errorNuevoMinimo"} className={"mensaje-campo-error"}>
                        {"\n                    El mínimo no puede ser mayor que el precio pedido.\n                  "}
                      </span>
                    </div>
                  </div>
                  <div className={"seccion-aviso"} id={"seccionFotosNuevoAviso"}>
                    <h2>
                      {"4 · Fotografías"}
                    </h2>
                    <button type={"button"} id={"nuevoFotosZona"} className={"fotos-aviso-vacio"} onClick={(event) => { legacy.showView('fotosAvisoView'); }}>
                      <strong>
                        {"Arrastra tus fotografías aquí o selecciónalas"}
                      </strong>
                      <span id={"errorNuevoFotos"} className={"mensaje-campo-error"}>
                        {"Necesitas al menos una fotografía para publicar."}
                      </span>
                    </button>
                    <div className={"fotos-aviso"} id={"galeriaNuevoAviso"} hidden={true}>
                      <div className={"foto-principal"}>
                        <span>
                          {"Principal"}
                        </span>
                      </div>
                      <div className={"foto-secundaria"}></div>
                      <div className={"foto-secundaria"}></div>
                      <button type={"button"} className={"agregar-foto"} onClick={(event) => { legacy.showView('fotosAvisoView'); }}>
                        <i className={"fa-solid fa-plus"}></i>
                        <span>
                          {"Agregar foto"}
                        </span>
                      </button>
                    </div>
                    <p className={"hint"} id={"contadorFotosNuevoAviso"}>
                      {"\n                  Agrega hasta 6 fotografías para mostrar el producto.\n                "}
                    </p>
                  </div>
                </div>
              </div>
              <aside className={"nuevo-aviso-lateral"}>
                <div id={"camposCorregirAviso"} className={"campos-corregir-aviso"} hidden={true}>
                  <p className={"eyebrow"}>
                    {"Campos por corregir"}
                  </p>
                  <ul id={"listaErroresAviso"} />
                </div>

                <div className="vista-previa-aviso">
                  <p className="eyebrow">Vista previa de la tarjeta</p>
                  <div className="preview-imagen" id="previewImagenAviso">
                    <span id="previewSinFotoAviso">sin fotografía</span>
                  </div>
                <div className="preview-detalles-aviso">
                  <h3 id="previewTituloAviso">
                    Cálculo de una variable — Stewart, 8.ª ed.
                  </h3>

                  <strong
                    className="preview-precio"
                    id="previewPrecioAviso"
                  >
                    S/ 95.00
                  </strong>

                  <div className="preview-meta">
                    <span
                      id="previewCondicionAviso"
                      className="preview-chip preview-chip-condicion"
                    >
                      Muy buen estado
                    </span>

                    <span
                      id="previewCursoAviso"
                      className="preview-chip preview-chip-curso"
                    >
                      Cálculo I
                    </span>
                  </div>
                </div>
                </div>

                <div className={"antes-publicar"} id={"consejoNuevoAviso"}>
                  <h3>
                    {"Antes de publicar"}
                  </h3>
                  <p>
                    {"\n                Toma las fotos con luz natural, muestra la portada y el\n                estado real de las hojas. Un aviso con 3 fotografías recibe el doble de ofertas.\n\n              "}
                  </p>
                </div>
                <div className={"acciones-nuevo-aviso"}>
                  <button type={"button"} id={"btnPublicarNuevoAviso"} className={"btn btn-primary"} onClick={(event) => { legacy.validarPublicacion(); }}>
                    {"\n                Publicar\n              "}
                  </button>
                  <button type={"button"} className={"btn btn-secondary"} onClick={(event) => { legacy.guardarBorradorNuevoAviso(); }}>
                    {"\n                Guardar borrador\n              "}
                  </button>
                  <span id={"notaBorradorAviso"} className={"nota-borrador-aviso"} hidden={true}>
                    {"El borrador sí se guarda con errores."}
                  </span>
                  <button type={"button"} id={"cancelarNuevoAviso"} className={"btn btn-ghost"} onClick={(event) => { legacy.showView('misPublicacionesView'); }}>
                    {"\n                Cancelar\n              "}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>
        <section id={"fotosAvisoView"} className={"view-section"}>
          <div className={"nuevo-aviso-contenedor"}>
            <div className={"breadcrumb"}>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('misPublicacionesView'); }}>
                {"Mis publicaciones"}
              </a>
              <span>
                {"›"}
              </span>
              <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('nuevoAvisoView'); }}>
                {"Editar aviso"}
              </a>
              <span>
                {"›"}
              </span>
              <span>
                {"Fotografías"}
              </span>
            </div>
            <h1>
              {"Fotografías del aviso"}
            </h1>
            <p className={"sub fotos-sub"}>
              {"Máximo 6 imágenes, JPG o PNG de hasta 5 MB cada una. La primera será la portada."}
            </p>
            <div className={"fotos-layout"}>
              <div className={"fotos-card"}>
                <input type={"file"} id={"inputFotos"} accept={"image/jpeg,image/png"} multiple={true} hidden={true} />
                <div className={"dropzone"} id={"dropzoneFotos"} tabIndex={"0"} role={"button"} aria-label={"Arrastra tus fotografías aquí o búscalas en tu dispositivo"}>
                  <span className={"dropzone-icono"}>
                    <i className={"fa-solid fa-arrow-up"}></i>
                  </span>
                  <strong>
                    {"Arrastra tus fotografías aquí"}
                  </strong>
                  <span className={"dropzone-sub"}>
                    {"o "}
                    <a>
                      {"búscalas en tu dispositivo"}
                    </a>
                  </span>
                </div>
                <div className={"fotos-cabecera"}>
                  <p className={"eyebrow"} id={"fotosContador"}></p>
                  <span className={"hint"}>
                    {"Arrastra las miniaturas para reordenar"}
                  </span>
                </div>
                <div className={"fotos-grid"} id={"fotosGrid"}></div>
                <div className={"fotos-acciones"}>
                  <button type={"button"} className={"btn btn-ghost"} onClick={(event) => { legacy.cancelarFotos(); }}>
                    {"Cancelar"}
                  </button>
                  <button type={"button"} className={"btn btn-primary"} onClick={(event) => { legacy.guardarFotos(); }}>
                    {"Guardar fotografías"}
                  </button>
                </div>
              </div>
              <aside className={"fotos-lateral"}>
                <div className={"fotos-panel"} id={"panelReorden"}>
                  <p className={"eyebrow"}>
                    {"Reordenamiento en curso"}
                  </p>
                  <div className={"reorden-demo"}>
                    <div className={"reorden-mini reorden-mini-activa"}></div>
                    <div className={"reorden-barra"}></div>
                    <div className={"reorden-mini"}></div>
                  </div>
                  <p className={"hint"}>
                    {"La barra terracota marca la posición donde se soltará la miniatura."}
                  </p>
                </div>
                <div className={"fotos-panel"}>
                  <p className={"eyebrow"}>
                    {"Notificaciones de resultado"}
                  </p>
                  <div className={"aviso-resultado exito"}>
                    <b>
                      {"Éxito."}
                    </b>
                    {" Se guardaron 4 fotografías. La primera será la portada\n                del aviso."}
                  </div>
                  <div className={"aviso-resultado error"}>
                    <b>
                      {"Error."}
                    </b>
                    {" Una imagen no se pudo subir. Revísala e inténtalo otra\n                vez."}
                  </div>
                  <div className={"aviso-resultado limite"}>
                    <b>
                      {"Límite alcanzado."}
                    </b>
                    {" Ya tienes 6 de 6 fotografías; elimina una\n                para agregar otra."}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <span>
          {"Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600"}
        </span>
        <div>
          <a>
            {"Normas del tablón"}
          </a>
          <a>
            {"Mesa de ayuda"}
          </a>
          <a>
            {"tablon@ulima.edu.pe"}
          </a>
          <a role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }} onClick={(event) => { legacy.showView('adminView'); }}>
            {"Demo: ruta admin"}
          </a>
        </div>
      </footer>
      <div id={"menuAcciones"} className={"menu-acciones"} style={{ "display": "none" }}>
        <button type={"button"} onClick={(event) => { legacy.abrirModalEstado(); }}>
          <i className={"fa-solid fa-arrows-rotate"}></i>
          {" Cambiar estado\n    "}
        </button>
        <button type={"button"} className={"menu-acciones-peligro"} onClick={(event) => { legacy.abrirModalEliminar(); }}>
          <i className={"fa-regular fa-trash-can"}></i>
          {" Eliminar aviso\n    "}
        </button>
      </div>
      <div id={"modalEstado"} className={"modal-overlay"} style={{ "display": "none" }}>
        <div className={"modal-caja"} role={"dialog"} aria-modal={"true"} aria-labelledby={"modalEstadoTitulo"}>
          <h3 id={"modalEstadoTitulo"}>
            {"Cambiar el estado del aviso"}
          </h3>
          <p className={"modal-texto"} id={"modalEstadoTexto"}></p>
          <div className={"modal-opciones"}>
            <label className={"modal-opcion"}>
              <input type={"radio"} name={"nuevoEstado"} defaultValue={"pausado"} onChange={(event) => { legacy.alElegirEstado(); }} />
              {" Pausar temporalmente\n        "}
            </label>
            <label className={"modal-opcion"}>
              <input type={"radio"} name={"nuevoEstado"} defaultValue={"publicado"} onChange={(event) => { legacy.alElegirEstado(); }} />
              {" Reactivar y volver a\n          publicar\n        "}
            </label>
            <label className={"modal-opcion"}>
              <input type={"radio"} name={"nuevoEstado"} defaultValue={"vendido"} onChange={(event) => { legacy.alElegirEstado(); }} />
              {" Marcar como vendido\n        "}
            </label>
          </div>
          <div className={"modal-aviso"} id={"modalEstadoAviso"} style={{ "display": "none" }}></div>
          <div className={"modal-acciones"}>
            <button type={"button"} className={"btn btn-ghost"} onClick={(event) => { legacy.cerrarModales(); }}>
              {"Cancelar"}
            </button>
            <button type={"button"} className={"btn btn-primary"} id={"btnConfirmarEstado"} onClick={(event) => { legacy.confirmarCambioEstado(); }}>
              {"Confirmar cambio"}
            </button>
          </div>
        </div>
      </div>
      <div id={"modalEliminar"} className={"modal-overlay"} style={{ "display": "none" }}>
        <div className={"modal-caja"} role={"dialog"} aria-modal={"true"} aria-labelledby={"modalEliminarTitulo"}>
          <div className={"modal-icono-peligro"}>
            <i className={"fa-solid fa-triangle-exclamation"}></i>
          </div>
          <h3 id={"modalEliminarTitulo"}>
            {"Eliminar aviso"}
          </h3>
          <p className={"modal-texto"} id={"modalEliminarTexto"}></p>
          <div className={"modal-aviso modal-aviso-peligro"} id={"modalEliminarAviso"} style={{ "display": "none" }}></div>
          <div className={"field"}>
            <label htmlFor={"confirmarEliminarInput"}>
              {"Escribe ELIMINAR para confirmar"}
            </label>
            <input type={"text"} id={"confirmarEliminarInput"} autoComplete={"off"} onInput={(event) => { legacy.validarConfirmacionEliminar(); }} />
          </div>
          <div className={"modal-acciones"}>
            <button type={"button"} className={"btn btn-ghost"} onClick={(event) => { legacy.cerrarModales(); }}>
              {"Cancelar"}
            </button>
            <button type={"button"} className={"btn btn-danger"} id={"btnConfirmarEliminar"} onClick={(event) => { legacy.confirmarEliminar(); }}>
              {"Eliminar aviso"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
