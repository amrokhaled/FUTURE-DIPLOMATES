import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background Placeholder */}
            <div className="absolute inset-0 bg-brand-900 z-0">
                {/* New Premium Image: Cairo Conference / Diplomacy Theme */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/60"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center text-white space-y-8">
                <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000 fill-mode-both">
                    <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-100 text-sm font-medium tracking-wide shadow-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#418fda]"></span>
                        </span>
                        THE WORLD'S PREMIER DIPLOMATIC SIMULATION
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none drop-shadow-2xl text-white">
                        Future Diplomats
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#418fda] via-white to-[#418fda]">
                            Cairo Edition 2026
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-100 font-light leading-relaxed drop-shadow-md">
                        An International Youth Diplomacy & Leadership Conference.
                        <br />
                        <span className="font-semibold text-white mt-4 block">May 2026 • Triumph Luxury Hotel • Egypt</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300 fill-mode-both">
                    {/* Primary Button - Forced Brand Color #418fda */}
                    <Button size="xl" className="text-xl px-12 py-8 rounded-full bg-[#418fda] text-white hover:bg-[#3579c6] hover:scale-105 transition-all duration-300 font-bold shadow-[0_0_20px_rgba(65,143,218,0.5)] border-2 border-[#418fda]" asChild>
                        <Link href="/register">Apply Now</Link>
                    </Button>
                    {/* Secondary Button - Transparent with White Border */}
                    <Button size="xl" className="text-xl px-12 py-8 rounded-full text-white border-2 border-white bg-transparent hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm" asChild>
                        <Link href="/vision">Highlights</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
