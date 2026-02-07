"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MapPin, Calendar, Users as UsersIcon } from "lucide-react";

export default function AdminEvents() {
    const events = [
        { id: 1, title: "Dubai Leadership Summit", city: "Dubai", date: "May 24-27, 2024", attendees: 145, status: "Open" },
        { id: 2, title: "New York Diplomacy Forum", city: "New York", date: "July 12-15, 2024", attendees: 89, status: "Waitlist" },
        { id: 3, title: "Istanbul Diplomacy Summit", city: "Istanbul", date: "Sept 18-21, 2024", attendees: 0, status: "Planning" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                    <p className="text-gray-500">Create and manage upcoming summits.</p>
                </div>
                <Button variant="default" className="bg-brand flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Event
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-32 bg-slate-100 flex items-center justify-center border-b italic text-gray-400">
                            Event Cover Image
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${event.status === 'Open' ? 'bg-green-100 text-green-700' :
                                    event.status === 'Waitlist' ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {event.status}
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-1.5 text-gray-400 hover:text-brand transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-4">{event.title}</h3>

                            <div className="space-y-3 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.city}</div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {event.date}</div>
                                <div className="flex items-center gap-2"><UsersIcon className="w-4 h-4" /> {event.attendees} Registered</div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">Manage Tickets</Button>
                                <Button variant="outline" size="sm" className="flex-1">Itinerary</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

