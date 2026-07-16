INSERT OR IGNORE INTO settings (key, value) VALUES ('app.language', 'en-US');
INSERT OR IGNORE INTO settings (key, value) VALUES ('app.display_currency', 'USD');
INSERT OR IGNORE INTO settings (key, value) VALUES ('fx.cache_ttl_days', '90');

INSERT OR IGNORE INTO asset_types (name, region) VALUES ('美股', 'US');
INSERT OR IGNORE INTO asset_types (name, region) VALUES ('中国股票', 'China');
INSERT OR IGNORE INTO asset_types (name, region) VALUES ('现金人民币', 'China');

UPDATE asset_types
SET region = CASE name
  WHEN '美股' THEN 'US'
  WHEN '中国股票' THEN 'China'
  WHEN '现金人民币' THEN 'China'
  ELSE region
END
WHERE (region IS NULL OR region = '')
  AND name IN ('美股', '中国股票', '现金人民币');

INSERT INTO assets (date, type_id, name, amount, currency)
SELECT
  DATE('now'),
  at.id,
  NULL,
  10000,
  'CNY'
FROM asset_types at
WHERE at.name = '现金人民币'
  AND NOT EXISTS (SELECT 1 FROM assets);
