# نظام التنبيهات مع Laravel Reverb

تم تحديث نظام التنبيهات ليدعم الإشعارات في الوقت الفعلي باستخدام Laravel Reverb.

## المميزات الجديدة

- **إشعارات فورية**: يتلقى المستخدمون التنبيهات فور إنشائها دون الحاجة لإعادة تحميل الصفحة
- **إشعارات Toast**: تظهر التنبيهات كإشعارات منبثقة في أعلى الشاشة
- **تحديث تلقائي**: يتم تحديث قائمة التنبيهات تلقائياً عند وصول تنبيه جديد

## الإعداد المطلوب

### 1. متغيرات البيئة

أضف المتغيرات التالية إلى ملف `.env`:

```env
# Laravel Reverb
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

### 2. تشغيل الخادم

```bash
# تشغيل خادم Reverb
vendor/bin/sail artisan reverb:start

# أو في خلفية العملية
vendor/bin/sail artisan reverb:start &
```

### 3. إنشاء تنبيه

```php
use App\Models\Alert;

// إنشاء تنبيه - سيتم إرساله تلقائياً للمستخدم
Alert::create([
    'title' => 'تنبيه جديد',
    'message' => 'تم إنشاء تنبيه جديد',
    'type' => 'info', // info, warning, error, success
    'user_id' => 1,
]);
```

## كيفية عمل النظام

1. **إنشاء التنبيه**: عند إنشاء تنبيه جديد في قاعدة البيانات
2. **إطلاق الحدث**: يتم إطلاق حدث `AlertCreated` تلقائياً
3. **البث**: يتم بث الحدث إلى القناة الخاصة `alerts.{user_id}`
4. **الاستقبال**: يتلقى المتصفح التنبيه عبر WebSocket
5. **العرض**: يظهر التنبيه كإشعار toast ويتم إضافته للقائمة

## API المتاحة

### إنشاء تنبيه
```php
Alert::create([
    'title' => 'عنوان التنبيه',
    'message' => 'محتوى التنبيه',
    'type' => 'info', // info, warning, error, success
    'user_id' => $userId,
]);
```

### الاستماع للتنبيهات في JavaScript
```javascript
// في صفحة Alerts
useEffect(() => {
    const channel = window.Echo.private(`alerts.${userId}`)
        .listen('.alert.created', (alert) => {
            console.log('New alert received:', alert);
        });

    return () => {
        channel.stopListening('.alert.created');
    };
}, [userId]);
```

## استكشاف الأخطاء

### 1. عدم وصول التنبيهات
- تأكد من تشغيل خادم Reverb
- تحقق من متغيرات البيئة
- تأكد من أن المستخدم مسجل دخول

### 2. مشاكل في الاتصال
- تحقق من إعدادات CORS
- تأكد من تطابق مفاتيح التطبيق
- راجع console المتصفح للأخطاء

### 3. اختبار الاتصال
```bash
# اختبار اتصال Reverb
curl -X GET http://localhost:8080/health
```