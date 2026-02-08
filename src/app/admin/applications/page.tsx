"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Application {
    id: string;
    full_name?: string;
    email?: string;
    status: string;
    created_at: string;
    custom_amount?: number;
    admin_notes?: string;
    package_type?: string;
}

export default function ApplicationsManager() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [price, setPrice] = useState(750);

    const supabase = createClient();

    // Fetch Data
    async function fetchApplications() {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setApplications(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchApplications();
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
            // Close modal logic would go here
        }
    }

    const filteredApps = applications.filter(app =>
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
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
                                        <div className="font-medium">{app.full_name || 'Unknown User'}</div>
                                        <div className="text-xs text-slate-500">{app.email}</div>
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
                                                {app.custom_amount ? `$${app.custom_amount}` : '$750 (Default)'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    setSelectedApp(app);
                                                    setPrice(app.custom_amount || 750);
                                                }}>
                                                    Manage
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Manage Application</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-6 py-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Application Status</label>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={app.status === 'pending' ? 'secondary' : 'outline'}
                                                                onClick={() => updateStatus(app.id, 'pending')}
                                                                className="flex-1"
                                                            >
                                                                Pending
                                                            </Button>
                                                            <Button
                                                                variant={app.status === 'approved' ? 'default' : 'outline'}
                                                                className={app.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                                onClick={() => updateStatus(app.id, 'approved')}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant={app.status === 'rejected' ? 'destructive' : 'outline'}
                                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 border-t pt-4">
                                                        <label className="text-sm font-medium flex justify-between">
                                                            <span>Custom Pricing</span>
                                                            <span className="text-brand-600 font-bold">${price}</span>
                                                        </label>
                                                        <Slider
                                                            defaultValue={[price]}
                                                            max={1100}
                                                            min={750}
                                                            step={50}
                                                            onValueChange={(vals: number[]) => setPrice(vals[0])}
                                                        />
                                                        <p className="text-xs text-slate-500">
                                                            Adjust price between $750 and $1100 for this specific applicant.
                                                        </p>
                                                        <Button
                                                            className="w-full mt-2"
                                                            onClick={() => updatePrice(app.id, price)}
                                                        >
                                                            Save Price
                                                        </Button>
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
