import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { gpdDb } from '../firebase';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';
import { Users, FileText, LayoutGrid, Eye, MapPin, Stethoscope, Mail, Phone, ChevronLeft, Plus, Trash2, X } from 'lucide-react';

export default function GPDApp() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ practicantes: 0, listados: 0 });

  useEffect(() => {
    // Para simplificar, obtenemos los totales directamente al montar la app
    const fetchStats = async () => {
      try {
        const snapPracticantes = await getDocs(collection(gpdDb, 'practicantes'));
        const snapListados = await getDocs(collection(gpdDb, 'listados'));
        const snapInstitutos = await getDocs(collection(gpdDb, 'institutos'));
        setStats({ 
          practicantes: snapPracticantes.size, 
          listados: snapListados.size,
          institutos: snapInstitutos.size
        });
      } catch (err) {
        console.error("Error cargando estadísticas GPD", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Routes>
      <Route index element={<GPDHome stats={stats} />} />
      <Route path="practicantes" element={<GPDPracticantesDatabase />} />
      <Route path="listados" element={<GPDListados />} />
      <Route path="institutos" element={<GPDInstitutos />} />
    </Routes>
  );
}

function GPDHome({ stats }) {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn" onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ec4899', marginBottom: '0.2rem' }}>Gestión de Prácticas Docentes (GPD)</h1>
          <p style={{ color: 'var(--text-light)' }}>Sistema Integrado de control y nominalización del Profesorado.</p>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #ec4899' }}>
           <div style={{ background: '#fce7f3', padding: '1rem', borderRadius: '12px', color: '#ec4899' }}>
             <Users size={32} />
           </div>
           <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.6 }}>TOTAL DE PRACTICANTES R.S.</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.practicantes}</h2>
           </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
           <div style={{ background: '#ede9fe', padding: '1rem', borderRadius: '12px', color: '#8b5cf6' }}>
             <FileText size={32} />
           </div>
           <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.6 }}>LISTADOS CREADOS</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.listados}</h2>
           </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
           <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '12px', color: '#3b82f6' }}>
             <LayoutGrid size={32} />
           </div>
           <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.6 }}>INSTITUTOS (ISFD)</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.institutos || 0}</h2>
           </div>
        </div>
      </div>

      <DashboardGrid>
        <DashboardCard 
          role="admin"
          color="#ec4899"
          title="Base de Datos de Practicantes"
          description="Accede al padrón de todos los estudiantes de ISFD inscriptos."
          icon={<Users size={28} />}
          href="/dashboard/gpd/practicantes"
        />
        <DashboardCard 
          role="admin"
          color="#8b5cf6"
          title="Listados de Práctica"
          description="Gestión oficial de listados estructurados por instituto y profesorado."
          icon={<FileText size={28} />}
          href="/dashboard/gpd/listados"
        />
        <DashboardCard 
          role="admin"
          color="#3b82f6"
          title="Gestión de Institutos"
          description="Directorio de Institutos (ISFD) co-formadores."
          icon={<LayoutGrid size={28} />}
          href="/dashboard/gpd/institutos"
        />
      </DashboardGrid>
    </div>
  );
}

