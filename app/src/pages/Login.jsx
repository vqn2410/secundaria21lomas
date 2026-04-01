import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("Iniciando sesión...");
      // Autenticación real usando Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario autenticado:", user.uid);

      // Obtener el rol real del usuario desde Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userRole = '';
      let mustChange = false;

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userRole = userData.role;
        mustChange = userData.mustChangePassword || false;
        console.log("Usuario detectado:", userRole, "Cambio clave:", mustChange);
      } else {
        // Auto-crear el documento del admin la primera vez que inicia sesión para configurar la base de datos
        if (user.email === 'admin@admin.com') {
          console.log("Creando perfil administrador inicial...");
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            role: 'admin',
            profileId: '',
            mustChangePassword: false
          });
          userRole = 'admin';
        } else {
          setError('Tu usuario no tiene un rol asignado. Contacta a un administrador.');
          auth.signOut();
          setLoading(false);
          return;
        }
      }

      if (mustChange) {
        navigate('/change-password');
        return;
      }

      // Una vez validado, derivamos según su VERDADERO rol
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'docente') navigate('/docente');
      else if (userRole === 'estudiante') navigate('/estudiante');
      else setError('Rol de cuenta desconocido.');
      
    } catch (err) {
      console.error("Error completo de login:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('El correo o la contraseña son incorrectos.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Error de conexión. Revisa tu internet.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--text)', color: 'white', padding: '12px', borderRadius: '12px', marginBottom: '1rem', transition: 'var(--transition)' }}>
            <BookOpen size={32} />
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>EES 21 - Gestión</h2>
          <p style={{ textAlign: 'center' }}>Plataforma de Prácticas Escolares</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input id="email" type="email" className="input-field" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--text)', opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar a la Plataforma'}
          </button>
        </form>
      </div>
    </div>
  );
}
