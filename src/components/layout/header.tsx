"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight, User, LogOut, LayoutDashboard, Loader2, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navigation = [
    { name: "Home", href: "/" },
    {
        name: "About Us",
        href: "/mission",
        items: [
            { name: "Who We Are", href: "/mission" },
            { name: "What We Do", href: "/vision" },
            { name: "Testimonial", href: "/testimonials" },
            { name: "Speakers", href: "/speakers" },
        ],
    },
    {
        name: "Information",
        href: "#",
        items: [
            { name: "Scholarship Programme", href: "/scholarship" },
            { name: "Diplomatic Stance", href: "/diplomacy" },
            { name: "Competition", href: "/competition" },
            { name: "Media Center", href: "/gallery" },
            { name: "Terms & Conditions", href: "/terms" },
        ],
    },
    { name: "Contact Us", href: "/contact" },
];

interface UserData {
    name: string;
    email: string;
    role?: string;
}

export function Header() {
    // Version: Request-Guest-Refactor-v3 (Trigger Vercel)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [hasBooking, setHasBooking] = useState(false);

    // Create a single supabase client for this component instance
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            try {
                // Quick check for session in local storage to avoid waiting for network
                const hasSession = Object.keys(localStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
                if (!hasSession) {
                    setLoading(false);
                }

                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (authUser) {
                    // Fetch user role
                    const { data: dbUser, error: roleError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', authUser.id)
                        .single();

                    console.log("User Check:", { authUser, dbUser, roleError });

                    setUser({
                        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                        email: authUser.email || '',
                        role: dbUser?.role
                    });

                    // Check for bookings with timeout
                    try {
                        const { count } = await supabase
                            .from('bookings')
                            .select('*', { count: 'exact', head: true })
                            .eq('user_id', authUser.id);

                        if (count && count > 0) {
                            setHasBooking(true);
                        }
                    } catch (bookingErr) {
                        console.log('Booking check failed:', bookingErr);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log('Auth check failed:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        // Safety timeout - ensure loading stops after 3 seconds max even if auth hangs
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 3000);

        checkUser().finally(() => clearTimeout(timeoutId));

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                // Fetch user role
                const { data: dbUser, error: roleError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                console.log("Session User Check:", { user: session.user, dbUser, roleError });

                setUser({
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    email: session.user.email || '',
                    role: dbUser?.role
                });

                // Check for bookings on sign in
                const { count } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', session.user.id);

                if (count && count > 0) {
                    setHasBooking(true);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setHasBooking(false);
                setLoggingOut(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, supabase]);

    const handleLogout = async () => {
        setLoggingOut(true);
        setUserMenuOpen(false);
        try {
            // clear supabase local storage keys
            for (const key of Object.keys(localStorage)) {
                if (key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            }

            // Call server-side signout route
            await fetch('/auth/signout', {
                method: 'POST',
            });

            // Force verify redirect
            window.location.href = '/login';
        } catch (e) {
            console.error("Logout error:", e);
            window.location.href = '/login';
        }
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Future Diplomats" className="h-12 w-12" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                            Future Diplomats
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navigation.map((item) => (
                        <div key={item.name} className="relative group">
                            {item.items ? (
                                <>
                                    <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-brand transition-colors py-2">
                                        {item.name}
                                        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                    </button>
                                    <div className="absolute left-0 top-full hidden group-hover:block pt-2">
                                        <div className="bg-white border rounded-lg shadow-xl py-2 min-w-[200px] overflow-hidden">
                                            {item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand transition-colors"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-sm font-semibold text-gray-700 hover:text-brand transition-colors py-2"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Auth Section */}
                    {loading ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                    ) : user ? (
                        // Logged in - show user menu
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                                    {initials}
                                </div>
                                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", userMenuOpen && "rotate-180")} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-xl py-2 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>

                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        My Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Not logged in - show login/signup
                        <>
                            {/* Public Login/Signup hidden for guests as requested */}
                        </>
                    )}

                    <Button variant="gold" size="sm" asChild className="font-semibold shadow-sm">
                        <Link href={hasBooking ? "/applications" : "/register"}>
                            {hasBooking ? "View Application" : "Register Now"}
                        </Link>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white shadow-2xl absolute w-full top-full left-0 z-50 animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto max-h-[calc(100vh-80px)]">
                    <div className="flex flex-col p-4 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.name} className="border-b last:border-0 border-gray-50">
                                {item.items ? (
                                    <>
                                        <button
                                            className="flex items-center justify-between w-full py-3 text-base font-semibold text-gray-800 hover:text-brand"
                                            onClick={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
                                        >
                                            {item.name}
                                            {expandedItem === item.name ? (
                                                <ChevronDown className="h-5 w-5" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5" />
                                            )}
                                        </button>
                                        {expandedItem === item.name && (
                                            <div className="bg-gray-50 rounded-lg mb-2 py-1 px-4 animate-in slide-in-from-top-2">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block py-2.5 text-sm text-gray-600 hover:text-brand"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="block py-3 text-base font-semibold text-gray-800 hover:text-brand"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}

                        <div className="pt-4 pb-2 space-y-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full font-semibold" size="lg" asChild>
                                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            My Dashboard
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full font-semibold text-red-600 hover:bg-red-50"
                                        size="lg"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        disabled={loggingOut}
                                    >
                                        {loggingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Public Login/Signup hidden for guests as requested */}
                                </>
                            )}

                            <Button variant="gold" className="w-full font-bold shadow-md" size="lg" asChild>
                                <Link href={hasBooking ? "/applications" : "/register"} onClick={() => setMobileMenuOpen(false)}>
                                    {hasBooking ? "View Application" : "Register Now"}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
