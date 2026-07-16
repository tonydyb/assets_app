(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { toNumber } = AM;
  function buildRateIndex(rates) {
    const map = {};
    (rates || []).forEach((r) => {
      const base = String(r.base_currency || '').toUpperCase();
      const quote = String(r.quote_currency || '').toUpperCase();
      const rate = toNumber(r.rate, NaN);
      if (base && quote && Number.isFinite(rate) && rate > 0) {
        map[`${base}->${quote}`] = rate;
      }
    });
    return map;
  }

  function convertAmount(amount, fromCurrency, toCurrency, rateIndex) {
    const from = String(fromCurrency || '').toUpperCase();
    const to = String(toCurrency || '').toUpperCase();
    if (!Number.isFinite(amount)) return null;
    if (!from || !to) return null;
    if (from === to) return amount;
    const direct = rateIndex[`${from}->${to}`];
    if (Number.isFinite(direct) && direct > 0) return amount * direct;
    const inverse = rateIndex[`${to}->${from}`];
    if (Number.isFinite(inverse) && inverse > 0) return amount / inverse;
    return null;
  }

  function computeFxState(rates, requiredPairs, ttlDays) {
    const now = Date.now();
    let stale = false;
    const missingPairs = [];
    const normalizedTtl = Number.isFinite(Number(ttlDays)) ? Number(ttlDays) : 90;
    const ttlMs = Math.max(1, normalizedTtl) * 24 * 60 * 60 * 1000;
    const existingPairs = new Set();

    (rates || []).forEach((r) => {
      const base = String(r.base_currency || '').toUpperCase();
      const quote = String(r.quote_currency || '').toUpperCase();
      if (!base || !quote) return;
      existingPairs.add(`${base}->${quote}`);
      existingPairs.add(`${quote}->${base}`);
      const t = Date.parse(r.updated_at || '');
      if (!Number.isNaN(t) && now - t > ttlMs) stale = true;
    });

    requiredPairs.forEach((pair) => {
      if (!existingPairs.has(pair)) missingPairs.push(pair);
    });

    return {
      status: missingPairs.length > 0 ? 'missing' : stale ? 'stale' : 'ok',
      missingPairs,
    };
  }
  AM.buildRateIndex = buildRateIndex;
  AM.convertAmount = convertAmount;
  AM.computeFxState = computeFxState;
})();
