import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Check, Users, FileText, Settings, LayoutGrid, GraduationCap, ClipboardList, Shield, Trash2, Pencil, X, ToggleLeft, ToggleRight, Book, Filter, ListChecks, School, Calendar, Clock, Clipboard, FileCheck, Contact, UserPlus, FileSearch, NotebookTabs, Search, ArrowLeft, Mail, MapPin, Phone, Activity, MoreVertical, Stethoscope, ShieldPlus, Siren, HeartPulse, Save, Hash, MessageSquare, ChevronLeft, ChevronRight, Home, ArrowUpLeft, LayoutDashboard, BookUser, Key } from 'lucide-react';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import MainLayout from '../components/MainLayout';
import { DashboardGrid, DashboardCard } from '../components/DashboardCards';

// --- CATÁLOGO DE CÓDIGOS PID INSTITUCIONALES ---

const PID_CATALOG = {
  "ADS": "Ambiente, Desarrollo y Sociedad",
  "BGS": "Biología, Genética y Sociedad",
  "BLG": "Biología",
  "CCD": "Construcción de Ciudadanía",
  "CCS": "Com., Cultura y Soc.",
  "CDT": "Ciencias de la Tierra",
  "CNT": "Ciencias Naturales",
  "CSC": "Ciencias Sociales",
  "CTU": "Actuación",
  "CYC": "Comunicación y Cult. del Cons.",
  "CYT": "Com. Transf. Soc-Tec. Siglo XXI",
  "DER": "Derecho",
  "DGP": "Diseño y Gestión de Proyectos Turísticos",
  "DIS": "Diseño y Gestión Proy.",
  "EMM": "Elementos de Micro y Macro",
  "EPO": "Economía Política",
  "FCM": "Física Clásica y Moderna",
  "FCO": "Ed. Física y Corporeidad",
  "FCT": "Filosofía e Historia de la Ciencia y Tec.",
  "FDQ": "Fundamentos de la Química",
  "FIA": "Filosofía",
  "FIS": "Física",
  "FQA": "Físico-Química",
  "GGF": "Geografía",
  "GOR": "Gestión Organizacional",
  "HTR": "Historia",
  "IAC": "Introd. Comunicación",
  "IAF": "Introd. Física",
  "IAQ": "Introd. Química",
  "IGS": "Inglés",
  "INM": "Imagen y Nuevos Medios",
  "LEN": "Lenguaje Musical",
  "LEP": "Imagen y Proc. Construc.",
  "LIT": "Literatura",
  "MCS": "Matemática Ciclo Superior",
  "MNC": "Manifestaciones Culturales",
  "MTM": "Matemática Ciclo Básico",
  "NTI": "Nuevas Tecnologías",
  "OCL": "Taller de Producc. de Lenguaje",
  "OCS": "Obs. de Comun. Cult. y Soc.",
  "ODM": "Obs. de Medios",
  "PAI": "Prod. Anál. Imagen",
  "PAV": "Prov. Prod. Artes Visuales",
  "PCD": "Práct. Corp. Amb. Nat.",
  "PCI": "Práct. Conj. Vocales e Instrumento",
  "PDI": "Prácticas Deportivas y Atlét.",
  "PDJ": "Práct. Dep. Juegos",
  "PDO": "Práct. Dep. Acuáticos",
  "PEM": "Análisis Prod. Musical",
  "PGE": "Práct. Gimn. Expresivas",
  "PIC": "Proy. Inv. Ciencias Sociales",
  "PLG": "Práct. Lenguaje",
  "POC": "Actuación y Proc. Const. en Teatro",
  "PPL": "Proy. Prod. Literatura",
  "PPM": "Proy. Prod. Musical",
  "PPT": "Proy. y Prod. en Teatro",
  "PRO": "Proyecto Organizacional",
  "PSI": "Psicología",
  "PYC": "Política y Ciudadanía",
  "QDC": "Química del Carbono",
  "RTE": "Arte",
  "SIC": "Sistema de Información Contable",
  "SIL": "Seminario de Inv. Literaria",
  "SOC": "Sociología",
  "SYA": "Salud y Adolescencia",
  "TCI": "Taller Com. Inst. y Com.",
  "TEA": "Análisis del Lenguaje Teatral",
  "TDO": "Teoría de las Organizaciones",
  "TLE": "Taller de Lectura Liter. y Escrit.",
  "TYC": "Trabajo y Ciudadanía",
  "STY": "Seminario Turismo y Sustentabilidad",
  "TDT": "Destinos Turísticos",
  "SAT": "Seminario de Accesibilidad Turística",
  "SST": "Psicología Social del Turismo",
  "TDE": "Taller de Escritura",
  "TPT": "Prácticas Turísticas",
  "TTT": "Teoría del Turismo",
  "APV": "Artística Plástica",
  "AMC": "Artística Música",
  "ATT": "Artística Teatro",
  "ADZ": "Artística Danzas",
  "EFC": "Educación Física Secundaria"
};

// --- NAVEGACIÓN AVANZADA DE SUB-SECCIONES ---

