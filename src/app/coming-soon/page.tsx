import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-brand-950 flex flex-col items-center justify-center text-center p-4">
            <Construction className="w-24 h-24 text-brand-400 mb-8 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Coming Soon</h1>
            <p className="text-xl text-brand-100 max-w-xl mb-12">
                We are currently working on this page. Please check back later or return to the home page for available information.
            </p>
            <Link href="/">
                <Button size="lg" className="bg-white text-brand-900 hover:bg-brand-50 font-bold text-lg rounded-full px-8">
                    Return Home
                </Button>
            </Link>
        </div>
    );
}
