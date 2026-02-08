import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SummitsPreview() {
    const summits = [
        {
            city: "Dubai, UAE",
            date: "May 2024",
            image: "https://images.unsplash.com/photo-1512453979798-5ea90b7cadc9?q=80&w=2787&auto=format&fit=crop",
            status: "Open",
        },
        {
            city: "New York, USA",
            date: "July 2024",
            image: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2940&auto=format&fit=crop",
            status: "Waitlist",
        },
        {
            city: "Istanbul, Turkey",
            date: "September 2024",
            image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2949&auto=format&fit=crop",
            status: "Coming Soon",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Summits</h2>
                        <p className="text-gray-500">Select your destination and begin your journey.</p>
                    </div>
                    <Button variant="link" asChild className="hidden md:flex">
                        <Link href="/summits">View All Destinations &rarr;</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {summits.map((summit, index) => (
                        <Link key={index} href="/register" className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/5] relative">
                                <div className="absolute inset-0 bg-gray-200">
                                    <img src={summit.image} alt={summit.city} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">{summit.date}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${summit.status === 'Open' ? 'bg-green-500 text-white' :
                                            summit.status === 'Waitlist' ? 'bg-brand-500 text-white' : 'bg-gray-500 text-white'
                                            }`}>
                                            {summit.status}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">{summit.city}</h3>
                                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Experience leadership training in a world-class venue.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" asChild>
                        <Link href="/summits">View All Destinations</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

