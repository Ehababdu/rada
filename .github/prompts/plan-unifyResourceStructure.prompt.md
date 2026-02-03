## خطة: توحيد بنية الموارد في التطبيق ✅

**ملخّص سريع:** سأقترح معيارًا ثابتًا لبنية كل Resource (Model → Controller → Service → Request → Policy) مع طريقة تسجيل الـ Services وPolicies ودمج Spatie للأدوار. الهدف: كود مرتب، سهل الصيانة، وقابل للاختبار.

### الخطوات 🛠️
1. قرّر نمط الربط: **سجل كل الخدمات في مزود خدمات واحد** (`app/Providers/ServicesServiceProvider.php`) واستخدم الـ DI بالـ constructor؛ اجعل الـ singleton فقط عند الحاجة.  
2. طبّق قيد بنية Resource على كل مورد:  
   - Model: `app/Models/{Resource}.php`  
   - Controller: `app/Http/Controllers/{Resource}Controller.php` (ضع المنطق في Service)  
   - Service: `app/Services/{Resource}Service.php`  
   - Form Requests: `app/Http/Requests/Store{Resource}Request.php`, `Update{Resource}Request.php`  
   - Policy: `app/Policies/{Resource}Policy.php` + تسجيله في `app/Providers/AuthServiceProvider.php`  
3. ابدأ بإصلاح تدريجي للموارد غير المتوافقة (مثال: **Bank**): استبدل عمليات الـ DB المباشرة في `BankController` باستدعاءات `BankService`، واختبر كل خطوة بوحدة/ميزة.  
4. ضع قواعد الترخيص باستخدام Spatie داخل الـ Policies (استدلال الأدوار بـ `hasRole` أو `can`) وتأكد من وجود `config/permission.php` وسلوك المستخدم (`HasRoles`).  
5. أضف اختبارات: Unit للاختبار الخدمة (`tests/Unit/*ServiceTest.php`) وFeature للاختبار السياسي/النقاط النهائية (`tests/Feature/*PolicyTest.php`). وأخيرًا: أضف ملف وثائق قصير (`docs/CONTRIBUTING.md`) يشرح القواعد.

### اعتبارات إضافية 💡
1. تنفيذ تدريجي أم شامل؟ أنصح بالتدريج (مورد واحد كل مرة) لتقليل المخاطر.  
2. قرار الربط: خياران — (أ) Auto-wiring فقط، أو (ب) تسجيل جميع الخدمات صراحة في `ServicesServiceProvider`. أوفرّ صندوقية (B) للاتساق.  
3. هل تريد معيار تسميه/مجلدات إضافية (مثل `Contracts` أو `Interfaces`)? هذا مفيد عند الحاجة لاختبار Mockable interfaces.

> أخبرني أي خيار تفضّل (تنفيذي تدريجي أم شامل، واختيار الربط A أو B)، وسأقدّم خطة تنفيذية مفصّلة لكل مرحلة (قائمة ملفات لتعديل، تغييرات للاختبارات، ورسائل commit مقترحة).
