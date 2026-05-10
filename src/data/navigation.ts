export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const primaryNav: NavItem[] = [
  { label: 'Artículos', href: '/articulos' },
  {
    label: 'Datos',
    href: '/datos',
    children: [
      { label: 'Monitoreo', href: '/datos/monitoreo' },
      { label: 'Historia', href: '/datos/historia' },
      { label: 'Economía', href: '/datos/economia' },
      { label: 'Base de datos', href: '/datos/base-de-datos' },
    ],
  },
  { label: 'Investigación', href: '/investigacion' },
  { label: 'Policy briefs', href: '/policy-briefs' },
  { label: 'Quiénes somos', href: '/nosotros/quienes-somos' },
];

export const footerSections = [
  {
    title: 'Centro Economex',
    items: [
      { label: '¿Quiénes somos?', href: '/nosotros/quienes-somos' },
      { label: 'Únete', href: '/nosotros/unete' },
      { label: 'Redes', href: '/nosotros/redes' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Contenido',
    items: [
      { label: 'Artículos', href: '/articulos' },
      { label: 'Investigación', href: '/investigacion' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  },
  {
    title: 'Datos',
    items: [
      { label: 'Monitoreo', href: '/datos/monitoreo' },
      { label: 'Historia', href: '/datos/historia' },
      { label: 'Economía', href: '/datos/economia' },
      { label: 'Base de datos', href: '/datos/base-de-datos' },
    ],
  },
  {
    title: 'Recursos',
    items: [
      { label: 'Ayúdanos', href: '/ayudanos' },
      { label: 'Prensa', href: '/prensa' },
      { label: 'Metodologías', href: '/datos/metodologias' },
    ],
  },
];
