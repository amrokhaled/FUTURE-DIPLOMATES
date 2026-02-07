"use client";

import { useEffect, useState } from "react";
import {
    Users,
    ClipboardList,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Application {
    id: string;
    attendee_name: string;
    attendee_email: string;
    attendee_nationality: string;
    payment_status: string;
    package_type: string;
    amount: number;
    created_at: string;
}

export default function AdminOverview() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error('Error fetching applications:', error);
            } else {
                setApplications(data || []);
            }

            // Get counts
            const { count: total } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true });

            const { count: pending } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('payment_status', 'pending');

            const { count: approved } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('payment_status', 'approved');

            const { count: rejected } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('payment_status', 'rejected');

            setStats({
                total: total || 0,
                pending: pending || 0,
                approved: approved || 0,
                rejected: rejected || 0
            });

            setLoading(false);
        }

        fetchData();
    }, []);

    const kpis = [
        { label: "Total Applications", value: stats.total.toString(), icon: ClipboardList, color: "brand" },
        { label: "Pending Review", value: stats.pending.toString(), icon: Users, color: "yellow" },
        { label: "Approved", value: stats.approved.toString(), icon: TrendingUp, color: "green" },
        { label: "Rejected", value: stats.rejected.toString(), icon: Users, color: "red" },
    ];

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Future Diplomats Cairo Edition 2026</p>
                </div>
                <Button variant="default" className="bg-brand" asChild>
                    <Link href="/admin/applications">View All Applications</Link>
                </Button>
            </div>

            {/* KPI Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpis.map((kpi, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600`}>
                                    <kpi.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900">{kpi.value}</h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Recent Applications */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-lg">Recent Applications</h3>
                    <Button variant="ghost" size="sm" className="text-brand" asChild>
                        <Link href="/admin/applications">View All <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-12 text-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No applications yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-6 py-3">Applicant</th>
                                    <th className="px-6 py-3">Nationality</th>
                                    <th className="px-6 py-3">Package</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{app.attendee_name || 'N/A'}</p>
                                                <p className="text-xs text-gray-400">{app.attendee_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {app.attendee_nationality || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize">{app.package_type || 'standard'}</span>
                                            <span className="text-gray-400 text-xs ml-1">(${app.amount || 0})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(app.payment_status)}`}>
                                                {app.payment_status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {app.created_at ? formatDate(app.created_at) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href="/admin/applications"
                                                className="p-2 text-gray-400 hover:text-gray-600 inline-block"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
