import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const ok = await login(form.username, form.password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 50%, #ddd6fe 100%)',
      padding: '2rem',
      direction: 'rtl',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        animation: shake ? 'shake 0.5s ease' : 'fadeInUp 0.5s ease',
      }}>

        {/* Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(153, 80, 240, 0.18)',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            color: 'white',
          }}>
            <div style={{
              width: '72px', height: '72px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              <ShieldCheck size={36} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
              لوحة التحكم
            </h1>
            <p style={{ margin: '0.5rem 0 0', opacity: 0.8, fontSize: '0.95rem' }}>
              للمسئولين والإداريين فقط
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

            {/* Username */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                اسم المستخدم
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', display: 'flex' }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  required
                  autoComplete="username"
                  placeholder="أدخل اسم المستخدم"
                  style={{
                    width: '100%',
                    padding: '0.8rem 2.8rem 0.8rem 0.9rem',
                    borderRadius: '12px',
                    border: `2px solid ${error ? '#fca5a5' : 'var(--border-color)'}`,
                    outline: 'none',
                    fontFamily: 'var(--font-family)',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : 'var(--border-color)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', display: 'flex' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  style={{
                    width: '100%',
                    padding: '0.8rem 2.8rem 0.8rem 2.8rem',
                    borderRadius: '12px',
                    border: `2px solid ${error ? '#fca5a5' : 'var(--border-color)'}`,
                    outline: 'none',
                    fontFamily: 'var(--font-family)',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : 'var(--border-color)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: '1.25rem',
                textAlign: 'center',
              }}>
                ❌ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                border: 'none',
                background: loading
                  ? 'var(--primary-light)'
                  : 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                color: loading ? 'var(--primary)' : 'white',
                fontSize: '1.05rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-family)',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> دخول لوحة التحكم
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ textAlign: 'center', padding: '0 2rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            🔒 هذه الصفحة مخصصة للمسئولين فقط
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
