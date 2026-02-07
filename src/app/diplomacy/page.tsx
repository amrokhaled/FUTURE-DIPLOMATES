export default function DiplomacyPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand mb-6">The Diplomatic Stance</h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            A unique framework developed to evaluate and enhance the performance of young delegates in international simulations.
                        </p>
                    </div>

                    <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2968&auto=format&fit=crop"
                            alt="Diplomatic forum"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform mb-4 mx-auto">
                                <span className="text-2xl text-brand ml-1">▶</span>
                            </div>
                            <p className="text-white font-bold drop-shadow-md">Watch our framework overview</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">What is it?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                The Diplomatic Stance is more than just a set of rules; it's a methodology for navigating complex geopolitical waters with grace, precision, and strategic foresight.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">Core Pillars</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-gray-700">
                                    <span className="text-brand font-bold">01.</span>
                                    Analytical Empathy
                                </li>
                                <li className="flex gap-3 text-gray-700">
                                    <span className="text-brand font-bold">02.</span>
                                    Nuanced Communication
                                </li>
                                <li className="flex gap-3 text-gray-700">
                                    <span className="text-brand font-bold">03.</span>
                                    Interest Alignment
                                </li>
                                <li className="flex gap-3 text-gray-700">
                                    <span className="text-brand font-bold">04.</span>
                                    Crisis Composure
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-brand-50 p-10 rounded-3xl border border-blue-100 text-center">
                        <h4 className="text-xl font-bold text-brand mb-4">Master the Art of Influence</h4>
                        <p className="text-brand-700 mb-8">Download our whitepaper on Modern Diplomacy and the Stance methodology.</p>
                        <button className="bg-brand text-white font-bold py-3 px-10 rounded-full hover:bg-brand-700 transition-colors">
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
