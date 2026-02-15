const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

let DB = null;
let db = null;
let resolvedDbPath = null;
const migrationsDir = path.join(__dirname, 'migrations');

function resolveDbPath() {
  if (resolvedDbPath) return resolvedDbPath;

  const devDbPath = path.join(__dirname, '..', 'data', 'assets.db');

  try {
    const { app } = require('electron');
    if (app && app.isPackaged) {
      resolvedDbPath = path.join(app.getPath('userData'), 'assets.db');
      return resolvedDbPath;
    }
  } catch (err) {
    // Fallback to dev path when Electron app context is unavailable.
  }

  resolvedDbPath = devDbPath;
  return resolvedDbPath;
}

function ensureDbDir() {
  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) return [];

  return fs
    .readdirSync(migrationsDir)
    .map((file) => {
      const match = /^(\d+)_.*\.sql$/i.exec(file);
      if (!match) return null;
      return {
        version: Number(match[1]),
        fileName: file,
        filePath: path.join(migrationsDir, file),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.version - b.version);
}

function getUserVersion() {
  const result = db.exec('PRAGMA user_version');
  if (!result.length || !result[0].values.length) return 0;
  return Number(result[0].values[0][0] || 0);
}

function setUserVersion(version) {
  db.run(`PRAGMA user_version = ${Number(version)}`);
}

function backupDatabase(fromVersion, toVersion) {
  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) return null;

  const backupDir = path.join(path.dirname(dbPath), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(
    backupDir,
    `assets.v${fromVersion}-to-v${toVersion}.${timestamp}.db`
  );
  fs.copyFileSync(dbPath, backupPath);
  return backupPath;
}

function backupCurrentDatabase(tag) {
  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) return null;

  const backupDir = path.join(path.dirname(dbPath), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const safeTag = String(tag || 'manual').replace(/[^a-zA-Z0-9_-]/g, '-');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `assets.${safeTag}.${timestamp}.db`);
  fs.copyFileSync(dbPath, backupPath);
  return backupPath;
}

function runMigrations() {
  const migrationFiles = getMigrationFiles();
  if (!migrationFiles.length) return;

  const currentVersion = getUserVersion();
  const targetVersion = migrationFiles[migrationFiles.length - 1].version;
  if (currentVersion >= targetVersion) return;

  const pending = migrationFiles.filter((m) => m.version > currentVersion);
  const backupPath = backupDatabase(currentVersion, targetVersion);
  if (backupPath) {
    console.info(`[db] backup created: ${backupPath}`);
  }

  for (const migration of pending) {
    const sql = fs.readFileSync(migration.filePath, 'utf8');
    try {
      db.run('BEGIN');
      db.run(sql);
      setUserVersion(migration.version);
      db.run('COMMIT');
      console.info(`[db] migration applied: ${migration.fileName}`);
    } catch (err) {
      try {
        db.run('ROLLBACK');
      } catch (rollbackErr) {
        console.error('[db] rollback failed:', rollbackErr);
      }
      throw new Error(`Migration failed (${migration.fileName}): ${err.message}`);
    }
  }
}

async function init() {
  ensureDbDir();
  const dbPath = resolveDbPath();
  
  // Initialize sql.js
  DB = await initSqlJs();
  
  // Load or create database
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new DB.Database(fileBuffer);
  } else {
    db = new DB.Database();
  }

  runMigrations();

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const dbPath = resolveDbPath();
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function validateDatabaseFile(filePath) {
  if (!DB) throw new Error('Database engine is not initialized');
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Import file does not exist');
  }

  const fileBuffer = fs.readFileSync(filePath);
  const tempDb = new DB.Database(fileBuffer);
  try {
    const integrity = tempDb.exec('PRAGMA integrity_check');
    const integrityValue =
      integrity && integrity[0] && integrity[0].values && integrity[0].values[0]
        ? String(integrity[0].values[0][0] || '')
        : '';
    if (integrityValue.toLowerCase() !== 'ok') {
      throw new Error('Invalid database file: integrity check failed');
    }

    const tableRes = tempDb.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const names = new Set(
      (tableRes && tableRes[0] && tableRes[0].values ? tableRes[0].values : []).map((r) => String(r[0]))
    );
    const requiredTables = ['asset_types', 'assets', 'settings', 'exchange_rates'];
    const missingTables = requiredTables.filter((t) => !names.has(t));
    if (missingTables.length > 0) {
      throw new Error(`Invalid database file: missing tables (${missingTables.join(', ')})`);
    }
  } finally {
    if (tempDb && typeof tempDb.close === 'function') tempDb.close();
  }
}

function exportDatabase(filePath) {
  if (!db) throw new Error('Database is not initialized');
  if (!filePath) throw new Error('Export path is required');

  saveDb();
  fs.copyFileSync(resolveDbPath(), filePath);
  return { path: filePath };
}

function importDatabase(filePath) {
  if (!db) throw new Error('Database is not initialized');
  if (!filePath) throw new Error('Import path is required');

  validateDatabaseFile(filePath);
  saveDb();
  const backupPath = backupCurrentDatabase('pre-import');
  const dbPath = resolveDbPath();

  if (db && typeof db.close === 'function') {
    try {
      db.close();
    } catch (err) {
      console.warn('[db] close old db failed:', err);
    }
  }

  fs.copyFileSync(filePath, dbPath);
  db = new DB.Database(fs.readFileSync(dbPath));
  runMigrations();
  saveDb();
  return { dbPath, backupPath };
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

module.exports = { init: getDb, getDbPath: resolveDbPath };
Object.defineProperty(module.exports, 'dbPath', {
  enumerable: true,
  get: resolveDbPath,
});
module.exports.exportDatabase = exportDatabase;
module.exports.importDatabase = importDatabase;
module.exports.validateDatabaseFile = validateDatabaseFile;
module.exports.backupCurrentDatabase = backupCurrentDatabase;
