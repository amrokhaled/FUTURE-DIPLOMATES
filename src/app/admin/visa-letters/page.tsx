"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    FileCheck,
    RefreshCw,
    Settings,
    Download,
    AlertCircle,
    Play,
    CheckCircle2
} from "lucide-react";

export default function AdminVisaLetters() {
    const letters = [
        { id: "BK001", name: "Alice Walker", status: "Generated", date: "10 mins ago" },
        { id: "BK012", name: "Bob Smith", status: "Pending", date: "2 hours ago" },
        { id: "BK045", name: "Charlie Brown", status: "Error", date: "5 hours ago", error: "Passport number missing" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileCheck className="w-8 h-8 text-brand-600" /> Visa Invitation System
                    </h1>
                    <p className="text-gray-500">Monitor and automate PDF generation for embassy letters.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2"><Settings className="w-4 h-4" /> Template Editor</Button>
                    <Button variant="default" className="bg-brand-600 gap-2"><Play className="w-4 h-4" /> Run Batch Gen</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monitoring Table */}
                <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Recent Generation Jobs</h3>
                        <Button variant="ghost" size="sm" className="text-gray-500 gap-2 hover:bg-gray-100">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </Button>
                    </div>
                    <div className="divide-y text-sm">
                        {letters.map((letter) => (
                            <div key={letter.id} className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${letter.status === 'Generated' ? 'bg-green-100 text-green-600' :
                                        letter.status === 'Pending' ? 'bg-blue-100 text-brand' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {letter.status === 'Generated' ? <CheckCircle2 className="w-5 h-5" /> :
                                            letter.status === 'Pending' ? <RefreshCw className="w-5 h-5 animate-spin-slow" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{letter.name}</p>
                                        <p className="text-xs text-gray-500">Ref: {letter.id} • {letter.date}</p>
                                        {letter.error && <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> {letter.error}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Settings className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Settings / KPI */}
                <div className="space-y-6">
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold mb-4">Batch Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Generated Today</span>
                                <span className="font-bold">42</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>85% Completion Rate</span>
                                <span>12.4s avg. speed</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold mb-2">Auto-Generate Mode</h3>
                        <p className="text-xs text-slate-400 mb-6">Automatically create letters upon payment confirmation.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-400">System Active</span>
                            <div className="w-10 h-6 bg-brand rounded-full relative flex items-center px-1">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

