# نظام إدارة الشهداء والمفقودين

نظام شامل لإدارة بيانات الشهداء والمفقودين باستخدام Laravel و React.

## الميزات

- إدارة شاملة لبيانات الشهداء والمفقودين
- واجهة مستخدم حديثة بـ React و Inertia.js
- بحث متقدم باستخدام Meilisearch
- نظام مصادقة آمن
- إدارة المرفقات والوثائق
- تقارير وإحصائيات
- دعم اللغة العربية بالكامل

## المتطلبات

- PHP 8.2+
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0
- Redis
- Meilisearch

## التثبيت السريع

### للتطوير
```bash
git clone <repository-url>
cd erp-system
cp .env.example .env
./setup.sh
```

### للإنتاج
```bash
git clone <repository-url>
cd erp-system
cp .env.production .env
# عدل القيم في .env
./setup.sh --prod
```

## GitHub Integration

### CI/CD Pipeline
يستخدم المشروع GitHub Actions للاختبار التلقائي والبناء والنشر:

- **الاختبار**: تشغيل الاختبارات عند كل push أو PR
- **البناء**: بناء صورة Docker ودفعها إلى GitHub Container Registry
- **النشر**: نشر تلقائي للإنتاج عند دفع للفرع الرئيسي

### إعداد الأسرار في GitHub
لتشغيل pipeline النشر، أضف الأسرار التالية في إعدادات المستودع:

```
PRODUCTION_HOST=your-server-ip
PRODUCTION_USER=your-ssh-user
PRODUCTION_SSH_KEY=your-private-ssh-key
PRODUCTION_PORT=22
```

### استخدام GitHub Container Registry
الصور تُبنى وتُدفع تلقائياً إلى `ghcr.io/your-username/your-repo`

## هيكل المشروع

```
├── app/                    # كود Laravel
├── resources/              # Views و Assets
├── routes/                 # Routes
├── database/               # Migrations و Seeders
├── docker/                 # Docker configs
├── .github/workflows/      # GitHub Actions
├── tests/                  # Tests
└── docs/                   # Documentation
```

## الأوامر المفيدة

```bash
# تشغيل الخدمات
./setup.sh

# تشغيل الاختبارات
vendor/bin/sail artisan test

# تشغيل Vite للتطوير
vendor/bin/sail npm run dev

# إنشاء نسخة احتياطية
./backup.sh

# مراقبة السجلات
docker-compose logs -f
```

## المساهمة

1. Fork المشروع
2. أنشئ فرع للميزة: `git checkout -b feature/new-feature`
3. Commit التغييرات: `git commit -am 'Add new feature'`
4. Push للفرع: `git push origin feature/new-feature`
5. أنشئ Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## الدعم

للدعم الفني أو الأسئلة، يرجى إنشاء issue في GitHub.