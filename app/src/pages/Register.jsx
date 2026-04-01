import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ 
    nombre: '', apellido: '', dni: '', email: '', password: '', 
    telefono: '', emergencia: '', alergias: '', instituto: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (formData.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
      
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        uid,
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        telefono: formData.telefono,
        emergencia: formData.emergencia,
        alergias: formData.alergias,
        instituto: formData.instituto,
        role: 'estudiante',
        mustChangePassword: false
      });

      alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ background: 'var(--bg-admin)' }}>
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-admin)' }}>Registro Estudiantes</h2>
          <p style={{ color: 'var(--text-light)' }}>Completa tu legajo estudiantil oficial</p>
        </div>

        {error && <div className="error-alert" style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="grid grid-cols-2">
            <div className="form-group"><label>Nombre</label><input className="input-field" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required /></div>
            <div className="form-group"><label>Apellido</label><input className="input-field" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} required /></div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="form-group"><label>DNI (Legajo)</label><input className="input-field" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} required /></div>
            <div className="form-group"><label>Instituto / Sede</label><input className="input-field" value={formData.instituto} onChange={e => setFormData({...formData, instituto: e.target.value})} required placeholder="Ej: ISFD 103" /></div>
          </div>

          <div className="grid grid-cols-2">
             <div className="form-group"><label>Celular</label><input className="input-field" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required /></div>
             <div className="form-group"><label>Email Académico</label><input className="input-field" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
          </div>

          <div className="form-group"><label>Contacto de Emergencia (Nombre y N°)</label><textarea className="input-field" rows="2" value={formData.emergencia} onChange={e => setFormData({...formData, emergencia: e.target.value})} required placeholder="Ej: Madre - 11..." /></div>
          <div className="form-group"><label>Alergias o Medicación Importante</label><textarea className="input-field" rows="2" value={formData.alergias} onChange={e => setFormData({...formData, alergias: e.target.value})} required placeholder="Escriba 'Ninguna' si corresponde" /></div>

          <div className="form-group">
            <label>Contraseña de Acceso</label>
            <input className="input-field" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-admin" style={{ marginTop: '1rem', padding: '1rem' }}>
            <UserPlus size={20} /> {loading ? 'Creando cuenta...' : 'Confirmar Mi Registro e Ingreso'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ArrowLeft size={18} /> Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
