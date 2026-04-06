import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ClipboardList, LogOut, FileText, CheckCircle, Clock } from 'lucide-react';
import { gpdAuth, gpdDb } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';

export default function GPDPanel() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inicio');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = gpdAuth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        // Buscar el perfil en practicantes o docentes_practica
        const resSnap = await getDoc(doc(gpdDb, 'practicantes', u.uid));
        if (resSnap.exists()) {
          setProfile({ id: resSnap.id, type: 'estudiante', ...resSnap.data() });
        } else {
          const docSnap = await getDoc(doc(gpdDb, 'docentes_practica', u.uid));
          if (docSnap.exists()) {
            setProfile({ id: docSnap.id, type: 'docente', ...docSnap.data() });
          }
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = () => {
    gpdAuth.signOut();
    navigate('/login');
  };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando portal GPD...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#fdf4ff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#ec4899', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <GraduationCap size={32} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Portal GPD - EES N° 21</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{profile?.nombre} {profile?.apellido}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{profile?.type === 'estudiante' ? 'Estudiante Practicante' : 'Docente / Referente'}</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile?.photoURL ? <img src={profile.photoURL} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <GraduationCap size={20} color="#ec4899" />}
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <TabButton active={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} icon={<BookOpen size={18} />} label="Inicio" />
          {profile?.type === 'estudiante' && (
            <>
              <TabButton active={activeTab === 'mis-practicas'} onClick={() => setActiveTab('mis-practicas')} icon={<CheckCircle size={18} />} label="Mis Prácticas" />
              <TabButton active={activeTab === 'inscripciones'} onClick={() => setActiveTab('inscripciones')} icon={<ClipboardList size={18} />} label="Inscripciones" />
            </>
          )}
        </div>

        {activeTab === 'inicio' && <Welcome profile={profile} />}
        {activeTab === 'mis-practicas' && <MisPracticas profile={profile} />}
        {activeTab === 'inscripciones' && <Inscripciones profile={profile} />}
        
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '12px', border: 'none',
      background: active ? '#ec4899' : 'white', color: active ? 'white' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    }}>
      {icon} {label}
    </button>
  );
}

function Welcome({ profile }) {
  return (
    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ width: '120px', height: '120px', background: '#fdf2f8', color: '#ec4899', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', overflow: 'hidden', border: '3px solid #fbcfe8' }}>
        {profile?.photoURL ? <img src={profile.photoURL} alt="Foto de Legajo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <GraduationCap size={60} />}
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>¡Bienvenido, {profile?.nombre}!</h2>
      <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
        Estás ingresando al portal de Gestión de Prácticas Docentes.
      </p>
      <div style={{ marginTop: '2rem', display: 'inline-block', padding: '0.75rem 1.5rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.9rem' }}>
        <strong>Legajo de Práctica:</strong> {profile?.dni} | <strong>Carrera:</strong> {profile?.profesorado || 'No asignada'}
      </div>
    </div>
  );
}

function MisPracticas({ profile }) {
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(gpdDb, 'practicas_asignadas'), where('practicanteId', '==', profile.id));
      const snap = await getDocs(q);
      setPracticas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetch();
  }, [profile.id]);

  if (loading) return <div>Cargando tus prácticas...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Mis Prácticas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {practicas.map(p => (
          <div key={p.id} className="card" style={{ borderLeft: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ec4899', background: '#fdf2f8', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{p.pid}</span>
               <span style={{ fontSize: '0.75rem', color: '#64748b' }}><Clock size={12} /> {p.estado}</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{p.curso} {p.seccion}</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Prof. Co-formador: <strong>{p.coformador}</strong></p>
          </div>
        ))}
        {practicas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', gridColumn: 'span 3', color: '#64748b' }}>
            Aún no tienes prácticas asignadas. Ve a "Inscripciones" para elegir una vacante.
          </div>
        )}
      </div>
    </div>
  );
}

function Inscripciones({ profile }) {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // 1. Obtener el profesorado del estudiante para filtrar materias
      const profSnap = await getDocs(query(collection(gpdDb, 'profesorados'), where('nombre', '==', profile.profesorado)));
      if (profSnap.empty) {
        setLoading(false);
        return;
      }
      const profesoradoData = profSnap.docs[0].data();
      const codigosMateria = profesoradoData.materias.split(',').map(c => c.trim().toUpperCase());

      // 2. Obtener ofertas que coincidan con esos códigos
      // El admin debe marcar las practicas como "Abiertas" para inscripcion
      const q = query(collection(gpdDb, 'practicas_ofertas'), where('pid', 'in', codigosMateria), where('estado', '==', 'Abierta'));
      const snap = await getDocs(q);
      setOfertas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetch();
  }, [profile.profesorado]);

  const handleInscribir = async (oferta) => {
    if (!window.confirm(`¿Seguro que deseas inscribirte en ${oferta.curso} ${oferta.seccion}?`)) return;
    try {
      // Crear asignacion
      await addDoc(collection(gpdDb, 'practicas_asignadas'), {
        practicanteId: profile.id,
        practicanteNombre: `${profile.nombre} ${profile.apellido}`,
        ...oferta,
        estado: 'Inscripto - Pendiente',
        fechaInscripcion: new Date()
      });
      alert("¡Inscripción exitosa! El administrador revisará tu solicitud.");
      window.location.reload();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div>Buscando cursos disponibles para {profile.profesorado}...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Inscripciones Disponibles</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Mostrando vacantes para: <strong>{profile.profesorado}</strong></p>
      
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Materia</th><th>Curso</th><th>Día/Hora</th><th>Acción</th></tr></thead>
          <tbody>
            {ofertas.map(o => (
              <tr key={o.id}>
                <td><strong style={{ color: '#ec4899' }}>({o.pid})</strong> {o.materia}</td>
                <td>{o.curso} {o.seccion}</td>
                <td>{o.horario || 'N/A'}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleInscribir(o)} style={{ background: '#ec4899', fontSize: '0.8rem' }}>Inscribirme</button>
                </td>
              </tr>
            ))}
            {ofertas.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No hay cursos abiertos actualmente para tu profesorado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
