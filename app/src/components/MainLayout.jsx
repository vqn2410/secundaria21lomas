import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, BookUser, ArrowLeftRight } from 'lucide-react';
import { auth, gpdAuth } from '../firebase';
import Logo from './Logo';

export default function MainLayout({ children, role, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = title ? `Portal ENSAM | ${title}` : 'Portal ENSAM';
  }, [title]);

  const getDashboardPath = () => {
    switch (role) {
      case 'admin': return '/dashboard';
      case 'docente': return '/docente';
      case 'estudiante': return '/estudiante';
      case 'preceptor': return '/preceptor';
      default: return '/';
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await gpdAuth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="topbar" style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 5%', height: '80px', position: 'sticky', top: 0, zIndex: 1000, 
        backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Logo to={getDashboardPath()} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {/* Selector de Rol Persistente */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button 
              onClick={() => navigate(getDashboardPath())} 
              style={{ 
                padding: '0.4rem 0.75rem', border: 'none', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, 
                cursor: 'pointer', background: 'white', color: 'var(--text)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              Principal
            </button>
            <button 
              onClick={() => navigate('/gpd-panel')} 
              style={{ 
                padding: '0.4rem 0.75rem', border: 'none', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, 
                cursor: 'pointer', background: 'transparent', color: '#64748b'
              }}
            >
              GPD
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', borderRight: '1px solid var(--border)', paddingRight: '0.75rem', fontWeight: 500, display: window.innerWidth < 640 ? 'none' : 'block' }}>
            {auth.currentUser?.email}
          </div>

          <button onClick={handleLogout} className="btn" style={{ 
            background: 'none', border: '1px solid var(--border)', 
            fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: 'var(--text-light)', fontWeight: 600
          }}>
             Salir
          </button>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
            <User size={20} />
          </div>
        </div>
      </header>

      <main className="main-content" style={{ flex: 1, padding: '2rem 0' }}>
        <section className="content-area" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 2rem' }}>
          {children}
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard { background: radial-gradient(circle at 10% 10%, #f1f5f9 0%, #ffffff 100%); min-height: 100vh; }
        .main-content { background: transparent; }
        @media (max-width: 900px) {
          .topbar > div:nth-child(2) > div:first-child { display: none; }
        }
      `}} />
    </div>
  );
}
