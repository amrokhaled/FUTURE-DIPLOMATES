"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, Loader2, CheckCircle, AlertCircle, Plus, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Application {
    id: string;
    full_name?: string;
    email?: string;
    program_name?: string;
    status: string;
    created_at?: string;
    submitted_at?: string;
}

export default function ApplicationsPage() {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const supabase = createClient();
    const ADMIN_EMAILS = ['meto.khaled011@gmail.com', 'amrokhaled9603@gmail.com'];

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const admin = ADMIN_EMAILS.includes(user.email || '');
                    setIsAdmin(admin);

                    // Admin sees all applications, regular user sees their own
                    try {
                        const query = admin
                            ? supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(50)
                            : supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

                        const { data } = await query;
                        if (data) setApplications(data);
                    } catch (err) {
                        console.log('Applications fetch failed:', err);
                    }
                }
            } catch (err) {
                console.log('Error:', err);
            }
            setLoading(false);
        }

        const timeout = setTimeout(() => setLoading(false), 3000);
        fetchData().finally(() => clearTimeout(timeout));
    }, [supabase]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Clock className="w-5 h-5 text-yellow-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        {isAdmin ? (
                            <>
                                <Users className="w-8 h-8 text-brand" />
                                All Applications
                            </>
                        ) : (
                            'My Applications'
                        )}
                    </h1>
                    <p className="text-gray-500">
                        {isAdmin
                            ? `Viewing all ${applications.length} applications.`
                            : 'Track your program applications and their status.'}
                    </p>
                </div>
                <Link href="/register">
                    <Button variant="gold">
                        <Plus className="w-4 h-4 mr-2" />
                        New Application
                    </Button>
                </Link>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border">
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="bg-white p-4 rounded-xl border">
                    <p className="text-2xl font-bold text-yellow-600">{applications.filter(a => a.status === 'pending').length}</p>
                    <p className="text-sm text-gray-500">Pending</p>
                </div>
                <div className="bg-white p-4 rounded-xl border">
                    <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</p>
                    <p className="text-sm text-gray-500">Approved</p>
                </div>
                <div className="bg-white p-4 rounded-xl border">
                    <p className="text-2xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
                    <p className="text-sm text-gray-500">Rejected</p>
                </div>
            </div>

            {/* Applications List */}
            {applications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border">
                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500 mb-6">Start by registering for Cairo 2026.</p>
                    <Link href="/register">
                        <Button variant="gold">Register Now</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border overflow-hidden">
                    <div className="divide-y">
                        {applications.map((app) => (
                            <div key={app.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gray-100 rounded-xl">
                                        {getStatusIcon(app.status)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {isAdmin ? (app.full_name || app.email || 'Unknown') : (app.program_name || 'Cairo 2026')}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {isAdmin && app.email && <span className="block">{app.email}</span>}
                                            Submitted: {new Date(app.created_at || app.submitted_at || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(app.status)}`}>
                                    {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
