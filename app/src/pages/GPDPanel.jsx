import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ClipboardList, LogOut, FileText, CheckCircle, Clock, Camera, Loader2, Trash2 } from 'lucide-react';
import { auth, db, gpdAuth, gpdDb, gpdStorage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Selector de Rol Persistente */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px', marginRight: '0.5rem' }}>
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{ 
                padding: '0.4rem 1rem', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, 
                cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.8)'
              }}
            >
              Principal
            </button>
            <button 
              onClick={() => navigate('/gpd-panel')} 
              style={{ 
                padding: '0.4rem 1rem', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, 
                cursor: 'pointer', background: 'white', color: '#ec4899', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Portal GPD
            </button>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{profile?.nombre} {profile?.apellido}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{profile?.type === 'estudiante' ? 'Estudiante Practicante' : 'Docente / Referente'}</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {(profile?.photoURL || profile?.fotoURL) ? (
              <img 
                src={profile?.photoURL || profile?.fotoURL} 
                alt="User" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : <GraduationCap size={20} color="#ec4899" />}
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

        {activeTab === 'inicio' && <Welcome profile={profile} setProfile={setProfile} />}
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

function Welcome({ profile, setProfile }) {
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("La imagen es demasiado grande. El máximo permitido es 2MB.");
    
    setUploading(true);
    try {
      const photoRef = ref(gpdStorage, `fotos_4x4/${profile.id}`);
      await uploadBytes(photoRef, file, { contentType: file.type });
      const photoURL = await getDownloadURL(photoRef);
      
      const collectionName = profile.type === 'docente' ? 'docentes_practica' : 'practicantes';
      await updateDoc(doc(gpdDb, collectionName, profile.id), { photoURL });
      
      setProfile(prev => ({ ...prev, photoURL }));
      alert("¡Foto de legajo actualizada correctamente!");
    } catch (err) {
      console.error(err);
      alert("Error al subir la nueva imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
        <div style={{ width: '100%', height: '100%', background: '#fdf2f8', color: '#ec4899', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid #fbcfe8' }}>
          {uploading ? <Loader2 size={40} className="animate-spin" /> : (
            (profile?.photoURL || profile?.fotoURL) ? (
              <img 
                src={profile?.photoURL || profile?.fotoURL} 
                alt="Foto de Legajo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : <GraduationCap size={60} />
          )}
        </div>
        {!uploading && (
           <>
            <label htmlFor="photo-update" style={{
              position: 'absolute', bottom: '-8px', right: '-8px', background: '#ec4899', color: 'white', padding: '6px', borderRadius: '50%',
              cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Camera size={16} />
            </label>
            <input type="file" id="photo-update" style={{ display: 'none' }} accept="image/*" onChange={handlePhotoChange} />
           </>
        )}
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
      try {
        // Traemos las pendientes
        const qAsignadas = query(collection(gpdDb, 'practicas_asignadas'), where('practicanteId', '==', profile.id));
        const snapAsignadas = await getDocs(qAsignadas);
        const asignadas = snapAsignadas.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'Pendiente' }));

        // Traemos las ya aprobadas/confirmadas
        const studentFullName = `${profile.nombre} ${profile.apellido}`.trim();
        const qDocentes = query(collection(gpdDb, 'practicas_docentes'), where('residente', '==', studentFullName));
        const snapDocentes = await getDocs(qDocentes);
        const aprobadas = snapDocentes.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(), 
          tipo: 'Aprobada',
          estudiante_nombre: doc.data().residente,
          fechaInscripcion: doc.data().createdAt
        }));

        setPracticas([...asignadas, ...aprobadas]);
      } catch (err) {
        console.error("Error fetching my practices:", err);
      }
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
               <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: p.tipo === 'Aprobada' ? '#10b981' : '#f59e0b' }}>
                    {p.tipo === 'Aprobada' ? 'APROBADA' : 'PENDIENTE'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}><Clock size={12} /> {p.estado}</span>
                  <button 
                    onClick={() => {
                        const win = window.open('', '_blank');
                        win.document.write(`
                          <html>
                            <head>
                              <title>Comprobante de Inscripción GPD - EES 21</title>
                              <style>
                                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
                                * { box-sizing: border-box; }
                                body { font-family: 'Inter', sans-serif; padding: 20px; color: #1e293b; line-height: 1.5; }
                                .document { border: 2px solid #e2e8f0; padding: 40px; max-width: 800px; margin: 0 auto; position: relative; }
                                .header { display: flex; align-items: start; justify-content: space-between; border-bottom: 3px solid #ec4899; padding-bottom: 20px; margin-bottom: 40px; }
                                .logo-img { height: 70px; }
                                .school-info { text-align: right; }
                                .school-info h2 { margin: 0; color: #ec4899; font-size: 1.25rem; font-weight: 800; }
                                .school-info p { margin: 2px 0; font-size: 0.8rem; color: #64748b; }
                                .title-bar { text-align: center; margin-bottom: 40px; }
                                .title-bar h1 { font-size: 1.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border: 2px solid #0f172a; display: inline-block; padding: 10px 30px; margin: 0; }
                                .section { margin-bottom: 30px; }
                                .section-title { font-size: 0.9rem; font-weight: 800; color: #ec4899; text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; }
                                .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                                .field { margin-bottom: 12px; }
                                .label { font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
                                .value { font-size: 1rem; font-weight: 600; color: #1e293b; }
                                .verified-badge { position: absolute; top: 150px; right: 40px; transform: rotate(15deg); border: 4px solid #10b981; color: #10b981; padding: 10px; border-radius: 8px; font-weight: 900; opacity: 0.3; }
                                .signatures { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; text-align: center; }
                                .sig-line { border-top: 1px solid #1e293b; margin-top: 60px; padding-top: 10px; font-size: 0.75rem; font-weight: 700; }
                                .footer { margin-top: 40px; font-size: 0.65rem; color: #94a3b8; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 20px; }
                                @media print { .no-print { display: none; } body { padding: 0; } .document { border: none; } }
                              </style>
                            </head>
                            <body>
                              <div class="document">
                                <div class="header">
                                  <div style="display: flex; align-items: center; gap: 1rem;">
                                    <img src="https://cdn.phototourl.com/member/2026-04-01-18b3281e-b51e-4ec6-b664-ab4e364d159d.png" class="logo-img">
                                    <div style="border-left: 2px solid #ec4899; padding-left: 1rem;">
                                      <h2 style="font-size: 1rem; margin: 0; color: #ec4899;">Unidad Académica Normal Superior</h2>
                                      <h3 style="font-size: 0.9rem; margin: 0; color: #1e293b;">"Antonio Mentruyt" - EES N° 21</h3>
                                    </div>
                                  </div>
                                  <div class="school-info">
                                    <p>Distrito Lomas de Zamora</p>
                                    <p>Manuel Castro 990, Lomas de Zamora</p>
                                    <p>secundaria21lomasdezamora@abc.gob.ar</p>
                                  </div>
                                </div>
                                <div class="verified-badge">SISTEMA GPD<br>PROCESADO</div>
                                <div class="title-bar">
                                  <h1>Comprobante de Inscripción</h1>
                                  <p style="font-size: 0.8rem; margin-top: 10px;">Gestión de Prácticas Docentes (GPD)</p>
                                </div>
                                <div class="section">
                                  <div class="section-title">Datos del Residente</div>
                                  <div class="data-grid">
                                    <div class="field"><div class="label">Estudiante</div> <div class="value">${p.estudiante_nombre}</div></div>
                                    <div class="field"><div class="label">DNI</div> <div class="value">${profile?.dni || '-'}</div></div>
                                    <div class="field"><div class="label">Instituto (ISFD)</div> <div class="value">${p.instituto || profile?.instituto || '-'}</div></div>
                                    <div class="field"><div class="label">Docente de Práctica</div> <div class="value">${profile?.docente_practica || '-'}</div></div>
                                    <div class="field"><div class="label">Carrera</div> <div class="value">${p.profesorado}</div></div>
                                    <div class="field"><div class="label">Fecha Inscripción</div> <div class="value">${new Date(p.fechaInscripcion?.seconds * 1000 || p.fechaInscripcion || Date.now()).toLocaleString()}</div></div>
                                  </div>
                                </div>
                                <div class="section">
                                  <div class="section-title">Datos de la Práctica (EES 21)</div>
                                  <div class="data-grid">
                                    <div class="field"><div class="label">Materia</div> <div class="value">${p.materia} (${p.pid})</div></div>
                                    <div class="field"><div class="label">Curso / División</div> <div class="value">${p.curso}</div></div>
                                    <div class="field"><div class="label">Docente Co-formador</div> <div class="value">${p.coformador}</div></div>
                                    <div class="field"><div class="label">Horario Tentativo</div> <div class="value">${p.horario}</div></div>
                                  </div>
                                </div>
                                <div class="section" style="display: flex; justify-content: center; margin-top: 40px; flex-direction: column; align-items: center; border-top: 2px dashed #e2e8f0; padding-top: 40px;">
                                  <div class="label" style="margin-bottom: 10px;">Código QR de Validación Institucional</div>
                                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GPD-EES21-${p.id}-${p.estudiante_nombre}" style="width: 150px; height: 150px; border: 10px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                  <p style="font-size: 0.6rem; color: #64748b; margin-top: 10px; font-weight: 700;">TOKEN: ${p.id}</p>
                                </div>
                                <div class="footer">
                                  Este documento es un comprobante oficial de pre-inscripción emitido por la plataforma GPD de la EES 21.<br>
                                  Validado digitalmente el ${new Date().toLocaleString()}
                                </div>
                              </div>
                              <script>window.print();</script>
                            </body>
                          </html>
                        `);
                        win.document.close();
                    }}
                    style={{ border: 'none', background: 'none', color: '#10b981', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}
                    title="Descargar Comprobante"
                  >
                    <FileText size={18} />
                  </button>
                  {p.tipo === 'Pendiente' && (
                    <button 
                      onClick={async (e) => {
                         e.stopPropagation();
                         if (window.confirm("¿Estás seguro que deseas ANULAR esta inscripción y liberar el cupo?")) {
                            try {
                               await deleteDoc(doc(gpdDb, 'practicas_asignadas', p.id));
                               setPracticas(prev => prev.filter(item => item.id !== p.id));
                               alert("Inscripción anulada correctamente.");
                            } catch (err) {
                               alert("Error al anular: " + err.message);
                            }
                         }
                      }}
                      style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}
                      title="Anular Inscripción"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
               </div>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{p.curso}</h3>
            <p style={{ fontSize: '0.85rem', color: '#1e293b' }}>{p.materia}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Prof. Co-formador: <strong>{p.coformador}</strong></p>
            <p style={{ fontSize: '0.85rem', color: '#be185d', fontWeight: 700, marginTop: '0.5rem', background: '#fdf2f8', padding: '0.5rem', borderRadius: '6px' }}>
               <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> {p.horario || 'Sin horario cargado'}
            </p>
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
  const [habilitadas, setHabilitadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalEnabled, setGlobalEnabled] = useState(true);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const settingsSnap = await getDoc(doc(gpdDb, 'settings', 'inscripciones'));
        if (settingsSnap.exists() && settingsSnap.data().enabled === false) {
          setGlobalEnabled(false);
          setLoading(false);
          return;
        }

        if (!profile?.profesorado) {
          setLoading(false);
          return;
        }

        // 1. Identificar Carrera y Materias Habilitadas (Relación Alumno -> Profesorado)
        let profesoradoData = null;
        const cleanProfName = profile.profesorado.trim();
        const profSnapExact = await getDocs(query(collection(gpdDb, 'profesorados'), where('nombre', '==', cleanProfName)));

        if (!profSnapExact.empty) {
          profesoradoData = profSnapExact.docs[0].data();
        } else {
          const allProfsSnap = await getDocs(collection(gpdDb, 'profesorados'));
          profesoradoData = allProfsSnap.docs.map(d => ({ id: d.id, ...d.data() })).find(p => 
            p.nombre.toLowerCase().includes(cleanProfName.toLowerCase()) || 
            cleanProfName.toLowerCase().includes(p.nombre.toLowerCase())
          );
        }
        
        if (!profesoradoData) {
          console.warn("DEBUG: Carrera no mapeada:", cleanProfName);
          setLoading(false);
          return;
        }

        const codigosMateria = (profesoradoData.materias || "").split(',').map(c => c.trim().toUpperCase()).filter(c => c !== "");
        setHabilitadas(codigosMateria);
        console.log("Sincronizando vacantes para PIDs:", codigosMateria);

        // 2. Traer TODAS las ofertas ABIERTAS (Evitamos fallos por filtros parciales)
        const qOffers = query(collection(gpdDb, 'practicas_ofertas'), where('estado', '==', 'Abierta'));
        const snapOffers = await getDocs(qOffers);
        const allOpenOffers = snapOffers.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Filtrar localmente por los PIDs habilitados de la carrera
        const relevantOffers = allOpenOffers.filter(o => codigosMateria.includes(o.pid?.toUpperCase()));

        // 4. Verificar qué materias ya tiene el alumno inscriptas para deshabilitar botón
        const qAsig = query(collection(gpdDb, 'practicas_asignadas'), where('practicanteId', '==', profile.id));
        const snapAsig = await getDocs(qAsig);
        const myInscrIDs = snapAsig.docs.map(d => d.data().oferta_id);

        // 5. Enriquecer con horarios y cupos
        const enrichedOfertas = await Promise.all(relevantOffers.map(async (o) => {
           try {
              let enriched = { 
                ...o, 
                docente: o.coformador,
                alreadyInscribed: myInscrIDs.includes(o.id)
              };

              // Horarios Oficiales (db institucional)
              const c = o.curso.trim().toUpperCase();
              const variations = [c, c.replace(/\s+/g, ''), c.replace(/(\d+°)\s*(\d+°)/, "$1 $2")];
              const qHor = query(collection(db, 'materias_horarios'), where('materia', '==', o.pid), where('curso', 'in', [...new Set(variations)]));
              const snapHor = await getDocs(qHor);
              if (!snapHor.empty) {
                 const h = snapHor.docs[0].data();
                 if (h.bloques) enriched.officialHorario = h.bloques.map(b => `${b.dia.substring(0,3)} ${b.desde}-${b.hasta}`).join(', ');
              }

              // Conteo de cupos (gpdDb)
              const qCheck = query(collection(gpdDb, 'practicas_asignadas'), where('oferta_id', '==', o.id));
              const snapCheck = await getDocs(qCheck);
              enriched.inscriptos = snapCheck.docs.length;

              return enriched;
           } catch (e) { console.error("Error enriqueciendo oferta", o.pid, e); return o; }
        }));

        setOfertas(enrichedOfertas);
      } catch (err) { console.error("Error crítico en portal de inscripciones:", err); }
      setLoading(false);
    };

    fetchOfertas();
  }, [profile?.id, profile?.profesorado]);

  const handleInscribir = async (oferta) => {
    if (oferta.alreadyInscribed) {
       return alert("Ya te encuentras inscripto en esta materia y horario.");
    }
    const confirmText = `¿Estás seguro que deseas inscribirte en ${oferta.materia} (${oferta.curso})\ncon Prof. ${oferta.docente}?\n\nHorario: ${oferta.officialHorario || oferta.horario}`;
    if (!window.confirm(confirmText)) return;

    setLoading(true);
    try {
      // Re-verificar cupo real por ID de oferta
      const qCheck = query(collection(gpdDb, 'practicas_asignadas'), where('oferta_id', '==', oferta.id));
      const snapCheck = await getDocs(qCheck);
      const inscriptosCount = snapCheck.docs.length;
      const cupoMaximo = oferta.cupo_maximo || 2;

      if (inscriptosCount >= cupoMaximo) {
        setLoading(false);
        return alert(`Lo sentimos, el cupo se ha completado hace unos segundos.`);
      }

      // Proceder con la inscripción
      const data = {
        practicanteId: profile?.id || "",
        estudiante_nombre: `${profile?.nombre || ""} ${profile?.apellido || ""}`.trim(),
        estudiante_email: profile?.email || "",
        profesorado: profile?.profesorado || "No Def.",
        profesorado_id: profile?.profesoradoId || profile?.profesorado_id || "",
        oferta_id: oferta?.id || "",
        pid: oferta?.pid || "",
        materia: oferta?.materia || "",
        curso: oferta?.curso || "",
        coformador: oferta?.coformador || "",
        horario: oferta?.officialHorario || oferta?.horario || "",
        estado: 'Inscripto - Pendiente',
        fechaInscripcion: new Date(),
        updatedAt: new Date()
      };
      await addDoc(collection(gpdDb, 'practicas_asignadas'), data);
      alert("¡Inscripción exitosa! Recuerda descargar tu comprobante desde la pestaña 'Mis Prácticas'.");
      window.location.reload();
    } catch (err) { 
       console.error(err);
       alert("Error al procesar la inscripción: " + err.message); 
    } finally {
       setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Sincronizando portal de prácticas...</div>;
  if (!globalEnabled) {
    return (
      <div className="card" style={{ padding: '4rem', textAlign: 'center', background: '#f1f5f9' }}>
         <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#64748b' }}>Portal Cerrado</h1>
         <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Las inscripciones a prácticas no están habilitadas en este momento.</p>
         <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>Consulte con el Equipo de Conducción de la EES N° 21 por próximas vacantes.</p>
      </div>
    );
  }

  if (!profile?.profesorado) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ color: '#ec4899' }}>Carrera no detectada</h3>
        <p>No tienes una carrera de profesorado asignada a tu legajo. Por favor, contacta al administrador.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Inscripciones Disponibles</h2>
      <p style={{ color: '#64748b', marginBottom: '0.25rem' }}>Mostrando vacantes para: <strong>{profile.profesorado}</strong></p>
      <div style={{ marginBottom: '2rem', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px' }}>
         Materias habilitadas para este profesorado: {habilitadas.length > 0 ? habilitadas.join(', ') : 'Ninguna materia configurada.'}
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Materia (PID)</th><th>Curso</th><th>Docente</th><th>Día/Hora</th><th>Cupo</th><th>Acción</th></tr></thead>
          <tbody>
            {ofertas.map(o => (
              <tr key={o.id}>
                <td><strong style={{ color: '#ec4899' }}>({o.pid})</strong> {o.materia}</td>
                <td style={{ fontWeight: 800 }}>{o.curso}</td>
                <td style={{ fontSize: '0.85rem' }}>
                  {o.docente ? (
                    <>
                      <div style={{ fontWeight: 700 }}>{o.docente}</div>
                      {o.situacion === 'Suplente' && <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800 }}>(SUP)</span>}
                    </>
                  ) : <span style={{ opacity: 0.5 }}>-</span>}
                </td>
                <td style={{ fontSize: '0.8rem' }}>{o.officialHorario || o.horario || 'Sin horario cargado'}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: (o.cupo_maximo - o.inscriptos) <= 0 ? '#ef4444' : '#15803d' }}>
                    {(o.cupo_maximo || 2) - (o.inscriptos || 0)}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>de {o.cupo_maximo || 2} vacantes</div>
                </td>
                <td>
                  {o.alreadyInscribed ? (
                    <button className="btn" disabled style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '0.8rem', cursor: 'not-allowed' }}>Inscripto</button>
                  ) : ((o.cupo_maximo || 2) - (o.inscriptos || 0)) > 0 ? (
                    <button className="btn btn-primary" onClick={() => handleInscribir(o)} style={{ background: '#ec4899', fontSize: '0.8rem' }}>Inscribirme</button>
                  ) : (
                    <button className="btn" disabled style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '0.8rem', cursor: 'not-allowed' }}>Sin Vacantes</button>
                  )}
                </td>
              </tr>
            ))}
            {ofertas.length === 0 && !loading && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No hay vacantes abiertas para tu profesorado actualmente.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
