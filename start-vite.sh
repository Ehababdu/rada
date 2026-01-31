#!/bin/bash

# تشغيل Vite كمستخدم root لتجنب مشاكل الصلاحيات
echo "🔄 بدء تشغيل Vite development server..."
docker exec -u root laravel.test npm run dev