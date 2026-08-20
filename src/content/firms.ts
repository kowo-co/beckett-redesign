export type FirmPole = 'receipt' | 'minimal' | 'chaotic'

export type Firm = {
  id: number
  slug: string
  name: string
  tagline: string
  sector: string
  city: string
  founded: number
  thumbnail: string
  route: string
  pole: FirmPole
}

export const firms: Firm[] = [
  {
    id: 1,
    slug: 'ledger',
    name: 'Ledger Terminal',
    tagline: 'Receipt-paper customs compliance — b&w monospace, bracketed labels, ruled lines.',
    sector: 'Trade compliance',
    city: 'Rotterdam',
    founded: 1987,
    thumbnail: '/assets/ledger/port.jpg',
    route: '/1',
    pole: 'receipt',
  },
  {
    id: 2,
    slug: 'blackwell',
    name: 'Blackwell',
    tagline: 'Austere print editorial — whitespace, serif, one phone number.',
    sector: 'Restructuring advisory',
    city: 'London',
    founded: 2008,
    thumbnail: '/assets/blackwell/hero.jpg',
    route: '/2',
    pole: 'minimal',
  },
  {
    id: 3,
    slug: 'halt',
    name: 'Halt Bureau',
    tagline: 'Swiss ops consultancy — one sans-serif, extreme restraint, pause button.',
    sector: 'Process reduction',
    city: 'Zurich',
    founded: 2004,
    thumbnail: '/assets/halt/office.jpg',
    route: '/3',
    pole: 'minimal',
  },
  {
    id: 4,
    slug: 'omission',
    name: 'Omission',
    tagline: 'Strategy by deletion — typography and margins, almost no chrome.',
    sector: 'Strategy advisory',
    city: 'New York',
    founded: 2016,
    thumbnail: '/assets/omission/wall.jpg',
    route: '/4',
    pole: 'minimal',
  },
  {
    id: 5,
    slug: 'veld',
    name: 'Veld',
    tagline: 'Dutch land-use advisory — flat horizons, italic type, vast whitespace.',
    sector: 'Landscape advisory',
    city: 'Utrecht',
    founded: 2009,
    thumbnail: '/assets/veld/polder.jpg',
    route: '/5',
    pole: 'minimal',
  },
  {
    id: 6,
    slug: 'keller',
    name: 'Keller & Drumm',
    tagline: 'Blueprint grid chaos — archival engineering drawings over industrial photography.',
    sector: 'Structural engineering',
    city: 'Pittsburgh',
    founded: 1961,
    thumbnail: '/assets/keller/hero.jpg',
    route: '/6',
    pole: 'chaotic',
  },
  {
    id: 7,
    slug: 'argue',
    name: 'Argue LLC',
    tagline: 'Scroll-driven single argument — oversized Bebas, theatrical stamp.',
    sector: 'Strategy (one idea)',
    city: 'Chicago',
    founded: 2019,
    thumbnail: '/assets/argue/hero.jpg',
    route: '/7',
    pole: 'chaotic',
  },
  {
    id: 8,
    slug: 'overprint',
    name: 'Overprint Collective',
    tagline: 'Broken-grid collage — misregistered layers, risograph noise, torn posters.',
    sector: 'Brand disruption',
    city: 'Berlin',
    founded: 2012,
    thumbnail: '/assets/overprint/collage.jpg',
    route: '/8',
    pole: 'chaotic',
  },
  {
    id: 9,
    slug: 'tidal',
    name: 'Tidal Energy Advisory',
    tagline: 'Coastal siting with generated video, maps, and live MW calculator.',
    sector: 'Energy advisory',
    city: 'Halifax',
    founded: 2014,
    thumbnail: '/assets/tidal/hero.jpg',
    route: '/9',
    pole: 'chaotic',
  },
  {
    id: 10,
    slug: 'field',
    name: 'Field Survey Ltd',
    tagline: 'Canvas particle field — live survey points, topographic art object.',
    sector: 'Terrain mapping',
    city: 'Edinburgh',
    founded: 2011,
    thumbnail: '/assets/field/terrain.jpg',
    route: '/10',
    pole: 'chaotic',
  },
]

export const poleLabels: Record<FirmPole, string> = {
  receipt: 'Receipt / terminal',
  minimal: 'Severe minimal',
  chaotic: 'Chaotic / experimental',
}
