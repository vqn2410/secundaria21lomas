import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { BookOpen, Calendar, LayoutGrid, FilePlus, Library, Share2 } from 'lucide-react';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';


function TeacherHome() {
  return (
    <>
      <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Portal Docente</h1>
          <p>Bienvenido profesor(a), aquí puede gestionar sus clases y recursos pedagógicos.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#334155', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
          Modo Docente
        </div>
      </div>

      <DashboardGrid>
        <DashboardCard 
          role="docente" 
          title="Mis Cursos" 
          description="Accede a la lista de estudiantes y seguimiento de materias asignadas." 
          icon={<BookOpen size={24} />} 
          href="/docente/mis-cursos"
        />
        <DashboardCard 
          role="docente" 
          title="Práctica Docente" 
          description="Envío y coordinación de planillas de prácticas escolares." 
          icon={<Share2 size={24} />} 
          href="/docente/practicas"
        />
        <DashboardCard 
          role="docente" 
          title="Recursos Educativos" 
          description="Sube archivos y material de estudio para tus alumnos." 
          icon={<Library size={24} />} 
          href="/docente/recursos"
        />
        <DashboardCard 
          role="docente" 
          title="Planillas" 
          description="Crea nuevas unidades didácticas y proyectos para este ciclo." 
          icon={<FilePlus size={24} />} 
          href="/docente/nueva-planilla"
        />
      </DashboardGrid>
    </>
  );
}

export default function TeacherDashboard() {
  return (
    <MainLayout role="docente" title="Panel del Docente">
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="mis-cursos" element={<div>Mis Cursos (Próximamente)</div>} />
        <Route path="recursos" element={<div>Recursos (Próximamente)</div>} />
        <Route path="practicas" element={<div>Práctica Docente (Próximamente)</div>} />
        <Route path="*" element={<TeacherHome />} />
      </Routes>
    </MainLayout>
  );
}
