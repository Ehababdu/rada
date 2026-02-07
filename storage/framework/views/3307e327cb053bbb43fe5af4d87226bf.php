<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إيصال تعويض مالي</title>
    <style>
        /* Add an Arabic-capable font. Put the TTF in public/fonts and update the path if needed. */
        @font-face {
            font-family: 'Amiri';
            src: url("<?php echo e(public_path('fonts/Amiri-Regular.ttf')); ?>") format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        body {
            /* Fallback stack: prefers a dedicated Arabic font if available */
            font-family: 'Amiri', 'Noto Naskh Arabic', 'DejaVu Sans', sans-serif;
            direction: rtl;
            unicode-bidi: embed;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: right;
            margin: 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 20px;
            font-weight: bold;
            direction: rtl;
            unicode-bidi: embed;
        }
        .header h2 {
            margin: 5px 0;
            color: #333;
            font-size: 18px;
            font-weight: bold;
            direction: rtl;
            unicode-bidi: embed;
        }
        .header h3 {
            margin: 5px 0;
            color: #333;
            font-size: 16px;
            direction: rtl;
            unicode-bidi: embed;
        }
        .header h4 {
            margin: 5px 0;
            color: #333;
            font-size: 16px;
            font-weight: bold;
            direction: rtl;
            unicode-bidi: embed;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .content {
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-size: 18px;
        }
        .info-row {
            display: flex;
            /* Ensure labels sit on the right for RTL layout */
            flex-direction: row-reverse;
            margin-bottom: 8px;
            align-items: center;
        }
        .label {
            font-weight: bold;
            width: 200px;
            flex-shrink: 0;
            text-align: right;
        }
        .value {
            flex: 1;
            text-align: right;
        }
        .amount {
            font-size: 18px;
            font-weight: bold;
            color: #d32f2f;
            text-align: center;
            padding: 15px;
            border: 2px solid #d32f2f;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .signature {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>إيصال صرف تعويض مالي</h1>
        <h2>نظام إدارة الشهداء والمفقودين</h2>
        <h3>إدارة التعويضات</h3>
        <h4>المديرية العامة</h4>
        <p>رقم الإيصال: 2</p>
        <p>06/02/2026</p>
    </div>

    <div class="content">
        <div class="section">
            <h2>بيانات الشهيد</h2>
            <div class="info-row">
                <div class="label">الاسم الكامل:</div>
                <div class="value"><?php echo e($compensation->martyr->full_name); ?></div>
            </div>
            <div class="info-row">
                <div class="label">رقم الهوية الوطنية:</div>
                <div class="value"><?php echo e($compensation->martyr->national_id); ?></div>
            </div>
            <div class="info-row">
                <div class="label">الرتبة العسكرية:</div>
                <div class="value"><?php echo e($compensation->martyr->militaryRank?->name_ar ?? 'غير محدد'); ?></div>
            </div>
            <div class="info-row">
                <div class="label">حالة الوالدين:</div>
                <div class="value"><?php echo e($compensation->martyr->parentsStatus?->name_ar ?? 'غير محدد'); ?></div>
            </div>
            <div class="info-row">
                <div class="label">الحالة الاجتماعية:</div>
                <div class="value"><?php echo e($compensation->martyr->maritalStatus?->name_ar ?? 'غير محدد'); ?></div>
            </div>
            <div class="info-row">
                <div class="label">عدد الأطفال:</div>
                <div class="value"><?php echo e($compensation->martyr->children_count ?? 0); ?></div>
            </div>
        </div>

        <div class="section">
            <h2>بيانات المستلم</h2>
            <div class="info-row">
                <div class="label">اسم المستلم:</div>
                <div class="value"><?php echo e($compensation->recipient_name); ?></div>
            </div>
            <div class="info-row">
                <div class="label">رقم جواز السفر:</div>
                <div class="value"><?php echo e($compensation->recipient_passport_number); ?></div>
            </div>
        </div>

        <div class="section">
            <h2>تفاصيل التعويض</h2>
            <div class="info-row">
                <div class="label">تاريخ الاستلام:</div>
                <div class="value"><?php echo e($compensation->receipt_date->format('d/m/Y')); ?></div>
            </div>
            <div class="info-row">
                <div class="label">الأشهر المشمولة:</div>
                <div class="value">
                    <?php if($compensation->months): ?>
                        <?php echo e(implode('، ', array_map(function($month) {
                            $months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                            return $months[$month - 1] ?? $month;
                        }, $compensation->months))); ?>

                    <?php else: ?>
                        غير محدد
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <div class="amount">
            المبلغ المستلم: <?php echo e(number_format($compensation->amount, 2)); ?> ريال سعودي
        </div>
    </div>

    <div class="signature-section">
        <div class="signature">
            <div class="signature-line">توقيع المسؤول</div>
            <p>____________________</p>
        </div>
        <div class="signature">
            <div class="signature-line">توقيع المستلم</div>
            <p><?php echo e($compensation->recipient_name); ?></p>
        </div>
    </div>

    <div class="footer">
        <p>تم إصدار هذا الإيصال إلكترونياً من نظام إدارة الشهداء والمفقودين</p>
        <p>تاريخ الطباعة: <?php echo e(now()->format('d/m/Y H:i:s')); ?></p>
    </div>
</body>
</html><?php /**PATH /var/www/html/resources/views/pdf/compensation.blade.php ENDPATH**/ ?>