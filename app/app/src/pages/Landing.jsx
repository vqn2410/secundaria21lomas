import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '../components/LandingUI';
import useReveal from '../hooks/useReveal';

export default function Landing() {
  useReveal();

  useEffect(() => {
    document.title = 'Inicio';
  }, []);

  return (
    <div style={{ background: 'var(--white)' }}>
      <LandingNavbar />

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content reveal">
          <h1 className="hero-title">
            Formando el <span className="hero-accent">Futuro</span> de Lomas de Zamora.
          </h1>
          <p className="hero-description">
            Una institución educativa comprometida con la excelencia académica, la inclusión y la preparación pre-profesional de nuestros estudiantes.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Acceder al Sistema <ArrowRight size={20} />
            </Link>
            <Link to="/sobre-nosotros" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', border: '1px solid var(--border)' }}>
              Nuestra Escuela
            </Link>
          </div>
        </div>

        <div className="hero-image-container reveal reveal-delay-2">
          <img
            src="https://cdn.phototourl.com/member/2026-04-01-0585ab6d-8aea-484a-a03c-c5f9ba23c4b0.jpg"
            alt="ENSAM"
            className="hero-image"
          />
        </div>
      </header>

      <LandingFooter />
    </div>
  );
}
