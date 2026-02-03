import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, EyeIcon, TrashIcon, UserIcon, FileTextIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Index({ activities, filters }) {
    const getEventColor = (event) => {
        switch (event) {
            case 'created': return 'bg-green-100 text-green-800';
            case 'updated': return 'bg-blue-100 text-blue-800';
            case 'deleted': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getModelIcon = (model) => {
        switch (model) {
            case 'User': return <UserIcon className="h-4 w-4" />;
            case 'Martyr': return <FileTextIcon className="h-4 w-4" />;
            default: return <FileTextIcon className="h-4 w-4" />;
        }
    };

    return (
        <>
            <Head title="سجل الأنشطة" />

            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">سجل الأنشطة</h1>
                        <p className="text-muted-foreground">
                            مراقبة جميع الأنشطة والتغييرات في النظام
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>البحث والفلترة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <Input
                                    placeholder="البحث في الوصف..."
                                    value={filters.search || ''}
                                    onChange={(e) => {
                                        const url = new URL(window.location);
                                        url.searchParams.set('search', e.target.value);
                                        window.location.href = url.toString();
                                    }}
                                />
                            </div>
                            <div>
                                <Select
                                    value={filters.model || 'all'}
                                    onValueChange={(value) => {
                                        const url = new URL(window.location);
                                        if (value && value !== 'all') {
                                            url.searchParams.set('model', value);
                                        } else {
                                            url.searchParams.delete('model');
                                        }
                                        window.location.href = url.toString();
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="النموذج" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">الكل</SelectItem>
                                        <SelectItem value="User">المستخدمين</SelectItem>
                                        <SelectItem value="Martyr">الشهداء</SelectItem>
                                        <SelectItem value="Bank">البنوك</SelectItem>
                                        <SelectItem value="Attachment">المرفقات</SelectItem>
                                        <SelectItem value="Alert">التنبيهات</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Input
                                    placeholder="المستخدم..."
                                    value={filters.user || ''}
                                    onChange={(e) => {
                                        const url = new URL(window.location);
                                        url.searchParams.set('user', e.target.value);
                                        window.location.href = url.toString();
                                    }}
                                />
                            </div>
                            <div>
                                <Input
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => {
                                        const url = new URL(window.location);
                                        url.searchParams.set('date_from', e.target.value);
                                        window.location.href = url.toString();
                                    }}
                                />
                            </div>
                            <div>
                                <Input
                                    type="date"
                                    value={filters.date_to || ''}
                                    onChange={(e) => {
                                        const url = new URL(window.location);
                                        url.searchParams.set('date_to', e.target.value);
                                        window.location.href = url.toString();
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activities Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>الأنشطة ({activities.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>النوع</TableHead>
                                    <TableHead>الوصف</TableHead>
                                    <TableHead>النموذج</TableHead>
                                    <TableHead>المستخدم</TableHead>
                                    <TableHead>التاريخ</TableHead>
                                    <TableHead>الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.data.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>
                                            <Badge className={getEventColor(activity.event)}>
                                                {activity.event === 'created' && 'تم الإنشاء'}
                                                {activity.event === 'updated' && 'تم التحديث'}
                                                {activity.event === 'deleted' && 'تم الحذف'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {activity.description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getModelIcon(activity.subject_type)}
                                                <span>{activity.subject_type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {activity.causer_name ? (
                                                <span>{activity.causer_name}</span>
                                            ) : (
                                                <span className="text-muted-foreground">غير محدد</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <CalendarIcon className="h-3 w-3" />
                                                {activity.created_at}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/activity-log/${activity.id}`}>
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {activities.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    عرض {activities.from} إلى {activities.to} من أصل {activities.total} نتيجة
                                </div>
                                <div className="flex items-center gap-2">
                                    {activities.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url}>
                                                    {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                                </Link>
                                            ) : (
                                                <span>{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}