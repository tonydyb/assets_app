const DatabaseModule = require('./database');

let db = null;
const SUPPORTED_CURRENCIES = new Set(['JPY', 'CNY', 'USD']);

async function init() {
  db = await DatabaseModule.init();
}

function exportDatabase(filePath) {
  return DatabaseModule.exportDatabase(filePath);
}

function importDatabase(filePath) {
  return DatabaseModule.importDatabase(filePath);
}

function localToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function normalizeCurrency(currency) {
  const value = String(currency || '').toUpperCase();
  return SUPPORTED_CURRENCIES.has(value) ? value : '';
}

function normalizeAssetTypeInput(input, region) {
  if (input && typeof input === 'object') {
    return {
      id: input.id,
      name: String(input.name || '').trim(),
      region: String(input.region || '').trim(),
    };
  }
  return {
    id: input,
    name: String(input || '').trim(),
    region: String(region || '').trim(),
  };
}

function getAssets() {
  const stmt = db.prepare(`
    SELECT
      a.id,
      a.date,
      a.name,
      a.amount,
      a.currency,
      a.type_id,
      at.name AS type,
      at.region AS region
    FROM assets a
    LEFT JOIN asset_types at ON a.type_id = at.id
    ORDER BY a.date DESC, a.id DESC
  `);
  return stmt.all();
}

function getLatestAssets() {
  const dateStmt = db.prepare('SELECT MAX(date) AS date FROM assets');
  const dateRow = dateStmt.all();
  const latestDate = dateRow && dateRow[0] && dateRow[0].date;
  if (!latestDate) return [];
  const stmt = db.prepare(`
    SELECT
      a.id,
      a.date,
      a.name,
      a.amount,
      a.currency,
      a.type_id,
      at.name AS type,
      at.region AS region
    FROM assets a
    LEFT JOIN asset_types at ON a.type_id = at.id
    WHERE a.date = ?
    ORDER BY a.id
  `);
  return stmt.all(latestDate);
}

function addAsset({ date, typeId, amount, currency }) {
  const stmt = db.prepare('INSERT INTO assets (date, type_id, name, amount, currency) VALUES (?, ?, NULL, ?, ?)');
  const info = stmt.run(date, typeId || null, amount || 0, normalizeCurrency(currency));
  return { lastInsertRowid: info.lastID || info.lastInsertRowid };
}

function deleteAsset(id) {
  const stmt = db.prepare('DELETE FROM assets WHERE id = ?');
  const info = stmt.run(id);
  return { changes: info.changes };
}

function modifyAsset({ id, date, typeId, amount, currency }) {
  const stmt = db.prepare('UPDATE assets SET date = ?, type_id = ?, amount = ?, currency = ? WHERE id = ?');
  const info = stmt.run(date, typeId || null, amount || 0, normalizeCurrency(currency), id);
  return { changes: info.changes };
}

function getRebalanceTemplate() {
  const latestAssets = getLatestAssets();
  return {
    sourceDate: latestAssets[0] ? latestAssets[0].date : '',
    rebalanceDate: localToday(),
    items: latestAssets.map((asset) => ({
      sourceAssetId: asset.id,
      typeId: asset.type_id,
      type: asset.type || '',
      region: asset.region || '',
      amount: asset.amount || 0,
      currency: asset.currency || '',
    })),
  };
}

function saveRebalance({ date, items }) {
  const snapshotDate = String(date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) {
    return { success: false, error: 'Invalid rebalance date' };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'No rebalance assets to save' };
  }

  const normalizedItems = [];
  for (const item of items) {
    const amount = Number(item.amount);
    const currency = normalizeCurrency(item.currency);
    const typeId = Number(item.typeId);
    if (!Number.isFinite(typeId) || typeId <= 0) {
      return { success: false, error: 'Invalid asset type in rebalance data' };
    }
    if (!Number.isFinite(amount) || amount < 0) {
      return { success: false, error: 'Invalid amount in rebalance data' };
    }
    if (!currency) {
      return { success: false, error: 'Invalid currency in rebalance data' };
    }
    normalizedItems.push({ typeId, amount: Math.round(amount), currency });
  }

  const stmt = db.prepare('INSERT INTO assets (date, type_id, name, amount, currency) VALUES (?, ?, NULL, ?, ?)');
  let insertedCount = 0;
  for (const item of normalizedItems) {
    stmt.run(snapshotDate, item.typeId, item.amount, item.currency);
    insertedCount += 1;
  }

  return { success: true, date: snapshotDate, insertedCount };
}

