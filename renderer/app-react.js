(function () {
  const { useEffect, useMemo, useRef, useState } = React;

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

  const SUPPORTED_CURRENCIES = ['JPY', 'CNY', 'USD'];

  const I18N = {
    'en-US': {
      dashboard: 'Dashboard',
      totalAsset: 'Total Asset',
      viewAssets: 'View Assets',
      addAsset: 'Add Asset',
      addNewRebalance: 'Add New Rebalance',
      viewChart: 'View Chart',
      assetTypes: 'Asset Types',
      recentAssets: 'Current Assets',
      date: 'Date',
      type: 'Type',
      name: 'Name',
      region: 'Region',
      amount: 'Amount',
      currency: 'Currency',
      partial: 'partial',
      settings: 'Settings',
      overview: 'Overview',
      charts: 'Charts',
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
      newTypeRegion: 'Region (optional)',
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
      settingsSaveFailed: 'Failed to save preferences.',
      ratesSaveFailed: 'Failed to save exchange rates.',
      rebalanceTitle: 'New Rebalance',
      rebalanceSubtitle: 'Copy the latest asset snapshot, set today as the new date, and enter the latest values.',
      loadingRebalance: 'Loading rebalance template...',
      rebalanceLoadFailed: 'Failed to load rebalance template. Please restart the app and try again.',
      sourceSnapshot: 'Source Snapshot',
      rebalanceDate: 'Rebalance Date',
      latestAmount: 'Latest Amount',
      saveRebalance: 'Save Rebalance',
      noRebalanceTemplate: 'No previous asset snapshot is available.',
      createAssetFirst: 'Create an asset first',
      invalidRebalanceAmount: 'Please enter valid non-negative integer amounts.',
      rebalanceSaved: 'Rebalance saved. Dashboard will use the new snapshot.',
      rebalanceSaveFailed: 'Failed to save rebalance.',
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
      dashboardSubtitle: 'Detailed overview of your global wealth across currencies and regions.',
      addAssetSubtitle: 'Record a new asset snapshot with date, class, amount, and currency.',
      assetTypesSubtitle: 'Manage categories used to classify assets.',
      settingsSubtitle: 'Manage your global preferences and financial categories.',
      chartSubtitle: 'High-fidelity analysis of historical growth trends across multiple currencies.',
      preferences: 'Preferences',
      localData: 'Local Data',
      exportDataDesc: 'Export local SQLite database',
      importDataDesc: 'Validate, backup, import, then restart',
      quickAction: 'Quick Action',
      assetBreakdown: 'Asset Breakdown',
      assetAllocation: 'Asset Allocation',
      total: 'Total',
      historicalGrowth: 'Historical Growth',
    },
    'zh-CN': {
      dashboard: '首页',
      totalAsset: '总资产',
      viewAssets: '查看资产',
      addAsset: '新增资产',
      addNewRebalance: '新增调仓',
      viewChart: '查看图表',
      assetTypes: '资产类型',
      recentAssets: '当前资产',
      date: '日期',
      type: '类型',
      name: '名称',
      region: '地区',
      amount: '金额',
      currency: '币种',
      partial: '部分统计',
      settings: '设置',
      overview: '首页',
      charts: '图表',
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
      newTypeRegion: '地区（可选）',
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
      settingsSaveFailed: '保存偏好设置失败。',
      ratesSaveFailed: '保存汇率失败。',
      rebalanceTitle: '新增调仓',
      rebalanceSubtitle: '复制最近一次资产快照，默认使用今天日期，录入每项资产的最新数值。',
      loadingRebalance: '正在加载调仓模板...',
      rebalanceLoadFailed: '加载调仓模板失败。请重启应用后重试。',
      sourceSnapshot: '来源快照',
      rebalanceDate: '调仓日期',
      latestAmount: '最新金额',
      saveRebalance: '保存调仓',
      noRebalanceTemplate: '还没有可复制的资产快照。',
      createAssetFirst: '先新增资产',
      invalidRebalanceAmount: '请输入有效的非负整数金额。',
      rebalanceSaved: '调仓已保存，首页将使用新的资产快照。',
      rebalanceSaveFailed: '保存调仓失败。',
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
      dashboardSubtitle: '按币种与地区汇总查看当前资产概况。',
      addAssetSubtitle: '记录一条新的资产快照，包含日期、类型、金额和币种。',
      assetTypesSubtitle: '管理用于资产分类的类型。',
      settingsSubtitle: '管理全局偏好、汇率和本地数据。',
      chartSubtitle: '查看跨币种折算后的历史资产趋势。',
      preferences: '偏好设置',
      localData: '本地数据',
      exportDataDesc: '导出本地 SQLite 数据库',
      importDataDesc: '校验、备份、导入并重启应用',
      quickAction: '快捷操作',
      assetBreakdown: '资产明细',
      assetAllocation: '资产分布',
      total: '合计',
      historicalGrowth: '历史增长',
    },
    'ja-JP': {
      dashboard: 'ダッシュボード',
      totalAsset: '総資産',
      viewAssets: '資産一覧',
      addAsset: '資産追加',
      addNewRebalance: 'リバランス追加',
      viewChart: 'チャート',
      assetTypes: '資産タイプ',
      recentAssets: '現在の資産',
      date: '日付',
      type: 'タイプ',
      name: '名称',
      region: '地域',
      amount: '金額',
      currency: '通貨',
      partial: '一部集計',
      settings: '設定',
      overview: '概要',
      charts: 'チャート',
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
      newTypeRegion: '地域（任意）',
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
      settingsSaveFailed: '基本設定の保存に失敗しました。',
      ratesSaveFailed: '為替レートの保存に失敗しました。',
      rebalanceTitle: 'リバランス追加',
      rebalanceSubtitle: '最新の資産スナップショットをコピーし、今日の日付で最新金額を入力します。',
      loadingRebalance: 'リバランステンプレートを読み込み中...',
      rebalanceLoadFailed: 'リバランステンプレートの読み込みに失敗しました。アプリを再起動して再試行してください。',
      sourceSnapshot: 'コピー元スナップショット',
      rebalanceDate: 'リバランス日',
      latestAmount: '最新金額',
      saveRebalance: 'リバランスを保存',
      noRebalanceTemplate: 'コピーできる資産スナップショットがありません。',
      createAssetFirst: '先に資産を追加',
      invalidRebalanceAmount: '有効な非負整数の金額を入力してください。',
      rebalanceSaved: 'リバランスを保存しました。ダッシュボードは新しいスナップショットを使用します。',
      rebalanceSaveFailed: 'リバランスの保存に失敗しました。',
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
      dashboardSubtitle: '通貨と地域をまたいだ現在の資産概要を確認します。',
      addAssetSubtitle: '日付、タイプ、金額、通貨を指定して新しい資産スナップショットを記録します。',
      assetTypesSubtitle: '資産分類に使用するタイプを管理します。',
      settingsSubtitle: '全体設定、為替レート、ローカルデータを管理します。',
      chartSubtitle: '表示通貨に換算した資産推移を確認します。',
      preferences: '基本設定',
      localData: 'ローカルデータ',
      exportDataDesc: 'ローカル SQLite データベースを書き出し',
      importDataDesc: '検証、バックアップ、インポート後に再起動',
      quickAction: 'クイック操作',
      assetBreakdown: '資産内訳',
      assetAllocation: '資産配分',
      total: '合計',
      historicalGrowth: '資産推移',
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
          setFxUpdatedAt(formatDateOnly(latest));
        }
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
          <div className="hero-metrics">
            <div>
              <span className="metric-label">FX</span>
              <strong>{String(conversionMeta.missingPairs.length > 0 ? 'missing' : fxMeta.status || 'ok').toUpperCase()}</strong>
            </div>
            <div>
              <span className="metric-label">{t('updated')}</span>
              <strong>{fxUpdatedAt}</strong>
            </div>
            <div>
              <span className="metric-label">{t('currency')}</span>
              <strong>{displayCurrency}</strong>
            </div>
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

  function MainNav({ t }) {
    const active = pageName();
    const links = [
      ['dashboard', 'dashboard.html', 'overview'],
      ['chart', 'chart.html', 'charts'],
      ['assets', 'assets.html', 'assets'],
      ['add_asset', 'add_asset.html', 'addAsset'],
      ['asset_types', 'asset_types.html', 'assetTypes'],
      ['settings', 'settings.html', 'settings'],
    ];
    return (
      <header className="topbar">
        <a className="brand" href="dashboard.html">Asset Manager</a>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(([key, href, labelKey]) => (
            <a key={key} className={active === key ? 'active' : ''} href={href}>
              {t(labelKey)}
            </a>
          ))}
        </nav>
      </header>
    );
  }

  function StatusFooter({ language }) {
    const t = (key) => translate(language, key);
    const [state, setState] = useState({ status: 'ok', updatedAt: '-' });

    useEffect(() => {
      (async () => {
        try {
          const rates = await window.api.getExchangeRates();
          const latest = (rates || [])
            .map((r) => r.updated_at)
            .filter(Boolean)
            .sort()
            .pop();
          setState({ status: (rates || []).length > 0 ? 'ok' : 'missing', updatedAt: formatDateOnly(latest) });
        } catch (err) {
          setState({ status: 'missing', updatedAt: '-' });
        }
      })();
    }, []);

    return (
      <footer className="status-footer">
        <span>© 2026 Asset Manager.</span>
        <span className={`fx-pill fx-${state.status}`}>
          FX Rate: {String(state.status).toUpperCase()}
        </span>
        <span>{t('updated')}: {state.updatedAt}</span>
      </footer>
    );
  }

  function AppShell({ children, language }) {
    const t = (key) => translate(language, key);
    return (
      <div className="app-shell">
        <MainNav t={t} />
        <main className="app-main">{children}</main>
        <StatusFooter language={language} />
      </div>
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
        amount: toNumber(editing.amount, 0),
        currency: editing.currency,
      });
      setEditing(null);
      refresh();
    }

    return (
      <div className="page-stack">
        <div className="page-header">
          <div>
            <h1>{t('assets')}</h1>
            <p className="page-subtitle">{t('dashboardSubtitle')}</p>
          </div>
          <a className="button-link" href="add_asset.html">{t('addAsset')}</a>
        </div>
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
              {t('amount')}{' '}
              <input
                id="editAmount"
                type="number"
                step="1"
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

        <div className="app-card table-scroll">
        <table>
          <thead>
            <tr>
              <th style={headerCellStyle}>{t('date')}</th>
              <th style={headerCellStyle}>{t('type')}</th>
              <th style={headerCellStyle}>{t('amount')}</th>
              <th style={headerCellStyle}>{t('currency')}</th>
              <th style={headerCellStyle}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody id="assetList">
            {pagedAssets.map((a) => (
              <tr key={a.id}>
                <td style={cellStyle}>{a.date || ''}</td>
                <td style={cellStyle}><span className="type-pill">{a.type || ''}</span></td>
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
        </div>
        <div className="pagination">
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

  function AssetTypesPage() {
    const [language] = useAppLanguage();
    const t = (key) => translate(language, key);
    const [types, setTypes] = useState([]);
    const [newName, setNewName] = useState('');
    const [newRegion, setNewRegion] = useState('');
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
      await window.api.addAssetType({ name: newName.trim(), region: newRegion.trim() });
      setNewName('');
      setNewRegion('');
      refresh();
    }

    async function updateType() {
      if (!editing || !editing.name.trim()) return;
      await window.api.modifyAssetType({
        id: Number(editing.id),
        name: editing.name.trim(),
        region: String(editing.region || '').trim(),
      });
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
      <div className="page-stack">
        <div className="page-header">
          <div>
            <h1>{t('assetTypesTitle')}</h1>
            <p className="page-subtitle">{t('assetTypesSubtitle')}</p>
          </div>
        </div>
        <form id="addTypeForm" onSubmit={addType}>
          <input
            id="typeName"
            placeholder={t('newTypeName')}
            required
            value={newName}
            onChange={(ev) => setNewName(ev.target.value)}
          />
          <input
            id="typeRegion"
            placeholder={t('newTypeRegion')}
            value={newRegion}
            onChange={(ev) => setNewRegion(ev.target.value)}
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
            <input
              id="editTypeRegion"
              placeholder={t('region')}
              value={editing.region || ''}
              onChange={(ev) => setEditing({ ...editing, region: ev.target.value })}
            />{' '}
            <button id="updateBtn" type="button" onClick={updateType}>
              {t('update')}
            </button>{' '}
            <button id="cancelBtn" type="button" onClick={() => setEditing(null)}>
              {t('cancel')}
            </button>
          </div>
        ) : null}

        <div className="app-card table-scroll">
          <table>
            <thead>
              <tr>
                <th style={headerCellStyle}>{t('id')}</th>
                <th style={headerCellStyle}>{t('name')}</th>
                <th style={headerCellStyle}>{t('region')}</th>
                <th style={headerCellStyle}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody id="typeList">
              {pagedTypes.map((tt) => (
                <tr key={tt.id}>
                  <td style={cellStyle}>{String(tt.id)}</td>
                  <td style={cellStyle}>{tt.name}</td>
                  <td style={cellStyle}>{tt.region || ''}</td>
                  <td style={cellStyle}>
                    <button style={actionBtnStyle} className="edit" onClick={() => setEditing({ id: tt.id, name: tt.name, region: tt.region || '' })}>
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
        </div>
        <div className="pagination">
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

  function App() {
    const p = useMemo(pageName, []);
    const [language] = useAppLanguage();
    let page = <DashboardPage />;
    if (p === 'assets') page = <AssetsPage />;
    if (p === 'add_asset') page = <AddAssetPage />;
    if (p === 'asset_types') page = <AssetTypesPage />;
    if (p === 'rebalance') page = <RebalancePage />;
    if (p === 'chart') page = <ChartPage />;
    if (p === 'settings') page = <SettingsPage />;
    return <AppShell language={language}>{page}</AppShell>;
  }

  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(<App />);
})();
