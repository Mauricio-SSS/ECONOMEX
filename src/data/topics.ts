export interface Topic {
  slug: string;
  label: string;
  href: string;
  icon: string; // raw SVG path data (24x24 viewBox, 1.5 stroke)
}

/* Iconos lineales 24x24, stroke 1.5. Conjunto inspirado en estilo Lucide / Phosphor. */
export const topics: Topic[] = [
  {
    slug: 'crecimiento',
    label: 'Crecimiento económico',
    href: '/temas/crecimiento',
    icon: 'M3 17l6-6 4 4 8-8 M14 7h7v7',
  },
  {
    slug: 'trabajo',
    label: 'Trabajo y salarios',
    href: '/temas/trabajo',
    icon: 'M3 21h18 M5 21V8l7-4 7 4v13 M9 12h6 M9 16h6',
  },
  {
    slug: 'desigualdad',
    label: 'Desigualdad y pobreza',
    href: '/temas/desigualdad',
    icon: 'M4 20h16 M6 16h2v4H6z M11 12h2v8h-2z M16 8h2v12h-2z',
  },
  {
    slug: 'finanzas-publicas',
    label: 'Finanzas públicas',
    href: '/temas/finanzas-publicas',
    icon: 'M3 7h18 M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7 M9 11h6 M9 15h4',
  },
  {
    slug: 'educacion',
    label: 'Educación y capital humano',
    href: '/temas/educacion',
    icon: 'M2 9l10-5 10 5-10 5z M6 11v6c2 1.5 4 2 6 2s4-.5 6-2v-6 M22 9v5',
  },
  {
    slug: 'gobierno',
    label: 'Gobierno y política pública',
    href: '/temas/gobierno',
    icon: 'M3 21h18 M5 21V10l7-5 7 5v11 M10 21v-6h4v6',
  },
  {
    slug: 'salud',
    label: 'Salud',
    href: '/temas/salud',
    icon: 'M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10z M9 11h6 M12 8v6',
  },
  {
    slug: 'desarrollo-regional',
    label: 'Desarrollo regional',
    href: '/temas/desarrollo-regional',
    icon: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v16 M15 6v16',
  },
];

export interface DataTool {
  slug: string;
  label: string;
  description: string;
  href: string;
  cta: string;
  icon: string;
}

export const dataTools: DataTool[] = [
  {
    slug: 'comparador-estatal',
    label: 'Comparador estatal',
    description:
      'Compara entidades por PIB per cápita, empleo, educación y más.',
    href: '/datos/comparador-estatal',
    cta: 'Abrir comparador',
    icon: 'M4 20h16 M7 16h2v4H7z M11 8h2v12h-2z M15 12h2v8h-2z',
  },
  {
    slug: 'mapas-interactivos',
    label: 'Mapas interactivos',
    description:
      'Visualiza indicadores económicos y sociales en mapas de México.',
    href: '/datos/mapas',
    cta: 'Ver mapas',
    icon: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v16 M15 6v16',
  },
  {
    slug: 'descargas',
    label: 'Descarga de datos',
    description:
      'Bases de datos limpias y documentadas, listas para análisis propio.',
    href: '/datos/descargas',
    cta: 'Ver datasets',
    icon: 'M12 3v12 M7 10l5 5 5-5 M5 21h14',
  },
  {
    slug: 'metodologias',
    label: 'Metodologías',
    description:
      'Notas técnicas con supuestos, fuentes y código reproducible.',
    href: '/datos/metodologias',
    cta: 'Leer notas',
    icon: 'M6 4h12v16H6z M9 8h6 M9 12h6 M9 16h4',
  },
  {
    slug: 'grafico-explica',
    label: 'Un gráfico explica',
    description:
      'Una idea económica explicada con una sola visualización.',
    href: '/datos/grafico-explica',
    cta: 'Ver serie',
    icon: 'M4 4v16h16 M8 14l3-3 3 3 5-6',
  },
];

export interface PolicyBrief {
  slug: string;
  title: string;
  pages: number;
  date: string;
  href: string;
}

export const policyBriefs: PolicyBrief[] = [
  {
    slug: 'movilidad-social',
    title: '3 políticas para aumentar movilidad social',
    pages: 12,
    date: 'mar 2026',
    href: '/policy-briefs/movilidad-social',
  },
  {
    slug: 'gasto-publico-local',
    title: 'Gasto público local: dónde mirar primero',
    pages: 8,
    date: 'feb 2026',
    href: '/policy-briefs/gasto-publico-local',
  },
  {
    slug: 'productividad-regional',
    title: 'Productividad regional: evidencia y recomendaciones',
    pages: 16,
    date: 'ene 2026',
    href: '/policy-briefs/productividad-regional',
  },
];
