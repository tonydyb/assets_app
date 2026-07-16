(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, computeFxState, convertAmount, formatAmount,
    formatDateOnly, toNumber, translate, useAppLanguage
  } = AM;
  function RebalancePage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const [sourceDate, setSourceDate] = useState('');
    const [rebalanceDate, setRebalanceDate] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      (async () => {
        try {
          let template;
          if (window.api.getRebalanceTemplate) {
            template = await window.api.getRebalanceTemplate();
          } else {
            const latestAssets = await window.api.getLatestAssets();
            template = {
              sourceDate: latestAssets[0] ? latestAssets[0].date : '',
              rebalanceDate: new Date().toISOString().slice(0, 10),
              items: (latestAssets || []).map((asset) => ({
                sourceAssetId: asset.id,
                typeId: asset.type_id,
                type: asset.type || '',
                region: asset.region || '',
                amount: asset.amount || 0,
                currency: asset.currency || '',
              })),
            };
          }
          setSourceDate(template.sourceDate || '');
          setRebalanceDate(template.rebalanceDate || '');
          setItems((template.items || []).map((item) => ({
            ...item,
            amount: String(Math.round(toNumber(item.amount, 0))),
          })));
        } catch (err) {
          setLoadError(err && err.message ? err.message : t('rebalanceLoadFailed'));
        } finally {
          setLoading(false);
        }
      })();
    }, []);

    function updateAmount(index, value) {
      setItems((current) =>
        current.map((item, itemIndex) => (itemIndex === index ? { ...item, amount: value } : item))
      );
    }

    async function saveSnapshot() {
      if (saving) return;
      const nextItems = items.map((item) => ({
        typeId: Number(item.typeId || 0),
        amount: Number(item.amount),
        currency: item.currency,
      }));
      const invalid = nextItems.some(
        (item) => !Number.isFinite(item.amount) || item.amount < 0 || !Number.isInteger(item.amount)
      );
      if (!rebalanceDate || invalid) {
        setMessage(t('invalidRebalanceAmount'));
        return;
      }

      setSaving(true);
      const result = await window.api.saveRebalance({ date: rebalanceDate, items: nextItems });
      setSaving(false);
      if (result && result.success) {
        setMessage(t('rebalanceSaved'));
        window.setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 700);
        return;
      }
      setMessage((result && result.error) || t('rebalanceSaveFailed'));
    }

    return (
      <div className="page-stack rebalance-page">
        <div className="page-header">
          <div>
            <h1>{t('rebalanceTitle')}</h1>
            <p className="page-subtitle">{t('rebalanceSubtitle')}</p>
          </div>
          <a className="button-link" href="dashboard.html">{t('backToDashboard')}</a>
        </div>

        {message ? <p className="form-feedback">{message}</p> : null}

        {loading ? (
          <section className="app-card empty-state-card">
            <h2>{t('loadingRebalance')}</h2>
          </section>
        ) : loadError ? (
          <section className="app-card empty-state-card">
            <h2>{t('rebalanceLoadFailed')}</h2>
            <p className="page-subtitle">{loadError}</p>
          </section>
        ) : items.length === 0 ? (
          <section className="app-card empty-state-card">
            <h2>{t('noRebalanceTemplate')}</h2>
            <a className="button-link" href="add_asset.html">{t('createAssetFirst')}</a>
          </section>
        ) : (
          <section className="app-card">
            <div className="rebalance-meta">
              <div>
                <span className="metric-label">{t('sourceSnapshot')}</span>
                <strong>{sourceDate || '-'}</strong>
              </div>
              <label>
                <span className="metric-label">{t('rebalanceDate')}</span>
                <input
                  type="date"
                  value={rebalanceDate}
                  onChange={(ev) => setRebalanceDate(ev.target.value)}
                />
              </label>
            </div>

            <div className="table-scroll">
              <table className="rebalance-table">
                <thead>
                  <tr>
                    <th>{t('type')}</th>
                    <th>{t('region')}</th>
                    <th>{t('currency')}</th>
                    <th>{t('latestAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={`${item.sourceAssetId}-${index}`}>
                      <td><span className="type-pill">{item.type || ''}</span></td>
                      <td>{item.region || ''}</td>
                      <td>{item.currency || ''}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={item.amount}
                          onChange={(ev) => updateAmount(index, ev.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="form-actions">
              <button type="button" disabled={saving} onClick={saveSnapshot}>
                {saving ? `${t('save')}...` : t('saveRebalance')}
              </button>
            </div>
          </section>
        )}
      </div>
    );
  }
  AM.RebalancePage = RebalancePage;
})();
