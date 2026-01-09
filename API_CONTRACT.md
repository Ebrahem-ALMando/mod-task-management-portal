# API Contract (Frontend-Oriented) — MOD Task Management API (v1)

هذه الوثيقة هي **عقد استخدام (Contract)** موجّه لمهندسي الفرونت، وتشرح كيفية التعامل مع:

- **أشكال الاستجابات** (Success / Error)
- **قواعد الموارد (Resources)** بعد التحديث الأخير (بدون مفاتيح أجنبية في الـ response)
- **التحقق (Validation)** وكيفية عرض الأخطاء
- **الأوفلاين (Offline-first)**: ما الذي يمكن وضعه في Queue وما الذي لا يمكن
- **إعادة المحاولة (Retry)**: متى تُسمح ومتى تُمنع

> **Base URL**: `/api/v1`  
> **Auth**: `Authorization: Bearer {token}` لمعظم الـ endpoints (عدا login)

### ملاحظة المصادقة (Frontend)
- **حالياً**: المصادقة عبر **Bearer token** ضمن Header.
- **مستقبلاً (محتمل)**: قد تتحول المصادقة إلى **HttpOnly cookies**.
- **سلوك الفرونت لا يتغير**: دائماً تعامل مع 401 بنفس القاعدة (امسح الجلسة/أعد تسجيل الدخول)، ولا تبنِ منطق يعتمد على “طريقة النقل” (Header vs Cookie).

---

## مبادئ عامة مهمة للفرونت

### 1) شكل الـ Response القياسي

#### Success

```json
{
  "status": 200,
  "message": "رسالة نجاح",
  "data": {},
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 66
  }
}
```

- **status**: نفس كود HTTP.
- **message**: رسالة جاهزة للعرض للمستخدم (UI-friendly).
- **data**: حمولة الاستجابة (Resource / Collection / primitive / null).
- **meta**: تظهر **فقط** عند وجود Pagination (ليست دائماً موجودة).

#### Error

```json
{
  "status": 422,
  "message": "The title field is required.",
  "errors": {
    "title": ["The title field is required."]
  }
}
```

- **status**: كود HTTP.
- **message**: أول خطأ مناسب للعرض السريع (toast/banner).
- **errors**: أخطاء تفصيلية (مفيدة لعرضها تحت الحقول).

---

## 1.5) قوالب الأخطاء القياسية (Reusable Error Templates)

> كل الأخطاء في هذا الـ API تُرجع JSON بالشكل القياسي التالي: `status/message/errors`.

### (T-401) 401 Unauthenticated
**متى تحدث؟**
- عدم إرسال Authorization header
- Token منتهي/محذوف/غير صالح

**Example:**
```json
{ "status": 401, "message": "غير مصادق", "errors": [] }
```

**رد فعل الفرونت (مطلوب):**
- **امسح التوكن محلياً** (clear session)
- **حوّل المستخدم لصفحة تسجيل الدخول**
- **لا تعمل retry تلقائي**
- **لا تعمل queue** (أي أفعال pending يجب إيقافها حتى Login)

### (T-403) 403 Forbidden
**متى تحدث؟**
- المستخدم مصادق لكن لا يمتلك صلاحية (Role/Policy)

**Example:**
```json
{ "status": 403, "message": "غير مسموح", "errors": [] }
```

**رد فعل الفرونت:**
- اعرض رسالة صلاحيات (Permission denied)
- لا retry
- لا queue

### (T-404) 404 Not Found
**متى تحدث؟**
- المورد غير موجود
- أو “غير مرئي” للمستخدم (يُعامل كـ Not Found لمنع كشف البيانات)

**Example:**
```json
{ "status": 404, "message": "غير موجود", "errors": [] }
```

**رد فعل الفرونت:**
- اعرض شاشة Not Found / أو ارجع للّست
- حدّث الـ cache المحلي (احذف العنصر إن كان موجوداً)
- لا retry تلقائي

### (T-422) 422 Validation Failed
**متى تحدث؟**
- بيانات ناقصة/غير صحيحة/قواعد business validation

**Example:**
```json
{
  "status": 422,
  "message": "The due date field must be a date after now.",
  "errors": {
    "due_date": ["The due date field must be a date after now."]
  }
}
```

