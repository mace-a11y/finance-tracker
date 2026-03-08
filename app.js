// ── Constants ──────────────────────────────────────────────────
const FREQ_OPTIONS = ['Monthly','Weekly','Fortnightly','Annual'];
const DIR_OPTIONS = ['Expense','Income'];
const CATEGORY_OPTIONS = ['Utility','Leisure','Insurance','Salary','Housing','Transport','Food','Health','Education','Charity','Other'];
const DEBT_TYPES = ['Credit Card','Personal Loan','Mortgage','Auto Loan','Student Loan','Overdraft','Other'];
const ASSET_CLASSES = ['Property','Equities','Cash','Pension','Crypto','Precious Metals','Business','Other'];
const ACCOUNT_TYPES = ['Current Account','Savings Account','Money Market','ISA','Premium Bonds','Other'];
const SPENDING_CATS = ['Food','Transport','Entertainment','Shopping','Health','Dining','Misc','Gifts','Travel','Clothing','Other'];
const YN = ['Y','N'];
const CHART_COLORS = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
const DEBT_COLORS = ['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6','#8b5cf6','#6b7280'];
const STORAGE_KEY = 'pf_tracker_data';
const THEME_KEY = 'pf_tracker_theme';
const CURRENCY_KEY = 'pf_tracker_currency';
const BTC_SIDES = ['Long','Short'];
const BTC_LEVERAGES = ['3','5','10'];
const BTC_STATUSES = ['Open','Closed'];

// ── Currency Config ────────────────────────────────────────────
const CURRENCIES = {
    GBP: { symbol: '\u00a3', locale: 'en-GB' },
    USD: { symbol: '$', locale: 'en-US' },
    QAR: { symbol: '\u0631.\u0642', locale: 'en-QA' }
};
let currentCurrency = 'GBP';
let exchangeRates = { GBP: 1, USD: 1.27, QAR: 4.63 };
let btcPriceUSD = null;

