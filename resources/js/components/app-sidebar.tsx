import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, ShoppingCart, Users, Package, Building2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Transaksi',
        href: '/transaksi',
        icon: ShoppingCart,
    },
];

const dataMasterItems: NavItem[] = [
    {
        title: 'Admin',
        href: '/admin/users',
        icon: Building2,
    },
    {
        title: 'Pelanggan',
        href: '/admin/pelanggan',
        icon: Users,
    },
    {
        title: 'Produk',
        href: '/admin/produk',
        icon: Package,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                <div className="px-3 py-2">
                    <div className="h-px bg-sidebar-border" />
                </div>
                
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Data Master</SidebarGroupLabel>
                    <SidebarMenu>
                        {dataMasterItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="mr-2 size-4" />}
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}