**رد فعل الفرونت:**
- **اعرض أخطاء الحقول مباشرة**: `errors[field]` تحت الحقل/داخل النموذج (هذا هو السلوك الأساسي).
- `message` يمكن استخدامه فقط كعنوان أعلى النموذج (وليس Toast افتراضي) حتى لا تُخفى أخطاء الحقول.
- **ممنوع Retry** لخطأ 422.
- **ممنوع Queue** لخطأ 422 (لأنه سيفشل دائماً حتى تتغير البيانات).

### (T-500) 500 Internal Server Error
**متى تحدث؟**
- خطأ داخلي/استثناء غير متوقع/مشكلة معالجة

**Example:**
```json
{ "status": 500, "message": "خطأ داخلي في الخادم", "errors": [] }
```

**رد فعل الفرونت:**
- اعرض رسالة عامة “حدث خطأ، حاول لاحقاً”
- GET: retry تلقائي مع backoff
- Mutations: retry بحذر (انظر Offline/Retry لكل endpoint)

## 2) قاعدة الـ Resources (Frontend Contract) — بعد التحديث الأخير

### قاعدة ذهبية
**الـ API لا يُرجع مفاتيح أجنبية `_id` داخل الـ response.**  
بدلاً من ذلك، يعيد كائنات مدمجة (Embedded objects) جاهزة للاستهلاك مباشرة في الفرونت.

#### مثال (ممنوع)
```json
{ "assigned_to_user_id": 5 }
```

#### مثال (مطلوب)
```json
{ "assigned_to": { "id": 5, "name": "...", "avatar_url": "..." } }
```

> **ملاحظة**: الطلبات (Requests) قد ترسل IDs (مثل `assigned_to_user_id`) — هذا طبيعي. المنع فقط في **Responses**.

---

## 3) نماذج البيانات (Data Shapes)

### 3.1) User (UserResource)
يعاد عادة من:
- `GET /users`, `GET /users/{id}`, `POST /users`, `PUT /users/{id}`, `PATCH /users/{id}/toggle-active`
- داخل `Task.assigned_to` و `Task.created_by`
- داخل `TaskStatusLog.changed_by`
- داخل `Notification.user`

```json
{
  "id": 5,
  "name": "John Doe",
  "username": "johndoe",
  "avatar": "file.webp",
  "avatar_url": "http://localhost:8000/uploads/images/users/file.webp",
  "role": "admin",
  "is_active": true,
  "last_login_at": "2026-01-08T07:19:13.000000Z",
  "created_at": "2026-01-07T20:50:11.000000Z",
  "updated_at": "2026-01-08T07:19:13.000000Z"
}
```

**ملاحظات فرونت:**
- `avatar` = اسم ملف فقط، بينما `avatar_url` = رابط عام جاهز للاستخدام.
- `role`: واحدة من `admin | department`.

### 3.2) Task (TaskResource)

```json
{
  "id": 1,
  "title": "عنوان",
  "description": "وصف",
  "status": "pending",
  "priority": "high",
  "due_date": "2026-02-01T10:00:00.000000Z",
  "completed_at": null,
  "cancelled_at": null,
  "cancellation_reason": null,
  "created_at": "2026-01-07T20:50:11.000000Z",
  "updated_at": "2026-01-08T07:19:13.000000Z",
  "assigned_to": { "id": 5, "name": "...", "username": "...", "avatar": "...", "avatar_url": "...", "role": "...", "is_active": true, "last_login_at": null, "created_at": "...", "updated_at": "..." },
  "created_by": { "id": 1, "name": "...", "username": "...", "avatar": null, "avatar_url": null, "role": "admin", "is_active": true, "last_login_at": "...", "created_at": "...", "updated_at": "..." },
  "status_logs": [
    {
      "id": 10,
      "from_status": null,
      "to_status": "pending",
      "reason": "Task created",
      "created_at": "2026-01-07T20:50:11.000000Z",
      "changed_by": { "id": 1, "name": "...", "username": "...", "avatar": null, "avatar_url": null, "role": "admin", "is_active": true, "last_login_at": "...", "created_at": "...", "updated_at": "..." }
    }
  ]
}
```

