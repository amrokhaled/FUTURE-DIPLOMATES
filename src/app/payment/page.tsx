export default function PaymentPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
                        <div className="bg-brand p-8 text-white">
                            <h1 className="text-3xl font-bold mb-2">Registration Fees & Payments</h1>
                            <p className="text-brand-100">Official delegate registration for the 2024 Global Leadership Summit.</p>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 border rounded-2xl bg-white hover:border-blue-200 transition-colors">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Standard Registration</h3>
                                    <div className="text-4xl font-bold text-brand mb-2">$450</div>
                                    <p className="text-sm text-gray-500 mb-6">Includes conference materials, accommodation (3 nights), and most meals.</p>
                                    <ul className="text-sm space-y-2 mb-8">
                                        <li>✅ Opening Dinner Access</li>
                                        <li>✅ Full Delegate Kit</li>
                                        <li>✅ Certificate of Participation</li>
                                    </ul>
                                    <button className="w-full bg-brand text-white font-bold py-3 rounded-xl">Pay Now</button>
                                </div>

                                <div className="p-6 border-2 border-brand-400 rounded-2xl bg-gray-50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-brand-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Premium Registration</h3>
                                    <div className="text-4xl font-bold text-brand mb-2">$600</div>
                                    <p className="text-sm text-gray-500 mb-6">All standard perks plus VIP seating and exclusive networking dinner.</p>
                                    <ul className="text-sm space-y-2 mb-8">
                                        <li>✅ VIP Gala Dinner</li>
                                        <li>✅ Private Mentoring Session</li>
                                        <li>✅ Priority Visa Assistance</li>
                                    </ul>
                                    <button className="w-full bg-gray-500 text-white font-bold py-3 rounded-xl">Pay Now</button>
                                </div>
                            </div>

                            <div className="pt-8 border-t">
                                <h4 className="font-bold text-gray-900 mb-4">Accepted Payment Methods</h4>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600">Credit / Debit Card</div>
                                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600">PayPal</div>
                                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600">Bank Transfer</div>
                                    <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600">Wire Transfer</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-8 rounded-3xl flex gap-6 items-start">
                        <div className="text-4xl">💡</div>
                        <div>
                            <h4 className="font-bold text-brand-900 mb-2">Need a Payment Plan?</h4>
                            <p className="text-brand-800 leading-relaxed">
                                We offer flexible installment plans for individual delegates and groups. Contact our finance team for more details on how to split your registration fee.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

