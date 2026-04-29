# Centro Economex — Website

Landing page institucional para **Centro Economex**: think tank, periódico
económico y laboratorio de datos.

> "Traducimos investigación económica para impulsar decisiones que generen bien común."

Stack: **Astro 6 + MDX + vanilla CSS**, listo para conectarse a **Decap CMS**,
desplegarse en **Cloudflare Pages** desde **GitHub** y crecer hacia especiales
de datos con **Scrollama, D3, Observable Plot, MapLibre y Quarto Closeread**.

---

## Cómo correrlo localmente

```bash
# 1. instalar dependencias (Node 20+ recomendado, ver .nvmrc)
npm install

# 2. dev server con hot reload
npm run dev          # http://localhost:4321

# 3. build de producción
npm run build        # genera dist/

# 4. preview del build
npm run preview

# 5. type check
npm run check
```

## Estructura del proyecto

```
.
├── astro.config.mjs           # Config Astro + integraciones
├── tsconfig.json              # Paths @/, @components/, @data/, etc.
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── logo-centro-economex.svg
│       ├── mock-map-mexico.svg
│       ├── mock-chart.svg
│       ├── mock-comparator.svg
│       └── articles/mock-1.svg … mock-6.svg
└── src/
    ├── pages/
    │   └── index.astro                # Home — compone todas las secciones
    ├── layouts/
    │   └── BaseLayout.astro           # SEO, fuentes, header, footer, skip-link
    ├── components/
    │   ├── global/
    │   │   ├── Header.astro           # Sticky, búsqueda, hamburguesa
    │   │   ├── MobileMenu.astro       # Drawer accesible (ESC/overlay)
    │   │   └── Footer.astro
    │   ├── home/
    │   │   ├── HeroCarousel.astro     # Carrusel scroll-snap + vanilla JS
    │   │   ├── MissionBar.astro
    │   │   ├── TopicGrid.astro
    │   │   ├── LatestArticles.astro
    │   │   ├── DataToolsGrid.astro
    │   │   ├── NewsletterCard.astro
    │   │   ├── ResearchTranslationSection.astro
    │   │   └── PolicyBriefsSection.astro
    │   └── ui/
    │       ├── Button.astro
    │       ├── Badge.astro
    │       ├── Card.astro
    │       └── ArticleCard.astro
    ├── data/
    │   ├── articles.ts                # Mock — reemplazar con content/Decap
    │   ├── topics.ts                  # Temas + datos/herramientas + policy briefs
    │   └── navigation.ts              # Nav header + footer
    └── styles/
        └── global.css                 # Tokens, reset, type scale, utilidades
```

## Cómo modificar el carrusel

El contenido vive en `src/components/home/HeroCarousel.astro`, en el array
`slides` declarado en el frontmatter. Cada slide es un objeto:

```ts
{
  category: 'ANÁLISIS',                  // texto del badge
  title: '¿Por qué crecen distinto…',    // título; el primero usa <h1>
  summary: 'Un análisis de…',
  href: '/articulos/...',
  ctaPrimary: 'Leer artículo',
  ctaSecondary: { label: 'Explorar datos', href: '/datos/...' }, // opcional
  visual: 'map' | 'chart' | 'editorial' | 'tool',
  meta: '22 abr 2026 · 8 min',
}
```

- **`visual`** decide qué mock se muestra a la derecha.
  - `map` → `/images/mock-map-mexico.svg`
  - `chart` → `/images/mock-chart.svg`
  - `tool` → `/images/mock-comparator.svg`
  - `editorial` → tarjeta verde con cita en serif (sin imagen)
- Para añadir un slide, agrega un objeto al array y los dots se generan solos.
- El primer slide es el LCP — su imagen lleva `fetchpriority="high"` y
  `loading="eager"`.
- El JS del carrusel está al final del mismo archivo (~30 líneas, ~1KB
  minificado, sin librerías).

## Cómo modificar los artículos

`src/data/articles.ts` exporta dos colecciones tipadas:

- `featuredArticles` — alimenta el carrusel.
- `latestArticles` — alimenta la sección "Lo más reciente".

Para conectar con Decap CMS o Astro Content Collections más adelante, reemplaza
estos arrays por una `getCollection('articles')` y mantén la misma forma del
tipo `Article`.

## Diseño y branding

Tokens centralizados en `src/styles/global.css` bajo `:root`:

| Token                  | Valor       | Uso                                      |
|------------------------|-------------|-------------------------------------------|
| `--color-green-900`    | `#005C3A`   | Verde institucional, botones, links       |
| `--color-green-700`    | `#0B7A4B`   | Verde medio, hovers                       |
| `--color-green-100`    | `#DDEFE5`   | Fondo de íconos, badges                   |
| `--color-red-700`      | `#C9282D`   | Acento, etiquetas especiales              |
| `--color-red-100`      | `#F2D6D8`   | Fondos suaves de acento                   |
| `--color-ink`          | `#111111`   | Titulares                                 |
| `--color-text`         | `#3F3F3F`   | Cuerpo                                    |
| `--color-text-muted`   | `#6B7280`   | Captions, metadata                        |
| `--color-border`       | `#E5E7EB`   | Bordes, separadores                       |
| `--color-bg`           | `#FFFFFF`   | Fondo principal                           |
| `--color-bg-warm`      | `#FAF7F0`   | Fondo cálido editorial                    |

