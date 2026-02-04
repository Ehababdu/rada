#!/bin/bash

# سكريبت النسخ الاحتياطي للإنتاج
BACKUP_DIR="/var/backups/erp"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# نسخ احتياطي لقاعدة البيانات
docker-compose -f docker-compose.prod.yml exec -T db mysqldump -u erpuser_prod -p$DB_PASSWORD_PROD erp_prod > $BACKUP_DIR/db_backup_$DATE.sql

# نسخ احتياطي للملفات
docker cp laravel_prod:/var/www/html/storage $BACKUP_DIR/storage_$DATE

# ضغط النسخة
tar -czf $BACKUP_DIR/full_backup_$DATE.tar.gz -C $BACKUP_DIR db_backup_$DATE.sql storage_$DATE

# حذف الملفات المؤقتة
rm $BACKUP_DIR/db_backup_$DATE.sql
rm -rf $BACKUP_DIR/storage_$DATE

# الاحتفاظ بآخر 7 نسخ فقط
cd $BACKUP_DIR
ls -t *.tar.gz | tail -n +8 | xargs -r rm

echo "تم إنشاء النسخة الاحتياطية: $BACKUP_DIR/full_backup_$DATE.tar.gz"