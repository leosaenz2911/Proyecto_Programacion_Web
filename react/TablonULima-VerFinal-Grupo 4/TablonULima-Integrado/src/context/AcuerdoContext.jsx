import { createContext, useContext, useState } from 'react';

// 1. Importa las imágenes desde la carpeta assets
import imgQuimica from '../assets/QuimicaGeneral.jpg';
import imgCalculadora from '../assets/CalculadoraCasio.jfif';

const AcuerdoContext = createContext();

export const AcuerdoProvider = ({ children }) => {
  // 2. Agrega la propiedad "imagen" a tus mockups iniciales
  const [acuerdos, setAcuerdos] = useState([
    {
      id: "AC-101", 
      producto: "Química General — Chang, 11.ª ed.",
      contraparte: "Marco Antonio Loayza", 
      rol: "Comprador", 
      monto: 72.00,
      estado: "Pendiente", 
      lugar: "Biblioteca (Primer piso)", 
      fecha: "2026-10-15T10:00", 
      codigo: null,
      imagen: imgQuimica // <--- Imagen agregada aquí
    },
    {
      id: "AC-102", 
      producto: "Calculadora Científica fx-991",
      contraparte: "Lucía Fernández", 
      rol: "Vendedor", 
      monto: 110.00,
      estado: "Acordado", 
      lugar: "Cafetería del pabellón E", 
      fecha: "2026-10-14T13:00", 
      codigo: "U-7894",
      imagen: imgCalculadora // <--- Imagen agregada aquí
    }
  ]); 

  const agregarAcuerdo = (nuevoAcuerdo) => {
    setAcuerdos(prev => [nuevoAcuerdo, ...prev]);
  };

  const actualizarEstadoAcuerdo = (id, nuevoEstado, codigo = null) => {
    setAcuerdos(prev => prev.map(a => a.id === id ? { ...a, estado: nuevoEstado, ...(codigo && {codigo}) } : a));
  }

  return (
    <AcuerdoContext.Provider value={{ acuerdos, agregarAcuerdo, actualizarEstadoAcuerdo }}>
      {children}
    </AcuerdoContext.Provider>
  );
};

export const useAcuerdo = () => useContext(AcuerdoContext);