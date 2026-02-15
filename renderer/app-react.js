(function () {
  const { useEffect, useMemo, useRef, useState } = React;

  function pageName() {
    const p = window.location.pathname.split('/').pop();
    if (p === 'dashboard.html') return 'dashboard';
    if (p === 'assets.html') return 'assets';
    if (p === 'add_asset.html') return 'add_asset';
    if (p === 'asset_types.html') return 'asset_types';
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

  const SUPPORTED_CURRENCIES = ['JPY', 'CNY', 'USD'];

  const I18N = {
    'en-US': {
      dashboard: 'Dashboard',
      totalAsset: 'Total Asset',
      viewAssets: 'View Assets',
      addAsset: 'Add Asset',
      viewChart: 'View Chart',
      assetTypes: 'Asset Types',
      recentAssets: 'Current Assets',
      date: 'Date',
      type: 'Type',
      name: 'Name',
      amount: 'Amount',
      currency: 'Currency',
      partial: 'partial',
      settings: 'Settings',
      updated: 'updated',
      excluded: 'excluded',
      assets: 'Assets',
      editAsset: 'Edit Asset',
      update: 'Update',
      cancel: 'Cancel',
      actions: 'Actions',
      duplicate: 'Duplicate',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      addAssetTitle: 'Add Asset',
      save: 'Save',
      assetTypesTitle: 'Asset Types',
      newTypeName: 'New type name',
      addType: 'Add Type',
      editAssetType: 'Edit Asset Type',
      id: 'ID',
      deleteTypeConfirm: 'Are you sure you want to delete this asset type?',
      chartTitle: 'Asset Chart',
      settingsTitle: 'Settings',
      language: 'Language',
      displayCurrency: 'Display Currency',
      fxCacheTtlDays: 'FX Cache TTL (days)',
      saveSettings: 'Save Settings',
      exchangeRatesManual: 'Exchange Rates (Manual)',
      supportedCurrencies: 'Supported currencies: JPY / CNY / USD',
      pair: 'Pair',
      rate: 'Rate',
      updatedAt: 'Updated At',
      saveRatesToDb: 'Save Rates',
      backToDashboard: 'Back to Dashboard',
      settingsSaved: 'Settings saved.',
      ratesSaved: 'Exchange rates saved to database.',
      selectType: '-- Select Type --',
      page: 'Page',
      prev: 'Prev',
      next: 'Next',
      of: 'of',
      exportData: 'Export Data',
      importData: 'Import Data',
      exportSuccess: 'Database exported:',
      importWillRestart: 'Database imported. The app will restart.',
      importDataConfirm:
        'Importing will overwrite current data. The app will restart after import. Continue?',
    },
    'zh-CN': {
      dashboard: '首页',
      totalAsset: '总资产',
      viewAssets: '查看资产',
      addAsset: '新增资产',
      viewChart: '查看图表',
      assetTypes: '资产类型',
      recentAssets: '当前资产',
      date: '日期',
      type: '类型',
      name: '名称',
      amount: '金额',
      currency: '币种',
      partial: '部分统计',
      settings: '设置',
      updated: '更新时间',
      excluded: '未计入',
      assets: '资产列表',
      editAsset: '编辑资产',
      update: '更新',
      cancel: '取消',
      actions: '操作',
      duplicate: '复制',
      edit: '编辑',
      delete: '删除',
      back: '返回',
      addAssetTitle: '新增资产',
      save: '保存',
      assetTypesTitle: '资产类型',
      newTypeName: '新类型名称',
      addType: '新增类型',
      editAssetType: '编辑资产类型',
      id: 'ID',
      deleteTypeConfirm: '确认删除该资产类型吗？',
      chartTitle: '资产图表',
      settingsTitle: '设置',
      language: '语言',
      displayCurrency: '显示币种',
      fxCacheTtlDays: '汇率缓存有效期（天）',
      saveSettings: '保存设置',
      exchangeRatesManual: '汇率维护（手工）',
      supportedCurrencies: '支持币种：JPY / CNY / USD',
      pair: '币种对',
      rate: '汇率',
      updatedAt: '更新时间',
      saveRatesToDb: '保存汇率',
      backToDashboard: '返回首页',
      settingsSaved: '设置已保存。',
      ratesSaved: '汇率已保存到数据库。',
      selectType: '-- 选择类型 --',
      page: '第',
      prev: '上一页',
      next: '下一页',
      of: '/',
      exportData: '导出数据',
      importData: '导入数据',
      exportSuccess: '数据库已导出：',
      importWillRestart: '数据库已导入，应用即将重启。',
      importDataConfirm: '导入会覆盖当前数据，并在完成后重启应用。是否继续？',
    },
    'ja-JP': {
      dashboard: 'ダッシュボード',
      totalAsset: '総資産',
      viewAssets: '資産一覧',
      addAsset: '資産追加',
      viewChart: 'チャート',
      assetTypes: '資産タイプ',
      recentAssets: '現在の資産',
      date: '日付',
      type: 'タイプ',
      name: '名称',
      amount: '金額',
      currency: '通貨',
      partial: '一部集計',
      settings: '設定',
      updated: '更新',
      excluded: '除外',
      assets: '資産',
      editAsset: '資産編集',
      update: '更新',
      cancel: 'キャンセル',
      actions: '操作',
      duplicate: '複製',
      edit: '編集',
      delete: '削除',
      back: '戻る',
      addAssetTitle: '資産追加',
      save: '保存',
      assetTypesTitle: '資産タイプ',
      newTypeName: '新しいタイプ名',
      addType: 'タイプ追加',
      editAssetType: '資産タイプ編集',
      id: 'ID',
      deleteTypeConfirm: 'この資産タイプを削除しますか？',
      chartTitle: '資産チャート',
      settingsTitle: '設定',
      language: '言語',
      displayCurrency: '表示通貨',
      fxCacheTtlDays: '為替キャッシュ有効日数',
      saveSettings: '設定を保存',
      exchangeRatesManual: '為替レート（手動）',
      supportedCurrencies: '対応通貨: JPY / CNY / USD',
      pair: '通貨ペア',
      rate: 'レート',
      updatedAt: '更新時刻',
      saveRatesToDb: 'レートを保存',
      backToDashboard: 'ダッシュボードへ戻る',
      settingsSaved: '設定を保存しました。',
      ratesSaved: '為替レートを保存しました。',
      selectType: '-- タイプを選択 --',
      page: 'ページ',
      prev: '前へ',
      next: '次へ',
      of: '/',
      exportData: 'データをエクスポート',
      importData: 'データをインポート',
      exportSuccess: 'データベースをエクスポートしました:',
      importWillRestart: 'データベースをインポートしました。アプリを再起動します。',
      importDataConfirm:
        'インポートすると現在のデータを上書きし、完了後にアプリが再起動します。続行しますか？',
    },
  };

  function translate(language, key) {
    return (
      (I18N[language] && I18N[language][key]) ||
      (I18N['en-US'] && I18N['en-US'][key]) ||
      (I18N['zh-CN'] && I18N['zh-CN'][key]) ||
      key
    );
  }

  function useAppLanguage() {
    const [language, setLanguage] = useState('en-US');
    useEffect(() => {
      (async () => {
        try {
          const settings = await window.api.getSettings();
          setLanguage((settings && settings['app.language']) || 'en-US');
        } catch (err) {}
      })();
    }, []);
    return [language, setLanguage];
  }

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

  function DashboardPage() {
    const [rows, setRows] = useState([]);
    const [language, setLanguage] = useAppLanguage();
    const [displayCurrency, setDisplayCurrency] = useState('USD');
    const [rates, setRates] = useState([]);
    const [fxMeta, setFxMeta] = useState({ status: 'ok', missingPairs: [] });
    const [fxUpdatedAt, setFxUpdatedAt] = useState('-');
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
    const today = new Date().toLocaleDateString();

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
        const ttlDays =
          settings && settings['fx.cache_ttl_days']
            ? Number(settings['fx.cache_ttl_days'])
            : 90;
        const usedDisplayCurrency = SUPPORTED_CURRENCIES.includes(disp) ? disp : 'USD';

        const requiredPairs = [];
        assets.forEach((a) => {
          const from = String(a.currency || '').toUpperCase();
          if (from && from !== usedDisplayCurrency) requiredPairs.push(`${from}->${usedDisplayCurrency}`);
        });
        const fx = computeFxState(exchangeRates, requiredPairs, ttlDays);

        setRows(assets.slice(0, 10));
        setLanguage(lang);
        setDisplayCurrency(usedDisplayCurrency);
        setRates(exchangeRates || []);
        setFxMeta({ status: fx.status, missingPairs: fx.missingPairs });
        if ((exchangeRates || []).length > 0) {
          const latest = [...exchangeRates]
            .map((r) => r.updated_at)
            .filter(Boolean)
            .sort()
            .pop();
          setFxUpdatedAt(latest || '-');
        }
      })();
    }, [setLanguage]);

    return (
      <div>
        <section className="total-section">
          <div className="total-row">
            <h2>{t('totalAsset')}</h2>
            <div id="totalAsset">
              {`${currencySymbol[displayCurrency] || ''}${conversionMeta.total.toLocaleString()} ${displayCurrency}`}
              {conversionMeta.missingPairs.length > 0 ? ` (${t('partial')})` : ''}
            </div>
          </div>
        </section>

        <MainNav t={t} />

        <section>
          <h2>{t('recentAssets')}</h2>
          <table id="recentAssets">
            <thead>
              <tr>
                <th>{t('date')}</th>
                <th>{t('type')}</th>
                <th>{t('name')}</th>
                <th>{t('amount')}</th>
                <th>{t('currency')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id || `${r.date}-${r.name}`}>
                  <td>{r.date || ''}</td>
                  <td>{r.type || ''}</td>
                  <td>{r.name || ''}</td>
                  <td>{formatAmount(r.amount || 0)}</td>
                  <td>{r.currency || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          {today} · FX:{' '}
          {String(conversionMeta.missingPairs.length > 0 ? 'missing' : fxMeta.status || 'ok').toUpperCase()} ·{' '}
          {t('updated')}: {fxUpdatedAt}
          {conversionMeta.missingPairs.length > 0 && conversionMeta.excludedCount > 0
            ? ` · ${t('excluded')}: ${conversionMeta.excludedCount}`
            : ''}
        </div>
      </div>
    );
  }

  function MainNav({ t }) {
    return (
      <section style={{ margin: '6px 0 10px' }}>
        <nav
          style={{
            margin: 0,
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <a href="dashboard.html" style={{ whiteSpace: 'nowrap' }}>{t('dashboard')}</a>
          <a href="assets.html" style={{ whiteSpace: 'nowrap' }}>{t('viewAssets')}</a>
          <a href="add_asset.html" style={{ whiteSpace: 'nowrap' }}>{t('addAsset')}</a>
          <a href="chart.html" style={{ whiteSpace: 'nowrap' }}>{t('viewChart')}</a>
          <a href="asset_types.html" style={{ whiteSpace: 'nowrap' }}>{t('assetTypes')}</a>
          <a href="settings.html" style={{ whiteSpace: 'nowrap' }}>{t('settings')}</a>
        </nav>
      </section>
    );
  }

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
      await window.api.setSetting('app.language', settings.language);
      await window.api.setSetting('app.display_currency', settings.displayCurrency);
      await window.api.setSetting('fx.cache_ttl_days', settings.fxCacheTtlDays || '90');
      setUiLanguage(settings.language);
      setMessage(translate(settings.language, 'settingsSaved'));
    }

    async function saveRates() {
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
      return hit && hit.updated_at ? hit.updated_at : '-';
    }

    return (
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <h1>{t('settingsTitle')}</h1>
        <MainNav t={t} />

        <div style={{ display: 'grid', gap: '18px' }}>
          <section style={{ margin: 0, border: '1px solid #d9d9d9', borderRadius: '10px', padding: '16px 18px' }}>
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

          <section style={{ margin: 0, border: '1px solid #d9d9d9', borderRadius: '10px', padding: '16px 18px' }}>
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

          <section style={{ margin: 0, border: '1px solid #d9d9d9', borderRadius: '10px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" onClick={onExportData}>
                {t('exportData')}
              </button>
              <button type="button" onClick={onImportData}>
                {t('importData')}
              </button>
            </div>
          </section>
        </div>

        {message ? <p style={{ marginTop: '12px' }}>{message}</p> : null}
      </div>
    );
  }

  function AssetsPage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const [assets, setAssets] = useState([]);
    const [types, setTypes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const headerCellStyle = { padding: '8px 10px', lineHeight: '1.2' };
    const cellStyle = { padding: '8px 10px', lineHeight: '1.2', verticalAlign: 'middle' };
    const actionBtnStyle = {
      padding: '6px 10px',
      minHeight: 'auto',
      lineHeight: '1.1',
      marginRight: '6px',
      marginBottom: '0',
    };

    async function refresh() {
      const [a, t2] = await Promise.all([window.api.getAssets(), window.api.getAssetTypes()]);
      setAssets(a);
      setTypes(t2);
    }

    useEffect(() => {
      refresh();
    }, []);

    async function onDelete(id) {
      await window.api.deleteAsset(Number(id));
      refresh();
    }

    const totalPages = Math.max(1, Math.ceil(assets.length / pageSize));
    const pagedAssets = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return assets.slice(start, start + pageSize);
    }, [assets, currentPage]);

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [currentPage, totalPages]);

    function onDuplicate(item) {
      const pre = {
        date: item.date || '',
        typeId: Number(item.type_id || 0),
        name: item.name || '',
        amount: item.amount || '',
        currency: item.currency || '',
      };
      try {
        sessionStorage.setItem('prefillAsset', JSON.stringify(pre));
      } catch (err) {}
      window.location.href = 'add_asset.html';
    }

    async function onUpdate() {
      if (!editing) return;
      await window.api.modifyAsset({
        id: Number(editing.id),
        date: editing.date,
        typeId: Number(editing.typeId || 0),
        name: editing.name,
        amount: toNumber(editing.amount, 0),
        currency: editing.currency,
      });
      setEditing(null);
      refresh();
    }

    return (
      <div>
        <h1>{t('assets')}</h1>
        <MainNav t={t} />

        {editing ? (
          <div id="editAssetForm" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc' }}>
            <h3>{t('editAsset')}</h3>
            <label>
              {t('date')}{' '}
              <input
                id="editDate"
                type="date"
                required
                value={editing.date}
                onChange={(ev) => setEditing({ ...editing, date: ev.target.value })}
              />
            </label>
            <label>
              {t('type')}{' '}
              <select
                id="editType"
                value={String(editing.typeId || '')}
                onChange={(ev) => setEditing({ ...editing, typeId: ev.target.value })}
              >
                <option value="">{t('selectType')}</option>
                {types.map((tt) => (
                  <option key={tt.id} value={String(tt.id)}>
                    {tt.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('name')}{' '}
              <input
                id="editName"
                type="text"
                value={editing.name}
                onChange={(ev) => setEditing({ ...editing, name: ev.target.value })}
              />
            </label>
            <label>
              {t('amount')}{' '}
              <input
                id="editAmount"
                type="number"
                step="0.01"
                value={editing.amount}
                onChange={(ev) => setEditing({ ...editing, amount: ev.target.value })}
              />
            </label>
            <label>
              {t('currency')}{' '}
              <select
                id="editCurrency"
                value={editing.currency}
                onChange={(ev) => setEditing({ ...editing, currency: ev.target.value })}
              >
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
                <option value="USD">USD</option>
              </select>
            </label>
            <button id="updateAssetBtn" type="button" onClick={onUpdate}>
              {t('update')}
            </button>{' '}
            <button id="cancelEditBtn" type="button" onClick={() => setEditing(null)}>
              {t('cancel')}
            </button>
          </div>
        ) : null}

        <table>
          <thead>
            <tr>
              <th style={headerCellStyle}>{t('date')}</th>
              <th style={headerCellStyle}>{t('type')}</th>
              <th style={headerCellStyle}>{t('name')}</th>
              <th style={headerCellStyle}>{t('amount')}</th>
              <th style={headerCellStyle}>{t('currency')}</th>
              <th style={headerCellStyle}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody id="assetList">
            {pagedAssets.map((a) => (
              <tr key={a.id}>
                <td style={cellStyle}>{a.date || ''}</td>
                <td style={cellStyle}>{a.type || ''}</td>
                <td style={cellStyle}>{a.name || ''}</td>
                <td style={cellStyle}>{formatAmount(a.amount || 0)}</td>
                <td style={cellStyle}>{a.currency || ''}</td>
                <td style={cellStyle}>
                  <button style={actionBtnStyle} className="dup" onClick={() => onDuplicate(a)}>
                    {t('duplicate')}
                  </button>{' '}
                  <button
                    style={actionBtnStyle}
                    className="edit"
                    onClick={() =>
                      setEditing({
                        id: a.id,
                        date: a.date || '',
                        typeId: a.type_id || '',
                        name: a.name || '',
                        amount: a.amount || '',
                        currency: a.currency || 'USD',
                      })
                    }
                  >
                    {t('edit')}
                  </button>{' '}
                  <button style={actionBtnStyle} className="del" onClick={() => onDelete(a.id)}>
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            {t('prev')}
          </button>
          <span>
            {t('page')} {currentPage} {t('of')} {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            {t('next')}
          </button>
        </div>
      </div>
    );
  }

  function AddAssetPage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({ date: '', typeId: '', name: '', amount: '', currency: 'USD' });

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
              name: p.name || '',
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
        name: form.name,
        amount: toNumber(form.amount, 0),
        currency: form.currency || '',
      });
      window.location.href = 'assets.html';
    }

    return (
      <div>
        <h1>{t('addAssetTitle')}</h1>
        <MainNav t={t} />
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
            {t('name')}{' '}
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(ev) => setForm({ ...form, name: ev.target.value })}
            />
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

  function AssetTypesPage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const [types, setTypes] = useState([]);
    const [newName, setNewName] = useState('');
    const [editing, setEditing] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const headerCellStyle = { padding: '8px 10px', lineHeight: '1.2' };
    const cellStyle = { padding: '8px 10px', lineHeight: '1.2', verticalAlign: 'middle' };
    const actionBtnStyle = {
      padding: '6px 10px',
      minHeight: 'auto',
      lineHeight: '1.1',
      marginRight: '6px',
      marginBottom: '0',
    };

    async function refresh() {
      const tt = await window.api.getAssetTypes();
      setTypes(tt);
    }

    useEffect(() => {
      refresh();
    }, []);

    async function addType(ev) {
      ev.preventDefault();
      if (!newName.trim()) return;
      await window.api.addAssetType(newName.trim());
      setNewName('');
      refresh();
    }

    async function updateType() {
      if (!editing || !editing.name.trim()) return;
      await window.api.modifyAssetType(Number(editing.id), editing.name.trim());
      setEditing(null);
      refresh();
    }

    async function deleteType(id) {
      if (!window.confirm(t('deleteTypeConfirm'))) return;
      const result = await window.api.deleteAssetType(Number(id));
      if (result && result.error) {
        window.alert(result.error);
        return;
      }
      refresh();
    }

    const totalPages = Math.max(1, Math.ceil(types.length / pageSize));
    const pagedTypes = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return types.slice(start, start + pageSize);
    }, [types, currentPage]);

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [currentPage, totalPages]);

    return (
      <div>
        <h1>{t('assetTypesTitle')}</h1>
        <MainNav t={t} />
        <form id="addTypeForm" onSubmit={addType}>
          <input
            id="typeName"
            placeholder={t('newTypeName')}
            required
            value={newName}
            onChange={(ev) => setNewName(ev.target.value)}
          />
          <button type="submit">{t('addType')}</button>
        </form>

        {editing ? (
          <div id="editTypeForm" style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{t('editAssetType')}</h3>
            <input
              id="editTypeName"
              placeholder={t('type')}
              required
              value={editing.name}
              onChange={(ev) => setEditing({ ...editing, name: ev.target.value })}
            />{' '}
            <button id="updateBtn" type="button" onClick={updateType}>
              {t('update')}
            </button>{' '}
            <button id="cancelBtn" type="button" onClick={() => setEditing(null)}>
              {t('cancel')}
            </button>
          </div>
        ) : null}

        <table>
          <thead>
            <tr>
              <th style={headerCellStyle}>{t('id')}</th>
              <th style={headerCellStyle}>{t('name')}</th>
              <th style={headerCellStyle}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody id="typeList">
            {pagedTypes.map((tt) => (
              <tr key={tt.id}>
                <td style={cellStyle}>{String(tt.id)}</td>
                <td style={cellStyle}>{tt.name}</td>
                <td style={cellStyle}>
                  <button style={actionBtnStyle} className="edit" onClick={() => setEditing({ id: tt.id, name: tt.name })}>
                    {t('edit')}
                  </button>{' '}
                  <button style={actionBtnStyle} className="del" onClick={() => deleteType(tt.id)}>
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            {t('prev')}
          </button>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
              <button
                key={pageNo}
                type="button"
                onClick={() => setCurrentPage(pageNo)}
                style={{
                  minHeight: 'auto',
                  padding: '4px 8px',
                  lineHeight: '1.1',
                  background: pageNo === currentPage ? '#333' : '#fff',
                  color: pageNo === currentPage ? '#fff' : '#333',
                  border: '1px solid #bbb',
                }}
              >
                {pageNo}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            {t('next')}
          </button>
          <span>
            {t('page')} {currentPage} {t('of')} {totalPages}
          </span>
        </div>
      </div>
    );
  }

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
        const h = (canvas.height = 420);
        ctx.clearRect(0, 0, w, h);

        const margin = { top: 60, right: 30, bottom: 80, left: 70 };
        const chartW = w - margin.left - margin.right;
        const chartH = h - margin.top - margin.bottom;

        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('chartTitle'), w / 2, 32);

        const maxVal = Math.max(...values, 0);
        const niceMax = Math.max(10, Math.ceil(maxVal / 10) * 10);
        const ySteps = 5;
        const step = Math.ceil(niceMax / ySteps);
        const displayMax = step * ySteps;

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
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
        const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1'];

        for (let i = 0; i < barCount; i++) {
          const val = values[i] || 0;
          const x = margin.left + gap + i * (barW + gap);
          const barH = (val / displayMax) * chartH;
          const y = margin.top + chartH - barH;
          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(x, y, barW, barH);

          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(Math.round(val).toLocaleString(), x + barW / 2, y - 8);

          ctx.save();
          ctx.translate(x + barW / 2, margin.top + chartH + 6);
          ctx.textAlign = 'center';
          ctx.fillText(labels[i], 0, 18);
          ctx.restore();
        }

        ctx.save();
        ctx.translate(margin.left - 48, margin.top + chartH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        ctx.fillText(`${t('amount')} (${DISPLAY_CURRENCY})`, 0, 0);
        ctx.restore();
      })();
    }, [language]);

    return (
      <div>
        <h1>{`${t('chartTitle')} (${displayCurrency})`}</h1>
        <MainNav t={t} />
        <canvas
          id="chart"
          ref={canvasRef}
          width={800}
          height={400}
          style={{ border: '1px solid #ddd', display: 'block', marginBottom: '8px', maxWidth: '100%' }}
        />
      </div>
    );
  }

  function App() {
    const p = useMemo(pageName, []);
    if (p === 'assets') return <AssetsPage />;
    if (p === 'add_asset') return <AddAssetPage />;
    if (p === 'asset_types') return <AssetTypesPage />;
    if (p === 'chart') return <ChartPage />;
    if (p === 'settings') return <SettingsPage />;
    return <DashboardPage />;
  }

  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(<App />);
})();
