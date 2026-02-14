const { app, BrowserWindow, ipcMain } = require('electron');
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

app.whenReady().then(() => {
  assetService.init();
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
