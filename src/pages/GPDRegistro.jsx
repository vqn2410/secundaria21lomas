import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { gpdAuth, gpdDb } from '../firebase';

export default function GPDRegistro() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Formularios
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    rol: 'practicante', nombre: '', apellido: '', dni: '', telefono: '', email: '', password: '',
    direccion: '', localidad: '', salud: '', instituto: '', distrito: ''
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
    setLoading(true);
    setError('');
    try {
      const userCred = await createUserWithEmailAndPassword(gpdAuth, regForm.email, regForm.password);
      
      // Guardar en GPD Database según el rol
      const collectionName = regForm.rol === 'docente' ? 'docentes_practica' : 'practicantes';
      await setDoc(doc(gpdDb, collectionName, userCred.user.uid), {
        rol: regForm.rol,
        nombre: regForm.nombre,
        apellido: regForm.apellido,
        dni: regForm.dni,
        telefono: regForm.telefono,
        email: regForm.email,
        direccion: regForm.direccion,
        localidad: regForm.localidad,
        salud: regForm.salud,
        instituto: regForm.instituto,
        distrito: regForm.distrito,
        createdAt: new Date()
      });
      navigate('/gpd-panel');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fdf4ff' }}>
      <div className="card" style={{ maxWidth: isLogin ? '400px' : '700px', width: '100%', padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#ec4899', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '1rem' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ textAlign: 'center', color: '#ec4899' }}>Gestión de Prácticas Docentes</h2>
          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>{isLogin ? 'Ingreso al Sistema GPD' : 'Registro en el Sistema GPD'}</p>
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
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>¿Cuál es tu rol?</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="rol" value="practicante" checked={regForm.rol === 'practicante'} onChange={e => setRegForm({...regForm, rol: e.target.value})} />
                  Estudiante Practicante
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="rol" value="docente" checked={regForm.rol === 'docente'} onChange={e => setRegForm({...regForm, rol: e.target.value})} />
                  Docente de Práctica / Referente
                </label>
              </div>
            </div>
            
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
                <input required className="input-field" value={regForm.instituto} onChange={e => setRegForm({...regForm, instituto: e.target.value})} placeholder="Ej: ISFD N°41" />
              </div>
              <div className="form-group">
                <label>Distrito *</label>
                <input required className="input-field" value={regForm.distrito} onChange={e => setRegForm({...regForm, distrito: e.target.value})} placeholder="Ej: Adrogué" />
              </div>
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
              <div className="form-group">
                <label>Correo Electrónico *</label>
                <input type="email" required className="input-field" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input type="password" required className="input-field" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} minLength={6} />
              </div>
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
