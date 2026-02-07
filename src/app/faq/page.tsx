export default function FAQPage() {
    const faqs = [
        {
            q: "Is this conference affiliated with the UN?",
            a: "No. Future Diplomats is an independent international conference inspired by diplomatic practices and simulations."
        },
        {
            q: "What is the working language?",
            a: "English."
        },
        {
            q: "Do I need prior experience in diplomacy or MUN?",
            a: "No. Motivation and interest are more important than prior experience."
        },
        {
            q: "Is a visa required for Egypt?",
            a: "Visa requirements depend on nationality. We provide official invitation letters after acceptance."
        },
        {
            q: "Is the import { createClient } from \"@/lib/supabase/client\";?",
            a: "Fees are non-refundable unless stated otherwise in our refund policy."
        },
        {
            q: "Are flights included?",
            a: "Flights are not included."
        }
    ];

    return (
        <div className="bg-white min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-bold text-brand-900 mb-8 text-center">Frequently Asked Questions (FAQ)</h1>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start">
                                <span className="text-brand mr-2">Q:</span>
                                {faq.q}
                            </h3>
                            <p className="text-gray-600 ml-6">
                                <span className="font-bold text-gray-400 mr-2">A:</span>
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
