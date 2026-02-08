"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, CreditCard, User, Building, Plane, MapPin, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function RegistrationForm() {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        // Personal
        firstName: "",
        lastName: "",
        email: "",
        passport: "",
        sex: "",
        dobDay: "",
        dobMonth: "",
        dobYear: "",

        // Contact
        phone: "",
        whatsapp: "",
        addressStreet: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        nationality: "",
        organization: "",

        // Details
        tshirtSize: "",
        referralSource: "",
        referralOther: "",
        hasAttendedBefore: "",
        reasonForAttending: "",
        ambassadorName: "",

        // Funding
        paymentPlan: "",
        investmentAmount: "",

        // Package
        package: "",
        accommodation: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                // Pre-fill email if logged in
                if (user.email) {
                    setFormData(prev => ({ ...prev, email: user.email || '' }));
                }
            }
        }
        checkUser();
    }, [supabase.auth]);

    const totalSteps = 3;

    const validateStep = (currentStep: number) => {
        setValidationError(null);
        setError(null);

        if (currentStep === 1) {
            if (!formData.firstName) return "First Name is required";
            if (!formData.sex) return "Sex is required";
            if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) return "Date of Birth is required";
            if (!formData.email) return "Email Address is required";
        }

        if (currentStep === 2) {
            if (!formData.phone) return "Phone number is required";
            if (!formData.addressStreet) return "Street address is required";
            if (!formData.nationality) return "Nationality is required";
            if (!formData.organization) return "Organization name is required";
        }

        if (currentStep === 3) {
            if (!formData.tshirtSize) return "T-Shirt Size is required";
            if (!formData.referralSource) return "Referral source is required";
            if (formData.referralSource === "Ambassador" && !formData.ambassadorName) return "Ambassador name is required";
            if (!formData.hasAttendedBefore) return "Previous experience answer is required";
            if (!formData.reasonForAttending) return "Reason for attending is required";
            if (!formData.package) return "Please select a package";
        }

        return null;
    };

    const nextStep = () => {
        const errorMsg = validateStep(step);
        if (errorMsg) {
            setValidationError(errorMsg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setStep((s) => Math.min(s + 1, totalSteps));
    };

    const prevStep = () => {
        setValidationError(null);
        setError(null);
        setStep((s) => Math.max(s - 1, 1));
    };

    // Generate a booking reference
    const generateBookingRef = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let ref = 'FD-CAI26-';
        for (let i = 0; i < 6; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return ref;
    };

    const handleSubmit = async () => {
        const errorMsg = validateStep(3);
        if (errorMsg) {
            setValidationError(errorMsg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const bookingRef = generateBookingRef();
            const dob = formData.dobYear && formData.dobMonth && formData.dobDay
                ? `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`
                : null;

            // Insert booking
            const { error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    user_id: userId,
                    booking_reference: bookingRef,
                    event: 'Future Diplomats Cairo Edition 2026',
                    city_code: 'CAI',
                    event_date: '2026-07-15',
                    package_type: formData.package,
                    payment_status: 'pending',
                    amount: formData.package === 'vip' ? 1500 : formData.package === 'premium' ? 1000 : 500,
                    attendee_name: `${formData.firstName} ${formData.lastName}`.trim(),
                    attendee_email: formData.email,
                    attendee_phone: formData.phone,
                    attendee_nationality: formData.nationality,
                    attendee_passport: formData.passport,
                    attendee_dob: dob,
                    attendee_sex: formData.sex,
                    attendee_organization: formData.organization,
                    attendee_address: `${formData.addressStreet}, ${formData.city}, ${formData.country}`,
                    tshirt_size: formData.tshirtSize,
                    referral_source: formData.referralSource,
                    ambassador_name: formData.ambassadorName,
                    reason_for_attending: formData.reasonForAttending,
                    has_attended_before: formData.hasAttendedBefore === 'Yes',
                });

            if (bookingError) {
                console.error('Booking error:', bookingError);
                setError(bookingError.message);
                setSubmitting(false);
                return;
            }

            setSubmitted(true);
        } catch (err) {
            console.error('Submit error:', err);
            setError('An unexpected error occurred. Please try again.');
        }

        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border">
                <div className="p-8 md:p-16 text-center animate-in zoom-in-50 fade-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-300">
                        <Check className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150">
                        Thank You for Registering!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
                        Your application has been received successfully. One of our team members will contact you shortly with further details.
                    </p>
                    <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 max-w-md mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500 delay-[450ms]">
                        <p className="text-brand-800 font-medium">
                            We&apos;re excited to have you join Future Diplomats Cairo 2026!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border">
            {/* Progress Bar */}
            <div className="bg-gray-50 border-b p-4">
                <div className="flex justify-between items-center overflow-x-auto">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center min-w-fit px-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors flex-shrink-0",
                                    step >= s ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
                                )}
                            >
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            <span className={cn("ml-2 text-xs md:text-sm font-medium hidden sm:block", step >= s ? "text-brand" : "text-gray-400")}>
                                {s === 1 ? "Personal" : s === 2 ? "Contact" : "Details"}
                            </span>
                            {s < 3 && <div className={cn("h-[2px] w-4 md:w-8 mx-2 hidden sm:block", step > s ? "bg-brand" : "bg-gray-200")} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 md:p-8">
                {validationError && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{validationError}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Step 1: Personal Info */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-10 fade-in duration-300">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><User className="w-6 h-6 text-brand" /> Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sex <span className="text-red-500">*</span></label>
                                <div className="flex gap-4 pt-2">
                                    {["Male", "Female", "Other"].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sex"
                                                value={opt}
                                                checked={formData.sex === opt}
                                                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                                className="accent-brand w-4 h-4"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date of Birth <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-3 gap-2">
                                    <select
                                        className="border rounded-md p-2 outline-none bg-white"
                                        value={formData.dobDay}
                                        onChange={(e) => setFormData({ ...formData, dobDay: e.target.value })}
                                    >
                                        <option value="">Day</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="border rounded-md p-2 outline-none bg-white"
                                        value={formData.dobMonth}
                                        onChange={(e) => setFormData({ ...formData, dobMonth: e.target.value })}
                                    >
                                        <option value="">Month</option>
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                                            <option key={m} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="border rounded-md p-2 outline-none bg-white"
                                        value={formData.dobYear}
                                        onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })}
                                    >
                                        <option value="">Year</option>
                                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Passport Number</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                    value={formData.passport}
                                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Contact Info */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-10 fade-in duration-300">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6 text-brand" /> Contact Information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                        placeholder="+1 234 567 8900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none mb-2"
                                    placeholder="Street Address"
                                    value={formData.addressStreet}
                                    onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                    placeholder="Address Line 2"
                                    value={formData.addressLine2}
                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                        placeholder="State / Province"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none col-span-2 md:col-span-1"
                                        placeholder="ZIP / Postal Code"
                                        value={formData.zip}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nationality <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company / Educational Institute Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-brand outline-none"
                                    placeholder="University or Employer Name"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Further Details */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-10 fade-in duration-300">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><HelpCircle className="w-6 h-6 text-brand" /> Further Details</h2>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold">T-Shirt Size <span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-4">
                                    {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                                        <label key={size} className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="tshirt"
                                                value={size}
                                                checked={formData.tshirtSize === size}
                                                onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                                                className="accent-brand w-4 h-4"
                                            />
                                            <span className="text-sm">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold">How did you get to know about Future Diplomats? <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["Facebook", "Instagram", "Google", "Our Website", "Ambassador", "Whatsapp/SMS", "Email", "Other"].map((source) => (
                                        <label key={source} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="referral"
                                                value={source}
                                                checked={formData.referralSource === source}
                                                onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                                                className="accent-brand w-4 h-4"
                                            />
                                            <span className="text-sm">{source}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.referralSource === "Other" && (
                                    <input
                                        type="text"
                                        placeholder="Please specify"
                                        className="w-full border rounded-md p-2 mt-2"
                                        value={formData.referralOther}
                                        onChange={(e) => setFormData({ ...formData, referralOther: e.target.value })}
                                    />
                                )}
                                {formData.referralSource === "Ambassador" && (
                                    <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-sm font-bold block mb-1">Name of Ambassador <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter Ambassador Name"
                                            className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-brand"
                                            value={formData.ambassadorName || ""}
                                            onChange={(e) => setFormData({ ...formData, ambassadorName: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold">Previous Experience</label>
                                <p className="text-sm text-gray-600 mb-2">Have you attended a Future Diplomats Conference before? <span className="text-red-500">*</span></p>
                                <div className="flex gap-6">
                                    {["Yes", "No"].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="attended"
                                                value={opt}
                                                checked={formData.hasAttendedBefore === opt}
                                                onChange={(e) => setFormData({ ...formData, hasAttendedBefore: e.target.value })}
                                                className="accent-brand w-4 h-4"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Why do you want to attend Future Diplomats Conference? <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-brand outline-none min-h-[100px]"
                                    value={formData.reasonForAttending}
                                    onChange={(e) => setFormData({ ...formData, reasonForAttending: e.target.value })}
                                />
                            </div>

                            {/* Package Selection */}
                            <div className="space-y-3 pt-4 border-t">
                                <label className="text-sm font-bold">Select Package <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { value: 'conference', label: 'Conference Only', price: '$750' },
                                        { value: 'premium', label: 'Premium Package', price: '$1150' }
                                    ].map((pkg) => (
                                        <label
                                            key={pkg.value}
                                            className={cn(
                                                "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
                                                formData.package === pkg.value
                                                    ? "border-brand bg-brand-50 ring-1 ring-brand"
                                                    : "hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="package"
                                                    value={pkg.value}
                                                    checked={formData.package === pkg.value}
                                                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                                    className="accent-brand w-4 h-4"
                                                />
                                                <span className="font-medium">{pkg.label}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{pkg.price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}


                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                        {step === 1 ? "Cancel" : "Back"}
                    </Button>

                    {step < 3 ? (
                        <Button onClick={nextStep} variant="gold">
                            Next Step <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
