import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Lock, ShieldAlert } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Las contraseñas no coinciden.");
    if (newPassword.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado.");

      // 1. Actualizar contraseña en Firebase Auth
      await updatePassword(user, newPassword);

      // 2. Marcar en Firestore que ya cambió la clave
      await updateDoc(doc(db, 'users', user.uid), {
        mustChangePassword: false
      });

      alert("¡Contraseña actualizada con éxito!");
      
      // 3. Redirigir según el rol del usuario
      auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ShieldAlert size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem' }}>Cambio de Clave Obligatorio</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Por seguridad, debes establecer una contraseña personal antes de continuar.</p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '40px' }} 
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '40px' }} 
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-admin" style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
            {loading ? 'Actualizando...' : 'Actualizar y Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
}
