import { useParams, Link, useNavigate } from 'react-router-dom';
import { useScholarships } from '../context/ScholarshipContext';
import {
  MapPin, Calendar, CheckCircle2, Users, Star, FileText,
  ExternalLink, ArrowRight, BookOpen, Award, ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scholarships, loading } = useScholarships();
  
  if (loading) return <LoadingSpinner />;

  const scholarship = scholarships.find((s) => s.id === id);

  if (!scholarship) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>المنحة غير موجودة</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>لم نتمكن من إيجاد هذه المنحة.</p>
        <button className="btn btn-primary" onClick={() => navigate('/scholarships')} style={{ marginTop: '2rem' }}>
          العودة للمنح
        </button>
      </div>
    );
  }

  const defaultSections = [
    {
      icon: <Users size={24} />,
      label: 'الفئة المستهدفة',
      value: scholarship.content.targetAudience,
      color: '#9950f0',
    },
    {
      icon: <Star size={24} />,
      label: 'مميزات المنحة',
      value: scholarship.content.features,
      color: '#f863bc',
    },
    {
      icon: <BookOpen size={24} />,
      label: 'التخصصات المتاحة',
      value: scholarship.content.majors,
      color: '#06b6d4',
    },
    {
      icon: <CheckCircle2 size={24} />,
      label: 'شروط التقديم',
      value: scholarship.content.conditions,
      color: '#10b981',
    },
    {
      icon: <FileText size={24} />,
      label: 'المستندات المطلوبة',
      value: scholarship.content.documents,
      color: '#f59e0b',
    },
  ];

  const iconList = [<Users size={24} />, <Star size={24} />, <BookOpen size={24} />, <CheckCircle2 size={24} />, <FileText size={24} />, <Award size={24} />, <MapPin size={24} />];
  const colorList = ['#9950f0', '#f863bc', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  const sections = scholarship.content.customSections 
    ? scholarship.content.customSections.map((sec, idx) => ({
        icon: iconList[idx % iconList.length],
        label: sec.title,
        value: sec.content,
        color: colorList[idx % colorList.length],
      }))
    : defaultSections;

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* JSON-LD Structured Data for rich Google results */}
      <SEO 
        title={scholarship.title} 
        description={`تفاصيل ${scholarship.title} في ${scholarship.country}. التمويل: ${scholarship.coverage}. التقديم الآن عبر منصة Aura EduHub.`}
        image={scholarship.image}
        url={`/scholarships/${scholarship.id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "EducationEvent",
          "name": scholarship.title,
          "description": `منحة دراسية في ${scholarship.country} - ${scholarship.coverage}`,
          "url": `https://aura-eduhub.me/scholarships/${scholarship.id}`,
          "location": {
            "@type": "Place",
            "name": scholarship.country
          },
          "organizer": {
            "@type": "Organization",
            "name": "Aura EduHub",
            "url": "https://aura-eduhub.me"
          },
          "eventStatus": "https://schema.org/EventScheduled",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": scholarship.officialLink
          },
          ...(scholarship.deadline && {
            "endDate": scholarship.deadline
          }),
          ...(scholarship.image && {
            "image": scholarship.image
          })
        }}
      />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--secondary) 100%)',
        padding: '4rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.07)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>الرئيسية</Link>
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <Link to="/scholarships" style={{ color: 'rgba(255,255,255,0.7)' }}>المنح الدراسية</Link>
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <span style={{ color: 'white' }}>{scholarship.title}</span>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)',
            color: 'white', fontSize: '0.875rem', fontWeight: '600',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <Award size={16} />
            {scholarship.coverage}
          </div>

          <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem', lineHeight: 1.3 }}>
            {scholarship.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
              <MapPin size={18} />
              <span>دولة الدراسة: <strong style={{ color: 'white' }}>{scholarship.country}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
              <Calendar size={18} />
              <span>آخر موعد للتقديم: <strong style={{ color: 'white' }}>{scholarship.deadline}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

          {/* Info Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sections.map((section, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-md)',
                  borderRight: `4px solid ${section.color}`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                    backgroundColor: `${section.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: section.color, flexShrink: 0,
                  }}>
                    {section.icon}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: 0 }}>
                    {section.label}
                  </h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                  {section.value}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
              padding: '2rem',
              textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <Award size={32} color="white" />
              </div>
              <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>جاهز للتقديم؟</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
                اختر الطريقة الأنسب لك
              </p>
            </div>

            {/* Buttons */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Apply Directly */}
              <a
                href={scholarship.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.05rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(153,80,240,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ExternalLink size={22} />
                  <div style={{ textAlign: 'right' }}>
                    <div>التقديم المباشر على المنحة</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.85 }}>
                      الموقع الرسمي للمنحة
                    </div>
                  </div>
                </div>
                <ArrowRight size={20} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
              </a>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>أو</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
              </div>

              {/* Apply via Us */}
              <Link
                to={`/contact?subject=${encodeURIComponent('طلب تقديم على منحة: ' + scholarship.title)}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--secondary)',
                  fontWeight: '700',
                  fontSize: '1.05rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  border: '2px solid var(--secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(248,99,188,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={22} />
                  <div style={{ textAlign: 'right' }}>
                    <div>التقديم من خلالنا</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.85 }}>
                      فريق Aura EduHub يساعدك خطوة بخطوة
                    </div>
                  </div>
                </div>
                <ArrowRight size={20} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
              </Link>

              {/* Note */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                marginTop: '0.5rem',
              }}>
                <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: '#15803d', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                  فريقنا يساعدك في تجهيز ملفك الكامل ومتابعة طلبك حتى القبول النهائي.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Unobtrusive Ad Banner at the bottom of the content */}
        <AdBanner />

        {/* Back Button */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/scholarships')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowRight size={18} />
            العودة لقائمة المنح
          </button>
        </div>
      </div>
    </div>
  );
}
