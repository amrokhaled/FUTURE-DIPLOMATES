import { RegistrationForm } from "@/components/forms/registration-form";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Your Seat</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Join the next cohort of global leaders. Please complete the form below to register for the upcoming summit.
                    </p>
                </div>

                <RegistrationForm />

                <div className="mt-12 text-center text-sm text-gray-400 max-w-2xl mx-auto">
                    <p>
                        By registering, you agree to our Terms of Service and Privacy Policy.
                        Refunds are available up to 30 days before the event start date.
                    </p>
                </div>
            </div>
        </div>
    );
}
