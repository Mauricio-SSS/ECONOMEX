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
      return value === undefined || value === null || value === '' ? fallback : value;
    }

    function getField(data, name, fallback) {
      if (!data || !data.get) return fallback;
      const value = data.get(name);
      return value === undefined || value === null || value === '' ? fallback : value;
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

    function toNumber(value) {
      if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
      if (typeof value !== 'string') return 0;
      const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ''));
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function formatDate(value) {
      if (!value) return 'Fecha por definir';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    }

    function renderReusableVisual(block, index) {
      const visualType = block.visualType || 'data-card';
      const items = listToArray(block.items);
      const points = listToArray(block.points);
      const events = listToArray(block.events);
      const maxValue = Math.max.apply(null, items.map((item) => toNumber(item.value)).concat([1]));
      const pointValues = points.map((point) => toNumber(point.value));
      const minPoint = Math.min.apply(null, pointValues.concat([0]));
      const maxPoint = Math.max.apply(null, pointValues.concat([1]));
      const range = Math.max(maxPoint - minPoint, 1);
      const coords = points.map((point, pointIndex) => {
        const denominator = Math.max(points.length - 1, 1);
        const x = 34 + (pointIndex / denominator) * 572;
        const y = 230 - ((toNumber(point.value) - minPoint) / range) * 200;
        return Object.assign({}, point, { x, y });
      });
      const polyline = coords.map((point) => `${point.x},${point.y}`).join(' ');

      return h('figure', { className: `ce-preview__reusable ce-preview__reusable--${visualType}`, key: index },
        h('div', { className: 'ce-preview__reusable-head' },
          h('p', { className: 'ce-preview__badge ce-preview__badge--red' }, block.kicker || 'Visual Economex'),
          h('h3', {}, block.title || 'Visual')
        ),
        visualType === 'data-card' ? h('div', { className: 'ce-preview__data-card' }, h('strong', {}, block.value || '0'), h('p', {}, block.label || block.caption || 'Dato destacado.')) : null,
        visualType === 'bar-chart' ? h('div', { className: 'ce-preview__bars' }, items.map((item) => {
          const width = Math.max((toNumber(item.value) / maxValue) * 100, 2);
          const highlighted = block.highlightLabel && item.label === block.highlightLabel;
          return h('div', { className: highlighted ? 'ce-preview__bar is-highlighted' : 'ce-preview__bar' },
            h('p', {}, h('span', {}, item.label || ''), h('strong', {}, `${item.value || ''}${block.unit ? ` ${block.unit}` : ''}`)),
            h('i', {}, h('b', { style: { width: `${width}%` } })),
            item.note ? h('em', {}, item.note) : null
          );
        })) : null,
        visualType === 'line-chart' ? h('div', { className: 'ce-preview__line' },
          h('svg', { viewBox: '0 0 640 260', preserveAspectRatio: 'none' },
            h('line', { x1: 34, y1: 230, x2: 606, y2: 230, className: 'axis' }),
            h('line', { x1: 34, y1: 30, x2: 34, y2: 230, className: 'axis' }),
            h('polyline', { points: polyline, className: 'line' }),
            coords.map((point) => h('circle', { cx: point.x, cy: point.y, r: 5, className: 'point' }))
          ),
          h('div', {}, coords.map((point) => h('span', {}, h('strong', {}, point.label || ''), h('em', {}, `${point.value || ''}${block.unit ? ` ${block.unit}` : ''}`))))
        ) : null,
        visualType === 'timeline' ? h('ol', { className: 'ce-preview__timeline' }, events.map((event) => h('li', {}, h('time', {}, event.year || event.label || ''), h('div', {}, h('strong', {}, event.title || ''), h('p', {}, event.description || event.note || ''))))) : null,
        visualType === 'comparison' ? h('div', { className: 'ce-preview__comparison' }, h('div', {}, h('span', {}, block.leftLabel || 'Antes'), h('strong', {}, block.leftValue || '—')), h('div', {}, h('span', {}, block.rightLabel || 'Después'), h('strong', {}, block.rightValue || '—'))) : null,
        visualType === 'methodology' ? h('div', { className: 'ce-preview__methodology' }, block.text ? h('p', {}, block.text) : null, items.length ? h('ul', {}, items.map((item) => h('li', {}, h('span', {}, item.label || ''), item.description || item.note || ''))) : null) : null,
        visualType === 'map-index' ? h('div', { className: 'ce-preview__map-index' },
          h('div', { className: 'ce-preview__map' }, h('span', { className: 'ce-preview__region ce-preview__region--one' }), h('span', { className: 'ce-preview__region ce-preview__region--two' }), h('span', { className: 'ce-preview__region ce-preview__region--three' }), h('span', { className: 'ce-preview__region ce-preview__region--four' }), h('span', { className: 'ce-preview__region ce-preview__region--five' })),
          h('div', { className: 'ce-preview__map-list' }, items.slice(0, 5).map((item) => h('p', {}, h('span', {}, item.label || ''), h('strong', {}, item.value || ''))))
        ) : null,
        (block.caption || block.source) ? h('figcaption', {}, block.caption || '', block.source ? h('span', {}, ` Fuente: ${block.source}`) : null) : null
      );
    }

    function narrativeDetails(data) {
      const configuredSteps = listToArray(getIn(data, ['narrativeVisual', 'steps'], []));
      const steps = configuredSteps.length ? configuredSteps : ['Mapa estatal por productividad', 'Trayectoria de inversión pública', 'Educación técnica y salarios', 'Clusters regionales de crecimiento'];
      const title = getIn(data, ['narrativeVisual', 'title'], 'La historia visual');
      const description = getIn(data, ['narrativeVisual', 'description'], 'Al avanzar en la lectura, este módulo acompaña los argumentos centrales del artículo.');
      return h('details', { className: 'ce-preview__visual ce-preview__story', open: true },
        h('summary', { className: 'ce-preview__story-header' }, h('span', {}, h('span', { className: 'ce-preview__badge ce-preview__badge--red' }, 'Narrativa visual'), h('span', { className: 'ce-preview__story-title' }, title)), h('span', { className: 'ce-preview__story-toggle', 'aria-hidden': 'true' })),
        h('div', { className: 'ce-preview__progress', 'aria-hidden': 'true' }, h('span', {}, 'Progreso de lectura'), h('i', {}, h('b'))),
        h('div', { className: 'ce-preview__story-content' }, h('p', {}, description), h('ol', {}, steps.map((step) => h('li', {}, step))))
      );
    }

    function visualRail(data, suffix) {
      const visualTitle = getIn(data, ['visualSummary', 'title'], getIn(data, ['mainVisual', 'title'], 'Brechas de crecimiento estatal'));
      const visualCaption = getIn(data, ['visualSummary', 'caption'], 'Índice sintético de productividad, inversión y educación.');
      return h('aside', { className: `ce-preview__rail ce-preview__rail--${suffix}` }, h('section', { className: 'ce-preview__visual' }, h('p', { className: 'ce-preview__badge' }, 'Resumen visual'), h('h2', {}, visualTitle), h('div', { className: 'ce-preview__map' }, h('span', { className: 'ce-preview__region ce-preview__region--one' }), h('span', { className: 'ce-preview__region ce-preview__region--two' }), h('span', { className: 'ce-preview__region ce-preview__region--three' }), h('span', { className: 'ce-preview__region ce-preview__region--four' }), h('span', { className: 'ce-preview__region ce-preview__region--five' })), h('p', { className: 'ce-preview__caption' }, visualCaption)), narrativeDetails(data));
    }

    function renderContentBlock(block, index) {
      const type = block.type || 'paragraph';
      if (type === 'visual') return renderReusableVisual(block, index);
      if (type === 'image') {
        const image = normalizeImagePath(block.image);
        return h('figure', { className: 'ce-preview__inline-visual', key: index }, block.title ? h('h3', {}, block.title) : null, image ? h('img', { src: image, alt: block.alt || '' }) : h('div', { className: 'ce-preview__image-placeholder' }, 'Imagen pendiente'), (block.caption || block.source) ? h('figcaption', {}, block.caption || '', block.source ? h('span', {}, ` Fuente: ${block.source}`) : null) : null);
      }
      if (type === 'quote') return h('blockquote', { className: 'ce-preview__quote', key: index }, h('p', {}, block.quote || 'Cita destacada'), block.attribution ? h('cite', {}, block.attribution) : null);
      if (type === 'stat') return h('aside', { className: 'ce-preview__data-callout', key: index }, block.kicker ? h('p', { className: 'ce-preview__data-kicker' }, block.kicker) : null, h('strong', {}, block.value || 'Dato'), h('p', {}, block.label || 'Descripción del dato destacado.'));
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

      return h('article', { className: 'ce-preview' }, h('div', { className: `ce-preview__grid ${showVisual ? '' : 'ce-preview__grid--no-visual'}` }, h('main', { className: 'ce-preview__main' }, h('header', { className: 'ce-preview__hero' }, h('p', { className: 'ce-preview__eyebrow' }, template), h('h1', {}, title), h('p', { className: 'ce-preview__dek' }, getField(data, 'oneSentence', 'Tema en una oración del artículo.')), h('div', { className: 'ce-preview__meta' }, h('div', { className: 'ce-preview__author' }, h('img', { src: authorImage, alt: '' }), h('div', {}, h('strong', {}, author), h('span', {}, `Publicado el ${formatDate(getField(data, 'date', ''))} • ${readTime}`))), h('div', { className: 'ce-preview__actions' }, h('span', {}, '↗'), h('span', {}, '□'), h('span', {}, '▣'))), heroImage ? h('figure', { className: 'ce-preview__hero-image' }, h('img', { src: heroImage, alt: '' })) : null, h('section', { className: 'ce-preview__summary' }, h('h2', {}, 'Resumen ejecutivo'), h('p', {}, getField(data, 'abstract', 'Resumen / abstract del artículo.')), summaryPoints.length ? h('ol', {}, summaryPoints.map((point) => h('li', {}, point))) : null)), showVisual ? visualRail(data, 'mobile') : null, h('div', { className: 'ce-preview__body' }, contentBlocks.length ? contentBlocks.map(renderContentBlock) : body), sources.length ? h('section', { className: 'ce-preview__sources' }, h('h2', {}, 'Fuentes'), h('ul', {}, sources.map((source) => h('li', {}, h('a', { href: source.url || '#' }, source.label || 'Fuente'))))) : null), showVisual ? visualRail(data, 'desktop') : null));
    }

    CMS.registerPreviewStyle('/admin/preview.css');
    CMS.registerPreviewTemplate('articulos', ArticlePreview);
  }

  registerCentroEconomexPreview();
})();
