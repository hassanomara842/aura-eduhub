import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--text-main)', color: 'white', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
      <div className="container grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="nav-logo" style={{ marginBottom: '1rem' }}>
            <img src={logo} alt="Aura EduHub" style={{ height: '40px' }} />
            <span>
              <span style={{ color: 'var(--primary-light)' }}>Aura</span>{' '}
              <span style={{ color: 'var(--secondary)' }}>EduHub</span>
            </span>
          </div>
          <p style={{ color: '#cbd5e1' }}>
            نحن هنا لنكون دليلك ورفيقك في رحلتك نحو الحصول على منحة دراسية دولية، وبناء مستقبل تعليمي ومهني مشرق.
          </p>
        </div>

        <div>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>روابط سريعة</h3>
          <ul className="flex flex-col gap-2" style={{ color: '#cbd5e1' }}>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/scholarships">المنح الدراسية</Link></li>
            <li><Link to="/services">خدماتنا الاستشارية</Link></li>
            <li><Link to="/contact">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>تواصل معنا</h3>
          <ul className="flex flex-col gap-4" style={{ color: '#cbd5e1' }}>
            <li className="flex items-center gap-2">
              <Mail size={18} />
              baurastudio03@gmail.com
            </li>
            <li className="flex items-center gap-2" dir="ltr" style={{ justifyContent: 'flex-end' }}>
              +201273886815
              <Phone size={18} style={{ marginLeft: '0.5rem' }} />
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} />
              مصر
            </li>
          </ul>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - Aura EduHub للمنح الدراسية</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          تم الانشاء بواسطه <a href="http://facebook.com/Hassantech842" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 'bold' }}>Hassan Tech</a>
        </p>
      </div>
    </footer>
  );
}
