//console.log("✅ preload.js se ha cargado correctamente.");
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  comparePassword: (password) => {
    return new Promise((resolve, reject) => {
      // Envia un mensaje al proceso principal parar comparar
      ipcRenderer.send('compare-password', password)
      // Escucha la respuesta del proceso principal
      ipcRenderer.once('compare-password-reply', (event, response) => {
        if (response.msg === 'success') {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  },
  seleccionarArchivos: () => {
    //console.log("Seleccionar archivos desde preload.js")
    return new Promise((resolve, reject) => {
      // Envia un mensaje al proceso principal para abrir el diálogo de archivos
      ipcRenderer.send('abrir-archivos')
      // Escucha la respuesta del proceso principal
      ipcRenderer.once('abrir-archivos-reply', (event, response) => {
        //console.log("Respuesta del proceso principal:", response.msg);
        if (response.msg === 'success') {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  },
  consolidarExcels: () => {
    return new Promise((resolve, reject) => {
      // Envia un mensaje al proceso principal para consolidar
      ipcRenderer.send('consolidar-excels')
      // Escucha la respuesta del proceso principal
      ipcRenderer.once('consolidar-excels-reply', (event, response) => {
        if (response.msg === 'success') {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  },
  descargarConsolidado: () => {
    return new Promise((resolve, reject) => {
      // Envia un mensaje al proceso principal para descargar
      ipcRenderer.send('descargar-consolidado')
      // Escucha la respuesta del proceso principal
      ipcRenderer.once('descargar-consolidado-reply', (event, response) => {
        if (response.msg === 'success') {
          resolve(response)
        } else {
          reject(response)
        }
      })
    });
  }
});