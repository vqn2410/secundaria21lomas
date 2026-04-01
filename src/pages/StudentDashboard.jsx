import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CalendarDays, History, Search, CheckCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, query, where, updateDoc, doc, increment } from 'firebase/firestore';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState('available'); // 'available', 'history', 'announcements'
  const [practices, setPractices] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Escuchar todas las prácticas disponibles
    const unsubPractices = onSnapshot(collection(db, 'practices'), (snap) => {
      setPractices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Escuchar anuncios
    const unsubAnuncios = onSnapshot(collection(db, 'announcements'), (snap) => {
        setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Escuchar mis inscripciones
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'assignments'), where('studentId', '==', user.uid));
      const unsubMy = onSnapshot(q, (snap) => {
        setMyAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => {
        unsubPractices();
        unsubAnuncios();
        unsubMy();
      };
    }
  }, []);

  const handleEnroll = async (practice) => {
    if (practice.cupos <= 0) return;
    
    // Verificar si ya estoy inscrito
    if (myAssignments.find(a => a.practiceId === practice.id)) {
      alert("Ya estás inscrito en esta práctica.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      // 1. Crear asignación
      await addDoc(collection(db, 'assignments'), {
        studentId: user.uid,
        studentName: user.displayName || user.email,
        practiceId: practice.id,
        course: practice.course,
        subject: practice.subject,
        day: practice.day,
        time: practice.time,
        status: 'pendiente',
        createdAt: new Date().toISOString()
      });

      // 2. Descontar cupo
      await updateDoc(doc(db, 'practices', practice.id), {
        cupos: increment(-1)
      });

      alert("¡Inscripción exitosa!");
    } catch (err) {
      console.error(err);
      alert("Error al inscribirse.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar student">
        <div className="sidebar-header">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-student)' }}>Portal Estudiante</h2>
          <p style={{ fontSize: '0.8rem' }}>Prácticas Secundarias</p>
        </div>
        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li className={`nav-link ${view === 'available' ? 'active' : ''}`} onClick={() => setView('available')}>
              <CalendarDays size={20} /> Prácticas Disponibles
            </li>
            <li className={`nav-link ${view === 'announcements' ? 'active' : ''}`} onClick={() => setView('announcements')}>
              <Search size={20} /> Comunicados
            </li>
            <li className={`nav-link ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
              <History size={20} /> Mi Historial
            </li>
          </ul>
        </nav>
        <div style={{ padding: '1rem' }}>
          <button className="btn" onClick={handleLogout} style={{ width: '100%', color: 'var(--text-light)' }}><LogOut size={20} /> Salir</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge" style={{ background: 'var(--bg-student)', color: 'var(--color-student)' }}>Estudiante</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-student)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>ES</div>
          </div>
        </header>

        <section className="content-area">
          <div className="header-flex" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.5rem' }}>
                {view === 'available' ? 'Prácticas Disponibles' : view === 'history' ? 'Mi Historial' : 'Panel de Comunicados'}
              </h1>
              <p>
                {view === 'available' 
                  ? 'Busca e inscríbete en los cursos disponibles para tus prácticas pre-profesionales.'
                  : view === 'history' ? 'Consulta el estado y registro de tus prácticas realizadas.'
                  : 'Novedades y avisos importantes de la plataforma.'}
              </p>
            </div>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%', background: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}/>
                <input className="input-field" placeholder="Buscar por materia o docente..." style={{ width: '100%', paddingLeft: '2.5rem' }} />
              </div>
              <select className="input-field">
                <option>Todos los Cursos</option>
                <option>4° A</option>
                <option>5° B</option>
              </select>
              <select className="input-field">
                <option>Día de la semana</option>
                <option>Lunes</option>
                <option>Martes</option>
              </select>
              <button className="btn btn-student" style={{ padding: '0.5rem 1rem' }}>Filtrar</button>
            </div>
          </div>

          <div className="grid grid-cols-2">
            {view === 'announcements' ? (
                announcements.map(a => (
                    <div className="card" key={a.id} style={{ borderLeft: '4px solid var(--color-student)' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{a.title}</h3>
                        <p>{a.content}</p>
                        <small style={{ display: 'block', marginTop: '1rem', color: 'var(--text-light)' }}>
                            Fecha: {new Date(a.createdAt).toLocaleDateString()}
                        </small>
                    </div>
                ))
            ) : view === 'available' ? (
              practices.map(p => {
                const isEnrolled = myAssignments.find(a => a.practiceId === p.id);
                return (
                  <div className="card" key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: isEnrolled ? '4px solid var(--color-teacher)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ color: 'var(--color-student)', marginBottom: '0.25rem' }}>{p.subject} - {p.course}</h3>
                        <p style={{ fontSize: '0.875rem' }}>EES N°21 - Turno {p.shift || 'Mañana'}</p>
                      </div>
                      <span className={`badge ${p.cupos > 0 ? 'badge-pending' : ''}`} style={p.cupos === 0 ? { background: '#fef2f2', color: '#ef4444' } : {}}>
                        {p.cupos > 0 ? `${p.cupos} Cupos` : 'Sin Cupos'}
                      </span>
                    </div>
                    
                    <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-light)' }}>Día:</span> <strong>{p.day}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-light)' }}>Horario:</span> <strong>{p.time}</strong>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <button className="btn" disabled style={{ width: '100%', background: 'var(--bg-teacher)', color: 'var(--color-teacher)', gap: '0.5rem' }}>
                        <CheckCircle size={18} /> Ya te inscribiste
                      </button>
                    ) : (
                      <button 
                        className="btn btn-student" 
                        onClick={() => handleEnroll(p)}
                        disabled={p.cupos <= 0 || loading}
                        style={{ width: '100%' }}
                      >
                        {loading ? 'Procesando...' : 'Inscribirme'}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              myAssignments.map(a => (
                <div className="card" key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>{a.subject} - {a.course}</h3>
                        <p style={{ fontSize: '0.875rem' }}>Fecha: {new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`badge ${a.status === 'confirmado' ? 'badge-confirmed' : 'badge-pending'}`}>
                        {a.status}
                      </span>
                    </div>
                    <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                      <p><strong>{a.day}, {a.time}</strong></p>
                    </div>
                </div>
              ))
            )}

            {((view === 'available' && practices.length === 0) || (view === 'history' && myAssignments.length === 0) || (view === 'announcements' && announcements.length === 0)) && (
               <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                  No se encontraron registros.
               </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
