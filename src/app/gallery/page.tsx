"use client";

import { createClient } from "@/lib/supabase/client";

export default function GalleryPage() {
    return (
        <div className="bg-white min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Media Center</h1>
                    <p className="text-gray-500">Relive the moments from our past summits.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${i % 3 === 0 ? 'col-span-2 row-span-2' : ''} aspect-square`}>
                            <div className="w-full h-full bg-gray-200 animate-pulse relative group">
                                <img
                                    src={`https://source.unsplash.com/random/800x600?conference,diplomacy&sig=${i}`}
                                    alt="Conference moment"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    // Using unsplash source directly for demo, usually would use Next Image
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
