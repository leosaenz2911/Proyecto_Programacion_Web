import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { inicialPublicacionesRecibidas, inicialOfertasEnviadas } from '../data/ofertasData';

const OfertaContext = createContext();

export const OfertaProvider = ({ children }) => {
  const [publicacionesRecibidas, setPublicacionesRecibidas] = useState(inicialPublicacionesRecibidas);
  const [ofertasEnviadas, setOfertasEnviadas] = useState(inicialOfertasEnviadas);
  const { user } = useAuth();
  const usuarioActual = user ? `${user.nombres.split(' ')[0]} ${user.apellidos.split(' ')[0]}` : '';

  const actualizarEstadoOferta = (id, nuevoEstado) => {
    setPublicacionesRecibidas(prev =>
      prev.map(pub => ({
        ...pub,
        ofertas: pub.ofertas.map(o => o.id === id ? { ...o, estado: nuevoEstado, esMejorOferta: false } : o)
      }))
    );

    setOfertasEnviadas(prev =>
      prev.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o)
    );
  };

  const retirarOfertaEnviada = (id) => {
    setOfertasEnviadas(prev => prev.filter(o => o.id !== id));
  };

  const agregarMensajeHistorial = (id, nuevoMensaje) => {
    setPublicacionesRecibidas(prev =>
      prev.map(pub => ({
        ...pub,
        ofertas: pub.ofertas.map(o => o.id === id ? { ...o, historial: [...o.historial, nuevoMensaje] } : o)
      }))
    );
  };

  const agregarOfertaEnviada = (nuevaOferta) => {
    setOfertasEnviadas(prev => [nuevaOferta, ...prev]);
  };

  return (
    <OfertaContext.Provider value={{
      usuarioActual,
      publicacionesRecibidas,
      ofertasEnviadas,
      actualizarEstadoOferta,
      retirarOfertaEnviada,
      agregarMensajeHistorial,
      agregarOfertaEnviada
    }}>
      {children}
    </OfertaContext.Provider>
  );
};

export const useOferta = () => useContext(OfertaContext);