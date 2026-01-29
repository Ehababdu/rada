import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import BaseLayout from '@/layouts/BaseLayout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <BaseLayout>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                <div>{children}</div>
            </AppLayoutTemplate>
        </BaseLayout>
    );
}
