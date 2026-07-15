// ========== Default Settings ==========
const DEFAULTS = {
  lang: 'en',
  theme: 'light',
  stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
  source: 'auto',
  apiKey: 'd9bj1k1r01qv2lms1fagd9bj1k1r01qv2lms1fb0',
  disguise: 'competitive',
};

// ========== Translations ==========
const LANG = {
  en: {
    title: 'Competitive Analysis Report',
    subtitle: 'Q3 2026 · Market Intelligence · Confidential',
    section1: '1. Market Overview',
    section2: '2. Key Insights',
    colCompany: 'Company',
    colRevenue: 'Revenue (B)',
    colGrowth: 'Growth',
    colPrice: 'Stock Price',
    insight1: 'AAPL showing strong services growth with record margins.',
    insight2: 'MSFT cloud revenue continues to accelerate, driven by AI adoption.',
    insight3: 'GOOGL ad revenue stabilizing after market headwinds.',
    insight4: 'AMZN AWS growth re-accelerating, margins improving.',
    lastUpdate: 'Last updated',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    stocks: 'Stocks',
    addStock: 'Add',
    dataSource: 'Data Source',
    auto: 'Auto',
    apiKey: 'API Key',
    save: 'Save',
    close: 'Close',
    statusOk: 'Connected',
    statusError: 'API Error',
    statusPending: 'Updating...',
    sourceFinnhub: 'Finnhub',
    sourceYahoo: 'Yahoo Finance',
    disguise: 'Disguise Style',
    competitive: 'Competitive Analysis',
    release: 'Release Notes',
    confluence: 'Project Report',
  },
  ko: {
    title: '경쟁사 분석 보고서',
    subtitle: '2026년 3분기 · 시장 인텔리전스 · 기밀',
    section1: '1. 시장 개요',
    section2: '2. 주요 인사이트',
    colCompany: '기업',
    colRevenue: '매출 (B)',
    colGrowth: '성장률',
    colPrice: '주가',
    insight1: 'AAPL, 서비스 부문 성장세 지속, 기록적인 마진 달성.',
    insight2: 'MSFT, AI 도입에 힘입어 클라우드 매출 가속화.',
    insight3: 'GOOGL, 시장 역풍 이후 광고 수익 안정화.',
    insight4: 'AMZN, AWS 성장 재가속화, 마진 개선.',
    lastUpdate: '마지막 업데이트',
    settings: '설정',
    language: '언어',
    theme: '테마',
    light: '라이트',
    dark: '다크',
    stocks: '주식',
    addStock: '추가',
    dataSource: '데이터 소스',
    auto: '자동',
    apiKey: 'API 키',
    save: '저장',
    close: '닫기',
    statusOk: '연결됨',
    statusError: 'API 오류',
    statusPending: '업데이트 중...',
    sourceFinnhub: 'Finnhub',
    sourceYahoo: 'Yahoo Finance',
    disguise: '문서 스타일',
    competitive: '경쟁사 분석',
    release: '릴리즈 노트',
    confluence: '프로젝트 보고서',
  },
  zh: {
    title: '竞争分析报告',
    subtitle: '2026年第三季度 · 市场情报 · 机密',
    section1: '1. 市场概览',
    section2: '2. 关键洞察',
    colCompany: '公司',
    colRevenue: '营收 (B)',
    colGrowth: '增长率',
    colPrice: '股价',
    insight1: 'AAPL 服务业务持续增长，利润率创纪录。',
    insight2: 'MSFT 受 AI 采用推动，云收入加速增长。',
    insight3: 'GOOGL 广告收入在市场逆风后趋于稳定。',
    insight4: 'AMZN AWS 增长重新加速，利润率改善。',
    lastUpdate: '最后更新',
    settings: '设置',
    language: '语言',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    stocks: '股票',
    addStock: '添加',
    dataSource: '数据源',
    auto: '自动',
    apiKey: 'API 密钥',
    save: '保存',
    close: '关闭',
    statusOk: '已连接',
    statusError: 'API 错误',
    statusPending: '更新中...',
    sourceFinnhub: 'Finnhub',
    sourceYahoo: 'Yahoo Finance',
    disguise: '伪装样式',
    competitive: '竞争分析',
    release: '发布日志',
    confluence: '项目报告',
  },
};

// ========== State ==========
let settings = loadSettings();
let prices = {};
let intervalId = null;
let statusState = 'pending';

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyLang();
  renderStocks();
  renderDisguise();
  renderSettings();
  fetchPrices();
  startAutoRefresh();
});

