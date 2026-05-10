(function () {
  function registerCentroEconomexPreview() {
    const CMS = window.CMS;
    const React = window.React;
    const h = window.h || (React && React.createElement);

    if (!CMS || !h) {
      window.setTimeout(registerCentroEconomexPreview, 50);
      return;
    }

    function getIn(data, path, fallback) {
      if (!data || !data.getIn) return fallback;
      const value = data.getIn(path);
      if (value === undefined || value === null || value === '') return fallback;
      return value;
    }

    function getField(data, name, fallback) {
      if (!data || !data.get) return fallback;
      const value = data.get(name);
      if (value === undefined || value === null || value === '') return fallback;
      return value;
    }

    function listToArray(value) {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (value.toJS) return value.toJS();
      return [];
    }

    function normalizeImagePath(value) {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (value.path) return value.path;
      if (value.url) return value.url;
      if (value.toJS) {
        const js = value.toJS();
        return js.path || js.url || '';
      }
      return '';
    }

    function formatDate(value) {
      if (!value) return 'Fecha por definir';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    }

    function narrativeDetails(data) {
      const configuredSteps = listToArray(getIn(data, ['narrativeVisual', 'steps'], []));
      const steps = configuredSteps.length ? configuredSteps : ['Mapa estatal por productividad', 'Trayectoria de inversión pública', 'Educación técnica y salarios', 'Clusters regionales de crecimiento'];
      const title = getIn(data, ['narrativeVisual', 'title'], 'La historia visual');
      const description = getIn(data, ['narrativeVisual', 'description'], 'Al avanzar en la lectura, este módulo acompaña los argumentos centrales del artículo.');
      return h('details', { className: 'ce-preview__visual ce-preview__story', open: true },
        h('summary', { className: 'ce-preview__story-header' },
          h('span', {}, h('span', { className: 'ce-preview__badge ce-preview__badge--red' }, 'Narrativa visual'), h('span', { className: 'ce-preview__story-title' }, title)),
          h('span', { className: 'ce-preview__story-toggle', 'aria-hidden': 'true' })
        ),
        h('div', { className: 'ce-preview__progress', 'aria-hidden': 'true' }, h('span', {}, 'Progreso de lectura'), h('i', {}, h('b'))),
        h('div', { className: 'ce-preview__story-content' }, h('p', {}, description), h('ol', {}, steps.map((step) => h('li', {}, step))))
      );
    }

    function visualRail(data, suffix) {
      const visualTitle = getIn(data, ['visualSummary', 'title'], getIn(data, ['mainVisual', 'title'], 'Brechas de crecimiento estatal'));
      const visualCaption = getIn(data, ['visualSummary', 'caption'], 'Índice sintético de productividad, inversión y educación.');
      const lowLabel = getIn(data, ['visualSummary', 'lowLabel'], 'Bajo');
      const highLabel = getIn(data, ['visualSummary', 'highLabel'], 'Alto');
      const stats = [
        [getIn(data, ['visualSummary', 'statOneValue'], '32'), getIn(data, ['visualSummary', 'statOneLabel'], 'entidades')],
        [getIn(data, ['visualSummary', 'statTwoValue'], '2.4x'), getIn(data, ['visualSummary', 'statTwoLabel'], 'brecha PIB pc')],
        [getIn(data, ['visualSummary', 'statThreeValue'], '18'), getIn(data, ['visualSummary', 'statThreeLabel'], 'indicadores')],
      ];
      return h('aside', { className: `ce-preview__rail ce-preview__rail--${suffix}`, 'aria-label': 'Resumen visual del artículo' },
        h('section', { className: 'ce-preview__visual' },
          h('p', { className: 'ce-preview__badge' }, 'Resumen visual'), h('h2', {}, visualTitle),
          h('div', { className: 'ce-preview__map', 'aria-hidden': 'true' },
            h('span', { className: 'ce-preview__region ce-preview__region--one' }), h('span', { className: 'ce-preview__region ce-preview__region--two' }), h('span', { className: 'ce-preview__region ce-preview__region--three' }), h('span', { className: 'ce-preview__region ce-preview__region--four' }), h('span', { className: 'ce-preview__region ce-preview__region--five' })
          ),
          h('p', { className: 'ce-preview__caption' }, visualCaption),
          h('div', { className: 'ce-preview__legend', 'aria-hidden': 'true' }, h('span', {}, lowLabel), h('i'), h('i'), h('i'), h('i'), h('span', {}, highLabel)),
          h('dl', { className: 'ce-preview__stats' }, stats.map(([value, label]) => h('div', {}, h('dt', {}, value), h('dd', {}, label))))
        ),
        narrativeDetails(data)
      );
    }

    function renderContentBlock(block, index) {
      const type = block.type || 'paragraph';
      if (type === 'image') {
        const image = normalizeImagePath(block.image);
        return h('figure', { className: 'ce-preview__inline-visual', key: index },
          block.title ? h('h3', {}, block.title) : null,
          image ? h('img', { src: image, alt: block.alt || '' }) : h('div', { className: 'ce-preview__image-placeholder' }, 'Imagen pendiente'),
          (block.caption || block.source) ? h('figcaption', {}, block.caption || '', block.source ? h('span', {}, ` Fuente: ${block.source}`) : null) : null
        );
      }
      if (type === 'quote') {
        return h('blockquote', { className: 'ce-preview__quote', key: index }, h('p', {}, block.quote || 'Cita destacada'), block.attribution ? h('cite', {}, block.attribution) : null);
      }
      if (type === 'stat') {
        return h('aside', { className: 'ce-preview__data-callout', key: index }, block.kicker ? h('p', { className: 'ce-preview__data-kicker' }, block.kicker) : null, h('strong', {}, block.value || 'Dato'), h('p', {}, block.label || 'Descripción del dato destacado.'));
      }
      return h('section', { className: 'ce-preview__block', key: index }, block.heading ? h('h2', {}, block.heading) : null, block.text ? h('div', { className: 'ce-preview__block-text' }, block.text) : null);
    }

    function ArticlePreview(props) {
      const entry = props.entry;
      const data = entry.get('data');
      const body = props.widgetFor('body');
      const showVisual = getIn(data, ['showVisualStorytelling'], true) !== false;
      const title = getField(data, 'title', 'Título del artículo');
      const template = String(getField(data, 'template', 'artículo')).replaceAll('-', ' ');
      const author = getField(data, 'author', 'Centro Economex');
      const authorImage = normalizeImagePath(getField(data, 'authorImage', '')) || '/images/authors/default-profile.svg';
      const heroImage = normalizeImagePath(getField(data, 'heroImage', ''));
      const readTime = getField(data, 'readTime', '12 min de lectura');
      const summaryPoints = listToArray(getField(data, 'summaryPoints', []));
      const sources = listToArray(getField(data, 'sources', []));
      const contentBlocks = listToArray(getField(data, 'contentBlocks', []));

      return h('article', { className: 'ce-preview' },
        h('div', { className: `ce-preview__grid ${showVisual ? '' : 'ce-preview__grid--no-visual'}` },
          h('main', { className: 'ce-preview__main' },
            h('header', { className: 'ce-preview__hero' },
              h('p', { className: 'ce-preview__eyebrow' }, template), h('h1', {}, title), h('p', { className: 'ce-preview__dek' }, getField(data, 'oneSentence', 'Tema en una oración del artículo.')),
              h('div', { className: 'ce-preview__meta' },
                h('div', { className: 'ce-preview__author' }, h('img', { src: authorImage, alt: '' }), h('div', {}, h('strong', {}, author), h('span', {}, `Publicado el ${formatDate(getField(data, 'date', ''))} • ${readTime}`))),
                h('div', { className: 'ce-preview__actions', 'aria-label': 'Acciones del artículo' }, h('span', {}, '↗'), h('span', {}, '□'), h('span', {}, '▣'))
              ),
              heroImage ? h('figure', { className: 'ce-preview__hero-image' }, h('img', { src: heroImage, alt: '' })) : null,
              h('section', { className: 'ce-preview__summary' }, h('h2', {}, 'Resumen ejecutivo'), h('p', {}, getField(data, 'abstract', 'Resumen / abstract del artículo.')), summaryPoints.length ? h('ol', {}, summaryPoints.map((point) => h('li', {}, point))) : null)
            ),
            showVisual ? visualRail(data, 'mobile') : null,
            h('div', { className: 'ce-preview__body' }, contentBlocks.length ? contentBlocks.map(renderContentBlock) : body),
            sources.length ? h('section', { className: 'ce-preview__sources' }, h('h2', {}, 'Fuentes'), h('ul', {}, sources.map((source) => h('li', {}, h('a', { href: source.url || '#' }, source.label || 'Fuente'))))) : null,
            !showVisual ? h('p', { className: 'ce-preview__notice' }, 'Visual storytelling desactivado para este artículo.') : null
          ),
          showVisual ? visualRail(data, 'desktop') : null
        )
      );
    }

    CMS.registerPreviewStyle('/admin/preview.css');
    CMS.registerPreviewTemplate('articulos', ArticlePreview);
  }

  registerCentroEconomexPreview();
})();
