# UI Components

مكتبة مكونات واجهة المستخدم العامة للمشروع.

## CustomBadge

مكون Badge مخصص مع تأثيرات بصرية متقدمة.

### الميزات:
- **6 أنواع مختلفة**: success, warning, info, version, coming-soon, updated
- **تأثيرات بصرية**: تدرجات لونية، ظلال، تكبير عند التمرير
- **أيقونات مخصصة**: أيقونة مختلفة لكل نوع
- **تأثيرات تفاعلية**: pulse animation، hover effects
- **تصميم متجاوب**: يعمل على جميع الشاشات

### الاستخدام:
```tsx
import { CustomBadge } from "@/components/ui/custom-badge"

// Badge نجاح
<CustomBadge variant="success">تم الحفظ بنجاح</CustomBadge>

// Badge تحذير
<CustomBadge variant="warning">تحذير مهم</CustomBadge>

// Badge معلومات
<CustomBadge variant="info">معلومة مفيدة</CustomBadge>

// Badge إصدار
<CustomBadge variant="version">v1.0.0</CustomBadge>

// Badge قريباً
<CustomBadge variant="coming-soon">قريباً</CustomBadge>

// Badge محدث
<CustomBadge variant="updated">محدث</CustomBadge>
```

### الأنواع المتاحة:

#### 1. **Success** (نجاح)
- **اللون**: أخضر إلى أزرق
- **الأيقونة**: CheckCircle
- **الاستخدام**: رسائل النجاح، تأكيد العمليات

#### 2. **Warning** (تحذير)
- **اللون**: أصفر إلى أحمر
- **الأيقونة**: AlertTriangle
- **الاستخدام**: تحذيرات، تنبيهات مهمة

#### 3. **Info** (معلومات)
- **اللون**: أزرق إلى بنفسجي
- **الأيقونة**: Star
- **الاستخدام**: معلومات عامة، نصائح

#### 4. **Version** (إصدار)
- **اللون**: بنفسجي إلى وردي
- **الأيقونة**: Tag
- **الاستخدام**: أرقام الإصدارات، tags

#### 5. **Coming Soon** (قريباً)
- **اللون**: برتقالي إلى أحمر
- **الأيقونة**: Rocket
- **الاستخدام**: ميزات قادمة، تطوير مستقبلي

#### 6. **Updated** (محدث)
- **اللون**: أخضر إلى أزرق
- **الأيقونة**: Zap
- **الاستخدام**: تحديثات، إشعارات جديدة

### الخصائص:
- **variant**: نوع الـ Badge (مطلوب)
- **children**: محتوى الـ Badge (مطلوب)
- **className**: classes إضافية (اختياري)

### التأثيرات البصرية:
- **Gradient Background**: خلفية متدرجة
- **Blur Effect**: تأثير ضبابي خلفي
- **Hover Scale**: تكبير عند التمرير
- **Pulse Animation**: نبضة للأيقونة
- **Shadow Effects**: ظلال متدرجة

### الاستخدام في المشروع:
يمكن استخدام هذا المكون في أي مكان في المشروع:
- صفحات الإعدادات
- لوحات التحكم
- رسائل التنبيه
- حالات النظام
- مؤشرات الحالة
