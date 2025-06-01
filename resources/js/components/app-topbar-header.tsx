import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Search, ShoppingCart, Heart, User, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AppLogo from '@/components/app-logo';

export function AppTopbarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage().props as any;
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };
    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-950">
            <div className="w-full px-4">
                <div className="flex h-16 items-center justify-between py-2">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-6">
                        <Link href="/">
                            <AppLogo />
                        </Link>
                        <nav className="hidden md:flex space-x-6">
                            <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
                            <Link href="/products" className="text-sm font-medium hover:text-primary">Products</Link>
                            <Link href="/categories" className="text-sm font-medium hover:text-primary">Categories</Link>
                            <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
                        </nav>
                    </div>

                    {/* Search and User Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:flex items-center">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-64 h-9 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-700"
                            />
                            <button className="absolute right-3 text-gray-400 hover:text-gray-600">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                        <button className="relative text-gray-700 hover:text-primary dark:text-gray-300">
                            <Heart className="h-5 w-5" />
                        </button>
                        <button className="relative text-gray-700 hover:text-primary dark:text-gray-300">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">3</span>
                        </button>
                        
                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                className="flex items-center space-x-2 rounded-full border border-gray-300 bg-gray-50 p-1 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={toggleProfileDropdown}
                            >
                                {auth?.user?.profile_photo_url ? (
                                    <img src={auth.user.profile_photo_url} alt="Profile" className="h-7 w-7 rounded-full" />
                                ) : (
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                    </div>
                                )}
                            </button>
                            
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
                                    <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                        <p className="font-medium">{auth?.user?.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{auth?.user?.email}</p>
                                    </div>
                                    <Link 
                                        href="/settings/profile" 
                                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                    <Link 
                                        href="/logout" 
                                        method="post" 
                                        as="button" 
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Optional Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-2 px-4">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            )}
        </header>
    );
}
