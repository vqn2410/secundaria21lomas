import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, UserPlus, FileDown, CheckCircle, Clock, Plus, CheckSquare, ArrowLeft, Trash2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, onSnapshot, updateDoc, doc, setDoc, query, where, addDoc, deleteDoc } from 'firebase/firestore';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listados');
  const [listados, setListados] = useState([]); // Listados del docente
  const [newListado, setNewListado] = useState({ curso: '', profesorado: '', institucion: '' });
  const [selectedListado, setSelectedListado] = useState(null); // Listado abierto
  const [activeMembers, setActiveMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('student');
  const [practices, setPractices] = useState([]);
  const [newStudent, setNewStudent] = useState({ 
    nombre: '', apellido: '', email: '', dni: '', 
    telefono: '', emergencia: '', alergias: '', instituto: '' 
  });
  const [assigningTo, setAssigningTo] = useState(null); 
  const [selectedPracticeId, setSelectedPracticeId] = useState('');
  const [searchDni, setSearchDni] = useState('');

  useEffect(() => {
    const unsubAssignments = onSnapshot(collection(db, 'assignments'), (snap) => {
      setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qStudents = query(collection(db, 'users'), where('role', '==', 'estudiante'));
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setStudentsList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAnuncios = onSnapshot(collection(db, 'announcements'), (snap) => {
        setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPractices = onSnapshot(collection(db, 'practices'), (snap) => {
      setPractices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qListados = query(collection(db, 'teacher_lists'), where('teacherUid', '==', auth.currentUser?.uid));
    const unsubListados = onSnapshot(qListados, (snap) => {
      setListados(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubAssignments(); unsubStudents(); unsubAnuncios(); unsubPractices(); unsubListados(); };
  }, []);

  useEffect(() => {
    if (selectedListado) {
        const qMembers = query(collection(db, 'list_members'), where('listId', '==', selectedListado.id));
        return onSnapshot(qMembers, (snap) => {
            setActiveMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }
  }, [selectedListado]);

  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'assignments', id), { status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const secondaryApp = initializeApp(auth.app.options, 'SecondaryStudent');
      const secondaryAuth = getAuth(secondaryApp);
      const userCred = await createUserWithEmailAndPassword(secondaryAuth, newStudent.email, newStudent.dni);
      const uid = userCred.user.uid;
      await setDoc(doc(db, 'users', uid), { uid, ...newStudent, role: 'estudiante', mustChangePassword: true, createdAt: new Date().toISOString() });
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);
      setShowModal(false);
      setNewStudent({ nombre: '', apellido: '', email: '', dni: '', telefono: '', emergencia: '', alergias: '', instituto: '' });
      alert("¡Estudiante creado con éxito!");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListado = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await addDoc(collection(db, 'teacher_lists'), { ...newListado, teacherUid: auth.currentUser.uid, createdAt: new Date().toISOString() });
        setShowModal(false);
        setNewListado({ curso: '', profesorado: '', institucion: '' });
    } catch (err) {
        alert("Error al crear listado");
    } finally {
        setLoading(false);
    }
  };

  const addStudentToListado = async (student) => {
    setLoading(true);
    try {
      const exists = activeMembers.some(m => m.studentId === student.id);
      if (exists) {
        alert("Este estudiante ya está en este listado.");
        return;
      }
      await addDoc(collection(db, 'list_members'), {
          listId: selectedListado.id,
          studentId: student.id,
          studentName: `${student.apellido}, ${student.nombre}`,
          studentDni: student.dni,
          studentEmail: student.email,
          studentPhone: student.telefono || 'N/A'
      });
      alert("Agregado al listado.");
    } catch (err) {
      alert("Error al agregar: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddByDni = () => {
    if (!searchDni) return;
    const student = studentsList.find(s => s.dni === searchDni);
    if (student) {
      addStudentToListado(student);
      setSearchDni('');
    } else {
      alert("No se encontró ningún estudiante registrado con ese DNI.");
    }
  };

  const handleAssignToPractice = async () => {
    if (!selectedPracticeId || !assigningTo) return;
    setLoading(true);
    try {
      const practice = practices.find(p => p.id === selectedPracticeId);
      if (!practice) throw new Error("Práctica no encontrada");
      await addDoc(collection(db, 'assignments'), {
        studentId: assigningTo.uid || assigningTo.id,
        studentName: `${assigningTo.apellido}, ${assigningTo.nombre}`,
        studentEmail: assigningTo.email,
        practiceId: selectedPracticeId,
        course: practice.courseId,
        subject: practice.subject,
        day: practice.day,
        time: practice.time,
        shift: practice.shift || 'Mañana',
        status: 'confirmado',
        createdAt: new Date().toISOString()
      });
      alert("Estudiante asignado correctamente.");
      setAssigningTo(null);
      setSelectedPracticeId('');
    } catch (err) {
      console.error(err);
      alert("Error al asignar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar teacher">
        <div className="sidebar-header">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-teacher)' }}>Panel Docente</h2>
          <p style={{ fontSize: '0.8rem' }}>EES N°21</p>
        </div>
        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li className={`nav-link ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}><CheckSquare size={20} /> Gestión Prácticas</li>
            <li className={`nav-link ${activeTab === 'listados' ? 'active' : ''}`} onClick={() => setActiveTab('listados')}><Users size={20} /> Mis Listados</li>
            <li className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}><Clock size={20} /> Comunicados</li>
          </ul>
        </nav>
        <div style={{ padding: '1rem' }}>
          <button className="btn" onClick={handleLogout} style={{ width: '100%', color: 'var(--text-light)' }}><LogOut size={20} /> Salir</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge" style={{ background: 'var(--bg-teacher)', color: 'var(--color-teacher)' }}>Docente</span>
          </div>
        </header>

        <section className="content-area">
          {activeTab === 'students' && (
            <>
              <div className="header-flex">
                <div>
                  <h1 style={{ marginBottom: '0.5rem' }}>Gestión de Prácticas</h1>
                  <p>Confirma asistencia y finaliza las prácticas de tus alumnos asignados.</p>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Estudiante</th><th>Curso / Materia</th><th>Turno</th><th>Día/Hora</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {assignments.map(a => (
                      <tr key={a.id}>
                        <td><strong>{a.studentName}</strong></td>
                        <td>{a.course} - {a.subject}</td>
                        <td><span className="badge" style={{ background: '#f1f5f9' }}>{a.shift || 'Mañana'}</span></td>
                        <td>{a.day} ({a.time})</td>
                        <td><span className={`badge ${a.status === 'realizado' ? 'badge-confirmed' : 'badge-pending'}`}>{a.status}</span></td>
                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                          {a.status === 'pendiente' && <button className="btn btn-teacher" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => updateStatus(a.id, 'confirmado')}>Confirmar</button>}
                          {a.status === 'confirmado' && <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--text)', color: 'white' }} onClick={() => updateStatus(a.id, 'realizado')}>Finalizar</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'listados' && (
             <>
               <div className="header-flex">
                 <div>
                   <h1>Mis Listados</h1>
                   <p>Organiza tus alumnos por curso, profesorado e institución.</p>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    {selectedListado && (
                      <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => setSelectedListado(null)}><ArrowLeft size={18} /> Volver</button>
                    )}
                    <button className="btn btn-teacher" onClick={() => { setModalType('customList'); setShowModal(true); }}><Plus size={18} /> Nuevo Listado</button>
                 </div>
               </div>

               {!selectedListado ? (
                 <div className="grid grid-cols-3">
                   {listados.map(idx => (
                     <div key={idx.id} className="card" style={{ cursor: 'pointer', borderTop: '4px solid var(--color-teacher)' }} onClick={() => setSelectedListado(idx)}>
                       <h3 style={{ fontSize: '1.4rem', color: 'var(--color-teacher)' }}>{idx.curso}</h3>
                       <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{idx.profesorado}</p>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{idx.institucion}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-6">
                    <div className="card">
                       <div className="header-flex" style={{ marginBottom: '1.5rem' }}>
                          <h2>{selectedListado.curso} | {selectedListado.profesorado}</h2>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                             <input 
                               className="input-field" 
                               style={{ width: '180px', padding: '0.5rem' }} 
                               placeholder="Cargar por DNI..." 
                               value={searchDni}
                               onChange={e => setSearchDni(e.target.value)}
                             />
                             <button className="btn btn-teacher" onClick={handleAddByDni}><Plus size={18}/></button>
                          </div>
                       </div>
                        <div className="table-wrapper">
                           <table>
                              <thead><tr><th>Apellido y Nombre</th><th>DNI</th><th>Teléfono</th><th>Email</th><th>Acción</th></tr></thead>
                              <tbody>
                                 {activeMembers.map(m => (
                                    <tr key={m.id}>
                                       <td><strong>{m.studentName}</strong></td>
                                       <td>{m.studentDni}</td>
                                       <td><span className="badge" style={{ background: '#f1f5f9' }}>{m.studentPhone || 'N/A'}</span></td>
                                       <td><small>{m.studentEmail}</small></td>
                                       <td><button className="btn" onClick={async () => await deleteDoc(doc(db, 'list_members', m.id))}><Trash2 size={16} color="red"/></button></td>
                                    </tr>
                                 ))}
                                 {activeMembers.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay alumnos en este listado. Agregalos por DNI.</td></tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                    </div>
                 </div>
               )}
             </>
          )}

          {activeTab === 'announcements' && (
            <>
              <div className="header-flex"><h1>Comunicados de la Institución</h1></div>
              <div className="grid grid-cols-2">
                {announcements.map(a => (
                  <div className="card" key={a.id} style={{ borderLeft: '4px solid var(--color-teacher)' }}>
                    <h3>{a.title}</h3>
                    <p style={{ marginTop: '1rem' }}>{a.content}</p>
                    <small style={{ display: 'block', marginTop: '1rem', color: 'var(--text-light)' }}>Publicado el {new Date(a.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center' }}>No hay anuncios nuevos.</div>
                )}
              </div>
            </>
          )}

          {/* Modal Carga de Estudiante */}
          {showModal && modalType === 'student' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-teacher)' }}>Registrar Estudiante</h2>
                <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid grid-cols-2">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input className="input-field" value={newStudent.nombre} onChange={e => setNewStudent({...newStudent, nombre: e.target.value})} required placeholder="Ej: Pedro" />
                    </div>
                    <div className="form-group">
                      <label>Apellido</label>
                      <input className="input-field" value={newStudent.apellido} onChange={e => setNewStudent({...newStudent, apellido: e.target.value})} required placeholder="Ej: López" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="form-group"><label>DNI (Legajo)</label><input className="input-field" value={newStudent.dni} onChange={e => setNewStudent({...newStudent, dni: e.target.value})} required /></div>
                    <div className="form-group"><label>Instituto</label><input className="input-field" value={newStudent.instituto} onChange={e => setNewStudent({...newStudent, instituto: e.target.value})} required /></div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="form-group"><label>Teléfono</label><input className="input-field" value={newStudent.telefono} onChange={e => setNewStudent({...newStudent, telefono: e.target.value})} required /></div>
                    <div className="form-group"><label>Email</label><input className="input-field" type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} required /></div>
                  </div>
                  <div className="form-group"><label>Emergencia</label><input className="input-field" value={newStudent.emergencia} onChange={e => setNewStudent({...newStudent, emergencia: e.target.value})} required /></div>
                  <div className="form-group"><label>Alergias</label><input className="input-field" value={newStudent.alergias} onChange={e => setNewStudent({...newStudent, alergias: e.target.value})} required /></div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={loading} className="btn btn-teacher" style={{ flex: 1 }}>{loading ? 'Registrando...' : 'Registrar Estudiante'}</button>
                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid var(--border)' }}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Nuevo Listado Personalizado */}
          {showModal && modalType === 'customList' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-teacher)' }}>Nuevo Listado</h2>
                <form onSubmit={handleCreateListado} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Curso / Año</label>
                    <input className="input-field" value={newListado.curso} onChange={e => setNewListado({...newListado, curso: e.target.value})} required placeholder="Ej: 1°1°" />
                  </div>
                  <div className="form-group">
                    <label>Profesorado / Carrera</label>
                    <input className="input-field" value={newListado.profesorado} onChange={e => setNewListado({...newListado, profesorado: e.target.value})} required placeholder="Ej: Profesorado de Biología" />
                  </div>
                  <div className="form-group">
                    <label>Institución</label>
                    <input className="input-field" value={newListado.institucion} onChange={e => setNewListado({...newListado, institucion: e.target.value})} required placeholder="Ej: ISFD 103" />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={loading} className="btn btn-teacher" style={{ flex: 1 }}>{loading ? 'Creando...' : 'Crear Listado'}</button>
                    <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid var(--border)' }}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
