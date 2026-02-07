import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function VisaPage() {
    return (
        <div className="bg-white min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-blue-900">Visa Assistance & Guidelines</h1>

                <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                    <p className="lead text-xl">
                        We understand that obtaining a visa can be a complex process. Our dedicated team is here to support registered delegates with official documentation to facilitate their travel.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <h3 className="text-blue-900 font-bold mb-2">Important Notice</h3>
                        <p className="text-sm">
                            Visa issuance is the sole prerogative of the Embassy/Consulate. The conference organizers cannot guarantee visa issuance but will provide all necessary supporting documents.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
                    <ol className="list-decimal pl-5 space-y-4">
                        <li><strong>Register & Pay:</strong> Complete your clear registration and payment for the summit.</li>
                        <li><strong>Request Letter:</strong> Log in to your User Dashboard and navigate to the "Documents" section.</li>
                        <li><strong>Submit Passport Details:</strong> Ensure your passport details are accurate and the passport has at least 6 months validity.</li>
                        <li><strong>Download Invitation:</strong> Your official Visa Invitation Letter will be generated instantly as a PDF.</li>
                        <li><strong>Apply:</strong> Submit this letter along with your visa application to the nearest Embassy or Consulate.</li>
                    </ol>

                    <h2 className="text-2xl font-bold text-gray-900">Provided Documents</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Official Conference Invitation Letter</li>
                        <li>Hotel Accommodation Confirmation (if package selected)</li>
                        <li>Invoice/Receipt of Payment</li>
                        <li>Conference Agenda/Itinerary</li>
                    </ul>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 p-8 bg-gray-50 rounded-2xl items-center justify-between border">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Ready to start?</h3>
                            <p className="text-sm">Register now to unlock your visa documents.</p>
                        </div>
                        <Button variant="gold" size="lg" asChild>
                            <Link href="/register">Register Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
