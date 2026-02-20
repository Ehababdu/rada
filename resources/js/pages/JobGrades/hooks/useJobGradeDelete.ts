import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseJobGradeDeleteReturn {
    handleDelete: (id: number) => void;
    isDeleting: boolean;
}

export function useJobGradeDelete(): UseJobGradeDeleteReturn {
    const { t } = useTranslation();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm(t('job_grades.confirm_delete'))) {
            setIsDeleting(true);
            router.delete(`/job-grades/${id}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    return {
        handleDelete,
        isDeleting,
    };
}