**ملاحظات فرونت:**
- في **قائمة المهام** (`GET /tasks`) لا يتم تضمين `status_logs` عادةً (لأسباب الأداء).  
- في **تفاصيل مهمة واحدة** (`GET /tasks/{id}`) يتم تضمين `status_logs`.

### 3.3) TaskStatusLog (TaskStatusLogResource)

```json
{
  "id": 10,
  "from_status": "pending",
  "to_status": "in_progress",
  "reason": "Starting work",
  "created_at": "2026-01-08T07:19:13.000000Z",
  "changed_by": { "id": 5, "name": "...", "username": "...", "avatar": "...", "avatar_url": "...", "role": "department", "is_active": true, "last_login_at": "...", "created_at": "...", "updated_at": "..." }
}
```

### 3.4) Notification (NotificationResource)

```json
{
  "id": 100,
  "title": "مهمة جديدة",
  "message": "تم إسناد مهمة جديدة إليك: ...",
  "metadata": {
    "type": "task_created",
    "resource_type": "task",
    "resource_id": 1,
    "redirect_page": "/tasks/1"
  },
  "redirect_page": "/tasks/1",
  "status": "pending",
  "scheduled_at": null,
  "sent_at": null,
  "read_at": null,
  "error": null,
  "created_at": "2026-01-08T07:19:13.000000Z",
  "updated_at": "2026-01-08T07:19:13.000000Z",
  "notificationable": {
    "id": 1,
    "title": "...",
    "status": "pending",
    "priority": "high",
    "due_date": "...",
    "assigned_to": { "id": 5, "name": "...", "username": "...", "avatar": "...", "avatar_url": "...", "role": "...", "is_active": true, "last_login_at": null, "created_at": "...", "updated_at": "..." },
    "created_by": { "id": 1, "name": "...", "username": "...", "avatar": null, "avatar_url": null, "role": "admin", "is_active": true, "last_login_at": "...", "created_at": "...", "updated_at": "..." }
  },
  "user": { "id": 5, "name": "...", "username": "...", "avatar": "...", "avatar_url": "...", "role": "...", "is_active": true, "last_login_at": null, "created_at": "...", "updated_at": "..." }
}
```

**ملاحظة مهمة (Edge Case):**
- استجابة `PATCH /notifications/{id}/read` قد تعيد `notificationable` بدون `assigned_to/created_by` في حالة كان `notificationable` من نوع Task (حسب التحميل الفعلي للعلاقات في هذا الـ endpoint).

---

## 4) قواعد Offline / Retry (مختصر عام)

### تصنيف الـ endpoints
- **GET (قراءة)**: يمكن الاعتماد على Cache محلي (offline read). عند العودة Online: Sync/Refresh.
- **Mutations (POST/PUT/PATCH/DELETE)**:
  - **آمن للـ queue غالباً**: تحديثات بسيطة قابلة لإعادة المحاولة (لكن انتبه للتعارض).
  - **غير آمن للـ queue**: Upload ملفات + عمليات Auth الحساسة.

### قواعد Retry المقترحة للفرونت
- **401 Unauthorized**: لا تعيد المحاولة تلقائياً.  
  - الإجراء: احذف الـ token محلياً + أعد توجيه المستخدم لتسجيل الدخول.
- **403 Forbidden**: لا تعيد المحاولة.  
  - الإجراء: اعرض رسالة صلاحيات/منع، ولا تعمل queue.
- **422 Validation**: لا تعيد المحاولة بدون تعديل المدخلات.  
  - الإجراء: اعرض أخطاء الحقول من `errors`.
- **500 Internal Server Error / مشاكل شبكة / Timeout**:
  - GET: إعادة محاولة تلقائية (Backoff).
  - Mutations: إعادة محاولة بحذر:
    - إذا كان الـ endpoint **غير idempotent** (مثل create) لا تكرر تلقائياً بدون حماية (قد تكرر الإنشاء).
    - إذا كان **idempotent** (مثل mark-as-read غالباً) يمكن Retry.

---

## Offline Queue Rules (Frontend)

الأوفلاين-أولاً لا يعني أن كل الطلبات تُوضع في Queue تلقائياً. القاعدة هنا:

- **Queue ليست افتراضية**: لا تضع أي Mutation في Queue إلا إذا كان **آمناً ومصرّحاً به صراحة** في الجداول أدناه.
- **فقط الـ Mutations التصريحية (Declarative) والآمنة** يمكن Queue:
  - مثال: “تعيين حالة مقروء” (mark-as-read) لأنه idempotent.
