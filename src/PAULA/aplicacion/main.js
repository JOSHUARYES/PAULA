const { Console } = require('console');
const { app, screen, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { CONFIG } = require(path.join(__dirname, 'config.js'));
const bcrypt = require('bcrypt');
require('dotenv').config();
const APP_PASSWORD = process.env.APP_PASSWORD;

const { dialog } = require('electron');
//const { abrirArchivos } = require('./modulos/abrirArchivos');
const { abrirArchivos } = require(path.join(__dirname, 'modulos', 'abrirArchivos.js'));
const { consolidarExcels } = require(path.join(__dirname, 'modulos', 'consolidaExcel.js'));
const { descargarConsolidado } = require(path.join(__dirname, 'modulos', 'descargarConsolidado.js'));
var filePaths;
var JSON = [];

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
  abrirArchivos()
    .then(({paths,fileNames}) => {
      console.log("Archivos seleccionados:", paths);
      console.log("Nombres de archivos: ", fileNames);
      if (paths.length > 0) {
        filePaths = paths;
        event.reply('abrir-archivos-reply', { msg: 'success', package: fileNames });
      } else {
        event.reply('abrir-archivos-reply', { msg: 'fail', package: 'No se seleccionaron archivos' });
      }
    })
    .catch((err) => {
      console.error(err);
      event.reply('abrir-archivos-reply', { msg: 'error', package: err.message || err });
    });

});

// Comparar contraseña
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

// Consolidar excels
ipcMain.on('consolidar-excels', (event) => {
  console.log("Consolidando excels")
  // Aquí iría la lógica para procesar los archivos Excel
  consolidarExcels(filePaths).then(({ cantProcesados, consolidadoJSON }) => {
    JSON = consolidadoJSON;
    event.reply('consolidar-excels-reply', { msg: 'success', package: cantProcesados })
  }).catch((err) => {
    event.reply('consolidar-excels-reply', { msg: 'error', package: err.message || err })
  });
});

// Descargar consolidado
ipcMain.on('descargar-consolidado', (event) => {
  descargarConsolidado(JSON)
    .then(({ descargada, cancelada, error }) => {
      if (descargada) {
        event.reply('descargar-consolidado-reply', { msg: 'success', package: null })
      } else if (cancelada) {
        event.reply('descargar-consolidado-reply', { msg: 'canceled', package: error })
      } else {
        event.reply('descargar-consolidado-reply', { msg: 'unknown', package: error })
      }
    })
    .catch((err) => {
      event.reply('descargar-consolidado-reply', { msg: 'error', package: err.message || err })
    }); 
});
