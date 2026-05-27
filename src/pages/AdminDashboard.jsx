import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholarships } from '../context/ScholarshipContext';
import { useAuth } from '../context/AuthContext';
import ScholarshipForm from '../components/ScholarshipForm';
import { Plus, Edit2, Trash2, MapPin, Award, Calendar, Users, Download, PhoneCall, Mail, Clock, CheckCircle2, XCircle, LogOut, Settings, Lock, User } from 'lucide-react';
import { getContacts, deleteContact, updateAdminCredentials } from '../services/api';

// ── Excel export helper (no external lib needed) ──────────
function exportToExcel(contacts) {
  const headers = ['الاسم', 'البريد الإلكتروني', 'رقم الهاتف', 'الخدمة المطلوبة', 'الرسالة', 'تاريخ الطلب', 'الحالة'];
  const rows = contacts.map(c => [
    c.name,
    c.email,
    c.phone,
    c.service || 'استفسار عام',
    c.message,
    c.submittedAt ? new Date(c.submittedAt).toLocaleString('ar-EG') : '',
    c.status || 'جديد',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `طلبات-${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Status badge ──────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'جديد':    { bg: '#ede9fe', color: '#7c3aed', icon: <Clock size={13} /> },
    'تم التواصل': { bg: '#d1fae5', color: '#065f46', icon: <CheckCircle2 size={13} /> },
    'مغلق':   { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={13} /> },
  };
  const style = map[status] ?? map['جديد'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      backgroundColor: style.bg, color: style.color,
      padding: '0.25rem 0.65rem', borderRadius: '999px',
      fontSize: '0.78rem', fontWeight: 'bold'
    }}>
      {style.icon} {status ?? 'جديد'}
    </span>
  );
}

// ── Main dashboard ────────────────────────────────────────
export default function AdminDashboard() {
  const { scholarships, loading, remove } = useScholarships();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editingId, setEditingId]   = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };
  const [activeTab, setActiveTab]   = useState('scholarships'); // scholarships | contacts
  const [contacts, setContacts]     = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Load contacts when tab is active
  useEffect(() => {
    if (activeTab === 'contacts') {
      setContactsLoading(true);
      getContacts()
        .then(setContacts)
        .catch(() => setContacts([]))
        .finally(() => setContactsLoading(false));
    }
  }, [activeTab]);

  const handleDeleteContact = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الطلب؟')) return;
    await deleteContact(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="container py-16 text-center">جاري التحميل...</div>;

  const handleEdit   = (id) => { setEditingId(id); setIsCreating(false); };
  const handleCreate = ()   => { setEditingId(null); setIsCreating(true); };
  const handleClose  = ()   => { setEditingId(null); setIsCreating(false); };
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المنحة؟')) await remove(id);
  };

  if (isCreating || editingId) {
    return (
      <div className="container py-8 animate-fade-in">
        <button onClick={handleClose} className="btn btn-outline mb-4">العودة للوحة التحكم</button>
        <ScholarshipForm scholarshipId={editingId} onClose={handleClose} />
      </div>
    );
  }

  return (
    <div className="container py-16 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>لوحة التحكم</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>مرحباً، <strong>{user?.username}</strong> — <span style={{ color: 'var(--primary)' }}>{user?.role}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {activeTab === 'scholarships' && (
          <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2">
            <Plus size={20} /> إضافة منحة جديدة
          </button>
        )}
        {activeTab === 'contacts' && contacts.length > 0 && (
          <button
            onClick={() => exportToExcel(contacts)}
            className="btn btn-primary flex items-center gap-2"
            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
          >
            <Download size={20} /> تصدير Excel
          </button>
        )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              border: '2px solid #fca5a5',
              backgroundColor: 'rgba(239,68,68,0.06)',
              color: '#dc2626',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5'; }}
          >
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0' }}>
        {[
          { key: 'scholarships', label: 'إدارة المنح', icon: <Award size={18} /> },
          { key: 'contacts',     label: 'الطلبات الواردة', icon: <Users size={18} />, badge: contacts.length || null },
          { key: 'settings',     label: 'الإعدادات', icon: <Settings size={18} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-family)', fontSize: '1rem',
              fontWeight: activeTab === tab.key ? 'bold' : '500',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
            {tab.badge ? (
              <span style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '999px', fontSize: '0.75rem', padding: '0.1rem 0.5rem', fontWeight: 'bold' }}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB: SCHOLARSHIPS
      ══════════════════════════════════════════ */}
      {activeTab === 'scholarships' && (
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(153, 80, 240, 0.05)', borderBottom: '2px solid var(--primary-light)' }}>
                <th style={{ padding: '1.25rem 1rem', color: 'var(--primary-dark)', fontSize: '1.05rem' }}>تفاصيل المنحة</th>
                <th style={{ padding: '1.25rem 1rem', color: 'var(--primary-dark)', fontSize: '1.05rem' }}>الدولة والتمويل</th>
                <th style={{ padding: '1.25rem 1rem', color: 'var(--primary-dark)', fontSize: '1.05rem' }}>آخر موعد</th>
                <th style={{ padding: '1.25rem 1rem', textAlign: 'center', color: 'var(--primary-dark)', fontSize: '1.05rem' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map(s => (
                <tr
                  key={s.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={s.image} alt={s.title} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-color)' }} onError={e => e.currentTarget.src = 'https://via.placeholder.com/60'} />
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.title}</div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {s.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)' }}>
                        <MapPin size={16} color="var(--primary)" /><span style={{ fontWeight: '500' }}>{s.country}</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                        <Award size={14} />{s.coverage}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <Calendar size={16} /><span>{s.deadline}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                      <button onClick={() => handleEdit(s.id)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: 'rgba(153, 80, 240, 0.1)', color: 'var(--primary)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(153, 80, 240, 0.1)'; e.currentTarget.style.color = 'var(--primary)'; }} title="تعديل"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(s.id)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }} title="حذف"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {scholarships.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem' }}>لا توجد منح حالياً.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: CONTACTS
      ══════════════════════════════════════════ */}
      {activeTab === 'contacts' && (
        <>
          {contactsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>جاري تحميل الطلبات...</div>
          ) : contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '1.1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
              لا توجد طلبات واردة بعد.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contacts.map(c => (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)', padding: '1.5rem 2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1.5rem', alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(153,80,240,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                >
                  {/* Name + Service */}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'var(--primary-light)', display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}>
                      {c.service || 'استفسار عام'}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)', fontSize: '0.9rem' }}>
                      <Mail size={15} color="var(--primary)" /> {c.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)', fontSize: '0.9rem' }}>
                      <PhoneCall size={15} color="var(--primary)" />
                      <a href={`https://wa.me/${c.phone?.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 'bold', textDecoration: 'none' }}>
                        {c.phone}
                      </a>
                    </div>
                  </div>

                  {/* Message + date */}
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {c.message || '—'}
                    </p>
                    {c.submittedAt && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> {new Date(c.submittedAt).toLocaleString('ar-EG')}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <StatusBadge status={c.status} />
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                    >
                      <Trash2 size={14} /> حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB: SETTINGS
      ══════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Settings size={24} />
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>تغيير بيانات الدخول</h2>
          </div>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const errDiv = document.getElementById('settings-err');
            errDiv.style.display = 'none';
            btn.disabled = true;
            btn.innerHTML = 'جاري التحديث...';
            
            try {
              await updateAdminCredentials({
                currentPassword: e.target.currentPassword.value,
                newUsername: e.target.newUsername.value,
                newPassword: e.target.newPassword.value
              });
              alert('✅ تم تحديث البيانات بنجاح! سيتم تسجيل خروجك الآن لتسجيل الدخول بالبيانات الجديدة.');
              handleLogout();
            } catch (err) {
              errDiv.innerText = '❌ ' + err.message;
              errDiv.style.display = 'block';
            } finally {
              btn.disabled = false;
              btn.innerHTML = 'حفظ التغييرات';
            }
          }}>
            <div id="settings-err" style={{ display: 'none', backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 'bold', fontSize: '0.9rem', border: '1px solid #fca5a5' }}></div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>كلمة المرور الحالية</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={16} /></span>
                <input type="password" name="currentPassword" required style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="تأكيد هويتك" />
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>اسم المستخدم الجديد</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={16} /></span>
                <input type="text" name="newUsername" required defaultValue={user?.username} style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>كلمة المرور الجديدة</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={16} /></span>
                <input type="password" name="newPassword" required minLength="6" style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}>
              حفظ التغييرات
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
