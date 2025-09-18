const XLSX = require('xlsx');

function consolidarExcels(filesPaths) {
  return new Promise(async (resolve, reject) => {
    try {
      // Aquí iría la lógica para procesar los archivos Excel
      var consolidadoJSON = [];
      var cantProcesados = 0;
      //console.log("Archivos recibidos para consolidar:", filesPaths);
      for (const filePath of filesPaths) {
        //console.log("Procesando archivo:", filePath);
        //console.log("Tipo de archivo:", filePath.endsWith('.xlsx') ? 'xlsx' : filePath.endsWith('.xls') ? 'xls' : 'desconocido');
        if (!(filePath.endsWith('.xls') || filePath.endsWith('.xlsx'))) {
          //console.log('Formato de archivo no soportado:', filePath);
          reject(new Error('Formato de archivo no soportado: ' + filePath));
        }
        const workbookXLSX = await XLSX.readFile(filePath);
        //console.log('Leyendo el archivo:', filePath);
        //console.log('Número de hojas:', workbookXLSX.SheetNames.length);
        const sheet = workbookXLSX.Sheets[workbookXLSX.SheetNames[0]];
        //console.log('Número de filas en la primera hoja:', XLSX.utils.decode_range(sheet['!ref']).e.r + 1);
        //console.log('Número de columnas en la primera hoja:', XLSX.utils.decode_range(sheet['!ref']).e.c + 1);
        const data = XLSX.utils.sheet_to_json(sheet);
        consolidadoJSON = consolidadoJSON.concat(data);
        cantProcesados++;
      }
      // woorkbookConsolidado = XLSX.utils.book_new();
      // const nuevaHoja = XLSX.utils.json_to_sheet(consolidadoJSON);
      // XLSX.utils.book_append_sheet(woorkbookConsolidado, nuevaHoja, 'Consolidado');
      resolve({ cantProcesados, consolidadoJSON });
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = { consolidarExcels };