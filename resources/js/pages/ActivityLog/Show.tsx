import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeftIcon, CalendarIcon, UserIcon, FileTextIcon, DatabaseIcon } from 'lucide-react';

export default function Show({ activity }) {
    const getEventColor = (event) => {
        switch (event) {
            case 'created': return 'bg-green-100 text-green-800';
            case 'updated': return 'bg-blue-100 text-blue-800';
            case 'deleted': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEventLabel = (event) => {
        switch (event) {
            case 'created': return 'تم الإنشاء';
            case 'updated': return 'تم التحديث';
            case 'deleted': return 'تم الحذف';
            default: return event;
        }
    };

    const renderChanges = (changes) => {
        if (!changes || (!changes.old && !changes.new)) {
            return <span className="text-muted-foreground">لا توجد تغييرات</span>;
        }

        return (
            <div className="space-y-2">
                {changes.old && Object.keys(changes.old).length > 0 && (
                    <div>
                        <h4 className="font-medium text-red-600 mb-1">القيم القديمة:</h4>
                        <pre className="bg-red-50 p-2 rounded text-sm overflow-x-auto">
                            {JSON.stringify(changes.old, null, 2)}
                        </pre>
                    </div>
                )}
                {changes.new && Object.keys(changes.new).length > 0 && (
                    <div>
                        <h4 className="font-medium text-green-600 mb-1">القيم الجديدة:</h4>
                        <pre className="bg-green-50 p-2 rounded text-sm overflow-x-auto">
                            {JSON.stringify(changes.new, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title={`تفاصيل النشاط #${activity.id}`} />

            <div className="container mx-auto py-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/activity-log">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            العودة للقائمة
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">تفاصيل النشاط</h1>
                        <p className="text-muted-foreground">
                            نشاط رقم #{activity.id}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileTextIcon className="h-5 w-5" />
                                    معلومات النشاط
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            نوع العملية
                                        </label>
                                        <div className="mt-1">
                                            <Badge className={getEventColor(activity.event)}>
                                                {getEventLabel(activity.event)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            النموذج
                                        </label>
                                        <div className="mt-1">
                                            <Badge variant="outline">
                                                {activity.subject_type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        الوصف
                                    </label>
                                    <p className="mt-1 text-sm">{activity.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            معرف السجل
                                        </label>
                                        <p className="mt-1 text-sm font-mono">{activity.subject_id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            تاريخ النشاط
                                        </label>
                                        <div className="mt-1 flex items-center gap-1 text-sm">
                                            <CalendarIcon className="h-3 w-3" />
                                            {activity.created_at}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Changes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DatabaseIcon className="h-5 w-5" />
                                    التغييرات
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderChanges(activity.changes)}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    المستخدم
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activity.causer_name ? (
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                الاسم
                                            </label>
                                            <p className="mt-1">{activity.causer_name}</p>
                                        </div>
                                        {activity.causer_email && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    البريد الإلكتروني
                                                </label>
                                                <p className="mt-1 text-sm font-mono">{activity.causer_email}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">غير محدد</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Properties */}
                        {activity.properties && Object.keys(activity.properties).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>خصائص إضافية</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                                        {JSON.stringify(activity.properties, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}