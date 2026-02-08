"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, DollarSign } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface Application {
    id: string;
    // Core user fields
    created_at: string;
    status: string;
    custom_amount?: number;
    admin_notes?: string;
    booking_reference?: string;

    // Attendee Details
    attendee_name?: string;
    attendee_email?: string;
    attendee_phone?: string;
    attendee_whatsapp?: string;
    attendee_nationality?: string;
    attendee_passport?: string;
    attendee_dob?: string;
    attendee_sex?: string;
    attendee_organization?: string;
    attendee_address?: string;
    tshirt_size?: string;
    referral_source?: string;
    ambassador_name?: string;
    reason_for_attending?: string;
    has_attended_before?: boolean;

    // Fallbacks
    full_name?: string;
    email?: string;
    is_paid?: boolean; // Payment tracking
    package_type?: string;

    // Funding & Accommodation
    payment_plan?: string;
    investment_amount?: string;
    accommodation?: boolean;
    referral_other?: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [price, setPrice] = useState<number>(750);

    const supabase = createClient();

    // Fetch Data
    async function loadApplications() {
        console.log("Fetching applications...");
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadApplications();
    }, []);

    // Update Status
    async function updateStatus(id: string, newStatus: string) {
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
        }
    }

    // Update Price
    async function updatePrice(id: string, amount: number) {
        const { error } = await supabase
            .from('bookings')
            .update({ custom_amount: amount })
            .eq('id', id);

        if (!error) {
            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, custom_amount: amount } : app
            ));
        }
    }

    // Update Payment Status
    async function updatePaymentStatus(id: string, isPaid: boolean) {
        const { error } = await supabase
            .from('bookings')
            .update({ is_paid: isPaid })
            .eq('id', id);

        if (!error) {
            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, is_paid: isPaid } : app
            ));
        }
    }

    // Update Notes
    async function updateNotes(id: string, notes: string) {
        const { error } = await supabase
            .from('bookings')
            .update({ admin_notes: notes })
            .eq('id', id);

        if (!error) {
            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, admin_notes: notes } : app
            ));
            alert('Notes saved successfully!');
        }
    }

    const filteredApps = applications.filter(app => {
        if (!searchTerm) return true; // Show all if search is empty
        const name = (app.attendee_name || app.full_name || '').toLowerCase();
        const email = (app.attendee_email || app.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || email.includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Applications Manager</h1>
                    <p className="text-slate-500">Manage statuses and custom pricing.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search applicants..."
                            className="pl-8 w-64"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Waitlist / Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">No applications found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="font-medium">{app.attendee_name || app.full_name || 'Unknown User'}</div>
                                        <div className="text-xs text-slate-500">{app.attendee_email || app.email}</div>
                                        <div className="text-xs text-slate-400">{app.booking_reference}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {app.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-slate-400" />
                                            <span className="font-bold">
                                                {app.custom_amount ? `$${app.custom_amount}` : '$750'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    setSelectedApp(app);
                                                }}>
                                                    Manage
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl">
                                                <DialogHeader className="border-b pb-4">
                                                    <DialogTitle className="text-xl font-bold text-slate-900">Application Management</DialogTitle>
                                                </DialogHeader>

                                                <div className="space-y-8 py-6">
                                                    {/* Admin Actions Section */}
                                                    <div className="p-5 bg-slate-50 rounded-xl space-y-6 border border-slate-200 shadow-sm">
                                                        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                            <div className="h-2 w-2 rounded-full bg-brand-600"></div>
                                                            Admin Controls
                                                        </h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {/* Status and Price */}
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-black uppercase text-slate-500">Update Status</label>
                                                                    <div className="flex gap-1 p-1 bg-white rounded-lg border shadow-sm">
                                                                        <Button
                                                                            size="sm"
                                                                            variant={app.status === 'pending' ? 'default' : 'ghost'}
                                                                            onClick={() => updateStatus(app.id, 'pending')}
                                                                            className={`flex-1 text-[11px] h-8 ${app.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'text-slate-500'}`}
                                                                        >
                                                                            Pending
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant={app.status === 'approved' ? 'default' : 'ghost'}
                                                                            onClick={() => updateStatus(app.id, 'approved')}
                                                                            className={`flex-1 text-[11px] h-8 ${app.status === 'approved' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-slate-500'}`}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant={app.status === 'rejected' ? 'default' : 'ghost'}
                                                                            onClick={() => updateStatus(app.id, 'rejected')}
                                                                            className={`flex-1 text-[11px] h-8 ${app.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-slate-500'}`}
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-black uppercase text-slate-500">Package / Price</label>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            variant={app.custom_amount === 750 || !app.custom_amount ? 'default' : 'outline'}
                                                                            onClick={() => updatePrice(app.id, 750)}
                                                                            className={`text-[11px] h-8 ${app.custom_amount === 750 || !app.custom_amount ? 'bg-slate-900 text-white' : 'bg-white'}`}
                                                                        >
                                                                            Standard $750
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant={app.custom_amount === 1100 ? 'default' : 'outline'}
                                                                            onClick={() => updatePrice(app.id, 1100)}
                                                                            className={`text-[11px] h-8 ${app.custom_amount === 1100 ? 'bg-slate-900 text-white' : 'bg-white'}`}
                                                                        >
                                                                            Full $1100
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Payment and Notes */}
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-black uppercase text-slate-500">Payment Status</label>
                                                                    <div className="flex gap-1 p-1 bg-white rounded-lg border shadow-sm">
                                                                        <Button
                                                                            size="sm"
                                                                            variant={app.is_paid ? 'default' : 'ghost'}
                                                                            onClick={() => updatePaymentStatus(app.id, true)}
                                                                            className={`flex-1 text-[11px] h-8 ${app.is_paid ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-500'}`}
                                                                        >
                                                                            Mark Paid
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant={!app.is_paid ? 'default' : 'ghost'}
                                                                            onClick={() => updatePaymentStatus(app.id, false)}
                                                                            className={`flex-1 text-[11px] h-8 ${!app.is_paid ? 'bg-slate-200 text-slate-700' : 'text-slate-500'}`}
                                                                        >
                                                                            Not Paid
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="text-[11px] font-black uppercase text-slate-500">Admin Notes</label>
                                                                    <div className="flex flex-col gap-2">
                                                                        <Textarea
                                                                            placeholder="Internal comments..."
                                                                            defaultValue={app.admin_notes || ""}
                                                                            id={`notes-${app.id}`}
                                                                            className="min-h-[60px] text-xs bg-white border-slate-200"
                                                                        />
                                                                        <Button
                                                                            size="sm"
                                                                            variant="secondary"
                                                                            className="h-7 text-[10px] uppercase font-bold tracking-tighter"
                                                                            onClick={() => {
                                                                                const textarea = document.getElementById(`notes-${app.id}`) as HTMLTextAreaElement;
                                                                                updateNotes(app.id, textarea.value);
                                                                            }}
                                                                        >
                                                                            Update Notes
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Applicant Data - Read Only */}
                                                    <div className="space-y-6">
                                                        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                            <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                                                            Applicant Profile
                                                        </h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            {/* Personal */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1 flex justify-between">
                                                                    Personal <span>ID: {app.booking_reference}</span>
                                                                </h4>
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Name</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.attendee_name || app.full_name || '-'}</p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.attendee_email || app.email || '-'}</p>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-0.5">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Sex</label>
                                                                            <p className="text-sm font-semibold text-slate-800">{app.attendee_sex || '-'}</p>
                                                                        </div>
                                                                        <div className="space-y-0.5">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">DOB</label>
                                                                            <p className="text-sm font-semibold text-slate-800">{app.attendee_dob || '-'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Passport</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.attendee_passport || '-'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Contact */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Contact & Geography</h4>
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-0.5">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Phone</label>
                                                                            <p className="text-sm font-semibold text-slate-800">{app.attendee_phone || '-'}</p>
                                                                        </div>
                                                                        <div className="space-y-0.5">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp</label>
                                                                            <p className="text-sm font-semibold text-slate-800">{app.attendee_whatsapp || '-'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nationality</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.attendee_nationality || '-'}</p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Organization</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.attendee_organization || '-'}</p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
                                                                        <p className="text-xs text-slate-600 leading-tight">{app.attendee_address || '-'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Additional Info */}
                                                            <div className="col-span-full space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-1">Registration Details</h4>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">T-Shirt</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.tshirt_size || '-'}</p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Referral</label>
                                                                        <p className="text-sm font-semibold text-slate-800">
                                                                            {app.referral_source || '-'}
                                                                            {app.referral_other && <span className="text-xs text-slate-500 ml-1">({app.referral_other})</span>}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Ambassador</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.ambassador_name || '-'}</p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Alumni?</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.has_attended_before ? 'Yes' : 'No'}</p>
                                                                    </div>
                                                                </div>

                                                                {/* Funding & Accommodation Sub-section */}
                                                                <div className="pt-4 border-t mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Accommodation</label>
                                                                        <p className={`text-sm font-bold ${app.accommodation ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                                            {app.accommodation ? 'Required' : 'Not Needed'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Plan</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.payment_plan || '-'}</p>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Investment Amount</label>
                                                                        <p className="text-sm font-semibold text-slate-800">{app.investment_amount || '-'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1 mt-2">
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Reason for Attending</label>
                                                                    <p className="text-xs text-slate-700 leading-relaxed italic">{app.reason_for_attending || '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
