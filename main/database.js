const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const dbPath = path.join(__dirname, '..', 'data', 'assets.db');
let DB = null;
let db = null;

function ensureDbDir() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function init() {
  ensureDbDir();
  
  // Initialize sql.js
  DB = await initSqlJs();
  
  // Load or create database
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new DB.Database(fileBuffer);
  } else {
    db = new DB.Database();
  }

  // Create tables if they don't exist
  db.run(`
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
  `);

  // Seed default settings
  db.run(`
    INSERT OR IGNORE INTO settings (key, value) VALUES ('app.language', 'en-US');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('app.display_currency', 'USD');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('fx.cache_ttl_days', '90');
  `);

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Wrapper to provide sync-like interface for prepare/run
const dbWrapper = {
  prepare: (sql) => {
    return {
      run: (...params) => {
        try {
          db.run(sql, params);
          saveDb();
          const result = db.exec('SELECT last_insert_rowid() as id, changes() as changes');
          const info = result[0]?.values[0] || [null, null];
          return { lastID: info[0], changes: info[1] };
        } catch (err) {
          console.error('Error running:', sql, params, err);
          return { lastID: null, changes: 0 };
        }
      },
      all: (...params) => {
        try {
          let result;
          if (params.length > 0) {
            // Execute with parameters
            result = db.exec(sql, params);
          } else {
            // Execute without parameters
            result = db.exec(sql);
          }
          if (!result.length) return [];
          const rows = result[0].values.map(row => {
            const obj = {};
            result[0].columns.forEach((col, i) => {
              obj[col] = row[i];
            });
            return obj;
          });
          return rows;
        } catch (err) {
          console.error('Error executing:', sql, params, err);
          return [];
        }
      }
    };
  }
};

// For renderer process, return a promise-based init
let initPromise = null;

async function getDb() {
  if (!db) {
    if (!initPromise) {
      initPromise = init();
    }
    await initPromise;
  }
  return dbWrapper;
}

module.exports = { init: getDb, dbPath };
