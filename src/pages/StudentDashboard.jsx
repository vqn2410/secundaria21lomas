import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Library, LayoutGrid, FileText, Share2, ClipboardList } from 'lucide-react';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';

const navLinks = [
  { path: '/dashboard', label: 'Inicio', icon: <LayoutGrid size={20} /> },
  { path: '/dashboard/materias', label: 'Mis Materias', icon: <Library size={20} /> },
  { path: '/dashboard/practicas', label: 'Práctica', icon: <Share2 size={20} /> },
  { path: '/dashboard/recursos', label: 'Recursos', icon: <FileText size={20} /> },
];

function StudentHome() {
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
          href="/dashboard/materias"
        />
        <DashboardCard 
          role="estudiante" 
          title="Prácticas" 
          description="Sigue el estado de tus prácticas escolares y envía documentación." 
          icon={<Share2 size={24} />} 
          href="/dashboard/practicas"
        />
        <DashboardCard 
          role="estudiante" 
          title="Material Didáctico" 
          description="Repositorio centralizado de lecturas, videos y ejercicios compartidos." 
          icon={<FileText size={24} />} 
          href="/dashboard/recursos"
        />
        <DashboardCard 
          role="estudiante" 
          title="Legajo Digital" 
          description="Administra tu información personal y documentación escolar cargada." 
          icon={<ClipboardList size={24} />} 
          href="/dashboard/perfil"
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
