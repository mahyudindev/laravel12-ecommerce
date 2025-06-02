import { HomeCarousel } from '@/components/home-carousel';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [];

export default function PelangganDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 bg-gray-50 dark:bg-gray-900">
                <HomeCarousel 
                    autoSlideInterval={2500}
                    slides={[
                        {
                            id: 1,
                            image: '/images/1.png',
                            title: 'Tas Tote Eksklusif',
                            description: 'Temukan gaya sempurna untuk aktivitas harianmu dengan koleksi terbaik kami',
                            link: '/products/tote-bag-1'
                        },
                        {
                            id: 2,
                            image: '/images/2.png',
                            title: 'Tren 2025',
                            description: 'Tampil stylish dengan desain terkini yang selalu up-to-date',
                            link: '/products/tote-bag-2'
                        },
                        {
                            id: 3,
                            image: '/images/3.png',
                            title: 'Edisi Spesial',
                            description: 'Koleksi terbatas dengan bahan premium dan desain eksklusif',
                            link: '/products/tote-bag-3'
                        },
                    ]}
                />
                
                <div className="px-6">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                    <h1 className="text-2xl font-bold">Welcome Back!</h1>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="mb-2 text-lg font-semibold">My Orders</h2>
                        <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="mb-2 text-lg font-semibold">Wishlist</h2>
                        <p className="text-gray-600 dark:text-gray-400">View your saved items</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="mb-2 text-lg font-semibold">Address Book</h2>
                        <p className="text-gray-600 dark:text-gray-400">Manage your addresses</p>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 min-h-[300px]">
                    <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                    <div className="grid h-full place-items-center pt-12">
                        <p className="text-gray-500 dark:text-gray-400">Your recent activities will appear here</p>
                    </div>
                </div>
                </div>
            </div>
        </AppLayout>
    );
}
