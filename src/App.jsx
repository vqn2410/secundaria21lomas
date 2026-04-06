import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';

// Importaciones Dinámicas (Code Splitting)
const AboutUs = lazy(() => import('./pages/AboutUs'));
const News = lazy(() => import('./pages/News'));
const DashboardRouter = lazy(() => import('./pages/DashboardRouter'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
           <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Cargando...</p>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sobre-nosotros" element={<AboutUs />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<DashboardRouter />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
