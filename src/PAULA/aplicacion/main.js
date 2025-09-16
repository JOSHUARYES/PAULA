const { Console } = require('console');
const { app, screen, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { CONFIG } = require(path.join(__dirname, 'config.js'));

function createWindow(dir, ancho, alto) {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: ancho,
    height: alto,
    webPreferences: {
      preload: CONFIG.rutas.preload
    }
  });
  win.loadFile(dir);
  win.webContents.openDevTools()
}

app.whenReady().then(
  () => {
    const pantalla = screen.getPrimaryDisplay();
    CONFIG.ventana.ancho = pantalla.workAreaSize.width/2;
    CONFIG.ventana.alto = pantalla.workAreaSize.height/2;
    CONFIG.dirname = path.dirname(__dirname);
    CONFIG.rutas.preload = path.join(CONFIG.dirname, CONFIG.rutas.preload);
    CONFIG.rutas.Index = path.join(CONFIG.dirname, CONFIG.rutas.Index);
    createWindow(CONFIG.rutas.Index, CONFIG.ventana.ancho, CONFIG.ventana.alto);
  }

);
//app.whenReady().then(createWindow);