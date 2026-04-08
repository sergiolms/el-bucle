export const TANIS_MAP_SOURCE_URL = "https://www.puntodeheroe.com/MapaTanis.jpg"
export const TANIS_MAP_ASSET_PATH = "/assets/mapa-tanis.jpg"

export const TANIS_MAP_ZONES = [
  {
    zone: "ARRABALES",
    places: ["Sótano (inicio)", "Área industrial", "Mercado negro"],
  },
  {
    zone: "DISTRITO SUR",
    places: [
      "Estadio",
      "Concesionario",
      "Hospital",
      "Museo",
      "Bomberos",
      "Fundación Quántum",
    ],
  },
  {
    zone: "BARRIO FLUVIAL",
    places: [
      "Gimnasio",
      "Biblioteca",
      "Parque del Milenio",
      "Malecón",
      "Puerto",
      "Auditorio",
      "Universidad",
    ],
  },
  {
    zone: "DISTRITO NORTE",
    places: [
      "Parque de atracciones",
      "Centro comercial",
      "Multicines",
      "Comisaría, prisión y morgue",
      "Langosta's",
      "Barrio gastronómico",
      "Monumento",
      "Hotel",
      "Apartamentos Singladura",
      "Estación de tren",
      "Mansión de Tempus Fugit",
    ],
  },
  {
    zone: "CENTRO",
    places: [
      "Plaza de Cronos",
      "Torre Eón",
      "Supermercado",
      "Zona comercial",
      "Banco",
      "Farmacia",
      "Punxsutawney",
      "Cafetería",
      "Ayuntamiento",
    ],
  },
] as const
