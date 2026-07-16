(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, computeFxState, convertAmount, formatAmount,
    formatDateOnly, toNumber, translate, useAppLanguage
  } = AM;
  function ChartPage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const canvasRef = useRef(null);
    const [displayCurrency, setDisplayCurrency] = useState('USD');

    useEffect(() => {
      (async () => {
        const [assets, settings, exchangeRates] = await Promise.all([
          window.api.getAssets(),
          window.api.getSettings(),
          window.api.getExchangeRates(),
        ]);
        const DISPLAY_CURRENCY =
          settings && settings['app.display_currency']
            ? String(settings['app.display_currency']).toUpperCase()
            : 'USD';
        setDisplayCurrency(SUPPORTED_CURRENCIES.includes(DISPLAY_CURRENCY) ? DISPLAY_CURRENCY : 'USD');
        const rateIndex = buildRateIndex(exchangeRates || []);

        const map = {};
        for (const a of assets) {
          const key = a.date;
          const amount = toNumber(a.amount, 0);
          const amountInDisplayCurrency = convertAmount(amount, a.currency, DISPLAY_CURRENCY, rateIndex);
          if (amountInDisplayCurrency === null) continue;
          map[key] = (map[key] || 0) + amountInDisplayCurrency;
        }

        const labels = Object.keys(map).sort();
        const values = labels.map((k) => map[k]);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = (canvas.width = canvas.clientWidth || 800);
        const h = (canvas.height = 360);
        ctx.clearRect(0, 0, w, h);

        const margin = { top: 34, right: 30, bottom: 64, left: 96 };
        const chartW = w - margin.left - margin.right;
        const chartH = h - margin.top - margin.bottom;

        const maxVal = Math.max(...values, 0);
        const niceMax = Math.max(10, Math.ceil(maxVal / 10) * 10);
        const ySteps = 5;
        const step = Math.ceil(niceMax / ySteps);
        const displayMax = step * ySteps;

        ctx.strokeStyle = 'rgba(198,198,205,0.35)';
        ctx.lineWidth = 1;
        ctx.font = '12px Inter, Arial';
        ctx.fillStyle = '#000';
        for (let i = 0; i <= ySteps; i++) {
          const val = i * step;
          const y = margin.top + chartH - (val / displayMax) * chartH;
          ctx.beginPath();
          ctx.moveTo(margin.left, y);
          ctx.lineTo(w - margin.right, y);
          ctx.stroke();
          ctx.textAlign = 'right';
          ctx.fillText(val.toLocaleString(), margin.left - 10, y + 4);
        }

        const barCount = labels.length;
        const gap = Math.max(8, Math.floor((chartW * 0.08) / (barCount || 1)));
        const totalGap = gap * (barCount + 1);
        const barW = Math.max(8, (chartW - totalGap) / (barCount || 1));
        const colors = ['#0b1c30', '#006c49', '#cba72f', '#76777d', '#d3e4fe', '#111827', '#5b6b88'];
        function roundedBar(x, y, width, height, radius) {
          const r = Math.min(radius, width / 2, height / 2);
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + width - r, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + r);
          ctx.lineTo(x + width, y + height);
          ctx.lineTo(x, y + height);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fill();
        }

        for (let i = 0; i < barCount; i++) {
          const val = values[i] || 0;
          const x = margin.left + gap + i * (barW + gap);
          const barH = (val / displayMax) * chartH;
          const y = margin.top + chartH - barH;
          ctx.fillStyle = colors[i % colors.length];
          roundedBar(x, y, barW, barH, 8);

          ctx.fillStyle = '#0b1c30';
          ctx.font = '700 12px Inter, Arial';
          ctx.textAlign = 'center';
          ctx.fillText(Math.round(val).toLocaleString(), x + barW / 2, y - 8);

          ctx.save();
          ctx.translate(x + barW / 2, margin.top + chartH + 6);
          ctx.textAlign = 'center';
          ctx.fillText(labels[i], 0, 18);
          ctx.restore();
        }

        ctx.save();
        ctx.translate(margin.left - 62, margin.top + chartH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.font = '700 13px Inter, Arial';
        ctx.fillText(`${t('amount')} (${DISPLAY_CURRENCY})`, 0, 0);
        ctx.restore();
      })();
    }, [language]);

    return (
      <div className="page-stack">
        <div className="page-header">
          <div>
            <h1>{`${t('chartTitle')} (${displayCurrency})`}</h1>
            <p className="page-subtitle">{t('chartSubtitle')}</p>
          </div>
          <div className="currency-segment" aria-label={t('displayCurrency')}>
            {SUPPORTED_CURRENCIES.map((currency) => (
              <span key={currency} className={currency === displayCurrency ? 'active' : ''}>{currency}</span>
            ))}
          </div>
        </div>
        <section className="app-card chart-card">
          <div className="card-header">
            <h2>{t('historicalGrowth')}</h2>
          </div>
          <canvas id="chart" ref={canvasRef} width={800} height={400} />
        </section>
      </div>
    );
  }
  AM.ChartPage = ChartPage;
})();
