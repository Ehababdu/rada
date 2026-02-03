import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

interface MartyrsDeleteDialogProps {
    deleteOpen: boolean;
    setDeleteOpen: (open: boolean) => void;
    isDeleting: boolean;
    handleDelete: () => void;
}

export function MartyrsDeleteDialog({
    deleteOpen,
    setDeleteOpen,
    isDeleting,
    handleDelete,
}: MartyrsDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('martyrs.confirm_delete')}</AlertDialogTitle>
                    <AlertDialogDescription className="text-destructive">
                        {t('martyrs.delete_warning_message') ||
                            'This action cannot be undone. This will permanently delete the martyr record.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isDeleting ? t('deleting') : t('delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}