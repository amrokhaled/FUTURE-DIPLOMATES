"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Globe,
    LogOut,
    Menu,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            try {
                console.log("Admin Layout: Checking auth...");
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error("Admin Layout: Auth error:", error);
                    router.push('/login?next=/admin');
                    return;
                }

                console.log("Admin Layout: User found:", user?.email);

                const ADMIN_EMAILS = ['meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com', 'admin@futurediplomates.com'];

                if (!user) {
                    console.log("Admin Check: No user found, redirecting to login");
                    router.push('/login?next=/admin');
                    return;
                }

                if (user.email && !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
                    console.log("Admin Check: User email not authorized:", user.email);
                    router.push('/'); // Or a dedicated "Unauthorized" page
                    return;
                }

                console.log("Admin Check: Authorized as", user.email);
            } catch (err) {
                console.error("Admin Layout: Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }
        checkAdmin();
    }, [supabase, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>;
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Applications', href: '/admin/applications', icon: Users },
        { name: 'Summits (CMS)', href: '/admin/summits', icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-brand-400" />
                    <div>
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                        <p className="text-xs text-slate-400">Future Diplomats</p>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/');
                        }}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
                <div className="md:hidden p-4 bg-white border-b flex justify-between items-center">
                    <span className="font-bold text-gray-900">Admin Dashboard</span>
                    <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
