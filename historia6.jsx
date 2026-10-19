import React, { useState } from 'react';
import './css_historia6.css'; // Asegúrate de que el archivo CSS esté en la misma carpeta

// --- DATOS SIMULADOS ---
const INITIAL_PENDING = [
  {
    id: 'A-2201',
    productTitle: 'Juego de escuadras y escalímetro Faber',
    date: '01/09/2026',
    location: 'Patio del pabellón H',
    price: 'S/ 34.00',
    counterpart: { id: 'U-205', name: 'Carla Huamaní Bravo', rol: 'Compradora', career: 'Arquitectura, sexto ciclo' },
    deadline: '08/09/2026'
  },
  {
    id: 'A-2109',
    productTitle: 'Cálculo - Larson, tomo I',
    date: '26/08/2026',
    location: 'Puerta 1',
    price: 'S/ 70.00',
    counterpart: { id: 'U-301', name: 'Iván Palomino Rojas', rol: 'Vendedor', career: 'Economía, quinto ciclo' },
    deadline: '02/09/2026'
  }
];

const INITIAL_RECEIVED = [
  { authorId: 'U-402', authorName: 'Lucía Ramírez Ccahuana', stars: 5, date: '15/08/2026', text: 'Todo excelente, el libro estaba en perfectas condiciones y fue muy puntual.' },
  { authorId: 'U-505', authorName: 'Sebastián Ochoa Núñez', stars: 4, date: '02/08/2026', text: 'Buen vendedor, aunque tuvimos que cambiar la hora a último minuto.' }
];

