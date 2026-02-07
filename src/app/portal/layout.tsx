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
    Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
    { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
    { name: "My Application", href: "/portal/applications", icon: ClipboardList },
    { name: "Documents", href: "/portal/documents", icon: FileText },
];

interface UserProfile {
    full_name: string;
    email: string;
}

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const supabase = createClient();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        async function getUser() {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser) {
                    // Not logged in - redirect to home
                    window.location.href = '/';
                    return;
                }

                setUser({
                    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email || ''
                });
            } catch (err) {
                console.log('Auth error:', err);
            }
            setLoading(false);
        }

        // Timeout fallback
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 3000);

        getUser().finally(() => clearTimeout(timeout));
    }, [supabase]);

    const handleLogout = async () => {
        setLoggingOut(true);
        // Sign out async but don't wait for it
        supabase.auth.signOut().catch(() => { });
        // Redirect immediately
        window.location.href = '/';
    };

    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-brand to-brand-600 bg-clip-text text-transparent">
                            Diplomacy Portal
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand-50 text-brand"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-brand"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-medium">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user?.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        {loggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        {loggingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="flex-1">
                <header className="md:hidden bg-white border-b p-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-bold text-brand">
                            Diplomacy Portal
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 hover:text-red-600"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