function GPDPracticantesDatabase() {
  const [practicantes, setPracticantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPracticantes = async () => {
      try {
        const snap = await getDocs(collection(gpdDb, 'practicantes'));
        setPracticantes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPracticantes();
  }, []);

  if (selected) return <GPDDetail practicante={selected} onBack={() => setSelected(null)} />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={() => navigate('/dashboard/gpd')} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ec4899' }}>Base de Datos de Practicantes</h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando base de datos...</p> : (
          <table>
            <thead>
              <tr>
                <th>Apellido y Nombre</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Instituto Superior</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
               {practicantes.map(p => (
                 <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.apellido?.toUpperCase()}, {p.nombre}</td>
                    <td>{p.dni}</td>
                    <td>{p.telefono}</td>
                    <td>{p.instituto}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn" onClick={() => setSelected(p)} style={{ color: '#ec4899', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Eye size={16} /> Ver Más
                      </button>
                    </td>
                 </tr>
               ))}
               {practicantes.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>No hay practicantes registrados aún.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function GPDDetail({ practicante: p, onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={onBack} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ec4899' }}>Perfil del Practicante</h1>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
         <div className="card">
            <h3 style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: '#ec4899' }}>Datos Personales e Institucionales</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6 }}>APELLIDO Y NOMBRE</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{p.apellido?.toUpperCase()}, {p.nombre}</p>
               </div>
               <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6 }}>DOCUMENTO (DNI)</p>
                  <p style={{ fontWeight: 600 }}>{p.dni}</p>
               </div>
               <div style={{ padding: '1rem', background: '#fdf4ff', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6, color: '#be185d' }}>INSTITUTO DE PERTENENCIA</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#9d174d' }}>{p.instituto} <span style={{ opacity: 0.5 }}>- {p.distrito}</span></p>
               </div>
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
               <h3 style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Mail size={18} /> Contacto y Residencia
               </h3>
               <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                 <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.6, fontWeight: 700, fontSize: '0.75rem' }}><Mail size={14} /> CORREO</div>
                    <p style={{ fontWeight: 600 }}>{p.email}</p>
                 </div>
                 <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.6, fontWeight: 700, fontSize: '0.75rem' }}><Phone size={14} /> TELÉFONO</div>
                    <p style={{ fontWeight: 600 }}>{p.telefono}</p>
                 </div>
                 <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.6, fontWeight: 700, fontSize: '0.75rem' }}><MapPin size={14} /> DOMICILIO</div>
                    <p style={{ fontWeight: 600 }}>{p.direccion}, {p.localidad}</p>
                 </div>
               </div>
            </div>

            <div className="card" style={{ border: '1px solid #fed7aa', background: '#fff7ed' }}>
               <h3 style={{ color: '#c2410c', borderBottom: '1px solid #fed7aa', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Stethoscope size={18} /> Datos de Salud / Alergias
               </h3>
               <p style={{ fontWeight: 500, fontSize: '0.95rem', color: '#9a3412' }}>{p.salud || 'Sin observaciones medicas detalladas.'}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function GPDListados() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={() => navigate('/dashboard/gpd')} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>Listados de Práctica</h1>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid #8b5cf6' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Listado de Práctica Docente</h2>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.8 }}>Instituto Superior de Formación Docente N° 41 - Distrito Almirante Brown</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Profesorado de Historia, 4to Año</p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Apellido</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Nombre</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>DNI</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Teléfono</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>Correo electrónico</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo estático del formato solicitado */}
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Pérez</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Juan Carlos</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>33.456.789</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>11-1234-5678</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>jperez@gmail.com</td>
              </tr>
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                  <p>Módulo de asignación dinámica en desarrollo.</p>
                  <button className="btn btn-primary" style={{ marginTop: '1rem', background: '#8b5cf6' }}>+ Crear Nuevo Listado</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GPDInstitutos() {
  const navigate = useNavigate();
  const [institutos, setInstitutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', distrito: '', direccion: '', telefono: '', correo: '', director: ''
  });

  const fetchInstitutos = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(gpdDb, 'institutos'));
      setInstitutos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInstitutos();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.distrito) return;
    try {
      await addDoc(collection(gpdDb, 'institutos'), formData);
      setFormData({ nombre: '', distrito: '', direccion: '', telefono: '', correo: '', director: '' });
      setIsAdding(false);
      fetchInstitutos();
    } catch (err) {
      console.error(err);
      alert('Error al guardar: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este Instituto?")) return;
    try {
      await deleteDoc(doc(gpdDb, 'institutos', id));
      fetchInstitutos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/dashboard/gpd')} style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>Directorio de Institutos</h1>
        </div>
        {!isAdding && (
          <button className="btn btn-primary" style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsAdding(true)}>
            <Plus size={18} /> Cargar Instituto
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid #3b82f6', background: '#eff6ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1d4ed8' }}>Cargar Nuevo Instituto (ISFD)</h3>
            <button className="btn" onClick={() => setIsAdding(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label>Nombre del Instituto *</label>
                <input required className="input-field" placeholder="Ej: ISFD N°41" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Distrito *</label>
                <input required className="input-field" placeholder="Ej: Alte. Brown" value={formData.distrito} onChange={e => setFormData({...formData, distrito: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input className="input-field" placeholder="Calle y N°" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Teléfono de Contacto</label>
                <input className="input-field" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Correo Electrónico Oficial</label>
                <input type="email" className="input-field" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Director/a a cargo</label>
                <input className="input-field" value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ background: '#3b82f6' }}>Guardar Instituto</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando institutos...</p> : (
          <table>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>Instituto Superior</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>Distrito</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>Contacto</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {institutos.map(inst => (
                <tr key={inst.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#1e293b' }}>{inst.nombre}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>{inst.distrito}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <p><strong>Tel:</strong> {inst.telefono || '-'}</p>
                      <p><strong>Email:</strong> {inst.correo || '-'}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <button className="btn" onClick={() => handleDelete(inst.id)} style={{ color: '#ef4444', padding: '0.5rem' }} title="Eliminar Instituto">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {institutos.length === 0 && (
                <tr>
                   <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>No hay Institutos cargados en la base de datos.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
