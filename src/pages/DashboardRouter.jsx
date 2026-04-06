import { useEffect, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import PreceptorDashboard from './PreceptorDashboard';

export default function DashboardRouter() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            // Fallback for admin if missing doc
            if (user.email === 'admin@admin.com') setRole('admin');
            else setRole('unauthorized');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole('unauthorized');
        }
      } else {
        setRole('unauthenticated');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: '#f1f5f9' }}>
         <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Autenticando...</p>
      </div>
    );
  }

  if (role === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (role === 'unauthorized') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Acceso Denegado</h2>
        <p>Tu cuenta no tiene un rol asignado o no se pudo verificar.</p>
        <button className="btn" onClick={() => auth.signOut()}>Volver al Inicio</button>
      </div>
    );
  }

  // Rutas Dinámicas unificadas según el Rol. Se renderiza el panel entero como si estuviera en /dashboard/
  switch (role) {
    case 'admin': return <AdminDashboard />;
    case 'docente': return <TeacherDashboard />;
    case 'estudiante': return <StudentDashboard />;
    case 'preceptor': return <PreceptorDashboard />;
    default: return <div>Rol desconocido: {role}</div>;
  }
}
