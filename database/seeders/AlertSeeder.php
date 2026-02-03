<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Database\Seeder;

class AlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return;
        }

        $alerts = [
            [
                'title' => 'تحديث في رتبة الشهيد #2041',
                'message' => 'تم تحديث رتبة الشهيد رقم 2041 من رتبة ملازم إلى رتبة نقيب. يرجى مراجعة التفاصيل والتأكد من صحة البيانات.',
                'type' => 'info',
                'data' => ['martyr_id' => 2041, 'old_rank' => 'ملازم', 'new_rank' => 'نقيب'],
            ],
            [
                'title' => 'تنبيه: ملفات تحتاج مراجعة',
                'message' => 'يوجد 15 ملف شهيد تحتاج إلى مراجعة عاجلة. الملفات المعلقة منذ أكثر من 30 يوماً.',
                'type' => 'warning',
                'data' => ['pending_files' => 15, 'days_overdue' => 30],
            ],
            [
                'title' => 'تم إكمال ترقية الشهيد #1503',
                'message' => 'تمت الموافقة على ترقية الشهيد رقم 1503 بنجاح. تم تحديث البيانات في النظام.',
                'type' => 'success',
                'data' => ['martyr_id' => 1503, 'promotion_type' => 'استثنائية'],
            ],
            [
                'title' => 'خطأ في معالجة البيانات',
                'message' => 'حدث خطأ أثناء معالجة بيانات الشهداء. يرجى التحقق من صحة البيانات المدخلة.',
                'type' => 'error',
                'data' => ['error_code' => 'DATA_PROCESSING_ERROR', 'affected_records' => 5],
            ],
            [
                'title' => 'تحديث في بيانات البنك',
                'message' => 'تم تحديث بيانات مصرف الراجحي. يرجى التحقق من الحسابات المرتبطة.',
                'type' => 'info',
                'data' => ['bank_id' => 1, 'bank_name' => 'مصرف الراجحي'],
            ],
            [
                'title' => 'تنبيه أمني',
                'message' => 'تم اكتشاف محاولة دخول غير مصرح بها. تم حظر عنوان IP المشبوه.',
                'type' => 'warning',
                'data' => ['ip_address' => '192.168.1.100', 'attempts' => 5],
            ],
        ];

        foreach ($users as $user) {
            foreach ($alerts as $index => $alertData) {
                Alert::create([
                    'title' => $alertData['title'],
                    'message' => $alertData['message'],
                    'type' => $alertData['type'],
                    'user_id' => $user->id,
                    'data' => $alertData['data'],
                    'read_at' => $index < 2 ? now() : null, // Mark first 2 as read
                    'created_at' => now()->subDays(rand(0, 7)),
                ]);
            }
        }
    }
}
