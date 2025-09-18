import React, { useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';

export default function ExcelApp() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [readyToDownload, setReadyToDownload] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleSeleccionar = () => {
    setReadyToDownload(false); // bloquear descarga mientras se selecciona nuevos archivos
    window.electronAPI.seleccionarArchivos()
      .then((response) => {
        setFiles(response.package);
        //console.log(response);
        setResult(`✅ Seleccionados ${response.package.length} archivos`);
      })
      .catch((err) => {
        //console.error(err);
        setFiles([]);
        setResult(err.package || "❌ Error Desconocido");
      });

  };

  const handleProcesar = () => {
    setLoading(true);
    setResult(null);
    setReadyToDownload(false); // bloquear descarga mientras procesa

    if (files.length === 0) {
      setResult("Error al procesar: ⚠️ No hay archivos seleccionados");
      setLoading(false);
      return;
    }

    window.electronAPI.consolidarExcels()
      .then((response) => {
        setResult(`✅ Procesados ${response.package} archivos`);
        setReadyToDownload(true); // habilitar descarga
      })
      .catch((err) => {
        //console.error(err);
        setStatus("❌ Error al procesar");
        setResult(err.package.message || err.package || "❌ Error Desconocido");
      })
      .finally(() => {
        setLoading(false);
      });
    setStatus("⏳ Procesando...");
  };

  const handleDescargar = () => {
    setLoading(true);
    setResult(null);
    window.electronAPI.descargarConsolidado()
      .then((response) => {
        setResult("✅ Archivo descargado correctamente");
        setReadyToDownload(false); // bloquear descarga hasta nuevo procesamiento
        setDownloaded(true);
      })
      .catch((err) => {
        //console.error(err);
        if (err.msg === 'canceled') {
          setResult("❌ Descarga cancelada por el usuario");
          setReadyToDownload(true); // permitir reintento de descarga
        } else {
          setResult(err.package.message || err.package || "❌ Error Desconocido");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    setStatus("⏳ Descargando...");
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #2196f3, #21cbf3, #ff4081, #f50057)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>
      <Box
        sx={{
          background: 'rgba(255,255,255,0.90)',
          borderRadius: 3,
          boxShadow: 3,
          p: 5,
          minWidth: 340,
          maxWidth: 500,
          width: 400, // Fijo para evitar que cambie de tamaño
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Cargar archivos Excel
        </Typography>
        <ButtonGroup
          variant="contained"
          aria-label="acciones excel"
          sx={{ mb: 2, boxShadow: 2, height: 56 }}
        >
          <Button
            color="primary"
            onClick={handleSeleccionar}
            startIcon={<span role="img" aria-label="folder">📂</span>}
            disabled={loading}
            sx={{
              fontWeight: 500,
              fontSize: 16,
              borderRadius: 0,
              animation: files.length === 0 ? 'blinkCarga 1s infinite alternate' : 'none',
              '@keyframes blinkCarga': {
                from: { boxShadow: '0 0 0 0 #2196f3' },
                to: { boxShadow: '0 0 16px 4px #2196f3' },
              },
            }}
          >
            Cargar archivos
          </Button>
          <Button
            color="secondary"
            onClick={handleProcesar}
            disabled={loading}
            sx={{
              fontWeight: 500,
              fontSize: 16,
              borderRadius: 0,
              animation: files.length > 0 && !readyToDownload && result !== '✅ Archivo descargado correctamente' ? 'blink 1s infinite alternate' : 'none',
              '@keyframes blink': {
                from: { boxShadow: '0 0 0 0 #f50057' },
                to: { boxShadow: '0 0 16px 4px #f50057' },
              },
            }}
          >
            Procesar
          </Button>
          {readyToDownload && (
            <Button
              color="success"
              onClick={handleDescargar}
              disabled={!readyToDownload || loading}
              sx={{
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 0,
                animation: readyToDownload ? 'blinkDescargar 1s infinite alternate' : 'none',
                '@keyframes blinkDescargar': {
                  from: { boxShadow: '0 0 0 0 #43a047' },
                  to: { boxShadow: '0 0 16px 4px #43a047' },
                },
              }}
            >
              Descargar
            </Button>
          )}
        </ButtonGroup>
        {/* Spinner / animación */}
        {loading && <Box sx={{ mt: 3 }}><ClipLoader color="#36d7b7" size={50} /></Box>}
        {/* Resultado */}
        {result && (
          <Typography
            sx={{
              mt: 3,
              mb: 4,
              px: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 500,
              fontSize: 18,
              color: downloaded || result === '✅ Archivo descargado correctamente' ? '#fff' : 'inherit',
              background: downloaded || result === '✅ Archivo descargado correctamente'
                ? 'linear-gradient(90deg, #43a047 0%, #00e676 100%)'
                : 'none',
              boxShadow: downloaded || result === '✅ Archivo descargado correctamente'
                ? '0 0 16px 4px #43a047, 0 2px 8px 0 rgba(33,150,243,0.10)'
                : 'none',
              transition: 'background 0.4s, box-shadow 0.4s, color 0.4s',
            }}
          >
            {result}
          </Typography>
        )}
        {/* {status && <Typography sx={{ mt: 2 }}>{status}</Typography>} */}
        {files.length > 0 && (
          <Box component="ul" sx={{
            listStyle: 'none',
            p: 0,
            mt: 3,
            maxHeight: '40vh',
            overflowY: 'auto',
            width: '100%',
            m: 0,
            textAlign: 'left',
            background: 'linear-gradient(90deg, #e3f2fd 0%, #fce4ec 100%)',
            borderRadius: 2,
            boxShadow: '0 0 0 8px rgba(255,64,129,0.35), 0 4px 16px 0 rgba(33,150,243,0.18)',
            border: '3px solid #ff4081',
            transition: 'background 0.5s, border-color 0.3s, box-shadow 0.3s',
            pl: 2,
            pt: 2,
            '&::-webkit-scrollbar': {
              width: '10px',
              background: '#e3f2fd',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(180deg, #2196f3 0%, #21cbf3 100%)',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(33,150,243,0.15)'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'linear-gradient(180deg, #1976d2 0%, #00bcd4 100%)',
            },
          }}>
            {files.map((fileName, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  justifyContent: 'flex-start',
                  wordBreak: 'break-all',
                }}
              >
                <FaFileExcel size={24} color="green" style={{ marginRight: "10px" }} />
                <Typography variant="body2">{fileName}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
