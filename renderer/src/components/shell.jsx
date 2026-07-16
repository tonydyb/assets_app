(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useState } = React;
  const { pageName, translate, formatDateOnly } = AM;
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
  AM.MainNav = MainNav;
  AM.StatusFooter = StatusFooter;
  AM.AppShell = AppShell;
})();
