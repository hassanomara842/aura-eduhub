import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function LoadingSpinner() {
  useEffect(() => {
    // When the spinner unmounts (loading finishes), scroll to the top of the page
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <div className="container py-16 flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '50vh', textAlign: 'center' }}>
      <Loader2 className="animate-spin mb-4" size={56} style={{ color: 'var(--primary)' }} />
      <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.5rem', margin: 0 }}>
        جاري التحميل...
      </h3>
    </div>
  );
}
