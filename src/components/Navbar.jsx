import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Aura EduHub" style={{ height: '40px' }} />
          <span>
            <span style={{ color: 'var(--primary)' }}>Aura</span>{' '}
            <span style={{ color: 'var(--secondary)' }}>EduHub</span>
          </span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>الرئيسية</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>من نحن</Link>
          <Link to="/scholarships" className={`nav-link ${isActive('/scholarships')}`}>المنح الدراسية</Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`}>خدماتنا</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>تواصل معنا</Link>
          {isAuthenticated && (
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`} style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>لوحة التحكم</Link>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      {/* Mobile menu dropdown would go here */}
      {isMobileMenuOpen && (
        <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={toggleMenu} className={`nav-link ${isActive('/')}`}>الرئيسية</Link>
            <Link to="/about" onClick={toggleMenu} className={`nav-link ${isActive('/about')}`}>من نحن</Link>
            <Link to="/scholarships" onClick={toggleMenu} className={`nav-link ${isActive('/scholarships')}`}>المنح الدراسية</Link>
            <Link to="/services" onClick={toggleMenu} className={`nav-link ${isActive('/services')}`}>خدماتنا</Link>
            <Link to="/contact" onClick={toggleMenu} className={`nav-link ${isActive('/contact')}`}>تواصل معنا</Link>
            {isAuthenticated && (
              <Link to="/admin" onClick={toggleMenu} className={`nav-link ${isActive('/admin')}`} style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>لوحة التحكم</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
