import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppTopbarHeader } from '@/components/app-topbar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppTopbarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="header">
            <AppContent variant="header">
                <AppTopbarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
