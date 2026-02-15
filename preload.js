const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getAssets: () => ipcRenderer.invoke('getAssets'),
  getLatestAssets: () => ipcRenderer.invoke('getLatestAssets'),
  getConfig: () => ipcRenderer.invoke('getConfig'),
  addAsset: (asset) => ipcRenderer.invoke('addAsset', asset),
  deleteAsset: (id) => ipcRenderer.invoke('deleteAsset', id),
  modifyAsset: (asset) => ipcRenderer.invoke('modifyAsset', asset),
  getAssetTypes: () => ipcRenderer.invoke('getAssetTypes'),
  addAssetType: (name) => ipcRenderer.invoke('addAssetType', name),
  deleteAssetType: (id) => ipcRenderer.invoke('deleteAssetType', id),
  modifyAssetType: (id, name) => ipcRenderer.invoke('modifyAssetType', id, name),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  setSetting: (key, value) => ipcRenderer.invoke('setSetting', key, value),
  getExchangeRates: () => ipcRenderer.invoke('getExchangeRates'),
  upsertExchangeRate: (rate) => ipcRenderer.invoke('upsertExchangeRate', rate),
  exportDatabase: () => ipcRenderer.invoke('exportDatabase'),
  importDatabase: () => ipcRenderer.invoke('importDatabase'),
});
