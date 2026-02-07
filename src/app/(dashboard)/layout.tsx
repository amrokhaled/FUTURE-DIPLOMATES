"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    LogOut,
    ClipboardList,
    Loader2,
    Menu,
    X,
    Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Applications", href: "/applications", icon: ClipboardList },
    { name: "Documents", href: "/documents", icon: FileText },
];

interface UserProfile {
    full_name: string;
    email: string;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const supabase = createClient();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const ADMIN_EMAILS = ['meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com'];

    useEffect(() => {
        async function getUser() {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser) {
                    // Not logged in - redirect to home
                    window.location.href = '/login?error=unauthorized';
                    return;
                }

                const email = (authUser.email || '').toLowerCase();
                setUser({
                    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email || ''
                });

                if (ADMIN_EMAILS.some(e => e.toLowerCase() === email)) {
                    setIsAdmin(true);
                }

            } catch (err) {
                console.log('Auth check error:', err);
                // Force sign out if auth check fails weirdly
                supabase.auth.signOut().catch(() => { });
                window.location.href = '/login';
            }
            setLoading(false);
        }

        // 3 second timeout fallback
        const timeout = setTimeout(() => {
            if (loading) setLoading(false);
        }, 3000);

        getUser().finally(() => clearTimeout(timeout));
    }, [supabase]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            // clear supabase local storage keys
            for (const key of Object.keys(localStorage)) {
                if (key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            }

            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
            await Promise.race([
                supabase.auth.signOut(),
                timeoutPromise
            ]);
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            localStorage.clear();
            // Force reload to home page to clear all state
            window.location.href = '/';
        }
    };

    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'FD';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-4" />
                    <p className="text-gray-500">Loading your portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50 w-full">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                    <span className="font-bold text-gray-900">Diplomats Portal</span>
                </div>
                {isAdmin && <span className="text-xs bg-brand text-white px-2 py-1 rounded-full">Admin</span>}
            </div>

            {/* Sidebar - Desktop & Mobile Overlay */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            F
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 leading-tight">Future Diplomats</h1>
                            <p className="text-xs text-gray-500">Cairo 2026</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand-50 text-brand"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand flex items-center justify-center font-bold">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-gray-900">{user?.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
                        {loggingOut ? 'Signing out...' : 'Sign Out'}
                    </Button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
                {children}
            </main>
        </div>
    );
}
