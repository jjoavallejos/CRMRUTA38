import { useState, useMemo, useCallback } from "react";

// ─── TIPOS ───────────────────────────────────────────────────────────────────
interface Prospecto {
  id: number;
  nombre: string;
  tipo: string;
  localidad: string;
  km: number;
  dir: string;
  tel: string;
  email: string;
  cu: string;
  responsable: string;
  kwh: number;
  sistema: string;
  ahorro_min: number;
  ahorro_max: number;
  prioridad: "Alta" | "Media" | "Baja";
  motivo: string;
  contactado: boolean;
  visitado: boolean;
  presupuestado: boolean;
  notas: string;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROSPECTOS_BASE: Prospecto[] = [
  // ── PARQUE SIQUIMAN ──────────────────────────────────────────────────────
  {
    id: 1, nombre: "Complejo Siquiman", tipo: "Complejo Recreativo", localidad: "P. Siquiman", km: 5,
    dir: "Ruta 38 km 5, Parque Siquiman", tel: "03541-400001", email: "info@complejosiquiman.com.ar",
    cu: "CU-001", responsable: "Gerencia", kwh: 8500, sistema: "On-Grid 60kW",
    ahorro_min: 180000, ahorro_max: 240000, prioridad: "Alta",
    motivo: "Complejo con alta demanda eléctrica, piscinas, iluminación y climatización. Ideal para sistema de gran escala.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 2, nombre: "Veneto Village Apart", tipo: "Hotel / Apart Premium", localidad: "P. Siquiman", km: 6,
    dir: "Av. San Martín 250, Parque Siquiman", tel: "03541-400002", email: "reservas@venetovillage.com.ar",
    cu: "CU-002", responsable: "Administración", kwh: 6200, sistema: "On-Grid 45kW",
    ahorro_min: 130000, ahorro_max: 180000, prioridad: "Alta",
    motivo: "Apart hotel premium con alta ocupación. Consumo constante todo el año por climatización y amenities.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 3, nombre: "Camping Los Sauces", tipo: "Camping / Complejo", localidad: "P. Siquiman", km: 7,
    dir: "Acceso Los Sauces s/n, Parque Siquiman", tel: "03541-400003", email: "campinglossauces@gmail.com",
    cu: "CU-003", responsable: "Propietario", kwh: 3500, sistema: "On-Grid 25kW",
    ahorro_min: 75000, ahorro_max: 100000, prioridad: "Media",
    motivo: "Camping con instalaciones de servicios, sector de bungalows y área de recreación.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── BIALET MASSÉ ─────────────────────────────────────────────────────────
  {
    id: 4, nombre: "Cooperativa de Agua BIACO", tipo: "Cooperativa / Servicios", localidad: "Bialet Massé", km: 12,
    dir: "Calle Principal s/n, Bialet Massé", tel: "03541-410001", email: "biaco@coop.com.ar",
    cu: "CU-004", responsable: "Presidente", kwh: 12000, sistema: "On-Grid 80kW",
    ahorro_min: 250000, ahorro_max: 340000, prioridad: "Alta",
    motivo: "Cooperativa de servicios con bombeo de agua 24/7. Consumo altísimo y constante. Retorno de inversión muy rápido.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 5, nombre: "Hotel & Spa Bialet Serrano", tipo: "Hotel / Spa", localidad: "Bialet Massé", km: 13,
    dir: "Ruta 38 km 13, Bialet Massé", tel: "03541-410002", email: "info@bialetserrano.com.ar",
    cu: "CU-005", responsable: "Gerente General", kwh: 9800, sistema: "On-Grid 70kW",
    ahorro_min: 210000, ahorro_max: 280000, prioridad: "Alta",
    motivo: "Hotel con spa activo todo el año. Calefacción de agua, climatización de ambientes y piscina.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 6, nombre: "Balneario Municipal Bialet", tipo: "Balneario / Municipal", localidad: "Bialet Massé", km: 14,
    dir: "Costa del Lago, Bialet Massé", tel: "03541-410003", email: "municipal@bialetmasse.gob.ar",
    cu: "CU-006", responsable: "Municipalidad", kwh: 4500, sistema: "On-Grid 32kW",
    ahorro_min: 95000, ahorro_max: 130000, prioridad: "Media",
    motivo: "Balneario público con potencial de financiamiento municipal. Alta visibilidad para la marca.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── SANTA MARÍA DE PUNILLA ───────────────────────────────────────────────
  {
    id: 7, nombre: "Aserradero El Quebracho", tipo: "Industria Maderera", localidad: "Santa María", km: 18,
    dir: "Ruta 38 km 18, Santa María de Punilla", tel: "03541-420001", email: "elquebracho@gmail.com",
    cu: "CU-007", responsable: "Dueño", kwh: 15000, sistema: "On-Grid 100kW",
    ahorro_min: 320000, ahorro_max: 420000, prioridad: "Alta",
    motivo: "Industria con maquinaria pesada y consumo muy elevado. Gran potencial de ahorro con sistema industrial.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 8, nombre: "Camping & Cabañas Valle Azul", tipo: "Complejo de Cabañas", localidad: "Santa María", km: 19,
    dir: "Camino a Valle Azul s/n, Santa María", tel: "03541-420002", email: "valleazul@gmail.com",
    cu: "CU-008", responsable: "Administrador", kwh: 5500, sistema: "On-Grid 40kW",
    ahorro_min: 115000, ahorro_max: 155000, prioridad: "Media",
    motivo: "Complejo de cabañas con alta ocupación en temporada. Muy receptivo a energía verde.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 9, nombre: "Planta Potabilizadora Punilla Norte", tipo: "Servicios Públicos / EPAS", localidad: "Santa María", km: 20,
    dir: "Acceso EPAS, Santa María de Punilla", tel: "03541-420003", email: "epas@cba.gov.ar",
    cu: "CU-009", responsable: "Jefe de Planta", kwh: 18000, sistema: "On-Grid 120kW",
    ahorro_min: 380000, ahorro_max: 500000, prioridad: "Alta",
    motivo: "Planta con bombas de alta potencia operando 24/7. Consumo crítico. Financiamiento estatal disponible.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── COSQUÍN ──────────────────────────────────────────────────────────────
  {
    id: 10, nombre: "Gran Hotel Cosquín", tipo: "Hotel 4 Estrellas", localidad: "Cosquín", km: 28,
    dir: "Av. Belgrano 1200, Cosquín", tel: "03541-430001", email: "info@granhotelcosquin.com.ar",
    cu: "CU-010", responsable: "Director", kwh: 22000, sistema: "On-Grid 150kW",
    ahorro_min: 460000, ahorro_max: 620000, prioridad: "Alta",
    motivo: "Hotel de 4 estrellas con 80 habitaciones. Consumo altísimo todo el año. Excelente retorno de inversión.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 11, nombre: "Hotel La Puerta del Sol", tipo: "Hotel 3 Estrellas", localidad: "Cosquín", km: 29,
    dir: "Calle San Martín 450, Cosquín", tel: "03541-430002", email: "puertsol@gmail.com",
    cu: "CU-011", responsable: "Propietario", kwh: 11000, sistema: "On-Grid 75kW",
    ahorro_min: 230000, ahorro_max: 310000, prioridad: "Alta",
    motivo: "Hotel familiar con buena ocupación anual. Interesado en reducir costos operativos.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 12, nombre: "Supermercado Vea Cosquín", tipo: "Supermercado / Comercio", localidad: "Cosquín", km: 30,
    dir: "Ruta 38 y Av. San Martín, Cosquín", tel: "03541-430003", email: "vea.cosquin@arcor.com.ar",
    cu: "CU-012", responsable: "Gerente de Local", kwh: 25000, sistema: "On-Grid 180kW",
    ahorro_min: 530000, ahorro_max: 700000, prioridad: "Alta",
    motivo: "Supermercado con refrigeración industrial 24/7 y alta iluminación. Consumo enorme y constante.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 13, nombre: "Aserradero Los Pinos Ruta 38", tipo: "Industria Maderera", localidad: "Cosquín", km: 31,
    dir: "Ruta 38 km 31, Cosquín", tel: "03541-430004", email: "lospinos@gmail.com",
    cu: "CU-013", responsable: "Encargado", kwh: 14000, sistema: "On-Grid 95kW",
    ahorro_min: 295000, ahorro_max: 395000, prioridad: "Alta",
    motivo: "Aserradero industrial con sierras y maquinaria de alta potencia. Turno diurno.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 14, nombre: "Parque Acuático Posta del Sol", tipo: "Parque Acuático", localidad: "Cosquín", km: 32,
    dir: "Acceso Sur, Cosquín", tel: "03541-430005", email: "postadelsol@gmail.com",
    cu: "CU-014", responsable: "Gerencia", kwh: 19000, sistema: "On-Grid 130kW",
    ahorro_min: 400000, ahorro_max: 540000, prioridad: "Alta",
    motivo: "Parque acuático con bombas de gran porte, iluminación nocturna y refrigeración.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── MOLINARI / VALLE HERMOSO ─────────────────────────────────────────────
  {
    id: 15, nombre: "Complejo Quimey Mapu", tipo: "Cabañas / Complejo", localidad: "Molinari", km: 38,
    dir: "Camino a Molinari s/n", tel: "03548-440001", email: "quimeymapu@gmail.com",
    cu: "CU-015", responsable: "Propietario", kwh: 4800, sistema: "On-Grid 35kW",
    ahorro_min: 100000, ahorro_max: 140000, prioridad: "Media",
    motivo: "Complejo de cabañas con energía verde como diferenciador turístico.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 16, nombre: "Cava y Bodega Valle Serrano", tipo: "Bodega / Enología", localidad: "Valle Hermoso", km: 40,
    dir: "Ruta a Valle Hermoso km 2", tel: "03548-440002", email: "valleserrano@bodega.com.ar",
    cu: "CU-016", responsable: "Enólogo / Dueño", kwh: 7200, sistema: "On-Grid 50kW",
    ahorro_min: 150000, ahorro_max: 200000, prioridad: "Media",
    motivo: "Bodega con cámaras de temperatura controlada y compresor continuo. Alto consumo base.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── LA FALDA ─────────────────────────────────────────────────────────────
  {
    id: 17, nombre: "Hotel Edén – La Falda", tipo: "Hotel Histórico 4★", localidad: "La Falda", km: 48,
    dir: "Av. Edén 1000, La Falda", tel: "03548-450001", email: "info@hoteladen.com.ar",
    cu: "CU-017", responsable: "Director General", kwh: 28000, sistema: "On-Grid 200kW",
    ahorro_min: 590000, ahorro_max: 790000, prioridad: "Alta",
    motivo: "Hotel histórico emblemático con altísimo consumo. Excelente caso de éxito para marketing.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 18, nombre: "Frigorífico Serrano Punilla", tipo: "Industria / Frigorífico", localidad: "La Falda", km: 49,
    dir: "Zona Industrial La Falda", tel: "03548-450002", email: "frigorifico@serrano.com.ar",
    cu: "CU-018", responsable: "Gerente de Producción", kwh: 32000, sistema: "On-Grid 220kW",
    ahorro_min: 670000, ahorro_max: 900000, prioridad: "Alta",
    motivo: "Frigorífico con cámaras de frío industriales 24/7. Consumo crítico y constante.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 19, nombre: "Supermercado Maxiconsumo La Falda", tipo: "Supermercado", localidad: "La Falda", km: 50,
    dir: "Av. Libertad 650, La Falda", tel: "03548-450003", email: "maxiconsumo.lafalda@gmail.com",
    cu: "CU-019", responsable: "Gerente", kwh: 20000, sistema: "On-Grid 140kW",
    ahorro_min: 420000, ahorro_max: 560000, prioridad: "Alta",
    motivo: "Supermercado de gran superficie con refrigeración y climatización constante.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 20, nombre: "Planta Embotelladora Serrana S.A.", tipo: "Industria / Embotelladora", localidad: "La Falda", km: 51,
    dir: "Parque Industrial La Falda", tel: "03548-450004", email: "serrana@embotelladora.com.ar",
    cu: "CU-020", responsable: "Ing. de Planta", kwh: 24000, sistema: "On-Grid 170kW",
    ahorro_min: 505000, ahorro_max: 675000, prioridad: "Alta",
    motivo: "Planta industrial con líneas de producción. Consumo diurno muy alto.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 21, nombre: "Centro Comercial La Falda Mall", tipo: "Shopping / Centro Comercial", localidad: "La Falda", km: 52,
    dir: "Av. Principal s/n, La Falda", tel: "03548-450005", email: "administracion@lafaldamall.com.ar",
    cu: "CU-021", responsable: "Administrador", kwh: 35000, sistema: "On-Grid 250kW",
    ahorro_min: 735000, ahorro_max: 980000, prioridad: "Alta",
    motivo: "Centro comercial con locales, estacionamiento y áreas comunes. Consumo masivo.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 22, nombre: "Estación de Servicio YPF La Falda", tipo: "Estación de Servicio", localidad: "La Falda", km: 53,
    dir: "Ruta 38 km 53, La Falda", tel: "03548-450006", email: "ypf.lafalda@gmail.com",
    cu: "CU-022", responsable: "Titular de Bandera", kwh: 8000, sistema: "On-Grid 55kW",
    ahorro_min: 168000, ahorro_max: 224000, prioridad: "Media",
    motivo: "Estación con minimarket, lavadero y servicios auxiliares. Consumo 24/7.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── HUERTA GRANDE ────────────────────────────────────────────────────────
  {
    id: 23, nombre: "Hotel & Termas Huerta Grande", tipo: "Hotel con Termas / Spa", localidad: "Huerta Grande", km: 58,
    dir: "Av. San Martín 300, Huerta Grande", tel: "03548-460001", email: "info@termashuerta.com.ar",
    cu: "CU-023", responsable: "Gerente", kwh: 26000, sistema: "On-Grid 185kW",
    ahorro_min: 546000, ahorro_max: 728000, prioridad: "Alta",
    motivo: "Hotel con termas activas todo el año. Calentamiento de agua y climatización son los mayores consumos.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 24, nombre: "Colonia Sindical STIA Huerta Grande", tipo: "Colonia / Residencia Sindical", localidad: "Huerta Grande", km: 59,
    dir: "Camino a la Colonia s/n, Huerta Grande", tel: "03548-460002", email: "stia@colonia.com.ar",
    cu: "CU-024", responsable: "Administrador", kwh: 16000, sistema: "On-Grid 115kW",
    ahorro_min: 336000, ahorro_max: 448000, prioridad: "Alta",
    motivo: "Colonia sindical con alta capacidad de alojamiento. Financiamiento sindical disponible.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 25, nombre: "Planta de Tratamiento Aguas Punilla Norte", tipo: "Servicios Públicos", localidad: "Huerta Grande", km: 60,
    dir: "Acceso Norte, Huerta Grande", tel: "03548-460003", email: "epas.norte@cba.gov.ar",
    cu: "CU-025", responsable: "Jefe de Planta", kwh: 21000, sistema: "On-Grid 145kW",
    ahorro_min: 441000, ahorro_max: 588000, prioridad: "Alta",
    motivo: "Planta de tratamiento con bombeo continuo. Consumo altísimo y constante.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── VILLA GIARDINO ───────────────────────────────────────────────────────
  {
    id: 26, nombre: "Camping Municipal Villa Giardino", tipo: "Camping Municipal", localidad: "Villa Giardino", km: 64,
    dir: "Costanera s/n, Villa Giardino", tel: "03548-470001", email: "municipal@villagiardino.gob.ar",
    cu: "CU-026", responsable: "Municipalidad", kwh: 5500, sistema: "On-Grid 40kW",
    ahorro_min: 115000, ahorro_max: 155000, prioridad: "Baja",
    motivo: "Camping municipal con potencial de financiamiento público. Operación estacional.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 27, nombre: "Cabañas El Rincón Serrano", tipo: "Cabañas Premium", localidad: "Villa Giardino", km: 65,
    dir: "Camino serrano km 2, Villa Giardino", tel: "03548-470002", email: "rinconserrano@gmail.com",
    cu: "CU-027", responsable: "Propietario", kwh: 4200, sistema: "On-Grid 30kW",
    ahorro_min: 88000, ahorro_max: 118000, prioridad: "Baja",
    motivo: "Cabañas premium interesadas en diferenciación ecológica para el turismo.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  // ── LA CUMBRE ────────────────────────────────────────────────────────────
  {
    id: 28, nombre: "Hotel Portal de La Cumbre", tipo: "Hotel / Resort 4★", localidad: "La Cumbre", km: 70,
    dir: "Av. San Martín 100, La Cumbre", tel: "03548-480001", email: "info@portaldelacumbre.com.ar",
    cu: "CU-028", responsable: "Director", kwh: 17000, sistema: "On-Grid 120kW",
    ahorro_min: 357000, ahorro_max: 476000, prioridad: "Alta",
    motivo: "Resort de montaña con alta ocupación. Climatización y piscina cubierta todo el año.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 29, nombre: "Bodega y Rest. Los Cocos", tipo: "Gastronómico / Bodega", localidad: "La Cumbre", km: 72,
    dir: "Ruta a Los Cocos, La Cumbre", tel: "03548-480002", email: "loscocos@gastro.com.ar",
    cu: "CU-029", responsable: "Chef / Propietario", kwh: 6800, sistema: "On-Grid 48kW",
    ahorro_min: 143000, ahorro_max: 190000, prioridad: "Media",
    motivo: "Bodega con cocina industrial y cámaras de temperatura controlada.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 30, nombre: "Hostería Cruz Chica", tipo: "Hostería / Lodge", localidad: "La Cumbre", km: 73,
    dir: "Camino Cruz Chica s/n, La Cumbre", tel: "03548-480003", email: "cruzchica@hosteria.com.ar",
    cu: "CU-030", responsable: "Administrador", kwh: 5200, sistema: "On-Grid 37kW",
    ahorro_min: 109000, ahorro_max: 146000, prioridad: "Media",
    motivo: "Hostería con turismo activo todo el año. Buena predisposición hacia sustentabilidad.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
  {
    id: 31, nombre: "Municipalidad de La Cumbre", tipo: "Organismo Municipal", localidad: "La Cumbre", km: 74,
    dir: "Plaza Central, La Cumbre", tel: "03548-480004", email: "intendencia@lacumbre.gob.ar",
    cu: "CU-031", responsable: "Intendente", kwh: 10000, sistema: "On-Grid 70kW",
    ahorro_min: 210000, ahorro_max: 280000, prioridad: "Media",
    motivo: "Municipalidad con dependencias, alumbrado y edificios públicos. Financiamiento provincial disponible.",
    contactado: false, visitado: false, presupuestado: false, notas: ""
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const TIPO_ICONS: Record<string, string> = {
  "Hotel": "🏨", "Complejo": "🏖️", "Camping": "⛺", "Industria": "🏭",
  "Supermercado": "🛒", "Bodega": "🍷", "Servicios": "⚙️", "Estación": "⛽",
  "Shopping": "🏬", "Municipalidad": "🏛️", "Cooperativa": "🤝", "Colonia": "🏕️",
  "Parque": "🎡", "Balneario": "🏊", "Hostería": "🏡", "Cabañas": "🛖",
};

const getIcon = (tipo: string): string => {
  for (const [k, v] of Object.entries(TIPO_ICONS)) {
    if (tipo.includes(k)) return v;
  }
  return "⚡";
};

const fmt = (n: number): string =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}k`;

const fmtKwh = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

const PRIORITY_STYLE: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Alta: { bg: "#3B0A0A", border: "#EF4444", text: "#FCA5A5", dot: "#EF4444" },
  Media: { bg: "#3B2A0A", border: "#F59E0B", text: "#FCD34D", dot: "#F59E0B" },
  Baja: { bg: "#0A3B1A", border: "#22C55E", text: "#86EFAC", dot: "#22C55E" },
};

const LOCALIDADES_ORDER = [
  "P. Siquiman", "Bialet Massé", "Santa María", "Cosquín",
  "Molinari", "Valle Hermoso", "La Falda", "Huerta Grande", "Villa Giardino", "La Cumbre"
];

// ─── TYPED KPI ITEMS ─────────────────────────────────────────────────────────
interface KpiItem {
  l: string;
  v: string | number;
  c: string;
}

interface StatRowItem {
  label: string;
  value: string;
  color: string;
}

interface PipelineItem {
  label: string;
  n: number;
  t: number;
  color: string;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState<Prospecto[]>(PROSPECTOS_BASE);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroLocalidad, setFiltroLocalidad] = useState("Todas");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");
  const [ordenPor, setOrdenPor] = useState("km");
  const [expandido, setExpandido] = useState<number | null>(null);
  const [vistaTab, setVistaTab] = useState<"lista" | "stats" | "mapa">("lista");

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  const toggle = useCallback((id: number, field: keyof Prospecto) => {
    setData(d => d.map(p => p.id === id ? { ...p, [field]: !p[field] } : p));
  }, []);

  const setNota = useCallback((id: number, nota: string) => {
    setData(d => d.map(p => p.id === id ? { ...p, notas: nota } : p));
  }, []);

  // ── FILTERED ───────────────────────────────────────────────────────────────
  const filtrados = useMemo(() => {
    let r = [...data];
    if (busqueda) r = r.filter(p =>
      [p.nombre, p.localidad, p.tipo, p.responsable].some(f => f?.toLowerCase().includes(busqueda.toLowerCase()))
    );
    if (filtroEstado !== "Todos") {
      if (filtroEstado === "Sin contactar") r = r.filter(p => !p.contactado);
      if (filtroEstado === "Contactados") r = r.filter(p => p.contactado);
      if (filtroEstado === "Visitados") r = r.filter(p => p.visitado);
      if (filtroEstado === "Presupuestados") r = r.filter(p => p.presupuestado);
    }
    if (filtroLocalidad !== "Todas") r = r.filter(p => p.localidad === filtroLocalidad);
    if (filtroPrioridad !== "Todas") r = r.filter(p => p.prioridad === filtroPrioridad);
    r.sort((a, b) =>
      ordenPor === "km" ? a.km - b.km :
      ordenPor === "kwh" ? b.kwh - a.kwh :
      ordenPor === "ahorro" ? b.ahorro_max - a.ahorro_max :
      a.nombre.localeCompare(b.nombre)
    );
    return r;
  }, [data, busqueda, filtroEstado, filtroLocalidad, filtroPrioridad, ordenPor]);

  // ── STATS ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = data.length;
    const contactados = data.filter(p => p.contactado).length;
    const visitados = data.filter(p => p.visitado).length;
    const presupuestados = data.filter(p => p.presupuestado).length;
    const altas = data.filter(p => p.prioridad === "Alta").length;
    const totalKwh = data.reduce((a, p) => a + p.kwh, 0);
    const totalAhorroMin = data.reduce((a, p) => a + p.ahorro_min, 0);
    const totalAhorroMax = data.reduce((a, p) => a + p.ahorro_max, 0);
    const byLocalidad = LOCALIDADES_ORDER.map(loc => ({
      loc,
      total: data.filter(p => p.localidad === loc).length,
      contactados: data.filter(p => p.localidad === loc && p.contactado).length,
      kwh: data.filter(p => p.localidad === loc).reduce((a, p) => a + p.kwh, 0),
    })).filter(x => x.total > 0);
    return { total, contactados, visitados, presupuestados, altas, totalKwh, totalAhorroMin, totalAhorroMax, byLocalidad };
  }, [data]);

  // ── EXPORT CSV ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["ID", "Nombre", "Tipo", "Localidad", "Km", "Dirección", "Teléfono", "Email", "CU", "Responsable", "kWh/mes", "Sistema", "Ahorro Min", "Ahorro Max", "Prioridad", "Contactado", "Visitado", "Presupuestado", "Notas"];
    const rows = data.map(p => [
      p.id, p.nombre, p.tipo, p.localidad, p.km, p.dir, p.tel, p.email, p.cu, p.responsable,
      p.kwh, p.sistema, p.ahorro_min, p.ahorro_max, p.prioridad,
      p.contactado ? "Sí" : "No", p.visitado ? "Sí" : "No", p.presupuestado ? "Sí" : "No", p.notas
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crm_carlospazsolar_jv.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pct = (n: number, t: number) => (t === 0 ? 0 : Math.round((n / t) * 100));

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    background: "#0B1929", border: "1px solid #1E3A5C", borderRadius: 7,
    color: "#D0E4F8", padding: "7px 10px", fontSize: 12, outline: "none"
  };

  const btnStyle = (active: boolean, color = "#1A4480"): React.CSSProperties => ({
    padding: "6px 13px", borderRadius: 7, fontSize: 11, cursor: "pointer",
    background: active ? color : "transparent",
    border: `1px solid ${active ? color : "#1E3A5C"}`,
    color: active ? "#FFF" : "#4A7AAA", transition: "all 0.15s"
  });

  const tagStyle = (bg: string, text: string, border: string): React.CSSProperties => ({
    background: bg, border: `1px solid ${border}`, borderRadius: 5,
    padding: "2px 7px", fontSize: 10, color: text, whiteSpace: "nowrap" as const
  });

  // ── TYPED DATA ARRAYS ──────────────────────────────────────────────────────
  const kpiItems: KpiItem[] = [
    { l: "Prospectos", v: stats.total, c: "#4A9CC7" },
    { l: "Contactados", v: `${stats.contactados}/${stats.total}`, c: "#22C55E" },
    { l: "Visitados", v: stats.visitados, c: "#818CF8" },
    { l: "Presupuestados", v: stats.presupuestados, c: "#F59E0B" },
    { l: "kWh/mes", v: `${(stats.totalKwh / 1000).toFixed(0)}k`, c: "#D4A017" },
    { l: "Ahorro potencial/mes", v: fmt(stats.totalAhorroMax), c: "#34D399" },
  ];

  const medalColors = ["#D4A017", "#C0C0C0", "#CD7F32", "#4A7AAA", "#4A7AAA"];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#050D1A", color: "#D0E4F8" }}>

      {/* ── TOPBAR ── */}
      <div style={{ background: "linear-gradient(135deg,#071220 0%,#0D2040 100%)", borderBottom: "1px solid #112233", padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#D4A017", marginBottom: 3 }}>YPF SOLAR · CARLOS PAZ SOLAR</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FFF", lineHeight: 1.1 }}>⚡ CRM Prospectos Solar</div>
            <div style={{ fontSize: 11, color: "#4A7AAA", marginTop: 2 }}>Parque Siquiman → La Cumbre · Ruta 38 Punilla</div>
          </div>
          {/* KPIs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {kpiItems.map((s) => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #112233", borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.c, lineHeight: 1.2 }}>{s.v}</div>
                <div style={{ fontSize: 8, color: "#4A7AAA", letterSpacing: 0.5 }}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.05)", borderRadius: 20, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct(stats.contactados, stats.total)}%`, background: "linear-gradient(90deg,#1A6A3A,#22C55E)", transition: "width 0.3s" }} />
        </div>
        <div style={{ fontSize: 9, color: "#4A7AAA", marginTop: 2 }}>Progreso de contacto: {pct(stats.contactados, stats.total)}%</div>
      </div>

      {/* ── TABS ── */}
      <div style={{ background: "#0A1522", borderBottom: "1px solid #112233", padding: "8px 20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["lista", "stats", "mapa"] as const).map((k) => {
            const labels: Record<string, string> = { lista: "📋 Lista", stats: "📊 Estadísticas", mapa: "🗺️ Ruta Visual" };
            return (
              <button key={k} onClick={() => setVistaTab(k)} style={btnStyle(vistaTab === k, "#1A4480")}>{labels[k]}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={exportCSV} style={{ ...btnStyle(false), border: "1px solid #1E3A5C", color: "#4A9CC7" }}>⬇ CSV</button>
          <button onClick={() => window.print()} style={{ ...btnStyle(false), border: "1px solid #1E3A5C", color: "#4A7AAA" }}>🖨️ Print</button>
        </div>
      </div>

      {/* ── MAPA VISUAL ── */}
      {vistaTab === "mapa" && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "#4A7AAA", marginBottom: 12 }}>Localidades sobre Ruta 38 · click para filtrar</div>
          <div style={{ display: "flex", alignItems: "stretch", overflowX: "auto", paddingBottom: 8 }}>
            {stats.byLocalidad.map((loc, i) => {
              const pctC = pct(loc.contactados, loc.total);
              const active = filtroLocalidad === loc.loc;
              return (
                <div key={loc.loc} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <div onClick={() => setFiltroLocalidad(active ? "Todas" : loc.loc)}
                    style={{ cursor: "pointer", background: active ? "#0D2040" : "#0A1522", border: `1px solid ${active ? "#4A9CC7" : "#112233"}`, borderRadius: 10, padding: "10px 14px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontSize: 11, color: active ? "#4A9CC7" : "#8BAAD4", fontWeight: 700 }}>{loc.loc}</div>
                    <div style={{ fontSize: 10, color: "#4A7AAA" }}>{loc.total} prosp.</div>
                    <div style={{ marginTop: 5, background: "#0B1929", borderRadius: 10, height: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pctC}%`, background: pctC === 100 ? "#22C55E" : "#4A9CC7" }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#22C55E", marginTop: 2 }}>{loc.contactados}/{loc.total}</div>
                    <div style={{ fontSize: 9, color: "#D4A017", marginTop: 1 }}>{fmtKwh(loc.kwh)} kWh</div>
                  </div>
                  {i < stats.byLocalidad.length - 1 && (
                    <div style={{ display: "flex", alignItems: "center", padding: "0 2px" }}>
                      <div style={{ width: 18, height: 2, background: "#D4A017", opacity: 0.4 }} />
                      <div style={{ fontSize: 8, color: "#D4A017", opacity: 0.6 }}>▶</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* TOP 5 por potencial */}
          <div style={{ marginTop: 16, background: "#0A1522", border: "1px solid #112233", borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#D4A017", marginBottom: 10 }}>🏆 TOP 5 Mayor Ahorro Potencial</div>
            {[...data].sort((a, b) => b.ahorro_max - a.ahorro_max).slice(0, 5).map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: medalColors[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#000", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#D0E4F8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{getIcon(p.tipo)} {p.nombre}</div>
                  <div style={{ fontSize: 10, color: "#4A7AAA" }}>{p.localidad} · Km {p.km}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#34D399", whiteSpace: "nowrap" }}>{fmt(p.ahorro_max)}/mes</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      {vistaTab === "stats" && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {/* Por localidad */}
            <div style={{ background: "#0A1522", border: "1px solid #112233", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4A9CC7", marginBottom: 10, letterSpacing: 1 }}>📍 CONTACTO POR LOCALIDAD</div>
              {stats.byLocalidad.map(loc => (
                <div key={loc.loc} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: "#C8D8EC" }}>{loc.loc}</span>
                    <span style={{ fontSize: 11, color: "#D4A017" }}>{loc.contactados}/{loc.total}</span>
                  </div>
                  <div style={{ background: "#0B1929", borderRadius: 10, height: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct(loc.contactados, loc.total)}%`, background: "#4A9CC7" }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Consumo y ahorro */}
            <div style={{ background: "#0A1522", border: "1px solid #112233", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017", marginBottom: 10, letterSpacing: 1 }}>💰 POTENCIAL ECONÓMICO</div>
              {((): StatRowItem[] => [
                { label: "Consumo total estimado", value: `${(stats.totalKwh / 1000).toFixed(1)}k kWh/mes`, color: "#4A9CC7" },
                { label: "Ahorro mínimo/mes", value: fmt(stats.totalAhorroMin), color: "#22C55E" },
                { label: "Ahorro máximo/mes", value: fmt(stats.totalAhorroMax), color: "#34D399" },
                { label: "Ahorro anual potencial", value: fmt(stats.totalAhorroMax * 12), color: "#D4A017" },
                { label: "Capacidad solar estimada", value: `${Math.round(stats.totalKwh * 0.007)} – ${Math.round(stats.totalKwh * 0.008)} kWp`, color: "#818CF8" },
                { label: "Inversión estimada total", value: `USD ${Math.round(stats.totalKwh * 0.007 * 700).toLocaleString()}`, color: "#F59E0B" },
              ])().map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ fontSize: 11, color: "#6A9ABA" }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
                </div>
              ))}
            </div>
            {/* Pipeline */}
            <div style={{ background: "#0A1522", border: "1px solid #112233", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#818CF8", marginBottom: 10, letterSpacing: 1 }}>📈 PIPELINE DE VENTAS</div>
              {((): PipelineItem[] => [
                { label: "Sin contactar", n: data.filter(p => !p.contactado).length, t: data.length, color: "#EF4444" },
                { label: "Contactados", n: stats.contactados, t: data.length, color: "#4A9CC7" },
                { label: "Visitados", n: stats.visitados, t: data.length, color: "#818CF8" },
                { label: "Presupuestados", n: stats.presupuestados, t: data.length, color: "#F59E0B" },
                { label: "Prioridad Alta", n: stats.altas, t: data.length, color: "#EF4444" },
              ])().map(({ label, n, t, color }) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: "#C8D8EC" }}>{label}</span>
                    <span style={{ fontSize: 11, color, fontWeight: 700 }}>{n} ({pct(n, t)}%)</span>
                  </div>
                  <div style={{ background: "#0B1929", borderRadius: 10, height: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct(n, t)}%`, background: color, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── LISTA ── */}
      {vistaTab === "lista" && (
        <div style={{ padding: "12px 20px" }}>
          {/* Filtros */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="🔍 Buscar nombre, localidad, tipo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ ...inp, flex: 1, minWidth: 180 }}
            />
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={inp}>
              {["Todos", "Sin contactar", "Contactados", "Visitados", "Presupuestados"].map(f =>
                <option key={f}>{f}</option>
              )}
            </select>
            <select value={filtroLocalidad} onChange={e => setFiltroLocalidad(e.target.value)} style={inp}>
              <option value="Todas">Todas las localidades</option>
              {LOCALIDADES_ORDER.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} style={inp}>
              {["Todas", "Alta", "Media", "Baja"].map(f => <option key={f}>{f}</option>)}
            </select>
            <select value={ordenPor} onChange={e => setOrdenPor(e.target.value)} style={inp}>
              <option value="km">Ordenar: Km (Ruta)</option>
              <option value="kwh">Ordenar: Mayor consumo</option>
              <option value="ahorro">Ordenar: Mayor ahorro</option>
              <option value="nombre">Ordenar: Nombre A-Z</option>
            </select>
          </div>
          <div style={{ fontSize: 10, color: "#4A7AAA", marginBottom: 8 }}>Mostrando {filtrados.length} de {data.length} prospectos</div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtrados.map(p => {
              const ps = PRIORITY_STYLE[p.prioridad];
              const isOpen = expandido === p.id;
              const icon = getIcon(p.tipo);

              const contactFields: Array<{ label: string; value: string }> = [
                { label: "📍 Dirección", value: p.dir },
                { label: "📞 Teléfono", value: p.tel },
                { label: "📧 Email", value: p.email },
                { label: "👤 Responsable", value: p.responsable },
                { label: "🔑 CU", value: p.cu },
              ];

              const financialFields: Array<{ label: string; value: string; color: string }> = [
                { label: "Consumo estimado", value: `${p.kwh.toLocaleString()} kWh/mes`, color: "#4A9CC7" },
                { label: "Ahorro mínimo", value: `${fmt(p.ahorro_min)}/mes`, color: "#22C55E" },
                { label: "Ahorro máximo", value: `${fmt(p.ahorro_max)}/mes`, color: "#34D399" },
                { label: "Ahorro anual", value: fmt(p.ahorro_max * 12), color: "#D4A017" },
                { label: "Inversión est.", value: `USD ${Math.round(p.kwh * 0.008 * 700).toLocaleString()}`, color: "#F59E0B" },
                { label: "Payback est.", value: "3–5 años", color: "#818CF8" },
              ];

              const pipelineButtons: Array<{ field: "contactado" | "visitado" | "presupuestado"; label: string; color: string }> = [
                { field: "contactado", label: "📞 Contactado", color: "#16A34A" },
                { field: "visitado", label: "🚗 Visitado", color: "#4A9CC7" },
                { field: "presupuestado", label: "📄 Presupuestado", color: "#F59E0B" },
              ];

              return (
                <div key={p.id} style={{
                  background: p.contactado && p.visitado ? "#071510" : p.contactado ? "#071520" : "#0A1522",
                  border: `1px solid ${p.presupuestado ? "#F59E0B44" : p.visitado ? "#818CF844" : p.contactado ? "#22C55E33" : "#112233"}`,
                  borderRadius: 10, overflow: "hidden"
                }}>
                  {/* ROW */}
                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10, flexWrap: "wrap" }}>
                    {/* Checkbox contactado */}
                    <div
                      onClick={() => toggle(p.id, "contactado")}
                      title="Marcar como contactado"
                      style={{
                        width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                        background: p.contactado ? "#16A34A" : "#0B1929",
                        border: `2px solid ${p.contactado ? "#16A34A" : "#1E3A5C"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11
                      }}
                    >
                      {p.contactado ? "✓" : ""}
                    </div>
                    {/* KM Badge */}
                    <div style={{ background: "#071220", border: "1px solid #D4A01744", borderRadius: 6, padding: "2px 7px", fontSize: 10, color: "#D4A017", flexShrink: 0 }}>
                      km {p.km}
                    </div>
                    {/* Icon + nombre */}
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.contactado ? "#4A7A5A" : "#D0E4F8" }}>
                        {icon} {p.nombre}
                      </div>
                      <div style={{ fontSize: 10, color: "#4A7AAA" }}>{p.tipo} · {p.localidad}</div>
                    </div>
                    {/* Mini pipeline */}
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {(["contactado", "visitado", "presupuestado"] as const).map((field) => {
                        const emojiMap: Record<string, string> = { contactado: "📞", visitado: "🚗", presupuestado: "📄" };
                        const lblMap: Record<string, string> = { contactado: "Contactado", visitado: "Visitado", presupuestado: "Presupuestado" };
                        return (
                          <div
                            key={field}
                            onClick={() => toggle(p.id, field)}
                            title={lblMap[field]}
                            style={{
                              width: 26, height: 26, borderRadius: 6, cursor: "pointer",
                              background: p[field] ? "#0D2A1A" : "#0B1929",
                              border: `1px solid ${p[field] ? "#22C55E55" : "#1E3A5C"}`,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13
                            }}
                          >
                            {emojiMap[field]}
                          </div>
                        );
                      })}
                    </div>
                    {/* Tags */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={tagStyle("#071A2E", "#4A9CC7", "#1E3A5C")}>{p.kwh.toLocaleString()} kWh</span>
                      <span style={tagStyle("#071A2E", "#818CF8", "#1E3A5C")}>{p.sistema}</span>
                      <span style={tagStyle("#071A2E", "#34D399", "#1E3A5C")}>⚡ {fmt(p.ahorro_max)}/mes</span>
                      <span style={tagStyle(ps.bg, ps.text, ps.border)}>● {p.prioridad}</span>
                    </div>
                    {/* Expand button */}
                    <button
                      onClick={() => setExpandido(isOpen ? null : p.id)}
                      style={{ background: "transparent", border: "1px solid #1E3A5C", borderRadius: 6, color: "#4A7AAA", width: 28, height: 28, cursor: "pointer", fontSize: 12, flexShrink: 0 }}
                    >
                      {isOpen ? "▲" : "▼"}
                    </button>
                  </div>

                  {/* DETALLE */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #0D2035", padding: "12px 14px", background: "#060F1C" }}>
                      {/* Contacto */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8, marginBottom: 10 }}>
                        {contactFields.map(({ label, value }) => (
                          <div key={label} style={{ background: "#0A1522", borderRadius: 7, padding: "8px 10px" }}>
                            <div style={{ fontSize: 9, color: "#4A7AAA", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 11, color: "#C8D8EC" }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      {/* Financiero */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8, marginBottom: 10 }}>
                        {financialFields.map(({ label, value, color }) => (
                          <div key={label} style={{ background: "#0A1522", borderRadius: 7, padding: "8px 10px" }}>
                            <div style={{ fontSize: 9, color: "#4A7AAA" }}>{label}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color, marginTop: 2 }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      {/* Motivo */}
                      <div style={{ background: "#0A1522", borderRadius: 7, padding: "10px", marginBottom: 10 }}>
                        <div style={{ fontSize: 9, color: "#D4A017", letterSpacing: 1, marginBottom: 4 }}>💡 MOTIVO DE INTERÉS</div>
                        <div style={{ fontSize: 11, color: "#A8C0D8", lineHeight: 1.6 }}>{p.motivo}</div>
                      </div>
                      {/* Pipeline buttons */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        {pipelineButtons.map(({ field, label, color }) => (
                          <button
                            key={field}
                            onClick={() => toggle(p.id, field)}
                            style={{
                              padding: "6px 14px", borderRadius: 7, fontSize: 11, cursor: "pointer",
                              background: p[field] ? `${color}22` : "transparent",
                              border: `1px solid ${p[field] ? color : "#1E3A5C"}`,
                              color: p[field] ? color : "#4A7AAA",
                            }}
                          >
                            {p[field] ? "✓ " : ""}{label}
                          </button>
                        ))}
                      </div>
                      {/* Notas */}
                      <div style={{ background: "#0A1522", borderRadius: 7, padding: "10px" }}>
                        <div style={{ fontSize: 9, color: "#4A7AAA", letterSpacing: 1, marginBottom: 4 }}>📝 NOTAS INTERNAS</div>
                        <textarea
                          value={p.notas}
                          onChange={e => setNota(p.id, e.target.value)}
                          placeholder="Agregar notas sobre el prospecto..."
                          style={{
                            width: "100%", background: "#050D1A", border: "1px solid #1E3A5C",
                            borderRadius: 6, color: "#C8D8EC", fontSize: 11, padding: "7px",
                            resize: "vertical", minHeight: 60, boxSizing: "border-box", outline: "none"
                          }}
                        />
                      </div>
                      {/* Acciones rápidas */}
                      <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-start", flexWrap: "wrap" }}>
                        <a href={`tel:${p.tel}`} style={{ padding: "6px 14px", background: "#0F2A1A", border: "1px solid #16A34A44", borderRadius: 7, fontSize: 11, color: "#22C55E", textDecoration: "none" }}>📞 Llamar</a>
                        <a href={`mailto:${p.email}?subject=Propuesta Sistema Solar Fotovoltaico`} style={{ padding: "6px 14px", background: "#0F1A2A", border: "1px solid #4A9CC744", borderRadius: 7, fontSize: 11, color: "#4A9CC7", textDecoration: "none" }}>📧 Email</a>
                        <a href={`https://wa.me/54${p.tel.replace(/\D/g, "")}?text=Hola! Soy Joaquin de Carlos Paz Solar. Me gustaría hablarles sobre paneles solares para ${p.nombre}.`} target="_blank" rel="noreferrer" style={{ padding: "6px 14px", background: "#0A2010", border: "1px solid #25D36644", borderRadius: 7, fontSize: 11, color: "#25D366", textDecoration: "none" }}>💬 WhatsApp</a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtrados.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#4A7AAA", fontSize: 13 }}>
              Sin resultados para los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div style={{ margin: "16px 20px", padding: "10px 14px", background: "#0A1522", borderRadius: 8, border: "1px solid #112233" }}>
        <div style={{ fontSize: 9, color: "#4A7AAA", letterSpacing: 1 }}>
          YPF SOLAR / CARLOS PAZ SOLAR · Ejecutivo: Joaquin Vallejos · jjoavallejos@gmail.com
        </div>
        <div style={{ fontSize: 8, color: "#1E3A5C", marginTop: 3 }}>
          CRM — CARLOS PAZ SOLAR | JV · Ruta 38 Punilla · 2025
        </div>
      </div>
    </div>
  );
}
