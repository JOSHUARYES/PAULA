import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    window.electronAPI.comparePassword(password)
      .then((response) => {
        if (response.msg === 'success') {
          onLogin();
          navigate('/excel');
        } else if (response.msg === 'fail') {
          setError(response.package.message||response.package||'❌ Error desconocido');
        } else {
          setError(response.package.message||response.package||'❌ Error desconocido');
        }
      })
      .catch(err => {
        if (err.msg === 'fail') {
          setError(err.package.message||err.package||'❌ Error desconocido');
        } else {
          setError(err.package.message||err.package||'❌ Error desconocido');
        }
      });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
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
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 3,
          boxShadow: 3,
          p: 5,
          minWidth: 320,
          maxWidth: 400,
          width: '90vw',
          textAlign: 'center',
        }}
      >
        <h2>Ingrese su contraseña</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            type="password"
            value={password}
            label="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              marginLeft: '0',
              fontSize: '16px',
              borderRadius: '6px',
              border: 'none',
              background: '#ff4081', // color principal cambiado
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.3s, box-shadow 0.3s',
              boxShadow: '0 2px 8px 0 rgba(255,64,129,0.10)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#f50057'; // color hover
              e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(245,0,87,0.25)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#ff4081';
              e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(255,64,129,0.10)';
            }}
          >
            Ingresar
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Box>
    </Box>
  );
}
