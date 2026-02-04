#!/bin/bash

# سكريبت إعداد النظام
# استخدم --prod للإنتاج

if [ "$1" = "--prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.production"
    echo "إعداد بيئة الإنتاج..."
else
    COMPOSE_FILE="docker-compose.yml"
    ENV_FILE=".env"
    echo "إعداد بيئة التطوير..."
fi

# بناء الصورة
docker-compose -f $COMPOSE_FILE build

# تشغيل الخدمات
docker-compose -f $COMPOSE_FILE up -d

# تثبيت تبعيات npm إذا لزم الأمر (للتطوير فقط)
if [ "$1" != "--prod" ]; then
    docker-compose -f $COMPOSE_FILE exec laravel.test npm install
    docker-compose -f $COMPOSE_FILE exec laravel.test npm run dev
fi

# تشغيل المهام الأولية
docker-compose -f $COMPOSE_FILE exec laravel.test php artisan migrate --seed
docker-compose -f $COMPOSE_FILE exec laravel.test php artisan scout:index

echo "تم إعداد النظام بنجاح!"

# تشغيل npm build
vendor/bin/sail npm run build