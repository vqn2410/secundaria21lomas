import { Link } from 'react-router-dom';

export default function Logo({ light = false, style = {}, to = "/" }) {
  const textColor = light ? 'white' : 'var(--text)';
  const subTextColor = light ? '#94a3b8' : 'var(--text-light)';
  const borderColor = light ? 'rgba(255,255,255,0.2)' : 'var(--border)';

  return (
    <Link to={to} className="landing-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', ...style }}>
      <img 
        src="https://cdn.phototourl.com/member/2026-04-01-18b3281e-b51e-4ec6-b664-ab4e364d159d.png" 
        alt="ENSAM Logo" 
        style={{ height: '52px' }} 
      />
      <div className="logo-text-group" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: '0.5rem', 
        borderLeft: `1px solid ${borderColor}`, 
        paddingLeft: '0.75rem' 
      }}>
        <span className="logo-main-text" style={{ 
          fontSize: '0.85rem', 
          fontWeight: '700', 
          lineHeight: '1.1', 
          color: light ? 'white' : 'var(--color-primary)' 
        }}>
          Unidad Académica de la Escuela Normal Superior
        </span>
        <span className="logo-sub-text" style={{ 
          fontSize: '0.75rem', 
          fontWeight: '500', 
          color: subTextColor 
        }}>
          "Antonio Mentruyt" <br />E.E.S. N° 21
        </span>
      </div>
    </Link>
  );
}
