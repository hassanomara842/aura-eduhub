import { Link } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, Users } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import ScholarshipCard from '../components/ScholarshipCard';

import { useScholarships } from '../context/ScholarshipContext';

export default function Home() {
  const { scholarships, loading } = useScholarships();
  const featuredScholarships = scholarships.slice(0, 3);

  if (loading) return <div className="container py-16 text-center">جاري تحميل البيانات...</div>;

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Abstract background shapes */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-light), transparent)', opacity: 0.5, filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--secondary), transparent)', opacity: 0.3, filter: 'blur(60px)' }}></div>

        <div className="container relative flex flex-col items-center text-center animate-fade-in" style={{ zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>
            خطوتك الأولى نحو <span style={{ color: 'var(--secondary)' }}>حلم الدراسة بالخارج</span>
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem auto', color: '#e2e8f0' }}>
            نقدم لك الدعم الكامل للحصول على أفضل المنح الدراسية العالمية. من مراجعة السيرة الذاتية إلى التحضير للمقابلات الشخصية، نحن معك في كل خطوة.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/services" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              تصفح خدماتنا
            </Link>
            <Link to="/contact" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2rem', fontSize: '1.125rem' }}>
              احجز استشارة مجانية
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-4"><Users size={40} className="text-primary" /></div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>+500</h3>
            <p className="text-muted">طالب تم قبولهم</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><Award size={40} className="text-secondary" /></div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>+50</h3>
            <p className="text-muted">دولة حول العالم</p>
          </div>
          <div>
            <div className="flex justify-center mb-4"><BookOpen size={40} className="text-primary" /></div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>98%</h3>
            <p className="text-muted">نسبة رضا العملاء</p>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>أحدث المنح الدراسية</h2>
            <Link to="/scholarships" className="flex items-center gap-2 text-primary font-bold">
              عرض الكل
              <ArrowLeft size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredScholarships.map((s, idx) => (
              <ScholarshipCard key={idx} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us / Services Summary */}
      <section className="py-16" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>كيف نساعدك للوصول إلى هدفك؟</h2>
          <p className="mb-8" style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            نقدم باقة من الخدمات المتكاملة التي تزيد من فرص قبولك في المنح العالمية بشكل كبير.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            <ServiceCard 
              title="باقة التقديم الكاملة - بكالوريوس"
              description="باقة متكاملة للمتقدمين لدرجة البكالوريوس تشمل جميع المتطلبات لضمان ملف قوي."
              price="١٠٠٠ ج.م"
              features={["تجهيز السيرة الذاتية (CV)", "كتابة خطاب نية", "تجهيز خطاب توصية", "ملء الأبلكيشن"]}
            />
            <ServiceCard 
              title="باقة التقديم الكاملة - ماجستير"
              description="باقة مخصصة للمتقدمين لدرجة الماجستير تشمل جميع الأوراق المطلوبة لتعزيز فرصة القبول."
              price="١٣٠٠ ج.م"
              isPopular={true}
              features={["تجهيز السيرة الذاتية (CV)", "كتابة خطاب نية", "تجهيز خطاب توصية", "ملء الأبلكيشن"]}
            />
            <ServiceCard 
              title="باقة التقديم الكاملة - دكتوراه"
              description="باقة احترافية للمتقدمين لدرجة الدكتوراه تركز على إبراز خبراتك الأكاديمية والبحثية."
              price="٢٠٠٠ ج.م"
              features={["تجهيز السيرة الذاتية (CV)", "كتابة خطاب نية", "تجهيز خطاب توصية", "ملء الأبلكيشن"]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
