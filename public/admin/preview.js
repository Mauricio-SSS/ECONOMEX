(function () {
  const h = window.h;

  function getIn(data, path, fallback) {
    const value = data.getIn(path);
    if (value === undefined || value === null || value === '') return fallback;
    return value;
  }

  function listToArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (value.toJS) return value.toJS();
    return [];
  }

  function formatDate(value) {
    if (!value) return 'Fecha por definir';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  function visualRail(data, suffix) {
    const visualSummary = data.get('visualSummary');
    const narrativeVisual = data.get('narrativeVisual');
    const mainVisual = data.get('mainVisual');

    const visualTitle = getIn(data, ['visualSummary', 'title'], getIn(data, ['mainVisual', 'title'], 'Brechas de crecimiento estatal'));
    const visualCaption = getIn(data, ['visualSummary', 'caption'], 'Índice sintético de productividad, inversión y educación.');
    const lowLabel = getIn(data, ['visualSummary', 'lowLabel'], 'Bajo');
    const highLabel = getIn(data, ['visualSummary', 'highLabel'], 'Alto');
    const stats = [
      [getIn(data, ['visualSummary', 'statOneValue'], '32'), getIn(data, ['visualSummary', 'statOneLabel'], 'entidades')],
      [getIn(data, ['visualSummary', 'statTwoValue'], '2.4x'), getIn(data, ['visualSummary', 'statTwoLabel'], 'brecha PIB pc')],
      [getIn(data, ['visualSummary', 'statThreeValue'], '18'), getIn(data, ['visualSummary', 'statThreeLabel'], 'indicadores')],
    ];
    const steps = listToArray(getIn(data, ['narrativeVisual', 'steps'], [])).length
      ? listToArray(getIn(data, ['narrativeVisual', 'steps'], []))
      : ['Mapa estatal por productividad', 'Trayectoria de inversión pública', 'Educación técnica y salarios', 'Clusters regionales de crecimiento'];

    return h('aside', { className: `ce-preview__rail ce-preview__rail--${suffix}`, 'aria-label': 'Resumen visual del artículo' },
      h('section', { className: 'ce-preview__visual' },
        h('p', { className: 'ce-preview__badge' }, 'Resumen visual'),
        h('h2', {}, visualTitle),
        h('div', { className: 'ce-preview__map', 'aria-hidden': 'true' },
          h('span', { className: 'ce-preview__region ce-preview__region--one' }),
          h('span', { className: 'ce-preview__region ce-preview__region--two' }),
          h('span', { className: 'ce-preview__region ce-preview__region--three' }),
          h('span', { className: 'ce-preview__region ce-preview__region--four' }),
          h('span', { className: 'ce-preview__region ce-preview__region--five' })
        ),
        h('p', { className: 'ce-preview__caption' }, visualCaption),
        h('div', { className: 'ce-preview__legend', 'aria-hidden': 'true' },
          h('span', {}, lowLabel), h('i'), h('i'), h('i'), h('i'), h('span', {}, highLabel)
        ),
        h('dl', { className: 'ce-preview__stats' },
          stats.map(([value, label]) => h('div', {}, h('dt', {}, value), h('dd', {}, label)))
        )
      ),
      h('section', { className: 'ce-preview__visual' },
        h('p', { className: 'ce-preview__badge ce-preview__badge--red' }, 'Narrativa visual'),
        h('h2', {}, getIn(data, ['narrativeVisual', 'title'], 'La historia visual')),
        h('p', {}, getIn(data, ['narrativeVisual', 'description'], 'Al avanzar en la lectura, este módulo acompaña los argumentos centrales del artículo.')),
        h('ol', {}, steps.map((step) => h('li', {}, step))),
        h('div', { className: 'ce-preview__progress', 'aria-hidden': 'true' },
          h('span', {}, 'Progreso de lectura'), h('i', {}, h('b'))
        )
      )
    );
  }

  function ArticlePreview(props) {
    const entry = props.entry;
    const data = entry.get('data');
    const body = props.widgetFor('body');
    const showVisual = getIn(data, ['showVisualStorytelling'], true) !== false;
    const title = data.get('title') || 'Título del artículo';
    const template = (data.get('template') || 'artículo').replaceAll('-', ' ');
    const author = data.get('author') || 'Centro Economex';
    const authorImage = data.get('authorImage') || '/images/authors/default-profile.svg';
    const readTime = data.get('readTime') || '12 min de lectura';
    const summaryPoints = listToArray(data.get('summaryPoints'));
    const sources = listToArray(data.get('sources'));

    return h('article', { className: 'ce-preview' },
      h('div', { className: `ce-preview__grid ${showVisual ? '' : 'ce-preview__grid--no-visual'}` },
        h('main', { className: 'ce-preview__main' },
          h('header', { className: 'ce-preview__hero' },
            h('p', { className: 'ce-preview__eyebrow' }, template),
            h('h1', {}, title),
            h('p', { className: 'ce-preview__dek' }, data.get('oneSentence') || 'Tema en una oración del artículo.'),
            h('div', { className: 'ce-preview__meta' },
              h('div', { className: 'ce-preview__author' },
                h('img', { src: authorImage, alt: '' }),
                h('div', {}, h('strong', {}, author), h('span', {}, `Publicado el ${formatDate(data.get('date'))} • ${readTime}`))
              ),
              h('div', { className: 'ce-preview__actions', 'aria-label': 'Acciones del artículo' },
                h('span', {}, '↗'), h('span', {}, '□'), h('span', {}, '▣')
              )
            ),
            h('section', { className: 'ce-preview__summary' },
              h('h2', {}, 'Resumen ejecutivo'),
              h('p', {}, data.get('abstract') || 'Resumen / abstract del artículo.'),
              summaryPoints.length ? h('ol', {}, summaryPoints.map((point) => h('li', {}, point))) : null
            )
          ),
          showVisual ? visualRail(data, 'mobile') : null,
          h('div', { className: 'ce-preview__body' }, body),
          sources.length ? h('section', { className: 'ce-preview__sources' },
            h('h2', {}, 'Fuentes'),
            h('ul', {}, sources.map((source) => h('li', {}, h('a', { href: source.url || '#' }, source.label || 'Fuente'))))
          ) : null,
          !showVisual ? h('p', { className: 'ce-preview__notice' }, 'Visual storytelling desactivado para este artículo.') : null
        ),
        showVisual ? visualRail(data, 'desktop') : null
      )
    );
  }

  CMS.registerPreviewStyle('/admin/preview.css');
  CMS.registerPreviewTemplate('articulos', ArticlePreview);
})();
