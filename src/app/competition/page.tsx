import { createClient } from "@/lib/supabase/client";
export default function CompetitionPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Awards & Excellence</h1>
                    <p className="text-xl text-gray-500">Recognizing outstanding leadership, innovative problem solving, and diplomatic finesse.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <h2 className="text-3xl font-bold text-brand mb-6">The Delegate Cup</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Our premier award presented to the individual who demonstrates the best overall performance in negotiation, research, and collaborative problem-solving.
                        </p>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-brand mb-1">01</div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Winner</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gray-100 px-4 rounded-lg text-gray-400 mb-1">02</div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Runner Up</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 aspect-square rounded-[3rem] p-12 flex items-center justify-center opacity-80">
                        <img
                            src="https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=2696&auto=format&fit=crop"
                            alt="Trophy"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="bg-gray-900 rounded-[3rem] p-16 text-white text-center">
                    <h2 className="text-3xl font-bold mb-12">Other Award Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="text-4xl">💪</div>
                            <h4 className="font-bold">Best Position Paper</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl">🗣️</div>
                            <h4 className="font-bold">Best Public Speaker</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl">🤝</div>
                            <h4 className="font-bold">Most Cooperative</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl">🎬</div>
                            <h4 className="font-bold">Special Mention</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
