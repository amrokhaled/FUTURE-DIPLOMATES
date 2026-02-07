export default function TestimonialsPage() {
    const testimonials = [
        {
            name: "Alexander Petrov",
            role: "Delegate of Germany",
            text: "This conference changed my perspective on how international relations work. The level of professionalism was astounding.",
            avatar: "AP",
            color: "bg-brand"
        },
        {
            name: "Sofia Rodriguez",
            role: "Delegate of Brazil",
            text: "Making friends from across the globe while debating complex policy issues was a highlight of my year.",
            avatar: "SR",
            color: "bg-brand-600"
        },
        {
            name: "Malik Ahmed",
            role: "Delegate of Egypt",
            text: "Representing my country's interests required me to step out of my comfort zone and truly think on my feet.",
            avatar: "MA",
            color: "bg-green-600"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white py-24 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Delegate Stories</h1>
                    <p className="text-xl text-gray-500">
                        Hear from our alumni about their journey through simulation, negotiation, and leadership development.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 ${t.color} text-white rounded-full flex items-center justify-center font-bold text-lg`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic leading-relaxed">
                                "{t.text}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="bg-brand rounded-3xl p-12 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Want to share your experience?</h2>
                            <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                                We love hearing from our delegates. Your story could inspire the next generation of global leaders.
                            </p>
                            <button className="bg-brand hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                                Submit Your Story
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
