import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, BookUser } from 'lucide-react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, db, gpdAuth, gpdDb } from '../firebase';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSelection, setShowSelection] = useState(null); 

  useEffect(() => {
    // Hemos desactivado el chequeo automático inicial para asegurar que el usuario pueda escribir sin interferencias
    console.log("Portal Login EES21 cargado. Formulario listo.");
  }, []);

  const checkProfiles = async (isSilent = false) => {
    const uMain = auth.currentUser;
    const uGPD = gpdAuth.currentUser;
    
    // Si llegamos aquí y no hay nadie, abortamos
    if (!uMain && !uGPD) {
      setLoading(false);
      return;
    }
    
    if (!isSilent) setLoading(true);
    try {
      console.log("Chequeando perfiles en bases vinculadas...");
      const userEmail = uMain?.email || uGPD?.email || email;
      let mainData = null, gpdData = null;

      // 1. Buscar en BD Institucional
      if (uMain) {
        const snap = await getDoc(doc(db, 'users', uMain.uid));
        if (snap.exists()) mainData = snap.data();
      }
      if (!mainData && userEmail) {
        const q = query(collection(db, 'users'), where('email', '==', userEmail.toLowerCase()));
        const snap = await getDocs(q);
        if (!snap.empty) mainData = snap.docs[0].data();
      }

      // 2. Buscar en BD GPD
      if (uGPD) {
        const [pSnap, dSnap] = await Promise.all([
          getDoc(doc(gpdDb, 'practicantes', uGPD.uid)),
          getDoc(doc(gpdDb, 'docentes_practica', uGPD.uid))
        ]);
        if (pSnap.exists()) gpdData = pSnap.data();
        else if (dSnap.exists()) gpdData = dSnap.data();
      }
      
      // Fallback Email para GPD
      if (!gpdData && userEmail) {
        const [pSnap, dSnap] = await Promise.all([
          getDocs(query(collection(gpdDb, 'practicantes'), where('email', '==', userEmail))),
          getDocs(query(collection(gpdDb, 'docentes_practica'), where('email', '==', userEmail)))
        ]);
        if (!pSnap.empty) gpdData = pSnap.docs[0].data();
        else if (!dSnap.empty) gpdData = dSnap.docs[0].data();
      }

      if (mainData && gpdData) {
        setShowSelection({ main: mainData.role, gpd: gpdData });
      } else if (mainData) {
        handleMainRedirect(mainData.role);
      } else if (gpdData) {
        navigate('/gpd-panel');
      } else {
        if (!isSilent) {
          setError("Perfil no encontrado.");
          await auth.signOut();
          await gpdAuth.signOut();
        }
      }
    } catch (e) {
      if (!isSilent) setError("Error de datos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMainRedirect = (role) => {
    const normalizedRole = role ? role.trim().toLowerCase() : '';
    if (normalizedRole === 'admin' || normalizedRole === 'administrador' || normalizedRole.includes('conduccion')) {
      navigate('/dashboard');
    } else if (normalizedRole === 'docente') {
      navigate('/docente');
    } else if (normalizedRole === 'estudiante' || normalizedRole === 'alumno') {
      navigate('/estudiante');
    } else if (normalizedRole === 'preceptor') {
      navigate('/preceptor');
    } else {
      setError(`Rol desconocido (${role})`);
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    console.log("Iniciando acceso manual...");

    try {
      // Intentar ambos logins
      await signInWithEmailAndPassword(auth, email, password);
      try { await signInWithEmailAndPassword(gpdAuth, email, password); } catch(err) {}
      
      // Una vez logueado en ambos (o uno), chequear perfiles inmediatamente
      await checkProfiles();
    } catch (err) {
      // Si falló el principal, intentar el de GPD por cuenta propia
      try {
        await signInWithEmailAndPassword(gpdAuth, email, password);
        await checkProfiles();
      } catch (gpdErr) {
        setError('Acceso denegado: Credenciales incorrectas.');
        setLoading(false);
      }
    }
  };

  if (showSelection) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--text)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <BookOpen size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Identidades Múltiples</h2>
          <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Ya tienes una sesión activa vinculada a: <br/>
            <strong style={{ color: 'var(--text)' }}>{auth.currentUser?.email || email}</strong>. <br/><br/>
            Elige la plataforma a la que deseas acceder:
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <button onClick={() => handleMainRedirect(showSelection.main)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.1rem', background: 'var(--text)' }}>
              <Shield size={22} /> Panel Administrativo ({showSelection.main})
            </button>
            <button onClick={async () => {
              setLoading(true);
              try {
                if (!gpdAuth.currentUser) await signInWithEmailAndPassword(gpdAuth, email, password);
                navigate('/gpd-panel');
              } catch(e) { navigate('/gpd-panel'); }
            }} className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.1rem', border: '2px solid #ec4899', color: '#db2777', fontWeight: 800 }}>
              <BookUser size={22} /> Portal de Práctica (GPD)
            </button>
          </div>
          <button onClick={() => { auth.signOut(); gpdAuth.signOut(); setShowSelection(null); setEmail(''); setPassword(''); }} style={{ marginTop: '2.5rem', background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
             SALIR / USAR OTRA CUENTA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--text)', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '1rem' }}>
            <BookOpen size={32} />
          </div>
          <h2 style={{ textAlign: 'center' }}>EES 21</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Portal ENSAM | Lomas de Zamora</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="email-input">Correo Electrónico</label>
            <input 
              id="email-input"
              name="email"
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="pass-input">Contraseña</label>
            <input 
              id="pass-input"
              name="password"
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--text)' }} disabled={loading}>
            {loading ? 'Validando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>¿Aún no tienes cuenta GPD?</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
             <button className="btn" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => navigate('/gpd-registro?rol=practicante')}>Registro Estudiante</button>
             <button className="btn" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => navigate('/gpd-registro?rol=docente')}>Registro Docente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
