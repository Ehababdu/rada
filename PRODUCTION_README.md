# دليل إطلاق النظام في بيئة الإنتاج

## المتطلبات الأساسية
- Docker و Docker Compose مثبتين (إصدار 2.0+)
- شهادة SSL صالحة (Let's Encrypt أو شهادة مدفوعة)
- دومين مسجل ومُعد
- خادم مع موارد كافية (2GB RAM على الأقل، 20GB مساحة)

## خطوات الإعداد

### 1. تحضير الخادم
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# إضافة المستخدم إلى مجموعة docker
sudo usermod -aG docker $USER
```

### 2. نسخ المشروع وإعداده
```bash
# استنساخ المشروع
git clone <repository-url> erp-system
cd erp-system

# نسخ ملف البيئة
cp .env.production .env
# عدل القيم حسب بيئتك
nano .env
```

### 3. إعداد الشهادات SSL
```bash
# إنشاء مجلد الشهادات
mkdir -p docker/ssl

# نسخ الشهادات (استبدل بالمسارات الصحيحة)
cp /path/to/fullchain.pem docker/ssl/
cp /path/to/privkey.pem docker/ssl/

# أو استخدم Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/ssl/
```

### 4. تشغيل النظام
```bash
# تشغيل سكريبت الإعداد
./setup.sh --prod
```

### 5. التحقق من العمل
```bash
# التحقق من حالة الخدمات
docker-compose -f docker-compose.prod.yml ps

# اختبار التطبيق
curl -k https://yourdomain.com/health

# فحص السجلات
docker-compose -f docker-compose.prod.yml logs -f laravel.test
```

## إعدادات الأمان الإضافية

### 1. تكوين Firewall
```bash
# تثبيت UFW
sudo apt install ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 2. إعداد Fail2Ban
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. مراقبة النظام
```bash
# تثبيت monitoring tools
sudo apt install htop iotop ncdu

# إعداد logrotate للسجلات
sudo nano /etc/logrotate.d/erp-system
```

## الصيانة الدورية

### 1. النسخ الاحتياطي
```bash
# إضافة إلى crontab
crontab -e
# أضف السطر التالي للنسخ اليومي الساعة 2 صباحاً
0 2 * * * /path/to/erp-system/backup.sh
```

### 2. تحديث النظام
```bash
# تحديث الصور
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# تشغيل migrations إذا لزم
docker-compose -f docker-compose.prod.yml exec laravel.test php artisan migrate
```

### 3. مراقبة الأداء
```bash
# مراقبة استخدام الموارد
docker stats

# فحص قاعدة البيانات
docker-compose -f docker-compose.prod.yml exec db mysqladmin processlist -u root -p
```

## استكشاف الأخطاء الشائعة

### مشكلة: فشل في بدء الخدمات
```bash
# تحقق من السجلات
docker-compose -f docker-compose.prod.yml logs

# إعادة بناء
docker-compose -f docker-compose.prod.yml build --no-cache
```

### مشكلة: خطأ في قاعدة البيانات
```bash
# التحقق من متغيرات البيئة
docker-compose -f docker-compose.prod.yml exec laravel.test env | grep DB

# اختبار الاتصال
docker-compose -f docker-compose.prod.yml exec laravel.test php artisan tinker
```

### مشكلة: مشاكل SSL
```bash
# اختبار الشهادات
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# فحص تكوين Nginx
docker-compose -f docker-compose.prod.yml exec web nginx -t
```

## قائمة المراجعة قبل الإطلاق
- [ ] نسخ ملف .env وتعديل القيم
- [ ] إعداد شهادات SSL
- [ ] اختبار docker-compose.prod.yml محلياً
- [ ] إعداد النسخ الاحتياطي
- [ ] تكوين مراقبة السجلات
- [ ] اختبار الاستعادة من النسخ الاحتياطي
- [ ] إعداد firewall وأمان الخادم
- [ ] اختبار الأداء تحت ضغط
- [ ] توثيق كلمات المرور والمفاتيح

## الدعم والصيانة
- راقب السجلات بانتظام
- قم بتحديث النظام شهرياً
- احتفظ بنسخ احتياطية متعددة
- راقب استخدام الموارد ووسع حسب الحاجة