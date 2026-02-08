"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
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

        console.log("Attempting login with:", email);
        try {
            // Create a timeout promise that rejects after 20 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 20000);
            });

            const { data, error } = await Promise.race([
                supabase.auth.signInWithPassword({
                    email,
                    password,
                }),
                timeoutPromise
            ]) as any;

            console.log("Supabase response:", { data, error });

            if (error) {
                console.error("Login error:", error);
                setError(error.message);
                setLoading(false);
                return;
            }

            console.log("Login successful, redirecting...");
            // Force a hard refresh to update server-side session
            router.refresh();

            // simple check for 'next' param
            const params = new URLSearchParams(window.location.search);
            const next = params.get('next') || '/dashboard';
            window.location.href = next;
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    };

    // Add diagnostics on mount
    useState(() => { // Using useState lazy initializer or useEffect to run once
        const runDiagnostics = async () => {
            console.log("--- DIAGNOSTICS START ---");
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            console.log("Env Check:", {
                hasUrl: !!url,
                urlPrefix: url ? url.substring(0, 8) + '...' : 'MISSING',
                hasKey: !!key
            });

            try {
                console.log("Ping: Checking session...");
                const sessionStart = Date.now();
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                console.log("Ping: Session result:", {
                    latency: Date.now() - sessionStart,
                    hasSession: !!sessionData.session,
                    error: sessionError
                });

                console.log("Ping: Checking network connection (fetch public.users count)...");
                const netStart = Date.now();
                // Using 'head: true' for a lightweight check
                const { count, error: netError, status } = await supabase.from('users').select('*', { count: 'exact', head: true });
                console.log("Ping: Network result:", {
                    latency: Date.now() - netStart,
                    status,
                    count,
                    error: netError
                });

            } catch (e) {
                console.error("Ping: DIAGNOSTIC FAILURE", e);
            }
            console.log("--- DIAGNOSTICS END ---");
        };

        // Run on client only
        if (typeof window !== 'undefined') {
            runDiagnostics();
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-blue-900 inline-block mb-4">
                        Diplomacy Platform
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="gold" className="w-full h-11" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Sign in to Dashboard"}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                                Create Account <ArrowRight className="w-3 h-3" />
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Secure access provided by Supabase Auth.
                </p>
            </div>
        </div>
    );
}