**Tipografía**

- `--font-serif` → **Source Serif 4** — títulos, hero, cuerpo de artículos.
- `--font-sans` → **Inter** — UI, navegación, botones, datos, captions.

Las fuentes se cargan desde Google Fonts con `preconnect` + `display=swap` en
`BaseLayout.astro`. Si quieres self-hostear, baja los WOFF2 a `public/fonts/`
y reemplaza el `<link>` por `@font-face` en `global.css`.

## Performance — checklist aplicado

- ✅ HTML estático por defecto (Astro static output).
- ✅ Cero hidratación JS — la única isla interactiva es el carrusel y se
  inlinea en el HTML (Astro <40KB threshold para inline).
- ✅ Sin librerías de UI / sin Tailwind / sin CSS-in-JS runtime.
- ✅ `loading="lazy"` + `decoding="async"` en imágenes debajo del fold.
- ✅ `fetchpriority="high"` en la imagen del primer slide (LCP).
- ✅ `width`/`height` explícitos en cada `<img>` para evitar CLS.
- ✅ `aspect-ratio` en contenedores de visuales del hero.
- ✅ Mocks como SVG inline-able y livianos (~3 KB cada uno).
- ✅ `prefers-reduced-motion` desactiva autoplay y smooth scroll del carrusel.
- ✅ `font-display: swap` (vía Google Fonts).
- ✅ `inlineStylesheets: 'auto'` — Astro inlinea CSS pequeño.
- ✅ D3 / MapLibre / Scrollama / Observable Plot **no** se cargan en la home.
  Se incorporarán por página cuando hagan falta (en especiales).

**Resultado del build inicial**

```
1 página · 44 KB HTML · 31 KB CSS bundle · 0 KB JS chunk extra
```

(El JS del carrusel se inlinea en `index.html`.)

## Responsive — breakpoints

Mobile-first. Breakpoints CSS:

| px       | Cambia                                                  |
|----------|---------------------------------------------------------|
| `>= 600` | Grids 2 columnas (artículos), 3 columnas (temas)        |
| `>= 768` | Type scale crece, hero pasa a 2 columnas, footer 3 cols |
| `>= 1024`| Nav desktop visible, grids 4–5 columnas, hamburguesa off|
| `>= 1280`| Container respira con más padding lateral               |

## Accesibilidad

- `<main id="main">`, `<header>`, `<nav>`, `<footer>`, `<article>` semánticos.
- Skip-link al inicio del body.
- `h1` único en el primer slide del carrusel; `<h2>` por sección.
- Focus visible (`outline 2px var(--color-green-700)`).
- `aria-label` en flechas, dots, hamburguesa, búsqueda y links sociales.
- `aria-roledescription="carrusel"` y `role="group"` por slide.
- Drawer móvil con `role="dialog"`, `aria-modal`, cierre con ESC + overlay.
- Contraste verificado AA para texto sobre verde y sobre fondo cálido.
- Tap targets de 44×44px en flechas, ícono de menú y CTA principal.

## SEO

- `<title>`, `<meta description>`, OG y Twitter Card en `BaseLayout`.
- Canonical automático con `Astro.url`.
- Sitemap automático vía `@astrojs/sitemap` (genera `dist/sitemap-index.xml`).
- `lang="es-MX"` en `<html>`.
- RSS preparado en `<link rel="alternate">` (apuntar a `/rss.xml` cuando se
  active el feed).

## Próximos pasos

1. **Decap CMS** — añadir `public/admin/index.html` + `config.yml` con
   colecciones `articulos`, `policy-briefs`, `traducciones`. La estructura de
   `Article` en `src/data/articles.ts` ya refleja los campos esperados.
2. **Content collections** — migrar `src/data/articles.ts` a
   `src/content/articulos/*.mdx` con un `defineCollection()` schema en
   `src/content.config.ts`.
3. **Páginas internas** — `src/pages/articulos/[slug].astro`, `datos/...`,
   `policy-briefs/...`. Reusar `BaseLayout` y `ArticleCard`.
4. **Especiales de datos** — crear `src/pages/especiales/[slug].astro` que
   importen Scrollama + D3 / Plot / MapLibre **solo** ahí (cargados como
   módulos dinámicos para no afectar la home).
5. **Cloudflare Pages** — conectar el repo de GitHub. Build command:
   `npm run build`. Output directory: `dist/`. Node version: `20`.
6. **OG image real** — sustituir el placeholder `/images/og-default.png` por
   un PNG 1200×630.
7. **Newsletter backend** — la action del form apunta a `/api/newsletter`;
   conectar a un endpoint Astro (con adapter Cloudflare) o a Buttondown / Beehiiv.

---

## Notas finales

El sitio **no asume Tailwind ni utility frameworks**: las vistas usan
componentes Astro con `<style>` scoped, y un puñado de utilidades en
`global.css` (`.container`, `.section`, `.eyebrow`, etc.). Si en el futuro
prefieres Tailwind, se puede añadir sin romper nada porque las clases
existentes son específicas (no hay choque de namespaces).

Para cualquier visual interactivo nuevo (mapa real con MapLibre, gráfica
con Observable Plot, scrolly con Scrollama), créalo como un componente
**en su propia página** y agrega `client:load` o `client:visible` solo a esa
isla — la home seguirá siendo HTML puro.
