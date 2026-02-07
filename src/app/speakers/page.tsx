import { createClient } from "@/lib/supabase/client";
export default function SpeakersPage() {
    const speakers = [
        {
            name: "Amb. Catherine West",
            title: "Former UN Under-Secretary-General",
            bio: "With over 30 years in multilateral diplomacy, Amb. West provides invaluable insights into peacekeeping and international security.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop"
        },
        {
            name: "Dr. James Aris",
            title: "Professor of International Law",
            bio: "A leading expert in international human rights law and treaty negotiation processes.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop"
        },
        {
            name: "Elena Rossi",
            title: "Crisis Management Specialist",
            bio: "Elena specializes in rapid response diplomacy and regional stability in geopolitical hotspots.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2861&auto=format&fit=crop"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gray-900 text-white py-24 px-4 text-center">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-bold mb-6">Expert Voices</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Learning from the best in the field. Our speakers come from the highest echelons of global diplomacy and legal scholarship.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="space-y-24">
                    {speakers.map((s, i) => (
                        <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                            <div className="flex-1">
                                <img
                                    src={s.image}
                                    alt={s.name}
                                    className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-6">
                                <h3 className="text-3xl font-bold text-gray-900">{s.name}</h3>
                                <p className="text-brand font-semibold">{s.title}</p>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {s.bio}
                                </p>
                                <button className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                    Read Full Bio <span>&rarr;</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
