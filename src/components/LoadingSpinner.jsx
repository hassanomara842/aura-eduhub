import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="container py-16 flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '50vh', textAlign: 'center' }}>
      <Loader2 className="animate-spin mb-4" size={56} style={{ color: 'var(--primary)' }} />
      <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        جاري تحميل البيانات...
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
        يقوم الخادم بالاستعداد لجلب أحدث المنح الدراسية، قد يستغرق الأمر بضع ثوانٍ، شكراً لانتظارك.
      </p>
    </div>
  );
}
