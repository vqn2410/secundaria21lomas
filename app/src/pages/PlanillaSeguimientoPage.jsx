import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Search, ArrowLeft, Clipboard, User, Loader2, Clock, UserCheck } from 'lucide-react';
import Logo from '../components/Logo';

export function SeguimientoMando({ onBackToDashboard }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'estudiante'));
        const snap = await getDocs(q);
        setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (selectedStudent) {
    return <PlanillaSeguimiento student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div className="header-flex" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>Seguimiento Escolar</h1>
          <p>Gestión de Legajo Pedagógico y Disciplinario (AIC).</p>
        </div>
      </div>

      <div className="card">
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="input-field"
            style={{ paddingLeft: '3rem' }}
            placeholder="Buscar estudiante por nombre o DNI..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          {loading ? <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div> : (
            <table>
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th style={{ textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {students.filter(s => `${s.apellido} ${s.nombre} ${s.dni}`.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 800 }}>{s.dni}</td>
                    <td>{s.apellido?.toUpperCase()}, {s.nombre}</td>
                    <td>{s.curso || 'No asignado'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-primary" onClick={() => setSelectedStudent(s)} style={{ fontSize: '0.8rem' }}>Ver Planilla / Legajo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlanillaSeguimiento({ student, onBack }) {
  const [data, setData] = useState({
    preceptor: '', curso: '', division: '', turno: '', ciclo: '2026',
    legajoNro: '', escuelaProcedencia: '', distrito: 'Lomas de Zamora',
    antecedentes: { cursados: Array(6).fill(false), ingreso: '' },
    pendientes: '',
    ausentismo: 'Bajo',
    aic: Array(10).fill({ fecha: '', falta: '', audit: null }),
    reparadoras: Array(5).fill({ fecha: '', accion: '', audit: null }),
    entrevistas: Array(10).fill({ fecha: '', acuerdos: '', audit: null }),
    eoe: Array(10).fill({ fecha: '', motivo: '', accion: '', audit: null })
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, 'seguimiento_estudiantes', student.id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const dbData = snap.data();
        setData(prev => ({
          ...prev,
          ...dbData,
          aic: dbData.aic || prev.aic,
          reparadoras: dbData.reparadoras || prev.reparadoras,
          entrevistas: dbData.entrevistas || prev.entrevistas,
          eoe: dbData.eoe || prev.eoe
        }));
      }
    };
    fetchDoc();
  }, [student.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'seguimiento_estudiantes', student.id), {
        ...data,
        updatedAt: new Date(),
        studentName: `${student.apellido}, ${student.nombre}`
      });
      alert("Legajo pedagógico guardado con éxito.");
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const updateTable = (field, idx, subfield, val) => {
    const next = [...data[field]];
    const currentUser = auth.currentUser;
    const auditData = {
      by: currentUser ? currentUser.email : 'Sistema',
      at: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
    };

    next[idx] = {
      ...next[idx],
      [subfield]: val,
      audit: auditData // Store who and when
    };
    setData({ ...data, [field]: next });
  };

  const cellStyle = { border: '1px solid #000', padding: '4px', fontSize: '0.75rem' };
  const headerStyle = { border: '1px solid #000', padding: '6px', background: '#f1f5f9', fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'center' };

  const addRow = (field) => {
    let newRow = { fecha: '', audit: null };
    if (field === 'aic') newRow.falta = '';
    if (field === 'reparadoras') newRow.accion = '';
    if (field === 'entrevistas') newRow.acuerdos = '';
    if (field === 'eoe') { newRow.motivo = ''; newRow.accion = ''; }

    setData({
      ...data,
      [field]: [...data[field], newRow]
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="btn" onClick={onBack}><ArrowLeft size={18} /> Volver</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar en Legajo Digital'}
        </button>
      </div>

      <div style={{ background: 'white', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
        <header style={{ display: 'flex', border: '1.5px solid #000', padding: '1rem', alignItems: 'center', marginBottom: '1rem', gap: '1.5rem' }}>
          <Logo to="#" onlyImage={true} style={{ transform: 'scale(1.2)' }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '5px' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>PROVINCIA DE BUENOS AIRES</h4>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, margin: 0 }}>DIRECCIÓN GENERAL DE CULTURA Y EDUCACIÓN</h4>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, margin: 0 }}>DIRECCIÓN PROVINCIAL DE EDUCACIÓN SECUNDARIA</h4>
            </div>

            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0, opacity: 0.9 }}>Unidad Académica de la Escuela Normal Superior "Antonio Mentruyt"</h4>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.5px', margin: '2px 0' }}>ESCUELA DE EDUCACIÓN SECUNDARIA Nº 21</h2>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 5px' }}>"ANTONIO MENTRUYT" - ENSAM</h3>

            <div style={{ display: 'flex', gap: '15px', fontSize: '0.6rem', fontWeight: 700, opacity: 0.8, borderTop: '1px solid #eee', paddingTop: '4px' }}>
              <span> Manuel Castro 990 - Lomas de Zamora |</span>
              <span> 4244-0351 |</span>
              <span> secundaria21lomasdezamora@abc.gob.ar</span>
            </div>
          </div>
        </header>

        <h2 style={{ textAlign: 'center', fontWeight: '900', fontSize: '1.1rem', padding: '8px', border: '1.5px solid #000', background: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Planilla de Seguimiento de Trayectoria Escolar
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', border: '1px solid #000', marginBottom: '1rem' }}>
          <div style={cellStyle}><strong>PREC:</strong> <input type="text" style={{ border: 'none', width: '70%', background: 'transparent' }} value={data.preceptor} onChange={e => setData({ ...data, preceptor: e.target.value })} /></div>
          <div style={cellStyle}><strong>CURSO:</strong> <input type="text" style={{ border: 'none', width: '50%', background: 'transparent' }} value={data.curso} onChange={e => setData({ ...data, curso: e.target.value })} /></div>
          <div style={cellStyle}><strong>DIV:</strong> <input type="text" style={{ border: 'none', width: '50%', background: 'transparent' }} value={data.division} onChange={e => setData({ ...data, division: e.target.value })} /></div>
          <div style={cellStyle}><strong>TURNO:</strong> <input type="text" style={{ border: 'none', width: '50%', background: 'transparent' }} value={data.turno} onChange={e => setData({ ...data, turno: e.target.value })} /></div>
          <div style={cellStyle}><strong>CICLO:</strong> {data.ciclo}</div>
        </div>

        <div style={{ border: '1px solid #000', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', borderBottom: '1px solid #000' }}>
            <div style={headerStyle}>ESTUDIANTE</div>
            <div style={{ ...cellStyle, borderRight: '1px solid #000' }}> <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>APELLIDO/S</div> <strong>{student.apellido?.toUpperCase()}</strong> </div>
            <div style={cellStyle}> <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>NOMBRE/S</div> <strong>{student.nombre}</strong> </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr' }}>
            <div style={{ ...cellStyle, borderRight: '1px solid #000' }}><strong>LEGAJO Nº:</strong> <input type="text" style={{ border: 'none', width: '40%', background: 'transparent', fontWeight: 800 }} value={data.legajoNro} onChange={e => setData({ ...data, legajoNro: e.target.value })} /></div>
            <div style={{ ...cellStyle, borderRight: '1px solid #000' }}><strong>DNI:</strong> {student.dni}</div>
            <div style={cellStyle}><strong>NACIMIENTO:</strong> {student.fecha_nacimiento || '-'}</div>
          </div>
        </div>

        <div style={{ border: '1px solid #000', display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
          <div style={{ ...cellStyle, borderRight: '1px solid #000' }}><strong>ESC. PROCEDENCIA:</strong> <input type="text" style={{ border: 'none', width: '60%', background: 'transparent' }} value={data.escuelaProcedencia} onChange={e => setData({ ...data, escuelaProcedencia: e.target.value })} /></div>
          <div style={cellStyle}><strong>DISTRITO:</strong> {data.distrito}</div>
        </div>

        <div style={{ border: '1px solid #000', marginBottom: '1rem' }}>
          <div style={headerStyle}>ANTECEDENTES ACADÉMICOS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 2.5fr' }}>
            <div style={{ ...cellStyle, padding: '10px' }}><strong>AÑOS CURSADOS:</strong></div>
            <div style={{ ...cellStyle, display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5, 6].map((año, i) => (
                <label key={año} style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                  <input type="checkbox" checked={data.antecedentes.cursados[i]} onChange={e => {
                    const next = [...data.antecedentes.cursados];
                    next[i] = e.target.checked;
                    setData({ ...data, antecedentes: { ...data.antecedentes, cursados: next } });
                  }} /> {año}°
                </label>
              ))}
            </div>
            <div style={cellStyle}><strong>AÑO DE INGRESO:</strong> <input type="text" style={{ border: 'none', width: '40%', background: 'transparent' }} value={data.antecedentes.ingreso} onChange={e => setData({ ...data, antecedentes: { ...data.antecedentes, ingreso: e.target.value } })} /></div>
          </div>
        </div>

        <div style={{ border: '1px solid #000', marginBottom: '1rem' }}>
          <div style={headerStyle}>ASIGNATURAS PENDIENTES DE ACREDITACIÓN</div>
          <textarea style={{ width: '100%', minHeight: '40px', border: 'none', padding: '10px', fontSize: '0.8rem' }} value={data.pendientes} onChange={e => setData({ ...data, pendientes: e.target.value })} />
        </div>

        <div style={{ border: '1px solid #000', marginBottom: '1rem' }}>
          <div style={headerStyle}>AUSENTISMO</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '5px' }}>
            {['ALTO', 'MEDIO', 'BAJO'].map(tipo => (
              <label key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '0.8rem' }}>
                <input type="radio" value={tipo} checked={data.ausentismo === tipo} onChange={e => setData({ ...data, ausentismo: e.target.value })} /> {tipo}
              </label>
            ))}
          </div>
        </div>

        <div style={{ border: '1.5px solid #000', marginBottom: '1.5rem' }}>
          <div style={headerStyle}>REGISTRO DE FALTAS / INCUMPLIMIENTO AIC</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>FECHA</th>
                <th style={headerStyle}>FALTA COMETIDA</th>
                <th style={{ ...headerStyle, width: '30%' }}>REGISTRO DE CARGA</th>
              </tr>
            </thead>
            <tbody>
              {data.aic.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, width: '120px' }}><input type="date" value={r.fecha} onChange={e => updateTable('aic', i, 'fecha', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={cellStyle}><input type="text" value={r.falta} onChange={e => updateTable('aic', i, 'falta', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={{ ...cellStyle, background: '#f8fafc', color: '#64748b', fontSize: '0.6rem' }}>
                    {r.audit && <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span><UserCheck size={10} style={{ marginRight: '4px' }} /> {r.audit.by}</span>
                      <span><Clock size={10} style={{ marginRight: '4px' }} /> {r.audit.at}</span>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('aic')} className="btn" style={{ width: '100%', borderRadius: 0, border: 'none', borderTop: '1px solid #000', fontSize: '0.7rem', fontWeight: 800, background: '#f8fafc' }}>+ AGREGAR FILA AIC</button>
        </div>

        <div style={{ border: '1.5px solid #000', marginBottom: '1.5rem' }}>
          <div style={headerStyle}>ACCIÓN REPARADORA</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>FECHA</th>
                <th style={headerStyle}>ACCIÓN TRABAJADA</th>
                <th style={{ ...headerStyle, width: '30%' }}>REGISTRO DE CARGA</th>
              </tr>
            </thead>
            <tbody>
              {data.reparadoras.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, width: '120px' }}><input type="date" value={r.fecha} onChange={e => updateTable('reparadoras', i, 'fecha', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={cellStyle}><input type="text" value={r.accion} onChange={e => updateTable('reparadoras', i, 'accion', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={{ ...cellStyle, background: '#f8fafc', color: '#64748b', fontSize: '0.6rem' }}>
                    {r.audit && <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span><UserCheck size={10} style={{ marginRight: '4px' }} /> {r.audit.by}</span>
                      <span><Clock size={10} style={{ marginRight: '4px' }} /> {r.audit.at}</span>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('reparadoras')} className="btn" style={{ width: '100%', borderRadius: 0, border: 'none', borderTop: '1px solid #000', fontSize: '0.7rem', fontWeight: 800, background: '#f8fafc' }}>+ AGREGAR ACCIÓN REPARADORA</button>
        </div>

        <div style={{ border: '1.5px solid #000', marginBottom: '1.5rem' }}>
          <div style={headerStyle}>ENTREVISTAS Y ACUERDOS CON FAMILIA</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>FECHA</th>
                <th style={headerStyle}>DETALLE DE LA ENTREVISTA / ACUERDOS</th>
                <th style={{ ...headerStyle, width: '30%' }}>REGISTRO DE CARGA</th>
              </tr>
            </thead>
            <tbody>
              {data.entrevistas.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, width: '120px' }}><input type="date" value={r.fecha} onChange={e => updateTable('entrevistas', i, 'fecha', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={cellStyle}><textarea value={r.acuerdos} onChange={e => updateTable('entrevistas', i, 'acuerdos', e.target.value)} style={{ border: 'none', width: '100%', minHeight: '30px' }} /></td>
                  <td style={{ ...cellStyle, background: '#f8fafc', color: '#64748b', fontSize: '0.6rem' }}>
                    {r.audit && <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span><UserCheck size={10} style={{ marginRight: '4px' }} /> {r.audit.by}</span>
                      <span><Clock size={10} style={{ marginRight: '4px' }} /> {r.audit.at}</span>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('entrevistas')} className="btn" style={{ width: '100%', borderRadius: 0, border: 'none', borderTop: '1px solid #000', fontSize: '0.7rem', fontWeight: 800, background: '#f8fafc' }}>+ AGREGAR ENTREVISTA</button>
        </div>

        <div style={{ border: '1.5px solid #000' }}>
          <div style={headerStyle}>INTERVENCIONES E.O.E.</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerStyle}>FECHA</th>
                <th style={headerStyle}>MOTIVO</th>
                <th style={headerStyle}>INTERVENCIÓN / ACCIÓN</th>
                <th style={{ ...headerStyle, width: '30%' }}>REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {data.eoe.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, width: '120px' }}><input type="date" value={r.fecha} onChange={e => updateTable('eoe', i, 'fecha', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={cellStyle}><input type="text" value={r.motivo} onChange={e => updateTable('eoe', i, 'motivo', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={cellStyle}><input type="text" value={r.accion} onChange={e => updateTable('eoe', i, 'accion', e.target.value)} style={{ border: 'none', width: '100%' }} /></td>
                  <td style={{ ...cellStyle, background: '#f8fafc', color: '#64748b', fontSize: '0.6rem' }}>
                    {r.audit && <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span><UserCheck size={10} style={{ marginRight: '4px' }} /> {r.audit.by}</span>
                      <span><Clock size={10} style={{ marginRight: '4px' }} /> {r.audit.at}</span>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('eoe')} className="btn" style={{ width: '100%', borderRadius: 0, border: 'none', borderTop: '1px solid #000', fontSize: '0.7rem', fontWeight: 800, background: '#f8fafc' }}>+ AGREGAR INTERVENCIÓN EOE</button>
        </div>
      </div>
    </div>
  );
}

