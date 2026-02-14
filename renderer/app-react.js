(function () {
  const e = React.createElement;
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
    const [totalJPY, setTotalJPY] = useState(0);

    useEffect(() => {
      (async () => {
        const assets = await window.api.getLatestAssets();
        const cfg = window.api.getConfig ? await window.api.getConfig() : null;
        const JPY_PER_CNY = cfg && cfg.JPY_PER_CNY ? cfg.JPY_PER_CNY : (100 / 4.5);

        let total = 0;
        assets.forEach((a) => {
          const amount = toNumber(a.amount, 0);
          total += a.currency === 'CNY' ? amount * JPY_PER_CNY : amount;
        });

        setRows(assets.slice(0, 10));
        setTotalJPY(Math.round(total));
      })();
    }, []);

    return e('div', null,
      e('h1', null, 'Dashboard'),
      e('section', { className: 'total-section' },
        e('div', { className: 'total-row' },
          e('h2', null, 'Total Asset'),
          e('div', { id: 'totalAsset' }, `\u00a5${totalJPY.toLocaleString()} JPY`)
        )
      ),
      e('section', { className: 'nav-section' },
        e('h2', null, 'Navigation'),
        e('nav', null,
          e('a', { href: 'assets.html' }, 'View Assets'),
          e('a', { href: 'add_asset.html' }, 'Add Asset'),
          e('a', { href: 'chart.html' }, 'View Chart'),
          e('a', { href: 'asset_types.html' }, 'Asset Types')
        )
      ),
      e('section', null,
        e('h2', null, 'Recent Assets'),
        e('table', { id: 'recentAssets' },
          e('thead', null,
            e('tr', null,
              e('th', null, 'Date'),
              e('th', null, 'Type'),
              e('th', null, 'Name'),
              e('th', null, 'Amount'),
              e('th', null, 'Currency')
            )
          ),
          e('tbody', null,
            rows.map((r) => e('tr', { key: r.id || `${r.date}-${r.name}` },
              e('td', null, r.date || ''),
              e('td', null, r.type || ''),
              e('td', null, r.name || ''),
              e('td', null, String(r.amount || 0)),
              e('td', null, r.currency || '')
            ))
          )
        )
      )
    );
  }

  function AssetsPage() {
    const [assets, setAssets] = useState([]);
    const [types, setTypes] = useState([]);
    const [editing, setEditing] = useState(null);

    async function refresh() {
      const [a, t] = await Promise.all([
        window.api.getAssets(),
        window.api.getAssetTypes(),
      ]);
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
      try { sessionStorage.setItem('prefillAsset', JSON.stringify(pre)); } catch (err) {}
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

    return e('div', null,
      e('h1', null, 'Assets'),
      e('a', { href: 'add_asset.html' }, 'Add Asset'),
      ' ',
      e('a', { href: 'dashboard.html' }, 'Dashboard'),

      editing ? e('div', { id: 'editAssetForm', style: { margin: '20px 0', padding: '15px', border: '1px solid #ccc' } },
        e('h3', null, 'Edit Asset'),
        e('label', null, 'Date ', e('input', {
          id: 'editDate',
          type: 'date',
          required: true,
          value: editing.date,
          onChange: (ev) => setEditing({ ...editing, date: ev.target.value }),
        })),
        e('label', null, 'Type ', e('select', {
          id: 'editType',
          value: String(editing.typeId || ''),
          onChange: (ev) => setEditing({ ...editing, typeId: ev.target.value }),
        },
          e('option', { value: '' }, '-- Select Type --'),
          types.map((t) => e('option', { key: t.id, value: String(t.id) }, t.name))
        )),
        e('label', null, 'Name ', e('input', {
          id: 'editName',
          type: 'text',
          value: editing.name,
          onChange: (ev) => setEditing({ ...editing, name: ev.target.value }),
        })),
        e('label', null, 'Amount ', e('input', {
          id: 'editAmount',
          type: 'number',
          step: '0.01',
          value: editing.amount,
          onChange: (ev) => setEditing({ ...editing, amount: ev.target.value }),
        })),
        e('label', null, 'Currency ', e('select', {
          id: 'editCurrency',
          value: editing.currency,
          onChange: (ev) => setEditing({ ...editing, currency: ev.target.value }),
        },
          e('option', { value: 'JPY' }, 'JPY'),
          e('option', { value: 'CNY' }, 'CNY')
        )),
        e('button', { id: 'updateAssetBtn', type: 'button', onClick: onUpdate }, 'Update'),
        ' ',
        e('button', { id: 'cancelEditBtn', type: 'button', onClick: () => setEditing(null) }, 'Cancel')
      ) : null,

      e('table', null,
        e('thead', null,
          e('tr', null,
            e('th', null, 'Date'),
            e('th', null, 'Type'),
            e('th', null, 'Name'),
            e('th', null, 'Amount'),
            e('th', null, 'Currency'),
            e('th', null, 'Actions')
          )
        ),
        e('tbody', { id: 'assetList' },
          assets.map((a) => e('tr', { key: a.id },
            e('td', null, a.date || ''),
            e('td', null, a.type || ''),
            e('td', null, a.name || ''),
            e('td', null, String(a.amount || 0)),
            e('td', null, a.currency || ''),
            e('td', null,
              e('button', { className: 'dup', onClick: () => onDuplicate(a) }, 'Duplicate'),
              ' ',
              e('button', {
                className: 'edit',
                onClick: () => setEditing({
                  id: a.id,
                  date: a.date || '',
                  typeId: a.type_id || '',
                  name: a.name || '',
                  amount: a.amount || '',
                  currency: a.currency || 'JPY',
                }),
              }, 'Edit'),
              ' ',
              e('button', { className: 'del', onClick: () => onDelete(a.id) }, 'Delete')
            )
          ))
        )
      )
    );
  }

  function AddAssetPage() {
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({
      date: '',
      typeId: '',
      name: '',
      amount: '',
      currency: 'JPY',
    });

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

    return e('div', null,
      e('h1', null, 'Add Asset'),
      e('form', { id: 'addForm', onSubmit },
        e('label', null, 'Date ', e('input', {
          type: 'date', id: 'date', required: true, value: form.date,
          onChange: (ev) => setForm({ ...form, date: ev.target.value }),
        })),
        e('label', null, 'Type ', e('select', {
          id: 'type', value: form.typeId,
          onChange: (ev) => setForm({ ...form, typeId: ev.target.value }),
        },
          types.map((t) => e('option', { key: t.id, value: String(t.id) }, t.name))
        )),
        e('label', null, 'Name ', e('input', {
          id: 'name', type: 'text', value: form.name,
          onChange: (ev) => setForm({ ...form, name: ev.target.value }),
        })),
        e('label', null, 'Amount ', e('input', {
          id: 'amount', type: 'number', step: '0.01', value: form.amount,
          onChange: (ev) => setForm({ ...form, amount: ev.target.value }),
        })),
        e('label', null, 'Currency ', e('select', {
          id: 'currency', value: form.currency,
          onChange: (ev) => setForm({ ...form, currency: ev.target.value }),
        },
          e('option', { value: 'JPY' }, 'JPY'),
          e('option', { value: 'CNY' }, 'CNY')
        )),
        e('button', { type: 'submit' }, 'Save')
      ),
      e('a', { href: 'assets.html' }, 'Back')
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

    return e('div', null,
      e('h1', null, 'Asset Types'),
      e('form', { id: 'addTypeForm', onSubmit: addType },
        e('input', {
          id: 'typeName',
          placeholder: 'New type name',
          required: true,
          value: newName,
          onChange: (ev) => setNewName(ev.target.value),
        }),
        e('button', { type: 'submit' }, 'Add Type')
      ),

      editing ? e('div', { id: 'editTypeForm', style: { marginTop: '20px', padding: '10px', border: '1px solid #ccc' } },
        e('h3', null, 'Edit Asset Type'),
        e('input', {
          id: 'editTypeName',
          placeholder: 'Type name',
          required: true,
          value: editing.name,
          onChange: (ev) => setEditing({ ...editing, name: ev.target.value }),
        }),
        ' ',
        e('button', { id: 'updateBtn', type: 'button', onClick: updateType }, 'Update'),
        ' ',
        e('button', { id: 'cancelBtn', type: 'button', onClick: () => setEditing(null) }, 'Cancel')
      ) : null,

      e('a', { href: 'dashboard.html' }, 'Dashboard'),
      e('table', null,
        e('thead', null,
          e('tr', null,
            e('th', null, 'ID'),
            e('th', null, 'Name'),
            e('th', null, 'Actions')
          )
        ),
        e('tbody', { id: 'typeList' },
          types.map((t) => e('tr', { key: t.id },
            e('td', null, String(t.id)),
            e('td', null, t.name),
            e('td', null,
              e('button', { className: 'edit', onClick: () => setEditing({ id: t.id, name: t.name }) }, 'Edit'),
              ' ',
              e('button', { className: 'del', onClick: () => deleteType(t.id) }, 'Delete')
            )
          ))
        )
      )
    );
  }

  function ChartPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
      (async () => {
        const assets = await window.api.getAssets();
        const cfg = window.api.getConfig ? await window.api.getConfig() : null;
        const JPY_PER_CNY = cfg && cfg.JPY_PER_CNY ? cfg.JPY_PER_CNY : (100 / 4.5);

        const map = {};
        for (const a of assets) {
          const key = a.date;
          const amount = toNumber(a.amount, 0);
          const amountJPY = a.currency === 'CNY' ? amount * JPY_PER_CNY : amount;
          map[key] = (map[key] || 0) + amountJPY;
        }

        const labels = Object.keys(map).sort();
        const values = labels.map((k) => map[k]);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.clientWidth || 800;
        const h = canvas.height = 420;
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
        const gap = Math.max(8, Math.floor(chartW * 0.08 / (barCount || 1)));
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
        ctx.fillText('Amount (JPY)', 0, 0);
        ctx.restore();
      })();
    }, []);

    return e('div', null,
      e('h1', null, 'Asset Chart'),
      e('canvas', {
        id: 'chart',
        ref: canvasRef,
        width: 800,
        height: 400,
        style: { border: '1px solid #ddd', display: 'block', marginBottom: '8px', maxWidth: '100%' },
      }),
      e('div', { style: { width: '100%', textAlign: 'right', marginTop: '8px' } },
        e('a', { href: 'dashboard.html' }, 'Back')
      )
    );
  }

  function App() {
    const p = useMemo(pageName, []);
    if (p === 'assets') return e(AssetsPage);
    if (p === 'add_asset') return e(AddAssetPage);
    if (p === 'asset_types') return e(AssetTypesPage);
    if (p === 'chart') return e(ChartPage);
    return e(DashboardPage);
  }

  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(e(App));
})();
