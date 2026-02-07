"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Clock, Loader2, CheckCircle, AlertCircle, Download, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Booking {
    id: string;
    booking_reference: string;
    package_type: string;
    payment_status: string;
    event: string;
    amount: number;
    created_at: string;
}

export default function PaymentsPage() {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: bookingsData } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (bookingsData) setBookings(bookingsData);
            }

            setLoading(false);
        }

        fetchData();
    }, [supabase]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'refunded': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'refunded': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Clock className="w-5 h-5 text-yellow-600" />;
        }
    };

    const totalPaid = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalPending = bookings.filter(b => b.payment_status === 'pending').reduce((sum, b) => sum + (b.amount || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-500">Track your payment history and invoices.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Paid</p>
                            <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <Receipt className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Payments Yet</h3>
                    <p className="text-gray-500">Your payment history will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="font-bold text-gray-900">Transaction History</h3>
                    </div>
                    <div className="divide-y">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gray-100 rounded-xl">
                                        {getStatusIcon(booking.payment_status)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{booking.event}</h4>
                                        <p className="text-sm text-gray-500">
                                            {new Date(booking.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Ref: {booking.booking_reference}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-lg">${(booking.amount || 0).toFixed(2)}</p>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(booking.payment_status)}`}>
                                            {booking.payment_status}
                                        </span>
                                    </div>
                                    {booking.payment_status === 'paid' && (
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-1" />
                                            Receipt
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
