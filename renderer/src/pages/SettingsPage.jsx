(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, computeFxState, convertAmount, formatAmount,
    formatDateOnly, toNumber, translate, useAppLanguage
  } = AM;
  function SettingsPage() {
    const [uiLanguage, setUiLanguage] = useAppLanguage();
    const [settings, setSettings] = useState({
      language: 'en-US',
      displayCurrency: 'USD',
      fxCacheTtlDays: '90',
    });
    const [rates, setRates] = useState([]);
    const [draftRates, setDraftRates] = useState({
      'CNY->JPY': '',
      'USD->JPY': '',
      'USD->CNY': '',
    });
    const [message, setMessage] = useState('');
    const t = (key) => translate(uiLanguage, key);

    async function refresh() {
      const [s, r] = await Promise.all([window.api.getSettings(), window.api.getExchangeRates()]);
      const nextSettings = {
        language: s['app.language'] || 'en-US',
        displayCurrency: s['app.display_currency'] || 'USD',
        fxCacheTtlDays: s['fx.cache_ttl_days'] || '90',
      };
      setUiLanguage(nextSettings.language);
      setSettings(nextSettings);
      setRates(r || []);
      const lookup = {};
      (r || []).forEach((row) => {
        lookup[`${row.base_currency}->${row.quote_currency}`] = row.rate;
      });
      setDraftRates({
        'CNY->JPY': lookup['CNY->JPY'] ? String(lookup['CNY->JPY']) : '',
        'USD->JPY': lookup['USD->JPY'] ? String(lookup['USD->JPY']) : '',
        'USD->CNY': lookup['USD->CNY'] ? String(lookup['USD->CNY']) : '',
      });
    }

    useEffect(() => {
      refresh();
    }, []);

    async function saveBaseSettings() {
      try {
        await window.api.setSetting('app.language', settings.language);
        await window.api.setSetting('app.display_currency', settings.displayCurrency);
        await window.api.setSetting('fx.cache_ttl_days', settings.fxCacheTtlDays || '90');
        setUiLanguage(settings.language);
        setMessage(translate(settings.language, 'settingsSaved'));
      } catch (err) {
        setMessage(t('settingsSaveFailed'));
      }
    }

    async function saveRates() {
      try {
        const pairs = [
          ['CNY', 'JPY', draftRates['CNY->JPY']],
          ['USD', 'JPY', draftRates['USD->JPY']],
          ['USD', 'CNY', draftRates['USD->CNY']],
        ];
        for (const [base, quote, rate] of pairs) {
          const value = toNumber(rate, NaN);
          if (!Number.isFinite(value) || value <= 0) continue;
          const result = await window.api.upsertExchangeRate({
            baseCurrency: base,
            quoteCurrency: quote,
            rate: value,
          });
          if (result && result.error) {
            setMessage(result.error);
            return;
          }
        }
        await refresh();
        setMessage(t('ratesSaved'));
      } catch (err) {
        setMessage(t('ratesSaveFailed'));
      }
    }

    async function onExportData() {
      const result = await window.api.exportDatabase();
      if (!result || result.canceled) return;
      if (result.success) {
        setMessage(`${t('exportSuccess')} ${result.path}`);
        return;
      }
      setMessage(result.error || 'Export failed');
    }

    async function onImportData() {
      if (!window.confirm(t('importDataConfirm'))) return;
      const result = await window.api.importDatabase();
      if (!result || result.canceled) return;
      if (result.success) {
        setMessage(t('importWillRestart'));
        return;
      }
      setMessage(result.error || 'Import failed');
    }

    function findUpdatedAt(base, quote) {
      const hit = rates.find((r) => r.base_currency === base && r.quote_currency === quote);
      return formatDateOnly(hit && hit.updated_at);
    }

    return (
      <div className="page-stack settings-page">
        <div>
          <h1>{t('settingsTitle')}</h1>
          <p className="page-subtitle">{t('settingsSubtitle')}</p>
        </div>
        {message ? <p className="form-feedback">{message}</p> : null}
        <div className="settings-grid">
          <section className="app-card">
            <div className="card-header">
              <h2>{t('preferences')}</h2>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 520px', minWidth: '280px' }}>
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label>
                    {t('language')}{' '}
                    <select
                      value={settings.language}
                      onChange={(ev) => {
                        const nextLang = ev.target.value;
                        setSettings({ ...settings, language: nextLang });
                        setUiLanguage(nextLang);
                      }}
                    >
                      <option value="zh-CN">简体中文 (zh-CN)</option>
                      <option value="en-US">English (en-US)</option>
                      <option value="ja-JP">日本語 (ja-JP)</option>
                    </select>
                  </label>

                  <label>
                    {t('displayCurrency')}{' '}
                    <select
                      value={settings.displayCurrency}
                      onChange={(ev) => setSettings({ ...settings, displayCurrency: ev.target.value })}
                    >
                      <option value="JPY">JPY</option>
                      <option value="CNY">CNY</option>
                      <option value="USD">USD</option>
                    </select>
                  </label>

                  <label>
                    {t('fxCacheTtlDays')}{' '}
                    <input
                      type="number"
                      min="1"
                      value={settings.fxCacheTtlDays}
                      onChange={(ev) => setSettings({ ...settings, fxCacheTtlDays: ev.target.value })}
                    />
                  </label>
                </div>
              </div>
              <div style={{ marginBottom: '2px' }}>
                <button type="button" onClick={saveBaseSettings}>
                  {t('saveSettings')}
                </button>
              </div>
            </div>
          </section>

          <section className="app-card settings-wide">
            <div className="card-header">
              <h2>{t('exchangeRatesManual')}</h2>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 620px', minWidth: '280px' }}>
                <p>{t('supportedCurrencies')}</p>
                <table>
                  <thead>
                    <tr>
                      <th>{t('pair')}</th>
                      <th>{t('rate')}</th>
                      <th>{t('updatedAt')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 CNY = ? JPY</td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={draftRates['CNY->JPY']}
                          onChange={(ev) => setDraftRates({ ...draftRates, 'CNY->JPY': ev.target.value })}
                        />
                      </td>
                      <td>{findUpdatedAt('CNY', 'JPY')}</td>
                    </tr>
                    <tr>
                      <td>1 USD = ? JPY</td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={draftRates['USD->JPY']}
                          onChange={(ev) => setDraftRates({ ...draftRates, 'USD->JPY': ev.target.value })}
                        />
                      </td>
                      <td>{findUpdatedAt('USD', 'JPY')}</td>
                    </tr>
                    <tr>
                      <td>1 USD = ? CNY</td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={draftRates['USD->CNY']}
                          onChange={(ev) => setDraftRates({ ...draftRates, 'USD->CNY': ev.target.value })}
                        />
                      </td>
                      <td>{findUpdatedAt('USD', 'CNY')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginBottom: '2px' }}>
                <button type="button" onClick={saveRates}>
                  {t('saveRatesToDb')}
                </button>
              </div>
            </div>
          </section>

          <section className="app-card settings-wide">
            <div className="card-header">
              <h2>{t('localData')}</h2>
            </div>
            <div className="data-actions">
              <button type="button" className="data-action-card" onClick={onExportData}>
                <span>{t('exportDataDesc')}</span>
                <strong>{t('exportData')}</strong>
              </button>
              <button type="button" className="data-action-card danger" onClick={onImportData}>
                <span>{t('importDataDesc')}</span>
                <strong>{t('importData')}</strong>
              </button>
            </div>
          </section>
        </div>

      </div>
    );
  }
  AM.SettingsPage = SettingsPage;
})();
