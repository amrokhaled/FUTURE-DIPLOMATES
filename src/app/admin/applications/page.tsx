"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Loader2, Search, RefreshCw, Users, DollarSign, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Application {
    id: string;
    booking_reference: string;
    attendee_name: string;
    attendee_email: string;
    attendee_phone: string;
    attendee_nationality: string;
    attendee_organization: string;
    package_type: string;
    payment_status: string;
    amount: number;
    created_at: string;
    reason_for_attending: string;
    tshirt_size: string;
    referral_source: string;
}

// Package options matching home page
const PACKAGES = [
    { value: 'conference', label: 'Conference Only', price: 750 },
    { value: 'premium', label: 'Premium Package', price: 1150 },
];

const STATUSES = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
    { value: 'paid', label: 'Paid', color: 'bg-blue-100 text-blue-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

export default function AdminApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editData, setEditData] = useState<{ package_type: string; amount: number; payment_status: string } | null>(null);

    const supabase = createClient();

    const fetchApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching applications:', error);
        } else {
            setApplications(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(id);
        const { error } = await supabase
            .from('bookings')
            .update({ payment_status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } else {
            setApplications(apps =>
                apps.map(app =>
                    app.id === id ? { ...app, payment_status: newStatus } : app
                )
            );
        }
        setUpdating(null);
    };

    const startEdit = (app: Application) => {
        setEditMode(app.id);
        setEditData({
            package_type: app.package_type || 'conference',
            amount: app.amount || 750,
            payment_status: app.payment_status || 'pending'
        });
    };

    const cancelEdit = () => {
        setEditMode(null);
        setEditData(null);
    };

    const saveEdit = async (id: string) => {
        if (!editData) return;

        setUpdating(id);
        const { error } = await supabase
            .from('bookings')
            .update({
                package_type: editData.package_type,
                amount: editData.amount,
                payment_status: editData.payment_status
            })
            .eq('id', id);

        if (error) {
            console.error('Error saving:', error);
            alert('Failed to save changes');
        } else {
            setApplications(apps =>
                apps.map(app =>
                    app.id === id ? { ...app, ...editData } : app
                )
            );
            setEditMode(null);
            setEditData(null);
        }
        setUpdating(null);
    };

    const handlePackageChange = (packageValue: string) => {
        const pkg = PACKAGES.find(p => p.value === packageValue);
        if (pkg && editData) {
            setEditData({ ...editData, package_type: packageValue, amount: pkg.price });
        }
    };

    const filteredApps = applications.filter(app =>
        app.attendee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.attendee_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.attendee_nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const s = STATUSES.find(st => st.value === status);
        return s?.color || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-8 h-8 text-brand" /> Applications
                    </h1>
                    <p className="text-gray-500">
                        Future Diplomats Cairo Edition 2026 • {applications.length} total applications
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-brand outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={fetchApplications} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Package Legend */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap gap-6">
                <span className="text-sm font-bold text-blue-900">Packages:</span>
                {PACKAGES.map(pkg => (
                    <span key={pkg.value} className="text-sm text-blue-800">
                        <strong>{pkg.label}:</strong> ${pkg.price}
                    </span>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand" />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white border rounded-xl p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500">Applications will appear here when users register for the conference.</p>
                </div>
            ) : (
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b">
                                <tr>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Nationality</th>
                                    <th className="px-6 py-4">Package</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredApps.map((app) => (
                                    <tr key={app.id} className={`hover:bg-gray-50/50 transition-colors ${editMode === app.id ? 'bg-blue-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{app.attendee_name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{app.attendee_email}</p>
                                                <p className="text-xs text-gray-400">{app.attendee_phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {app.booking_reference || 'N/A'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {app.attendee_nationality || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editMode === app.id ? (
                                                <select
                                                    value={editData?.package_type || 'conference'}
                                                    onChange={(e) => handlePackageChange(e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm bg-white"
                                                >
                                                    {PACKAGES.map(pkg => (
                                                        <option key={pkg.value} value={pkg.value}>
                                                            {pkg.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="capitalize font-medium">
                                                    {PACKAGES.find(p => p.value === app.package_type)?.label || app.package_type || 'Conference'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editMode === app.id ? (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        value={editData?.amount || 0}
                                                        onChange={(e) => editData && setEditData({ ...editData, amount: parseInt(e.target.value) || 0 })}
                                                        className="border rounded px-2 py-1 text-sm w-20"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-bold text-green-700">${app.amount || 0}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editMode === app.id ? (
                                                <select
                                                    value={editData?.payment_status || 'pending'}
                                                    onChange={(e) => editData && setEditData({ ...editData, payment_status: e.target.value })}
                                                    className="border rounded px-2 py-1 text-sm bg-white"
                                                >
                                                    {STATUSES.map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(app.payment_status)}`}>
                                                    {app.payment_status || 'pending'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {app.created_at ? formatDate(app.created_at) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {editMode === app.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(app.id)}
                                                            disabled={updating === app.id}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                                            title="Save"
                                                        >
                                                            {updating === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => setSelectedApp(app)}
                                                            className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => startEdit(app)}
                                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                            title="Edit Package/Payment"
                                                        >
                                                            <DollarSign className="w-4 h-4" />
                                                        </button>
                                                        {app.payment_status !== 'approved' && app.payment_status !== 'paid' && (
                                                            <button
                                                                onClick={() => updateStatus(app.id, 'approved')}
                                                                disabled={updating === app.id}
                                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                                                title="Approve"
                                                            >
                                                                {updating === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                        <div className="p-6 border-b flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedApp.attendee_name}</h2>
                                <p className="text-sm text-gray-500">{selectedApp.booking_reference}</p>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                                    <p className="text-gray-900">{selectedApp.attendee_email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                                    <p className="text-gray-900">{selectedApp.attendee_phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Nationality</p>
                                    <p className="text-gray-900">{selectedApp.attendee_nationality || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Organization</p>
                                    <p className="text-gray-900">{selectedApp.attendee_organization || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Package</p>
                                    <p className="text-gray-900 capitalize">
                                        {PACKAGES.find(p => p.value === selectedApp.package_type)?.label || selectedApp.package_type} (${selectedApp.amount})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">T-Shirt Size</p>
                                    <p className="text-gray-900">{selectedApp.tshirt_size || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Referral Source</p>
                                    <p className="text-gray-900">{selectedApp.referral_source || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(selectedApp.payment_status)}`}>
                                        {selectedApp.payment_status}
                                    </span>
                                </div>
                            </div>
                            {selectedApp.reason_for_attending && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Reason for Attending</p>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm">
                                        {selectedApp.reason_for_attending}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex justify-between gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedApp(null);
                                    startEdit(selectedApp);
                                }}
                            >
                                <DollarSign className="w-4 h-4 mr-2" /> Edit Payment
                            </Button>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setSelectedApp(null)}>
                                    Close
                                </Button>
                                {selectedApp.payment_status !== 'paid' && (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            updateStatus(selectedApp.id, 'paid');
                                            setSelectedApp({ ...selectedApp, payment_status: 'paid' });
                                        }}
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Mark as Paid
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
