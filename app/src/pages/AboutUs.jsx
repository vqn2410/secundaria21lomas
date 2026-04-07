import { useEffect } from 'react';
import { BookOpen, History, MapPin, Award, Heart, Shield, Calendar } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '../components/LandingUI';
import useReveal from '../hooks/useReveal';

export default function AboutUs() {
  useReveal();

  useEffect(() => {
    document.title = 'Inicio';
  }, []);

  const timelineEvents = [
    { year: "1909", title: "Fundación", desc: "Don Antonio Mentruyt funda la Sociedad Popular de Educación de Lomas de Zamora." },
    { year: "1912", title: "Inauguración Oficial", desc: "Apertura de la Escuela Normal de Lomas de Zamora en la Quinta Las Golondrinas." },
    { year: "1931", title: "Reconocimiento Biblioteca", desc: "La Biblioteca Antonio Mentruyt es reconocida oficialmente como Biblioteca de la Nación." },
    { year: "1948", title: "Edificio Actual", desc: "Inauguración de la sede en Manuel Castro 990 con la presencia de Juan Domingo Perón." },
    { year: "1970", title: "Formación Docente", desc: "Se crea el Profesorado para la Enseñanza Primaria; la escuela pasa a llamarse ENSAM." },
    { year: "1986", title: "Apertura de Turnos", desc: "El profesorado se traslada al turno vespertino, permitiendo el ingreso de varones." },
    { year: "1994", title: "Provincialización", desc: "Transferencia del sistema nacional a la Provincia de Buenos Aires." },
    { year: "1997", title: "Unidad Académica", desc: "Reconocimiento como Unidad Académica, integrando todos los niveles educativos." }
  ];

  return (
    <div style={{ background: 'var(--white)' }}>
      <LandingNavbar />

      <header className="hero" style={{ height: '70vh', background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e1b4b 100%)' }}>
        <div className="hero-content reveal" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="hero-title" style={{ color: 'white', fontSize: '3.5rem' }}>Nuestra Historia</h1>
          <p className="hero-description" style={{ color: '#cbd5e1' }}>Identidad, trayectoria y memoria de la Escuela Normal Superior "Antonio Mentruyt".</p>
        </div>
      </header>

      <section className="section" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Origins with Image */}
        <div className="responsive-grid reveal" style={{ marginBottom: '8rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <History size={32} color="var(--color-primary)" />
              <h2 style={{ fontSize: '2.25rem' }}>Los Orígenes</h2>
            </div>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              La historia del ENSAM se remonta a comienzos del siglo XX. El 7 de junio de 1909, por iniciativa de los vecinos y ante la necesidad de dar instrucción a la creciente población escolar de Lomas de Zamora, <strong>Don Antonio Mentruyt</strong> fundó la Sociedad Popular de Educación.
            </p>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.1rem' }}>
              De esa iniciativa nació la <strong>Sociedad Popular Modelo</strong>, inaugurada oficialmente in 1912, iniciando una tradición formadora de docentes que ha marcado a generaciones de profesionales en la región.
            </p>
          </div>
          <div className="reveal reveal-delay-1">
            <img
              src="https://cdn.phototourl.com/member/2026-04-02-a30efa6f-b6b1-432a-a48f-7dc4d8609cb3.jpg"
              alt="Retrato Oficial de Don Antonio Mentruyt"
              style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-hover)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="reveal" style={{ marginBottom: '8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <Calendar size={32} color="var(--color-primary)" />
            <h2 style={{ fontSize: '2.25rem' }}>Línea del Tiempo</h2>
          </div>

        <div className="responsive-grid reveal" style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }}></div>

          <div className="responsive-grid" style={{ gap: '4rem', width: '100%' }}>
            <div className="reveal reveal-delay-1">
              {timelineEvents.slice(0, 4).map((event, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'absolute', left: '-2.5rem', top: '5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-primary)', border: '4px solid white', boxShadow: '0 0 0 1px var(--color-primary)' }}></div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-secondary)' }}>{event.year}</span>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{event.title}</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{event.desc}</p>
                  </div>
                ))}
              </div>
              <div className="reveal reveal-delay-2">
                {timelineEvents.slice(4).map((event, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'absolute', left: '-2.5rem', top: '5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-primary)', border: '4px solid white', boxShadow: '0 0 0 1px var(--color-primary)' }}></div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-secondary)' }}>{event.year}</span>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{event.title}</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{event.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Building & Library with Images */}
        <div className="responsive-grid reveal" style={{ gap: '3rem', marginBottom: '8rem' }}>
          <div className="card reveal-delay-1" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="https://lh3.googleusercontent.com/sitesv/APaQ0SSGGAqH2IeHnxVB1QG1Is77iMztJcgye_dI79IqokLMxuUFBFTE_RYtI8OAv_WGkDoNyWISOxh5FJrUJfIZ718hWMex8J-trN3wC7Bd0DHRqs0fCOg_L1w6Yu5bAiHyRk8D6GkJBkUkhSH5IBt7cGjgcldb55nJHnSkspmKHNJMtyB39F5-TgmUoWZDMPZerIF6LaeDCi9KH5b6ZgDEw5elCXCSXbPcV8k5zUo=w1280" style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt="Quinta Las Golondrinas" />
            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <MapPin size={24} color="var(--color-secondary)" />
                <h3 style={{ fontSize: '1.4rem' }}>Sedes Históricas</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-light)' }}>
                <li><strong>Origen:</strong> Quinta Las Golondrinas (1910)</li>
                <li><strong>Dirección:</strong> Manuel Castro 990 - Banfield</li>
              </ul>
            </div>
          </div>
          <div className="card reveal-delay-2" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="https://cdn.phototourl.com/member/2026-04-02-b998eb49-8897-43fa-8e94-0a718d483305.png" style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt="Edificio de la Biblioteca Mentruyt" />
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Award size={24} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.4rem' }}>Biblioteca Mentruyt</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                <li><strong>Dirección:</strong> Italia Nº 44 - Lomas de Zamora</li>
                <li><strong>Categoría:</strong> Monumento Histórico Nacional</li>
                <li><strong>Instagram:</strong> <a href="https://www.instagram.com/bibliotecamentruyt/?hl=es" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>@bibliotecamentruyt</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal" style={{
        background: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))',
        color: 'white',
        padding: '12rem 5%',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #1e293b'
      }}>
        {/* Background Overlay Image */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(https://cdn.phototourl.com/member/2026-04-01-bc845a0b-c16a-42c3-b2a7-c7d43e2fbbf8.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.15',
          filter: 'grayscale(1)',
          zIndex: 1
        }}></div>

        <div style={{ maxWidth: '950px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: 'white' }}>Memoria, Verdad y Justicia <br /><span style={{ color: '#f87171' }}>La División Perdida</span></h2>
            <div style={{ width: '80px', height: '2px', background: 'var(--color-secondary)' }}></div>
            <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#cbd5e1', maxWidth: '800px' }}>
              "La División Perdida" rinde homenaje a estudiantes y docentes desaparecidos, rescatando la idea de que ningún compañero desaparecido pertenece al olvido.
            </p>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#94a3b8', maxWidth: '700px', lineHeight: '1.6' }}>
              Hoy, no es solo un homenaje: es una lección viva de memoria que forma parte de la identidad de la ENSAM y de su misión educativa.
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