// ── Default Data (mirroring Excel) ─────────────────────────────
const DEFAULT_DATA = {
    settings: {
        asOfDate: '2026-02-17',
        variableSpendWindow: 1,
        propertyHaircut: 0.20,
        equitiesHaircut: 0.30,
        incomeShock: 0.30
    },
    incomeExpenses: [
        {direction:'Expense',category:'Utility',description:'BT',frequency:'Monthly',amount:79.72,notes:''},
        {direction:'Expense',category:'Utility',description:'Sky',frequency:'Monthly',amount:76.50,notes:''},
        {direction:'Expense',category:'Utility',description:'British Gas',frequency:'Monthly',amount:79.73,notes:''},
        {direction:'Expense',category:'Utility',description:'British Gas',frequency:'Monthly',amount:25.31,notes:''},
        {direction:'Expense',category:'Utility',description:'Phone',frequency:'Monthly',amount:24.00,notes:''},
        {direction:'Expense',category:'Leisure',description:'Gym',frequency:'Monthly',amount:44.99,notes:''},
        {direction:'Expense',category:'Utility',description:'Admiral',frequency:'Monthly',amount:23.88,notes:''},
        {direction:'Expense',category:'Utility',description:'Three',frequency:'Monthly',amount:42.00,notes:''},
        {direction:'Expense',category:'Utility',description:'DVLA',frequency:'Monthly',amount:16.62,notes:''},
        {direction:'Expense',category:'Insurance',description:'L&G',frequency:'Monthly',amount:10.73,notes:''},
        {direction:'Expense',category:'Insurance',description:'L&G',frequency:'Monthly',amount:10.59,notes:''},
        {direction:'Expense',category:'Insurance',description:'L&G',frequency:'Monthly',amount:8.74,notes:''},
        {direction:'Expense',category:'Insurance',description:'Prospect',frequency:'Monthly',amount:7.88,notes:''},
        {direction:'Expense',category:'Leisure',description:'Youtube',frequency:'Monthly',amount:12.99,notes:''},
        {direction:'Expense',category:'Leisure',description:'Ring',frequency:'Monthly',amount:9.98,notes:''},
        {direction:'Expense',category:'Leisure',description:'Prime',frequency:'Monthly',amount:8.99,notes:''},
        {direction:'Expense',category:'Leisure',description:'Disney',frequency:'Monthly',amount:12.99,notes:''},
        {direction:'Expense',category:'Leisure',description:'Spotify',frequency:'Monthly',amount:11.99,notes:''},
        {direction:'Expense',category:'Leisure',description:'Navigraph',frequency:'Monthly',amount:8.13,notes:''},
        {direction:'Expense',category:'Leisure',description:'FR24',frequency:'Monthly',amount:3.99,notes:''},
        {direction:'Expense',category:'Leisure',description:'Netflix',frequency:'Monthly',amount:18.99,notes:''},
        {direction:'Expense',category:'Leisure',description:'ChatGPT',frequency:'Monthly',amount:18.99,notes:''},
        {direction:'Expense',category:'Utility',description:'Klarna',frequency:'Monthly',amount:500.00,notes:''},
        {direction:'Income',category:'Salary',description:'Work',frequency:'Monthly',amount:10591.00,notes:''}
    ],
    debts: [
        {type:'Credit Card',lender:'Monzo Flex',balance:515.62,apr:0.29,payFrequency:'Monthly',payAmount:37.63,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Amex',balance:5389.33,apr:0.335,payFrequency:'Monthly',payAmount:252.02,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'MBNA',balance:8071.07,apr:0.25,payFrequency:'Monthly',payAmount:358.24,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Zopa',balance:2355.62,apr:0.36,payFrequency:'Monthly',payAmount:101.10,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Marbles',balance:427.88,apr:0.405,payFrequency:'Monthly',payAmount:18.00,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Capital One',balance:900.71,apr:0.304,payFrequency:'Monthly',payAmount:31.75,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Barclaycard',balance:2632.21,apr:0.31,payFrequency:'Monthly',payAmount:146.00,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Tesco',balance:6345.58,apr:0.20,payFrequency:'Monthly',payAmount:212.00,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Virgin',balance:5980.02,apr:0.24,payFrequency:'Monthly',payAmount:171.53,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'NatWest',balance:9950.04,apr:0.015,payFrequency:'Monthly',payAmount:108.48,secured:'N',collateral:'',notes:''},
        {type:'Credit Card',lender:'Vanquis',balance:1726.38,apr:0.01,payFrequency:'Monthly',payAmount:17.26,secured:'N',collateral:'',notes:''},
        {type:'Personal Loan',lender:'Lendable',balance:301.00,apr:0.0862,payFrequency:'Monthly',payAmount:34.71,secured:'N',collateral:'',notes:''},
        {type:'Personal Loan',lender:'Shawbrook',balance:9151.00,apr:0.145,payFrequency:'Monthly',payAmount:230.70,secured:'N',collateral:'',notes:''},
        {type:'Personal Loan',lender:'Secure Trust',balance:3463.00,apr:0.00,payFrequency:'Monthly',payAmount:119.45,secured:'N',collateral:'',notes:''},
        {type:'Personal Loan',lender:'Santander',balance:3936.00,apr:0.0279,payFrequency:'Monthly',payAmount:250.10,secured:'N',collateral:'',notes:''}
    ],
    assets: [
        {class:'Precious Metals',description:'Silver (1kg)',value:1780,valuationDate:'2026-02-17',liquid:'Y',custodian:'Custodian',primaryResidence:'N',notes:''},
        {class:'Other',description:'IWC Portifino',value:3000,valuationDate:'2026-02-17',liquid:'Y',custodian:'Custodian',primaryResidence:'N',notes:''}
    ],
    liquidity: [
        {type:'Current Account',institution:'Revolut',balance:168,notes:''}
    ],
    variableSpending: [
        {date:'2026-02-16',month:'2026-02',category:'Misc',amount:1000,notes:''}
    ],
    netWorthHistory: [],
    btcPositions: []
};

// ── State ──────────────────────────────────────────────────────
let data = {};
let computed = {};

function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try { data = JSON.parse(stored); } catch(e) { data = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
    } else {
        data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    for (const k of Object.keys(DEFAULT_DATA)) {
        if (!(k in data)) data[k] = JSON.parse(JSON.stringify(DEFAULT_DATA[k]));
    }
    if (!data.settings) data.settings = JSON.parse(JSON.stringify(DEFAULT_DATA.settings));
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Exchange Rates ─────────────────────────────────────────────
async function fetchExchangeRates() {
    try {
        const resp = await fetch('https://open.er-api.com/v6/latest/GBP');
        const json = await resp.json();
        if (json.rates) {
            exchangeRates = { GBP: 1, USD: json.rates.USD || 1.27, QAR: json.rates.QAR || 4.63 };
        }
    } catch(e) {
        console.warn('Exchange rate fetch failed, using fallback');
    }
}

function convertFromGBP(v) {
    if (currentCurrency === 'GBP') return v;
    return v * (exchangeRates[currentCurrency] || 1);
}

// ── BTC Price ──────────────────────────────────────────────────
async function fetchBTCPrice() {
    try {
        const resp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const json = await resp.json();
        btcPriceUSD = json.bitcoin.usd;
        updateBTCUnrealized();
    } catch(e) {
        console.warn('BTC price fetch failed');
    }
}

function updateBTCUnrealized() {
    if (btcPriceUSD == null || !computed.btcPositions) return;
    let totalUnrealized = 0;
    computed.btcPositions.forEach(p => {
        if (p.status === 'Open') {
            p.unrealizedPnL = p.side === 'Long'
                ? (btcPriceUSD - p.entryPrice) * p.btcAmount
                : (p.entryPrice - btcPriceUSD) * p.btcAmount;
            totalUnrealized += p.unrealizedPnL;
        }
    });
    computed.btcTotalUnrealizedPnL = totalUnrealized;
    computed.btcLivePriceUSD = btcPriceUSD;
    const btcTab = document.getElementById('btc-leverage');
    if (btcTab && btcTab.classList.contains('active')) renderBTCLeverage();
}

// ── Formula Engine ─────────────────────────────────────────────
function toMonthly(amount, freq) {
    if (!amount || !freq) return 0;
    switch(freq) {
        case 'Monthly': return amount;
        case 'Weekly': return amount * 52 / 12;
        case 'Fortnightly': return amount * 26 / 12;
        case 'Annual': return amount / 12;
        default: return 0;
    }
}

function computeAll() {
    const c = {};
    const s = data.settings;

    // Income & Expenses
    c.grossMonthlyIncome = 0;
    c.fixedMonthlyExpenses = 0;
    data.incomeExpenses.forEach(r => {
        const m = toMonthly(r.amount, r.frequency);
        if (r.direction === 'Income') c.grossMonthlyIncome += m;
        else c.fixedMonthlyExpenses += m;
    });
    c.netMonthlyFixedCashFlow = c.grossMonthlyIncome - c.fixedMonthlyExpenses;
    c.grossAnnualIncome = c.grossMonthlyIncome * 12;
    c.fixedAnnualExpenses = c.fixedMonthlyExpenses * 12;

    // Debt calculations
    c.totalDebt = 0; c.totalMonthlyDebtPayments = 0; c.totalMonthlyInterest = 0;
    let weightedAprSum = 0;
    data.debts.forEach(d => {
        c.totalDebt += d.balance || 0;
        c.totalMonthlyDebtPayments += toMonthly(d.payAmount, d.payFrequency);
        const mi = (d.balance || 0) * (d.apr || 0) / 12;
        c.totalMonthlyInterest += mi;
        weightedAprSum += (d.balance || 0) * (d.apr || 0);
    });
    c.weightedAvgAPR = c.totalDebt > 0 ? weightedAprSum / c.totalDebt : 0;
    c.annualInterest = c.totalMonthlyInterest * 12;

    // Asset calculations
    c.totalAssets = 0; c.totalLiquidAssets = 0; c.primaryResidenceValue = 0;
    const assetByClass = {};
    ASSET_CLASSES.forEach(cl => assetByClass[cl] = 0);
    data.assets.forEach(a => {
        c.totalAssets += a.value || 0;
        if (a.liquid === 'Y') c.totalLiquidAssets += a.value || 0;
        if (a.primaryResidence === 'Y') c.primaryResidenceValue += a.value || 0;
        if (a.class in assetByClass) assetByClass[a.class] += a.value || 0;
        else assetByClass['Other'] += a.value || 0;
    });
    c.assetAllocation = assetByClass;

    // Liquidity
    c.totalLiquidCash = 0;
    data.liquidity.forEach(l => c.totalLiquidCash += l.balance || 0);

    // Variable Spending (windowed average)
    const asOf = new Date(s.asOfDate || new Date().toISOString().slice(0,10));
    const windowMonths = s.variableSpendWindow || 1;
    const windowStart = new Date(asOf);
    windowStart.setMonth(windowStart.getMonth() - windowMonths);
    let varSpendSum = 0;
    data.variableSpending.forEach(v => {
        const d = new Date(v.date);
        if (d >= windowStart && d <= asOf) varSpendSum += v.amount || 0;
    });
    c.avgMonthlyVariableSpend = windowMonths > 0 ? varSpendSum / windowMonths : 0;

    // Totals
    c.totalMonthlyExpenses = c.fixedMonthlyExpenses + c.totalMonthlyDebtPayments + c.avgMonthlyVariableSpend;
    c.netWorth = c.totalAssets - c.totalDebt;
    c.freeCashFlow = c.grossMonthlyIncome - c.totalMonthlyExpenses;

    // Key Ratios
    c.dti = c.grossMonthlyIncome > 0 ? c.totalMonthlyDebtPayments / c.grossMonthlyIncome : null;
    c.savingsRate = c.grossMonthlyIncome > 0 ? (c.grossMonthlyIncome - c.totalMonthlyExpenses) / c.grossMonthlyIncome : null;
    c.leverage = c.totalAssets > 0 ? c.totalDebt / c.totalAssets : null;
    c.solvency = c.totalDebt > 0 ? c.totalAssets / c.totalDebt : null;
    c.totalLiquidReserves = c.totalLiquidCash + c.totalLiquidAssets;
    c.liquidityCoverage = c.totalMonthlyExpenses > 0 ? c.totalLiquidReserves / c.totalMonthlyExpenses : null;
    const mortgageDebt = data.debts.filter(d => d.type === 'Mortgage').reduce((s,d) => s + (d.balance||0), 0);
    c.ltv = (mortgageDebt > 0 && c.primaryResidenceValue > 0) ? mortgageDebt / c.primaryResidenceValue : null;
    c.interestCoverage = c.annualInterest > 0 ? (c.grossMonthlyIncome * 12) / c.annualInterest : null;
    c.netInvestableAssets = c.totalAssets - c.primaryResidenceValue;

    // Debt breakdown
    c.debtBreakdown = {};
    DEBT_TYPES.forEach(t => {
        c.debtBreakdown[t] = data.debts.filter(d => d.type === t).reduce((s,d) => s + (d.balance||0), 0);
    });

    // Stress test
    c.stressedIncome = c.grossMonthlyIncome * (1 - (s.incomeShock || 0));
    const propVal = assetByClass['Property'] || 0;
    const eqVal = assetByClass['Equities'] || 0;
    c.stressedAssets = c.totalAssets - propVal * (s.propertyHaircut || 0) - eqVal * (s.equitiesHaircut || 0);
    c.stressedNetWorth = c.stressedAssets - c.totalDebt;
    c.stressedDTI = c.stressedIncome > 0 ? c.totalMonthlyDebtPayments / c.stressedIncome : null;

    // BTC Leverage Positions
    c.btcPositions = (data.btcPositions || []).map(p => {
        const lev = parseFloat(p.leverage) || 1;
        const entry = p.entryPrice || 0;
        const margin = p.margin || 0;
        const posSize = margin * lev;
        const btcAmt = entry > 0 ? posSize / entry : 0;
        const liqPrice = p.side === 'Long' ? entry * (1 - 1/lev) : entry * (1 + 1/lev);
        let pnl = 0;
        if (p.status === 'Closed' && p.closePrice) {
            pnl = p.side === 'Long' ? (p.closePrice - entry) * btcAmt : (entry - p.closePrice) * btcAmt;
        }
        return { ...p, positionSize: posSize, btcAmount: btcAmt, liqPrice, pnl, unrealizedPnL: 0 };
    });

    const openPos = c.btcPositions.filter(p => p.status === 'Open');
    const closedPos = c.btcPositions.filter(p => p.status === 'Closed');
    const totalBtcOpen = openPos.reduce((s,p) => s + p.btcAmount, 0);
    c.btcAvgEntry = totalBtcOpen > 0 ? openPos.reduce((s,p) => s + p.entryPrice * p.btcAmount, 0) / totalBtcOpen : null;
    const totalMarginOpen = openPos.reduce((s,p) => s + (p.margin||0), 0);
    const totalPosSizeOpen = openPos.reduce((s,p) => s + p.positionSize, 0);
    const effLev = totalMarginOpen > 0 ? totalPosSizeOpen / totalMarginOpen : null;
    const predominantSide = openPos.length > 0 ? openPos[0].side : 'Long';
    if (c.btcAvgEntry && effLev) {
        c.btcAggLiqPrice = predominantSide === 'Long' ? c.btcAvgEntry * (1 - 1/effLev) : c.btcAvgEntry * (1 + 1/effLev);
    } else { c.btcAggLiqPrice = null; }
    c.btcTotalRealizedPnL = closedPos.reduce((s,p) => s + p.pnl, 0);
    c.btcTotalUnrealizedPnL = 0;
    c.btcTotalMarginOpen = totalMarginOpen;
    c.btcTotalBtcOpen = totalBtcOpen;
    c.btcEffectiveLeverage = effLev;
    c.btcLivePriceUSD = btcPriceUSD;

    computed = c;
}

// ── Formatting Helpers ─────────────────────────────────────────
function fmtCurrency(v) {
    if (v == null || isNaN(v)) return '-';
    const converted = convertFromGBP(v);
    const neg = converted < 0;
    const abs = Math.abs(converted);
    const cfg = CURRENCIES[currentCurrency];
    const str = abs.toLocaleString(cfg.locale, {minimumFractionDigits:2, maximumFractionDigits:2});
    return neg ? `(${cfg.symbol}${str})` : `${cfg.symbol}${str}`;
}
const fmtGBP = (v) => fmtCurrency(v);

function fmtUSD(v) {
    if (v == null || isNaN(v)) return '-';
    const neg = v < 0;
    const abs = Math.abs(v);
    const str = abs.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
    return neg ? `($${str})` : `$${str}`;
}
function fmtPct(v) {
    if (v == null || isNaN(v)) return '-';
    return (v * 100).toFixed(1) + '%';
}
function fmtNum(v, dp=2) {
    if (v == null || isNaN(v)) return '-';
    return v.toFixed(dp);
}
function fmtDate(d) { return d || '-'; }
function escHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── UI Rendering ───────────────────────────────────────────────
function renderAll() {
    computeAll();
    renderDashboard();
    renderKeyRatios();
    renderIncomeExpenses();
    renderDebtRegister();
    renderAssetRegister();
    renderLiquidity();
    renderVariableSpending();
    renderNetWorthHistory();
    renderBTCLeverage();
}

// ── Dashboard ──────────────────────────────────────────────────
function renderDashboard() {
    const c = computed;
    const nwClass = c.netWorth >= 0 ? 'positive' : 'negative';
    const dtiClass = c.dti != null && c.dti < 0.3 ? 'positive' : c.dti != null && c.dti < 0.4 ? 'warning' : 'negative';
    const srClass = c.savingsRate != null && c.savingsRate >= 0.2 ? 'positive' : c.savingsRate != null && c.savingsRate >= 0 ? 'warning' : 'negative';
    const lcClass = c.liquidityCoverage != null && c.liquidityCoverage >= 6 ? 'positive' : c.liquidityCoverage != null && c.liquidityCoverage >= 3 ? 'warning' : 'negative';

    let html = `<h2 class="page-title">Personal Finance Dashboard</h2>`;
    html += `<div class="cards-grid cols-3">
        <div class="card"><div class="card-label">Net Worth</div><div class="card-value ${nwClass}">${fmtGBP(c.netWorth)}</div><div class="card-sub">Assets minus Liabilities</div></div>
        <div class="card"><div class="card-label">Debt-to-Income (DTI)</div><div class="card-value ${dtiClass}">${fmtPct(c.dti)}</div><div class="card-sub">Healthy &lt;30% | Risk &gt;40%</div></div>
        <div class="card"><div class="card-label">Savings Rate</div><div class="card-value ${srClass}">${fmtPct(c.savingsRate)}</div><div class="card-sub">Target 20%+</div></div>
        <div class="card"><div class="card-label">Liquidity Coverage</div><div class="card-value ${lcClass}">${fmtNum(c.liquidityCoverage,1)} mo</div><div class="card-sub">Target 6-12 months</div></div>
        <div class="card"><div class="card-label">Total Assets</div><div class="card-value neutral">${fmtGBP(c.totalAssets)}</div><div class="card-sub">${data.assets.length} asset(s)</div></div>
        <div class="card"><div class="card-label">Total Debt</div><div class="card-value negative">${fmtGBP(c.totalDebt)}</div><div class="card-sub">${data.debts.length} account(s)</div></div>
    </div>`;

    html += `<div class="split">`;
    html += `<div><div class="section-header"><h3>Debt Breakdown</h3></div><div class="table-wrap"><table>
        <thead><tr><th>Type</th><th style="text-align:right">Balance</th><th style="text-align:right">%</th></tr></thead><tbody>`;
    DEBT_TYPES.forEach((t,i) => {
        const bal = c.debtBreakdown[t] || 0;
        if (bal === 0) return;
        const pct = c.totalDebt > 0 ? bal / c.totalDebt : 0;
        html += `<tr><td><span class="legend-dot" style="background:${DEBT_COLORS[i]};display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:8px"></span>${escHtml(t)}</td>
            <td class="num negative">${fmtGBP(bal)}</td><td class="num">${fmtPct(pct)}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;

    const debtEntries = DEBT_TYPES.map((t,i) => ({name:t, value: c.debtBreakdown[t]||0, color: DEBT_COLORS[i]})).filter(e => e.value > 0);
    html += `<div><div class="section-header"><h3>Debt Distribution</h3></div><div class="card">`;
    html += renderDonutChart(debtEntries, c.totalDebt, fmtGBP(c.totalDebt), 'Total');
    html += `</div></div></div>`;

    html += `<div class="info-box"><h3>How to Use</h3><ol>
        <li>Fill <strong>Income & Fixed Outgoings</strong> (standing orders, direct debits, fixed costs + income).</li>
        <li>Log <strong>Variable Spending</strong> transactions (or monthly totals).</li>
        <li>Maintain <strong>Debt Register</strong> and <strong>Asset Register</strong> (update values when they change).</li>
        <li>Keep <strong>Liquidity & Reserves</strong> up to date for emergency fund coverage.</li>
        <li>Snapshot <strong>Net Worth History</strong> monthly to track progress over time.</li>
    </ol></div>`;

    document.getElementById('dashboard').innerHTML = html;
}

function renderDonutChart(entries, total, centerValue, centerLabel) {
    if (entries.length === 0) return '<div style="padding:30px;text-align:center;color:var(--text-muted)">No data</div>';
    const r = 60, cx = 80, cy = 80, sw = 18;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    let paths = '';
    entries.forEach(e => {
        const pct = total > 0 ? e.value / total : 0;
        const len = pct * circumference;
        paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${e.color}" stroke-width="${sw}" stroke-dasharray="${len} ${circumference - len}" stroke-dashoffset="${-offset}" />`;
        offset += len;
    });
    let legend = entries.map(e => `<div class="legend-item"><span class="legend-dot" style="background:${e.color}"></span>${escHtml(e.name)}: ${fmtGBP(e.value)}</div>`).join('');
    return `<div class="chart-container"><div class="donut-chart"><svg viewBox="0 0 160 160">${paths}</svg>
        <div class="donut-center"><div class="value">${centerValue}</div><div class="label">${centerLabel}</div></div></div>
        <div class="chart-legend">${legend}</div></div>`;
}

// ── Key Ratios ─────────────────────────────────────────────────
function renderKeyRatios() {
    const c = computed;
    const s = data.settings;
    let html = `<h2 class="page-title">Metrics & Ratios</h2>`;
    html += `<div class="section-header"><h3>Assumptions / Controls</h3></div>
    <div class="settings-grid">
        <div class="setting-item"><label>As-of Date</label><input type="date" id="s-asOfDate" value="${s.asOfDate||''}"></div>
        <div class="setting-item"><label>Variable Spend Window (months)</label><input type="number" id="s-variableSpendWindow" value="${s.variableSpendWindow}" min="1" step="1"></div>
        <div class="setting-item"><label>Property Haircut</label><input type="number" id="s-propertyHaircut" value="${s.propertyHaircut}" min="0" max="1" step="0.05"></div>
        <div class="setting-item"><label>Equities Haircut</label><input type="number" id="s-equitiesHaircut" value="${s.equitiesHaircut}" min="0" max="1" step="0.05"></div>
        <div class="setting-item"><label>Income Shock</label><input type="number" id="s-incomeShock" value="${s.incomeShock}" min="0" max="1" step="0.05"></div>
    </div>`;

    html += `<div class="section-header"><h3>Core Totals</h3></div>
    <div class="cards-grid cols-4">
        <div class="card"><div class="card-label">Gross Monthly Income</div><div class="card-value positive">${fmtGBP(c.grossMonthlyIncome)}</div></div>
        <div class="card"><div class="card-label">Fixed Monthly Expenses</div><div class="card-value negative">${fmtGBP(c.fixedMonthlyExpenses)}</div></div>
        <div class="card"><div class="card-label">Avg Variable Spend</div><div class="card-value negative">${fmtGBP(c.avgMonthlyVariableSpend)}</div></div>
        <div class="card"><div class="card-label">Total Monthly Expenses</div><div class="card-value negative">${fmtGBP(c.totalMonthlyExpenses)}</div></div>
        <div class="card"><div class="card-label">Total Assets</div><div class="card-value neutral">${fmtGBP(c.totalAssets)}</div></div>
        <div class="card"><div class="card-label">Total Debt</div><div class="card-value negative">${fmtGBP(c.totalDebt)}</div></div>
        <div class="card"><div class="card-label">Net Worth</div><div class="card-value ${c.netWorth>=0?'positive':'negative'}">${fmtGBP(c.netWorth)}</div></div>
        <div class="card"><div class="card-label">Monthly Debt Payments</div><div class="card-value negative">${fmtGBP(c.totalMonthlyDebtPayments)}</div></div>
        <div class="card"><div class="card-label">Weighted Avg APR</div><div class="card-value warning">${fmtPct(c.weightedAvgAPR)}</div></div>
        <div class="card"><div class="card-label">Total Liquid Cash</div><div class="card-value neutral">${fmtGBP(c.totalLiquidCash)}</div></div>
    </div>`;

    function ratioStatus(v, goodFn, warnFn) {
        if (v == null) return 'yellow';
        return goodFn(v) ? 'green' : (warnFn && warnFn(v)) ? 'yellow' : 'red';
    }
    const ratios = [
        {name:'Debt-to-Income (DTI)', value:fmtPct(c.dti), guide:'Healthy <30%; Risk >40%', status:ratioStatus(c.dti, v=>v<0.3, v=>v<0.4)},
        {name:'Savings Rate', value:fmtPct(c.savingsRate), guide:'Target 20%+', status:ratioStatus(c.savingsRate, v=>v>=0.2, v=>v>=0.1)},
        {name:'Leverage (Debt/Assets)', value:fmtNum(c.leverage,2), guide:'Lower is better', status:ratioStatus(c.leverage, v=>v<1, v=>v<3)},
        {name:'Solvency (Assets/Liabilities)', value:fmtNum(c.solvency,2), guide:'Target >1.5', status:ratioStatus(c.solvency, v=>v>=1.5, v=>v>=1)},
        {name:'Liquidity Coverage (months)', value:fmtNum(c.liquidityCoverage,1), guide:'Target 6-12', status:ratioStatus(c.liquidityCoverage, v=>v>=6, v=>v>=3)},
        {name:'Loan-to-Value (LTV)', value:c.ltv!=null?fmtPct(c.ltv):'-', guide:'Requires Primary Residence', status:'yellow'},
        {name:'Interest Coverage', value:fmtNum(c.interestCoverage,1), guide:'Higher is safer', status:ratioStatus(c.interestCoverage, v=>v>=3, v=>v>=1.5)},
    ];
    html += `<div class="section-header"><h3>Key Ratios</h3></div><div class="table-wrap ratio-table"><table>
        <thead><tr><th>Ratio</th><th style="text-align:right">Value</th><th>Guideline</th><th style="width:30px"></th></tr></thead><tbody>`;
    ratios.forEach(r => {
        html += `<tr><td>${escHtml(r.name)}</td><td class="num">${r.value}</td><td style="color:var(--text-muted);font-size:12px">${escHtml(r.guide)}</td>
            <td><span class="status-dot ${r.status}"></span></td></tr>`;
    });
    html += `</tbody></table></div>`;

    html += `<div class="split">`;
    html += `<div><div class="section-header"><h3>Advanced Metrics</h3></div><div class="table-wrap"><table><tbody>
        <tr><td>Net Investable Assets</td><td class="num">${fmtGBP(c.netInvestableAssets)}</td></tr>
        <tr><td>Free Cash Flow (monthly)</td><td class="num ${c.freeCashFlow>=0?'positive':'negative'}">${fmtGBP(c.freeCashFlow)}</td></tr>
        <tr><td>Annual Interest (est.)</td><td class="num negative">${fmtGBP(c.annualInterest)}</td></tr>
        </tbody></table></div></div>`;
    html += `<div><div class="section-header"><h3>Stress Test (Scenario)</h3></div><div class="table-wrap"><table><tbody>
        <tr><td>Stressed Monthly Income</td><td class="num">${fmtGBP(c.stressedIncome)}</td><td style="color:var(--text-muted);font-size:11px">Income Shock: ${fmtPct(s.incomeShock)}</td></tr>
        <tr><td>Stressed Total Assets</td><td class="num">${fmtGBP(c.stressedAssets)}</td><td style="color:var(--text-muted);font-size:11px">Haircuts applied</td></tr>
        <tr><td>Stressed Net Worth</td><td class="num ${c.stressedNetWorth>=0?'positive':'negative'}">${fmtGBP(c.stressedNetWorth)}</td><td></td></tr>
        <tr><td>Stressed DTI</td><td class="num ${c.stressedDTI!=null&&c.stressedDTI<0.4?'warning':'negative'}">${fmtPct(c.stressedDTI)}</td><td></td></tr>
        </tbody></table></div></div></div>`;

    const allocEntries = ASSET_CLASSES.map((cl,i) => ({name:cl, value: c.assetAllocation[cl]||0, color: CHART_COLORS[i]})).filter(e => e.value > 0);
    html += `<div class="section-header"><h3>Asset Allocation</h3></div>`;
    html += allocEntries.length > 0
        ? `<div class="card">${renderDonutChart(allocEntries, c.totalAssets, fmtGBP(c.totalAssets), 'Total')}</div>`
        : `<div class="card" style="padding:30px;text-align:center;color:var(--text-muted)">No assets registered</div>`;

    document.getElementById('key-ratios').innerHTML = html;
    ['asOfDate','variableSpendWindow','propertyHaircut','equitiesHaircut','incomeShock'].forEach(k => {
        const el = document.getElementById('s-'+k);
        if (el) el.addEventListener('change', () => {
            data.settings[k] = el.type === 'date' ? el.value : parseFloat(el.value);
            saveData(); renderAll();
        });
    });
}

// ── Income & Fixed Outgoings ───────────────────────────────────
function renderIncomeExpenses() {
    const c = computed;
    let html = `<h2 class="page-title">Income & Fixed Outgoings</h2>`;
    html += `<div class="section-header"><h3>${data.incomeExpenses.length} entries</h3>
        <button class="btn btn-primary btn-sm" onclick="openForm('incomeExpenses')">+ Add Entry</button></div>`;
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Direction</th><th>Category</th><th>Description</th><th>Frequency</th>
        <th style="text-align:right">Amount</th><th style="text-align:right">Monthly Eq</th><th style="text-align:right">Annual Eq</th>
        <th>Notes</th><th style="width:70px"></th></tr></thead><tbody>`;
    if (data.incomeExpenses.length === 0) html += `<tr class="empty-row"><td colspan="9">No entries yet</td></tr>`;
    data.incomeExpenses.forEach((r, i) => {
        const m = toMonthly(r.amount, r.frequency);
        html += `<tr>
            <td><span class="tag ${r.direction==='Income'?'tag-income':'tag-expense'}">${escHtml(r.direction)}</span></td>
            <td>${escHtml(r.category)}</td><td>${escHtml(r.description)}</td><td>${escHtml(r.frequency)}</td>
            <td class="num">${fmtGBP(r.amount)}</td><td class="num">${fmtGBP(m)}</td><td class="num">${fmtGBP(m*12)}</td>
            <td style="color:var(--text-muted);font-size:12px">${escHtml(r.notes)}</td>
            <td class="actions">
                <button class="btn-icon" onclick="openForm('incomeExpenses',${i})" title="Edit">&#9998;</button>
                <button class="btn-icon danger" onclick="deleteRow('incomeExpenses',${i})" title="Delete">&times;</button>
            </td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<div class="summary-cards">
        <div class="summary-card"><div class="sc-label">Gross Monthly Income</div><div class="sc-value positive">${fmtGBP(c.grossMonthlyIncome)}</div></div>
        <div class="summary-card"><div class="sc-label">Fixed Monthly Expenses</div><div class="sc-value negative">${fmtGBP(c.fixedMonthlyExpenses)}</div></div>
        <div class="summary-card"><div class="sc-label">Net Monthly Cash Flow</div><div class="sc-value ${c.netMonthlyFixedCashFlow>=0?'positive':'negative'}">${fmtGBP(c.netMonthlyFixedCashFlow)}</div></div>
        <div class="summary-card"><div class="sc-label">Gross Annual Income</div><div class="sc-value positive">${fmtGBP(c.grossAnnualIncome)}</div></div>
        <div class="summary-card"><div class="sc-label">Fixed Annual Expenses</div><div class="sc-value negative">${fmtGBP(c.fixedAnnualExpenses)}</div></div>
    </div>`;
    document.getElementById('income-expenses').innerHTML = html;
}

// ── Debt Register ──────────────────────────────────────────────
function renderDebtRegister() {
    const c = computed;
    let html = `<h2 class="page-title">Debt Register</h2>`;
    html += `<div class="section-header"><h3>${data.debts.length} debts</h3>
        <button class="btn btn-primary btn-sm" onclick="openForm('debts')">+ Add Debt</button></div>`;
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Type</th><th>Lender</th><th style="text-align:right">Balance</th><th style="text-align:right">APR</th>
        <th>Pay Freq</th><th style="text-align:right">Payment</th><th style="text-align:right">Monthly Pmt</th>
        <th style="text-align:right">Est Interest</th><th style="text-align:right">Est Principal</th>
        <th>Secured</th><th style="width:70px"></th></tr></thead><tbody>`;
    if (data.debts.length === 0) html += `<tr class="empty-row"><td colspan="11">No debts registered</td></tr>`;
    data.debts.forEach((d, i) => {
        const mp = toMonthly(d.payAmount, d.payFrequency);
        const mi = (d.balance||0) * (d.apr||0) / 12;
        const pr = Math.max(0, mp - mi);
        html += `<tr>
            <td><span class="tag tag-blue">${escHtml(d.type)}</span></td>
            <td>${escHtml(d.lender)}</td><td class="num negative">${fmtGBP(d.balance)}</td><td class="num">${fmtPct(d.apr)}</td>
            <td>${escHtml(d.payFrequency)}</td><td class="num">${fmtGBP(d.payAmount)}</td><td class="num">${fmtGBP(mp)}</td>
            <td class="num negative">${fmtGBP(mi)}</td><td class="num positive">${fmtGBP(pr)}</td><td>${d.secured}</td>
            <td class="actions">
                <button class="btn-icon" onclick="openForm('debts',${i})" title="Edit">&#9998;</button>
                <button class="btn-icon danger" onclick="deleteRow('debts',${i})" title="Delete">&times;</button>
            </td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<div class="summary-cards">
        <div class="summary-card"><div class="sc-label">Total Debt Balance</div><div class="sc-value negative">${fmtGBP(c.totalDebt)}</div></div>
        <div class="summary-card"><div class="sc-label">Total Monthly Payments</div><div class="sc-value negative">${fmtGBP(c.totalMonthlyDebtPayments)}</div></div>
        <div class="summary-card"><div class="sc-label">Weighted Avg APR</div><div class="sc-value warning">${fmtPct(c.weightedAvgAPR)}</div></div>
    </div>`;
    document.getElementById('debt-register').innerHTML = html;
}

// ── Asset Register ─────────────────────────────────────────────
function renderAssetRegister() {
    const c = computed;
    let html = `<h2 class="page-title">Asset Register</h2>`;
    html += `<div class="section-header"><h3>${data.assets.length} assets</h3>
        <button class="btn btn-primary btn-sm" onclick="openForm('assets')">+ Add Asset</button></div>`;
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Class</th><th>Description</th><th style="text-align:right">Value</th>
        <th>Valuation Date</th><th>Liquid</th><th>Custodian</th><th>Primary Res.</th>
        <th>Notes</th><th style="width:70px"></th></tr></thead><tbody>`;
    if (data.assets.length === 0) html += `<tr class="empty-row"><td colspan="9">No assets registered</td></tr>`;
    data.assets.forEach((a, i) => {
        html += `<tr>
            <td><span class="tag tag-income">${escHtml(a.class)}</span></td>
            <td>${escHtml(a.description)}</td><td class="num positive">${fmtGBP(a.value)}</td>
            <td>${fmtDate(a.valuationDate)}</td><td>${a.liquid}</td><td>${escHtml(a.custodian)}</td><td>${a.primaryResidence}</td>
            <td style="color:var(--text-muted);font-size:12px">${escHtml(a.notes)}</td>
            <td class="actions">
                <button class="btn-icon" onclick="openForm('assets',${i})" title="Edit">&#9998;</button>
                <button class="btn-icon danger" onclick="deleteRow('assets',${i})" title="Delete">&times;</button>
            </td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<div class="summary-cards">
        <div class="summary-card"><div class="sc-label">Total Assets</div><div class="sc-value positive">${fmtGBP(c.totalAssets)}</div></div>
        <div class="summary-card"><div class="sc-label">Total Liquid Assets</div><div class="sc-value positive">${fmtGBP(c.totalLiquidAssets)}</div></div>
        <div class="summary-card"><div class="sc-label">Primary Residence Value</div><div class="sc-value neutral">${fmtGBP(c.primaryResidenceValue)}</div></div>
    </div>`;
    document.getElementById('asset-register').innerHTML = html;
}

// ── Liquidity & Reserves ───────────────────────────────────────
function renderLiquidity() {
    const c = computed;
    let html = `<h2 class="page-title">Liquidity & Reserves</h2>`;
    html += `<div class="section-header"><h3>${data.liquidity.length} accounts</h3>
        <button class="btn btn-primary btn-sm" onclick="openForm('liquidity')">+ Add Account</button></div>`;
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Account Type</th><th>Institution</th><th style="text-align:right">Balance</th>
        <th>Notes</th><th style="width:70px"></th></tr></thead><tbody>`;
    if (data.liquidity.length === 0) html += `<tr class="empty-row"><td colspan="5">No accounts registered</td></tr>`;
    data.liquidity.forEach((l, i) => {
        html += `<tr><td>${escHtml(l.type)}</td><td>${escHtml(l.institution)}</td><td class="num positive">${fmtGBP(l.balance)}</td>
            <td style="color:var(--text-muted);font-size:12px">${escHtml(l.notes)}</td>
            <td class="actions">
                <button class="btn-icon" onclick="openForm('liquidity',${i})" title="Edit">&#9998;</button>
                <button class="btn-icon danger" onclick="deleteRow('liquidity',${i})" title="Delete">&times;</button>
            </td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<div class="summary-cards"><div class="summary-card"><div class="sc-label">Total Liquid Cash</div><div class="sc-value positive">${fmtGBP(c.totalLiquidCash)}</div></div></div>`;
    html += `<div class="info-box"><p>This tab feeds Emergency Fund metrics. Keep it to cash & near-cash only.</p></div>`;
    document.getElementById('liquidity').innerHTML = html;
}

// ── Variable Spending ──────────────────────────────────────────
function renderVariableSpending() {
    const c = computed;
    let html = `<h2 class="page-title">Variable Spending</h2>`;
    html += `<div class="section-header"><h3>${data.variableSpending.length} transactions</h3>
        <button class="btn btn-primary btn-sm" onclick="openForm('variableSpending')">+ Add Transaction</button></div>`;
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Date</th><th>Month</th><th>Category</th><th style="text-align:right">Amount</th>
        <th>Notes</th><th style="width:70px"></th></tr></thead><tbody>`;
    if (data.variableSpending.length === 0) html += `<tr class="empty-row"><td colspan="6">No transactions logged</td></tr>`;
    const sorted = data.variableSpending.map((v,i) => ({...v, _i:i})).sort((a,b) => (b.date||'').localeCompare(a.date||''));
    sorted.forEach(v => {
        html += `<tr><td>${fmtDate(v.date)}</td><td>${escHtml(v.month)}</td><td>${escHtml(v.category)}</td>
            <td class="num negative">${fmtGBP(v.amount)}</td>
            <td style="color:var(--text-muted);font-size:12px">${escHtml(v.notes)}</td>
            <td class="actions">
                <button class="btn-icon" onclick="openForm('variableSpending',${v._i})" title="Edit">&#9998;</button>
                <button class="btn-icon danger" onclick="deleteRow('variableSpending',${v._i})" title="Delete">&times;</button>
            </td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<div class="summary-cards"><div class="summary-card"><div class="sc-label">Avg Monthly Variable Spend</div><div class="sc-value negative">${fmtGBP(c.avgMonthlyVariableSpend)}</div></div></div>`;
    html += `<div class="info-box"><p>Enter daily transactions. Key Ratios uses the windowed average variable spend automatically.</p></div>`;
    document.getElementById('variable-spending').innerHTML = html;
}

// ── Net Worth History ──────────────────────────────────────────
function renderNetWorthHistory() {
    const c = computed;
    let html = `<h2 class="page-title">Net Worth History</h2>`;
    html += `<div class="section-header"><h3>${data.netWorthHistory.length} snapshots</h3>
        <div style="display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" onclick="snapshotNetWorth()">Take Snapshot Now</button>
            <button class="btn btn-ghost btn-sm" onclick="openForm('netWorthHistory')">+ Manual Entry</button>
        </div></div>`;
    if (data.netWorthHistory.length >= 2) html += renderNetWorthChart();
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Date</th><th style="text-align:right">Total Assets</th><th style="text-align:right">Total Debt</th>
        <th style="text-align:right">Net Worth</th><th>Notes</th><th style="width:70px"></th></tr></thead><tbody>`;
    if (data.netWorthHistory.length === 0) html += `<tr class="empty-row"><td colspan="6">No snapshots yet. Take your first snapshot above!</td></tr>`;
    [...data.netWorthHistory].sort((a,b) => (b.date||'').localeCompare(a.date||'')).forEach(h => {
        const origIdx = data.netWorthHistory.indexOf(h);
        html += `<tr><td>${fmtDate(h.date)}</td><td class="num positive">${fmtGBP(h.assets)}</td>
            <td class="num negative">${fmtGBP(h.debt)}</td>
            <td class="num ${h.netWorth>=0?'positive':'negative'}">${fmtGBP(h.netWorth)}</td>
            <td style="color:var(--text-muted);font-size:12px">${escHtml(h.notes)}</td>
            <td class="actions"><button class="btn-icon danger" onclick="deleteRow('netWorthHistory',${origIdx})" title="Delete">&times;</button></td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<div class="info-box"><p>Each month, click "Take Snapshot Now" to record your current totals and track progress over time.</p></div>`;
    document.getElementById('net-worth-history').innerHTML = html;
}

function renderNetWorthChart() {
    const sorted = [...data.netWorthHistory].sort((a,b) => (a.date||'').localeCompare(b.date||''));
    if (sorted.length < 2) return '';
    const values = sorted.map(h => h.netWorth);
    const maxV = Math.max(...values.map(Math.abs), 1);
    const w = 100, h = 40, step = w / (sorted.length - 1), mid = h / 2;
    let path = '';
    sorted.forEach((s, i) => {
        const x = (i * step).toFixed(1);
        const y = (mid - (s.netWorth / maxV) * (mid - 2)).toFixed(1);
        path += (i === 0 ? 'M' : 'L') + x + ',' + y;
    });
    return `<div class="card" style="margin-bottom:24px;padding:24px">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Net Worth Over Time</div>
        <svg viewBox="-2 -2 104 44" style="width:100%;max-height:160px" preserveAspectRatio="none">
            <line x1="0" y1="${mid}" x2="${w}" y2="${mid}" stroke="var(--border)" stroke-width="0.3"/>
            <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="1.2"/>
            ${sorted.map((s,i) => `<circle cx="${(i*step).toFixed(1)}" cy="${(mid-(s.netWorth/maxV)*(mid-2)).toFixed(1)}" r="1.5" fill="var(--primary)"/>`).join('')}
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:6px">
            <span>${sorted[0].date}</span><span>${sorted[sorted.length-1].date}</span></div></div>`;
}

function snapshotNetWorth() {
    data.netWorthHistory.push({
        date: new Date().toISOString().slice(0,10),
        assets: computed.totalAssets,
        debt: computed.totalDebt,
        netWorth: computed.netWorth,
        notes: 'Auto-snapshot'
    });
    saveData(); renderAll();
    showToast('Net Worth snapshot saved');
}

// ── BTC Leverage Trading ───────────────────────────────────────
function renderBTCLeverage() {
    const c = computed;
    const priceStr = btcPriceUSD != null ? fmtUSD(btcPriceUSD) : 'Loading...';
    let html = `<h2 class="page-title">Bitcoin Leverage Trading</h2>`;

    html += `<div class="btc-price-banner">
        <span class="btc-price-label">&#8383; BTC Live Price</span>
        <span class="btc-price-value">${priceStr}</span>
        <span class="btc-price-updated">Auto-refreshes every 60s</span>
    </div>`;

    html += `<div class="cards-grid cols-4">
        <div class="card"><div class="card-label">Avg Entry Price</div><div class="card-value neutral">${c.btcAvgEntry != null ? fmtUSD(c.btcAvgEntry) : '-'}</div><div class="card-sub">Weighted by BTC amount</div></div>
        <div class="card"><div class="card-label">Agg. Liquidation Price</div><div class="card-value negative">${c.btcAggLiqPrice != null ? fmtUSD(c.btcAggLiqPrice) : '-'}</div><div class="card-sub">Based on effective leverage</div></div>
        <div class="card"><div class="card-label">Unrealized P&L</div><div class="card-value ${c.btcTotalUnrealizedPnL >= 0 ? 'positive' : 'negative'}">${fmtUSD(c.btcTotalUnrealizedPnL)}</div><div class="card-sub">Open positions</div></div>
        <div class="card"><div class="card-label">Realized P&L</div><div class="card-value ${c.btcTotalRealizedPnL >= 0 ? 'positive' : 'negative'}">${fmtUSD(c.btcTotalRealizedPnL)}</div><div class="card-sub">Closed positions</div></div>
    </div>`;

    html += `<div class="section-header"><h3>${(data.btcPositions||[]).length} positions</h3>
        <button class="btn btn-primary btn-sm" onclick="openForm('btcPositions')">+ Add Position</button></div>`;
    html += `<div class="table-wrap"><table><thead><tr>
        <th>Date</th><th>Side</th><th>Leverage</th>
        <th style="text-align:right">Entry Price</th><th style="text-align:right">Margin</th>
        <th style="text-align:right">Position Size</th><th style="text-align:right">BTC Amt</th>
        <th style="text-align:right">Liq. Price</th><th>Status</th>
        <th style="text-align:right">Close Price</th><th style="text-align:right">P&L</th>
        <th>Notes</th><th style="width:70px"></th></tr></thead><tbody>`;

    if (!c.btcPositions || c.btcPositions.length === 0) {
        html += `<tr class="empty-row"><td colspan="13">No positions tracked yet</td></tr>`;
    }
    (c.btcPositions || []).forEach((p, i) => {
        const sideClass = p.side === 'Long' ? 'tag-income' : 'tag-expense';
        const statusClass = p.status === 'Open' ? 'tag-blue' : 'tag-expense';
        let pnlDisplay, pnlClass;
        if (p.status === 'Open' && p.unrealizedPnL) {
            pnlDisplay = fmtUSD(p.unrealizedPnL); pnlClass = p.unrealizedPnL >= 0 ? 'positive' : 'negative';
        } else if (p.status === 'Closed') {
            pnlDisplay = fmtUSD(p.pnl); pnlClass = p.pnl >= 0 ? 'positive' : 'negative';
        } else { pnlDisplay = '-'; pnlClass = ''; }
        html += `<tr>
            <td>${fmtDate(p.date)}</td><td><span class="tag ${sideClass}">${escHtml(p.side)}</span></td><td>${escHtml(p.leverage)}x</td>
            <td class="num">${fmtUSD(p.entryPrice)}</td><td class="num">${fmtUSD(p.margin)}</td>
            <td class="num">${fmtUSD(p.positionSize)}</td><td class="num">${fmtNum(p.btcAmount,6)}</td>
            <td class="num negative">${fmtUSD(p.liqPrice)}</td>
            <td><span class="tag ${statusClass}">${escHtml(p.status)}</span></td>
            <td class="num">${p.closePrice ? fmtUSD(p.closePrice) : '-'}</td>
            <td class="num ${pnlClass}">${pnlDisplay}</td>
            <td style="color:var(--text-muted);font-size:12px">${escHtml(p.notes)}</td>
            <td class="actions">
                <button class="btn-icon" onclick="openForm('btcPositions',${i})" title="Edit">&#9998;</button>
                <button class="btn-icon danger" onclick="deleteRow('btcPositions',${i})" title="Delete">&times;</button>
            </td></tr>`;
    });
    html += `</tbody></table></div>`;

    const totalPnL = c.btcTotalRealizedPnL + c.btcTotalUnrealizedPnL;
    html += `<div class="section-header"><h3>P&L Tracker</h3></div>`;
    html += `<div class="summary-cards">
        <div class="summary-card"><div class="sc-label">Total Margin Deployed</div><div class="sc-value neutral">${fmtUSD(c.btcTotalMarginOpen)}</div></div>
        <div class="summary-card"><div class="sc-label">Total BTC Exposure</div><div class="sc-value neutral">${fmtNum(c.btcTotalBtcOpen,6)} BTC</div></div>
        <div class="summary-card"><div class="sc-label">Effective Leverage</div><div class="sc-value warning">${c.btcEffectiveLeverage != null ? fmtNum(c.btcEffectiveLeverage,1)+'x' : '-'}</div></div>
        <div class="summary-card"><div class="sc-label">Total P&L (All)</div><div class="sc-value ${totalPnL>=0?'positive':'negative'}">${fmtUSD(totalPnL)}</div></div>
    </div>`;
    // Price Target Simulator
    const openPositions = (c.btcPositions || []).filter(p => p.status === 'Open');
    const savedTarget = window._btcPriceTarget || '';
    html += `<div class="section-header"><h3>Price Target Simulator</h3></div>`;
    html += `<div class="price-target-box">
        <div class="pt-input-row">
            <label for="btc-target-price">Target BTC Price (USD)</label>
            <input type="number" id="btc-target-price" class="pt-input" placeholder="e.g. 100000" value="${savedTarget}" step="any" min="0">
            <button class="btn btn-primary btn-sm" onclick="calcPriceTarget()">Calculate</button>
        </div>
        <div id="pt-results"></div>
    </div>`;

    html += `<div class="info-box"><p>All BTC values are denominated in USD. Live price updates every 60 seconds from CoinGecko.</p></div>`;

    document.getElementById('btc-leverage').innerHTML = html;

    // Re-trigger price target if a value was previously entered
    if (savedTarget) setTimeout(() => calcPriceTarget(), 0);
}

function calcPriceTarget() {
    const input = document.getElementById('btc-target-price');
    if (!input) return;
    const target = parseFloat(input.value);
    window._btcPriceTarget = input.value;
    const results = document.getElementById('pt-results');
    if (!target || target <= 0) { results.innerHTML = ''; return; }

    const openPositions = (computed.btcPositions || []).filter(p => p.status === 'Open');
    if (openPositions.length === 0) {
        results.innerHTML = '<p class="pt-empty">No open positions to simulate.</p>';
        return;
    }

    let totalProjectedPnL = 0;
    let rows = '';
    openPositions.forEach(p => {
        const projPnL = p.side === 'Long'
            ? (target - p.entryPrice) * p.btcAmount
            : (p.entryPrice - target) * p.btcAmount;
        const projROI = p.margin > 0 ? (projPnL / p.margin) * 100 : 0;
        const wouldLiq = (p.side === 'Long' && target <= p.liqPrice) || (p.side === 'Short' && target >= p.liqPrice);
        totalProjectedPnL += wouldLiq ? -p.margin : projPnL;
        const pnlClass = wouldLiq ? 'negative' : (projPnL >= 0 ? 'positive' : 'negative');
        rows += `<tr>
            <td>${fmtDate(p.date)}</td>
            <td><span class="tag ${p.side === 'Long' ? 'tag-income' : 'tag-expense'}">${p.side}</span></td>
            <td>${p.leverage}x</td>
            <td class="num">${fmtUSD(p.entryPrice)}</td>
            <td class="num">${fmtNum(p.btcAmount, 6)}</td>
            <td class="num ${pnlClass}">${wouldLiq ? '<span class="tag tag-expense">LIQUIDATED</span>' : fmtUSD(projPnL)}</td>
            <td class="num ${pnlClass}">${wouldLiq ? '-100.0%' : fmtNum(projROI, 1) + '%'}</td>
        </tr>`;
    });

    const totalClass = totalProjectedPnL >= 0 ? 'positive' : 'negative';
    let html = `<div class="table-wrap"><table><thead><tr>
        <th>Date</th><th>Side</th><th>Leverage</th>
        <th style="text-align:right">Entry</th><th style="text-align:right">BTC Amt</th>
        <th style="text-align:right">Projected P&L</th><th style="text-align:right">ROI</th>
        </tr></thead><tbody>${rows}</tbody></table></div>`;
    html += `<div class="pt-total">
        <span>Total Projected P&L at <strong>${fmtUSD(target)}</strong>:</span>
        <span class="pt-total-value ${totalClass}">${fmtUSD(totalProjectedPnL)}</span>
    </div>`;
    results.innerHTML = html;
}

// ── Forms / Modal ──────────────────────────────────────────────
const FORM_CONFIGS = {
    incomeExpenses: {
        title: 'Income / Expense Entry',
        fields: [
            {key:'direction', label:'Direction', type:'select', options:DIR_OPTIONS, required:true},
            {key:'category', label:'Category', type:'select', options:CATEGORY_OPTIONS, required:true},
            {key:'description', label:'Description', type:'text', required:true},
            {key:'frequency', label:'Frequency', type:'select', options:FREQ_OPTIONS, required:true},
            {key:'amount', label:'Amount (GBP)', type:'number', step:'0.01', required:true},
            {key:'notes', label:'Notes', type:'text'}
        ]
    },
    debts: {
        title: 'Debt Entry',
        fields: [
            {key:'type', label:'Debt Type', type:'select', options:DEBT_TYPES, required:true},
            {key:'lender', label:'Lender', type:'text', required:true},
            {key:'balance', label:'Current Balance (GBP)', type:'number', step:'0.01', required:true},
            {key:'apr', label:'APR (decimal, e.g. 0.29)', type:'number', step:'0.001', required:true},
            {key:'payFrequency', label:'Payment Frequency', type:'select', options:FREQ_OPTIONS, required:true},
            {key:'payAmount', label:'Payment Amount (GBP)', type:'number', step:'0.01', required:true},
            {key:'secured', label:'Secured?', type:'select', options:YN},
            {key:'collateral', label:'Collateral/Asset Link', type:'text'},
            {key:'notes', label:'Notes', type:'text'}
        ]
    },
    assets: {
        title: 'Asset Entry',
        fields: [
            {key:'class', label:'Asset Class', type:'select', options:ASSET_CLASSES, required:true},
            {key:'description', label:'Description', type:'text', required:true},
            {key:'value', label:'Current Value (GBP)', type:'number', step:'0.01', required:true},
            {key:'valuationDate', label:'Valuation Date', type:'date'},
            {key:'liquid', label:'Liquid?', type:'select', options:YN},
            {key:'custodian', label:'Account/Custodian', type:'text'},
            {key:'primaryResidence', label:'Primary Residence?', type:'select', options:YN},
            {key:'notes', label:'Notes', type:'text'}
        ]
    },
    liquidity: {
        title: 'Liquidity Account',
        fields: [
            {key:'type', label:'Account Type', type:'select', options:ACCOUNT_TYPES, required:true},
            {key:'institution', label:'Institution', type:'text', required:true},
            {key:'balance', label:'Balance (GBP)', type:'number', step:'0.01', required:true},
            {key:'notes', label:'Notes', type:'text'}
        ]
    },
    variableSpending: {
        title: 'Variable Spending Transaction',
        fields: [
            {key:'date', label:'Date', type:'date', required:true},
            {key:'category', label:'Category', type:'select', options:SPENDING_CATS, required:true},
            {key:'amount', label:'Amount (GBP)', type:'number', step:'0.01', required:true},
            {key:'notes', label:'Notes', type:'text'}
        ]
    },
    netWorthHistory: {
        title: 'Net Worth History Entry',
        fields: [
            {key:'date', label:'Date', type:'date', required:true},
            {key:'assets', label:'Total Assets (GBP)', type:'number', step:'0.01', required:true},
            {key:'debt', label:'Total Debt (GBP)', type:'number', step:'0.01', required:true},
            {key:'netWorth', label:'Net Worth (GBP)', type:'number', step:'0.01', required:true},
            {key:'notes', label:'Notes', type:'text'}
        ]
    },
    btcPositions: {
        title: 'BTC Leverage Position',
        fields: [
            {key:'date', label:'Date', type:'date', required:true},
            {key:'side', label:'Side', type:'select', options:BTC_SIDES, required:true},
            {key:'leverage', label:'Leverage', type:'select', options:BTC_LEVERAGES, required:true},
            {key:'entryPrice', label:'Entry Price (USD)', type:'number', step:'0.01', required:true},
            {key:'margin', label:'Margin (USD)', type:'number', step:'0.01', required:true},
            {key:'status', label:'Status', type:'select', options:BTC_STATUSES, required:true},
            {key:'closePrice', label:'Close Price (USD)', type:'number', step:'0.01'},
            {key:'notes', label:'Notes', type:'text'}
        ]
    }
};

let currentFormTable = null;
let currentFormIndex = null;

function openForm(table, index) {
    currentFormTable = table;
    currentFormIndex = index != null ? index : null;
    const config = FORM_CONFIGS[table];
    const isEdit = index != null;
    const existing = isEdit ? data[table][index] : null;
    document.getElementById('modal-title').textContent = (isEdit ? 'Edit ' : 'New ') + config.title;
    let formHtml = '';
    config.fields.forEach((f, i) => {
        const val = existing ? (existing[f.key] != null ? existing[f.key] : '') : (f.key === 'date' ? new Date().toISOString().slice(0,10) : '');
        const reqAttr = f.required ? 'required' : '';
        if (i % 2 === 0 && config.fields.length > 3) formHtml += '<div class="form-row">';
        formHtml += `<div class="form-group"><label>${f.label}</label>`;
        if (f.type === 'select') {
            formHtml += `<select name="${f.key}" ${reqAttr}><option value="">Select...</option>`;
            f.options.forEach(o => { formHtml += `<option value="${escHtml(o)}" ${val==o?'selected':''}>${escHtml(o)}</option>`; });
            formHtml += `</select>`;
        } else {
            formHtml += `<input type="${f.type}" name="${f.key}" value="${escHtml(val)}" ${f.step?`step="${f.step}"`:''} ${reqAttr}>`;
        }
        formHtml += `</div>`;
        if (i % 2 === 1 && config.fields.length > 3) formHtml += '</div>';
    });
    if (config.fields.length > 3 && config.fields.length % 2 === 1) formHtml += '</div>';
    document.getElementById('modal-form').innerHTML = formHtml;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    currentFormTable = null; currentFormIndex = null;
}

function saveForm() {
    const form = document.getElementById('modal-form');
    const config = FORM_CONFIGS[currentFormTable];
    const obj = {};
    let valid = true;
    config.fields.forEach(f => {
        const el = form.querySelector(`[name="${f.key}"]`);
        let val = el ? el.value.trim() : '';
        if (f.required && !val) { valid = false; el.style.borderColor = 'var(--danger)'; }
        else if (el) { el.style.borderColor = ''; }
        if (f.type === 'number' && val !== '') val = parseFloat(val);
        obj[f.key] = val;
    });
    if (!valid) { showToast('Please fill in all required fields', true); return; }
    if (currentFormTable === 'variableSpending' && obj.date) obj.month = obj.date.slice(0,7);
    if (currentFormIndex != null) data[currentFormTable][currentFormIndex] = obj;
    else data[currentFormTable].push(obj);
    saveData(); closeModal(); renderAll();
    showToast(currentFormIndex != null ? 'Entry updated' : 'Entry added');
}

function deleteRow(table, index) {
    if (!confirm('Delete this entry?')) return;
    data[table].splice(index, 1);
    saveData(); renderAll();
    showToast('Entry deleted');
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg, isError) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '');
    setTimeout(() => t.classList.add('hidden'), 2500);
}

// ── Export / Import ────────────────────────────────────────────
function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'finance-tracker-backup.json';
    a.click(); URL.revokeObjectURL(a.href);
    showToast('Data exported');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try { data = JSON.parse(e.target.result); saveData(); renderAll(); showToast('Data imported successfully'); }
        catch(err) { showToast('Invalid JSON file', true); }
    };
    reader.readAsText(file);
}

// ── Navigation ─────────────────────────────────────────────────
function setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(item.dataset.tab).classList.add('active');
        });
    });
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.checked = savedTheme === 'light';
    themeSwitch.addEventListener('change', () => {
        const theme = themeSwitch.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    });

    // Currency
    currentCurrency = localStorage.getItem(CURRENCY_KEY) || 'GBP';
    document.querySelectorAll('.currency-btn').forEach(btn => {
        if (btn.dataset.currency === currentCurrency) {
            document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCurrency = btn.dataset.currency;
            localStorage.setItem(CURRENCY_KEY, currentCurrency);
            renderAll();
        });
    });

    setupNav();
    renderAll();

    // Fetch live rates then re-render
    fetchExchangeRates().then(() => { if (currentCurrency !== 'GBP') renderAll(); });
    fetchBTCPrice();
    setInterval(fetchBTCPrice, 60000);

    // Modal
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveForm);
    document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

    // Export/Import
    document.getElementById('btn-export').addEventListener('click', exportData);
    document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file').addEventListener('change', e => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ''; });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
