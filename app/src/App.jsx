import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Landing from './pages/Landing';
import Login from './pages/Login';

// Importaciones Dinámicas (Code Splitting)
const AboutUs = lazy(() => import('./pages/AboutUs'));
const News = lazy(() => import('./pages/News'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const PreceptorDashboard = lazy(() => import('./pages/PreceptorDashboard'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Register = lazy(() => import('./pages/Register'));
const GPDRegistro = lazy(() => import('./pages/GPDRegistro'));
const GPDPanel = lazy(() => import('./pages/GPDPanel'));

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
      <p style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Verificando sesión...</p>
    </div>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
          <Route path="/gpd-registro" element={<GPDRegistro />} />
          
          {/* Rutas Protegidas */}
          <Route path="/dashboard/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/docente/*" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/estudiante/*" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/preceptor/*" element={<ProtectedRoute><PreceptorDashboard /></ProtectedRoute>} />
          <Route path="/gpd-panel" element={<ProtectedRoute><GPDPanel /></ProtectedRoute>} />
          
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
