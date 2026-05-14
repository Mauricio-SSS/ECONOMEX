const WORLD_BANK_BASE = 'https://api.worldbank.org/v2/country/MEX/indicator';
const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';
const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=M%C3%A9xico%20econom%C3%ADa%20OR%20Banxico%20OR%20inflaci%C3%B3n&hl=es-419&gl=MX&ceid=MX:es-419';

const SOURCE_LINKS = [
  { name: 'Banco Mundial API', type: 'API publica', url: 'https://api.worldbank.org/v2/country/MEX/indicator/NY.GDP.MKTP.KD.ZG?format=json' },
  { name: 'Yahoo Finance Chart API', type: 'Mercados', url: 'https://query1.finance.yahoo.com/v8/finance/chart/USDMXN=X' },
  { name: 'Banco de Mexico SIE API', type: 'API oficial con token', url: 'https://www.banxico.org.mx/SieAPIRest/service/v1/' },
  { name: 'INEGI API de Indicadores', type: 'API oficial con token', url: 'https://www.inegi.org.mx/servicios/api_indicadores.html' },
  { name: 'Google News RSS', type: 'Noticias agregadas', url: GOOGLE_NEWS_RSS },
];

const WORLD_BANK_INDICATORS = [
  { key: 'gdpGrowth', label: 'PIB real', indicator: 'NY.GDP.MKTP.KD.ZG', suffix: '%', source: 'Banco Mundial', description: 'Crecimiento anual del PIB real.' },
  { key: 'inflation', label: 'Inflacion', indicator: 'FP.CPI.TOTL.ZG', suffix: '%', source: 'Banco Mundial', description: 'Inflacion anual medida por el IPC.' },
  { key: 'unemployment', label: 'Desempleo', indicator: 'SL.UEM.TOTL.ZS', suffix: '%', source: 'Banco Mundial', description: 'Tasa de desempleo total.' },
  { key: 'fdi', label: 'IED neta', indicator: 'BX.KLT.DINV.CD.WD', prefix: 'US$', compact: true, source: 'Banco Mundial', description: 'Inversion extranjera directa neta.' },
  { key: 'remittances', label: 'Remesas', indicator: 'BX.TRF.PWKR.CD.DT', prefix: 'US$', compact: true, source: 'Banco Mundial', description: 'Remesas personales recibidas.' },
];

const MARKET_SYMBOLS = [
  { key: 'usdmxn', label: 'USD/MXN', symbol: 'USDMXN=X', prefix: '$', source: 'Yahoo Finance', description: 'Tipo de cambio de mercado.' },
  { key: 'ipc', label: 'S&P/BMV IPC', symbol: '^MXX', suffix: ' pts', source: 'Yahoo Finance', description: 'Principal indice accionario mexicano.' },
];

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
      'access-control-allow-origin': '*',
    },
  });
}

async function fetchWithTimeout(url, options = {}, timeout = 7000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, headers: { 'user-agent': 'CentroEconomexMonitor/1.0', ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response;
  } finally {
    clearTimeout(id);
  }
}

function latestNonNull(rows = []) {
  return rows.find((row) => row && row.value !== null && row.value !== undefined && row.value !== '');
}

function formatNumber(value, options = {}) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 'N/D';
  if (options.compact) {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(numeric);
  }
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: options.decimals ?? 2 }).format(numeric);
}

async function worldBankIndicator(config) {
  const url = `${WORLD_BANK_BASE}/${config.indicator}?format=json&per_page=12`;
  const response = await fetchWithTimeout(url);
  const data = await response.json();
  const row = latestNonNull(Array.isArray(data) ? data[1] : []);
  if (!row) throw new Error('Sin observaciones recientes');
  const value = Number(row.value);
  return {
    key: config.key,
    label: config.label,
    value: `${config.prefix || ''}${formatNumber(value, { compact: config.compact })}${config.suffix || ''}`,
    rawValue: value,
    date: row.date,
    delta: 'Ultimo dato anual',
    source: config.source,
    sourceUrl: url,
    description: config.description,
    frequency: 'Anual',
    freshness: 'latest_available',
  };
}

