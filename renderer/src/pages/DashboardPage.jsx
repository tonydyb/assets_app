(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, convertAmount, formatAmount,
    toNumber, translate, useAppLanguage
  } = AM;
  function DashboardPage() {
    const [rows, setRows] = useState([]);
    const [language, setLanguage] = useAppLanguage();
    const [displayCurrency, setDisplayCurrency] = useState('USD');
    const [rates, setRates] = useState([]);
    const t = (key) => translate(language, key);

    const conversionMeta = useMemo(() => {
      const rateIndex = buildRateIndex(rates);
      const missingPairs = new Set();
      let excludedCount = 0;
      let total = 0;
      rows.forEach((a) => {
        const amount = toNumber(a.amount, 0);
        const from = String(a.currency || '').toUpperCase();
        const converted = convertAmount(amount, from, displayCurrency, rateIndex);
        if (converted === null) {
          if (from && displayCurrency && from !== displayCurrency) {
            missingPairs.add(`${from}->${displayCurrency}`);
          }
          excludedCount += 1;
          return;
        }
        total += converted;
      });
      return {
        total: Math.round(total),
        excludedCount,
        missingPairs: Array.from(missingPairs),
      };
    }, [rows, displayCurrency, rates]);

    const currencySymbol = {
      JPY: '¥',
      CNY: '¥',
      USD: '$',
    };
    const latestSnapshotDate = rows[0] && rows[0].date ? rows[0].date : '-';
    const allocation = useMemo(() => {
      const totals = {};
      rows.forEach((row) => {
        const key = row.type || t('type');
        totals[key] = (totals[key] || 0) + toNumber(row.amount, 0);
      });
      const sum = Object.values(totals).reduce((acc, value) => acc + value, 0);
      return Object.entries(totals)
        .map(([name, value]) => ({
          name,
          percent: sum > 0 ? Math.round((value / sum) * 100) : 0,
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 6);
    }, [rows, t]);

    useEffect(() => {
      (async () => {
        const [assets, settings, exchangeRates] = await Promise.all([
          window.api.getLatestAssets(),
          window.api.getSettings(),
          window.api.getExchangeRates(),
        ]);
        const lang = settings && settings['app.language'] ? settings['app.language'] : 'en-US';
        const disp =
          settings && settings['app.display_currency']
            ? String(settings['app.display_currency']).toUpperCase()
            : 'USD';
        const usedDisplayCurrency = SUPPORTED_CURRENCIES.includes(disp) ? disp : 'USD';

        setRows(assets.slice(0, 10));
        setLanguage(lang);
        setDisplayCurrency(usedDisplayCurrency);
        setRates(exchangeRates || []);
      })();
    }, [setLanguage]);

    return (
      <div className="page-stack">
        <section className="hero-card">
          <div className="eyebrow">{t('totalAsset')}</div>
          <div className="hero-total">
            <span id="totalAsset">
              {`${currencySymbol[displayCurrency] || ''}${conversionMeta.total.toLocaleString()}`}
              {conversionMeta.missingPairs.length > 0 ? ` (${t('partial')})` : ''}
            </span>
            <span className="hero-currency">{displayCurrency}</span>
          </div>
        </section>

        <div className="dashboard-bento">
          <div className="dashboard-breakdown">
            <section className="app-card breakdown-card">
              <div className="card-header">
                <h2>{t('assetBreakdown')}</h2>
                <a className="text-link" href="assets.html">{t('viewAssets')} →</a>
              </div>
              <div className="table-scroll">
                <table id="recentAssets">
                  <thead>
                    <tr>
                      <th>{t('type')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('currency')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id || `${r.date}-${r.type_id}-${r.currency}`}>
                        <td><span className="type-pill">{r.type || ''}</span></td>
                        <td>{formatAmount(r.amount || 0)}</td>
                        <td>{r.currency || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="dashboard-actions">
              <div className="info-card muted">
                <span>
                  <span className="metric-label">{t('rebalanceDate')}</span>
                  <strong>{latestSnapshotDate}</strong>
                </span>
                <span className="info-icon">○</span>
              </div>
              <a className="info-card dark" href="rebalance.html">
                <span>
                  <span className="metric-label">{t('quickAction')}</span>
                  <strong>{t('addNewRebalance')}</strong>
                </span>
                <span className="info-icon">＋</span>
              </a>
            </div>
          </div>

          <section className="app-card allocation-card">
            <div className="card-header">
              <h2>{t('assetAllocation')}</h2>
            </div>
            <div className="allocation-preview">
              <div className="allocation-ring">
                <span>{t('total')}</span>
                <strong>100%</strong>
              </div>
              <div className="allocation-list">
                {allocation.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="allocation-row">
                    <span><i />{item.name}</span>
                    <strong>{item.percent}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>
    );
  }
  AM.DashboardPage = DashboardPage;
})();
