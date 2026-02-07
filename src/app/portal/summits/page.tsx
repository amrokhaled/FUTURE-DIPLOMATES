"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2, MapPin, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Booking {
    id: string;
    booking_reference: string;
    package_type: string;
    payment_status: string;
    event: string;
    city_code: string;
    event_date: string;
    amount: number;
    attendee_name?: string;
    attendee_email?: string;
    attendee_phone?: string;
    attendee_nationality?: string;
    attendee_passport?: string;
    attendee_organization?: string;
}

export default function SummitsPage() {
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

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'refunded': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Summits</h1>
                    <p className="text-gray-500">Your registered summit events and conferences.</p>
                </div>
                <Link href="/register">
                    <Button variant="gold">
                        <Calendar className="w-4 h-4 mr-2" />
                        Register for Summit
                    </Button>
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Summit Registrations</h3>
                    <p className="text-gray-500 mb-6">Join our upcoming diplomatic summits and conferences.</p>
                    <Link href="/register">
                        <Button variant="gold">Browse Summits</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <div className="h-32 bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center relative">
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-bold">
                                    {booking.city_code || 'EVT'}
                                </div>
                                <Calendar className="w-12 h-12 text-white/80" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-lg">{booking.event}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(booking.payment_status)}`}>
                                        {booking.payment_status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {booking.event_date || 'Date TBA'}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {booking.package_type?.charAt(0).toUpperCase() + booking.package_type?.slice(1)} Package
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">
                                    Ref: {booking.booking_reference}
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="gold"
                                        size="sm"
                                        className="flex-1"
                                        disabled={booking.payment_status !== 'paid'}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Invitation
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="6 6 18 18" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Event</h3>
                                    <p className="text-lg font-bold text-gray-900">{selectedBooking.event}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Status</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedBooking.payment_status)}`}>
                                        {selectedBooking.payment_status.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Booking Reference</h3>
                                    <p className="font-mono text-gray-900">{selectedBooking.booking_reference}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Package</h3>
                                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.package_type}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Amount</h3>
                                    <p className="font-medium text-gray-900">${selectedBooking.amount}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Date</h3>
                                    <p className="font-medium text-gray-900">{selectedBooking.event_date}</p>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Attendee Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {selectedBooking.attendee_name && (
                                        <div>
                                            <span className="text-gray-500 block">Name:</span>
                                            <span className="font-medium">{selectedBooking.attendee_name}</span>
                                        </div>
                                    )}
                                    {selectedBooking.attendee_email && (
                                        <div>
                                            <span className="text-gray-500 block">Email:</span>
                                            <span className="font-medium">{selectedBooking.attendee_email}</span>
                                        </div>
                                    )}
                                    {selectedBooking.attendee_phone && (
                                        <div>
                                            <span className="text-gray-500 block">Phone:</span>
                                            <span className="font-medium">{selectedBooking.attendee_phone}</span>
                                        </div>
                                    )}
                                    {selectedBooking.attendee_nationality && (
                                        <div>
                                            <span className="text-gray-500 block">Nationality:</span>
                                            <span className="font-medium">{selectedBooking.attendee_nationality}</span>
                                        </div>
                                    )}
                                    {selectedBooking.attendee_passport && (
                                        <div>
                                            <span className="text-gray-500 block">Passport:</span>
                                            <span className="font-medium">{selectedBooking.attendee_passport}</span>
                                        </div>
                                    )}
                                    {selectedBooking.attendee_organization && (
                                        <div>
                                            <span className="text-gray-500 block">Organization:</span>
                                            <span className="font-medium">{selectedBooking.attendee_organization}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                            <Button
                                className="w-full"
                                onClick={() => setSelectedBooking(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
