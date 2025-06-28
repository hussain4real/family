import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Banknote, BookOpen, Currency, CurrencyIcon, Folder, HandCoins, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { canAccessAdmin } from '@/lib/permissions';

/**
 * Main navigation items configuration
 * Items are filtered based on user permissions in the AppSidebar component
 */
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Admin',
        href: '/admin/contributions',
        icon: HandCoins,
        // This item is filtered by permission in AppSidebar component
    },
    {
        title: 'Contributions',
        href: '/contributions',
        icon: Banknote,
        isActive: true, // Assuming this is the active page
    },
    // {
    //     title: 'Users',
    //     href: '/users',
    //     icon: Folder,
    // },
    // {
    //     title: 'Categories',
    //     href: '/categories',
    //     icon: Folder,
    // }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    // Filter navigation items based on user permissions
    const filteredNavItems = mainNavItems.filter(item => {
        // Show dashboard to all authenticated users
        if (item.href === '/dashboard') {
            return true;
        }

        // Show admin menu only to users with admin access
        if (item.href === '/admin/contributions') {
            return canAccessAdmin(auth);
        }

        // Show contributions to all authenticated users
        if (item.href === '/contributions') {
            return true;
        }

        // Default: show the item
        return true;
    });

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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
