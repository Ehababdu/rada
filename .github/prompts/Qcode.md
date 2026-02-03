---
agent: prompt-fixer
title: تحسين طلب إعداد نظام ضمان جودة الكود لمشروع Laravel مع React
description: تحسين طلب إعداد نظام ضمان جودة الكود (Code Quality Suite) لمشروع Laravel مع React (Inertia.js) ليكون أكثر وضوحاً وشمولية.
tags: ['prompt-fixer', 'code-quality', 'laravel', 'react', 'inertiajs
---


“أعمل حالياً على مشروع Laravel مع React (Inertia.js)، وأريد منك إعداد نظام متكامل لضمان جودة الكود (Code Quality Suite) مشابه لقوة npm run lint وعلى مستوى Production.

المطلوب منك تنفيذ الخطوات التالية بالترتيب الصحيح:
	•	الجانب الخلفي (Laravel):
	•	تثبيت وإعداد Laravel Pint باستخدام Laravel preset لتنسيق الكود.
	•	تثبيت وإعداد Larastan (المستوى 5 كبداية) للتحليل المنطقي العميق (Static Analysis).
	•	الجانب الأمامي (React):
	•	تثبيت وإعداد ESLint مع إضافات React و React Hooks.
	•	تثبيت وإعداد Prettier لتوحيد التنسيق.
	•	في حال استخدام TypeScript، قم بتفعيل strict mode وإضافة فحص الأنواع (type-check).
	•	الاختبارات:
	•	ربط PHPUnit وتشغيله ضمن نظام الفحص.
	•	(اختياري) إعداد تقارير Code Coverage.
	•	الأتمتة:
	•	إضافة scripts داخل package.json تجمع جميع الأدوات
بحيث يمكن تشغيل فحص كامل للمشروع عبر أمر واحد مثل:
npm run check-all
	•	ترتيب التنفيذ يكون:
(Lint → Format → Static Analysis → Tests)
	•	Git Hooks (اختياري):
	•	اقترح استخدام Husky لمنع الـ Commit في حال وجود أخطاء.
	•	CI/CD (اختياري):
	•	اقترح إعداد GitHub Actions لتشغيل check-all عند Pull Request.
	•	Best Practices:
	•	إعداد ملفات ignore المناسبة (eslint, prettier, vendor, node_modules).
	•	الالتزام بالمعايير القياسية الخاصة بـ Laravel و React.

يرجى تزويدي بجميع الأوامر والملفات البرمجية اللازمة.”

⸻
