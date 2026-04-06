import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { auth } from '../firebase';
import Logo from './Logo';

export default function MainLayout({ children, role, title }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title ? `Portal ENSAM | ${title}` : 'Portal ENSAM';
  }, [title]);

  const getDashboardPath = () => {
    return '/dashboard';
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header instead of Sidebar */}
      <header className="topbar" style={{ 
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 5%', 
        height: '80px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo to={getDashboardPath()} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', borderRight: '1px solid var(--border)', paddingRight: '1rem', fontWeight: 500 }}>
            {auth.currentUser?.email}
          </div>
          <button onClick={handleLogout} className="btn" style={{ 
            background: 'none', 
            border: '1px solid var(--border)', 
            fontSize: '0.875rem', 
            padding: '0.5rem 1rem',
            color: 'var(--text-light)',
            fontWeight: 600,
            transition: 'var(--transition)'
          }}>
             Cerrar Sesión
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
        .dashboard { 
          background: radial-gradient(circle at 10% 10%, #f1f5f9 0%, #ffffff 100%); 
          min-height: 100vh;
        }
        .main-content { background: transparent; }
        @media (max-width: 900px) {
          .topbar > div:nth-child(2) { font-size: 0.8rem; margin: 0 1rem; flex: 1; }
        }
        @media (max-width: 700px) {
          .topbar > div:nth-child(2) { display: none; }
        }
      `}} />
    </div>
  );
}
