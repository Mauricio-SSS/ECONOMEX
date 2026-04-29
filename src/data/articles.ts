export type Category =
  | 'ANÁLISIS'
  | 'DATOS'
  | 'POLICY BRIEF'
  | 'INVESTIGACIÓN TRADUCIDA'
  | 'GRÁFICO EXPLICA';

export interface Article {
  slug: string;
  category: Category;
  title: string;
  summary: string;
  date: string;          // ISO format
  dateLabel: string;     // human readable, ej. "24 abr 2026"
  readingTime: string;   // ej. "6 min de lectura"
  author?: string;
  href: string;
  image?: string;
}

/**
 * Mock data — reemplazar por content collections / Decap CMS más adelante.
 * Ver `src/data/README.md` para instrucciones de migración.
 */
export const featuredArticles: Article[] = [
  {
    slug: 'crecimiento-estados-mexico',
    category: 'ANÁLISIS',
    title: '¿Por qué crecen distinto los estados de México?',
    summary:
      'Un análisis de productividad, inversión y educación en las últimas dos décadas.',
    date: '2026-04-22',
    dateLabel: '22 abr 2026',
    readingTime: '8 min de lectura',
    author: 'Centro Economex',
    href: '/articulos/crecimiento-estados-mexico',
    image: '/images/articles/mock-1.svg',
  },
  {
    slug: 'inflacion-datos-recientes',
    category: 'GRÁFICO EXPLICA',
    title: 'Inflación: lo que muestran los datos más recientes',
    summary:
      'Una explicación visual de cómo cambian los precios y qué significa para los hogares.',
    date: '2026-04-18',
    dateLabel: '18 abr 2026',
    readingTime: '4 min de lectura',
    author: 'Centro Economex',
    href: '/articulos/inflacion-datos-recientes',
    image: '/images/articles/mock-2.svg',
  },
  {
    slug: 'jornada-laboral-4-dias',
    category: 'INVESTIGACIÓN TRADUCIDA',
    title: '¿Qué dice la evidencia sobre la jornada laboral de 4 días?',
    summary:
      'Traducimos hallazgos académicos a lenguaje cotidiano para tomar mejores decisiones.',
    date: '2026-04-12',
    dateLabel: '12 abr 2026',
    readingTime: '6 min de lectura',
    author: 'Centro Economex',
    href: '/articulos/jornada-laboral-4-dias',
    image: '/images/articles/mock-3.svg',
  },
  {
    slug: 'comparador-estatal',
    category: 'DATOS',
    title: 'Compara tu estado',
    summary:
      'Explora indicadores económicos, sociales y demográficos de las 32 entidades.',
    date: '2026-04-08',
    dateLabel: '8 abr 2026',
    readingTime: 'Herramienta interactiva',
    author: 'Centro Economex',
    href: '/datos/comparador-estatal',
    image: '/images/articles/mock-4.svg',
  },
];

export const latestArticles: Article[] = [
  {
    slug: 'nearshoring-estados-mexicanos',
    category: 'ANÁLISIS',
    title: 'Nearshoring: ¿qué pueden aprovechar los estados mexicanos?',
    summary: '',
    date: '2026-04-25',
    dateLabel: '25 abr 2026',
    readingTime: '7 min',
    href: '/articulos/nearshoring-estados-mexicanos',
    image: '/images/articles/mock-5.svg',
  },
  {
    slug: 'inflacion-datos-recientes',
    category: 'GRÁFICO EXPLICA',
    title: 'Inflación: lo que muestran los datos más recientes',
    summary: '',
    date: '2026-04-18',
    dateLabel: '18 abr 2026',
    readingTime: '4 min',
    href: '/articulos/inflacion-datos-recientes',
    image: '/images/articles/mock-2.svg',
  },
  {
    slug: 'jornada-laboral-4-dias',
    category: 'INVESTIGACIÓN TRADUCIDA',
    title: '¿Qué dice la evidencia sobre la jornada laboral de 4 días?',
    summary: '',
    date: '2026-04-12',
    dateLabel: '12 abr 2026',
    readingTime: '6 min',
    href: '/articulos/jornada-laboral-4-dias',
    image: '/images/articles/mock-3.svg',
  },
  {
    slug: 'calidad-gasto-publico',
    category: 'POLICY BRIEF',
    title: 'Cómo mejorar la calidad del gasto público en México',
    summary: '',
    date: '2026-04-05',
    dateLabel: '5 abr 2026',
    readingTime: '5 min',
    href: '/policy-briefs/calidad-gasto-publico',
    image: '/images/articles/mock-6.svg',
  },
  {
    slug: 'comparador-estatal',
    category: 'DATOS',
    title: 'Comparador estatal: PIB per cápita, empleo y educación',
    summary: '',
    date: '2026-04-01',
    dateLabel: '1 abr 2026',
    readingTime: 'Herramienta',
    href: '/datos/comparador-estatal',
    image: '/images/articles/mock-4.svg',
  },
];
