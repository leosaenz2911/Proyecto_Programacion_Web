import fisicaPE from '../assets/FisicaUniversitariaPE.jfif';
import fisica13 from '../assets/FisicaUniversitaria.jfif';
import calcFin from '../assets/CalculadoraFinanciera.webp';
import tablaQuim from '../assets/TablaPeriodicaQuimica.jpg';
import quimGen from '../assets/QuimicaGeneral.jpg';
import estucheStaedtler from '../assets/EstucheStaedtler.jfif';
import calculoLarson from '../assets/CalculoLarson.jfif';
import mochilaLaptop from '../assets/MochilaLaptop.webp';

export const inicialPublicacionesRecibidas = [
  {
    idAviso: "A01",
    tituloAviso: "Física Universitaria con Física Moderna — Sears & Zemansky, 13.ª ed.",
    precioPublicado: 110.00,
    montoMinimo: 80.00,
    ofertas: [
      {
        id: 101,
        comprador: "Carlos Mendoza Silva",
        calificacion: "4.8 ★",
        montoOfertado: 95.00,
        fecha: "30/08/2026",
        estado: "Recibida",
        esMejorOferta: true,
        imagen: fisicaPE,
        historial: [{ emisor: "Carlos Mendoza Silva", monto: 95.00, texto: "Hola, te ofrezco 95.", fecha: "30/08/2026 14:20" }]
      },
      {
        id: 102,
        comprador: "Lucía Fernández Vega",
        calificacion: "4.2 ★",
        montoOfertado: 85.00,
        fecha: "29/08/2026",
        estado: "Recibida",
        esMejorOferta: false,
        imagen: fisica13,
        historial: [{ emisor: "Lucía Fernández Vega", monto: 85.00, texto: "¿Disponible?", fecha: "29/08/2026 10:15" }]
      }
    ]
  },
  {
    idAviso: "A02",
    tituloAviso: "Calculadora Financiera HP 10bII+",
    precioPublicado: 140.00,
    montoMinimo: 110.00,
    ofertas: [
      {
        id: 103,
        comprador: "Mateo Gutiérrez Ruiz",
        calificacion: "4.6 ★",
        montoOfertado: 120.00,
        fecha: "28/08/2026",
        estado: "Contraofertada",
        esMejorOferta: false,
        imagen: calcFin,
        historial: [
          { emisor: "Mateo Gutiérrez Ruiz", monto: 120.00, texto: "Ofrezco 120.", fecha: "27/08/2026 18:00" },
          { emisor: "Rosa Quispe", monto: 130.00, texto: "Lo dejo en 130.", fecha: "28/08/2026 09:30" }
        ]
      }
    ]
  },
  {
    idAviso: "A03",
    tituloAviso: "Tabla Periódica e Instrumentos Químicos",
    precioPublicado: 45.00,
    montoMinimo: 35.00,
    ofertas: [
      {
        id: 104,
        comprador: "Sofía Alva Castro",
        calificacion: "4.9 ★",
        montoOfertado: 40.00,
        fecha: "27/08/2026",
        estado: "Aceptada",
        esMejorOferta: false,
        imagen: tablaQuim,
        historial: [{ emisor: "Sofía Alva Castro", monto: 40.00, texto: "Trato hecho.", fecha: "27/08/2026" }]
      }
    ]
  }
];

export const inicialOfertasEnviadas = [
  {
    id: 1,
    titulo: "Química General — Chang, 11.ª ed.",
    vendedor: "Marco Antonio Loayza Pinto",
    calificacion: "4.3 ★",
    fecha: "30/08/2026",
    precioPedido: 85.00,
    montoMinimo: 65.00,
    montoOfertado: 72.00,
    estado: "Enviada",
    imagen: quimGen,
    historial: [{ emisor: "Rosa Quispe", monto: 72.00, texto: "Hola, te ofrezco 72.", fecha: "30/08/2026 11:00" }]
  },
  {
    id: 2,
    titulo: "Estuche de dibujo técnico Staedtler",
    vendedor: "Paola Zegarra Ibáñez",
    calificacion: "4.4 ★",
    fecha: "29/08/2026",
    precioPedido: 55.00,
    montoMinimo: 40.00,
    contraofertaMonto: 48.00,
    montoOfertado: 42.00,
    estado: "Contraofertada",
    imagen: estucheStaedtler,
    historial: [
      { emisor: "Rosa Quispe", monto: 42.00, texto: "Te ofrezco 42.", fecha: "28/08/2026 15:40" },
      { emisor: "Paola Zegarra Ibáñez", monto: 48.00, texto: "Mínimo 48.", fecha: "29/08/2026 10:20" }
    ]
  },
  {
    id: 3,
    titulo: "Cálculo — Larson, tomo I",
    vendedor: "Iván Palomino Rojas",
    calificacion: "4.5 ★",
    fecha: "28/08/2026",
    precioPedido: 78.00,
    montoMinimo: 60.00,
    montoOfertado: 70.00,
    estado: "Aceptada",
    imagen: calculoLarson,
    historial: [{ emisor: "Rosa Quispe", monto: 70.00, texto: "Acepto.", fecha: "28/08/2026" }]
  },
  {
    id: 4,
    titulo: "Mochila para laptop 15\" acolchada",
    vendedor: "Alejandra Cornejo Ríos",
    calificacion: "",
    fecha: "25/08/2026",
    precioPedido: 65.00,
    montoMinimo: 50.00,
    montoOfertado: 40.00,
    estado: "Rechazada",
    imagen: mochilaLaptop,
    historial: [{ emisor: "Rosa Quispe", monto: 40.00, texto: "¿40?", fecha: "25/08/2026" }]
  }
];