-- إعداد قاعدة البيانات الأولي للإنتاج
-- سيتم تشغيل هذا الملف عند إنشاء الحاوية لأول مرة

-- إنشاء قاعدة البيانات إذا لم تكن موجودة
CREATE DATABASE IF NOT EXISTS erp_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- إنشاء المستخدم
CREATE USER IF NOT EXISTS 'erpuser_prod'@'%' IDENTIFIED BY 'secure_password_change_me';

-- منح الصلاحيات
GRANT ALL PRIVILEGES ON erp_prod.* TO 'erpuser_prod'@'%';

-- تحديث صلاحيات النظام
FLUSH PRIVILEGES;