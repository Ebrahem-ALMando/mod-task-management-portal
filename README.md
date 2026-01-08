# بوابة روابط وزارة الدفاع السورية

بوابة ويب حكومية ثابتة مبنية باستخدام Next.js تعمل كبوابة روابط مركزية لوزارة الدفاع السورية. تدعم التطبيق كتطبيق ويب تقدمي (PWA) مع إمكانية العمل في وضع عدم الاتصال.

## التقنيات المستخدمة

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- PWA (Service Worker)
- next-themes

## هيكل المشروع

```
src/
├─ app/
├─ components/
│  ├─ layout/
│  ├─ branding/
│  ├─ cards/
│  ├─ status/
│  └─ icons/
├─ config/
├─ hooks/
├─ lib/
└─ types/
```

## المميزات الرئيسية

- دعم RTL (من اليمين لليسار)
- الوضع الداكن والفاتح
- PWA يعمل بدون اتصال
- واجهة مستخدم حكومية احترافية
- متجاوب مع الجوال والحاسوب

## كيفية التشغيل

```bash
npm install
npm run dev
npm run build
```
