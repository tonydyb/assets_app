CREATE TABLE IF NOT EXISTS asset_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  type_id INTEGER,
  name TEXT,
  amount REAL DEFAULT 0,
  currency TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(type_id) REFERENCES asset_types(id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exchange_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  rate REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(base_currency, quote_currency)
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('app.language', 'en-US');
INSERT OR IGNORE INTO settings (key, value) VALUES ('app.display_currency', 'USD');
INSERT OR IGNORE INTO settings (key, value) VALUES ('fx.cache_ttl_days', '90');

INSERT OR IGNORE INTO asset_types (name) VALUES ('美股');
INSERT OR IGNORE INTO asset_types (name) VALUES ('中国股票');
INSERT OR IGNORE INTO asset_types (name) VALUES ('现金人民币');

INSERT INTO assets (date, type_id, name, amount, currency)
SELECT
  DATE('now'),
  at.id,
  '现金人民币',
  10000,
  'CNY'
FROM asset_types at
WHERE at.name = '现金人民币'
  AND NOT EXISTS (SELECT 1 FROM assets);
