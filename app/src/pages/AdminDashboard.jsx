import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, BookOpen, Clock, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { db, auth } from '../firebase';
// Para crear usuarios en Auth sin cerrar sesión del Admin
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  const [stats, setStats] = useState({ practices: 0, students: 0, teachers: 0 });
  const [practices, setPractices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('practice'); 
  const [teacherLists, setTeacherLists] = useState([]); // Listados de todos los docentes
  const [selectedTeacherList, setSelectedTeacherList] = useState(null);
  const [listMembers, setListMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [newPractice, setNewPractice] = useState({ courseId: '', subject: '', day: '', time: '', shift: 'Mañana', cupos: 10 });
  const [newCourse, setNewCourse] = useState({ name: '', level: 'Ciclo Básico', shift: 'Mañana', orientation: '' });
  const [newSubject, setNewSubject] = useState({ name: '', level: 'Ciclo Básico', orientation: '' });
  const [newTeacher, setNewTeacher] = useState({ email: '', password: '', name: '', dni: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', date: new Date().toISOString() });

  // Suscripción a datos de Firestore
  useEffect(() => {
    // Escuchar estudiantes (para stats)
    const qStudents = query(collection(db, 'users'), where('role', '==', 'estudiante'));
    const unsubStudents = onSnapshot(qStudents, (snap) => setStats(prev => ({ ...prev, students: snap.size })));

    // Escuchar docentes (stats + lista)
    const qTeachers = query(collection(db, 'users'), where('role', '==', 'docente'));
    const unsubTeachers = onSnapshot(qTeachers, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachersList(docs);
      setStats(prev => ({ ...prev, teachers: docs.length }));
    });

    // Escuchar cursos
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
      setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Escuchar materias
    const unsubSubjects = onSnapshot(collection(db, 'subjects'), (snap) => {
      setSubjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Escuchar estudiantes (lista completa)
    const qStudentsList = query(collection(db, 'users'), where('role', '==', 'estudiante'));
    const unsubStudentsList = onSnapshot(qStudentsList, (snap) => {
      setStudentsList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStats(prev => ({ ...prev, students: snap.size }));
    });

    // Escuchar anuncios
    const unsubAnuncios = onSnapshot(collection(db, 'announcements'), (snap) => {
      setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Escuchar prácticas
    const unsubPractices = onSnapshot(collection(db, 'practices'), (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPractices(docs);
      setStats(prev => ({ ...prev, practices: docs.length }));
    });

    // 8. Escuchar todos los listados de docentes
    const unsubTeacherLists = onSnapshot(collection(db, 'teacher_lists'), (snap) => {
      setTeacherLists(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubStudents(); unsubTeachers(); unsubCourses(); unsubSubjects(); unsubPractices(); 
      unsubStudentsList(); unsubAnuncios(); unsubTeacherLists();
    };
  }, []);

  useEffect(() => {
    if (!selectedTeacherList) { setListMembers([]); return; }
    const q = query(collection(db, 'list_members'), where('listId', '==', selectedTeacherList.id));
    return onSnapshot(q, (snap) => {
      setListMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [selectedTeacherList]);


  const handleAddData = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'announcement') {
        if (isEditing) await updateDoc(doc(db, 'announcements', editId), newAnnouncement);
        else await addDoc(collection(db, 'announcements'), { ...newAnnouncement, createdAt: new Date().toISOString() });
      }
      if (modalType === 'practice') {
        if (isEditing) await updateDoc(doc(db, 'practices', editId), newPractice);
        else await addDoc(collection(db, 'practices'), newPractice);
      }
      if (modalType === 'course') {
        if (isEditing) await updateDoc(doc(db, 'courses', editId), newCourse);
        else await addDoc(collection(db, 'courses'), newCourse);
      }
      if (modalType === 'subject') {
        if (isEditing) await updateDoc(doc(db, 'subjects', editId), newSubject);
        else await addDoc(collection(db, 'subjects'), newSubject);
      }
      if (modalType === 'teacher') {
        const secondaryApp = initializeApp(auth.app.options, `SecondaryTeacher-${Date.now()}`);
        const secondaryAuth = getAuth(secondaryApp);
        const userCred = await createUserWithEmailAndPassword(secondaryAuth, newTeacher.email, newTeacher.password);
        const { uid } = userCred.user;
        await setDoc(doc(db, 'users', uid), {
          uid,
          email: newTeacher.email,
          name: newTeacher.name,
          dni: newTeacher.dni,
          role: 'docente',
          mustChangePassword: true
        });
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);
      }
      
      setShowModal(false);
      setIsEditing(false);
      setEditId(null);
      setNewPractice({ courseId: '', subject: '', day: '', time: '', shift: 'Mañana', cupos: 10 });
      setNewCourse({ name: '', level: 'Ciclo Básico', shift: 'Mañana', orientation: '' });
      setNewSubject({ name: '', level: 'Ciclo Básico', orientation: '' });
      setNewTeacher({ email: '', password: '', name: '', dni: '' });
      setNewAnnouncement({ title: '', content: '' });
      alert(isEditing ? "¡Actualizado con éxito!" : "¡Guardado con éxito!");
    } catch (err) { 
      console.error("Error al guardar en Firestore:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const deleteItem = async (col, id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await deleteDoc(doc(db, col, id));
    }
  };

  const handleEditSubject = (s) => {
    setNewSubject({ name: s.name, level: s.level, orientation: s.orientation || '' });
    setEditId(s.id);
    setModalType('subject');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleEditCourse = (c) => {
    setNewCourse({ name: c.name, level: c.level, shift: c.shift || 'Mañana', orientation: c.orientation || '' });
    setEditId(c.id);
    setModalType('course');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleEditPractice = (p) => {
    setNewPractice({ courseId: p.courseId, subject: p.subject, day: p.day, time: p.time, shift: p.shift || 'Mañana', cupos: p.cupos });
    setEditId(p.id);
    setModalType('practice');
    setIsEditing(true);
    setShowModal(true);
  };


  const preloadOfficialSubjects = async () => {
    if (!window.confirm("¿Deseas cargar las todas las materias oficiales de la EES 21? (Esto no duplicará si ya existen)")) return;
    setLoading(true);
    try {
      const officialData = [
        // Ciclo Básico (Común a todas)
        { name: "Ciencias Naturales", level: "Ciclo Básico", orientation: "" },
        { name: "Ciencias Sociales", level: "Ciclo Básico", orientation: "" },
        { name: "Educación Artística", level: "Ciclo Básico", orientation: "" },
        { name: "Educación Física", level: "Ciclo Básico", orientation: "" },
        { name: "Inglés", level: "Ciclo Básico", orientation: "" },
        { name: "Matemática", level: "Ciclo Básico", orientation: "" },
        { name: "Prácticas del Lenguaje", level: "Ciclo Básico", orientation: "" },
        { name: "Construcción de Ciudadanía", level: "Ciclo Básico", orientation: "" },
        { name: "Biología", level: "Ciclo Básico", orientation: "" },
        { name: "Físico Química", level: "Ciclo Básico", orientation: "" },
        { name: "Geografía", level: "Ciclo Básico", orientation: "" },
        { name: "Historia", level: "Ciclo Básico", orientation: "" },
        
        // Ciclo Superior - Comunes a todas las orientaciones
        { name: "Literatura", level: "Ciclo Superior", orientation: "" },
        { name: "Matemática (Ciclo Superior)", level: "Ciclo Superior", orientation: "" },
        { name: "Educación Física", level: "Ciclo Superior", orientation: "" },
        { name: "Inglés", level: "Ciclo Superior", orientation: "" },
        { name: "Historia", level: "Ciclo Superior", orientation: "" },
        { name: "Geografía", level: "Ciclo Superior", orientation: "" },
        { name: "NTICx", level: "Ciclo Superior", orientation: "" },
        { name: "Salud y Adolescencia", level: "Ciclo Superior", orientation: "" },
        { name: "Política y Ciudadanía", level: "Ciclo Superior", orientation: "" },
        { name: "Trabajo y Ciudadanía", level: "Ciclo Superior", orientation: "" },
        { name: "Arte", level: "Ciclo Superior", orientation: "" },
        { name: "Filosofía", level: "Ciclo Superior", orientation: "" },

        // Superior - Ciencias Naturales
        { name: "Introducción a la Química", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Introducción a la Física", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Biología (Orientada)", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Ciencias de la Tierra", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Fundamentos de Química", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Física (Orientada)", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Química del Carbono", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Física Clásica y Moderna", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Biología, Genética y Sociedad", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Ambiente, Desarrollo y Sociedad", level: "Ciclo Superior", orientation: "Ciencias Naturales" },
        { name: "Filosofía e Hist. de la Ciencia y Tecn.", level: "Ciclo Superior", orientation: "Ciencias Naturales" },

        // Superior - Ciencias Sociales
        { name: "Psicología", level: "Ciclo Superior", orientation: "Ciencias Sociales" },
        { name: "Comunicación, Cultura y Sociedad", level: "Ciclo Superior", orientation: "Ciencias Sociales" },
        { name: "Economía Política", level: "Ciclo Superior", orientation: "Ciencias Sociales" },
        { name: "Sociología", level: "Ciclo Superior", orientation: "Ciencias Sociales" },
        { name: "Proy. de Investigación en Ciencias Soc.", level: "Ciclo Superior", orientation: "Ciencias Sociales" },

        // Superior - Educación Física
        { name: "Ed. Física y Corporeidad", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Ed. Física y Cultura", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Ed. Física y Comunidad", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Psicología (EF)", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Prácticas deportivas y atléticas", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Prácticas gimnásticas y expresivas I", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Prácticas gimnásticas y expresivas II", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Prácticas deportivas y acuáticas", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Prácticas deportivas y juegos", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Prácticas corporales en Amb. Natural", level: "Ciclo Superior", orientation: "Educación Física" },
        { name: "Diseño y Gestión de Proyectos", level: "Ciclo Superior", orientation: "Educación Física" }
      ];

      for (const s of officialData) {
        // Verificar duplicados básicos
        const exists = subjects.some(sub => sub.name === s.name && sub.level === s.level && sub.orientation === s.orientation);
        if (!exists) {
          await addDoc(collection(db, 'subjects'), s);
        }
      }
      alert("¡Materias oficiales cargadas con éxito!");
    } catch (err) {
      alert("Error al precargar materias.");
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
      {/* Sidebar Admin (Orange) */}
      <aside className="sidebar admin">
        <div className="sidebar-header">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-admin)' }}>Panel Admin</h2>
          <p style={{ fontSize: '0.8rem' }}>EES N°21</p>
        </div>
        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li className={`nav-link ${activeTab === 'resumen' ? 'active' : ''}`} onClick={() => setActiveTab('resumen')}><LayoutDashboard size={20} /> Resumen General</li>
            <li className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}><Clock size={20} /> Generar Anuncios</li>
            <li className={`nav-link ${activeTab === 'cursos' ? 'active' : ''}`} onClick={() => setActiveTab('cursos')}><BookOpen size={20} /> Cursos y Materias</li>
            <li className={`nav-link ${activeTab === 'docentes' ? 'active' : ''}`} onClick={() => setActiveTab('docentes')}><Users size={20} /> Docentes</li>
            <li className={`nav-link ${activeTab === 'estudiantes' ? 'active' : ''}`} onClick={() => setActiveTab('estudiantes')}><Users size={20} style={{ color: 'var(--color-student)' }}/> Base Estudiantes</li>
            <li className={`nav-link ${activeTab === 'listados_docentes' ? 'active' : ''}`} onClick={() => setActiveTab('listados_docentes')}><BookOpen size={20} /> Listados Docentes</li>
            <li className={`nav-link ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')}><Settings size={20} /> Configuración</li>
          </ul>
        </nav>
        <div style={{ padding: '1rem' }}>
          <button className="btn" onClick={handleLogout} style={{ width: '100%', color: 'var(--text-light)' }}><LogOut size={20} /> Salir</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Debug ID: {auth.currentUser?.uid} | {auth.currentUser?.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge" style={{ background: 'var(--bg-admin)', color: 'var(--color-admin)' }}>Super Admin</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-admin)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
          </div>
        </header>

        <section className="content-area">
          {activeTab === 'resumen' && (
            <>
              <div className="header-flex">
                <div>
                  <h1 style={{ marginBottom: '0.5rem' }}>Gestión de Prácticas</h1>
                  <p>Administra capacidades, usuarios y genera reportes.</p>
                </div>
                <button className="btn btn-admin" onClick={() => { setModalType('practice'); setShowModal(true); }}><Plus size={20} /> Nueva Práctica</button>
              </div>

              <div className="grid grid-cols-3">
                <div className="card">
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Prácticas Activas</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-admin)', marginTop: '0.5rem' }}>{stats.practices}</p>
                </div>
                <div className="card">
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Estudiantes Registrados</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginTop: '0.5rem' }}>{stats.students}</p>
                </div>
                <div className="card">
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Docentes Asignados</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginTop: '0.5rem' }}>{stats.teachers}</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Curso</th>
                      <th>Materia</th>
                      <th>Turno</th>
                      <th>Días y Horarios</th>
                      <th>Cupos Restantes</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {practices.map(p => {
                      const courseObj = courses.find(c => c.id === p.courseId);
                      return (
                        <tr key={p.id}>
                          <td>{courseObj ? `${courseObj.name} (${courseObj.shift})` : 'Cargando...'}</td>
                          <td>{p.subject}</td>
                          <td><span className="badge" style={{ background: '#f1f5f9' }}>{p.shift || 'N/A'}</span></td>
                          <td>{p.day}, {p.time}</td>
                          <td>
                            <span className={`badge ${p.cupos > 0 ? 'badge-pending' : ''}`} style={p.cupos === 0 ? { background: '#fef2f2', color: '#ef4444' } : {}}>
                              {p.cupos > 0 ? `${p.cupos} Libres` : 'Lleno'}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '0.2rem' }}>
                            <button className="btn" onClick={() => handleEditPractice(p)} style={{ padding: '0.4rem', color: 'var(--color-admin)' }}><Edit2 size={16} /></button>
                            <button className="btn" onClick={() => deleteItem('practices', p.id)} style={{ padding: '0.4rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      );
                    })}
                    {practices.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No hay prácticas cargadas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'cursos' && (
            <>
              <div className="header-flex">
                <h1>Cursos y Materias</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-admin" onClick={() => { setModalType('course'); setShowModal(true); }}><Plus size={18} /> Nuevo Curso</button>
                  <button className="btn btn-admin" onClick={() => { setModalType('subject'); setShowModal(true); }}><Plus size={18} /> Nueva Materia</button>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="card">
                  <h3>Cursos ({courses.length})</h3>
                  <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                    <table>
                      <thead><tr><th>Nombre</th><th>Turno</th><th>Nivel</th><th>Acción</th></tr></thead>
                      <tbody>
                        {courses.map(c => (
                          <tr key={c.id}>
                            <td>{c.name}</td>
                            <td><span className="badge" style={{ background: '#f1f5f9' }}>{c.shift || 'N/A'}</span></td>
                            <td>{c.level} {c.orientation ? `- ${c.orientation}` : ''}</td>
                            <td>
                               <button className="btn" onClick={() => handleEditCourse(c)}><Edit2 size={16} color="var(--color-admin)"/></button>
                               <button className="btn" onClick={() => deleteItem('courses', c.id)}><Trash2 size={16} color="red"/></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card">
                  <h3>Materias</h3>
                  <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                    <table>
                      <thead><tr><th>Materia</th><th>Ciclo/Orientación</th><th>Acción</th></tr></thead>
                      <tbody>
                        {subjects.map(s => (
                          <tr key={s.id}>
                            <td>{s.name}</td>
                            <td><small>{s.level} {s.orientation ? `(${s.orientation})` : ''}</small></td>
                            <td>
                               <button className="btn" onClick={() => handleEditSubject(s)}><Edit2 size={16} color="var(--color-admin)"/></button>
                               <button className="btn" onClick={() => deleteItem('subjects', s.id)}><Trash2 size={16} color="red"/></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'docentes' && (
            <>
              <div className="header-flex">
                <div>
                    <h1>Docentes</h1>
                    <p>Usuarios con rol de docente registrados en el sistema.</p>
                </div>
                <button className="btn btn-admin" onClick={() => { setModalType('teacher'); setShowModal(true); }}><Plus size={18} /> Nuevo Docente</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Email</th><th>ID único</th><th>Acción</th></tr></thead>
                  <tbody>
                    {teachersList.map(t => (
                      <tr key={t.id}>
                        <td>{t.email}</td>
                        <td><code style={{ fontSize: '0.8rem' }}>{t.uid || t.id}</code></td>
                        <td><button className="btn" onClick={() => deleteItem('users', t.id)}><Trash2 size={16} color="red"/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'estudiantes' && (
            <>
              <div className="header-flex">
                <h1>Base de Datos de Estudiantes</h1>
                <p>Nómina completa de alumnos registrados.</p>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Nombre y Apellido</th><th>DNI</th><th>Email</th><th>Acción</th></tr></thead>
                  <tbody>
                    {studentsList.map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.apellido}, {s.nombre}</strong></td>
                        <td>{s.dni}</td>
                        <td>{s.email}</td>
                        <td><button className="btn" onClick={() => deleteItem('users', s.id)}><Trash2 size={16} color="red"/></button></td>
                      </tr>
                    ))}
                    {studentsList.length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No hay estudiantes registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'announcements' && (
            <>
              <div className="header-flex">
                <h1>Tablero de Anuncios</h1>
                <button className="btn btn-admin" onClick={() => { setModalType('announcement'); setShowModal(true); }}><Plus size={18} /> Crear Anuncio</button>
              </div>
              <div className="grid grid-cols-2">
                {announcements.map(a => (
                  <div className="card" key={a.id} style={{ borderLeft: '4px solid var(--color-admin)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>{a.title}</h3>
                        <button className="btn" onClick={() => deleteItem('announcements', a.id)}><Trash2 size={16} color="red"/></button>
                    </div>
                    <p style={{ marginTop: '1rem' }}>{a.content}</p>
                    <small style={{ color: 'var(--text-light)', marginTop: '1rem', display: 'block' }}>Publicado: {new Date(a.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'listados_docentes' && (
            <>
              <div className="header-flex">
                <div>
                  <h1>Listados por Docente</h1>
                  <p>Supervisa la organización y nómina de los listados creados por los docentes.</p>
                </div>
                {selectedTeacherList && (
                  <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => setSelectedTeacherList(null)}><Plus size={18} style={{ transform: 'rotate(45deg)' }}/> Volver a la vista general</button>
                )}
              </div>

              {!selectedTeacherList ? (
                <div className="grid grid-cols-3">
                  {teacherLists.map(l => {
                    const teacher = teachersList.find(t => t.uid === l.teacherUid);
                    return (
                      <div key={l.id} className="card" style={{ borderLeft: '4px solid #f97316', cursor: 'pointer' }} onClick={() => setSelectedTeacherList(l)}>
                        <h3 style={{ fontSize: '1.2rem' }}>{l.curso}</h3>
                        <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{l.profesorado}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Docente: {teacher ? teacher.name : 'Cargando...'}</p>
                        <p style={{ fontSize: '0.85rem' }}>Institución: {l.institucion}</p>
                        <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '0.8rem', color: '#f97316' }}>Ver alumnos →</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card">
                  <div className="header-flex" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <h2>Nómina de Alumnos: {selectedTeacherList.curso}</h2>
                        <p>{selectedTeacherList.profesorado} - {selectedTeacherList.institucion}</p>
                    </div>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead><tr><th>Nombre y Apellido</th><th>DNI</th><th>Email</th></tr></thead>
                      <tbody>
                        {listMembers.map(m => (
                          <tr key={m.id}>
                            <td><strong>{m.studentName}</strong></td>
                            <td>{m.studentDni}</td>
                            <td>{m.studentEmail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === 'config' && (
            <div className="card">
              <h1>Configuraciones del Sistema</h1>
              <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3>Ajustes Generales</h3>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>Gestión del nombre y ciclo lectivo del establecimiento.</p>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group"><label>Nombre de la Institución</label><input className="input-field" defaultValue="EES N°21" /></div>
                    <div className="form-group"><label>Año Lectivo</label><input className="input-field" defaultValue="2024" /></div>
                    <button className="btn btn-admin">Guardar Cambios</button>
                  </div>
                </div>

                <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--border)' }}>
                  <h3>Carga de Datos Maestros</h3>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>Presiona el botón para cargar automáticamente todas las materias del diseño curricular (Ciclo Básico y Superior por orientación).</p>
                  <button 
                    className="btn btn-teacher" 
                    style={{ marginTop: '1.5rem', width: '100%', padding: '1rem' }}
                    onClick={preloadOfficialSubjects}
                    disabled={loading}
                  >
                    {loading ? 'Cargando materias...' : 'Cargar todas las Materias Oficiales'}
                  </button>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#d97706' }}>Nota: No duplica materias que ya hayan sido creadas con el mismo nombre y ciclo.</p>
                </div>
              </div>
            </div>
          )}

          {/* Modal Dinámico */}
          {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                <h3>{modalType === 'practice' ? 'Nueva Práctica' : modalType === 'course' ? 'Nuevo Curso' : 'Nueva Materia'}</h3>
                <form onSubmit={handleAddData} style={{ marginTop: '1rem' }}>
                  {modalType === 'practice' && (
                    <>
                      <div className="grid grid-cols-2">
                        <div className="form-group">
                          <label>Curso</label>
                          <select className="input-field" value={newPractice.courseId} onChange={e => setNewPractice({...newPractice, courseId: e.target.value, subject: ''})} required>
                            <option value="">Seleccionar Curso...</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name} - {c.shift} ({c.level})</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Materia</label>
                          <select className="input-field" value={newPractice.subject} onChange={e => setNewPractice({...newPractice, subject: e.target.value})} required disabled={!newPractice.courseId}>
                            <option value="">Seleccionar Materia...</option>
                            {subjects.filter(s => {
                              if (!newPractice.courseId) return false;
                              const course = courses.find(c => c.id === newPractice.courseId);
                              if (!course) return false;
                              return s.level === course.level && (s.orientation === '' || s.orientation === course.orientation);
                            }).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="form-group"><label>Día</label><input className="input-field" value={newPractice.day} onChange={e => setNewPractice({...newPractice, day: e.target.value})} placeholder="Lunes" required /></div>
                        <div className="form-group"><label>Horario</label><input className="input-field" value={newPractice.time} onChange={e => setNewPractice({...newPractice, time: e.target.value})} placeholder="08:00 - 10:00" required /></div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="form-group">
                           <label>Turno</label>
                           <select className="input-field" value={newPractice.shift} onChange={e => setNewPractice({...newPractice, shift: e.target.value})}>
                              <option value="Mañana">Mañana</option>
                              <option value="Tarde">Tarde</option>
                              <option value="Vespertino">Vespertino</option>
                           </select>
                        </div>
                        <div className="form-group"><label>Cupos</label><input type="number" className="input-field" value={newPractice.cupos} onChange={e => setNewPractice({...newPractice, cupos: parseInt(e.target.value)})} required /></div>
                      </div>
                    </>
                  )}

                  {modalType === 'course' && (
                    <>
                      <div className="form-group"><label>Nombre del Curso (Ejem: 4° A)</label><input className="input-field" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} placeholder="Ej: 4°A" required /></div>
                      <div className="grid grid-cols-2">
                        <div className="form-group">
                           <label>Turno</label>
                           <select className="input-field" value={newCourse.shift} onChange={e => setNewCourse({...newCourse, shift: e.target.value})}>
                              <option value="Mañana">Mañana</option>
                              <option value="Tarde">Tarde</option>
                              <option value="Vespertino">Vespertino</option>
                           </select>
                        </div>
                        <div className="form-group">
                          <label>Ciclo</label>
                          <select className="input-field" value={newCourse.level} onChange={e => setNewCourse({...newCourse, level: e.target.value, orientation: e.target.value === 'Ciclo Básico' ? '' : newCourse.orientation})}>
                            <option value="Ciclo Básico">Ciclo Básico</option>
                            <option value="Ciclo Superior">Ciclo Superior</option>
                          </select>
                        </div>
                      </div>
                      
                      {newCourse.level === 'Ciclo Superior' && (
                        <div className="form-group">
                          <label>Orientación</label>
                          <select className="input-field" value={newCourse.orientation} onChange={e => setNewCourse({...newCourse, orientation: e.target.value})} required>
                            <option value="">Seleccionar una orientación...</option>
                            <option value="Ciencias Naturales">Ciencias Naturales</option>
                            <option value="Ciencias Sociales">Ciencias Sociales</option>
                            <option value="Educación Física">Educación Física</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {modalType === 'subject' && (
                    <>
                      <div className="form-group"><label>Nombre de la Materia</label><input className="input-field" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} placeholder="Ej: Matemática" required /></div>
                      <div className="grid grid-cols-2">
                        <div className="form-group">
                          <label>Ciclo al que pertenece</label>
                          <select className="input-field" value={newSubject.level} onChange={e => setNewSubject({...newSubject, level: e.target.value, orientation: e.target.value === 'Ciclo Básico' ? '' : newSubject.orientation})}>
                            <option value="Ciclo Básico">Ciclo Básico</option>
                            <option value="Ciclo Superior">Ciclo Superior</option>
                          </select>
                        </div>
                        {newSubject.level === 'Ciclo Superior' && (
                          <div className="form-group">
                            <label>Orientación específica</label>
                            <select className="input-field" value={newSubject.orientation} onChange={e => setNewSubject({...newSubject, orientation: e.target.value})} required>
                              <option value="">Para todas las orientaciones</option>
                              <option value="Ciencias Naturales">Ciencias Naturales</option>
                              <option value="Ciencias Sociales">Ciencias Sociales</option>
                              <option value="Educación Física">Educación Física</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {modalType === 'teacher' && (
                    <>
                      <div className="form-group"><label>Nombre y Apellido</label><input className="input-field" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} placeholder="Julio Pérez" required /></div>
                      <div className="grid grid-cols-2">
                         <div className="form-group"><label>DNI</label><input className="input-field" value={newTeacher.dni} onChange={e => setNewTeacher({...newTeacher, dni: e.target.value})} required /></div>
                         <div className="form-group"><label>Email de Acceso</label><input className="input-field" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} type="email" required /></div>
                      </div>
                      <div className="form-group">
                        <label>Contraseña Temporal</label>
                        <input className="input-field" type="password" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} placeholder="Ej: Docente21*" required />
                        <small style={{ color: 'var(--text-light)' }}>Esta será la clave con la que el docente entrará por primera vez.</small>
                      </div>
                    </>
                  )}

                  {modalType === 'announcement' && (
                    <>
                      <div className="form-group"><label>Título del Anuncio</label><input className="input-field" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} required /></div>
                      <div className="form-group"><label>Contenido</label><textarea className="input-field" rows="4" value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} required /></div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-admin" style={{ flex: 1 }}>{isEditing ? 'Actualizar' : 'Guardar'}</button>
                    <button type="button" className="btn" onClick={() => { setShowModal(false); setIsEditing(false); setEditId(null); }} style={{ flex: 1, border: '1px solid var(--border)' }}>Cancelar</button>
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
