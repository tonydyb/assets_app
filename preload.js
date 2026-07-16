const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getAssets: () => ipcRenderer.invoke('getAssets'),
  getLatestAssets: () => ipcRenderer.invoke('getLatestAssets'),
  getConfig: () => ipcRenderer.invoke('getConfig'),
  addAsset: (asset) => ipcRenderer.invoke('addAsset', asset),
  deleteAsset: (id) => ipcRenderer.invoke('deleteAsset', id),
  modifyAsset: (asset) => ipcRenderer.invoke('modifyAsset', asset),
  getRebalanceTemplate: () => ipcRenderer.invoke('getRebalanceTemplate'),
  saveRebalance: (payload) => ipcRenderer.invoke('saveRebalance', payload),
  getAssetTypes: () => ipcRenderer.invoke('getAssetTypes'),
  addAssetType: (payload, region) => ipcRenderer.invoke('addAssetType', payload, region),
  deleteAssetType: (id) => ipcRenderer.invoke('deleteAssetType', id),
  modifyAssetType: (payload, name, region) => ipcRenderer.invoke('modifyAssetType', payload, name, region),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  setSetting: (key, value) => ipcRenderer.invoke('setSetting', key, value),
  getExchangeRates: () => ipcRenderer.invoke('getExchangeRates'),
  upsertExchangeRate: (rate) => ipcRenderer.invoke('upsertExchangeRate', rate),
  exportDatabase: () => ipcRenderer.invoke('exportDatabase'),
  importDatabase: () => ipcRenderer.invoke('importDatabase'),
});
