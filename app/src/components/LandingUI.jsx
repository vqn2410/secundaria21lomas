import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';

export function LandingNavbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="landing-navbar">
      <Link to="/" className="landing-logo">
        <img src="https://cdn.phototourl.com/member/2026-04-01-18b3281e-b51e-4ec6-b664-ab4e364d159d.png" alt="ENSAM Logo" style={{ height: '52px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: '1.1', color: 'var(--color-primary)' }}>Unidad Académica de la Escuela Normal Superior</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-light)' }}>"Antonio Mentruyt" <br />E.E.S. N° 21</span>
        </div>
      </Link>
      <div className="landing-nav-links">
        <Link to="/" className={`landing-nav-link ${isActive('/') ? 'active' : ''}`}>Inicio</Link>
        <Link to="/sobre-nosotros" className={`landing-nav-link ${isActive('/sobre-nosotros') ? 'active' : ''}`}>Sobre Nosotros</Link>
        <Link to="/noticias" className={`landing-nav-link ${isActive('/noticias') ? 'active' : ''}`}>Noticias</Link>
        <Link to="/login" className="btn btn-student" style={{ padding: '0.6rem 1.5rem' }}>Acceso Sistema</Link>
      </div>
    </nav>
  );
}

export function LandingFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/" className="landing-logo" style={{ textDecoration: 'none' }}>
              <img src="https://cdn.phototourl.com/member/2026-04-01-18b3281e-b51e-4ec6-b664-ab4e364d159d.png" alt="ENSAM Logo" style={{ height: '52px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: '1.1', color: 'white' }}>Unidad Académica de la Escuela Normal Superior</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#94a3b8' }}>"Antonio Mentruyt" <br />E.E.S. N° 21</span>
              </div>
            </Link>
          </div>
          <p style={{ color: '#94a3b8', maxWidth: '400px', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Comprometidos con la excelencia académica y la formación integral de nuestros estudiantes en Banfield.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seguinos en redes</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.instagram.com/sec21_enam/" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                <Instagram size={22} />
              </a>
              <a href="https://whatsapp.com/channel/0029VbAXLvMD38CObeGChA0C" target="_blank" rel="noopener noreferrer" title="WhatsApp Canal" style={{ color: 'white', background: '#25D366', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)' }}>
                <MessageCircle size={22} />
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Contacto</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
            <li style={{ display: 'flex', gap: '0.75rem' }}><MapPin size={18} /> Manuel Castro 990 - Banfield - Bs.As</li>
            <li style={{ display: 'flex', gap: '0.75rem' }}><Phone size={18} /> (011) 4248-1700</li>
            <li style={{ display: 'flex', gap: '0.75rem' }}><Mail size={18} /> secundaria21lomas@abc.gob.ar</li>
          </ul>
        </div>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Enlaces</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link to="/login" style={{ color: '#94a3b8' }}>Portal Docente</Link></li>
            <li><Link to="/login" style={{ color: '#94a3b8' }}>Portal Estudiante</Link></li>
            <li><Link to="/register" style={{ color: '#94a3b8' }}>Inscripción Online</Link></li>
          </ul>
        </div>
      </div>
      <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '0.875rem' }}>
        © 2026 U.A ENSAM | EES N°21. Todos los derechos reservados.
      </div>
    </footer>
  );
}
