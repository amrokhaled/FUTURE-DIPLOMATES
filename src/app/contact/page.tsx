"use client";

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-brand-900 text-white py-24 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
                    <p className="text-xl text-brand-100">
                        Have questions about registration, scholarships, or the conference schedule? Our team is here to help.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-12 relative z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-xl border">
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const formData = new FormData(form);
                            const data = {
                                first_name: formData.get('firstName'),
                                last_name: formData.get('lastName'),
                                email: formData.get('email'),
                                message: formData.get('message'),
                            };

                            const submitBtn = form.querySelector('button');
                            if (submitBtn) {
                                submitBtn.disabled = true;
                                submitBtn.textContent = 'Sending...';
                            }

                            try {
                                const { createClient } = require('@/lib/supabase/client');
                                const supabase = createClient();
                                const { error } = await supabase.from('contact_messages').insert(data);

                                if (error) throw error;
                                alert('Message sent successfully! We will get back to you soon.');
                                form.reset();
                            } catch (err: any) {
                                console.error(err);
                                alert('Failed to send message: ' + err.message);
                            } finally {
                                if (submitBtn) {
                                    submitBtn.disabled = false;
                                    submitBtn.textContent = 'Send Message';
                                }
                            }
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <input name="firstName" required type="text" className="w-full border rounded-xl p-4 bg-gray-50" placeholder="Jane" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input name="lastName" type="text" className="w-full border rounded-xl p-4 bg-gray-50" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input name="email" required type="email" className="w-full border rounded-xl p-4 bg-gray-50" placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea name="message" required className="w-full border rounded-xl p-4 bg-gray-50 h-40" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-brand-900 text-white font-bold py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-lg disabled:opacity-70">
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-4">Location</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Cairo, Egypt
                            </p>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
                            <p className="text-brand-600 font-semibold mb-2">[your email]</p>
                            <p className="text-gray-600 text-sm">Instagram / LinkedIn: [social links]</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
