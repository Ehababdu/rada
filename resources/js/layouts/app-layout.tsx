import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import BaseLayout from '@/layouts/BaseLayout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    return (
        <BaseLayout>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                <div>{children}</div>
            </AppLayoutTemplate>
        </BaseLayout>
    );
}
