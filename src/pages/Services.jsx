import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const services = [
    {
      title: "باقة التقديم الكاملة - بكالوريوس",
      description: "باقة متكاملة للمتقدمين لدرجة البكالوريوس تشمل جميع المتطلبات لضمان ملف قوي.",
      price: "١٠٠٠ ج.م",
      features: [
        "تجهيز السيرة الذاتية (CV)",
        "كتابة خطاب نية",
        "تجهيز خطاب توصية",
        "ملء الأبلكيشن"
      ]
    },
    {
      title: "باقة التقديم الكاملة - ماجستير",
      description: "باقة مخصصة للمتقدمين لدرجة الماجستير تشمل جميع الأوراق المطلوبة لتعزيز فرصة القبول.",
      price: "١٣٠٠ ج.م",
      isPopular: true,
      features: [
        "تجهيز السيرة الذاتية (CV)",
        "كتابة خطاب نية",
        "تجهيز خطاب توصية",
        "ملء الأبلكيشن"
      ]
    },
    {
      title: "باقة التقديم الكاملة - دكتوراه",
      description: "باقة احترافية للمتقدمين لدرجة الدكتوراه تركز على إبراز خبراتك الأكاديمية والبحثية.",
      price: "٢٠٠٠ ج.م",
      features: [
        "تجهيز السيرة الذاتية (CV)",
        "كتابة خطاب نية",
        "تجهيز خطاب توصية",
        "ملء الأبلكيشن"
      ]
    }
  ];

  return (
    <div className="container py-16 animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>خدماتنا الاستشارية</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.125rem' }}>
          نحن لا نضمن لك القبول، لأن القرار النهائي بيد الجهة المانحة. لكننا نضمن لك تقديم ملف احترافي يزيد من فرص قبولك لأقصى درجة ممكنة، بناءً على خبرات سابقة ومعايير دولية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((s, idx) => (
          <ServiceCard key={idx} {...s} />
        ))}
      </div>
      
      <div style={{ marginTop: '4rem', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>لماذا خدماتنا مدفوعة؟</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-muted)' }}>
          المنح الدراسية نفسها مجانية تماماً ولا يجوز دفع رسوم للتقديم عليها. لكن الرسوم التي نتقاضاها هي مقابل <strong>الوقت والمجهود المهني</strong> الذي يبذله فريقنا من خبراء واستشاريين في مراجعة أوراقك وتجهيز ملفك بأعلى جودة ممكنة لمساعدتك على التميز بين آلاف المتقدمين.
        </p>
      </div>
    </div>
  );
}
