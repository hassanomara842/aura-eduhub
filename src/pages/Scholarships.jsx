import { useState } from 'react';
import ScholarshipCard from '../components/ScholarshipCard';
import { useScholarships } from '../context/ScholarshipContext';
import { Search } from 'lucide-react';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import AdBanner from '../components/AdBanner';

export default function Scholarships() {
  const { scholarships, loading } = useScholarships();
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');



  const filtered = scholarships.filter((s) => {
    const matchQuery = !query || s.title.includes(query) || s.country.includes(query);
    const matchCountry = !country || s.country === country;
    return matchQuery && matchCountry;
  });

  const uniqueCountries = [...new Set(scholarships.map((s) => s.country))];

  return (
    <div className="container py-16 animate-fade-in">
      <SEO 
        title="تصفح جميع المنح الدراسية" 
        description="استكشف أحدث المنح الدراسية حول العالم. منح ممولة بالكامل وجزئياً في أوروبا وأمريكا وآسيا. ابدأ رحلتك الأكاديمية مع Aura EduHub."
        url="/scholarships"
      />
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>المنح الدراسية المتاحة</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>
          استكشف أحدث المنح الدراسية حول العالم. ابدأ رحلتك الأكاديمية الآن ولا تفوت الفرصة للحصول على تعليم عالمي مجاني.
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '3rem' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div style={{ flex: '1', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن منحة (مثال: تشيفنينغ)..."
              style={{ width: '100%', padding: '1rem 3rem 1rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)', fontSize: '1rem' }}
            />
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-family)', fontSize: '1rem', backgroundColor: 'white', minWidth: '200px' }}
          >
            <option value="">جميع الدول</option>
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? filtered.map((s, idx) => (
            <ScholarshipCard key={s.id || idx} {...s} />
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.25rem' }}>لا توجد منح تطابق بحثك. حاول كلمة مختلفة.</p>
            </div>
          )}
        </div>
      )}

      {/* Adsterra Banner */}
      <div style={{ marginTop: '3rem' }}>
        <AdBanner />
      </div>
    </div>
  );
}

