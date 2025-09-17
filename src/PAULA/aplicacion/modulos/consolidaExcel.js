const ExcelJS = require('exceljs');
function consolidarExcels(filesPath) {
  newFile = { count: filesPath.length };
  return new Promise((resolve, reject) => {
    try {
      // Aquí iría la lógica para procesar los archivos Excel
      console.log("Archivos recibidos para consolidar:", filesPath);
      // Simulación de procesamiento
      setTimeout(() => {
        resolve(newFile);
      }, 2000);
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = { consolidarExcels };