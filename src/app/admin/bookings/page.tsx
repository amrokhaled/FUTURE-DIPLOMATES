"use client";

import { Button } from "@/components/ui/button";
import { Download, Search, Filter, MoreHorizontal, Mail, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function AdminBookings() {
    const bookings = [
        { id: "BK001", user: "Alice Walker", email: "alice@example.com", event: "Dubai 2024", package: "Delegate", status: "Paid", date: "2024-03-15" },
        { id: "BK002", user: "Ahmed Hassan", email: "ahmed@example.com", event: "Dubai 2024", package: "VIP", status: "Pending", date: "2024-03-16" },
        { id: "BK003", user: "Chen Wei", email: "chen@example.com", event: "Dubai 2024", package: "Delegate", status: "Failed", date: "2024-03-14" },
        { id: "BK004", user: "Maria Garcia", email: "maria@example.com", event: "New York 2024", package: "Delegate", status: "Paid", date: "2024-03-12" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings & Attendees</h1>
                    <p className="text-gray-500">View and manage delegate registrations.</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                {/* Filters Bar */}
                <div className="p-4 border-b bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or reference..."
                            className="w-full bg-white border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Filter className="w-4 h-4" /> Filter
                        </Button>
                        <select className="bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand">
                            <option>All Events</option>
                            <option>Dubai 2024</option>
                            <option>New York 2024</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b">
                            <tr>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Delegate</th>
                                <th className="px-6 py-4">Summit</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-brand">{booking.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-gray-900">{booking.user}</p>
                                            <p className="text-xs text-gray-400">{booking.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium">{booking.event}</p>
                                            <p className="text-xs text-gray-500">{booking.package}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                            booking.status === 'Paid' ? "bg-green-100 text-green-700" :
                                                booking.status === 'Pending' ? "bg-brand-50 text-brand-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{booking.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand" title="Email Info"><Mail className="w-4 h-4" /></button>
                                            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-green-600" title="View Payment"><CreditCard className="w-4 h-4" /></button>
                                            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900"><MoreHorizontal className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
                    <p>Showing 4 of 342 registrations</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 px-2">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

