import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Attachment } from '../types';

interface AttachmentActionsProps {
    attachment: Attachment;
    martyrId: number;
    canUpdate: boolean;
    canDelete: boolean;
    onDelete: (id: number) => void;
    t: (key: string) => string;
}

export function AttachmentActions({
    attachment,
    martyrId,
    canUpdate,
    canDelete,
    onDelete,
    t,
}: AttachmentActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">
                        {t('attachments.open_menu') || 'فتح القائمة'}
                    </span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link
                        href={`/martyrs/${martyrId}/attachments/${attachment.id}`}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        {t('attachments.show') || 'عرض'}
                    </Link>
                </DropdownMenuItem>
                {canUpdate && (
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/martyrs/${martyrId}/attachments/${attachment.id}/edit`}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('attachments.edit') || 'تعديل'}
                        </Link>
                    </DropdownMenuItem>
                )}
                {canDelete && (
                    <DropdownMenuItem
                        onSelect={() => onDelete(attachment.id)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('attachments.delete') || 'حذف'}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
