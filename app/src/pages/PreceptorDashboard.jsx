import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Users, LayoutGrid, ClipboardCheck, Megaphone, FileText } from 'lucide-react';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';

const navLinks = [
  { path: '/preceptor', label: 'Inicio', icon: <LayoutGrid size={20} /> },
  { path: '/preceptor/asistencia', label: 'Asistencia', icon: <ClipboardCheck size={20} /> },
  { path: '/preceptor/estudiantes', label: 'Mi Legajo', icon: <Users size={20} /> },
  { path: '/preceptor/comunicados', label: 'Anuncios', icon: <Megaphone size={20} /> },
];

function PreceptorHome() {
  return (
    <>
       <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Portal de Preceptoría</h1>
          <p>Bienvenido preceptor(a), gestione la asistencia y comunicados de sus cursos.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#fef3c7', color: '#d97706', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
          Modo Preceptor
        </div>
      </div>

      <DashboardGrid>
        <DashboardCard 
          role="admin" 
          title="Toma de Asistencia" 
          description="Registre el presente y ausente de los estudiantes diariamente." 
          icon={<ClipboardCheck size={24} />} 
          href="/preceptor/asistencia"
        />
        <DashboardCard 
          role="admin" 
          title="Legajos de Cursos" 
          description="Acceda a la información y documentación de cada estudiante a su cargo." 
          icon={<Users size={24} />} 
          href="/preceptor/estudiantes"
        />
        <DashboardCard 
          role="admin" 
          title="Comunicados Internos" 
          description="Publique avisos para los grupos de padres y estudiantes." 
          icon={<Megaphone size={24} />} 
          href="/preceptor/comunicados"
        />
        <DashboardCard 
          role="admin" 
          title="Justificativos" 
          description="Gestione los certificados médicos y notas de retiro de los alumnos." 
          icon={<FileText size={24} />} 
          href="/preceptor/justificativos"
        />
      </DashboardGrid>
    </>
  );
}

export default function PreceptorDashboard() {
  return (
    <MainLayout role="admin" navLinks={navLinks} title="Preceptoría Digital">
      <Routes>
        <Route index element={<PreceptorHome />} />
        <Route path="asistencia" element={<div>Toma de Asistencia (Próximamente)</div>} />
        <Route path="estudiantes" element={<div>Listado de Estudiantes (Próximamente)</div>} />
        <Route path="comunicados" element={<div>Anuncios (Próximamente)</div>} />
        <Route path="*" element={<PreceptorHome />} />
      </Routes>
    </MainLayout>
  );
}