- **ممنوع Queue** لهذه الأنواع (حتى لو كان المستخدم Offline):
  - **Non-idempotent** (إنشاء/عمليات تنتج كيان جديد).
  - **Toggle-based** أو **State-dependent** (يعتمد على الحالة الحالية على السيرفر).
  - **عمليات تدميرية** (Delete/Remove) أو ذات **آثار جانبية** قوية.
  - **عمليات حساسة أمنياً** (Auth / تغيير كلمة المرور).
  - **Uploads** (ملفات كبيرة + نجاح جزئي + آثار جانبية).

### قاعدة 422 (Validation) ضمن سياق الأوفلاين
- إذا استلم الفرونت **422**:  
  - **لا Retry**  
  - **لا Queue**  
  - اعرض أخطاء الحقول داخل النموذج وأوقف التدفق حتى تصحيح البيانات.

# Endpoint Groups

## A) Authentication

### جدول الملخص (Mutations) — Authentication

| Endpoint | Method | Idempotent | Queue Allowed | Retry Allowed | Reason |
|--------|--------|------------|---------------|---------------|--------|
| `/auth/login` | POST | لا | لا | لا | **Non-idempotent** + حساس أمنياً (قد ينشئ جلسات/توكنات متعددة) |
| `/auth/logout` | POST | مشروط | لا | لا | **State-dependent** (يتعلق بتوكن حالي) + تنفيذ Online فقط؛ يمكن عمل logout محلياً بدون API |

### A1) Login
#### 1) Endpoint
- **POST** `/auth/login`

#### 2) Description
تسجيل الدخول وإنشاء Token جديد.

- **من يستطيع**: عام (بدون Authorization).

#### 3) Request
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  - **username** (string, required)
  - **password** (string, required)
  - **device_token** (string, optional, max 255) — Token الخاص بالإشعارات (FCM)

#### 4) Success Responses
- **HTTP 200**

```json
{
  "status": 200,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "System Administrator",
      "role": "admin",
      "is_active": true,
      "avatar": "file.webp",
      "created_by": null,
      "last_login_at": "2026-01-08T07:19:13.000000Z",
      "created_at": "2026-01-07T20:50:11.000000Z",
      "updated_at": "2026-01-08T07:19:13.000000Z"
    },
    "token": "plain_text_token_here"
  }
}
```

**ملاحظة فرونت مهمة**: حقل `user` هنا قد لا يطابق تماماً `UserResource` (قد يظهر `created_by` مثلاً، وبدون `avatar_url`). تعامل معه كـ **LoginPayload** منفصل، ثم اعتمد على `GET /profile` لجلب الهوية النهائية المعتمدة للواجهة.

#### 5) Error Scenarios
- **HTTP 422**: انظر (T-422) — السبب: نقص `username`/`password` أو نوع خاطئ.
- **HTTP 401**: انظر (T-401) — السبب: بيانات دخول خاطئة أو الحساب غير مفعل (هنا لا يوجد token أصلاً؛ فقط اعرض الرسالة).
- **HTTP 500**: انظر (T-500)

```json
{
  "status": 422,
  "message": "The username field is required.",
  "errors": {
    "username": ["The username field is required."]
  }
}
```

**ملاحظة:** في حالة 401 أثناء login، **لا تعمل logout** (لا يوجد جلسة)، فقط اعرض الرسالة.

#### 6) Offline Considerations
- **لا يُسمح بالـ queue**.  
- إذا Offline: اعرض شاشة “لا يوجد اتصال” + لا تحاول Login.

---

### A2) Logout
#### 1) Endpoint
- **POST** `/auth/logout`

#### 2) Description
تسجيل خروج (إبطال الـ token الحالي).

- **من يستطيع**: أي مستخدم مسجل الدخول.

#### 3) Request
- **Headers**:
  - `Authorization: Bearer {token}`

#### 4) Success Responses
- **HTTP 200**

```json
{ "status": 200, "message": "تم تسجيل الخروج بنجاح", "data": null }
```

#### 5) Error Scenarios
- **HTTP 401**: انظر (T-401) — اعتبر المستخدم Logged-out محلياً.
- **HTTP 500**: انظر (T-500)

