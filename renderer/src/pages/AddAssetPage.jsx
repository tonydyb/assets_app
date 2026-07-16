(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, computeFxState, convertAmount, formatAmount,
    formatDateOnly, toNumber, translate, useAppLanguage
  } = AM;
  function AddAssetPage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({ date: '', typeId: '', amount: '', currency: 'USD' });

    useEffect(() => {
      (async () => {
        const tt = await window.api.getAssetTypes();
        setTypes(tt);
        const first = tt[0] ? String(tt[0].id) : '';

        let next = { ...form, typeId: first };
        try {
          const raw = sessionStorage.getItem('prefillAsset');
          if (raw) {
            const p = JSON.parse(raw);
            next = {
              date: p.date || '',
              typeId: p.typeId ? String(p.typeId) : first,
              amount: p.amount !== undefined ? String(p.amount) : '',
              currency: p.currency || 'USD',
            };
            sessionStorage.removeItem('prefillAsset');
          }
        } catch (err) {}
        setForm(next);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function onSubmit(ev) {
      ev.preventDefault();
      await window.api.addAsset({
        date: form.date,
        typeId: Number(form.typeId || 0),
        amount: toNumber(form.amount, 0),
        currency: form.currency || '',
      });
      window.location.href = 'assets.html';
    }

    return (
      <div className="page-stack">
        <div className="page-header">
          <div>
            <h1>{t('addAssetTitle')}</h1>
            <p className="page-subtitle">{t('addAssetSubtitle')}</p>
          </div>
        </div>
        <form id="addForm" onSubmit={onSubmit}>
          <label>
            {t('date')}{' '}
            <input
              type="date"
              id="date"
              required
              value={form.date}
              onChange={(ev) => setForm({ ...form, date: ev.target.value })}
            />
          </label>
          <label>
            {t('type')}{' '}
            <select
              id="type"
              value={form.typeId}
              onChange={(ev) => setForm({ ...form, typeId: ev.target.value })}
            >
              {types.map((tt) => (
                <option key={tt.id} value={String(tt.id)}>
                  {tt.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('amount')}{' '}
            <input
              id="amount"
              type="number"
              step="1"
              value={form.amount}
              onChange={(ev) => setForm({ ...form, amount: ev.target.value })}
            />
          </label>
          <label>
            {t('currency')}{' '}
            <select
              id="currency"
              value={form.currency}
              onChange={(ev) => setForm({ ...form, currency: ev.target.value })}
            >
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <button type="submit">{t('save')}</button>
        </form>
      </div>
    );
  }
  AM.AddAssetPage = AddAssetPage;
})();