function getSettings() {
  const stmt = db.prepare('SELECT key, value FROM settings');
  const rows = stmt.all();
  const map = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });
  return map;
}

function setSetting(key, value) {
  const stmt = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP
  `);
  const info = stmt.run(key, String(value ?? ''));
  return { changes: info.changes };
}

function getExchangeRates() {
  const stmt = db.prepare(`
    SELECT id, base_currency, quote_currency, rate, source, updated_at
    FROM exchange_rates
    ORDER BY base_currency, quote_currency
  `);
  return stmt.all();
}

function upsertExchangeRate({ baseCurrency, quoteCurrency, rate }) {
  const base = String(baseCurrency || '').toUpperCase();
  const quote = String(quoteCurrency || '').toUpperCase();
  const numericRate = Number(rate);

  if (!SUPPORTED_CURRENCIES.has(base) || !SUPPORTED_CURRENCIES.has(quote)) {
    return { error: '仅支持 JPY/CNY/USD 汇率配置' };
  }
  if (base === quote) {
    return { error: 'base currency 和 quote currency 不能相同' };
  }
  if (!Number.isFinite(numericRate) || numericRate <= 0) {
    return { error: '汇率必须为大于 0 的数字' };
  }

  const stmt = db.prepare(`
    INSERT INTO exchange_rates (base_currency, quote_currency, rate, source, updated_at)
    VALUES (?, ?, ?, 'manual', CURRENT_TIMESTAMP)
    ON CONFLICT(base_currency, quote_currency) DO UPDATE SET
      rate = excluded.rate,
      source = 'manual',
      updated_at = CURRENT_TIMESTAMP
  `);
  const info = stmt.run(base, quote, numericRate);
  return { success: true, changes: info.changes };
}

function getAssetTypes() {
  const stmt = db.prepare('SELECT id, name, region FROM asset_types ORDER BY id');
  return stmt.all();
}

function addAssetType(input, region) {
  const payload = normalizeAssetTypeInput(input, region);
  if (!payload.name) return { error: 'Asset type name is required' };
  const stmt = db.prepare('INSERT OR IGNORE INTO asset_types (name, region) VALUES (?, ?)');
  const info = stmt.run(payload.name, payload.region || null);
  return { lastInsertRowid: info.lastID || info.lastInsertRowid, changes: info.changes };
}

function deleteAssetType(id) {
  const checkStmt = db.prepare('SELECT COUNT(*) as count FROM assets WHERE type_id = ?');
  const checkResult = checkStmt.all(id);
  const usageCount = checkResult[0]?.count || 0;

  if (usageCount > 0) {
    return { error: `无法删除：该资产类型正在被 ${usageCount} 个资产使用` };
  }

  const stmt = db.prepare('DELETE FROM asset_types WHERE id = ?');
  const info = stmt.run(id);
  return { success: true, changes: info.changes };
}

function modifyAssetType(input, name, region) {
  const payload = input && typeof input === 'object'
    ? normalizeAssetTypeInput(input)
    : { id: input, name: String(name || '').trim(), region: String(region || '').trim() };
  if (!payload.id || !payload.name) return { error: 'Asset type id and name are required' };
  const stmt = db.prepare('UPDATE asset_types SET name = ?, region = ? WHERE id = ?');
  const info = stmt.run(payload.name, payload.region || null, payload.id);
  return { changes: info.changes };
}

module.exports = {
  init,
  exportDatabase,
  importDatabase,
  getAssets,
  getLatestAssets,
  getRebalanceTemplate,
  saveRebalance,
  addAsset,
  deleteAsset,
  modifyAsset,
  getAssetTypes,
  addAssetType,
  deleteAssetType,
  modifyAssetType,
  getSettings,
  setSetting,
  getExchangeRates,
  upsertExchangeRate,
};
