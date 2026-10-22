export default function Header({ busqueda, onCambiarBusqueda, onBuscar }) {
  return (
    <header className="top-bar">
      <div className="brand">
        <span className="logo-icon"></span>
        <span className="logo-text">Tablón ULima</span>
      </div>

      <div className="search-container">
        <input
          type="text"
          value={busqueda}
          placeholder="Buscar libros, calculadoras, apuntes..."
          onChange={(e) => onCambiarBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onBuscar()}
        />
      </div>

      <div className="top-actions">
        <button className="btn btn-primary btn-sm">Publicar aviso</button>
        <span className="badge-role role-usuario">USUARIO</span>
        <div className="user-profile">
          <span className="avatar-circle">DV</span>
          <span className="username">Diego Vargas ▾</span>
        </div>
      </div>
    </header>
  );
}
