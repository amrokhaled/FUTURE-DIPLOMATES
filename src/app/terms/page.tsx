export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen py-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold text-brand-900 mb-12 text-center">POLICIES & DISCLAIMERS</h1>

                <div className="space-y-12">
                    <section className="bg-gray-50 p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-brand-900 mb-4">Refund Policy</h2>
                        <p className="leading-relaxed text-gray-600">
                            All participation fees are non-refundable. Exceptions may apply only if the event is canceled by the organizers.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-brand-900 mb-4">Code of Conduct</h2>
                        <p className="leading-relaxed text-gray-600">
                            Delegates are expected to maintain professionalism, respect, and academic integrity throughout the conference.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-brand-900 mb-4">Disclaimer</h2>
                        <p className="leading-relaxed text-gray-600">
                            Future Diplomats – Cairo Edition is an independent event and is not affiliated with the United Nations or any governmental body unless explicitly stated.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