#### 6) Offline Considerations
- يفضّل **عدم queue**.
- الإجراء الموصى به Offline: احذف الـ token محلياً فوراً (local logout) ثم أرسل logout “best-effort” عند عودة الاتصال (اختياري).

---

## B) Profile

### جدول الملخص (Mutations) — Profile

| Endpoint | Method | Idempotent | Queue Allowed | Retry Allowed | Reason |
|--------|--------|------------|---------------|---------------|--------|
| `/profile` | PUT | مشروط | مشروط | مشروط | تصريحي عند تحديث الاسم فقط؛ **تغيير كلمة المرور حساس** ولا يُنصح بالـ queue/retry |
| `/profile/avatar` | POST | نعم | لا | لا | **يعتمد على وجود ملف مرفوع مسبقاً**؛ Offline قد ينتج حالة غير متسقة |
| `/profile/avatar` | DELETE | مشروط | لا | لا | **تدميري** + يعتمد على حالة ملف موجود على السيرفر |

### B1) Get My Profile
#### Endpoint
- **GET** `/profile`

#### Description
جلب ملف المستخدم الحالي.

- **من يستطيع**: أي مستخدم مسجل الدخول (self only).

#### Request
- **Headers**: `Authorization: Bearer {token}`

#### Success
- **HTTP 200** — `ProfileResource`

```json
{
  "status": 200,
  "message": "تم جلب الملف الشخصي بنجاح",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "System Administrator",
    "avatar": "file.webp",
    "avatar_url": "http://localhost:8000/uploads/images/users/file.webp",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-01-07T20:50:11.000000Z",
    "updated_at": "2026-01-08T07:19:13.000000Z"
  }
}
```

#### Errors
- **401**: انظر (T-401)
- **500**: انظر (T-500)

#### Offline
- **GET**: يمكن عرض آخر نسخة cached، ثم refresh عند online.

---

### B2) Update My Profile
#### Endpoint
- **PUT** `/profile`

#### Description
تحديث الاسم و/أو كلمة المرور للمستخدم الحالي.

#### Request
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Body**
  - **name** (string, optional)
  - **password** (string, optional, min 8)
  - **current_password** (string, required إذا أُرسل password)

#### Success
- **HTTP 200** — `ProfileResource`

#### Errors
- **422**: انظر (T-422) — مثال شائع: `current_password` غير صحيح.
- **401**: انظر (T-401)
- **500**: انظر (T-500)

#### Offline
- **مسموح Queue بحذر** إذا كان تغيير الاسم فقط.  
- **لا يُنصح بالـ queue** لتغيير كلمة المرور (عملية حساسة وتحتاج current_password).

---

### B3) Set Avatar Filename (attach)
#### Endpoint
- **POST** `/profile/avatar`

#### Description
ربط اسم ملف avatar بالمستخدم (الملف نفسه يجب أن يكون مرفوع مسبقاً عبر Image Uploads).

#### Request
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Body:
  - **avatar** (string, required) اسم الملف (مثلاً: `uuid.webp`)

#### Success
- **HTTP 200** — `ProfileResource`

#### Errors
- **422**: انظر (T-422) — مثال: `avatar` مفقود/طويل جداً/اسم غير مقبول.
- **401**: انظر (T-401)
- **500**: انظر (T-500)

#### Offline
- لا يُنصح بالـ queue إلا إذا كان لديك ضمان أن الملف موجود فعلاً على السيرفر.

---

### B4) Remove Avatar
#### Endpoint
- **DELETE** `/profile/avatar`

#### Description
إزالة avatar من المستخدم وحذف الملف من القرص.

#### Offline
- **غير مناسب للـ queue** (سلوك تدميري + يعتمد على ملف موجود).

#### Errors
- **401**: انظر (T-401)
- **500**: انظر (T-500)

---

## C) Users (Admin Only)

### جدول الملخص (Mutations) — Users (Admin)

