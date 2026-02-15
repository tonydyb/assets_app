const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const assetService = require('./main/assetService');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'dashboard.html'));
}

app.whenReady().then(async () => {
  try {
    await assetService.init();
  } catch (err) {
    console.error('Failed to initialize app database:', err);
    app.quit();
    return;
  }

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('getAssets', async () => {
  return assetService.getAssets();
});

ipcMain.handle('getLatestAssets', async () => {
  return assetService.getLatestAssets();
});

ipcMain.handle('getConfig', async () => {
  return require('./main/config');
});

ipcMain.handle('addAsset', async (event, asset) => {
  return assetService.addAsset(asset);
});

ipcMain.handle('deleteAsset', async (event, id) => {
  return assetService.deleteAsset(id);
});

ipcMain.handle('modifyAsset', async (event, asset) => {
  return assetService.modifyAsset(asset);
});

ipcMain.handle('getAssetTypes', async () => {
  return assetService.getAssetTypes();
});

ipcMain.handle('addAssetType', async (event, name) => {
  return assetService.addAssetType(name);
});

ipcMain.handle('deleteAssetType', async (event, id) => {
  return assetService.deleteAssetType(id);
});

ipcMain.handle('modifyAssetType', async (event, id, name) => {
  return assetService.modifyAssetType(id, name);
});

ipcMain.handle('getSettings', async () => {
  return assetService.getSettings();
});

ipcMain.handle('setSetting', async (event, key, value) => {
  return assetService.setSetting(key, value);
});

ipcMain.handle('getExchangeRates', async () => {
  return assetService.getExchangeRates();
});

ipcMain.handle('upsertExchangeRate', async (event, rate) => {
  return assetService.upsertExchangeRate(rate);
});

ipcMain.handle('exportDatabase', async () => {
  try {
    const defaultName = `assets-export-${new Date().toISOString().slice(0, 10)}.db`;
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Export Database',
      defaultPath: path.join(app.getPath('documents'), defaultName),
      filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    });
    if (canceled || !filePath) return { canceled: true };
    const result = assetService.exportDatabase(filePath);
    return { success: true, path: result.path };
  } catch (err) {
    return { success: false, error: err.message || 'Export failed' };
  }
});

ipcMain.handle('importDatabase', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Import Database',
      properties: ['openFile'],
      filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    });
    if (canceled || !filePaths || filePaths.length === 0) return { canceled: true };

    const result = assetService.importDatabase(filePaths[0]);
    setTimeout(() => {
      app.relaunch();
      app.exit(0);
    }, 300);
    return { success: true, willRestart: true, backupPath: result.backupPath || '' };
  } catch (err) {
    return { success: false, error: err.message || 'Import failed' };
  }
});
