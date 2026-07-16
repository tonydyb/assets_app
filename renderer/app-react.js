(function () {
  const AM = window.AssetManager || {};
  const { useMemo } = React;
  const { pageName, useAppLanguage, AppShell } = AM;

  function App() {
    const p = useMemo(pageName, []);
    const [language] = useAppLanguage();
    let page = <AM.DashboardPage />;
    if (p === 'assets') page = <AM.AssetsPage />;
    if (p === 'add_asset') page = <AM.AddAssetPage />;
    if (p === 'asset_types') page = <AM.AssetTypesPage />;
    if (p === 'rebalance') page = <AM.RebalancePage />;
    if (p === 'chart') page = <AM.ChartPage />;
    if (p === 'settings') page = <AM.SettingsPage />;
    return <AppShell language={language}>{page}</AppShell>;
  }

  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(<App />);
})();
