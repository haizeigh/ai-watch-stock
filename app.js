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
  } else if (settings.disguise === 'terminal') {
    renderTerminalLog(container);
  } else if (settings.disguise === 'json') {
    renderJsonResponse(container);
  }
}

function renderCompetitiveAnalysis(container) {
  const now = new Date().toISOString().split('T')[0];
  const items = settings.stocks.map((s, i) => {
    const p = prices[s];
    const val = p ? p.price.toFixed(2) : '---';
    const chg = p ? Math.abs(p.change_percent * 2).toFixed(1) : '---';
    const dir = p && p.change >= 0 ? 'increased' : p && p.change < 0 ? 'decreased' : '---';
    return `<tr>
      <td>${s}</td>
      <td>${val}</td>
      <td>${chg}%</td>
      <td>${dir}</td>
    </tr>`;
  }).join('');
  const filler = settings.stocks.map(s => {
    const p = prices[s];
    const val = p ? p.price.toFixed(2) : '---';
    return `• ${s}: Revenue reached ${val}B in Q2, representing a ${p ? Math.abs(p.change_percent).toFixed(1) : '--'}% ${p && p.change >= 0 ? 'increase' : 'decrease'} year-over-year. Market share expanded by ${p ? (Math.abs(p.change_percent) * 0.5).toFixed(1) : '--'}% in the North American region, driven by strong demand in the enterprise segment. Operating margins improved by ${p ? (Math.abs(p.change_percent) * 0.3).toFixed(1) : '--'}% compared to the previous quarter, reflecting successful cost optimization initiatives. The company continues to invest in R&D, with ${p ? (Math.abs(p.change_percent) * 0.8).toFixed(1) : '--'}% of revenue allocated to new product development.`;
  }).join('\n      </p><p class="doc-text">');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Competitive Analysis Report</div>
      <div class="doc-meta">Q3 2026 · Market Intelligence · Confidential · Generated: ${now}</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">1. Market Overview</div>
      <p class="doc-text">This report provides a comprehensive analysis of key market players in the technology sector. Data is compiled from the most recent quarterly filings, analyst reports, and real-time market data sources. All figures are in USD unless otherwise noted.</p>
      <p class="doc-text">The global technology market continues to show resilience despite macroeconomic headwinds. Enterprise software spending remains robust, driven by digital transformation initiatives across industries. Cloud infrastructure services continue to be the primary growth driver, with artificial intelligence and machine learning capabilities becoming increasingly critical to competitive differentiation.</p>
      <table class="data-table" style="margin-top: 16px;">
        <thead>
          <tr>
            <th>Company</th>
            <th>Revenue (B)</th>
            <th>Growth</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>
      <div class="last-updated" id="lastUpdated"></div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">2. Key Financial Insights</div>
      <p class="doc-text">${filler}</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">3. Market Trends & Outlook</div>
      <p class="doc-text">The competitive landscape is evolving rapidly, with several key trends shaping the market:</p>
      <p class="doc-text">• Artificial Intelligence Integration: Major technology companies are embedding AI capabilities across their product portfolios. Generative AI has emerged as a key differentiator, with enterprise adoption accelerating faster than previous technology cycles. Companies that successfully integrate AI into existing workflows are seeing significant competitive advantages.</p>
      <p class="doc-text">• Cloud Migration Acceleration: The shift to cloud computing continues to gain momentum, with hybrid and multi-cloud strategies becoming the norm. Enterprise customers are increasingly prioritizing cloud-native solutions that offer scalability, flexibility, and reduced total cost of ownership.</p>
      <p class="doc-text">• Cybersecurity Investment: Rising threat complexity and regulatory requirements are driving increased cybersecurity spending. Organizations are allocating larger portions of their IT budgets to security solutions, creating opportunities for vendors with comprehensive security portfolios.</p>
      <p class="doc-text">• Sustainability Initiatives: Environmental, social, and governance (ESG) considerations are becoming important factors in technology procurement decisions. Companies with strong sustainability credentials and transparent reporting are gaining preference among enterprise buyers.</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">4. Risk Factors</div>
      <p class="doc-text">• Regulatory Changes: Evolving data protection regulations and antitrust scrutiny could impact business models and operating practices. Companies with significant market power face increased regulatory attention.</p>
      <p class="doc-text">• Supply Chain Disruptions: Geopolitical tensions and component shortages continue to pose risks to hardware-dependent businesses. Semiconductor supply constraints could affect product availability and pricing.</p>
      <p class="doc-text">• Talent Competition: The demand for skilled technology professionals, particularly in AI and cybersecurity, remains intense. Companies that fail to attract and retain top talent may struggle to maintain their competitive position.</p>
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
    return `<div style="margin-bottom: 24px;">
      <div style="font-size: 15px; font-weight: 600; color: var(--accent);">v${ver} (Build ${d.toISOString().split('T')[0]})</div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--border);">
        <div style="margin-top: 4px;">• Updated ${s} core modules to latest stable version</div>
        <div>• Fixed memory leak in data processing pipeline</div>
        <div>• Improved error handling for edge cases</div>
        <div>• Security patches applied to authentication layer</div>
        <div>• Performance optimization for large dataset operations</div>
        <div>• Updated dependency: ${s}-utils to v${ver}</div>
      </div>
    </div>`;
  }).join('');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Release Notes · Changelog</div>
      <div class="doc-meta">Product Release · ${dateStr} · Published by Engineering Team</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Latest Releases</div>
      <p class="doc-text">This document provides a summary of recent product releases, including new features, bug fixes, performance improvements, and security updates. Each release is tagged with a version number and build date for traceability.</p>
      ${items}
      <div class="last-updated" id="lastUpdated"></div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Known Issues</div>
      <p class="doc-text">• Minor UI rendering issue in Safari browser when using dark mode. Workaround: switch to light mode temporarily. Fix scheduled for next release.</p>
      <p class="doc-text">• Export functionality may timeout for datasets exceeding 100K records. Recommended to split large exports into smaller batches. Engineering team is investigating optimization options.</p>
      <p class="doc-text">• Legacy API v1 endpoints will be deprecated on December 31, 2026. Please migrate to API v2. See migration guide in documentation.</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Upcoming Features</div>
      <p class="doc-text">• Real-time collaboration mode (Q4 2026)</p>
      <p class="doc-text">• Advanced analytics dashboard with custom reporting (Q4 2026)</p>
      <p class="doc-text">• Mobile application with offline support (Q1 2027)</p>
      <p class="doc-text">• Third-party integration marketplace (Q1 2027)</p>
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
      <td>${p ? (Math.abs(p.change_percent) * 2).toFixed(1) : '---'}%</td>
      <td>${p && p.change_percent > 0 ? '🟢 On track' : '🔴 Needs attention'}</td>
    </tr>`;
  }).join('');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Project Phoenix · Sprint Status Report</div>
      <div class="doc-meta">Sprint 24 · ${now} · Engineering Team · Confidential</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Sprint Overview</div>
      <p class="doc-text">Sprint 24 is progressing according to plan. The team has completed 12 out of 18 story points, with 6 remaining in the backlog. Velocity remains stable at an average of 16 points per sprint. No critical blockers have been identified. The following sections provide a detailed breakdown of key metrics, accomplishments, and risks.</p>
      <table class="data-table" style="margin-top: 16px;">
        <thead><tr><th>KPI</th><th>Current Value</th><th>Change</th><th>Status</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div class="last-updated" id="lastUpdated"></div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Completed This Sprint</div>
      <p class="doc-text">• Migrated legacy authentication service to new identity provider. All existing user sessions preserved. Zero downtime during migration. Rollback plan tested and verified.</p>
      <p class="doc-text">• Implemented caching layer for API responses. Reduced average response time by 40%. Cache hit rate currently at 85%. Memory usage within expected parameters.</p>
      <p class="doc-text">• Updated data visualization library to latest version. All existing dashboards validated for backward compatibility. New chart types available for upcoming features.</p>
      <p class="doc-text">• Resolved 15 production bugs including 2 critical severity issues. Average resolution time improved from 48 hours to 12 hours.</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Blockers & Risks</div>
      <p class="doc-text">• Database migration script performance: The schema migration for the analytics module is taking longer than expected. Estimated completion: 2 additional days. Workaround: running migration during low-traffic window.</p>
      <p class="doc-text">• Third-party API rate limit: The external data provider has reduced our API rate limit. Engineering team is negotiating an increase. Fallback: cached data will be used for up to 24 hours.</p>
      <p class="doc-text">• SSL certificate renewal: Two certificates are expiring within the next 2 weeks. Renewal process has been initiated. No expected impact on production services.</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Next Sprint Planning</div>
      <p class="doc-text">• Priority 1: Complete database migration and deploy analytics dashboard v2</p>
      <p class="doc-text">• Priority 2: Implement automated backup system for critical data stores</p>
      <p class="doc-text">• Priority 3: Begin technical design for real-time notification service</p>
      <p class="doc-text">• Priority 4: Conduct security audit of all external API integrations</p>
    </div>
  `;
}

