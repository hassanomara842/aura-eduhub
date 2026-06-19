import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ title, description, features, isPopular }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      boxShadow: isPopular ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      border: isPopular ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = isPopular ? 'var(--shadow-lg)' : 'var(--shadow-md)';
    }}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--secondary)',
          color: 'white',
          padding: '0.25rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 'bold',
          fontSize: '0.875rem'
        }}>
          الأكثر طلباً
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', minHeight: '40px' }}>{description}</p>

      </div>
      
      <ul style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {features.map((feature, idx) => (
          <li key={idx} className="flex gap-2">
            <CheckCircle2 size={20} className="text-secondary" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--text-main)' }}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link to={`/contact?service=${encodeURIComponent(title)}`} className={`btn ${isPopular ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%' }}>
        اطلب الخدمة الآن
      </Link>
    </div>
  );
}
