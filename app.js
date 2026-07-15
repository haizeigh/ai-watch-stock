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

// ========== Random text generators ==========
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomPara(topics, count = 4) {
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).join('</p><p class="doc-text">');
}

const marketTrends = [
  'Artificial Intelligence Integration: Major technology companies are embedding AI capabilities across their product portfolios. Generative AI has emerged as a key differentiator, with enterprise adoption accelerating faster than previous technology cycles.',
  'Cloud Migration Acceleration: The shift to cloud computing continues to gain momentum, with hybrid and multi-cloud strategies becoming the norm. Enterprise customers are increasingly prioritizing cloud-native solutions.',
  'Cybersecurity Investment: Rising threat complexity and regulatory requirements are driving increased cybersecurity spending. Organizations are allocating larger portions of their IT budgets to security solutions.',
  'Sustainability Initiatives: Environmental, social, and governance (ESG) considerations are becoming important factors in technology procurement decisions.',
  'Edge Computing Growth: Processing data closer to the source is reducing latency and bandwidth costs. Edge computing deployments are expected to grow significantly across manufacturing, healthcare, and retail sectors.',
  'Digital Transformation Acceleration: Companies across all industries are accelerating their digital transformation initiatives, driven by the need for operational efficiency and improved customer experiences.',
  '5G Network Expansion: The rollout of 5G networks is enabling new use cases in IoT, autonomous vehicles, and remote surgery. Telecommunications companies are investing heavily in infrastructure.',
  'Quantum Computing Advances: While still in early stages, quantum computing research is progressing rapidly. Major technology companies are investing in quantum hardware and software development.',
  'Blockchain Beyond Crypto: Enterprise blockchain adoption is growing in supply chain management, healthcare records, and financial services. Distributed ledger technology is finding practical applications.',
  'Remote Work Technology: The shift to hybrid and remote work models is driving demand for collaboration tools, virtual desktop infrastructure, and secure remote access solutions.',
];

const riskFactors = [
  'Regulatory Changes: Evolving data protection regulations and antitrust scrutiny could impact business models and operating practices. Companies with significant market power face increased regulatory attention.',
  'Supply Chain Disruptions: Geopolitical tensions and component shortages continue to pose risks to hardware-dependent businesses. Semiconductor supply constraints could affect product availability and pricing.',
  'Talent Competition: The demand for skilled technology professionals, particularly in AI and cybersecurity, remains intense. Companies that fail to attract and retain top talent may struggle to maintain their competitive position.',
  'Interest Rate Sensitivity: Rising interest rates could impact valuations of high-growth technology companies. Access to capital may become more constrained for early-stage ventures.',
  'Geopolitical Risks: Trade tensions between major economies could disrupt global technology supply chains and market access. Companies with significant international exposure face heightened uncertainty.',
  'Cybersecurity Threats: Increasing sophistication of cyber attacks poses risks to data security and business continuity. The average cost of a data breach continues to rise year over year.',
  'Market Saturation: Key technology markets are becoming increasingly saturated, leading to margin compression and intensified competition. Companies must innovate continuously to maintain market share.',
];

const companyNews = [
  'announced a strategic partnership to expand its cloud infrastructure footprint across the Asia-Pacific region',
  'reported strong quarterly earnings, beating analyst expectations across all business segments',
  'launched a new AI-powered product line aimed at enterprise customers',
  'completed the acquisition of a promising startup in the machine learning space',
  'secured a major contract with a Fortune 500 company for its cloud services',
  'announced a share buyback program worth $10 billion',
  'appointed a new CEO with extensive experience in the technology sector',
  'opened a new research and development center focused on artificial intelligence',
  'expanded its partnership with a leading cloud provider to offer integrated solutions',
  'released its latest software update with significant performance improvements',
];

const projectUpdates = [
  'Successfully deployed the new authentication service with zero downtime. User migration completed ahead of schedule.',
  'Completed the database schema migration for the analytics module. Performance improvements exceeded targets.',
  'Implemented caching layer for API responses. Average response time reduced by 40%. Cache hit rate at 85%.',
  'Resolved 15 production bugs including 2 critical severity issues. Average resolution time improved from 48 hours to 12 hours.',
  'Updated the data visualization library to the latest version. All existing dashboards validated for backward compatibility.',
  'Completed the security audit of all external API integrations. No critical vulnerabilities found.',
  'Deployed the new notification service. Delivery rate improved from 92% to 99.5%.',
  'Migrated legacy data storage to the new distributed system. Data integrity verified across all shards.',
  'Implemented automated backup system for critical data stores. Recovery time objective reduced to 15 minutes.',
  'Completed the performance optimization sprint. Page load times improved by an average of 35%.',
];

const nextSprintItems = [
  'Complete the database migration for the remaining legacy services',
  'Implement the real-time notification service for critical system alerts',
  'Begin technical design for the new analytics dashboard v2',
  'Conduct security audit of all third-party API integrations',
  'Deploy the automated backup system for production data stores',
  'Optimize query performance for the reporting module',
  'Implement rate limiting for the public API endpoints',
  'Upgrade the monitoring and alerting infrastructure',
  'Develop the migration plan for the legacy authentication system',
  'Create comprehensive documentation for the new microservices architecture',
];

