import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CardWrapper = ({ id, children }) =>
  id ? (
    <Link to={`/scholarships/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      {children}
    </Link>
  ) : (
    <div>{children}</div>
  );

export default function ScholarshipCard({ id, title, country, coverage, deadline, image }) {
  return (
    <CardWrapper id={id}>
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(153,80,240,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      >
        {/* Card Image / Country Initial */}
        <div style={{ height: '180px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          {image ? (
            <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, var(--primary-dark), var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '4rem', fontWeight: '900', opacity: 0.25, color: 'white' }}>{country[0]}</span>
            </div>
          )}
          {/* Coverage Badge */}
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            backgroundColor: 'var(--secondary)', color: 'white',
            padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem', fontWeight: '700',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {coverage}
          </div>
          {/* "Click to view" overlay hint */}
          {id && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(153,80,240,0.6) 0%, transparent 60%)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              padding: '1rem', opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
            className="card-overlay">
              <span style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>عرض التفاصيل ←</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary-dark)', lineHeight: 1.4 }}>{title}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>دولة الدراسة: <strong style={{ color: 'var(--text-main)' }}>{country}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--primary)" />
              <span>آخر موعد: <strong style={{ color: 'var(--text-main)' }}>{deadline}</strong></span>
            </div>
          </div>

          {id && (
            <div style={{
              marginTop: '1.25rem',
              padding: '0.6rem 1rem',
              backgroundColor: 'rgba(153,80,240,0.08)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              textAlign: 'center',
              border: '1px solid rgba(153,80,240,0.15)',
            }}>
              اضغط لعرض التفاصيل والتقديم
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}
