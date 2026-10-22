const ITEMS = [
  { label: "Catálogo", vista: "catalogo" },
  { label: "Mis publicaciones" },
  { label: "Favoritos", vista: "favoritos" },
  { label: "Ofertas" },
  { label: "Acuerdos" },
  { label: "Calificaciones" },
  { label: "Mi cuenta" },
];

export default function NavBar({ vista, onNavegar }) {
  // Detalle y perfil cuelgan de la sección Catálogo
  const seccionActiva = vista === "favoritos" ? "favoritos" : "catalogo";

  return (
    <nav className="nav-bar">
      {ITEMS.map((item) => (
        <a
          key={item.label}
          href="#"
          className={`nav-link ${item.vista === seccionActiva ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            if (item.vista) onNavegar(item.vista);
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