function AdminSubNav({ mainTitle, mainPath, currentPath, subSections }) {
  const navigate = useNavigate();
  const currentIndex = subSections.findIndex(s => s.path === currentPath);
  const prev = currentIndex > 0 ? subSections[currentIndex - 1] : null;
  const next = currentIndex < subSections.length - 1 ? subSections[currentIndex + 1] : null;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/dashboard')} className="btn" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <LayoutDashboard size={16} /> Dashboard
        </button>
        <span style={{ color: 'var(--border)', opacity: 0.5 }}>/</span>
        <button onClick={() => navigate(mainPath)} className="btn" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          <ArrowUpLeft size={16} /> {mainTitle}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {prev && (
          <button onClick={() => navigate(prev.path)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>
             <ChevronLeft size={18} /> {prev.name}
          </button>
        )}
        {(prev && next) && <div style={{ height: '24px', width: '1px', background: 'var(--border)', margin: '0 0.75rem' }}></div>}
        {next && (
          <button onClick={() => navigate(next.path)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>
             {next.name} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

const PERSONAL_SECTIONS = [
  { name: 'Base de Datos', path: '/dashboard/personal/database' },
  { name: 'Nómina', path: '/dashboard/personal/nomina' },
  { name: 'Mis CUPOF', path: '/dashboard/personal/cupof' },
  { name: 'POF/POFA', path: '/dashboard/personal/pof' },
  { name: 'Novedades', path: '/dashboard/personal/novedades' }
];

const PLANILLAS_SECTIONS = [
  { name: 'Calificaciones', path: '/dashboard/planillas/calificacion' },
  { name: 'Seguimiento', path: '/dashboard/planillas/seguimiento' }
];

const ESCUELA_SECTIONS = [
  { name: 'Gestión Institucional', path: '/dashboard/escuela' },
  { name: 'Ciclos Lectivos', path: '/dashboard/escuela/ciclos' }
];

const PRACTICAS_SECTIONS = [
  { name: 'Gestión Institutos', path: '/dashboard/practicas/institutos' },
  { name: 'Docentes Práctica', path: '/dashboard/practicas/docentes' },
  { name: 'Estudiantes Práctica', path: '/dashboard/practicas/estudiantes' },
  { name: 'Gestión Accesos', path: '/dashboard/practicas/accesos' }
];

// --- GESTIÓN DE PERSONAL: BASE DE DATOS Y LEGAJOS ---

function PersonalDatabase() {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLegajo, setSelectedLegajo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cuil_pre: '20', dni: '', cuil_suf: '', apellido: '', nombre: '',
    email_abc: '', fecha_nacimiento: '', direccion: '', localidad: '', cp: '',
    enfermedades: '', medicamentos: '', obra_social: '', tel_emergencia: '',
    salud: '', telefono: '', cargos: []
  });

  useEffect(() => { fetchPersonal(); }, []);

  const fetchPersonal = async () => {
    try {
      const snap = await getDocs(collection(db, 'personal'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPersonal(list.length > 0 ? list : []); // Empty if no DB yet
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleEdit = (p) => {
    setFormData(p);
    setIsEditing(true);
  };

  const handleNew = () => {
    setFormData({
      cuil_pre: '20', dni: '', cuil_suf: '', apellido: '', nombre: '',
      email_abc: '', fecha_nacimiento: '', direccion: '', localidad: '', cp: '',
      enfermedades: '', medicamentos: '', obra_social: '', tel_emergencia: '',
      salud: '', telefono: '', cargos: []
    });
    setIsEditing(true);
    setSelectedLegajo(null);
  };

  const handleSave = async () => {
    if (!formData.dni || !formData.apellido) return alert("DNI y Apellido son obligatorios.");
    try {
      if (formData.id) {
        await updateDoc(doc(db, 'personal', formData.id), formData);
      } else {
        await addDoc(collection(db, 'personal'), formData);
      }
      setIsEditing(false);
      setSelectedLegajo(null);
      fetchPersonal();
      alert("Legajo guardado correctamente.");
    } catch (err) { alert("Error al guardar: " + err.message); }
  };

  const addCargo = () => {
    setFormData({...formData, cargos: [...formData.cargos, { materia: '', curso: '', situacion: 'Provisional', horas: '' }] });
  };

  const removeCargo = (index) => {
    setFormData({...formData, cargos: formData.cargos.filter((_, i) => i !== index) });
  };

  const filtered = personal.filter(p => 
    `${p.apellido} ${p.nombre}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.dni.includes(searchTerm)
  );

  if (isEditing) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/database" subSections={PERSONAL_SECTIONS} />
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <button className="btn" onClick={() => setIsEditing(false)}><ArrowLeft size={18} /></button>
             <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formData.id ? 'Editar Legajo' : 'Registrar Nuevo Agente'}</h1>
          </div>
          <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Save size={18} /> Guardar Cambios
          </button>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
           <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Datos Identificatorios</h3>
           <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label>CUIL (Prefijo - DNI - Sufijo)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <input className="input-field" style={{ width: '60px' }} value={formData.cuil_pre} onChange={e => setFormData({...formData, cuil_pre: e.target.value})} />
                   <input className="input-field" placeholder="DNI" style={{ flex: 1 }} value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
                   <input className="input-field" style={{ width: '50px' }} value={formData.cuil_suf} onChange={e => setFormData({...formData, cuil_suf: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Correo @abc.gob.ar</label>
                <input className="input-field" value={formData.email_abc} onChange={e => setFormData({...formData, email_abc: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input className="input-field" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input className="input-field" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input className="input-field" type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Teléfono de Contacto</label>
                <input className="input-field" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              </div>
           </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
           <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Domicilio Institucional</h3>
           <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label>Dirección y Altura</label>
                <input className="input-field" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Localidad</label>
                <input className="input-field" value={formData.localidad} onChange={e => setFormData({...formData, localidad: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Cód. Postal</label>
                <input className="input-field" value={formData.cp} onChange={e => setFormData({...formData, cp: e.target.value})} />
              </div>
           </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem', border: '1px solid #fca5a5', background: '#fff1f2' }}>
           <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #fecaca', paddingBottom: '0.5rem', color: '#b91c1c' }}>Información Médica / Salud</h3>
           <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                 <label>Enfermedades Preexistentes</label>
                 <input className="input-field" value={formData.enfermedades} onChange={e => setFormData({...formData, enfermedades: e.target.value})} />
              </div>
              <div className="form-group">
                 <label>Medicamentos Crónicos</label>
                 <input className="input-field" value={formData.medicamentos} onChange={e => setFormData({...formData, medicamentos: e.target.value})} />
              </div>
              <div className="form-group">
                 <label>Obra Social / Prepaga</label>
                 <input className="input-field" value={formData.obra_social} onChange={e => setFormData({...formData, obra_social: e.target.value})} />
              </div>
              <div className="form-group">
                 <label>Teléfonos de Emergencia</label>
                 <input className="input-field" value={formData.tel_emergencia} onChange={e => setFormData({...formData, tel_emergencia: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                 <label>Observaciones de Salud (Aptos, incapacidad, etc)</label>
                 <textarea className="input-field" style={{ minHeight: '80px' }} value={formData.salud} onChange={e => setFormData({...formData, salud: e.target.value})} />
              </div>
           </div>
        </div>

        <div className="card" style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h3 style={{ color: 'var(--color-primary)' }}>Cargos y Desempeños Activos</h3>
               <button className="btn" onClick={addCargo} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>+ Agregar Cargo</button>
            </div>
            {formData.cargos?.map((c, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: '0.75rem', marginBottom: '1rem', alignItems: 'end', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                 <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.65rem' }}>MATERIA / CARGO</label>
                    <input className="input-field" value={c.materia} onChange={e => {
                       const next = [...formData.cargos]; next[index].materia = e.target.value; setFormData({...formData, cargos: next});
                    }} />
                 </div>
                 <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.65rem' }}>CURSO/DIV</label>
                    <input className="input-field" value={c.curso} onChange={e => {
                       const next = [...formData.cargos]; next[index].curso = e.target.value; setFormData({...formData, cargos: next});
                    }} />
                 </div>
                 <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.65rem' }}>REVISIÓN</label>
                    <select className="input-field" value={c.situacion} onChange={e => {
                       const next = [...formData.cargos]; next[index].situacion = e.target.value; setFormData({...formData, cargos: next});
                    }}>
                       <option value="Titular">Titular</option>
                       <option value="Provisional">Provisional</option>
                       <option value="Suplente">Suplente</option>
                    </select>
                 </div>
                 <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.65rem' }}>HORAS</label>
                    <input className="input-field" type="number" value={c.horas} onChange={e => {
                       const next = [...formData.cargos]; next[index].horas = e.target.value; setFormData({...formData, cargos: next});
                    }} />
                 </div>
                 <button className="btn" onClick={() => removeCargo(index)} style={{ padding: '0.5rem', color: '#ef4444' }}><Trash2 size={18} /></button>
              </div>
            ))}
            {(!formData.cargos || formData.cargos.length === 0) && <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No hay cargos registrados para este agente.</p>}
        </div>
      </div>
    );
  }

  if (selectedLegajo) {
    const p = selectedLegajo;
    return (
      <>
        <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/database" subSections={PERSONAL_SECTIONS} />
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn" style={{ padding: '0.6rem', border: '1px solid var(--border)' }} onClick={() => setSelectedLegajo(null)}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Legajo Digital</h1>
              <p style={{ fontSize: '0.9rem' }}>Vista detallada del agente: {p.apellido}, {p.nombre}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => handleEdit(p)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Pencil size={18} /> Editar Información
          </button>
        </div>

        <div className="grid grid-cols-3" style={{ gap: '2rem', alignItems: 'start' }}>
          <div className="card" style={{ gridColumn: 'span 1', textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ width: '100px', height: '100px', background: 'var(--bg-admin)', color: 'var(--color-admin)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Users size={48} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{p.apellido}, {p.nombre}</h2>
            <p style={{ fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>CUIL: {p.cuil_pre} {p.dni} {p.cuil_suf}</p>
            
            <hr style={{ margin: '2rem 0', opacity: 0.1 }} />
            
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--color-secondary)' }} />
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Correo ABC</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.email_abc}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Calendar size={18} style={{ color: 'var(--color-secondary)' }} />
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Fecha de Nacimiento</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.fecha_nacimiento}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--color-secondary)' }} />
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Teléfono</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.telefono}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} style={{ color: 'var(--color-primary)' }} /> Domicilio y Localidad
                </h3>
                <div className="grid grid-cols-3">
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>DIRECCIÓN Y ALTURA</p>
                      <p style={{ fontWeight: 600 }}>{p.direccion}</p>
                   </div>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>LOCALIDAD</p>
                      <p style={{ fontWeight: 600 }}>{p.localidad}</p>
                   </div>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>CÓDIGO POSTAL</p>
                      <p style={{ fontWeight: 600 }}>{p.cp}</p>
                   </div>
                </div>
             </div>

             <div className="card" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
                  <HeartPulse size={24} /> Ficha Médica y Emergencia
                </h3>
                
                <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, color: '#b91c1c', marginBottom: '0.5rem' }}>ENFERMEDADES / CONDICIONES</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                         <Activity size={16} /> {p.enfermedades}
                      </div>
                   </div>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, color: '#b91c1c', marginBottom: '0.5rem' }}>MEDICAMENTOS CRÓNICOS</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                         <Stethoscope size={16} /> {p.medicamentos}
                      </div>
                   </div>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, color: '#b91c1c', marginBottom: '0.5rem' }}>OBRA SOCIAL / PREPAGA</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                         <ShieldPlus size={16} /> {p.obra_social}
                      </div>
                   </div>
                   <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, color: '#b91c1c', marginBottom: '0.5rem' }}>TELÉFONOS DE EMERGENCIA</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                         <Siren size={16} /> {p.tel_emergencia}
                      </div>
                   </div>
                </div>
                
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #fecaca', fontSize: '0.85rem' }}>
                   <strong>Observación General:</strong> {p.salud}
                </div>
             </div>

             <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <NotebookTabs size={20} style={{ color: 'var(--color-primary)' }} /> Cargos y Desempeños Actuales
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Materia / Cargo</th>
                      <th>Curso / División</th>
                      <th>Situación Revista</th>
                      <th>Carga Horaria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.cargos?.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>
                           <span style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }}>({c.materia})</span>
                           {PID_CATALOG[c.materia] || c.materia}
                        </td>
                        <td>{c.curso}</td>
                        <td><span className="badge" style={{ background: 'var(--bg-teacher)', color: 'var(--color-teacher)' }}>{c.situacion}</span></td>
                        <td>{c.horas} hs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/database" subSections={PERSONAL_SECTIONS} />
      <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Base de Datos de Personal</h1>
          <p>Gestión centralizada de legajos y cargos institucionales.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '15px', color: 'var(--text-light)' }} />
            <input 
              className="input-field" 
              placeholder="Buscar por DNI o Apellido..." 
              style={{ paddingLeft: '3rem', width: '260px', marginBottom: 0 }} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleNew}>+ Registrar Agente</button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando base de datos de personal...</div> : (
          <table>
            <thead>
              <tr>
                <th>CUIL</th>
                <th>Apellido y Nombre</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {p.cuil_pre} {p.dni} {p.cuil_suf}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{p.apellido.toUpperCase()}, {p.nombre}</td>
                  <td><span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>Activo</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 700 }} onClick={() => setSelectedLegajo(p)}>
                         <FileText size={16} /> Legajo
                      </button>
                      <button className="btn" style={{ color: '#f59e0b' }} onClick={() => handleEdit(p)}>
                         <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No se encontraron agentes con ese criterio.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: '4rem', padding: '2.5rem 0', borderTop: '1px solid var(--border)' }}>
        <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/database" subSections={PERSONAL_SECTIONS} />
      </div>
    </>
  );
}

function PersonalNomina() {
  const [nomina, setNomina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    cupof: '', cuil: '', docente: '', situacion: 'Titular',
    curso: '', seccion: '', pid: '', alta: '', cese: '', motivo_cese: '', observaciones: ''
  });
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => { fetchNomina(); }, []);

  const fetchNomina = async () => {
    try {
      const snap = await getDocs(collection(db, 'nomina'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNomina(list.length > 0 ? list : []);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleEdit = (item) => {
    setEditForm(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditForm({ cupof: '', cuil: '', docente: '', situacion: 'Titular', curso: '', seccion: '', pid: '', alta: '', cese: '', motivo_cese: '', observaciones: '' });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editForm.cupof || !editForm.docente) return alert("CUPOF y Docente son obligatorios");
    try {
      if (editForm.id) {
        await updateDoc(doc(db, 'nomina', editForm.id), editForm);
      } else {
        await addDoc(collection(db, 'nomina'), editForm);
      }
      setIsEditing(false);
      setSelectedCargo(null);
      fetchNomina();
      alert("Designación guardada.");
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este movimiento de nómina?")) {
      await deleteDoc(doc(db, 'nomina', id));
      fetchNomina();
    }
  };

  if (isEditing) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/nomina" subSections={PERSONAL_SECTIONS} />
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <button className="btn" onClick={() => setIsEditing(false)}><ArrowLeft size={18} /></button>
             <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editForm.id ? 'Editar Designación' : 'Nueva Designación en Nómina'}</h1>
          </div>
          <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Save size={18} /> Guardar Movimiento
          </button>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
           <div className="card">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Datos del Docente y Cargo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div className="form-group">
                    <label>CUPOF</label>
                    <input className="input-field" value={editForm.cupof} onChange={e => setEditForm({...editForm, cupof: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>CUIL</label>
                    <input className="input-field" value={editForm.cuil} onChange={e => setEditForm({...editForm, cuil: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Apellido y Nombre (DOCENTE)</label>
                    <input className="input-field" value={editForm.docente} onChange={e => setEditForm({...editForm, docente: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Situación de Revista</label>
                    <select className="input-field" value={editForm.situacion} onChange={e => setEditForm({...editForm, situacion: e.target.value})}>
                       <option value="Titular">Titular</option>
                       <option value="Provisional">Provisional</option>
                       <option value="Suplente">Suplente</option>
                    </select>
                 </div>
              </div>
           </div>

           <div className="card">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Ubicación y Asignatura</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                       <label>Curso</label>
                       <input className="input-field" value={editForm.curso} onChange={e => setEditForm({...editForm, curso: e.target.value})} />
                    </div>
                    <div className="form-group">
                       <label>Sección</label>
                       <input className="input-field" value={editForm.seccion} onChange={e => setEditForm({...editForm, seccion: e.target.value})} />
                    </div>
                 </div>
                 <div className="form-group">
                    <label>Código PID</label>
                    <input className="input-field" value={editForm.pid} onChange={e => setEditForm({...editForm, pid: e.target.value.toUpperCase()})} placeholder="Ej: MTM, BLG..." />
                    {PID_CATALOG[editForm.pid] && (
                      <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        Confirmado: {PID_CATALOG[editForm.pid]}
                      </p>
                    )}
                 </div>
              </div>
           </div>

           <div className="card" style={{ gridColumn: 'span 2' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Fechas y Movimientos</h3>
              <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                 <div className="form-group">
                    <label>Fecha de Alta</label>
                    <input className="input-field" type="date" value={editForm.alta} onChange={e => setEditForm({...editForm, alta: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Fecha de Cese (Opcional)</label>
                    <input className="input-field" type="date" value={editForm.cese} onChange={e => setEditForm({...editForm, cese: e.target.value})} />
                 </div>
                 <div className="form-group">
                    <label>Motivo de Cese</label>
                    <input className="input-field" value={editForm.motivo_cese} onChange={e => setEditForm({...editForm, motivo_cese: e.target.value})} placeholder="Ej: Renuncia, MAD..." disabled={!editForm.cese} />
                 </div>
              </div>
           </div>

           <div className="card" style={{ gridColumn: 'span 2' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Pestaña de Observaciones</h3>
              <textarea 
                className="input-field" 
                style={{ minHeight: '120px' }} 
                value={editForm.observaciones}
                onChange={e => setEditForm({...editForm, observaciones: e.target.value})}
                placeholder="Notas adicionales sobre este movimiento administrativo..."
              />
           </div>
        </div>
      </div>
    );
  }

  if (selectedCargo) {
    const n = selectedCargo;
    return (
      <>
        <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/nomina" subSections={PERSONAL_SECTIONS} />
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn" style={{ padding: '0.6rem' }} onClick={() => setSelectedCargo(null)}><ArrowLeft size={18} /></button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Detalle de Designación</h1>
              <p style={{ fontSize: '0.9rem' }}>CUPOF: {n.cupof} | {n.docente}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => handleEdit(n)}>
             <Pencil size={18} style={{ marginRight: '0.5rem' }} /> Editar Designación
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
            <button 
              onClick={() => setActiveTab('info')}
              style={{ padding: '1.25rem 2rem', border: 'none', background: activeTab === 'info' ? 'white' : 'transparent', fontWeight: 700, color: activeTab === 'info' ? 'var(--color-primary)' : 'var(--text-light)', borderBottom: activeTab === 'info' ? '3px solid var(--color-primary)' : 'none', cursor: 'pointer' }}
            >
              Información del Cargo
            </button>
            <button 
              onClick={() => setActiveTab('obs')}
              style={{ padding: '1.25rem 2rem', border: 'none', background: activeTab === 'obs' ? 'white' : 'transparent', fontWeight: 700, color: activeTab === 'obs' ? 'var(--color-primary)' : 'var(--text-light)', borderBottom: activeTab === 'obs' ? '3px solid var(--color-primary)' : 'none', cursor: 'pointer' }}
            >
              Pestaña de Observaciones
            </button>
          </div>

          <div style={{ padding: '2.5rem' }}>
            {activeTab === 'info' ? (
              <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                       <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Identificación</p>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontWeight: 700 }}>
                          <Hash size={16} color="var(--color-primary)" /> CUPOF: {n.cupof}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontWeight: 700 }}>
                          <Contact size={16} color="var(--color-primary)" /> CUIL: {n.cuil}
                       </div>
                    </div>
                    <div>
                       <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Ubicación Curricular</p>
                       <p style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.4rem' }}>{n.curso} Año {n.seccion} Sección</p>
                       <p style={{ fontWeight: 600, color: 'var(--text-light)' }}>Materia: <span style={{ color: 'var(--color-primary)' }}>({n.pid})</span> {PID_CATALOG[n.pid] || n.materia}</p>
                    </div>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                       <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Situación de Revista</p>
                       <span className="badge" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '1rem', padding: '0.5rem 1rem', background: 'var(--bg-teacher)', color: 'var(--color-teacher)' }}>{n.situacion}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                       <div>
                          <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Fecha de Alta</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontWeight: 700 }}>
                             <Calendar size={16} /> {n.alta}
                          </div>
                       </div>
                       {n.cese && (
                         <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', color: '#ef4444' }}>Fecha y Motivo de Cese</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontWeight: 700, color: '#ef4444' }}>
                               <Calendar size={16} /> {n.cese} 
                            </div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444', marginTop: '0.25rem' }}>MOTIVO: {n.motivo_cese || 'No especificado'}</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', minHeight: '200px' }}>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <MessageSquare size={24} style={{ color: 'var(--color-primary)', marginTop: '0.2rem' }} />
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text)' }}>
                       {n.observaciones || 'Sin observaciones registradas.'}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/nomina" subSections={PERSONAL_SECTIONS} />
      <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Nómina Institucional</h1>
          <p>Control de designaciones, códigos PID y ceses de personal.</p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>+ Cargar Designación</button>
      </div>

      <div className="table-wrapper">
        {loading ? <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando nómina...</div> : (
          <table>
            <thead>
              <tr>
                <th>CUPOF</th>
                <th>CUIL</th>
                <th>Docente</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {nomina.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{item.cupof}</td>
                  <td style={{ fontSize: '0.85rem' }}>{item.cuil}</td>
                  <td style={{ fontWeight: 700 }}>{item.docente.toUpperCase()}</td>
                  <td>
                    <span className="badge" style={{ 
                      background: item.cese ? '#fef2f2' : '#dcfce7', 
                      color: item.cese ? '#ef4444' : '#15803d' 
                    }}>
                      {item.cese ? 'CESADO' : 'ACTIVO'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button className="btn" style={{ fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={() => setSelectedCargo(item)}>
                        <FileSearch size={16} /> Ver
                      </button>
                      <button className="btn" style={{ color: '#f59e0b' }} onClick={() => handleEdit(item)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {nomina.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>No hay datos cargados en la nómina.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function PersonalCUPOF() {
  const [cupofs, setCupofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ cupof: '', pid: '', curso: '', seccion: '', turno: 'Mañana' });

  useEffect(() => { fetchCUPOFs(); }, []);

  const fetchCUPOFs = async () => {
    try {
      const snap = await getDocs(collection(db, 'cupof_master'));
      setCupofs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!form.cupof || !form.pid) return alert("Faltan campos");
    if (form.id) await updateDoc(doc(db, 'cupof_master', form.id), form);
    else await addDoc(collection(db, 'cupof_master'), form);
    setIsEditing(false); fetchCUPOFs();
  };

  if (isEditing) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/cupof" subSections={PERSONAL_SECTIONS} />
        <div className="card">
           <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{form.id ? 'Editar CUPOF' : 'Nuevo Registro CUPOF'}</h1>
           <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group"><label>N° CUPOF</label><input className="input-field" value={form.cupof} onChange={e => setForm({...form, cupof: e.target.value})} /></div>
              <div className="form-group">
                <label>PID</label>
                <input className="input-field" value={form.pid} onChange={e => setForm({...form, pid: e.target.value.toUpperCase()})} />
                {PID_CATALOG[form.pid] && <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>{PID_CATALOG[form.pid]}</p>}
              </div>
              <div className="form-group"><label>Curso</label><input className="input-field" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} /></div>
              <div className="form-group"><label>Sección</label><input className="input-field" value={form.seccion} onChange={e => setForm({...form, seccion: e.target.value})} /></div>
              <div className="form-group">
                <label>Turno</label>
                <select className="input-field" value={form.turno} onChange={e => setForm({...form, turno: e.target.value})}>
                   <option value="Mañana">Mañana</option>
                   <option value="Tarde">Tarde</option>
                   <option value="Vespertino">Vespertino</option>
                </select>
              </div>
           </div>
           <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave}><Save size={18} /> Guardar</button>
              <button className="btn" onClick={() => setIsEditing(false)}>Cancelar</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/cupof" subSections={PERSONAL_SECTIONS} />
      <div className="header-flex">
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Mis CUPOF</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ cupof: '', pid: '', curso: '', seccion: '', turno: 'Mañana' }); setIsEditing(true); }}>+ Nuevo CUPOF</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>N° CUPOF</th><th>Materia (PID)</th><th>Curso/Sec</th><th>Turno</th><th>Acciones</th></tr></thead>
          <tbody>
            {cupofs.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{c.cupof}</td>
                <td><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>({c.pid})</span> {PID_CATALOG[c.pid]}</td>
                <td>{c.curso} {c.seccion}</td>
                <td><span className="badge" style={{ background: '#f1f5f9' }}>{c.turno}</span></td>
                <td><button className="btn" onClick={() => { setForm(c); setIsEditing(true); }}><Pencil size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PersonalHome() {
  return (
    <>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Mi Personal</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>Herramientas integrales para la administración de docentes y auxiliares de la EES 21.</p>
      </div>

      <DashboardGrid>
        <DashboardCard 
          color="#3b82f6" 
          title="Base de Datos" 
          description="Legajos digitales completos del personal docente y no docente." 
          icon={<Contact size={28} />} 
          href="/dashboard/personal/database"
          target="_self"
        />
        <DashboardCard 
          color="#6366f1" 
          title="Nómina" 
          description="Listados generales y específicos del personal activo." 
          icon={<NotebookTabs size={28} />} 
          href="/dashboard/personal/nomina"
          target="_self"
        />
        <DashboardCard 
          color="#10b981" 
          title="Mis CUPOF" 
          description="Catálogo institucional de cargos, códigos PID y turnos." 
          icon={<Hash size={28} />} 
          href="/dashboard/personal/cupof"
          target="_self"
        />
        <DashboardCard 
          color="#8b5cf6" 
          title="Control de POF/POFA" 
          description="Seguimiento de la Planta Orgánica Funcional Analítica." 
          icon={<FileSearch size={28} />} 
          href="/dashboard/personal/pof"
          target="_self"
        />
        <DashboardCard 
          color="#f43f5e" 
          title="Novedades" 
          description="Carga de licencias, llegadas tarde y novedades administrativas." 
          icon={<UserPlus size={28} />} 
          href="/dashboard/personal/novedades"
          target="_self"
        />
      </DashboardGrid>
    </>
  );
}

function PracticaHome() {
  return (
    <>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Gestión de Prácticas</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>Administración integral de residentes, docentes de práctica y sus permisos de acceso.</p>
      </div>

      <DashboardGrid>
        <DashboardCard 
          color="#3b82f6" 
          title="Gestión de Institutos" 
          description="Directorio de Institutos (ISFD) co-formadores." 
          icon={<LayoutGrid size={28} />} 
          href="/dashboard/practicas/institutos"
          target="_self"
        />
        <DashboardCard 
          color="#3b82f6" 
          title="Gestión de Docentes de Práctica" 
          description="Directorio de supervisores y docentes tutores de institutos (ISFD)." 
          icon={<BookUser size={28} />} 
          href="/dashboard/practicas/docentes"
          target="_self"
        />
        <DashboardCard 
          color="#10b981" 
          title="Gestión de Estudiantes de Práctica" 
          description="Nómina detallada de alumnos residentes y su seguimiento pedagógico." 
          icon={<GraduationCap size={28} />} 
          href="/dashboard/practicas/estudiantes"
          target="_self"
        />
        <DashboardCard 
          color="#6366f1" 
          title="Gestión de Accesos" 
          description="Permisos temporales para el uso de la plataforma por parte de residentes." 
          icon={<Shield size={28} />} 
          href="/dashboard/practicas/accesos"
          target="_self"
        />
      </DashboardGrid>
    </>
  );
}

function PracticaDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ nombre: '', institute: '', email: '', telefono: '' });

  useEffect(() => { fetchDocentes(); }, []);

  const fetchDocentes = async () => {
    try {
      const snap = await getDocs(collection(db, 'practica_supervisores'));
      setDocentes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!form.nombre) return alert("Hacen falta datos");
    if (form.id) await updateDoc(doc(db, 'practica_supervisores', form.id), form);
    else await addDoc(collection(db, 'practica_supervisores'), form);
    setIsEditing(false); fetchDocentes();
  };

  if (isEditing) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/docentes" subSections={PRACTICAS_SECTIONS} />
        <div className="card">
           <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{form.id ? 'Editar Docente Práctica' : 'Nuevo Docente Práctica'}</h1>
           <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group"><label>Apellido y Nombre</label><input className="input-field" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} /></div>
              <div className="form-group"><label>ISFD / Universidad</label><input className="input-field" value={form.institute} onChange={e => setForm({...form, institute: e.target.value})} /></div>
              <div className="form-group"><label>Email de contacto</label><input className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label>Teléfono</label><input className="input-field" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} /></div>
           </div>
           <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave}><Save size={18} /> Guardar Registro</button>
              <button className="btn" onClick={() => setIsEditing(false)}>Cancelar</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/docentes" subSections={PRACTICAS_SECTIONS} />
      <div className="header-flex">
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Docentes de Práctica</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ nombre: '', institute: '', email: '', telefono: '' }); setIsEditing(true); }}>+ Nuevo Docente</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Supervisor / Docente Práctica</th><th>Instituto</th><th>Email</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {docentes.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 800 }}>{d.nombre.toUpperCase()}</td>
                <td>{d.institute}</td>
                <td>{d.email}</td>
                <td><span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>Activo</span></td>
                <td><button className="btn" onClick={() => { setForm(d); setIsEditing(true); }}><Pencil size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '4rem' }}><AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/docentes" subSections={PRACTICAS_SECTIONS} /></div>
    </>
  );
}

function PracticaInstitutos() {
  const [institutos, setInstitutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', distrito: '', direccion: '', telefono: '', correo: '', director: ''
  });

  const fetchInstitutos = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'institutos'));
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
      await addDoc(collection(db, 'institutos'), formData);
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
      await deleteDoc(doc(db, 'institutos', id));
      fetchInstitutos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/institutos" subSections={PRACTICAS_SECTIONS} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>Directorio de Institutos</h1>
        {!isAdding && (
          <button className="btn btn-primary" style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsAdding(true)}>
             + Cargar Instituto
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid #3b82f6', background: '#eff6ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1d4ed8' }}>Cargar Nuevo Instituto (ISFD)</h3>
            <button className="btn" onClick={() => setIsAdding(false)}>Cerrar</button>
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

function PracticaEstudiantes() {
  const [practicas, setPracticas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ residente: '', isfd: '', pid: '', curso: '', seccion: '', coformador: '', estado: 'Activa' });

  useEffect(() => { fetchPracticas(); }, []);

  const fetchPracticas = async () => {
    try {
      const snap = await getDocs(collection(db, 'practicas_docentes'));
      setPracticas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!form.residente || !form.isfd) return alert("Hacen falta datos");
    if (form.id) await updateDoc(doc(db, 'practicas_docentes', form.id), form);
    else await addDoc(collection(db, 'practicas_docentes'), form);
    setIsEditing(false); fetchPracticas();
  };

  if (isEditing) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/estudiantes" subSections={PRACTICAS_SECTIONS} />
        <div className="card">
           <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{form.id ? 'Editar Registro' : 'Nuevo Residente'}</h1>
           <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group"><label>Apellido y Nombre (RESIDENTE)</label><input className="input-field" value={form.residente} onChange={e => setForm({...form, residente: e.target.value})} /></div>
              <div className="form-group"><label>ISFD / Instituto</label><input className="input-field" value={form.isfd} onChange={e => setForm({...form, isfd: e.target.value})} /></div>
              <div className="form-group">
                <label>Materia (PID)</label>
                <input className="input-field" value={form.pid} onChange={e => setForm({...form, pid: e.target.value.toUpperCase()})} />
                {PID_CATALOG[form.pid] && <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>{PID_CATALOG[form.pid]}</p>}
              </div>
              <div className="form-group"><label>Curso/Sección</label><input className="input-field" placeholder="Ej: 4° 2da" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} /></div>
              <div className="form-group"><label>Docente Co-formador</label><input className="input-field" value={form.coformador} onChange={e => setForm({...form, coformador: e.target.value})} /></div>
              <div className="form-group">
                <label>Estado de Práctica</label>
                <select className="input-field" value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}>
                   <option value="Activa">Activa</option>
                   <option value="Finalizada">Finalizada</option>
                </select>
              </div>
           </div>
           <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave}><Save size={18} /> Guardar Registro</button>
              <button className="btn" onClick={() => setIsEditing(false)}>Cancelar</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/estudiantes" subSections={PRACTICAS_SECTIONS} />
      <div className="header-flex">
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Estudiantes de Práctica</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ residente: '', isfd: '', pid: '', curso: '', seccion: '', coformador: '', estado: 'Activa' }); setIsEditing(true); }}>+ Nuevo Registro</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Residente</th><th>ISFD</th><th>Materia (PID)</th><th>Curso</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {practicas.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 800 }}>{p.residente.toUpperCase()}</td>
                <td>{p.isfd}</td>
                <td><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>({p.pid})</span> {PID_CATALOG[p.pid]}</td>
                <td>{p.curso} {p.seccion}</td>
                <td><span className="badge" style={{ background: p.estado === 'Activa' ? '#dcfce7' : '#f1f5f9', color: p.estado === 'Activa' ? '#15803d' : '#64748b' }}>{p.estado}</span></td>
                <td><button className="btn" onClick={() => { setForm(p); setIsEditing(true); }}><Pencil size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '4rem' }}><AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/estudiantes" subSections={PRACTICAS_SECTIONS} /></div>
    </>
  );
}

function PracticaAccesos() {
  return (
    <>
      <AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/accesos" subSections={PRACTICAS_SECTIONS} />
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', background: '#f1f5f9', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Key size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Gestión de Accesos</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-light)' }}>
          Próximamente: Habilita claves temporales para que los residentes puedan registrar sus propios seguimientos en el sistema ENSAM.
        </p>
      </div>
      <div style={{ marginTop: '4rem' }}><AdminSubNav mainTitle="Prácticas" mainPath="/dashboard/practicas" currentPath="/dashboard/practicas/accesos" subSections={PRACTICAS_SECTIONS} /></div>
    </>
  );
}

// --- PLANILLAS DE CALIFICACIÓN Y SEGUIMIENTO ---

function PlanillasHome() {
  return (
    <>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Mis Planillas</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>Acceso centralizado a documentos de evaluación y seguimiento institucional.</p>
      </div>

      <DashboardGrid>
        <DashboardCard 
          color="#8b5cf6" 
          title="Planillas de Calificación" 
          description="Carga y consulta de notas trimestrales por curso y materia." 
          icon={<FileCheck size={28} />} 
          href="/dashboard/planillas/calificacion"
          target="_self"
        />
        <DashboardCard 
          color="#06b6d4" 
          title="Planillas de Seguimiento" 
          description="Rastreo de asistencias, conducta y evolución pedagógica." 
          icon={<Clipboard size={28} />} 
          href="/dashboard/planillas/seguimiento"
          target="_self"
        />
      </DashboardGrid>
    </>
  );
}

// --- MI ESCUELA: GESTIÓN DE CICLOS Y PROPUESTAS ---

function MiEscuelaHome() {
  const [ciclos, setCiclos] = useState([]);
  const [newYear, setNewYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCiclos(); }, []);

  const fetchCiclos = async () => {
    try {
      const snap = await getDocs(collection(db, 'ciclos'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCiclos(list.length > 0 ? list.sort((a,b) => b.year - a.year) : [
        { id: '2026', year: '2026', status: 'active', lastModified: new Date().toISOString() },
        { id: '2025', year: '2025', status: 'archived', lastModified: new Date().toISOString() }
      ]);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddYear = async () => {
    if (!newYear) return;
    try {
      await setDoc(doc(db, 'ciclos', newYear), { 
        year: newYear, 
        status: 'active',
        lastModified: new Date().toISOString()
      });
      setNewYear('');
      fetchCiclos();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <div className="header-flex" style={{ marginBottom: '4rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>Propuestas por Ciclo Lectivo</h1>
          <p>Organiza la estructura académica de la EES N°21 para cada período escolar.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', background: 'white', padding: '0.6rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
           <input type="number" className="input-field" value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="Año (Ej: 2026)" style={{ width: '140px', border: 'none', marginBottom: 0 }} />
           <button className="btn btn-primary" onClick={handleAddYear}>Inaugurar Ciclo</button>
        </div>
      </div>

      {loading ? <p>Cargando ciclos académicos...</p> : (
        <div className="grid grid-cols-2">
          {ciclos.map(ciclo => (
            <div key={ciclo.id} className="card" style={{ position: 'relative', overflow: 'hidden', borderLeft: `8px solid ${ciclo.status === 'active' ? '#10b981' : '#cbd5e1'}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                 <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem', color: 'var(--color-primary)' }}>{ciclo.year}</h2>
                    <span className="badge" style={{ 
                       background: ciclo.status === 'active' ? '#dcfce7' : '#f1f5f9', 
                       color: ciclo.status === 'active' ? '#15803d' : '#475569' 
                    }}>
                       {ciclo.status === 'active' ? 'Ciclo Vigente' : 'Ciclo Archivado'}
                    </span>
                 </div>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {ciclo.status === 'active' && <button className="btn" style={{ background: '#f8fafc', border: '1px solid var(--border)' }}>Configurar Estructura</button>}
                    <button className="btn" style={{ padding: '0.6rem', color: '#ef4444' }} onClick={() => { if(window.confirm("¿Archivar ciclo?")) updateDoc(doc(db,'ciclos', ciclo.id), {status: 'archived'}).then(fetchCiclos); }}><Clock size={18} /></button>
                 </div>
               </div>

               <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Propuesta Académica</h4>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                     <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>3</p>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>PLANES</p>
                     </div>
                     <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }}></div>
                     <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>12</p>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>SECCIONES</p>
                     </div>
                     <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }}></div>
                     <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>540</p>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>MATRÍCULA</p>
                     </div>
                  </div>
               </div>
            </div>
          ))}
          {ciclos.length === 0 && (
            <div className="card" style={{ gridColumn: 'span 2', padding: '6rem', textAlign: 'center', opacity: 0.6 }}>
               <School size={48} style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }} />
               <h3>No se han inaugurado Ciclos Lectivos</h3>
               <p>Ingresa un año arriba para comenzar a estructurar tu escuela.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// --- NUEVAS SECCIONES DE ESTUDIANTES ---

function EstudiantesHome() {
  return (
    <>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Gestión de Estudiantes</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>Herramientas de control de matrícula, nóminas y expedientes académicos.</p>
      </div>

      <DashboardGrid>
        <DashboardCard 
          color="#10b981" 
          title="Base de datos de Estudiantes" 
          description="Legajos digitales completos, datos personales y trayectoria." 
          icon={<Users size={28} />} 
          href="/dashboard/estudiantes/database"
          target="_self"
        />
        <DashboardCard 
          color="#3b82f6" 
          title="Nóminas Escolares" 
          description="Generación de listas por curso, ciclo y orientación." 
          icon={<ListChecks size={28} />} 
          href="/dashboard/estudiantes/nominas"
          target="_self"
        />
      </DashboardGrid>
    </>
  );
}

function NominaEstudiantes() {
  const [filter, setFilter] = useState({ ciclo: '2026', propuesta: 'todas', orientacion: 'todas' });
  const [orientaciones, setOrientaciones] = useState([]);

  useEffect(() => {
    const fetchOrientaciones = async () => {
      const snap = await getDocs(collection(db, 'orientaciones'));
      setOrientaciones(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrientaciones();
  }, []);

  return (
    <>
      <div className="header-flex" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Nóminas de Estudiantes</h1>
          <p>Filtrado de alumnos por ciclo lectivo y plan de estudios.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
             <label style={{ fontSize: '0.75rem' }}>Ciclo Lectivo</label>
             <select className="input-field" value={filter.ciclo} onChange={e => setFilter({...filter, ciclo: e.target.value})}>
               <option value="2026">2026</option>
               <option value="2025">2025</option>
             </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
             <label style={{ fontSize: '0.75rem' }}>Propuesta</label>
             <select className="input-field" value={filter.propuesta} onChange={e => setFilter({...filter, propuesta: e.target.value})}>
               <option value="todas">Todas</option>
               <option value="basico">Ciclo Básico</option>
               <option value="superior">Ciclo Superior</option>
             </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
             <label style={{ fontSize: '0.75rem' }}>Orientación</label>
             <select className="input-field" value={filter.orientacion} onChange={e => setFilter({...filter, orientacion: e.target.value})}>
               <option value="todas">Todas las Orientaciones</option>
               {orientaciones.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
             </select>
          </div>
          <button className="btn btn-primary" style={{ height: '48px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Filter size={18} /> Aplicar Filtros
          </button>
        </div>
      </div>

      <div className="table-wrapper">
         <div style={{ padding: '8rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-light)' }}>Genera nóminas rápidas aplicando los filtros de arriba.</h3>
            <p>Los resultados aparecerán aquí procesados por la base de datos central.</p>
         </div>
      </div>
    </>
  );
}

// --- GESTIÓN DE PLAN DE ESTUDIOS ---

function PlanEstudiosManagement() {
  const [orientaciones, setOrientaciones] = useState([]);
  const [newO, setNewO] = useState({ name: '', resolucion: '', cursos: [] });
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchO(); }, []);

  const fetchO = async () => {
    const snap = await getDocs(collection(db, 'orientaciones'));
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrientaciones(list.length > 0 ? list : [
      { id: '1', name: 'Ciclo Básico', resolucion: 'Res. 3828/09', cursos: ['1°', '2°', '3°'], secciones: ['1°','2°','3°','4°','5°','6°','7°','8°','9°','10°','11°','12°'] },
      { id: '2', name: 'Orientación Ciencias Sociales', resolucion: 'Res. 3828/09', cursos: ['4°', '5°', '6°'], secciones: ['1°','2°','3°','4°'] },
      { id: '3', name: 'Orientación Ciencias Naturales', resolucion: 'Res. 3828/09', cursos: ['4°', '5°', '6°'], secciones: ['1°','2°','3°','4°'] },
      { id: '4', name: 'Orientación Economía y Administración', resolucion: 'Res. 3828/09', cursos: ['4°', '5°', '6°'], secciones: ['1°','2°','3°','4°'] }
    ]);
  };

  const handleSave = async () => {
    if (!newO.name) return;
    if (editing) {
      await updateDoc(doc(db, 'orientaciones', editing), newO);
    } else {
      await addDoc(collection(db, 'orientaciones'), newO);
    }
    setNewO({ name: '', resolucion: '', cursos: [] }); 
    setEditing(null); 
    fetchO();
  };

  const handleDel = async (id) => {
    if (window.confirm("¿Eliminar orientación?")) {
      await deleteDoc(doc(db, 'orientaciones', id));
      fetchO();
    }
  };

  const toggleCurso = (c) => {
    setNewO(prev => ({
      ...prev,
      cursos: prev.cursos.includes(c) ? prev.cursos.filter(x => x !== c) : [...prev.cursos, c]
    }));
  };

  const toggleSeccion = (s) => {
    setNewO(prev => ({
      ...prev,
      secciones: (prev.secciones || []).includes(s) 
        ? prev.secciones.filter(x => x !== s) 
        : [...(prev.secciones || []), s]
    }));
  };

  return (
    <>
      <div className="header-flex">
         <div>
           <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Gestionar Plan de Estudios</h1>
           <p>Define las orientaciones disponibles para la titulación en ciclo superior.</p>
         </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
         <h4 style={{ marginBottom: '1.5rem' }}>{editing ? 'Editar Orientación / Plan' : 'Crear Nueva Orientación / Plan'}</h4>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
           <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Nombre de la Orientación / Propuesta</label>
              <input className="input-field" value={newO.name} onChange={e => setNewO({...newO, name: e.target.value})} placeholder="Ej: Ciclo Básico o Orientación Ciencias Sociales" />
           </div>
           <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Resolución Ministerial</label>
              <input className="input-field" value={newO.resolucion} onChange={e => setNewO({...newO, resolucion: e.target.value})} placeholder="Ej: Res. 3828/09" />
           </div>
         </div>
         
         <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ marginBottom: '1rem' }}>Años que engloba</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['1°', '2°', '3°', '4°', '5°', '6°'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem 0.8rem', background: 'var(--bg)', borderRadius: '10px' }}>
                  <input type="checkbox" checked={newO.cursos.includes(c)} onChange={() => toggleCurso(c)} style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontWeight: 600 }}>{c}</span>
                </label>
              ))}
            </div>
         </div>

         <div className="form-group">
            <label style={{ marginBottom: '1rem' }}>Secciones Habilitadas</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {Array.from({length: 12}, (_, i) => `${i+1}°`).map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', minWidth: '65px' }}>
                  <input type="checkbox" checked={(newO.secciones || []).includes(s)} onChange={() => toggleSeccion(s)} style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontWeight: 600 }}>{s}</span>
                </label>
              ))}
            </div>
         </div>

         <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
           <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{editing ? 'Guardar Cambios' : 'Registrar Plan de Estudio'}</button>
           {editing && <button className="btn" style={{ flex: 1, border: '1px solid var(--border)' }} onClick={() => {setEditing(null); setNewO({name:'', resolucion:'', cursos:[], secciones:[]});}}>Cancelar</button>}
         </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Orientación / Propuesta</th>
              <th>Resolución</th>
              <th>Años</th>
              <th>Secciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orientaciones.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{o.name}</td>
                <td><span className="badge" style={{ background: 'var(--bg-admin)', color: 'var(--color-admin)', fontSize: '0.75rem' }}>{o.resolucion || 'S/R'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {o.cursos?.sort().map(c => <span key={c} style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--bg-student)', color: 'var(--color-student)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{c}</span>)}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {o.secciones?.map(s => <span key={s} style={{ fontSize: '0.7rem', fontWeight: 800, background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>{s}</span>)}
                    {(!o.secciones || o.secciones.length === 0) && '-'}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => {setEditing(o.id); setNewO(o);}} style={{ background: 'none', border: 'none', color: '#f59e0b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Pencil size={14} /> Editar
                    </button>
                    <button onClick={() => handleDel(o.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


function GlobalSettings() {
  const [config, setConfig] = useState({ 
    maintenance: false, 
    loading: false, 
    allowedRolesMaintenance: ['admin'],
    allowedRolesCarga: ['admin'] 
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      if (docSnap.exists()) setConfig(docSnap.data());

      const rolesSnap = await getDocs(collection(db, 'roles'));
      const rolesList = rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoles(rolesList.length > 0 ? rolesList : [
        { id: 'admin', name: 'Administrador' },
        { id: 'docente', name: 'Docente' },
        { id: 'preceptor', name: 'Preceptor' },
        { id: 'estudiante', name: 'Estudiante' }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (field) => {
    const newVal = !config[field];
    const newConfig = { ...config, [field]: newVal };
    setConfig(newConfig);
    await updateDoc(doc(db, 'settings', 'global'), { [field]: newVal });
  };

  const toggleRoleAccess = async (listField, roleId) => {
    const currentList = config[listField] || ['admin'];
    const newList = currentList.includes(roleId)
      ? currentList.filter(r => r !== roleId)
      : [...currentList, roleId];
    
    const newConfig = { ...config, [listField]: newList };
    setConfig(newConfig);
    await updateDoc(doc(db, 'settings', 'global'), { [listField]: newList });
  };

  return (
    <>
      <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Configuración Global</h1>
          <p>Mantenimiento, estados del sistema y controles de acceso de emergencia.</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* PANEL MANTENIMIENTO */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Modo Mantenimiento</h2>
              <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Bloquea el acceso general al sitio.</p>
            </div>
            <button onClick={() => handleToggle('maintenance')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: config.maintenance ? '#ef4444' : 'var(--text-light)' }}>
              {config.maintenance ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
            </button>
          </div>

          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>Roles que pueden saltar el mantenimiento:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {roles.map(role => (
              <label key={role.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg)', borderRadius: '10px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{role.name || role.id}</span>
                <input 
                  type="checkbox" 
                  checked={config.allowedRolesMaintenance?.includes(role.id)} 
                  onChange={() => toggleRoleAccess('allowedRolesMaintenance', role.id)} 
                  disabled={role.id === 'admin'}
                />
              </label>
            ))}
          </div>
        </div>

        {/* PANEL CARGA */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Modo Carga (Global)</h2>
              <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Muestra animaciones de carga globales.</p>
            </div>
            <button onClick={() => handleToggle('loading')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: config.loading ? 'var(--color-primary)' : 'var(--text-light)' }}>
              {config.loading ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
            </button>
          </div>

          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>Roles excluidos de la carga visual:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {roles.map(role => (
              <label key={role.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg)', borderRadius: '10px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{role.name || role.id}</span>
                <input 
                  type="checkbox" 
                  checked={config.allowedRolesCarga?.includes(role.id)} 
                  onChange={() => toggleRoleAccess('allowedRolesCarga', role.id)} 
                  disabled={role.id === 'admin'}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', permissions: [] });

  const availablePermissions = [
    { 
      id: 'personal', label: 'Mi Personal', 
      sub: [
        { id: 'personal/database', label: 'Base de Datos Personal' },
        { id: 'personal/nomina', label: 'Nómina Personal' },
        { id: 'personal/pof', label: 'Control POF/POFA' },
        { id: 'personal/novedades', label: 'Novedades/Licencias' }
      ]
    },
    { id: 'escuela', label: 'Mi Escuela' },
    { 
      id: 'estudiantes', label: 'Mis Estudiantes', 
      sub: [
        { id: 'estudiantes/database', label: 'Base de Datos' },
        { id: 'estudiantes/nominas', label: 'Nóminas' }
      ] 
    },
    { 
      id: 'planillas', label: 'Mis Planillas', 
      sub: [
        { id: 'planillas/calificacion', label: 'Planillas Calificación' },
        { id: 'planillas/seguimiento', label: 'Planillas Seguimiento' }
      ] 
    },
    { id: 'boletin', label: 'Boletín Digital' },
    { 
      id: 'ajustes', label: 'Configuración', 
      sub: [
        { id: 'ajustes/usuarios', label: 'Gestión Usuarios' },
        { id: 'ajustes/sistema', label: 'Configuración Global' },
        { id: 'ajustes/roles', label: 'Gestión Roles' },
        { id: 'ajustes/plan', label: 'Plan de Estudios' }
      ] 
    },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const snap = await getDocs(collection(db, 'roles'));
      const rolesList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoles(rolesList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      // Normalización estricta (remueve acentos y espacios)
      const normalizedId = newRole.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
        .trim()
        .replace(/\s+/g, '-');
      
      // Si estamos editando y el ID cambió (cambiaron el nombre), eliminamos el anterior
      if (editingId && editingId !== normalizedId) {
        await deleteDoc(doc(db, 'roles', editingId));
      }

      await setDoc(doc(db, 'roles', normalizedId), {
        name: newRole.name,
        permissions: newRole.permissions,
        id: normalizedId
      });

      setShowAddForm(false);
      setEditingId(null);
      setNewRole({ name: '', permissions: [] });
      fetchRoles();
      alert("Rol guardado exitosamente.");
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (roleId === 'admin' || roleId === 'administrador') {
      return alert("Por razones de seguridad, el rol del Administrador principal no puede ser eliminado.");
    }
    
    if (!window.confirm("¿Estás seguro de eliminar este rol de acceso?")) return;
    
    try {
      await deleteDoc(doc(db, 'roles', roleId));
      await fetchRoles();
    } catch (error) {
      alert("Error al eliminar el rol: " + error.message);
    }
  };

  const startEdit = (role) => {
    setEditingId(role.id);
    setNewRole({ name: role.name || role.id, permissions: role.permissions });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePermission = (permId) => {
    setNewRole(prev => {
      const section = availablePermissions.find(s => s.id === permId);
      const isParent = !!(section && section.sub);
      
      let nextPerms = [...prev.permissions];

      if (isParent) {
        const subIds = section.sub.map(s => s.id);
        const allTargetIds = [section.id, ...subIds];
        const isCurrentlyFull = allTargetIds.every(id => prev.permissions.includes(id));

        if (isCurrentlyFull) {
          // Deseleccionar todo el bloque
          nextPerms = nextPerms.filter(p => !allTargetIds.includes(p));
        } else {
          // Asegurar de que todo el bloque esté seleccionado (DAR TODO)
          allTargetIds.forEach(id => { if(!nextPerms.includes(id)) nextPerms.push(id) });
        }
      } else {
        // Es un permiso individual (o sección sin sub)
        if (nextPerms.includes(permId)) {
          nextPerms = nextPerms.filter(p => p !== permId);
        } else {
          nextPerms.push(permId);
          // Si es un sub, asegurar que el padre esté marcado
          const parent = availablePermissions.find(s => s.sub && s.sub.some(sub => sub.id === permId));
          if (parent && !nextPerms.includes(parent.id)) nextPerms.push(parent.id);
        }
      }

      return { ...prev, permissions: nextPerms };
    });
  };

  const getLabelById = (id) => {
    for (const sec of availablePermissions) {
      if (sec.id === id) return sec.label;
      if (sec.sub) {
        const sub = sec.sub.find(s => s.id === id);
        if (sub) return sub.label;
      }
    }
    return id;
  };

  return (
    <>
      <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Gestión de Roles</h1>
          <p>Define con precisión los accesos granulares a secciones y sub-módulos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setNewRole({name:'', permissions:[]}); }}>
          {showAddForm ? <X size={20} /> : <Plus size={20} />} {showAddForm ? 'Cerrar' : 'Nuevo Rol'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSaveRole} className="card" style={{ marginBottom: '2rem', border: `2px solid ${editingId ? '#f59e0b22' : 'var(--color-primary)22'}` }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Editar Permisos del Rol' : 'Configurar Nuevo Rol de Acceso'}</h3>
          <div className="form-group">
            <label>Nombre del Rol</label>
            <input className="input-field" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="Ej: Secretaria" required />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <label>Mapa de Permisos (Secciones y Sub-módulos)</label>
               <button type="button" className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', background: '#f8fafc', border: '1px solid var(--border)' }} onClick={() => {
                  const allIds = availablePermissions.flatMap(s => [s.id, ...(s.sub ? s.sub.map(sub => sub.id) : [])]);
                  const isFull = allIds.every(id => newRole.permissions.includes(id));
                  setNewRole(prev => ({ ...prev, permissions: isFull ? [] : allIds }));
               }}>
                  {availablePermissions.flatMap(s => [s.id, ...(s.sub ? s.sub.map(sub => sub.id) : [])]).every(id => newRole.permissions.includes(id)) ? 'Deseleccionar Todo' : 'Acceso Total Plataforma'}
               </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {availablePermissions.map(sec => {
                const subIds = sec.sub ? sec.sub.map(s => s.id) : [];
                const hasFullSec = [sec.id, ...subIds].every(id => newRole.permissions.includes(id));
                
                return (
                  <div key={sec.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: `2px solid ${hasFullSec ? 'var(--color-primary)' : '#e2e8f0'}`, boxShadow: hasFullSec ? '0 8px 20px var(--color-primary)11' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                       <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                         <input type="checkbox" checked={newRole.permissions.includes(sec.id)} onChange={() => togglePermission(sec.id)} style={{ width: '18px', height: '18px' }} />
                         <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>{sec.label}</span>
                       </label>
                       {sec.sub && (
                         <button type="button" style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 800, 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            border: '1px solid var(--color-primary)', 
                            background: hasFullSec ? 'var(--color-primary)' : 'transparent',
                            color: hasFullSec ? 'white' : 'var(--color-primary)',
                            cursor: 'pointer'
                         }} onClick={() => togglePermission(sec.id)}>
                            {hasFullSec ? 'ACCESO TOTAL' : 'DAR TODO'}
                         </button>
                       )}
                    </div>

                    {sec.sub && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '0.5rem' }}>
                        {sec.sub.map(sub => (
                          <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: newRole.permissions.includes(sub.id) ? '#f0f9ff' : 'transparent' }}>
                            <input type="checkbox" checked={newRole.permissions.includes(sub.id)} onChange={() => togglePermission(sub.id)} style={{ width: '16px', height: '16px' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: newRole.permissions.includes(sub.id) ? 'var(--color-primary)' : '#475569' }}>{sub.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, background: editingId ? '#f59e0b' : 'var(--color-secondary)' }}>
              {editingId ? 'Actualizar Privilegios' : 'Confirmar Rol'}
            </button>
            <button type="button" className="btn" onClick={() => { setShowAddForm(false); setEditingId(null); }} style={{ flex: 1, border: '1px solid var(--border)' }}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2">
        {roles.map(role => (
          <div key={role.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ textTransform: 'capitalize', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{role.name || role.id}</h3>
                <span className="badge" style={{ background: 'var(--bg-admin)', color: 'var(--color-admin)' }}>{role.permissions.filter(p => !p.includes('/')).length} secciones / {role.permissions.filter(p => p.includes('/')).length} sub-modulos</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => startEdit(role)} className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', color: '#f59e0b' }} title="Editar"><Pencil size={18} /></button>
                  <button onClick={() => handleDeleteRole(role.id)} className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', color: '#ef4444' }} title="Eliminar"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {role.permissions.map(p => (
                <div key={p} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem', 
                  fontSize: '0.75rem', 
                  background: p.includes('/') ? 'white' : 'var(--color-primary)', 
                  color: p.includes('/') ? 'var(--color-primary)' : 'white', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '6px', 
                  fontWeight: 700, 
                  border: p.includes('/') ? '1px solid var(--color-primary)33' : 'none' 
                }}>
                  {p.includes('/') ? '#' : <Check size={12} />} {getLabelById(p)}
                </div>
              ))}
              {role.permissions.length === 0 && <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>Sin acceso a la plataforma.</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uSnap = await getDocs(collection(db, 'users'));
      setUsers(uSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const rSnap = await getDocs(collection(db, 'roles'));
      setAvailableRoles(rSnap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const promoteSelf = async () => {
    const me = auth.currentUser;
    if (!me) return alert("No se detectó sesión activa.");
    try {
      await updateDoc(doc(db, 'users', me.uid), { role: 'administrador' });
      alert("¡Ahora eres Administrador oficial!");
      fetchData();
    } catch (err) {
      alert("Error al auto-promocionar: " + err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <div className="header-flex">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Gestión de Usuarios</h1>
          <p>Control de acceso y asignación de roles para el personal y alumnos.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={promoteSelf}>Asignarme Administrador</button>
          <button className="btn btn-primary">Registrar Nuevo Usuario</button>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre y Apellido</th>
                <th>Correo Electrónico</th>
                <th>DNI / Legajo</th>
                <th>Rol Actual</th>
                <th>Asignar Nuevo Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 600 }}>{user.nombre} {user.apellido}</td>
                  <td>{user.email}</td>
                  <td style={{ fontFamily: 'monospace' }}>{user.dni}</td>
                  <td>
                    <span className="badge" style={{ 
                      background: (user.role === 'admin' || user.role === 'administrador') ? 'var(--bg-admin)' : '#eff6ff',
                      color: (user.role === 'admin' || user.role === 'administrador') ? 'var(--color-admin)' : '#2563eb'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="input-field" 
                      style={{ padding: '0.4rem', fontSize: '0.85rem', width: '100%', maxWidth: '200px' }}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      {availableRoles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}


function AdminHome() {
  return (
    <>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Bienvenid@s al portal ENSAM | EES N° 21</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>Gestión Institucional de la Plataforma</p>
          <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: 'var(--border)' }}></span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-admin)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Panel Administrador</span>
        </div>
      </div>

      <DashboardGrid>
        <DashboardCard
          color="#3b82f6"
          title="Mi Personal"
          description="Gestión integral de legajos de docentes y auxiliares."
          icon={<Users size={28} />}
          href="/dashboard/personal"
        />
        <DashboardCard
          color="#f97316"
          title="Mi Escuela"
          description="Gestión de proyectos, noticias y espacios institucionales."
          icon={<School size={28} />}
          href="/dashboard/escuela"
        />
        <DashboardCard
          color="#10b981"
          title="Mis Estudiantes"
          description="Seguimiento de matrícula y expedientes de alumnos."
          icon={<GraduationCap size={28} />}
          href="/dashboard/estudiantes"
        />
        <DashboardCard
          color="#06b6d4"
          title="Prácticas Docentes"
          description="Gestión de residentes y alumnos del profesorado en la escuela."
          icon={<BookUser size={28} />}
          href="/dashboard/practicas"
        />
        <DashboardCard
          color="#8b5cf6"
          title="Mis Planillas"
          description="Planillas de calificación, asistencia y seguimiento."
          icon={<ClipboardList size={28} />}
          href="/dashboard/planillas"
        />
        <DashboardCard
          color="#fbbf24"
          title="Boletín Digital"
          description="Administración de reportes académicos y calificaciones."
          icon={<ClipboardList size={28} />}
          href="/dashboard/boletin"
        />
        <DashboardCard
          color="#ef4444"
          title="Configuración de Plataforma"
          description="Ajustes técnicos, permisos de usuario y roles."
          icon={<Settings size={28} />}
          href="/dashboard/ajustes"
          target="_self"
        />
      </DashboardGrid>
    </>
  );
}

function ConfigHome() {
  return (
    <>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Configuración de Plataforma</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Gestiona los parámetros base, accesos y permisos del sistema.</p>
      </div>

      <DashboardGrid>
        <DashboardCard 
          color="#3b82f6" 
          title="Gestión de Usuarios" 
          description="Crea, edita y suspende cuentas de docentes y alumnos." 
          icon={<Users size={28} />} 
          href="/dashboard/ajustes/usuarios"
          target="_self"
        />
        <DashboardCard 
          color="#f59e0b" 
          title="Gestión de Plataforma" 
          description="Ajustes técnicos, variables globales y mantenimiento." 
          icon={<Settings size={28} />} 
          href="/dashboard/ajustes/sistema"
          target="_self"
        />
        <DashboardCard 
          color="#ef4444" 
          title="Gestión de Roles" 
          description="Define y modifica permisos para cada tipo de cuenta." 
          icon={<Shield size={28} />} 
          href="/dashboard/ajustes/roles"
          target="_self"
        />
        <DashboardCard 
          color="#8b5cf6" 
          title="Gestionar Plan de Estudios" 
          description="Configura orientaciones y planes de estudio institucionales." 
          icon={<Book size={28} />} 
          href="/dashboard/ajustes/plan"
          target="_self"
        />
      </DashboardGrid>
    </>
  );
}

export default function AdminDashboard() {
  const location = useLocation();

  useEffect(() => {
    // Asegurar que el rol maestro exista en la DB apenas entramos
    const ensureAdmin = async () => {
      try {
        const adminRef = doc(db, 'roles', 'administrador');
        const snap = await getDoc(adminRef);
        const allPerms = [
          'personal', 'personal/database', 'personal/nomina', 'personal/pof', 'personal/novedades',
          'escuela', 'boletin', 
          'estudiantes', 'estudiantes/database', 'estudiantes/nominas',
          'planillas', 'planillas/calificacion', 'planillas/seguimiento',
          'ajustes', 'ajustes/usuarios', 'ajustes/sistema', 'ajustes/roles', 'ajustes/plan'
        ];
        if (!snap.exists()) {
          await setDoc(adminRef, { id: 'administrador', name: 'Administrador', permissions: allPerms });
        } else if (snap.data().permissions?.length < allPerms.length) {
          await updateDoc(adminRef, { permissions: allPerms });
        }
      } catch (err) {
        console.error("Error inicializando Admin:", err);
      }
    };
    ensureAdmin();
  }, []);

  // Mapeo dinámico de títulos basado en la ruta actual
  const getDynamicTitle = () => {
    const path = location.pathname;
    if (path.includes('personal/database')) return 'Base de Datos Personal';
    if (path.includes('personal/nomina')) return 'Nómina Personal';
    if (path.includes('personal/pof')) return 'Control de POF/POFA';
    if (path.includes('personal/novedades')) return 'Novedades Administrativas';
    if (path.includes('personal')) return 'Mi Personal';
    if (path.includes('estudiantes/nominas')) return 'Nóminas Escolares';
    if (path.includes('estudiantes/database')) return 'Base de Datos de Estudiantes';
    if (path.includes('estudiantes')) return 'Mis Estudiantes';
    if (path.includes('planillas/calificacion')) return 'Planillas de Calificación';
    if (path.includes('planillas/seguimiento')) return 'Planillas de Seguimiento';
    if (path.includes('planillas')) return 'Mis Planillas';
    if (path.includes('escuela')) return 'Mi Escuela';
    if (path.includes('boletin')) return 'Boletín Digital';
    if (path.includes('ajustes/usuarios')) return 'Gestión de Usuarios';
    if (path.includes('ajustes/sistema')) return 'Gestión de Plataforma';
    if (path.includes('ajustes/roles')) return 'Gestión de Roles';
    if (path.includes('ajustes/plan')) return 'Plan de Estudios';
    if (path.includes('ajustes')) return 'Configuración';
    return 'Panel de Control';
  };

  return (
    <MainLayout role="admin" title={getDynamicTitle()}>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="personal" element={<PersonalHome />} />
        <Route path="personal/database" element={<PersonalDatabase />} />
        <Route path="personal/nomina" element={<PersonalNomina />} />
        <Route path="personal/cupof" element={<PersonalCUPOF />} />
        <Route path="personal/pof" element={
          <div style={{ padding: '2rem' }}>
            <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/pof" subSections={PERSONAL_SECTIONS} />
            <h2>Planta Orgánica Funcional (POF/POFA)</h2>
            <p>Sección en desarrollo...</p>
          </div>
        } />
        <Route path="personal/novedades" element={
          <div style={{ padding: '2rem' }}>
            <AdminSubNav mainTitle="Mi Personal" mainPath="/dashboard/personal" currentPath="/dashboard/personal/novedades" subSections={PERSONAL_SECTIONS} />
            <h2>Novedades y Licencias</h2>
            <p>Sección en desarrollo...</p>
          </div>
        } />
        <Route path="escuela" element={<MiEscuelaHome />} />
        <Route path="practicas" element={<PracticaHome />} />
        <Route path="practicas/institutos" element={<PracticaInstitutos />} />
        <Route path="practicas/docentes" element={<PracticaDocentes />} />
        <Route path="practicas/estudiantes" element={<PracticaEstudiantes />} />
        <Route path="practicas/accesos" element={<PracticaAccesos />} />
        <Route path="planillas" element={<PlanillasHome />} />
        <Route path="planillas/calificacion" element={<div>Libro de Calificaciones Digital (Carga de Notas)</div>} />
        <Route path="planillas/seguimiento" element={<div>Planillas de Seguimiento Pedagógico y Asistencia</div>} />
        <Route path="estudiantes" element={<EstudiantesHome />} />
        <Route path="estudiantes/database" element={<div>Base de Datos de Estudiantes (Próximamente)</div>} />
        <Route path="estudiantes/nominas" element={<NominaEstudiantes />} />
        <Route path="boletin" element={<div>Boletín Digital (Próximamente)</div>} />
        <Route path="ajustes" element={<ConfigHome />} />
        <Route path="ajustes/usuarios" element={<UserManagement />} />
        <Route path="ajustes/sistema" element={<GlobalSettings />} />
        <Route path="ajustes/roles" element={<RoleManagement />} />
        <Route path="ajustes/plan" element={<PlanEstudiosManagement />} />
        <Route path="*" element={<AdminHome />} />
      </Routes>
    </MainLayout>
  );
}
