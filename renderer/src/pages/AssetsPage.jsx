(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, computeFxState, convertAmount, formatAmount,
    formatDateOnly, toNumber, translate, useAppLanguage
  } = AM;
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
  AM.AssetsPage = AssetsPage;
})();
