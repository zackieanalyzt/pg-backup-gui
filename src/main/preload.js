const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire API
contextBridge.exposeInMainWorld('api', {
  testConnection: (connectionData) => ipcRenderer.invoke('test-connection', connectionData)
});