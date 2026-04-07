import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Library, LayoutGrid, FileText, Share2, ClipboardList, Newspaper } from 'lucide-react';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const navLinks = [
  { path: '/estudiante', label: 'Inicio', icon: <LayoutGrid size={20} /> },
  { path: '/estudiante/materias', label: 'Mis Materias', icon: <Library size={20} /> },
  { path: '/estudiante/practicas', label: 'Práctica', icon: <Share2 size={20} /> },
  { path: '/estudiante/recursos', label: 'Recursos', icon: <FileText size={20} /> },
];

function StudentHome() {
  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    const checkPerms = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists() && snap.data().canPostNews) setCanPost(true);
      } catch (err) { console.error(err); }
    };
    checkPerms();
  }, []);

  return (
    <>
       <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Portal del Estudiante</h1>
          <p>Bienvenido, accede a tus materias y materiales de estudio.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#eef2ff', color: '#2E3192', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
          Modo Estudiante
        </div>
      </div>

      <DashboardGrid>
        <DashboardCard 
          role="estudiante" 
          title="Mis Materias" 
          description="Accede a los contenidos cargados por tus profesores para cada materia." 
          icon={<Library size={24} />} 
          href="/estudiante/materias"
        />
        {canPost && (
          <DashboardCard 
            role="estudiante" 
            title="Diario Institucional" 
            description="Tienes permisos para redactar noticias en el portal de la escuela." 
            icon={<Newspaper size={24} />} 
            href="/dashboard/escuela/noticias" 
            color="#3b82f6"
          />
        )}
        <DashboardCard 
          role="estudiante" 
          title="Prácticas" 
          description="Sigue el estado de tus prácticas escolares y envía documentación." 
          icon={<Share2 size={24} />} 
          href="/estudiante/practicas"
        />
        <DashboardCard 
          role="estudiante" 
          title="Material Didáctico" 
          description="Repositorio centralizado de lecturas, videos y ejercicios compartidos." 
          icon={<FileText size={24} />} 
          href="/estudiante/recursos"
        />
        <DashboardCard 
          role="estudiante" 
          title="Legajo Digital" 
          description="Administra tu información personal y documentación escolar cargada." 
          icon={<ClipboardList size={24} />} 
          href="/estudiante/perfil"
        />
      </DashboardGrid>
    </>
  );
}

export default function StudentDashboard() {
  return (
    <MainLayout role="estudiante" navLinks={navLinks} title="Espacio Académico">
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="materias" element={<div>Mis Materias (Próximamente)</div>} />
        <Route path="practicas" element={<div>Prácticas (Próximamente)</div>} />
        <Route path="recursos" element={<div>Materiales y Recursos (Próximamente)</div>} />
        <Route path="*" element={<StudentHome />} />
      </Routes>
    </MainLayout>
  );
}
