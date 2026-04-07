import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { BookOpen, Calendar, LayoutGrid, FilePlus, Library, Share2, BookUser, ArrowRight } from 'lucide-react';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';
import { gpdAuth, gpdDb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


function DualRoleNotice() {
  const [hasGPD, setHasGPD] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const gUser = gpdAuth.currentUser;
      if (!gUser) return;
      try {
        const pSnap = await getDoc(doc(gpdDb, 'practicantes', gUser.uid));
        const dSnap = await getDoc(doc(gpdDb, 'docentes_practica', gUser.uid));
        if (pSnap.exists() || dSnap.exists()) setHasGPD(true);
      } catch (err) { console.log("GPD Check skip"); }
    };
    check();
  }, []);

  if (!hasGPD) return null;

  return (
    <div className="card" style={{ background: '#fdf2f8', border: '2px dashed #ec4899', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '1.25rem 2rem' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#ec4899', color: 'white', padding: '12px', borderRadius: '12px' }}><BookUser size={28} /></div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontWeight: 800, color: '#be185d' }}>Perfil de Práctica Detectado</h4>
            <p style={{ fontSize: '0.9rem', color: '#db2777', opacity: 0.9 }}>Parece que también participas en la Gestión de Prácticas (GPD) como co-formador o estudiante.</p>
          </div>
       </div>
       <button onClick={() => navigate('/gpd-panel')} className="btn" style={{ background: '#db2777', color: 'white', fontWeight: 800, whiteSpace: 'nowrap', padding: '0.75rem 1.5rem' }}>
         Ir a GPD <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
       </button>
    </div>
  );
}


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

      <DualRoleNotice />

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
        <Route path="practicas" element={<Navigate to="/gpd-panel" replace />} />
        <Route path="*" element={<TeacherHome />} />
      </Routes>
    </MainLayout>
  );
}