| Endpoint | Method | Idempotent | Queue Allowed | Retry Allowed | Reason |
|--------|--------|------------|---------------|---------------|--------|
| `/users` | POST | لا | لا | لا | **Non-idempotent** (إنشاء مستخدم جديد) + مخاطر تكرار الإنشاء |
| `/users/{id}` | PUT | نعم | مشروط | مشروط | **تصريحي** (تحديث بيانات)؛ يمكن Retry/Queue بحذر لتفادي تعارضات |
| `/users/{id}/toggle-active` | PATCH | لا | لا | لا | **Toggle-based / State-dependent** (قد ينقلب التأثير عند إعادة الإرسال) |

> جميع endpoints هنا تتطلب: **Admin role**.

### C1) List Users
- **GET** `/users`

#### Query Params (اختيارية)
- `role` = `admin|department`
- `is_active` = `true|false`
- `search` = نص
- `from`, `to` = تاريخ/وقت
- `filter_field`, `filter_value` (whitelist)

#### Success
- **HTTP 200** — `data` = array of `UserResource`, مع `meta` pagination

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **500**: انظر (T-500)

#### Offline
- GET: يمكن cache.

---

### C2) Create User
- **POST** `/users`

#### Body
- `username` (string, required, unique)
- `name` (string, required)
- `password` (string, required, min 8)
- `role` (string, required: `admin|department`)
- `is_active` (boolean, optional)

#### Success
- **HTTP 201** — `UserResource`

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **422**: انظر (T-422) — مثال: `username` غير unique.
- **500**: انظر (T-500)

#### Offline
- **لا يُنصح بالـ queue** (غير idempotent، خطر إنشاء مكرر).

---

### C3) Get User by ID
- **GET** `/users/{id}`

#### Success
- **HTTP 200** — `UserResource`

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **500**: انظر (T-500)

---

### C4) Update User
- **PUT** `/users/{id}`

#### Body (كلها اختيارية لكن إن وُجدت يجب أن تكون valid)
- `username` (string, optional, unique except self)
- `name` (string, optional)
- `password` (string, optional, min 8)
- `role` (string, optional: `admin|department`)
- `is_active` (boolean, optional)

#### Offline
- ممكن queue بحذر (لكن التعارض محتمل).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **422**: انظر (T-422)
- **500**: انظر (T-500)

---

### C5) Toggle Active
- **PATCH** `/users/{id}/toggle-active`

#### Success
- **HTTP 200** — `UserResource`

#### Offline
- **غير مناسب للـ queue** (لأنه toggle يعتمد على الحالة الحالية وقد ينعكس عند إعادة الإرسال).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **500**: انظر (T-500)

---

## D) Tasks

### جدول الملخص (Mutations) — Tasks

| Endpoint | Method | Idempotent | Queue Allowed | Retry Allowed | Reason |
|--------|--------|------------|---------------|---------------|--------|
| `/tasks` | POST | لا | لا | لا | **Non-idempotent** (إنشاء مهمة) + آثار جانبية محتملة |
| `/tasks/{id}` | PUT | نعم | مشروط | مشروط | **تصريحي** (تحديث حقول)؛ Queue/Retry بحذر بسبب التعارض/تغير الحالة |
| `/tasks/{id}/status` | PATCH | لا | لا | لا | **State-dependent** + قد يسبب آثار جانبية (سجلات/إشعارات) |
| `/tasks/{id}/reassign` | PATCH | لا | لا | لا | **State-dependent** + قرار إداري + آثار جانبية محتملة |
| `/tasks/{id}` | DELETE | مشروط | لا | لا | **تدميري** + يعتمد على الحالة الحالية |
| `/tasks/{id}/restore` | POST | لا | لا | لا | **State-dependent** (لا معنى له بدون حالة “محذوف”) |

### D1) List Tasks
- **GET** `/tasks`

#### Query Params (اختيارية)
- `status` = `pending|in_progress|completed|cancelled`
- `priority` = `low|medium|high|urgent`
- `overdue` = `true|false`
- `search` = نص
- `from`, `to`
- `filter_field`, `filter_value`
  - `filter_field` المسموح: `status|priority|assigned_to_user_id|created_by_user_id`

#### Success
- **HTTP 200** — `data` = array `TaskResource` + `meta` pagination  
  - غالباً بدون `status_logs`.

#### Offline
- ممتاز للـ cache مع refresh عند online.

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403) *(نادر هنا لأن policy تسمح للجميع، لكن يبقى قالب عام)*
- **500**: انظر (T-500)

---

### D2) Create Task (Admin Only)
- **POST** `/tasks`

