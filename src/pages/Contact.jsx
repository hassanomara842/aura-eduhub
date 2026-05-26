import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { createContact } from '../services/api';

export default function Contact() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    // Check if there's a pre-selected service or subject from URL params
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    const subjectParam = params.get('subject');
    
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    } else if (subjectParam) {
      setFormData(prev => ({ ...prev, message: subjectParam + '\n\n' }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await createContact({
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'جديد'
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="container py-16 animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>تواصل معنا</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>
          هل لديك استفسار أو ترغب في حجز خدمة استشارية؟ املأ النموذج أدناه وسيقوم فريقنا بالرد عليك في أقرب وقت.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>معلومات التواصل</h2>
          
          <div className="flex items-center gap-4">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.25rem' }}>البريد الإلكتروني</h4>
              <p style={{ fontWeight: 'bold' }}>baurastudio03@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.25rem' }}>رقم الهاتف / واتساب</h4>
              <p style={{ fontWeight: 'bold' }}>+201273886815</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.25rem' }}>المقر الرئيسي</h4>
              <p style={{ fontWeight: 'bold' }}>مصر (نقدم خدماتنا أونلاين لجميع الدول)</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '2rem' }}>أرسل رسالتك</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>الاسم الكامل</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)' }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>رقم الهاتف / واتساب</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)' }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>الخدمة المطلوبة</label>
              <select 
                name="service" 
                value={formData.service} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)', backgroundColor: 'white' }}
              >
                <option value="">-- اختر الخدمة (اختياري) --</option>
                <option value="باقة التقديم الكاملة - بكالوريوس">باقة التقديم الكاملة - بكالوريوس (١٠٠٠ ج.م)</option>
                <option value="باقة التقديم الكاملة - ماجستير">باقة التقديم الكاملة - ماجستير (١٣٠٠ ج.م)</option>
                <option value="باقة التقديم الكاملة - دكتوراه">باقة التقديم الكاملة - دكتوراه (٢٠٠٠ ج.م)</option>
                <option value="استفسار عام">استفسار عام</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>رسالتك</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required
                rows="4"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)', resize: 'vertical' }}
              ></textarea>
            </div>

            {status === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', padding: '1rem', color: '#16a34a', fontWeight: 'bold' }}>
                <CheckCircle size={22} />
                تم إرسال طلبك بنجاح! سنتواصل معك قريباً على الواتساب أو الإيميل.
              </div>
            )}

            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: '1rem', color: '#dc2626', fontWeight: 'bold' }}>
                <AlertCircle size={22} />
                حدث خطأ أثناء الإرسال. تأكد من تشغيل السيرفر وحاول مجدداً.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'loading' ? 'جاري الإرسال...' : 'إرسال الطلب'}
              {status !== 'loading' && <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
