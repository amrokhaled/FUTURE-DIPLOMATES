"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [supabase] = useState(() => createClient());

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert({ email });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    alert("You are already subscribed!");
                } else {
                    throw error;
                }
            } else {
                alert("Successfully subscribed to our newsletter!");
                setEmail("");
            }
        } catch (err: any) {
            console.error(err);
            alert("Failed to subscribe: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-brand-950 text-white pt-16 pb-8 border-t border-brand-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
                            Future Diplomats
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Empowering the next generation of global leaders through immersive diplomatic simulations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/portal/summits" className="hover:text-white transition-colors">Upcoming Summits</Link></li>
                            <li><Link href="/register" className="hover:text-white transition-colors">Register Now</Link></li>
                            <li><Link href="/scholarship" className="hover:text-white transition-colors">Scholarship</Link></li>
                            <li><Link href="/visa-assistance" className="hover:text-white transition-colors">Visa Assistance</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Contact Us</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>info@diplomacyleaders.org</li>
                            <li>New York, NY 10001, USA</li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Stay Updated</h4>
                        <p className="text-gray-400 text-sm">Join our mailing list for updates.</p>
                        <form className="flex gap-2" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border-none rounded-md px-3 py-2 text-sm w-full focus:ring-1 focus:ring-brand"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button variant="gold" size="sm" type="submit" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} International Diplomacy & Leadership Conference. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