#### Body
- `title` (string, required)
- `description` (string, optional)
- `priority` (required)
- `due_date` (date, required, must be after now)
- `assigned_to_user_id` (int, required, exists users.id + must be department + must be active)

#### Success
- **HTTP 201** — `TaskResource`

#### Offline
- **لا يُنصح بالـ queue** (create غير idempotent).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **422**: انظر (T-422) — أمثلة: `due_date` قبل الآن، أو `assigned_to_user_id` ليس department/غير active.
- **500**: انظر (T-500)

---

### D3) Get Task by ID
- **GET** `/tasks/{id}`

#### Success
- **HTTP 200** — `TaskResource` **مع** `status_logs` (مرتب تصاعدياً).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404) — غير موجود/غير مرئي للمستخدم
- **500**: انظر (T-500)

---

### D4) Update Task
- **PUT** `/tasks/{id}`

#### Body (اختياري)
- `title`, `description`, `priority`, `due_date` (إذا موجودة يجب أن تكون valid)

#### Offline
- ممكن queue بحذر (قد تفشل لاحقاً إذا تغيّرت المهمة/حُذفت/تمت).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **422**: انظر (T-422) — مثال: `due_date` قبل الآن.
- **500**: انظر (T-500)

---

### D5) Change Task Status
- **PATCH** `/tasks/{id}/status`

#### Body
- `status` (required)
- `reason` (optional)

#### صلاحيات (ملخص للفرونت)
- **Admin**: يمكنه فقط التغيير إلى `cancelled`
- **Department** (على مهامه فقط):
  - `pending -> in_progress|completed`
  - `in_progress -> completed`

#### Offline
- ممكن queue بحذر، لكن احتمال فشل عالي بسبب تغير الحالة أثناء Offline.  
  - عند الفشل (403/422): اعرض رسالة + اعمل refresh للمهمة.

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403) — مثال: انتقال حالة غير مسموح أو مستخدم ليس مالك المهمة.
- **404**: انظر (T-404)
- **422**: انظر (T-422) — مثال: `status` غير ضمن القيم المسموحة.
- **500**: انظر (T-500)

---

### D6) Reassign Task (Admin Only)
- **PATCH** `/tasks/{id}/reassign`

#### Body
- `assigned_to_user_id` (required, department + active)
- `reason` (optional)

#### Offline
- **لا يُنصح بالـ queue** (قرار إداري حساس وقد يتغير).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **422**: انظر (T-422)
- **500**: انظر (T-500)

---

### D7) Delete Task (Soft Delete) (Admin Only)
- **DELETE** `/tasks/{id}`

#### Success
- **HTTP 200** — `data: null`

#### Offline
- غير مناسب للـ queue (تدميري + تعارضات).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **500**: انظر (T-500)

---

### D8) Restore Task (Admin Only)
- **POST** `/tasks/{id}/restore`

#### Offline
- غير مناسب للـ queue.

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404)
- **500**: انظر (T-500)

---

## E) Notifications

### جدول الملخص (Mutations) — Notifications

| Endpoint | Method | Idempotent | Queue Allowed | Retry Allowed | Reason |
|--------|--------|------------|---------------|---------------|--------|
| `/notifications/{id}/read` | PATCH | نعم | نعم | نعم | **Idempotent** (تعيين مقروء) ومناسب للأوفلاين |
| `/notifications/read-all` | PATCH | نعم | مشروط | مشروط | **Idempotent** لكن النتائج (count) قد تختلف عند التنفيذ؛ مناسب Queue بحذر |

### E1) List Notifications
- **GET** `/notifications`

#### Query Params
- `unread` = `true|false`
- `type` = `task_created|task_status_changed|task_reassigned|task_reminder` (من `metadata.type`)
- `from`, `to`
- `filter_field`, `filter_value` (whitelist: `status|read_at|metadata->type`)

#### Success
- **HTTP 200** — array of `NotificationResource` + pagination meta

#### Offline
- GET: cache ok.

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **500**: انظر (T-500)

---

### E2) Unread Count
- **GET** `/notifications/unread-count`

#### Success
```json
{ "status": 200, "message": "...", "data": { "count": 3 } }
```

#### Offline
- استخدم قيمة cached (تقريبية) وحدثها عند online.

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **500**: انظر (T-500)

