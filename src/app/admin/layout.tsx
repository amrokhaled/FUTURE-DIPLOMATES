"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, Users, LogOut, Loader2, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Applications", href: "/admin/applications", icon: Users },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        let isMounted = true;

        async function checkAdmin() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    if (isMounted) router.push('/admin-login');
                    return;
                }

                // Hardcoded fallback for reliability
                const FALLBACK_ADMINS = ['admin@futurediplomates.com', 'meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com'];
                const userEmail = (user.email || '').toLowerCase();

                if (FALLBACK_ADMINS.includes(userEmail)) {
                    if (isMounted) {
                        setAdminEmail(user.email || '');
                        setIsAdmin(true);
                        setLoading(false);
                    }
                    return;
                }

                // Check if user is admin in database
                const { data: adminUser, error: dbError } = await supabase
                    .from('admin_users')
                    .select('id, email')
                    .eq('user_id', user.id)
                    .single();

                if (dbError || !adminUser) {
                    console.log('Admin DB check failed or not found:', dbError);
                    if (isMounted) {
                        supabase.auth.signOut().catch(() => { });
                        router.push('/admin-login?error=unauthorized');
                    }
                    return;
                }

                if (isMounted) {
                    setAdminEmail(adminUser.email || user.email || '');
                    setIsAdmin(true);
                    setLoading(false);
                }
            } catch (err) {
                console.log('Admin check error:', err);
                if (isMounted) router.push('/admin-login?error=check_failed');
            }
        }

        // 8 second timeout - slightly longer for reliability
        const timeout = setTimeout(() => {
            if (loading && isMounted) {
                console.log('Admin check timed out');
                router.push('/admin-login?error=timeout');
            }
        }, 8000);

        checkAdmin();

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [supabase, router]);

    const handleLogout = () => {
        supabase.auth.signOut().catch(() => { });
        window.location.href = '/admin-login';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-4" />
                    <p className="text-gray-500">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 w-64 h-full bg-slate-900 text-white p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Admin Panel</h1>
                        <p className="text-xs text-slate-400">Cairo 2026</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-brand text-white"
                                    : "text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-slate-800 rounded-lg p-3 mb-3">
                        <p className="text-xs text-slate-400">Logged in as</p>
                        <p className="text-sm font-medium truncate">{adminEmail}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">{children}</main>
        </div>
    );
}
