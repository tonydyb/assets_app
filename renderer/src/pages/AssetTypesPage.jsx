(function () {
  const AM = (window.AssetManager = window.AssetManager || {});
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    SUPPORTED_CURRENCIES, buildRateIndex, computeFxState, convertAmount, formatAmount,
    formatDateOnly, toNumber, translate, useAppLanguage
  } = AM;
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
  AM.AssetTypesPage = AssetTypesPage;
})();
