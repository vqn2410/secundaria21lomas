import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function DashboardCard({ title, description, icon, href, color, target = "_self" }) {
  return (
    <Link to={href} target={target} rel="noopener noreferrer" className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '2rem',
      height: '100%', 
      transition: 'var(--transition)', 
      cursor: 'pointer',
      border: 'none',
      background: `linear-gradient(135deg, ${color}10 0%, white 100%)`,
      borderTop: `4px solid ${color}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '60px',
        height: '60px',
        background: color, 
        color: 'white', 
        borderRadius: '16px',
        marginBottom: '1.5rem',
        boxShadow: `0 8px 16px ${color}33`
      }}>
        {icon}
      </div>
      
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.6', fontWeight: 500 }}>{description}</p>
      
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: color, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Explorar <ArrowRight size={16} />
      </div>
    </Link>
  );
}

export function DashboardGrid({ children }) {
  return (
    <div className="grid grid-cols-3" style={{ marginTop: '2rem' }}>
      {children}
    </div>
  );
}
