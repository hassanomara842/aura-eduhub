import { CheckCircle2, ShieldCheck, Target, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="container py-16 animate-fade-in">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
          Aura EduHub <br/> <span style={{ color: 'var(--secondary)', fontSize: '2rem' }}>المساحة الكاملة لقصة نجاحك الأكاديمية والدولية</span>
        </h1>
        <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          Aura EduHub مش مجرد مكتب استشارات؛ هي المساحة اللي بتساعد الشباب يكتشفوا شغفهم ويصيغوا قصتهم التنافسية عشان يفتحوا أبواب الفرص العالمية (منح، جامعات، تدريب، أو تطوع ومؤتمرات) من غير تعقيد، وبطريقة تبرز شخصية كل واحد فيهم بشكل حقيقي ومحترف من غير تصنع. هي المكان اللي بيتحول فيه شغف الطالب وأهدافه لملف قوي يفرض نفسه في أي مكان في العالم. إحنا مش فريق تقديم تقليدي، إحنا شركاء رحلتك من أول خطوة لحد القبول.
        </p>
      </div>

      {/* Section 1: Services */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '2rem' }}>
          <Target size={32} className="text-secondary" />
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>1. إحنا بنقدم إيه؟</h2>
        </div>
        
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>
          بدل الطريقة التقليدية، خدماتنا متفصلة وجاهزة عشان تبني الرحلة والقصة الخاصة بكل متقدم، وبأعلى معايير الجودة الأكاديمية:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>باقات التقديم الكاملة للمراحل الدراسية</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>بنشيل عنك عبء التفاصيل بالكامل. الباقة بتشمل صياغة السيرة الذاتية (CV)، خطاب النية/الدافع، خطابات التوصية، وملء أبلكيشن المنحة بدقة متناهية.</p>
            <ul className="flex flex-col gap-2">
              <li className="flex gap-2 items-center"><CheckCircle2 size={18} className="text-secondary"/> باقة البكالوريوس</li>
              <li className="flex gap-2 items-center"><CheckCircle2 size={18} className="text-secondary"/> باقة الماجستير</li>
              <li className="flex gap-2 items-center"><CheckCircle2 size={18} className="text-secondary"/> باقة الدكتوراه</li>
            </ul>
          </div>
          
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>صناعة المحتوى الأكاديمي والمهني</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>لو مش محتاج باقة كاملة، بنصيغ لك مستنداتك بشكل مستقل مطابق للمواصفات الدولية:</p>
            <ul className="flex flex-col gap-2">
              <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-secondary" style={{ marginTop: '4px', flexShrink: 0 }}/> كتابة سيرة ذاتية (CV) على الطريقة الأوروبية / بنظام ATS.</li>
              <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-secondary" style={{ marginTop: '4px', flexShrink: 0 }}/> كتابة خطاب النية / التحفيزي (Personal Statement).</li>
              <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-secondary" style={{ marginTop: '4px', flexShrink: 0 }}/> كتابة خطاب التوصية / ملء أبلكيشن المنحة فقط.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>التقديم على الفرص الدولية</h3>
            <p style={{ color: 'var(--text-muted)' }}>بنفتح لك باب التبادل الثقافي وبناء الشخصية القيادية من خلال ملف متكامل يشمل الـ CV وخطاب النية وخطاب التوصية المخصص للفرصة (تدريب / تطوع / مؤتمر).</p>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>البحث والاستشارات</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex gap-2 items-start">
                <CheckCircle2 size={18} className="text-secondary" style={{ marginTop: '4px', flexShrink: 0 }}/>
                <div>
                  <strong>البحث الأكاديمي المتقدم:</strong> إعداد وكتابة المقترح البحثي للمرحلة الجامعية المتقدمة لمنح مثل اليابان، الصين، وبروناي.
                </div>
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle2 size={18} className="text-secondary" style={{ marginTop: '4px', flexShrink: 0 }}/>
                <div>
                  <strong>جلسات التوجيه وعصف الذهن:</strong> جلسة استشارية مدفوعة نرسم فيها خريطة لأنسب الجامعات والمنح. (الاستشارات المجانية تقتصر على سؤالين فقط).
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Why us? */}
      <section style={{ marginBottom: '4rem', padding: '3rem', backgroundColor: 'var(--primary-dark)', borderRadius: 'var(--radius-lg)', color: 'white' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '2rem' }}>
          <ShieldCheck size={32} className="text-secondary" />
          <h2 style={{ fontSize: '2rem' }}>2. ليه Aura EduHub مختلفة؟</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>الصدق، الأصالة، والملكية الكاملة</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7' }}>مش بنؤمن بالقوالب الجاهزة ولا التزييف. كل طالب بيطلع بملف بيعبر عنه هو بنسبة 100% بأسلوب بيكسب ثقة لجان التحكيم. ليك الحق الكامل في الحصول على النسخة النهائية من مستنداتك بعد انتهاء العمل (شفافية مطلقة).</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>تفكيك التعقيد والاحترافية العالية</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7' }}>بنحول الخطوات الدولية الصعبة لرحلة منظمة. دورنا بيتركز في الصياغة الأكاديمية الاحترافية بناءً على خبراتنا اللي بتوصل بملفك لأعلى نسب قبول ممكنة (بنسب تتخطى 90%).</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>التركيز على الجودة لا الكمية</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7' }}>إحنا مش مصنع أبلكيشنز؛ ونظراً لكثرة الطلبات، بنكتفي بعدد محدود جداً من المقاعد لكل منحة عشان ندي ملفك التركيز الكامل اللي يستحقه. الأولوية دايماً للي بيبدأ ويحجز بدري.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>مرونة الدفع والتسهيلات</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7' }}>بنقدم عروض حصرية (خصومات المناسبات، وعرض التقديم المزدوج بخصم 5%، وخصومات المجموعات). وقنوات دفع مريحة تناسب الجميع (فودافون كاش، إنستا باي، تحويل بنكي، ويسترن يونيون، وباي بال).</p>
          </div>
        </div>
      </section>

      {/* Section 3: Principles */}
      <section>
        <div className="flex items-center gap-3" style={{ marginBottom: '2rem' }}>
          <BookOpen size={32} className="text-secondary" />
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>3. مبادئنا وقواعد العمل معنا</h2>
        </div>
        
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          عشان نضمن إن كل دقيقة من وقت فريق العمل بتروح للطالب اللي يستحق فعلاً، Aura EduHub قايمة على نظام صارم ومحترف:
        </p>
        
        <div className="flex flex-col gap-4">
          <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--surface)', borderRight: '4px solid var(--secondary)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle2 size={24} className="text-secondary" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.125rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>التزام وجدية تامة</h4>
              <p style={{ color: 'var(--text-muted)' }}>الأبلكيشن بتاعنا مخصص فقط للطلاب الجادين والمستعدين للبدء فوراً في استثمار مستقبلهم، تجنباً لإضاعة الوقت أو حظر الحساب من التقديمات المستقبلية.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--surface)', borderRight: '4px solid var(--secondary)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle2 size={24} className="text-secondary" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.125rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>سياسة إلغاء واضحة</h4>
              <p style={{ color: 'var(--text-muted)' }}>في حال التراجع بعد تحويل الرسوم، يتم خصم 50% نظير المصاريف الإدارية وحجز المقعد وتدقيق الملفات، ويُرد الباقي لك.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--surface)', borderRight: '4px solid var(--secondary)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle2 size={24} className="text-secondary" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.125rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 'bold' }}>جاهزية المستندات</h4>
              <p style={{ color: 'var(--text-muted)' }}>خدماتنا تركز على الصياغة والتقديم، ولا تشمل ترجمة الأوراق؛ لذا يرجى توفير مستنداتك باللغة الإنجليزية أو لغة المنحة المطلوبة.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
