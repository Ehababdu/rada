<?php

namespace App\Console\Commands;

use App\Models\SystemPage;
use Illuminate\Console\Command;

class SyncSystemPages extends Command
{
    protected $signature = 'app:sync-system-pages';

    protected $description = 'Sync system pages to Meilisearch index';

    public function handle()
    {
        $this->info('Starting system pages sync...');

        // Define system pages
        $pages = [
            ['id' => 1, 'title' => 'لوحة التحكم', 'route' => 'dashboard', 'group' => 'الرئيسية', 'icon' => 'LayoutGrid', 'permission' => null],
            ['id' => 2, 'title' => 'الشهداء', 'route' => 'martyrs.index', 'group' => 'إدارة الشهداء والمفقودين', 'icon' => 'Users', 'permission' => 'view martyrs'],
            ['id' => 3, 'title' => 'الترفيعات', 'route' => 'promotions.index', 'group' => 'إدارة الشهداء والمفقودين', 'icon' => 'Award', 'permission' => 'view promotions'],
            ['id' => 4, 'title' => 'التعويضات', 'route' => 'compensations.index', 'group' => 'إدارة الشهداء والمفقودين', 'icon' => 'DollarSign', 'permission' => 'view compensations'],
            ['id' => 5, 'title' => 'جهات العمل', 'route' => 'employers.index', 'group' => 'إدارة جهات العمل', 'icon' => 'Building', 'permission' => 'view employers'],
            ['id' => 6, 'title' => 'الحالات الوظيفية', 'route' => 'employment-statuses.index', 'group' => 'إدارة جهات العمل', 'icon' => 'Briefcase', 'permission' => 'view employment statuses'],
            ['id' => 7, 'title' => 'الدرجات الوظيفية', 'route' => 'job-grades.index', 'group' => 'إدارة جهات العمل', 'icon' => 'GraduationCap', 'permission' => 'view job grades'],
            ['id' => 8, 'title' => 'الرتب العسكرية', 'route' => 'military-ranks.index', 'group' => 'الرتب والعلاوات', 'icon' => 'Shield', 'permission' => 'view military ranks'],
            ['id' => 9, 'title' => 'المصارف', 'route' => 'banks.index', 'group' => 'الرتب والعلاوات', 'icon' => 'Building2', 'permission' => 'view banks'],
            ['id' => 10, 'title' => 'أنواع المرفقات', 'route' => 'attachment-types.index', 'group' => 'إدارة النظام', 'icon' => 'FileText', 'permission' => 'view attachment types'],
            ['id' => 11, 'title' => 'المستخدمين', 'route' => 'users.index', 'group' => 'إدارة النظام', 'icon' => 'UserCheck', 'permission' => 'view users'],
            ['id' => 12, 'title' => 'الصلاحيات', 'route' => 'permissions.index', 'group' => 'إدارة النظام', 'icon' => 'Lock', 'permission' => 'view permissions'],
            ['id' => 13, 'title' => 'الأدوار', 'route' => 'roles.index', 'group' => 'إدارة النظام', 'icon' => 'Shield', 'permission' => 'view roles'],
        ];

        foreach ($pages as $pageData) {
            SystemPage::updateOrCreate(
                ['id' => $pageData['id']],
                $pageData,
            );
        }

        $this->info('System pages synced successfully.');
    }
}