export default function Historia6() {
  // --- ESTADOS DE NAVEGACIÓN ---
  const [currentView, setCurrentView] = useState('myRatingsView'); // 'myRatingsView', 'rateView', 'publicProfileView'
  const [activeTab, setActiveTab] = useState('emitidas'); // 'emitidas' o 'recibidas'
  
  // --- ESTADOS DE DATOS ---
  const [pendingAgreements, setPendingAgreements] = useState(INITIAL_PENDING);
  const [mySentRatings, setMySentRatings] = useState([]);
  const [myReceivedRatings, setMyReceivedRatings] = useState(INITIAL_RECEIVED);
  
  // --- ESTADOS PARA EL FORMULARIO DE CALIFICACIÓN ---
  const [activeAgreementToRate, setActiveAgreementToRate] = useState(null);
  const [ratingStars, setRatingStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [commentText, setCommentText] = useState('');

  // --- ESTADOS PARA PERFIL PÚBLICO ---
  const [profileData, setProfileData] = useState(null);

  // --- FUNCIONES DE UTILIDAD ---
  const getInitials = (name) => name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const rateTexts = ["Malo", "Regular", "Aceptable", "Bueno", "Excelente"];
  const availableChips = ["Puntualidad", "Buena comunicación", "Producto como se describía", "Flexibilidad con el horario"];

  // --- MANEJADORES DE EVENTOS ---
  const handleOpenRateForm = (agreement) => {
    setActiveAgreementToRate(agreement);
    setRatingStars(0);
    setHoverStars(0);
    setSelectedChips([]);
    setCommentText('');
    setCurrentView('rateView');
  };

  const handleToggleChip = (chip) => {
    setSelectedChips(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    const newRating = {
      targetId: activeAgreementToRate.counterpart.id,
      targetName: activeAgreementToRate.counterpart.name,
      agreement: activeAgreementToRate.productTitle,
      stars: ratingStars,
      date: 'Hoy',
      text: commentText,
      editable: true
    };

    setMySentRatings([newRating, ...mySentRatings]);
    setPendingAgreements(pendingAgreements.filter(a => a.id !== activeAgreementToRate.id));
    alert("Calificación publicada correctamente.");
    setCurrentView('myRatingsView');
  };

  const handleOpenProfile = (userId, userName) => {
    setProfileData({
      id: userId,
      name: userName,
      career: 'Arquitectura - sexto ciclo - en el tablón desde marzo de 2026',
      avgStars: 4.8,
      totalReviews: 11,
      agreements: 12,
      reviews: INITIAL_RECEIVED // Mock de reseñas de ese usuario
    });
    setCurrentView('publicProfileView');
  };

  // --- CÁLCULOS PARA LA VISTA 6.3 ---
  const currentList = activeTab === 'emitidas' ? mySentRatings : myReceivedRatings;
  const avgCalculation = currentList.length > 0 
    ? (currentList.reduce((acc, r) => acc + r.stars, 0) / currentList.length).toFixed(1) 
    : '0.0';

  return (
    <div className="container">
      
      {/* ========================================== */}
      {/* VISTA 6.3: MIS CALIFICACIONES              */}
      {/* ========================================== */}
      {currentView === 'myRatingsView' && (
        <section className="view-section active">
          <div className="wrap">
            <div className="page-head" style={{ paddingBottom: 0 }}>
              <h1>Mis calificaciones</h1>
            </div>
            
            <div className="custom-tabs" style={{ marginTop: 24 }}>
              <button 
                className={`tab-btn ${activeTab === 'emitidas' ? 'active' : ''}`} 
                onClick={() => setActiveTab('emitidas')}
              >
                Emitidas <span>({mySentRatings.length + pendingAgreements.length})</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'recibidas' ? 'active' : ''}`} 
                onClick={() => setActiveTab('recibidas')}
              >
                Recibidas <span>({myReceivedRatings.length})</span>
              </button>
            </div>
            
            <div className="layout-grid-hu6">
              <div className="ratings-list">
                
                {/* --- PESTAÑA EMITIDAS --- */}
                {activeTab === 'emitidas' && (
                  <>
                    {/* Lista de Pendientes por calificar */}
                    {pendingAgreements.map(ag => (
                      <div key={ag.id} className="review-item" style={{ borderLeft: '4px solid var(--err)' }}>
                        <div className="review-header" style={{ alignItems: 'center', margin: 0 }}>
                          <div>
                            <strong className="review-item-title">{ag.productTitle}</strong>
                            <p className="hint" style={{ marginTop: 4 }}>{ag.id} a {ag.counterpart.name} • Entregado el {ag.date}</p>
                          </div>
                          <button className="btn btn-primary" onClick={() => handleOpenRateForm(ag)}>Calificar</button>
                        </div>
                      </div>
                    ))}

                    {/* Lista de Ya Calificadas */}
                    {mySentRatings.map((r, i) => (
                      <div key={i} className="review-item">
                        <div className="review-header">
                          <div>
                            <strong className="review-item-title" onClick={() => handleOpenProfile(r.targetId, r.targetName)}>
                              {r.agreement} - a {r.targetName}
                            </strong>
                            <div style={{ color: 'var(--terracota)', fontSize: 18, marginTop: 4, letterSpacing: 2 }}>
                              {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 13, border: '1px solid var(--border)', marginBottom: 8 }}>Editar</button>
                            <div className="review-date">{r.date}</div>
                          </div>
                        </div>
                        <p className="review-text" style={{ color: r.text ? 'inherit' : 'var(--muted)' }}>
                          {r.text || 'Sin comentario.'}
                        </p>
                      </div>
                    ))}
                    {pendingAgreements.length === 0 && mySentRatings.length === 0 && (
                      <p className="hint" style={{ padding: 24 }}>No hay calificaciones emitidas ni pendientes.</p>
                    )}
                  </>
                )}

                {/* --- PESTAÑA RECIBIDAS --- */}
                {activeTab === 'recibidas' && (
                  <>
                    {myReceivedRatings.map((r, i) => (
                      <div key={i} className="review-item" style={{ borderBottom: '1px solid var(--border)', borderRadius: 0, boxShadow: 'none', padding: '24px 32px', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
                        <div className="review-header">
                          <div style={{ color: 'var(--terracota)', fontSize: 18, letterSpacing: 2 }}>
                            {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                          </div>
                          <div className="review-date">{r.date}</div>
                        </div>
                        <p className="review-text">{r.text}</p>
                        <div className="review-author" onClick={() => handleOpenProfile(r.authorId, r.authorName)}>
                          <div className="author-avatar-sm">{getInitials(r.authorName)}</div> 
                          {r.authorName}
                        </div>
                      </div>
                    ))}
                    {myReceivedRatings.length === 0 && (
                      <p className="hint" style={{ padding: 24 }}>No hay calificaciones recibidas.</p>
                    )}
                  </>
                )}

              </div>
              
              {/* Tarjeta lateral de resumen */}
              <aside>
                <div className="card" style={{ padding: 24 }}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>PESTAÑA «{activeTab.toUpperCase()}»</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: 'var(--ink)' }}>{avgCalculation}</span>
                    <div>
                      <div style={{ color: 'var(--terracota)', fontSize: 16, letterSpacing: 2 }}>
                        {avgCalculation > 0 ? '★'.repeat(Math.round(avgCalculation)) + '☆'.repeat(5 - Math.round(avgCalculation)) : '☆☆☆☆☆'}
                      </div>
                      <div className="hint">promedio de {currentList.length} calificaciones</div>
                    </div>
                  </div>
                  {activeTab === 'recibidas' && avgCalculation >= 4.5 && currentList.length >= 2 && (
                    <span className="badge-ok" style={{ marginTop: 0 }}><i className="fa-solid fa-circle-check"></i> Vendedor confiable</span>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ========================================== */}
      {/* VISTA 6.1: FORMULARIO DE CALIFICACIÓN      */}
      {/* ========================================== */}
      {currentView === 'rateView' && activeAgreementToRate && (
        <section className="view-section active">
          <div className="wrap" style={{ paddingTop: 28 }}>
            <div style={{ maxWidth: 720 }}>
              <div className="hint" style={{ marginBottom: 16 }}>
                Mis acuerdos &gt; <span>{activeAgreementToRate.id}</span> &gt; <strong style={{ color: 'var(--ink)' }}>Calificar</strong>
              </div>
              
              <h1 style={{ marginBottom: 8 }}>¿Cómo te fue?</h1>
              <p className="sub" style={{ marginBottom: 32 }}>Tu calificación es pública y ayuda a que el tablón siga siendo confiable.</p>

              <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32, padding: 24 }}>
                <div style={{ width: 64, height: 64, backgroundColor: 'var(--border)', borderRadius: 8, flexShrink: 0 }}></div>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{activeAgreementToRate.productTitle}</h3>
                  <p className="hint" style={{ marginBottom: 6 }}>Acuerdo {activeAgreementToRate.id} • entregado el {activeAgreementToRate.date} • {activeAgreementToRate.location}</p>
                  <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: 0 }}>
                    {activeAgreementToRate.price} <span style={{ fontWeight: 400, fontSize: 14, color: 'var(--muted)' }}>• {activeAgreementToRate.counterpart.rol.toLowerCase()}: {activeAgreementToRate.counterpart.name}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitRating}>
                <div className="field" style={{ marginBottom: 32 }}>
                  <label>TU PUNTAJE</label>
                  <div className="rate-stars" style={{ marginBottom: 8 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span 
                        key={star} 
                        className={star <= (hoverStars || ratingStars) ? 'active' : ''}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        onClick={() => setRatingStars(star)}
                      >★</span>
                    ))}
                  </div>
                  <span className="hint">
                    {ratingStars > 0 ? <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{ratingStars} de 5 - {rateTexts[ratingStars - 1]}</strong> : 'Selecciona un puntaje para publicar tu calificación.'}
                  </span>
                </div>

                <div className="field" style={{ marginBottom: 32 }}>
                  <label>¿QUÉ DESTACARÍAS? (OPCIONAL)</label>
                  <div className="chips">
                    {availableChips.map(chip => (
                      <button 
                        key={chip} 
                        type="button" 
                        className={`chip ${selectedChips.includes(chip) ? 'active' : ''}`}
                        onClick={() => handleToggleChip(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field" style={{ marginBottom: 8 }}>
                  <label>COMENTARIO</label>
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Cuéntale brevemente qué pasó..." 
                    maxLength="300" 
                    style={{ height: 100, resize: 'none', padding: 12, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', outline: 'none', background: 'var(--surface)' }}
                  />
                  <span className="hint" style={{ marginTop: 6 }}>{commentText.length}/300 caracteres. Evita datos personales.</span>
                </div>

                <p className="hint" style={{ margin: '24px 0 32px 0' }}>Puedes editar tu calificación hasta el {activeAgreementToRate.deadline}.</p>

                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setCurrentView('myRatingsView')}>Calificar después</button>
                  <button type="submit" className="btn btn-primary" disabled={ratingStars === 0}>Publicar calificación</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ========================================== */}
      {/* VISTA 6.2: PERFIL PÚBLICO                  */}
      {/* ========================================== */}
      {currentView === 'publicProfileView' && profileData && (
        <section className="view-section active">
          <div className="wrap" style={{ paddingTop: 28 }}>
            <div className="hint" style={{ marginBottom: 24 }}>
              <span style={{ cursor: 'pointer', color: 'var(--muted)', textDecoration: 'none' }} onClick={() => setCurrentView('myRatingsView')}>Atrás</span> &gt; <strong style={{ color: 'var(--ink)' }}>Perfil público</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 40 }}>
              <div className="avatar" style={{ width: 88, height: 88, fontSize: 28 }}>{getInitials(profileData.name)}</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span>{profileData.name}</span>
                  {profileData.avgStars >= 4.5 && (
                    <span className="badge-ok" style={{ marginTop: 0, fontSize: 12 }}><i className="fa-solid fa-circle-check"></i> Vendedor confiable</span>
                  )}
                </h1>
                <p className="sub" style={{ fontSize: 15, marginBottom: 24 }}>{profileData.career}</p>
                <div style={{ display: 'flex', gap: 40 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>{profileData.avgStars} ★</div>
                    <div className="hint">de {profileData.totalReviews} calificaciones</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>{profileData.agreements}</div>
                    <div className="hint">acuerdos cerrados</div>
                  </div>
                </div>
              </div>
              <div>
                <button className="btn btn-secondary" style={{ color: 'var(--err)', borderColor: 'var(--border)' }}><i className="fa-solid fa-flag"></i> Reportar usuario</button>
              </div>
            </div>

            <h2 style={{ marginBottom: 16 }}>Últimas calificaciones recibidas</h2>
            <div className="card" style={{ padding: 0 }}>
              {profileData.reviews.map((r, i) => (
                <div key={i} className="review-item" style={{ borderRadius: 0, borderBottom: '1px solid var(--border)', boxShadow: 'none', padding: '24px 32px', borderLeft: 'none', borderTop: 'none', borderRight: 'none' }}>
                  <div className="review-header">
                    <div style={{ color: 'var(--terracota)', fontSize: 18, letterSpacing: 2 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                    <div className="review-date">{r.date}</div>
                  </div>
                  <p className="review-text">{r.text}</p>
                  <div className="review-author">
                    <div className="author-avatar-sm">{getInitials(r.authorName)}</div> 
                    {r.authorName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}