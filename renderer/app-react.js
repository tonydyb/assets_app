/*
  JSX source version.
  Runtime pages currently load app-react.runtime.js.
*/
(function () {
  const { useEffect, useMemo, useRef, useState } = React;

  function pageName() {
    const p = window.location.pathname.split('/').pop();
    if (p === 'dashboard.html') return 'dashboard';
    if (p === 'assets.html') return 'assets';
    if (p === 'add_asset.html') return 'add_asset';
    if (p === 'asset_types.html') return 'asset_types';
    if (p === 'chart.html') return 'chart';
    return 'dashboard';
  }

  function toNumber(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function DashboardPage() {
    const [rows, setRows] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [displayCurrency, setDisplayCurrency] = useState('JPY');

    useEffect(() => {
      (async () => {
        const assets = await window.api.getLatestAssets();
        const cfg = window.api.getConfig ? await window.api.getConfig() : null;
        const JPY_PER_CNY = cfg && cfg.JPY_PER_CNY ? cfg.JPY_PER_CNY : (100 / 4.5);
        const DISPLAY_CURRENCY =
          cfg && cfg.TOTAL_ASSET_DISPLAY_CURRENCY
            ? String(cfg.TOTAL_ASSET_DISPLAY_CURRENCY).toUpperCase()
            : 'JPY';

        let total = 0;
        assets.forEach((a) => {
          const amount = toNumber(a.amount, 0);
          if (DISPLAY_CURRENCY === 'CNY') {
            total += a.currency === 'JPY' ? amount / JPY_PER_CNY : amount;
          } else {
            total += a.currency === 'CNY' ? amount * JPY_PER_CNY : amount;
          }
        });

        setRows(assets.slice(0, 10));
        setDisplayCurrency(DISPLAY_CURRENCY === 'CNY' ? 'CNY' : 'JPY');
        setTotalAmount(Math.round(total));
      })();
    }, []);

    return (
      <div>
        <h1>Dashboard</h1>
        <section className="total-section">
          <div className="total-row">
            <h2>Total Asset</h2>
            <div id="totalAsset">{`¥${totalAmount.toLocaleString()} ${displayCurrency}`}</div>
          </div>
        </section>

        <section className="nav-section">
          <h2>Navigation</h2>
          <nav>
            <a href="assets.html">View Assets</a>
            <a href="add_asset.html">Add Asset</a>
            <a href="chart.html">View Chart</a>
            <a href="asset_types.html">Asset Types</a>
          </nav>
        </section>

        <section>
          <h2>Recent Assets</h2>
          <table id="recentAssets">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Currency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id || `${r.date}-${r.name}`}>
                  <td>{r.date || ''}</td>
                  <td>{r.type || ''}</td>
                  <td>{r.name || ''}</td>
                  <td>{String(r.amount || 0)}</td>
                  <td>{r.currency || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  function AssetsPage() {
    const [assets, setAssets] = useState([]);
    const [types, setTypes] = useState([]);
    const [editing, setEditing] = useState(null);

    async function refresh() {
      const [a, t] = await Promise.all([window.api.getAssets(), window.api.getAssetTypes()]);
      setAssets(a);
      setTypes(t);
    }

    useEffect(() => {
      refresh();
    }, []);

    async function onDelete(id) {
      await window.api.deleteAsset(Number(id));
      refresh();
    }

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
        <h1>Assets</h1>
        <a href="add_asset.html">Add Asset</a> <a href="dashboard.html">Dashboard</a>

        {editing ? (
          <div id="editAssetForm" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc' }}>
            <h3>Edit Asset</h3>
            <label>
              Date{' '}
              <input
                id="editDate"
                type="date"
                required
                value={editing.date}
                onChange={(ev) => setEditing({ ...editing, date: ev.target.value })}
              />
            </label>
            <label>
              Type{' '}
              <select
                id="editType"
                value={String(editing.typeId || '')}
                onChange={(ev) => setEditing({ ...editing, typeId: ev.target.value })}
              >
                <option value="">-- Select Type --</option>
                {types.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Name{' '}
              <input
                id="editName"
                type="text"
                value={editing.name}
                onChange={(ev) => setEditing({ ...editing, name: ev.target.value })}
              />
            </label>
            <label>
              Amount{' '}
              <input
                id="editAmount"
                type="number"
                step="0.01"
                value={editing.amount}
                onChange={(ev) => setEditing({ ...editing, amount: ev.target.value })}
              />
            </label>
            <label>
              Currency{' '}
              <select
                id="editCurrency"
                value={editing.currency}
                onChange={(ev) => setEditing({ ...editing, currency: ev.target.value })}
              >
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
              </select>
            </label>
            <button id="updateAssetBtn" type="button" onClick={onUpdate}>
              Update
            </button>{' '}
            <button id="cancelEditBtn" type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        ) : null}

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="assetList">
            {assets.map((a) => (
              <tr key={a.id}>
                <td>{a.date || ''}</td>
                <td>{a.type || ''}</td>
                <td>{a.name || ''}</td>
                <td>{String(a.amount || 0)}</td>
                <td>{a.currency || ''}</td>
                <td>
                  <button className="dup" onClick={() => onDuplicate(a)}>
                    Duplicate
                  </button>{' '}
                  <button
                    className="edit"
                    onClick={() =>
                      setEditing({
                        id: a.id,
                        date: a.date || '',
                        typeId: a.type_id || '',
                        name: a.name || '',
                        amount: a.amount || '',
                        currency: a.currency || 'JPY',
                      })
                    }
                  >
                    Edit
                  </button>{' '}
                  <button className="del" onClick={() => onDelete(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function AddAssetPage() {
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({ date: '', typeId: '', name: '', amount: '', currency: 'JPY' });

    useEffect(() => {
      (async () => {
        const t = await window.api.getAssetTypes();
        setTypes(t);
        const first = t[0] ? String(t[0].id) : '';

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
              currency: p.currency || 'JPY',
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
        <h1>Add Asset</h1>
        <form id="addForm" onSubmit={onSubmit}>
          <label>
            Date{' '}
            <input
              type="date"
              id="date"
              required
              value={form.date}
              onChange={(ev) => setForm({ ...form, date: ev.target.value })}
            />
          </label>
          <label>
            Type{' '}
            <select
              id="type"
              value={form.typeId}
              onChange={(ev) => setForm({ ...form, typeId: ev.target.value })}
            >
              {types.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name{' '}
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(ev) => setForm({ ...form, name: ev.target.value })}
            />
          </label>
          <label>
            Amount{' '}
            <input
              id="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(ev) => setForm({ ...form, amount: ev.target.value })}
            />
          </label>
          <label>
            Currency{' '}
            <select
              id="currency"
              value={form.currency}
              onChange={(ev) => setForm({ ...form, currency: ev.target.value })}
            >
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
            </select>
          </label>
          <button type="submit">Save</button>
        </form>
        <a href="assets.html">Back</a>
      </div>
    );
  }

  function AssetTypesPage() {
    const [types, setTypes] = useState([]);
    const [newName, setNewName] = useState('');
    const [editing, setEditing] = useState(null);

    async function refresh() {
      const t = await window.api.getAssetTypes();
      setTypes(t);
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
      if (!window.confirm('Are you sure you want to delete this asset type?')) return;
      const result = await window.api.deleteAssetType(Number(id));
      if (result && result.error) {
        window.alert(result.error);
        return;
      }
      refresh();
    }

    return (
      <div>
        <h1>Asset Types</h1>
        <form id="addTypeForm" onSubmit={addType}>
          <input
            id="typeName"
            placeholder="New type name"
            required
            value={newName}
            onChange={(ev) => setNewName(ev.target.value)}
          />
          <button type="submit">Add Type</button>
        </form>

        {editing ? (
          <div id="editTypeForm" style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>Edit Asset Type</h3>
            <input
              id="editTypeName"
              placeholder="Type name"
              required
              value={editing.name}
              onChange={(ev) => setEditing({ ...editing, name: ev.target.value })}
            />{' '}
            <button id="updateBtn" type="button" onClick={updateType}>
              Update
            </button>{' '}
            <button id="cancelBtn" type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        ) : null}

        <a href="dashboard.html">Dashboard</a>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="typeList">
            {types.map((t) => (
              <tr key={t.id}>
                <td>{String(t.id)}</td>
                <td>{t.name}</td>
                <td>
                  <button className="edit" onClick={() => setEditing({ id: t.id, name: t.name })}>
                    Edit
                  </button>{' '}
                  <button className="del" onClick={() => deleteType(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function ChartPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
      (async () => {
        const assets = await window.api.getAssets();
        const cfg = window.api.getConfig ? await window.api.getConfig() : null;
        const JPY_PER_CNY = cfg && cfg.JPY_PER_CNY ? cfg.JPY_PER_CNY : (100 / 4.5);
        const DISPLAY_CURRENCY =
          cfg && cfg.TOTAL_ASSET_DISPLAY_CURRENCY
            ? String(cfg.TOTAL_ASSET_DISPLAY_CURRENCY).toUpperCase()
            : 'JPY';

        const map = {};
        for (const a of assets) {
          const key = a.date;
          const amount = toNumber(a.amount, 0);
          let amountInDisplayCurrency = 0;
          if (DISPLAY_CURRENCY === 'CNY') {
            amountInDisplayCurrency = a.currency === 'JPY' ? amount / JPY_PER_CNY : amount;
          } else {
            amountInDisplayCurrency = a.currency === 'CNY' ? amount * JPY_PER_CNY : amount;
          }
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
        ctx.fillText('Asset Chart', w / 2, 32);

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
        ctx.fillText(`Amount (${DISPLAY_CURRENCY === 'CNY' ? 'CNY' : 'JPY'})`, 0, 0);
        ctx.restore();
      })();
    }, []);

    return (
      <div>
        <h1>Asset Chart</h1>
        <canvas
          id="chart"
          ref={canvasRef}
          width={800}
          height={400}
          style={{ border: '1px solid #ddd', display: 'block', marginBottom: '8px', maxWidth: '100%' }}
        />
        <div style={{ width: '100%', textAlign: 'right', marginTop: '8px' }}>
          <a href="dashboard.html">Back</a>
        </div>
      </div>
    );
  }

  function App() {
    const p = useMemo(pageName, []);
    if (p === 'assets') return <AssetsPage />;
    if (p === 'add_asset') return <AddAssetPage />;
    if (p === 'asset_types') return <AssetTypesPage />;
    if (p === 'chart') return <ChartPage />;
    return <DashboardPage />;
  }

  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(<App />);
})();
