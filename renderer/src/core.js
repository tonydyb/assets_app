(function () {
  const AM = (window.AssetManager = window.AssetManager || {});

  function pageName() {
    const p = window.location.pathname.split('/').pop();
    if (p === 'dashboard.html') return 'dashboard';
    if (p === 'assets.html') return 'assets';
    if (p === 'add_asset.html') return 'add_asset';
    if (p === 'asset_types.html') return 'asset_types';
    if (p === 'rebalance.html') return 'rebalance';
    if (p === 'chart.html') return 'chart';
    if (p === 'settings.html') return 'settings';
    return 'dashboard';
  }

  function toNumber(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function formatAmount(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? '');
    return n.toLocaleString();
  }

  function formatDateOnly(v) {
    if (!v) return '-';
    const text = String(v);
    const match = /^\d{4}-\d{2}-\d{2}/.exec(text);
    if (match) return match[0];
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return text;
    const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  AM.SUPPORTED_CURRENCIES = ['JPY', 'CNY', 'USD'];
  AM.pageName = pageName;
  AM.toNumber = toNumber;
  AM.formatAmount = formatAmount;
  AM.formatDateOnly = formatDateOnly;
})();
