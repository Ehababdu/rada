import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MartyrsActionsProps {
    canCreate: boolean;
}

export const MartyrsActions = React.memo<MartyrsActionsProps>(
    ({ canCreate }) => {
        const { t } = useTranslation();

        return (
            <>
                {/* Create Button */}
                {canCreate && (
                    <Button asChild className="transition-all hover:scale-105">
                        <Link href="/martyrs/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('martyrs.create')}
                        </Link>
                    </Button>
                )}
            </>
        );
    },
);
