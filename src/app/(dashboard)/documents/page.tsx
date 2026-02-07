"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Calendar, FileCheck } from "lucide-react";
import Link from "next/link";

export default function DocumentsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple timeout - just show the page quickly
        const timeout = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-500">Download your invitation letters and certificates.</p>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl border p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-50 rounded-xl">
                        <FileCheck className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Cairo 2026 Documents</h3>
                        <p className="text-gray-500 mt-1">Your invitation letters and certificates will appear here after registration is confirmed.</p>
                    </div>
                </div>
            </div>

            {/* Document Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold">Invitation Letter</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Official invitation letter for visa applications and travel purposes.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                        <Download className="w-4 h-4 mr-2" />
                        Available after payment
                    </Button>
                </div>

                <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-bold">Participation Certificate</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Certificate of participation awarded after the event.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                        <Download className="w-4 h-4 mr-2" />
                        Available after event
                    </Button>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h3 className="font-bold text-blue-900 mb-2">Need Documents?</h3>
                <p className="text-sm text-blue-700 mb-4">
                    Complete your registration and payment to receive your invitation letter. Contact support for any additional documentation needs.
                </p>
                <div className="flex gap-3">
                    <Link href="/register">
                        <Button variant="gold">Register Now</Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
