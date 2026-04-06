import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { gpdAuth, gpdDb } from '../firebase';
import MainLayout from '../components/MainLayout';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';
import { UserCircle, FileText, ChevronLeft, Calendar } from 'lucide-react';

export default function GPDPracticanteApp() {
  const [practicante, setPracticante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = gpdAuth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          let docRef = doc(gpdDb, 'practicantes', user.uid);
          let snap = await getDoc(docRef);
          if (snap.exists()) {
            setPracticante({ id: snap.id, ...snap.data() });
          } else {
            docRef = doc(gpdDb, 'docentes_practica', user.uid);
            snap = await getDoc(docRef);
            if (snap.exists()) {
              setPracticante({ id: snap.id, ...snap.data() });
            } else {
              console.error("Usuario GPD no encontrado en ninguna colección");
              setPracticante('NOT_FOUND');
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setPracticante(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}><p>Cargando GPD...</p></div>;
  }

  if (!practicante || practicante === 'NOT_FOUND') {
    return <Navigate to="/gpd-registro" replace />;
  }

  return (
    <MainLayout role="docente" title="Portal GPD">
      <Routes>
        <Route index element={<GPDPracticanteHome practicante={practicante} />} />
        <Route path="perfil" element={<GPDPracticantePerfil practicante={practicante} />} />
        <Route path="listados" element={<GPDPracticanteListados practicante={practicante} />} />
      </Routes>
    </MainLayout>
  );
}

function GPDPracticanteHome({ practicante }) {
  return (
    <div>
      <div className="header-flex" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ec4899' }}>Portal de Práctica Docente</h1>
          <p>Bienvenido {practicante.nombre}, del {practicante.instituto}.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: practicante.rol === 'docente' ? '#e0e7ff' : '#fce7f3', color: practicante.rol === 'docente' ? '#3730a3' : '#be185d', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
          {practicante.rol === 'docente' ? 'Docente de Práctica' : 'Estudiante / Practicante'}
        </div>
      </div>

      <DashboardGrid>
        <DashboardCard 
          role="estudiante"
          color="#ec4899"
          title="Mi Perfil y Salud"
          description="Visualiza y actualiza tus datos y legajo personal."
          icon={<UserCircle size={28} />}
          href="/gpd-panel/perfil"
        />
        <DashboardCard 
          role="estudiante"
          color="#8b5cf6"
          title="Listados y Asignaciones"
          description="Consulta las listas de práctica publicadas para tu ISFD."
          icon={<FileText size={28} />}
          href="/gpd-panel/listados"
        />
      </DashboardGrid>
    </div>
  );
}

function GPDPracticantePerfil({ practicante: p }) {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={() => navigate('/gpd-panel')} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Ficha de Inscripción GPD</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
           <div style={{ background: '#ec4899', color: 'white', padding: '1rem', borderRadius: '50%' }}>
              <UserCircle size={40} />
           </div>
           <div>
              <h2 style={{ fontSize: '1.5rem', color: '#ec4899' }}>{p.apellido?.toUpperCase()}, {p.nombre}</h2>
              <p style={{ fontWeight: 600, opacity: 0.6 }}>DNI: {p.dni}</p>
           </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
           <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5 }}>INSTITUTO DE FORMACIÓN DOCENTE</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.instituto} ({p.distrito})</p>
           </div>
           <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5 }}>CORREO ELECTRÓNICO</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.email}</p>
           </div>
           <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5 }}>TELÉFONO DE CONTACTO</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.telefono}</p>
           </div>
           <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5 }}>DOMICILIO</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.direccion}, {p.localidad}</p>
           </div>
           <div style={{ gridColumn: 'span 2', padding: '1rem', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c2410c' }}>CONDICIONES DE SALUD DECLARADAS</p>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#9a3412', marginTop: '0.5rem' }}>{p.salud || 'Ninguna'}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function GPDPracticanteListados({ practicante }) {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={() => navigate('/gpd-panel')} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Listados de Práctica</h1>
      </div>

      <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Listado de Práctica Docente</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.8 }}>{practicante.instituto} - Distrito {practicante.distrito}</p>
          </div>
          <div style={{ background: '#ede9fe', padding: '0.5rem 1rem', borderRadius: '8px', color: '#6d28d9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> Ciclo Lectivo {new Date().getFullYear()}
          </div>
        </div>
        
        <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.6, background: '#f8fafc', borderRadius: '8px' }}>
          Aún no se han publicado asignaciones formales a escuelas co-formadoras para tu profesorado.
        </p>
      </div>
    </div>
  );
}
