"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, Shield, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // First, sign in with email/password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (!authData.user) {
            setError("Login failed. Please try again.");
            setLoading(false);
            return;
        }

        // Check if user is an admin
        const { data: adminUser, error: adminError } = await supabase
            .from('admin_users')
            .select('id, role')
            .eq('user_id', authData.user.id)
            .single();

        if (adminError || !adminUser) {
            // Sign out the user since they're not an admin
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
            await Promise.race([
                supabase.auth.signOut(),
                timeoutPromise
            ]);
            setError("Access denied. You are not authorized to access the admin panel.");
            setLoading(false);
            return;
        }

        // Success - redirect to admin dashboard
        router.push('/admin');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Admin Access</h1>
                    <p className="text-slate-400 mt-2">Sign in to the admin dashboard</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Sign in to Admin
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                            ← Back to Website
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-slate-500">
                    Future Diplomats Cairo Edition 2026 • Admin Portal
                </p>
            </div>
        </div>
    );
}
