import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Ingreso.jsx';
import ExcelApp from './componentes/Excel.jsx';

export default function App() {
  const [logged, setLogged] = useState(false);
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login onLogin={() => setLogged(true)} />} 
        />
        <Route 
          path="/excel" 
          element={logged ? <ExcelApp /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}