const bugFixes = [
  'Fixed memory leak in data processing pipeline',
  'Improved error handling for edge cases in the API layer',
  'Security patches applied to authentication and authorization modules',
  'Resolved race condition in concurrent data access patterns',
  'Fixed UI rendering issue in Safari browser when using dark mode',
  'Patched SQL injection vulnerability in the search functionality',
  'Resolved timeout issue for large dataset export operations',
  'Fixed incorrect sorting in the pagination component',
  'Patched cross-site scripting vulnerability in user input handling',
  'Resolved data consistency issue in the transaction processing pipeline',
];

function renderCompetitiveAnalysis(container) {
  const now = new Date().toISOString().split('T')[0];
  const items = settings.stocks.map((s, i) => {
    const p = prices[s];
    const val = p ? p.price.toFixed(2) : '---';
    const chg = p ? Math.abs(p.change_percent).toFixed(2) : '---';
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
    return `• ${s}: Revenue reached ${val}B in Q2, representing a ${p ? Math.abs(p.change_percent).toFixed(2) : '--'}% ${p && p.change >= 0 ? 'increase' : 'decrease'} year-over-year. Market share expanded by ${p ? (Math.abs(p.change_percent) * 0.5).toFixed(2) : '--'}% in the North American region, driven by strong demand in the enterprise segment. Operating margins improved by ${p ? (Math.abs(p.change_percent) * 0.3).toFixed(2) : '--'}% compared to the previous quarter, reflecting successful cost optimization initiatives. The company continues to invest in R&D, with ${p ? (Math.abs(p.change_percent) * 0.8).toFixed(2) : '--'}% of revenue allocated to new product development.`;
  }).join('\n      </p><p class="doc-text">');
  container.innerHTML = `
    <div class="doc-header">
      <div class="doc-title">Competitive Analysis Report</div>
      <div class="doc-meta">Q3 2026 · Market Intelligence · Confidential · Generated: ${now}</div>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">1. Market Overview</div>
      <p class="doc-text">This report provides a comprehensive analysis of key market players in the technology sector. Data is compiled from the most recent quarterly filings, analyst reports, and real-time market data sources. All figures are in USD unless otherwise noted.</p>
      <p class="doc-text">${randomPara(marketTrends, 2)}</p>
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
      <p class="doc-text">${randomPara(marketTrends)}</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">4. Risk Factors</div>
      <p class="doc-text">${randomPara(riskFactors)}</p>
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
    const fixes = [pick(bugFixes), pick(bugFixes), pick(bugFixes)].filter((v, idx, a) => a.indexOf(v) === idx);
    return `<div style="margin-bottom: 24px;">
      <div style="font-size: 15px; font-weight: 600; color: var(--accent);">v${ver} (Build ${d.toISOString().split('T')[0]})</div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--border);">
        <div style="margin-top: 4px;">• Updated ${s} core modules to latest stable version</div>
        <div>• ${fixes[0]}</div>
        <div>• ${fixes[1]}</div>
        <div>• Security patches applied to authentication layer</div>
        <div>• Performance optimization: response time changed by ${p ? p.change_percent.toFixed(2) : '--'}%</div>
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
      <td>${s}</td>
      <td>${val}</td>
      <td>${p ? Math.abs(p.change_percent).toFixed(2) : '---'}%</td>
      <td>${p ? 'On track' : 'Pending'}</td>
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
      <p class="doc-text">${randomPara(projectUpdates, 3)}</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Blockers & Risks</div>
      <p class="doc-text">${randomPara(riskFactors, 3)}</p>
    </div>
    <div class="doc-section">
      <div class="doc-section-title">Next Sprint Planning</div>
      <p class="doc-text">${nextSprintItems.sort(() => Math.random() - 0.5).slice(0, 4).map((item, i) => `• Priority ${i + 1}: ${item}`).join('</p><p class="doc-text">')}</p>
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
    return `[${dateStr} ${timeStr}] ${s}: status=active uptime=${(Math.random() * 100).toFixed(0)}d packet_rate=${p ? p.price.toFixed(2) : '---'} latency_change=${p ? p.change_percent.toFixed(2) : '0.00'}% memory_used=${(Math.random() * 500 + 100).toFixed(1)}GB disk_io=${(Math.random() * 100).toFixed(2)}MB/s connections=${Math.floor(Math.random() * 10000 + 1000)}`;
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
        throughput: p ? p.price.toFixed(2) : null,
        throughput_change: p ? p.change_percent.toFixed(2) : null,
        uptime: `${(99.9 + Math.random() * 0.09).toFixed(2)}%`,
        total_requests: Math.floor(Math.random() * 50000 + 5000),
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

function openHelp() {
  document.getElementById('helpOverlay').classList.add('open');
}

function closeHelp() {
  document.getElementById('helpOverlay').classList.remove('open');
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
