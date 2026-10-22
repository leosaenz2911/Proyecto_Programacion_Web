function iniciales(nombre) {
  const p = nombre.split(" ");
  return (p[0][0] + (p.length >= 3 ? p[2][0] : p[1]?.[0] ?? "")).toUpperCase();
}

export default function DetalleAviso({ aviso, onVerPerfil }) {
  return (
    <div className="detail-section view-section">
      <div className="breadcrumb">
        {`Catálogo > ${aviso.categoria} > ${aviso.curso}`}
      </div>

      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-main-img">
            <span>fotografía principal · portada del libro</span>
          </div>
          <div className="thumbnails-grid">
            <div className="thumb active"></div>
            <div className="thumb"></div>
            <div className="thumb"></div>
            <div className="thumb"></div>
          </div>

          <div className="detail-description-card">
            <h3>Descripción</h3>
            <p>
              Usado un ciclo en Cálculo I con el profesor Mendoza. Tapa firme,
              sin hojas sueltas, algunas anotaciones a lápiz en los capítulos 3
              y 4. Incluye el separador original y la tabla de derivadas que
              reparten en clase.
            </p>
            <div className="specs-grid">
              <div>
                <span className="spec-label">CATEGORÍA</span>
                <br />
                <strong>{aviso.categoria}</strong>
              </div>
              <div>
                <span className="spec-label">CURSO</span>
                <br />
                <strong>{aviso.curso}</strong>
              </div>
              <div>
                <span className="spec-label">ESTADO</span>
                <br />
                <strong>{aviso.estado}</strong>
              </div>
              <div>
                <span className="spec-label">PUBLICADO</span>
                <br />
                <strong>18/08/2026</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-right">
          <div className="action-card">
            <span className="chip-badge chip-info">Publicado</span>
            <h2>{aviso.titulo}</h2>
            <div className="detail-price">{aviso.precio}</div>
            <div className="detail-min-price">Acepta ofertas desde S/ 70.00</div>

            <div className="guest-notice-box">
              Inicia sesión con tu correo institucional para ofertar o guardar
              este aviso en favoritos.
            </div>

            <button className="btn btn-primary btn-block">Ingresar para ofertar</button>
            <button className="btn btn-secondary btn-block">♥ Guardar en favoritos</button>
          </div>

          <div className="seller-mini-card">
            <span className="seller-lbl">VENDEDOR</span>
            <div className="seller-mini-header">
              <div className="avatar-pink-sm">{iniciales(aviso.vendedor)}</div>
              <div>
                <strong>{aviso.vendedor}</strong>
                <p>Administración · cuarto ciclo · en el tablón desde 03/2026</p>
              </div>
            </div>
            <div className="seller-rating-line">
              <strong>4.8 ★★★★★</strong> · 12 acuerdos cerrados{" "}
              <span className="chip-badge chip-success-sm">Vendedor confiable</span>
            </div>
            <button className="btn-link" onClick={onVerPerfil}>
              Ver perfil y sus otros 5 avisos →
            </button>
          </div>

          <button className="btn-link btn-report-link">
            ¿Este aviso incumple las normas del tablón? <span>Reportar aviso</span>
          </button>
        </div>
      </div>
    </div>
  );
}