---

### E3) Mark Notification as Read (Idempotent)
- **PATCH** `/notifications/{id}/read`

#### Success
- **HTTP 200** — `NotificationResource`

#### Offline
- **مناسب للـ queue** (idempotent).  
  - لو 404: الإشعار لم يعد موجوداً → احذفه محلياً.

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403) — محاولة قراءة إشعار لا يخص المستخدم
- **404**: انظر (T-404)
- **500**: انظر (T-500)

---

### E4) Mark All As Read
- **PATCH** `/notifications/read-all`

#### Success
```json
{ "status": 200, "message": "...", "data": { "count": 12 } }
```

#### Offline
- ممكن queue (لكن قد ينتج count مختلف عند التنفيذ).

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **500**: انظر (T-500)

---

### E5) Get Notification by ID
- **GET** `/notifications/{id}`

#### Errors
- **401**: انظر (T-401)
- **403**: انظر (T-403)
- **404**: انظر (T-404) — غير موجود/لا يخص المستخدم
- **500**: انظر (T-500)

---

## F) Image Uploads

### جدول الملخص (Mutations) — Image Uploads

| Endpoint | Method | Idempotent | Queue Allowed | Retry Allowed | Reason |
|--------|--------|------------|---------------|---------------|--------|
| `/uploads/images` | POST | لا | لا | مشروط | **Non-idempotent** (قد ينتج ملفات/أسماء جديدة) + حجم كبير + نجاح جزئي |

### F1) Upload Images
#### Endpoint
- **POST** `/uploads/images`

#### Description
رفع ومعالجة الصور (تحويل WebP/تصغير/ضغط)، ثم تعيد أسماء الملفات وروابطها.

#### Request
- Headers:
  - `Authorization: Bearer {token}`
  - `Content-Type: multipart/form-data`
- Body (Form Data):
  - `images[]` (file[], required, min 1, mimes: jpg|jpeg|png|webp)
  - `folder` (string, required, regex: `^[A-Za-z0-9_\-\/]+$`) مثال: `users`

> **ملاحظة توثيق**: قد تجد في `API_ENDPOINTS.md` أن `folder` “اختياري”، لكن وفق قواعد التحقق الحالية **هو مطلوب** (required).

#### Success
- **HTTP 200**

```json
{
  "status": 200,
  "message": "تم معالجة الصور بنجاح",
  "data": {
    "uploaded": [
      { "image_name": "uuid.webp", "image_url": "http://localhost:8000/uploads/images/users/uuid.webp" }
    ],
    "failed": [
      { "image_name": "bad.png", "error": "..." }
    ]
  }
}
```

#### Errors
- **422**: انظر (T-422) — مثال: `images` فارغ أو `folder` غير مطابق regex.
- **401**: انظر (T-401)
- **500**: انظر (T-500)

#### Offline
- **ممنوع queue** (ملفات/حجم/اعتمادية عالية).

### Upload Partial Success (Frontend Behavior)
قد يحدث أن:
- `uploaded[]` يحتوي عناصر (نجحت فعلاً وتم حفظها على السيرفر)
- `failed[]` يحتوي عناصر (فشلت معالجة/رفع بعض الملفات)

**قواعد الفرونت المقترحة:**
- اعتبر عناصر `uploaded[]` **مكتملة نهائياً** (لا تعِد رفعها تلقائياً).
- اعرض للمستخدم قائمة الملفات الفاشلة مع سبب الفشل (لكل ملف).
- اسمح للمستخدم بإعادة محاولة **فقط الملفات الفاشلة** (Online فقط).
- لا تحاول “Rollback” للملفات الناجحة عبر الفرونت (غير مضمون ولا يوجد Contract بذلك).

---

## ملحق: أكواد HTTP المهمة للفرونت

- **200/201**: نجاح
- **401**: غير مصادق (token مفقود/منتهي/غير صالح) → امسح token + login
- **403**: ممنوع (صلاحيات) → اعرض منع صلاحيات
- **404**: غير موجود (أو غير مرئي للمستخدم) → تعامل معها كـ not-found في UI
- **422**: أخطاء تحقق → اعرض أخطاء الحقول من `errors`
- **500**: خطأ داخلي → retry/backoff + رسالة “حدث خطأ”

