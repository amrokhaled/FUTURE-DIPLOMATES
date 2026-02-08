"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, FileCheck, DollarSign, Activity } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function loadStats() {
            // 1. Get total bookings
            const { count: bookingsCount, data, error } = await supabase
                .from('bookings')
                .select('*', { count: 'exact' });

            if (error) {
                console.error("Dashboard Stats Error:", error);
            }

            interface Booking {
                status: string;
                custom_amount: number | null;
            }
            const bookings = data as Booking[] | null;

            // 2. Calculate pending and revenue
            const pending = bookings?.filter(b => b.status === 'pending').length || 0;

            // Rough estimation - assume 750 for now if custom_amount is null
            // In reality we would strictly sum the paid amounts
            const revenue = bookings?.reduce((acc, curr) => acc + (curr.custom_amount || 750), 0) || 0;

            setStats({
                totalUsers: 0, // Profile count needs separate query or we assume 1 user per booking roughly
                totalBookings: bookingsCount || 0,
                pendingBookings: pending,
                totalRevenue: revenue
            });
            setLoading(false);
        }

        loadStats();
    }, [supabase]);

    if (loading) return <div>Loading stats...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Admin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
                    <p className="text-sm text-gray-500">Total Applications</p>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Activity className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</h3>
                    <p className="text-sm text-gray-500">Pending Review</p>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500">Estimated Revenue</p>
                </div>
            </div>
        </div>
    );
}
