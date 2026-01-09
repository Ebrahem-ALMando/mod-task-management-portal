# قواعد بناء واجهة المستخدم (UI Rules)

هذا الملف هو **المصدر الوحيد للحقيقة** (Single Source of Truth) لقواعد بناء واجهة المستخدم في المشروع.

---

## 1. القواعد المعمارية (Architectural Rules)

### فصل الطبقات (Layer Separation)
- **مكونات UI يجب ألا تحتوي على منطق الأعمال (Business Logic)**
- **الصفحات (page.tsx) هي wrappers رقيقة فقط** - لا تحتوي على منطق
- **جميع المنطق يجب تفويضه إلى Hooks**
- **لا استدعاءات API مباشرة في UI**
- **لا وصول إلى Token / Storage في UI**
- **لا معالجة أخطاء inline (Toast فقط)**

### المسؤوليات (Responsibilities)
- **UI Components**: العرض فقط (Presentation)
- **Hooks**: المنطق والحالة (Logic & State)
- **Pages**: Wrappers رقيقة تربط المكونات

---

## 2. قواعد المجلدات والتسمية (Folder & Naming Conventions)

### هيكل المجلدات
```
src/
├── app/                    # Pages (thin wrappers)
│   └── [feature]/
│       └── page.tsx        # Thin wrapper only
├── components/
│   └── [feature]/          # Feature-based UI folders
│       ├── ComponentName.tsx
│       └── index.ts
└── features/               # Business logic & hooks
    └── [feature]/
        └── hooks/
```

### قواعد التسمية
- **مكونات UI**: PascalCase (مثل `LoginView.tsx`)
- **Hooks**: camelCase مع بادئة `use` (مثل `useAuth`)
- **Pages**: `page.tsx` فقط (Next.js convention)
- **مجلدات المكونات**: PascalCase (مثل `LoginView/`)

### إعادة الاستخدام
- **المكونات القابلة لإعادة الاستخدام يجب عزلتها**
- **لا تكرار منطق UI**
- **مسؤولية واضحة لكل مكون**

---

## 3. الحالة والآثار الجانبية (State & Side Effects)

### حالات التحميل (Loading States)
- **حالات التحميل يجب أن تكون صريحة**
- **استخدام `isLoading` أو `isPending` من Hooks**
- **إظهار مؤشر التحميل عند الحاجة**

### منع الإرسال المزدوج (Double-Submit Prevention)
- **إلغاء تفعيل زر الإرسال أثناء المعالجة إلزامي**
- **استخدام `disabled={isSubmitting}`**
- **منع إرسال النموذج مرتين**

### منطق إعادة التوجيه (Redirect Logic)
- **عمليات التحويل تتم عبر `src/proxy.ts` (Middleware)**
- **لا داعي لإضافة تحويل داخلي في المكونات**
- **`proxy.ts` يتعامل مع:**
  - التحويل إلى `/auth/login` إذا لم يكن المستخدم مسجلاً
  - التحويل إلى `/dashboard` إذا كان المستخدم مسجل وذهب إلى صفحة auth
- **لا استخدام `useRouter()` للتحويل في مكونات Login/Auth**

### النماذج (Forms)
- **النماذج لا تغير الحالة العامة مباشرة**
- **استخدام Hooks للطفرات (Mutations)**
- **معالجة الأخطاء عبر Toast فقط**

---

## 4. قواعد الأخطاء والتنبيهات (Error & Toast Rules)

### نظام Toast المركزي
- **جميع الأخطاء تُعرض عبر نظام Toast المركزي**
- **لا رسائل تحقق inline إلا إذا كان مسموحاً صراحة**
- **UI لا يقرر نوع الخطأ (Hooks تقوم بذلك)**

### أنواع الأخطاء
- **401, 403, 404, 422**: لا Toast (معالجة inline)
- **500+ أو أخطاء الشبكة (status 0)**: Toast إلزامي
- **أخطاء التحقق (422)**: عرض في النموذج + لا Toast

