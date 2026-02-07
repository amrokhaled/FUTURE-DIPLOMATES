"use client";

import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { Check, Star, Globe, Shield, Users, Trophy, UserCheck, Plane, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Animation Variants
const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col overflow-x-hidden">
            <HeroSection />
            <StatsSection />

            {/* About Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="flex flex-col lg:flex-row items-center gap-16"
                    >
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-brand-900 leading-tight">
                                About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Conference</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-brand-200 pl-6">
                                Future Diplomats – Cairo Edition is a high-level international diplomacy and leadership conference designed for ambitious young leaders who aspire to engage with global affairs, negotiation, and international cooperation.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Hosted at the <strong className="text-brand">Triumph Luxury Hotel</strong> in New Cairo, the conference brings together 100 carefully selected delegates from Egypt and around the world for an immersive, intellectually rich, and professionally delivered experience.
                            </p>
                        </div>
                        <div className="lg:w-1/2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group border-8 border-white"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1550537042-42da6f8510dc?q=80&w=2692&auto=format&fit=crop"
                                    alt="Cairo Luxury Conference"
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="font-bold text-xl">Cairo, Egypt</p>
                                    <p className="text-brand-100 text-sm">City of a Thousand Minarets</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Objectives & Who Should Apply */}
            <section className="py-24 bg-gradient-to-b from-brand-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Objectives */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <h2 className="text-3xl font-bold text-brand-900 mb-8">Conference Objectives</h2>
                            <ul className="space-y-6">
                                {[
                                    "Develop advanced diplomacy and negotiation skills",
                                    "Enhance leadership, public speaking, and critical thinking",
                                    "Simulate real-world international decision-making processes",
                                    "Promote cross-cultural dialogue and cooperation",
                                    "Position Egypt as a hub for international youth diplomacy"
                                ].map((item, i) => (
                                    <motion.li key={i} variants={fadeIn} className="flex gap-4 items-start p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0 mt-1 text-white shadow-lg">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <p className="text-lg text-gray-700">{item}</p>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Who Should Apply */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-10 rounded-3xl shadow-xl border border-brand-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10"></div>

                            <h2 className="text-3xl font-bold text-brand-900 mb-8 relative z-10">Who Should Apply?</h2>
                            <p className="text-gray-600 mb-6 relative z-10">Future Diplomats is designed for:</p>
                            <ul className="space-y-4 mb-8 relative z-10">
                                {[
                                    "University students (Politics, Law, Business)",
                                    "Young professionals & leaders",
                                    "Model UN participants",
                                    "Youth in NGOs & Global Affairs",
                                    "Ambitious individuals"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-center group">
                                        <div className="w-1 h-6 bg-brand-300 rounded-full group-hover:h-8 group-hover:bg-brand transition-all"></div>
                                        <span className="text-gray-800 font-medium group-hover:text-brand transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="p-4 bg-gradient-to-r from-brand-50 to-transparent rounded-xl text-brand-900 font-semibold text-center border-l-4 border-brand relative z-10">
                                📢 English is the working language
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-900 mb-6">Program Highlights</h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-brand-300 to-brand-600 mx-auto rounded-full"></div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            { text: "Diplomatic Simulations", icon: Globe, color: "from-blue-400 to-blue-600" },
                            { text: "Leadership Workshops", icon: Users, color: "from-indigo-400 to-indigo-600" },
                            { text: "Expert Keynotes", icon: Star, color: "from-sky-400 to-sky-600" },
                            { text: "Global Panels", icon: Shield, color: "from-cyan-400 to-cyan-600" },
                            { text: "Group Discussions", icon: Users, color: "from-teal-400 to-teal-600" },
                            { text: "Networking", icon: Globe, color: "from-brand-400 to-brand-600" },
                            { text: "Gala Ceremony", icon: Star, color: "from-violet-400 to-violet-600" },
                            { text: "Official Awards", icon: Trophy, color: "from-purple-400 to-purple-600" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeIn}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col items-center text-center"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 leading-tight group-hover:text-brand transition-colors">{item.text}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Venue */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2940&auto=format&fit=crop"
                        alt="Luxury Hotel"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-900/90 to-brand-900/80"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center text-white mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Triumph Luxury Hotel</h2>
                        <p className="text-xl text-brand-100 max-w-3xl mx-auto font-light">
                            Experience the pinnacle of Egyptian hospitality in a secure, five-star environment designed for diplomacy.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            { title: "Conference Halls", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2938&auto=format&fit=crop" },
                            { title: "Networking Areas", img: "https://images.unsplash.com/photo-1522771753014-df7091c04a58?q=80&w=2942&auto=format&fit=crop" },
                            { title: "Premium Dining", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940&auto=format&fit=crop" },
                            { title: "Luxury Suites", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2940&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <h3 className="text-white font-bold text-xl">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delegate Packages */}
            <section className="py-24 bg-gray-50" id="packages">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-brand-900 mb-6">Delegate Packages</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Choose your level of participation.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                        {/* Conference Package */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 flex flex-col hover:border-brand-300 transition-all duration-300"
                        >
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Conference Only</h3>
                                <p className="text-gray-500 font-medium">Without Accommodation</p>
                            </div>
                            <div className="text-5xl font-bold text-brand mb-8">$750</div>
                            <ul className="space-y-4 text-gray-600 flex-grow mb-10">
                                {[
                                    "3-Day Conference Access",
                                    "Workshops & Simulations",
                                    "Lunch (Day 2 & 3)",
                                    "Dinner (Day 1)",
                                    "Coffee Breaks",
                                    "Certificate & Kit",
                                    "Networking Events"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-center">
                                        <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-brand" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register">
                                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 h-14 rounded-xl text-lg font-bold">
                                    Register Now
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Premium Package */}
                        <div
                            className="bg-[#14378a] p-10 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden text-white transform md:-translate-y-6 border border-brand-700"
                        >
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg shadow-lg">RECOMMENDED</div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">Premium Package</h3>
                                <p className="text-brand-200 font-medium">All-Inclusive + Accommodation</p>
                            </div>
                            <div className="text-5xl font-bold mb-8">$1,150</div>
                            <ul className="space-y-4 text-brand-50 flex-grow mb-10">
                                <li className="font-bold text-white flex gap-3 items-center">
                                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shrink-0 border border-brand-300">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    Everything in Conference Package
                                </li>
                                {[
                                    "3 Nights Luxury Stay (Triumph)",
                                    "Daily Breakfast",
                                    "Airport Transfers (Round-trip)",
                                    "Priority Support",
                                    "VIP Delegate Experience"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-center">
                                        <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-brand-200" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register">
                                <Button className="w-full bg-white text-brand-900 hover:bg-brand-50 h-14 rounded-xl text-lg font-bold shadow-lg">
                                    Register Premium
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reasons */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16 text-brand-900">Why Choose Future Diplomats?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {[
                            { title: "Diplomatic Hub", desc: "A historic center of diplomacy and culture." },
                            { title: "Accessible", desc: "Central to Africa, Middle East, Europe & Asia." },
                            { title: "Culture & Luxury", desc: "Modern luxury meets ancient history." },
                            { title: "Value", desc: "Competitive costs for a 5-star experience." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-gray-50 hover:bg-brand-50 transition-colors"
                            >
                                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-brand font-bold text-2xl border-4 border-brand-100">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2 text-brand-900">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application CTA */}
            <section className="py-24 bg-brand-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Lead?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                            <span className="text-brand-300 font-bold text-lg block mb-2">01. Limit</span>
                            <p>100 Delegates Only</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                            <span className="text-brand-300 font-bold text-lg block mb-2">02. Timing</span>
                            <p>Rolling Basis Selection</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                            <span className="text-brand-300 font-bold text-lg block mb-2">03. Criteria</span>
                            <p>Merit & Motivation</p>
                        </div>
                    </div>

                    <Link href="/register">
                        <Button className="bg-white text-brand-900 hover:bg-brand-50 h-20 px-16 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition-transform">
                            Apply for Cairo 2026
                        </Button>
                    </Link>
                </div>
            </section>

        </main>
    );
}
