import { useState, useEffect } from 'react';
import { Calendar, Tag, ChevronRight, Search, Loader2, Newspaper, X } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '../components/LandingUI';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      console.log("Fetching news from collection 'noticias'...");
      try {
        const q = query(collection(db, 'noticias'), orderBy('date', 'desc'));
        let snap = await getDocs(q);
        let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fallback para capitalización alterna en Firestore
        if (data.length === 0) {
           const qAlt = query(collection(db, 'Noticias'), orderBy('date', 'desc'));
           const snapAlt = await getDocs(qAlt);
           data = snapAlt.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        console.log(`Fetched ${data.length} news items.`);
        setNewsItems(data);
      } catch (err) {
        console.error("Error fetching news, trying raw fetch:", err);
        try {
          const simpleSnap = await getDocs(collection(db, 'noticias'));
          let simpleData = simpleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (simpleData.length === 0) {
             const simpleSnapAlt = await getDocs(collection(db, 'Noticias'));
             simpleData = simpleSnapAlt.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
          setNewsItems(simpleData.sort((a,b) => (b.date || "").localeCompare(a.date || "")));
        } catch (err2) { console.error(err2); }
      }
      setLoading(false);
    };
    fetchNews();
    document.title = "InfoENSAM - ENSAM";
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredNews = newsItems.filter(item => {
    const s = searchTerm.toLowerCase();
    return (item.title || "").toLowerCase().includes(s) ||
           (item.desc || "").toLowerCase().includes(s) ||
           (item.tag || "").toLowerCase().includes(s);
  }).sort((a, b) => {
    const aFeat = a.isFeatured && (!a.featuredStart || a.featuredStart <= today) && (!a.featuredEnd || a.featuredEnd >= today);
    const bFeat = b.isFeatured && (!b.featuredStart || b.featuredStart <= today) && (!b.featuredEnd || b.featuredEnd >= today);
    
    if (aFeat && !bFeat) return -1;
    if (!aFeat && bFeat) return 1;
    return (b.date || "").localeCompare(a.date || "");
  });

  return (
    <div style={{ background: '#f8fafc' }}>
      <LandingNavbar />
      
      <header style={{ padding: '120px 5% 4rem', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            Info
            <span style={{ 
              background: '#f87171', 
              color: 'white', 
              padding: '0.3rem 1.5rem', 
              borderRadius: '99px', 
              fontSize: '2.5rem', 
              fontWeight: 900, 
              display: 'inline-flex', 
              alignItems: 'center', 
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 20px rgba(248, 113, 113, 0.4)',
              marginLeft: '0.5rem'
            }}>ENSAM</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.25rem' }}>EES N°21: Mantente informado sobre las novedades de nuestra escuela.</p>
        </div>
      </header>

      {/* Featured Memorial Section */}
      <section style={{ padding: '4rem 5%', background: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }} className="responsive-grid">
            <div>
              <div style={{ background: '#f87171', color: 'white', padding: '0.6rem 1.8rem', borderRadius: '99px', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.15em', display: 'inline-block', marginBottom: '1.5rem', animation: 'pulse 2s infinite', boxShadow: '0 0 30px rgba(248, 113, 113, 0.5)' }}>
                SON 30.000
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(248, 113, 113, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
                  }
                `}} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: '1.2', color: 'white', marginBottom: '1.5rem' }}>
                La División Perdida: <br /> Memoria y Lucha Estudiantil
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                Un documental que relata la historia de compromiso y resistencia del ENAM. Reivindicamos la memoria de nuestros compañeros y reafirmamos nuestro compromiso con la Verdad y la Justicia.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}>INSTITUCIONAL</span>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>MEMORIA</span>
              </div>
            </div>
            
            <div style={{ aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/s25A3mFQ1k8" 
                title="La División Perdida - ENAM" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ minHeight: '80vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }} className="responsive-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem' }}>
                <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Cargando portal de noticias...</p>
              </div>
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item, idx) => {
                const isCurrentlyFeatured = item.isFeatured && (!item.featuredStart || item.featuredStart <= today) && (!item.featuredEnd || item.featuredEnd >= today);
                
                return (
                  <article 
                    key={item.id || idx} 
                    className="card" 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '300px 1fr', 
                      gap: '2rem', 
                      padding: '1.5rem', 
                      border: isCurrentlyFeatured ? '2px solid #f59e0b' : '1px solid var(--border)', 
                      borderRadius: '20px',
                      position: 'relative',
                      background: isCurrentlyFeatured ? 'linear-gradient(to right, #fffbeb, #ffffff)' : 'white',
                      boxShadow: isCurrentlyFeatured ? '0 10px 30px rgba(245, 158, 11, 0.1)' : 'var(--shadow-sm)'
                    }}
                  >
                    {isCurrentlyFeatured && (
                       <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#f59e0b', color: 'white', padding: '0.25rem 1rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 10, boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}>
                          <Newspaper size={12} /> DESTACADO
                       </div>
                    )}
                    <img src={item.img || "https://images.unsplash.com/photo-1504711432869-d937d7a94031?auto=format&fit=crop&w=800&q=80"} alt={item.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="news-tag" style={{ marginBottom: 0 }}>{item.tag || "General"}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                           <Calendar size={14}/> {item.date instanceof Object ? item.date.toDate().toLocaleDateString() : item.date}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: isCurrentlyFeatured ? 900 : 700 }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>{item.desc}</p>
                      <button className="btn" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--color-student)' }} onClick={() => setSelectedNews(item)}>
                        Leer más <ChevronRight size={18} />
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                <Newspaper size={60} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ color: 'var(--text)' }}>No hay noticias publicadas</h3>
                <p style={{ color: 'var(--text-light)' }}>Vuelve pronto para conocer las novedades institucionales.</p>
              </div>
            )}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ background: '#1e293b', color: 'white' }}>
              <h4 style={{ marginBottom: '1rem' }}>Buscar Noticias</h4>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  className="input-field" 
                  placeholder="Escribe aquí..." 
                  style={{ width: '100%', paddingLeft: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="card">
              <h4 style={{ marginBottom: '1.5rem' }}>Categorías</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {["Académico", "Institucional", "Eventos", "Inscripciones", "Prácticas", "Docentes"].map((cat, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> {cat}</span>
                    <span>({newsItems.filter(n => n.tag === cat).length})</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* MODAL DE NOTICIA AMPLIADA */}
        {selectedNews && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', overflowY: 'auto', padding: '2rem', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedNews(null)}>
            <div style={{ maxWidth: '900px', width: '100%', background: 'white', borderRadius: '30px', overflow: 'hidden', position: 'relative', height: 'fit-content', minHeight: '80vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => setSelectedNews(null)}>
                <X size={24} color="var(--text)" />
              </button>
              <div style={{ width: '100%', height: '450px', position: 'relative' }}>
                <img src={selectedNews.img || "https://images.unsplash.com/photo-1504711432869-d937d7a94031?auto=format&fit=crop&w=800&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={selectedNews.title} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                  <span className="badge" style={{ background: 'var(--color-primary)', color: 'white', marginBottom: '1rem' }}>{selectedNews.tag}</span>
                  <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: '1.1' }}>{selectedNews.title}</h2>
                  <div style={{ display: 'flex', gap: '1.5rem', color: '#cbd5e1', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {selectedNews.date}</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={16} /> EES N°21 ENSAM</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '4rem 5%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {(selectedNews.sections && selectedNews.sections.length > 0) ? (
                  selectedNews.sections.map((sec, idx) => (
                    sec.type === 'text' ? (
                      <p key={idx} style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{sec.val}</p>
                    ) : (
                      <div key={idx} style={{ margin: '1rem 0' }}>
                         <img src={sec.val} alt="Ilustración" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                      </div>
                    )
                  ))
                ) : (
                  <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{selectedNews.desc}</p>
                )}
              </div>
              
              <div style={{ padding: '2rem 5%', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
                 <button className="btn btn-primary" onClick={() => setSelectedNews(null)}>Cerrar Lectura</button>
              </div>
            </div>
          </div>
        )}
      </section>

      <LandingFooter />
    </div>
  );
}
