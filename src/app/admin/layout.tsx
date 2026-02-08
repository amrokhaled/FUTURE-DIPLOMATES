"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, Users, LogOut, Shield } from "lucide-react";
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
    const [adminEmail, setAdminEmail] = useState("admin@futurediplomates.com");
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email) {
                setAdminEmail(session.user.email);
            }
        });
    }, [supabase]);

    const handleLogout = () => {
        supabase.auth.signOut().catch(() => { });
        window.location.href = '/admin-login';
    };

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
