"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function StatsSection() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Target Date: May 15, 2026 (Example date in May)
        const targetDate = new Date("2026-05-15T09:00:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const logos = [
        { name: "UN", label: "United Nations Model" },
        { name: "EU", label: "European Union Sim" },
        { name: "AU", label: "African Union Partner" },
        { name: "LAS", label: "Arab League Focus" }
    ];

    return (
        <section className="py-12 bg-brand-900 border-b border-brand-800 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Countdown Timer */}
                    <div className="flex flex-col items-center lg:items-start space-y-6">
                        <div className="flex items-center gap-3 text-brand-200">
                            <Clock className="w-6 h-6 animate-pulse" />
                            <span className="text-sm font-bold tracking-widest uppercase">Time Until Opening Ceremony</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            {[
                                { value: timeLeft.days, label: "Days" },
                                { value: timeLeft.hours, label: "Hours" },
                                { value: timeLeft.minutes, label: "Minutes" },
                                { value: timeLeft.seconds, label: "Seconds" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-20 md:w-24 h-20 md:h-24 flex items-center justify-center border border-white/20 shadow-xl">
                                        <span className="text-3xl md:text-4xl font-bold font-mono">{item.value.toString().padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-xs uppercase mt-2 text-brand-300 font-medium tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-transparent via-brand-500 to-transparent"></div>

                    {/* Trust / Stats */}
                    <div className="text-center lg:text-right space-y-6">
                        <p className="text-sm font-bold text-brand-200 uppercase tracking-widest">Conference Statistics</p>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-1">100</div>
                                <div className="text-sm text-brand-300">Selected Delegates</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-1">3</div>
                                <div className="text-sm text-brand-300">Days of Diplomacy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
