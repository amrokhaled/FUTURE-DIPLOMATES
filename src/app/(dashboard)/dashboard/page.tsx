"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    FileCheck,
    Download,
    Loader2,
    ClipboardList,
    Users,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function UserDashboard() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const supabase = createClient();

    const ADMIN_EMAILS = ['meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com'];

    useEffect(() => {
        async function init() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
                    setUserName(fullName);
                    setUserEmail(user.email || '');

                    // Case-insensitive email check with trim
                    const email = (user.email || '').toLowerCase().trim();
                    const isAdm = ADMIN_EMAILS.some(e => e.toLowerCase().trim() === email);
                    console.log('Admin Check:', { email, isAdm, admins: ADMIN_EMAILS });
                    setIsAdmin(isAdm);
                }
            } catch (e) {
                console.log('Init error:', e);
            }
            setLoading(false);
        }

        // Fast timeout - don't wait forever
        const timeout = setTimeout(() => setLoading(false), 2000);
        init().finally(() => clearTimeout(timeout));
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {userName.split(' ')[0]}!
                    {isAdmin && (
                        <span className="ml-3 text-sm bg-brand text-white px-3 py-1 rounded-full">Admin</span>
                    )}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isAdmin ? 'Manage applications and view registrations.' : 'Your dashboard for Cairo 2026.'}
                </p>
            </div>

            {/* Admin Section */}
            {isAdmin && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Admin Panel</h2>
                    </div>
                    <p className="text-slate-300 mb-4">Manage all applications and registrations.</p>
                    <div className="flex gap-3">
                        <Link href="/applications">
                            <Button className="bg-white text-slate-900 hover:bg-slate-100">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                View All Applications
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Event</p>
                            <p className="text-xl font-bold">Cairo 2026</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Calendar className="w-6 h-6 text-brand" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="text-xl font-bold">July 15-20</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                            <ClipboardList className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-xl font-bold">Cairo, Egypt</p>
                        </div>
                        <div className="p-3 bg-brand-50 rounded-xl">
                            <FileCheck className="w-6 h-6 text-brand-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white border rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link href="/register" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium">Register for Cairo 2026</span>
                            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </Link>
                        <Link href="/applications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ClipboardList className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">My Applications</span>
                            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </Link>
                        <Link href="/documents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FileCheck className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium">Documents</span>
                            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </Link>
                    </div>
                </div>

                {/* Event Card */}
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-2">Future Diplomats</h3>
                    <h4 className="text-2xl font-bold mb-2">Cairo Edition 2026</h4>
                    <p className="text-sm text-brand-100 mb-4">July 15-20, 2026 • Cairo, Egypt</p>
                    <p className="text-sm text-brand-100 mb-6">
                        Join future diplomats from around the world for an immersive experience in international relations.
                    </p>
                    <Link href="/register">
                        <Button className="w-full bg-white text-brand-600 hover:bg-brand-50">
                            Register Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
