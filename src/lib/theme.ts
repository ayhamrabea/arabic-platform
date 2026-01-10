// theme.ts
export const theme = {
  // الألوان الأساسية
  primary: '#4F46E5',       // لون أساسي مريح للأزرار والرؤوس
  secondary: '#6366F1',     // لون ثانوي للعناصر الثانوية
  accent: '#F59E0B',        // لون مميز للتنبيهات أو الأزرار المهمة
  success: '#10B981',       // اللون الأخضر للنجاحات أو الإنجازات
  error: '#EF4444',         // اللون الأحمر للأخطاء
  warning: '#FBBF24',       // لون التحذيرات
  info: '#3B82F6',          // لون المعلومات أو التنبيهات الثانوية
  muted: '#6B7280',         // اللون الرمادي للنصوص الثانوية أو غير المهمة
  highlight: '#FCD34D',     // لون تسليط الضوء على عناصر مهمة
  cardBg: '#F9FAFB',        // خلفية البطاقات والمكونات

  // الخلفيات
  background: '#FFFFFF',     // خلفية الصفحة الرئيسية
  surface: '#F3F4F6',        // خلفيات ثانوية (مثل البطاقات أو اللوحات)

  // النصوص
  textPrimary: '#111827',    // نصوص رئيسية
  textSecondary: '#374151',  // نصوص ثانوية
  textMuted: '#9CA3AF',      // نصوص باهتة أو أقل أهمية

  // الحدود والشادو
  border: '#E5E7EB',         // اللون الافتراضي للحدود
  shadowLight: '0 2px 4px rgba(0,0,0,0.05)',
  shadowMedium: '0 4px 6px rgba(0,0,0,0.1)',
  shadowHeavy: '0 8px 15px rgba(0,0,0,0.15)',

  // الحواف والزوايا
  radius: {
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    full: '9999px',
  },

  // الخطوط
  font: {
    sans: 'Inter, ui-sans-serif, system-ui',
    heading: 'Poppins, ui-sans-serif, system-ui',
    mono: 'Fira Code, monospace',
  },
};
