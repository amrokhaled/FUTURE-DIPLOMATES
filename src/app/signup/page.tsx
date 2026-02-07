"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2, ArrowLeft, AlertCircle, CheckCircle, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback` // Update to point to our new callback route
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Show email verification message
        setEmailSent(true);
        setLoading(false);
    };

    // Email verification sent screen
    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MailCheck className="w-10 h-10 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                        <p className="text-gray-500 mb-6">
                            We've sent a verification link to:<br />
                            <span className="font-semibold text-gray-700">{email}</span>
                        </p>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-700">
                                Click the link in the email to verify your account and complete registration.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setEmailSent(false)}
                            >
                                Use Different Email
                            </Button>
                            <Link href="/login" className="block text-sm text-gray-500 hover:text-brand">
                                Already verified? Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-900 mb-4 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join the global leadership community.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 py-2">
                            <input type="checkbox" required className="mt-1 accent-blue-600" id="terms" />
                            <label htmlFor="terms" className="text-xs text-gray-500 leading-normal">
                                I agree to the <Link href="/terms" className="underline text-blue-600">Terms of Service</Link> and <Link href="#" className="underline text-blue-600">Privacy Policy</Link>.
                            </label>
                        </div>

                        <Button type="submit" variant="gold" className="w-full h-11" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Delegate Account"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center bg-gray-50 -mx-8 -mb-8 p-6 rounded-b-2xl border-t">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-900 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