### استخدام Toast
```tsx
// ❌ خطأ: Toast مباشر في UI
toast({ title: "خطأ", description: "حدث خطأ" })

// ✅ صحيح: Hooks تتعامل مع Toast
const { login } = useAuthActions()
await login({ username, password })
// Toast يتم عرضه تلقائياً من قبل ActionToastListener
```

---

## 5. الثيمات والهوية البصرية (Theming & Visual Identity)

### Tailwind فقط
- **استخدام Tailwind فقط (لا ملفات CSS مخصصة)**
- **Dark/Light عبر `dark:` modifiers**
- **الألوان يجب أن تطابق الهوية البصرية الرسمية**

### الألوان
- **Dark Mode**: هوية خضراء داكنة رسمية (`#032d23`, `#054239`)
- **Light Mode**: هوية بيج/أخضر فاتح رسمية (`#F8F6F2`, `#054239`)
- **لا ألوان hardcoded داخل JSX**
- **استخدام CSS variables من `globals.css`**

### RTL والوصولية
- **RTL-first layouts**
- **تباين مناسب للقراءة**
- **دعم الوصولية (Accessibility)**

### مثال على الألوان
```tsx
// ❌ خطأ: ألوان hardcoded
<div className="bg-[#054239] text-white">

// ✅ صحيح: استخدام CSS variables
<div className="bg-primary text-primary-foreground">
```

---

## 6. الأداء والنظافة (Performance & Cleanliness)

### إعادة الرسم (Re-renders)
- **تجنب إعادة الرسم غير الضرورية**
- **تقسيم UI الكبيرة إلى مكونات أصغر**
- **لا memoization مبكر (premature)**

### تقسيم المكونات
- **تقسيم المكونات الكبيرة إلى مكونات أصغر**
- **مكون واحد = مسؤولية واحدة**

### النظافة
- **لا imports غير مستخدمة**
- **لا كود ميت (dead code)**
- **إزالة التعليقات القديمة**

---

## 7. الممارسات المحظورة (Forbidden Practices)

### ❌ ممنوع تماماً:
- **Inline styles** (استخدام Tailwind)
- **ألوان hardcoded** (استخدام CSS variables)
- **نسخ-لصق مكونات بدون إعادة هيكلة**
- **تكرار المنطق عبر الصفحات**
- **استدعاءات API مباشرة في UI**
- **وصول إلى localStorage/cookies مباشرة**
- **معالجة الأخطاء inline (Toast فقط)**
- **منطق الأعمال في UI**
- **ملفات CSS مخصصة**

### ✅ مسموح:
- **استخدام Hooks للطفرات**
- **استخدام `useRouter()` لإعادة التوجيه**
- **استخدام Toast عبر ActionToastListener**
- **استخدام Tailwind utilities**
- **استخدام CSS variables**

---

## 8. أمثلة على البنية الصحيحة

### صفحة Login (مثال)
```tsx
// src/app/auth/login/page.tsx (Thin wrapper)
import { LoginView } from "@/components/auth"

export default function LoginPage() {
  return <LoginView />
}
```

```tsx
// src/components/auth/LoginView.tsx (Layout only - no redirect)
"use client"
import { LoginForm } from "./LoginForm"

export function LoginView() {
  // لا حاجة للتحويل - proxy.ts يتعامل مع ذلك
  // إذا كان المستخدم مسجلاً، proxy.ts سيعيد توجيهه تلقائياً

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  )
}
```

```tsx
// src/components/auth/LoginForm.tsx (Form UI only)
"use client"
import { useState } from "react"
import { useAuthActions } from "@/features/auth"
import { Button, Input, Label } from "@/components/ui"

export function LoginForm() {
  const { login } = useAuthActions()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await login({ username, password, device_token: undefined })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 9. التحديثات المستقبلية

هذا الملف يجب تحديثه عند:
- **إدخال نمط UI جديد**
- **تغيير قواعد البنية**
- **إضافة قواعد جديدة**

---

**آخر تحديث**: 2024
