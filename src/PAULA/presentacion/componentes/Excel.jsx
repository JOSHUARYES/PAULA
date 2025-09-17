import React, { useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';

export default function ExcelApp() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const handleSeleccionar = () => {
    window.electronAPI.seleccionarArchivos()
      .then((response) => {
        setFiles(response.package);
      })
      .catch((err) => {
        console.error(err);
        setFiles([]);
        setResult(err.package || "❌ Error Desconocido");
      });

  };

  const handleProcesar = () => {
    setLoading(true);
    setResult(null);
    if (files.length === 0) {
      setResult("Error al procesar: ⚠️ No hay archivos seleccionados");
      setLoading(false);
      return;
    }

    window.electronAPI.consolidarExcels()
      .then((response) => {
        setResult(`✅ Procesados ${response.count} archivos`);
      })
      .catch((err) => {
        console.error(err);
        setResult("❌ Error al procesar");
        setStatus("❌ Error al procesar");
      })
      .finally(() => {
        setLoading(false);
      });
    setStatus("⏳ Procesando...");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Cargar archivos Excel</h2>
      <button onClick={handleSeleccionar} style={{ margin: "20px", padding: "10px 20px" }}>
        📂 Cargar archivos
      </button>
      <button onClick={handleProcesar} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Procesar
      </button>
      {/* Spinner / animación */}
      {loading && <ClipLoader color="#36d7b7" size={50} />}

      {/* Resultado */}
      {result && <p style={{ marginTop: "20px" }}>{result}</p>}
      {/* {status && <p style={{ marginTop: "15px" }}>{status}</p>} */}

      {files.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map((fileName, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "center",
              }}
            >
              <FaFileExcel size={24} color="green" style={{ marginRight: "10px" }} />
              {fileName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
