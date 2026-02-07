"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ScholarshipPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        nationality: "",
        dob: "",
        motivation: ""
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [supabase] = useState(() => createClient());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let cvUrl = null;

            // 1. Upload CV if file exists
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(filePath, file);

                if (uploadError) throw new Error('CV Upload failed: ' + uploadError.message);

                const { data: { publicUrl } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(filePath);

                cvUrl = publicUrl;
            }

            // 2. Get User ID (optional)
            const { data: { user } } = await supabase.auth.getUser();

            // 3. Insert Application
            const { error: insertError } = await supabase
                .from('scholarship_applications')
                .insert({
                    user_id: user?.id || null,
                    full_name: formData.fullName,
                    email: formData.email,
                    nationality: formData.nationality,
                    dob: formData.dob,
                    motivation: formData.motivation,
                    cv_url: cvUrl,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            setSubmitted(true);
        } catch (err: any) {
            console.error("Submission error:", err);
            alert("Failed to submit application: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-gray-50 min-h-screen py-32 flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for applying. Our committee will review your application and get back to you via email within 10 business days.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-brand text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Scholarship Program</h1>
                    <p className="text-gray-500 text-lg">
                        We believe financial constraints shouldn't prevent leadership potential.
                        Apply for our fully funded or partial scholarships.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Nationality</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none"
                                    placeholder="Country"
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Date of Birth</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Motivation Letter (Max 500 words)</label>
                            <textarea
                                required
                                className="w-full border rounded-xl p-3 h-48 focus:ring-2 focus:ring-brand outline-none"
                                placeholder="Tell us why you deserve this scholarship..."
                                value={formData.motivation}
                                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Upload CV / Resume (PDF)</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-brand bg-brand-50' : 'border-gray-300 group-hover:border-blue-400 group-hover:bg-gray-50'}`}>
                                    <p className="text-gray-500 font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                                    <p className="text-xs text-gray-400 mt-2">Max file size: 5MB (PDF only)</p>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
