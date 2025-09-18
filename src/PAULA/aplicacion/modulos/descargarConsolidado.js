const { dialog } = require("electron");
const XLSX = require('xlsx');

function descargarConsolidado(consolidadoJSON) {
  return new Promise(async (resolve, reject) => {
    try {
      woorkbookConsolidado = XLSX.utils.book_new();
      const nuevaHoja = XLSX.utils.json_to_sheet(consolidadoJSON);
      XLSX.utils.book_append_sheet(woorkbookConsolidado, nuevaHoja, 'Consolidado');
      console.log("Iniciando descarga del archivo consolidado");
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Guardar archivo consolidado',
        defaultPath: 'consolidado.xlsx',
        filters: [
          { name: 'Excel Files', extensions: ['xlsx'] }
        ]
      });
      if (canceled) {
        const descargada = false;
        const cancelada = true;
        const error = "Descarga cancelada por el usuario";
        resolve({ descargada, cancelada, error });
      }
      await XLSX.writeFile(woorkbookConsolidado, filePath);
      const descargada = true;
      const cancelada = false;
      const error = null;
      resolve({ descargada, cancelada, error });
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = { descargarConsolidado };