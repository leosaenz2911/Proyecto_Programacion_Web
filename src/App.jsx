import { useEffect, useRef, useState } from "react";
import { AVISOS_DATA } from "./data/avisos.js";
import Header from "./components/Header.jsx";
import NavBar from "./components/NavBar.jsx";
import Catalogo from "./components/Catalogo.jsx";
import DetalleAviso from "./components/DetalleAviso.jsx";
import Favoritos from "./components/Favoritos.jsx";
import PerfilVendedor from "./components/PerfilVendedor.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [vista, setVista] = useState("catalogo"); // catalogo | detalle | favoritos | perfil
  const [avisos, setAvisos] = useState(AVISOS_DATA);
  const [avisoActualId, setAvisoActualId] = useState(null);

  // Búsqueda: lo que se escribe vs. lo que ya se aplicó con Enter
  const [busqueda, setBusqueda] = useState("cálculo");
  const [filtro, setFiltro] = useState("");
  const [terminoMostrado, setTerminoMostrado] = useState("cálculo");
  const [cargando, setCargando] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const resultados = avisos.filter((a) =>
    a.titulo.toLowerCase().includes(filtro)
  );
  const favoritos = avisos.filter((a) => a.fav);
  const avisoActual = avisos.find((a) => a.id === avisoActualId);

  // Simula la carga con esqueletos (600 ms) antes de mostrar resultados
  function buscar() {
    const query = busqueda.toLowerCase().trim();
    clearTimeout(timerRef.current);
    setCargando(true);
    timerRef.current = setTimeout(() => {
      setFiltro(query);
      setTerminoMostrado(busqueda.trim());
      setCargando(false);
    }, 600);
  }

  function limpiar() {
    clearTimeout(timerRef.current);
    setCargando(false);
    setBusqueda("");
    setFiltro("");
    setTerminoMostrado("");
  }

  function toggleFav(id) {
    setAvisos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, fav: !a.fav } : a))
    );
  }

  function abrirDetalle(aviso) {
    setAvisoActualId(aviso.id);
    setVista("detalle");
  }

  return (
    <>
      <Header
        busqueda={busqueda}
        onCambiarBusqueda={setBusqueda}
        onBuscar={buscar}
      />
      <NavBar vista={vista} onNavegar={setVista} />

      {vista === "catalogo" && (
        <Catalogo
          resultados={resultados}
          cargando={cargando}
          terminoMostrado={terminoMostrado}
          onAbrir={abrirDetalle}
          onToggleFav={toggleFav}
          onLimpiar={limpiar}
        />
      )}

      {vista === "detalle" && avisoActual && (
        <DetalleAviso
          aviso={avisoActual}
          onVerPerfil={() => setVista("perfil")}
        />
      )}

      {vista === "favoritos" && (
        <Favoritos
          favoritos={favoritos}
          onToggleFav={toggleFav}
          onExplorar={() => setVista("catalogo")}
        />
      )}

      {vista === "perfil" && <PerfilVendedor avisos={avisos} />}

      <Footer />
    </>
  );
}
