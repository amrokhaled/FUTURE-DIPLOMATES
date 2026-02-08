import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export default function SummitsPage() {
    const summits = [
        {
            city: "Cairo, Egypt",
            date: "July 15-20, 2026",
            image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2940&auto=format&fit=crop",
            status: "Open",
            description: "Join us in the heart of Egypt for an unforgettable diplomatic experience at the pyramids.",
        },
        {
            city: "Dubai, UAE",
            date: "Coming Soon",
            image: "https://images.unsplash.com/photo-1512453979798-5ea90b7cadc9?q=80&w=2787&auto=format&fit=crop",
            status: "Coming Soon",
            description: "Experience world-class diplomacy training in the city of the future.",
        },
        {
            city: "Istanbul, Turkey",
            date: "Coming Soon",
            image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2949&auto=format&fit=crop",
            status: "Coming Soon",
            description: "Bridge East and West in this historic city of diplomacy and culture.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Summits</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover world-class diplomatic training across the globe. Choose your destination and begin your journey.
                    </p>
                </div>
            </section>

            {/* Summits Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {summits.map((summit, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="aspect-video relative">
                                    <img src={summit.image} alt={summit.city} className="w-full h-full object-cover" />
                                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${summit.status === 'Open' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                        }`}>
                                        {summit.status}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{summit.city}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">{summit.date}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{summit.description}</p>
                                    {summit.status === 'Open' ? (
                                        <Button asChild className="w-full">
                                            <Link href="/register">
                                                Register Now <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" disabled className="w-full">
                                            Coming Soon
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
