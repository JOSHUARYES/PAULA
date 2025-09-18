const { dialog } = require('electron');
const path = require('path');

function abrirArchivos() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Abriendo diálogo de archivos");
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }]
      });
      const paths = result.filePaths;
      const fileNames = paths.map(file => path.basename(file));
      console.log("Archivos seleccionados:", paths);
      console.log("Nombres de archivos: ", fileNames);
      resolve({ paths, fileNames });
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = { abrirArchivos };