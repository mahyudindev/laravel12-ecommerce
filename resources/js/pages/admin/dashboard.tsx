import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="mb-2 text-lg font-semibold">Admin Tools</h2>
                        <p className="text-muted-foreground">Manage system settings and configurations</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="mb-2 text-lg font-semibold">User Management</h2>
                        <p className="text-muted-foreground">Manage users and their permissions</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="mb-2 text-lg font-semibold">System Status</h2>
                        <p className="text-muted-foreground">View system health and metrics</p>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border p-4">
                    <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                    <div className="grid h-full place-items-center">
                        <p className="text-muted-foreground">Recent admin activities will appear here</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