function renderTerminalLog(container) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString();
  const items = settings.stocks.map(s => {
    const p = prices[s];
    const val = p ? p.price.toFixed(2) : '---';
    return `[${dateStr} ${timeStr}] ${s}: status=active uptime=${(Math.random() * 100).toFixed(0)}d load=${val} memory_used=${val}GB disk_io=${(Math.abs(p ? p.change : Math.random() * 10)).toFixed(2)}MB/s connections=${Math.floor(Math.abs(p ? p.price : Math.random() * 10000))}`;
  }).join('\n');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Terminal · ssh admin@production-cluster-01</div>
      <div class="doc-meta" style="font-family: monospace; font-size: 11px; color: var(--text-secondary);">Last login: ${dateStr} ${timeStr} from 10.0.0.1</div>
    </div>
    <div style="background: #0f172a; color: #22c55e; padding: 24px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8;">
      <div style="color: #94a3b8;">$ systemctl status cluster-monitor</div>
      <div>● cluster-monitor.service - Production Cluster Monitoring Service</div>
      <div>   Loaded: loaded (/etc/systemd/system/cluster-monitor.service; enabled; vendor preset: enabled)</div>
      <div>   Active: active (running) since ${dateStr}</div>
      <div>     Docs: https://docs.internal/cluster-monitor</div>
      <div>   Main PID: ${Math.floor(Math.random() * 99999 + 10000)} (node)</div>
      <div>    Memory: ${(Math.random() * 500 + 100).toFixed(0)}.${Math.floor(Math.random() * 9)}M</div>
      <div>      CPU: ${(Math.random() * 30 + 10).toFixed(1)}%</div>
      <div style="margin-top: 12px; color: #94a3b8;">$ tail -f /var/log/cluster-monitor/current.log</div>
      ${items.split('\n').map(line => `<div style="color: #22c55e;">${line}</div>`).join('\n')}
      <div style="margin-top: 12px; color: #94a3b8;">$ █</div>
      <div class="last-updated" id="lastUpdated" style="color: #4ade80; font-size: 11px; margin-top: 12px;"></div>
    </div>
  `;
}

function renderJsonResponse(container) {
  const items = settings.stocks.map(s => {
    const p = prices[s];
    return {
      id: s.toLowerCase(),
      name: `${s} Inc.`,
      status: p ? 'operational' : 'pending',
      metrics: {
        requests_per_sec: p ? p.price.toFixed(2) : null,
        error_rate: p ? Math.abs(p.change_percent / 100).toFixed(4) : null,
        avg_latency_ms: p ? Math.abs(p.price * 10).toFixed(1) : null,
        uptime: `${(99.9 + Math.random() * 0.09).toFixed(2)}%`,
        total_requests: Math.floor(Math.abs(p ? p.price * 10000 : Math.random() * 100000)),
      },
      lastChecked: new Date().toISOString(),
    };
  });
  const json = JSON.stringify({
    success: true,
    timestamp: new Date().toISOString(),
    endpoint: '/api/v2/services/status',
    count: items.length,
    data: items,
    _metadata: {
      version: '2.4.1',
      responseTime: `${(Math.random() * 100 + 20).toFixed(0)}ms`,
      cache: 'HIT',
    },
  }, null, 2);
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">API Response · GET /api/v2/services/status</div>
      <div class="doc-meta" style="font-family: monospace; font-size: 11px; color: var(--text-secondary);">HTTP/2 200 OK · Content-Type: application/json · Server: nginx/1.24</div>
    </div>
    <div style="background: #1e293b; color: #e2e8f0; padding: 24px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; overflow-x: auto;">
      ${json.split('\n').map((line, i) => {
        let color = '#e2e8f0';
        if (line.includes('"success"')) color = '#22c55e';
        if (line.includes('"error"')) color = '#ef4444';
        if (line.includes('"id"') || line.includes('"name"')) color = '#f59e0b';
        if (line.includes('"status"')) color = '#60a5fa';
        if (line.includes('"metrics"')) color = '#a78bfa';
        if (line.includes('"uptime"') || line.includes('99.')) color = '#4ade80';
        return `<div style="color: ${color};">${line.replace(/ /g, '\u00a0')}</div>`;
      }).join('\n')}
      <div class="last-updated" id="lastUpdated" style="color: #94a3b8; font-size: 11px; margin-top: 12px;"></div>
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
