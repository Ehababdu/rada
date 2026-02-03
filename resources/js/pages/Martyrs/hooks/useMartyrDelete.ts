import { useToast } from '@/hooks/use-toast';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useMartyrDelete() {
    const { t } = useTranslation();
    const { toast } = useToast();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (deletingId) {
            setIsDeleting(true);
            try {
                await router.delete(`/martyrs/${deletingId}`, {
                    onSuccess: () => {
                        toast({
                            title: t('martyrs.deleted_successfully'),
                            variant: 'default',
                        });
                        setDeleteOpen(false);
                        setDeletingId(null);
                    },
                });
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return {
        deleteOpen,
        setDeleteOpen,
        deletingId,
        setDeletingId,
        isDeleting,
        handleDelete,
    };
}
