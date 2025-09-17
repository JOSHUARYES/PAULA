const { Console } = require('console');
const { app, screen, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { CONFIG } = require(path.join(__dirname, 'config.js'));
const bcrypt = require('bcrypt');
require('dotenv').config();
const APP_PASSWORD = process.env.APP_PASSWORD;
const { consolidarExcels } = require(path.join(__dirname, 'modulos', 'consolidaExcel.js'));
const { dialog } = require('electron');
var filePaths;

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
    CONFIG.ventana.ancho = pantalla.workAreaSize.width / 2;
    CONFIG.ventana.alto = pantalla.workAreaSize.height / 2;
    CONFIG.dirname = path.dirname(__dirname);
    CONFIG.rutas.preload = path.join(CONFIG.dirname, CONFIG.rutas.preload);
    CONFIG.rutas.Index = path.join(CONFIG.dirname, CONFIG.rutas.Index);
    createWindow(CONFIG.rutas.Index, CONFIG.ventana.ancho, CONFIG.ventana.alto);
  }

);

// Abrir diálogo de archivos
ipcMain.on('abrir-archivos', async (event) => {
  console.log("Abriendo diálogo de archivos");
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }]
  });
  filePaths = result.filePaths;
  fileNames = filePaths.map(file => path.basename(file));
  console.log("Archivos seleccionados:", filePaths);
  console.log("Nombres de archivos: ", fileNames);
  if (filePaths.length > 0) {
    event.reply('abrir-archivos-reply', { msg: 'success', package: fileNames });
  } else {
    event.reply('abrir-archivos-reply', { msg: 'fail', package: 'No se seleccionaron archivos' });
  }
});

ipcMain.on('compare-password', (event, password) => {
  console.log("Comparando contraseñas")
  bcrypt.compare(password, APP_PASSWORD, function (err, correcta) {
    if (err) {
      event.reply('compare-password-reply', { msg: 'error', package: err })
    } else if (correcta) {
      event.reply('compare-password-reply', { msg: 'success' })
    } else {
      event.reply('compare-password-reply', { msg: 'fail', package: 'Contraseña incorrecta' })
    }
  });
})

ipcMain.on('consolidar-excels', (event) => {
  console.log("Consolidando excels")
  // Aquí iría la lógica para procesar los archivos Excel
  consolidarExcels(filePaths).then((result) => {
    event.reply('consolidar-excels-reply', { msg: 'success', package: result })
  }).catch((err) => {
    event.reply('consolidar-excels-reply', { msg: 'error', package: err })
  });
});
