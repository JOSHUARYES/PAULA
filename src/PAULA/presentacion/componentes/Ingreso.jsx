import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    window.electronAPI.comparePassword(password)
      .then((response) => {
        if (response.msg === 'success') {
          console.log("Login exitoso");
          onLogin();
          navigate('/excel');
        } else if (response.msg === 'fail') {
          setError(response.package);
        } else {
          setError(response.package || 'Error desconocido');
        }
      })
      .catch(err => {
        //console.error(err);
        if (err.msg === 'fail') {
          setError(err.package);
        } else {
          setError(err.package || err || 'Error desconocido');
        }
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Ingrese su contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
