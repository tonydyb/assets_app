const DatabaseModule = require('./database');

let db = null;

async function init() {
  db = await DatabaseModule.init();
}

function getAssets() {
  // include a.type_id so renderer can preselect the asset type when editing
  const stmt = db.prepare(`SELECT a.id, a.date, a.name, a.amount, a.currency, a.type_id, at.name as type FROM assets a LEFT JOIN asset_types at ON a.type_id = at.id ORDER BY date DESC`);
  return stmt.all();
}

function getLatestAssets() {
  // find latest date, then return assets for that date
  const dateStmt = db.prepare('SELECT date FROM assets ORDER BY date DESC LIMIT 1');
  const dateRow = dateStmt.all();
  const latestDate = dateRow && dateRow[0] && dateRow[0].date;
  if (!latestDate) return [];
  const stmt = db.prepare(`SELECT a.id, a.date, a.name, a.amount, a.currency, a.type_id, at.name as type FROM assets a LEFT JOIN asset_types at ON a.type_id = at.id WHERE a.date = ? ORDER BY a.id`);
  return stmt.all(latestDate);
}

function addAsset({ date, typeId, name, amount, currency }) {
  const stmt = db.prepare('INSERT INTO assets (date, type_id, name, amount, currency) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(date, typeId || null, name || '', amount || 0, currency || '');
  return { lastInsertRowid: info.lastID || info.lastInsertRowid };
}

function deleteAsset(id) {
  const stmt = db.prepare('DELETE FROM assets WHERE id = ?');
  const info = stmt.run(id);
  return { changes: info.changes };
}

function modifyAsset({ id, date, typeId, name, amount, currency }) {
  const stmt = db.prepare('UPDATE assets SET date = ?, type_id = ?, name = ?, amount = ?, currency = ? WHERE id = ?');
  const info = stmt.run(date, typeId || null, name || '', amount || 0, currency || '', id);
  return { changes: info.changes };
}

function getAssetTypes() {
  const stmt = db.prepare('SELECT id, name FROM asset_types ORDER BY id');
  return stmt.all();
}

function addAssetType(name) {
  const stmt = db.prepare('INSERT OR IGNORE INTO asset_types (name) VALUES (?)');
  const info = stmt.run(name);
  return { lastInsertRowid: info.lastID || info.lastInsertRowid };
}

function deleteAssetType(id) {
  // Check if any assets are using this type
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

function modifyAssetType(id, name) {
  const stmt = db.prepare('UPDATE asset_types SET name = ? WHERE id = ?');
  const info = stmt.run(name, id);
  return { changes: info.changes };
}

module.exports = { init, getAssets, getLatestAssets, addAsset, deleteAsset, modifyAsset, getAssetTypes, addAssetType, deleteAssetType, modifyAssetType };
