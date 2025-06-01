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
                    slides={[
                        {
                            id: 1,
                            image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200',
                            title: 'Up to 10% off Voucher',
                            description: 'Shop the latest iPhone 14 Series with exclusive discounts',
                            link: '/products/iphone'
                        },
                        {
                            id: 2,
                            image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1200',
                            title: 'Summer Collection',
                            description: 'Discover our new summer tech lineup with special offers',
                            link: '/products/summer'
                        },
                        {
                            id: 3,
                            image: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?q=80&w=1200',
                            title: 'Gaming Accessories',
                            description: 'Level up your gaming experience with premium accessories',
                            link: '/products/gaming'
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
