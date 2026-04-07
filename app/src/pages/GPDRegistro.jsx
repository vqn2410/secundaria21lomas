import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { gpdAuth, gpdDb, gpdStorage } from '../firebase';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

export default function GPDRegistro() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [targetedRole, setTargetedRole] = useState('practicante');
  const [institutosDb, setInstitutosDb] = useState([]);
  const [profesoradosDb, setProfesoradosDb] = useState([]);
  const [filteredProfs, setFilteredProfs] = useState([]);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchInstitutos = async () => {
      try {
        const snap = await getDocs(collection(gpdDb, 'institutos'));
        setInstitutosDb(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error cargando institutos:", err);
      }
    };
    const fetchProfesorados = async () => {
      try {
        const snap = await getDocs(collection(gpdDb, 'profesorados'));
        setProfesoradosDb(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { console.error(err); }
    };
    fetchInstitutos();
    fetchProfesorados();

    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    if (params.get('rol') === 'docente') {
      setTargetedRole('docente');
      setRegForm(prev => ({ ...prev, rol: 'docente' }));
    } else {
      setTargetedRole('practicante');
      setRegForm(prev => ({ ...prev, rol: 'practicante' }));
    }
  }, [location]);

  // Formularios
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    rol: 'practicante', nombre: '', apellido: '', dni: '', telefono: '', email: '', password: '',
    direccion: '', localidad: '', salud: '', instituto: '', distrito: '', profesorado: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(gpdAuth, loginForm.email, loginForm.password);
      navigate('/gpd-panel');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (targetedRole === 'practicante' && !photoFile) {
      setError('Debes subir una foto tipo 4x4 para completar el registro.');
      return;
    }
    
    setLoading(true);
    setError('');
    console.log("LOG: Iniciando registro...", regForm.email);

    try {
      // Función con Timeout para evitar bloqueos infinitos
      const withTimeout = (promise, ms, stepName) => {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`Tiempo agotado en ${stepName}`)), ms));
        return Promise.race([promise, timeout]);
      };

      // 1. Crear Usuario
      console.log("LOG: Creando usuario...");
      const userCred = await withTimeout(
        createUserWithEmailAndPassword(gpdAuth, regForm.email, regForm.password), 
        10000, "el Servidor de Autenticación"
      );
      const uid = userCred.user.uid;
      console.log("LOG: Usuario creado UID:", uid);
      
      // 2. Subir Foto (Opcional si falla, pero lo intentamos)
      let photoURL = '';
      if (photoFile) {
        try {
          console.log("LOG: Subiendo foto...");
          const photoRef = ref(gpdStorage, `fotos_4x4/${uid}`);
          await withTimeout(uploadBytes(photoRef, photoFile, { contentType: photoFile.type }), 10000, "la subida de la Foto");
          photoURL = await getDownloadURL(photoRef);
          console.log("LOG: Foto lista.");
        } catch (storageErr) {
          console.warn("ADVERTENCIA: Falló la subida de la foto, pero seguiremos con el registro:", storageErr);
        }
      }
      
      // 3. Guardar Perfil
      console.log("LOG: Guardando perfil...");
      const collectionName = targetedRole === 'docente' ? 'docentes_practica' : 'practicantes';
      const docData = {
        rol: targetedRole,
        nombre: regForm.nombre,
        apellido: regForm.apellido,
        dni: regForm.dni,
        telefono: regForm.telefono,
        email: regForm.email,
        direccion: regForm.direccion || '',
        localidad: regForm.localidad || '',
        salud: regForm.salud || '',
        instituto: regForm.instituto || 'No especificado',
        distrito: regForm.distrito || 'No especificado',
        profesorado: regForm.profesorado || 'No especificado',
        photoURL: photoURL,
        status: 'Pendiente',
        createdAt: new Date()
      };

      await withTimeout(setDoc(doc(gpdDb, collectionName, uid), docData), 10000, "el guardado de la Base de Datos");
      
      console.log("LOG: ÉXITO TOTAL.");
      setLoading(false);
      navigate('/gpd-panel');

    } catch (err) {
      console.error("ERROR DETECTADO:", err);
      let msg = "Error: " + err.message;
      if (err.message.includes("Tiempo agotado")) msg = `La conexión es demasiado lenta o ${err.message}.`;
      else if (err.code === 'auth/email-already-in-use') msg = "Este mail ya está registrado.";
      
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fdf4ff' }}>
      <div className="card" style={{ maxWidth: isLogin ? '400px' : '700px', width: '100%', padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#ec4899', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '1rem' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ textAlign: 'center', color: '#ec4899' }}>Gestión de Prácticas Docentes</h2>
          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            {isLogin ? 'Ingreso al Sistema GPD' : (targetedRole === 'docente' ? 'Registro para Docentes de Práctica' : 'Registro de Estudiantes Practicantes')}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" required className="input-field" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Contraseña</label>
              <input type="password" required className="input-field" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            </div>
            <button className="btn" type="submit" disabled={loading} style={{ background: '#ec4899', color: 'white', width: '100%' }}>
              {loading ? 'Entrando...' : 'Ingresar'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
              ¿No tienes cuenta? <span style={{ color: '#ec4899', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLogin(false)}>Regístrate aquí</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label>Nombre(s) *</label>
                <input required className="input-field" value={regForm.nombre} onChange={e => setRegForm({...regForm, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Apellido(s) *</label>
                <input required className="input-field" value={regForm.apellido} onChange={e => setRegForm({...regForm, apellido: e.target.value})} />
              </div>
              <div className="form-group">
                <label>DNI *</label>
                <input required className="input-field" value={regForm.dni} onChange={e => setRegForm({...regForm, dni: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Teléfono *</label>
                <input required className="input-field" value={regForm.telefono} onChange={e => setRegForm({...regForm, telefono: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Instituto Superior (ISFD) *</label>
                <select required className="input-field" value={regForm.instituto} onChange={e => {
                  const sel = e.target.value;
                  const instMatch = institutosDb.find(i => i.nombre === sel);
                  setRegForm({...regForm, instituto: sel, distrito: instMatch ? instMatch.distrito : '', profesorado: ''});
                  setFilteredProfs(instMatch?.profesorados || []);
                }}>
                  <option value="" disabled>Seleccione un Instituto...</option>
                  {institutosDb.map(inst => (
                    <option key={inst.id} value={inst.nombre}>{inst.nombre} {inst.distrito ? `(${inst.distrito})` : ''}</option>
                  ))}
                  <option value="Otro">Otro (No listado)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Distrito *</label>
                <input required className="input-field" value={regForm.distrito} onChange={e => setRegForm({...regForm, distrito: e.target.value})} placeholder="Ej: Adrogué" disabled={regForm.instituto !== 'Otro' && regForm.instituto !== ''} style={{ background: (regForm.instituto !== 'Otro' && regForm.instituto !== '') ? '#f1f5f9' : 'white' }} />
              </div>
              
              {targetedRole === 'practicante' && regForm.instituto && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                   <label>Carrera / Profesorado que cursa en {regForm.instituto} *</label>
                   <select required className="input-field" value={regForm.profesorado} onChange={e => setRegForm({...regForm, profesorado: e.target.value})}>
                      <option value="" disabled>Seleccione su profesorado...</option>
                      {filteredProfs.map((p, i) => (
                        <option key={i} value={p}>{p}</option>
                      ))}
                      {regForm.instituto === 'Otro' && profesoradosDb.map(p => (
                        <option key={p.id} value={p.nombre}>{p.nombre}</option>
                      ))}
                   </select>
                </div>
              )}
              
              {targetedRole === 'practicante' && (
                <>
                  <div className="form-group">
                    <label>Dirección (Calle y Altura) *</label>
                    <input required className="input-field" value={regForm.direccion} onChange={e => setRegForm({...regForm, direccion: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Localidad *</label>
                    <input required className="input-field" value={regForm.localidad} onChange={e => setRegForm({...regForm, localidad: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Datos de Salud (Alergias, medicamentos, etc)</label>
                    <textarea className="input-field" style={{ minHeight: '60px' }} value={regForm.salud} onChange={e => setRegForm({...regForm, salud: e.target.value})} placeholder="Indique si posee alguna condición a tener en cuenta" />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Correo Electrónico *</label>
                <input type="email" required className="input-field" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input type="password" required className="input-field" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} minLength={6} />
              </div>

              {targetedRole === 'practicante' && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Foto de Legajo (Tipo 4x4) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem', padding: '1.5rem', border: '2px dashed #ec4899', borderRadius: '12px', background: '#fdf2f8' }}>
                    <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '8px', border: '1px solid #fbcfe8', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera color="#ec4899" size={32} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', color: '#db2777', marginBottom: '0.5rem', fontWeight: 600 }}>La foto debe ser tipo carnet con fondo liso.</p>
                      <input type="file" accept="image/*" style={{ display: 'none' }} id="photo-upload" onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }} />
                      <label htmlFor="photo-upload" className="btn" style={{ background: '#ec4899', color: 'white', fontSize: '0.8rem', padding: '0.6rem 1rem', cursor: 'pointer', display: 'inline-block' }}>
                        Seleccionar Archivo
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button className="btn" type="submit" disabled={loading} style={{ background: '#ec4899', color: 'white', width: '100%', marginTop: '1rem' }}>
              {loading ? 'Registrando...' : 'Completar Registro'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
              ¿Ya estás registrado? <span style={{ color: '#ec4899', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLogin(true)}>Inicia Sesión</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