async function yahooQuote(config) {
  const url = `${YAHOO_BASE}/${encodeURIComponent(config.symbol)}?range=5d&interval=1d`;
  const response = await fetchWithTimeout(url);
  const data = await response.json();
  const result = data?.chart?.result?.[0];
  const meta = result?.meta || {};
  const price = Number(meta.regularMarketPrice ?? meta.previousClose);
  const previous = Number(meta.chartPreviousClose ?? meta.previousClose);
  if (!Number.isFinite(price)) throw new Error('Sin precio reciente');
  const change = Number.isFinite(previous) && previous !== 0 ? ((price - previous) / previous) * 100 : null;
  return {
    key: config.key,
    label: config.label,
    value: `${config.prefix || ''}${formatNumber(price, { decimals: config.key === 'usdmxn' ? 4 : 2 })}${config.suffix || ''}`,
    rawValue: price,
    date: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
    delta: change === null ? 'Mercado' : `${change >= 0 ? '+' : ''}${formatNumber(change, { decimals: 2 })}%`,
    source: config.source,
    sourceUrl: url,
    description: config.description,
    frequency: 'Mercado',
    freshness: 'market',
  };
}

async function banxicoSeries(seriesId, label, token) {
  if (!token) return null;
  const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${seriesId}/datos/oportuno`;
  const response = await fetchWithTimeout(url, { headers: { 'Bmx-Token': token } });
  const data = await response.json();
  const point = data?.bmx?.series?.[0]?.datos?.[0];
  if (!point?.dato) throw new Error('Sin dato Banxico');
  const raw = Number(String(point.dato).replace(/,/g, ''));
  return {
    key: `banxico-${seriesId}`,
    label,
    value: formatNumber(raw, { decimals: 4 }),
    rawValue: raw,
    date: point.fecha,
    delta: 'Dato oportuno',
    source: 'Banco de Mexico SIE',
    sourceUrl: url,
    description: `Serie Banxico ${seriesId}`,
    frequency: 'Oportuno',
    freshness: 'official_live',
  };
}

function parseNewsItems(xml) {
  return Array.from(xml.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<\/item>/g))
    .slice(0, 5)
    .map((match) => ({ title: match[1].replace(/ - .+$/, ''), url: match[2], date: match[3], source: 'Google News RSS' }));
}

async function latestNews() {
  const response = await fetchWithTimeout(GOOGLE_NEWS_RSS, {}, 7000);
  const xml = await response.text();
  return parseNewsItems(xml);
}

export async function onRequestGet(context) {
  const startedAt = new Date();
  const env = context?.env || {};
  const errors = [];

  const macroResults = await Promise.allSettled(WORLD_BANK_INDICATORS.map((indicator) => worldBankIndicator(indicator)));
  const marketResults = await Promise.allSettled(MARKET_SYMBOLS.map((symbol) => yahooQuote(symbol)));

  const kpis = [];
  for (const result of [...macroResults, ...marketResults]) {
    if (result.status === 'fulfilled') kpis.push(result.value);
    else errors.push(result.reason?.message || String(result.reason));
  }

  const officialLive = [];
  const banxicoToken = env.BANXICO_TOKEN;
  const banxicoCandidates = [
    { series: 'SF43718', label: 'FIX Banxico' },
  ];

  for (const item of banxicoCandidates) {
    try {
      const value = await banxicoSeries(item.series, item.label, banxicoToken);
      if (value) officialLive.push(value);
    } catch (error) {
      errors.push(`Banxico ${item.series}: ${error.message}`);
    }
  }

  let news = [];
  try {
    news = await latestNews();
  } catch (error) {
    errors.push(`Noticias: ${error.message}`);
  }

  return jsonResponse({
    status: errors.length ? 'partial' : 'live',
    generatedAt: startedAt.toISOString(),
    note: 'Los indicadores de mercado se actualizan con datos disponibles de mercado. Los indicadores macroeconomicos se muestran con la ultima observacion publicada por la fuente. Banxico SIE se activa con la variable BANXICO_TOKEN en Cloudflare Pages.',
    kpis,
    officialLive,
    news,
    sources: SOURCE_LINKS,
    errors,
  });
}
