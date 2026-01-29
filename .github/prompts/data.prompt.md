---
agent: agent
---

🚀 برومبت هندسة الأداء (Search & Reports)
السياق: "أريد بناء نظام بحث وتصدير تقارير فائق الأداء باستخدام Laravel 11, Meilisearch, Laravel Scout, و Laravel Excel. الواجهة الأمامية يجب أن تعتمد كلياً على React/Next.js مع مكتبة Shadcn UI فقط."

المتطلبات التقنية (Backend):

Meilisearch Sync: قم بإعداد Laravel Scout لاستخدام Meilisearch. تأكد من تفعيل المزامنة في الخلفية عبر shouldBeSearchable وربطها بالـ Queues لضمان عدم تأثر سرعة الـ API.

Heavy Reports: قم بإنشاء Export Class باستخدام Laravel Excel يعتمد على واجهة FromQuery و WithMapping. يجب أن يتم التصدير باستخدام Excel::queue لتجنب Memory Timeout.

Notification System: عند اكتمال التقرير في الخلفية، قم بإنشاء نظام تنبيه (Database Notification) يحتوي على رابط التحميل (Temporary URL) من S3 أو Local Storage.

المتطلبات التقنية (Frontend - Shadcn UI):

Global Search: استخدم مكون Command (KBD shortcut Cmd+K) لعمل واجهة بحث لحظية تتصل بـ Meilisearch.

Async Export Button: صمم زر تحميل باستخدام Button و Toast من Shadcn. عند الضغط، يرسل الطلب ويظهر تنبيه "التقرير قيد المعالجة"، وعند الجاهزية يظهر تنبيه آخر يحتوي على زر التحميل.

Data Table: استخدم Shadcn Data Table لعرض نتائج البحث مع دعم Pagination من جهة السيرفر (Server-side) للحفاظ على سرعة المتصفح.

معايير الأداء (KPIs):

البحث يجب أن يعيد النتائج في أقل من 100ms.

استهلاك الذاكرة أثناء التصدير يجب ألا يتجاوز 128MB مهما كان حجم البيانات (استخدام Chunks).

لا يتم حجز الـ Request لأكثر من 200ms عند طلب تصدير تقرير ضخم.
