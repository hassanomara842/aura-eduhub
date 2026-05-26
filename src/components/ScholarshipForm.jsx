import { useState, useEffect } from 'react';
import { useScholarships } from '../context/ScholarshipContext';
import { Plus, Trash2, UploadCloud } from 'lucide-react';

export default function ScholarshipForm({ scholarshipId, onClose }) {
  const { scholarships, add, update } = useScholarships();
  
  const initialFormState = {
    id: '',
    title: '',
    country: '',
    coverage: '',
    deadline: '',
    image: '',
    officialLink: '',
    content: {
      customSections: []
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (scholarshipId) {
      const existing = scholarships.find(s => s.id === scholarshipId);
      if (existing) setFormData(existing);
    }
  }, [scholarshipId, scholarships]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.content.customSections];
    newSections[index][field] = value;
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, customSections: newSections }
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        customSections: [...prev.content.customSections, { title: '', content: '' }]
      }
    }));
  };

  const removeSection = (index) => {
    const newSections = formData.content.customSections.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, customSections: newSections }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (scholarshipId) {
        await update(scholarshipId, formData);
      } else {
        // Generate a simple ID if not provided (for creation)
        const newId = formData.id || formData.title.toLowerCase().replace(/\s+/g, '-');
        await add({ ...formData, id: newId });
      }
      onClose();
    } catch (err) {
      console.error("Error saving scholarship:", err);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '2rem' }}>
        {scholarshipId ? 'تعديل منحة' : 'إضافة منحة جديدة'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>معرف المنحة (ID باللغة الإنجليزية)</label>
            <input required name="id" value={formData.id} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} disabled={!!scholarshipId} placeholder="مثال: fully-funded-usa" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المنحة</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الدولة</label>
            <input required name="country" value={formData.country} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>نوع التمويل (تغطية)</label>
            <input required name="coverage" value={formData.coverage} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>آخر موعد للتقديم</label>
            <input required name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>صورة المنحة</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} 
                title="اختر صورة"
              />
              <div style={{ 
                padding: '1.5rem', 
                border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                textAlign: 'center', 
                backgroundColor: 'var(--bg-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'border-color 0.2s',
                minHeight: '120px'
              }}>
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" style={{ height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>انقر لتغيير الصورة</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={36} color="var(--primary)" style={{ opacity: 0.8 }} />
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>انقر هنا لرفع صورة</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الرابط الرسمي للمنحة</label>
            <input required name="officialLink" value={formData.officialLink} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
          </div>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
        
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>أقسام تفاصيل المنحة (Custom Sections)</h3>
          <button type="button" onClick={addSection} className="btn btn-secondary flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} />
            إضافة قسم
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {formData.content.customSections.map((section, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', position: 'relative', border: '1px solid var(--border-color)' }}>
              <button type="button" onClick={() => removeSection(idx)} style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={20} />
              </button>
              
              <div style={{ marginBottom: '1rem', paddingLeft: '3rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>عنوان القسم</label>
                <input required value={section.title} onChange={(e) => handleSectionChange(idx, 'title', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>محتوى القسم</label>
                <textarea required value={section.content} onChange={(e) => handleSectionChange(idx, 'content', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '150px', resize: 'vertical' }} />
              </div>
            </div>
          ))}
          {formData.content.customSections.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>لا يوجد أقسام مضافة بعد.</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" onClick={onClose} className="btn btn-outline">إلغاء</button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
