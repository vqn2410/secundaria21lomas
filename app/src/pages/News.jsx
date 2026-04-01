import { Calendar, Tag, ChevronRight, Search } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '../components/LandingUI';

export default function News() {
  const newsItems = [
    { tag: "Inscripciones", title: "Proceso de Inscripción de Alumnos 2024", date: "Marzo 12, 2024", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80", desc: "Se informa a la comunidad educativa que ya se encuentra habilitado el período para la presentación de legajos..." },
    { tag: "Institucional", title: "Inicio de Ciclo Lectivo: Acto de Apertura", date: "Febrero 28, 2024", img: "https://images.unsplash.com/photo-1541339907198-e08756eaa589?auto=format&fit=crop&w=400&q=80", desc: "El próximo lunes 4 de marzo daremos comienzo a las actividades académicas con un acto central en el patio..." },
    { tag: "Prácticas", title: "Nuevos Convenios: Prácticas en Industrias Lomas", date: "Febrero 15, 2024", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80", desc: "Los alumnos de 6to año de la orientación Ciencias Naturales podrán participar de visitas guiadas y pasantías..." },
    { tag: "Educación", title: "Talleres de NTICx y Programación", date: "Febrero 05, 2024", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80", desc: "Este año sumamos nuevos contenidos de pensamiento computacional en todos los niveles del ciclo superior..." }
  ];

  return (
    <div style={{ background: '#f8fafc' }}>
      <LandingNavbar />
      
      <header style={{ padding: '120px 5% 4rem', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Archivo de <span className="hero-accent">Noticias</span></h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.25rem' }}>EES N°21: Mantente informado sobre las novedades de nuestra escuela.</p>
        </div>
      </header>

      <section className="section" style={{ minHeight: '80vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {newsItems.map((item, idx) => (
              <article key={idx} className="card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '20px' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="news-tag" style={{ marginBottom: 0 }}>{item.tag}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       <Calendar size={14}/> {item.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{item.desc}</p>
                  <button className="btn" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--color-student)' }}>
                    Ver noticia completa <ChevronRight size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ background: '#1e293b', color: 'white' }}>
              <h4 style={{ marginBottom: '1rem' }}>Buscar Noticias</h4>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input className="input-field" placeholder="Escribe aquí..." style={{ width: '100%', paddingLeft: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </div>
            </div>
            
            <div className="card">
              <h4 style={{ marginBottom: '1.5rem' }}>Categorías</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {["Académico", "Institucional", "Eventos", "Inscripciones", "Prácticas", "Docentes"].map((cat, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> {cat}</span>
                    <span>({Math.floor(Math.random() * 10) + 1})</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