// ========== Settings ==========
function loadSettings() {
  try {
    const saved = localStorage.getItem('aw-stock-settings');
    if (saved) return { ...DEFAULTS, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULTS };
}

function saveSettings() {
  localStorage.setItem('aw-stock-settings', JSON.stringify(settings));
}

// ========== Theme ==========
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
}

function toggleTheme() {
  settings.theme = settings.theme === 'light' ? 'dark' : 'light';
  applyTheme();
  saveSettings();
  document.getElementById('themeBtn').innerHTML = settings.theme === 'light' ? '☀️' : '🌙';
}

// ========== Language ==========
function t(key) {
  return LANG[settings.lang]?.[key] || LANG['en'][key] || key;
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// ========== Disguise ==========
function renderDisguise() {
  const container = document.getElementById('documentContent');
  if (!container) return;

  if (settings.disguise === 'competitive') {
    renderCompetitiveAnalysis(container);
  } else if (settings.disguise === 'release') {
    renderReleaseNotes(container);
  } else if (settings.disguise === 'confluence') {
    renderConfluenceReport(container);
  }
}

function renderCompetitiveAnalysis(container) {
  const now = new Date().toISOString().split('T')[0];
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title" data-i18n="title">${t('title')}</div>
      <div class="doc-meta">${t('subtitle')} · Generated: ${now}</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title" data-i18n="section1">${t('section1')}</div>
      <p class="doc-text">The following table presents a comparative analysis of key market players. Data reflects the most recent quarterly filings and real-time market data.</p>
    </div>
    <div class="doc-section">
      <table class="data-table">
        <thead>
          <tr>
            <th data-i18n="colCompany">${t('colCompany')}</th>
            <th data-i18n="colPrice">${t('colPrice')}</th>
            <th data-i18n="colRevenue">${t('colRevenue')}</th>
            <th data-i18n="colGrowth">${t('colGrowth')}</th>
          </tr>
        </thead>
        <tbody id="priceTableBody">
          ${settings.stocks.map(s => renderStockRow(s)).join('')}
        </tbody>
      </table>
      <div class="last-updated" id="lastUpdated"></div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title" data-i18n="section2">${t('section2')}</div>
      <p class="doc-text">• AAPL: ${t('insight1')}</p>
      <p class="doc-text">• MSFT: ${t('insight2')}</p>
      <p class="doc-text">• GOOGL: ${t('insight3')}</p>
      <p class="doc-text">• AMZN: ${t('insight4')}</p>
    </div>
  `;
}

function renderStockRow(symbol) {
  const p = prices[symbol];
  if (!p) {
    return `<tr><td class="ticker">${symbol}</td><td class="price-flat">---</td><td>---</td><td>---</td></tr>`;
  }
  const priceClass = p.change >= 0 ? 'price-up' : 'price-down';
  const arrow = p.change >= 0 ? '▲' : '▼';
  const revenue = (p.price * 2.5).toFixed(2);
  const growth = (p.change_percent * 3).toFixed(1);
  return `<tr>
    <td class="ticker">${symbol}</td>
    <td class="${priceClass}">$${p.price.toFixed(2)}</td>
    <td>$${revenue}B</td>
    <td class="${priceClass}">${arrow} ${growth > 0 ? '+' : ''}${growth}%</td>
  </tr>`;
}

function renderReleaseNotes(container) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const items = settings.stocks.map((s, i) => {
    const p = prices[s];
    const ver = p ? p.price.toFixed(2) : '---';
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return `<div style="margin-bottom: 20px;">
      <div style="font-size: 15px; font-weight: 600; color: var(--accent);">Version ${ver} — ${d.toISOString().split('T')[0]}</div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">• Updated ${s} core dependencies for security patches</div>
      <div style="font-size: 13px; color: var(--text-secondary);">• Fixed critical issue in data pipeline</div>
    </div>`;
  }).join('');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Changelog · Release Notes</div>
      <div class="doc-meta">Product · ${dateStr}</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Latest Versions</div>
      ${items}
      <div class="last-updated" id="lastUpdated"></div>
    </div>
  `;
}

function renderConfluenceReport(container) {
  const now = new Date().toISOString().split('T')[0];
  const items = settings.stocks.map(s => {
    const p = prices[s];
    const val = p ? p.price.toFixed(2) : '---';
    return `<tr>
      <td class="ticker">${s}</td>
      <td>${val}</td>
      <td>${p ? (p.change_percent * 2).toFixed(1) : '---'}%</td>
      <td>${p && p.change_percent > 0 ? '✅ On track' : '⚠️ Needs attention'}</td>
    </tr>`;
  }).join('');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Project Phoenix · Status Report</div>
      <div class="doc-meta">Sprint 24 · ${now} · Confidential</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Key Metrics</div>
      <table class="data-table">
        <thead><tr><th>KPI</th><th>Value</th><th>Change</th><th>Status</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div class="last-updated" id="lastUpdated"></div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Blockers</div>
      <p class="doc-text">• Database migration in progress (estimated completion: next sprint)</p>
      <p class="doc-text">• API rate limit increase under review with engineering team</p>
      <p class="doc-text">• SSL certificate renewal scheduled for next maintenance window</p>
    </div>
  `;
}

// ========== API ==========
async function fetchPrices() {
  updateStatus('pending');
  for (const symbol of settings.stocks) {
    try {
      if (settings.source === 'auto' || settings.source === 'finnhub') {
        const data = await fetchFromFinnhub(symbol);
        if (data) {
          prices[symbol] = data;
          continue;
        }
      }
      if (settings.source === 'auto' || settings.source === 'yahoo') {
        const data = await fetchFromYahoo(symbol);
        if (data) {
          prices[symbol] = data;
        }
      }
    } catch {}
  }
  updateDisplay();
}

async function fetchFromFinnhub(symbol) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${settings.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.c === undefined || data.c === 0) return null;
    return {
      price: data.c,
      change: data.d,
      change_percent: data.dp,
    };
  } catch { return null; }
}

async function fetchFromYahoo(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || price;
    return {
      price,
      change: price - prevClose,
      change_percent: ((price - prevClose) / prevClose) * 100,
    };
  } catch { return null; }
}

// ========== Display ==========
function updateDisplay() {
  renderDisguise();
  updateStatus(Object.keys(prices).length > 0 ? 'ok' : 'error');
  const el = document.getElementById('lastUpdated');
  if (el) {
    el.textContent = `${t('lastUpdate')}: ${new Date().toLocaleTimeString()}`;
  }
}

function updateStatus(state) {
  statusState = state;
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  if (dot && text) {
    dot.className = `status-dot ${state}`;
    text.textContent = state === 'ok' ? t('statusOk') : state === 'error' ? t('statusError') : t('statusPending');
  }
}

function startAutoRefresh() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(fetchPrices, 15000);
}

// ========== Settings UI ==========
function renderStocks() {
  const container = document.getElementById('stockTags');
  if (!container) return;
  container.innerHTML = settings.stocks.map(s =>
    `<span class="stock-tag">${s} <span class="stock-tag-remove" onclick="removeStock('${s}')">×</span></span>`
  ).join('');
}

function removeStock(symbol) {
  settings.stocks = settings.stocks.filter(s => s !== symbol);
  saveSettings();
  renderStocks();
}

function addStock() {
  const input = document.getElementById('stockInput');
  const symbol = input.value.trim().toUpperCase();
  if (!symbol || settings.stocks.includes(symbol)) return;
  settings.stocks.push(symbol);
  saveSettings();
  renderStocks();
  input.value = '';
}

function openSettings() {
  document.getElementById('settingsOverlay').classList.add('open');
  renderSettingsForm();
}

function closeSettings() {
  document.getElementById('settingsOverlay').classList.remove('open');
}

function renderSettingsForm() {
  document.getElementById('settingsLang').value = settings.lang;
  document.getElementById('settingsTheme').value = settings.theme;
  document.getElementById('settingsSource').value = settings.source;
  document.getElementById('settingsApiKey').value = settings.apiKey;
  document.querySelectorAll('.disguise-option').forEach(el => {
    el.classList.toggle('active', el.dataset.disguise === settings.disguise);
  });
}

function renderSettings() {
  renderSettingsForm();
  renderStocks();
}

function saveSettingsForm() {
  settings.lang = document.getElementById('settingsLang').value;
  settings.theme = document.getElementById('settingsTheme').value;
  settings.source = document.getElementById('settingsSource').value;
  settings.apiKey = document.getElementById('settingsApiKey').value;
  saveSettings();
  applyTheme();
  applyLang();
  renderDisguise();
  closeSettings();
  document.getElementById('themeBtn').innerHTML = settings.theme === 'light' ? '☀️' : '🌙';
}

function selectDisguise(type) {
  settings.disguise = type;
  saveSettings();
  renderSettingsForm();
  renderDisguise();
}
