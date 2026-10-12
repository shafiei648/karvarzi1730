// Electron Main Process for Windows (.exe)
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    title: 'سامانه صدور مجوز کارورزی فرهنگیان',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // If running in development or build
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(indexPath).catch(() => {
    win.loadURL('http://localhost:3000');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
