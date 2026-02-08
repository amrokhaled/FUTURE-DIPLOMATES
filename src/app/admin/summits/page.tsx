"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea component exists, otherwise Input
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Summit {
    id: string;
    city: string;
    dates: string;
    image_url: string;
    description: string;
    is_active: boolean;
}

export default function SummitsCMS() {
    const [summits, setSummits] = useState<Summit[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSummit, setEditingSummit] = useState<Summit | null>(null);

    // Form State
    const [city, setCity] = useState("");
    const [dates, setDates] = useState("");
    const [image, setImage] = useState("");
    const [desc, setDesc] = useState("");
    const [isActive, setIsActive] = useState(true);

    const supabase = createClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchSummits();
    }, []);

    async function fetchSummits() {
        const { data } = await supabase.from('summits').select('*').order('created_at');
        if (data) setSummits(data);
        setLoading(false);
    }

    function openAddModal() {
        setCity("");
        setDates("");
        setImage("");
        setDesc("");
        setIsActive(true);
        setEditingSummit(null);
        setIsDialogOpen(true);
    }

    function openEditModal(summit: Summit) {
        setEditingSummit(summit);
        setCity(summit.city);
        setDates(summit.dates);
        setImage(summit.image_url);
        setDesc(summit.description);
        setIsActive(summit.is_active);
        setIsDialogOpen(true);
    }

    async function handleSave() {
        if (editingSummit) {
            // Update
            const { error } = await supabase
                .from('summits')
                .update({ city, dates, image_url: image, description: desc, is_active: isActive })
                .eq('id', editingSummit.id);

            if (!error) fetchSummits();
        } else {
            // Insert
            const { error } = await supabase
                .from('summits')
                .insert([{ city, dates, image_url: image, description: desc, is_active: isActive }]);

            if (!error) fetchSummits();
        }
        setIsDialogOpen(false);
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this summit?")) {
            const { error } = await supabase.from('summits').delete().eq('id', id);
            if (!error) fetchSummits();
        }
    }

    async function toggleActive(id: string, current: boolean) {
        const { error } = await supabase
            .from('summits')
            .update({ is_active: !current })
            .eq('id', id);
        if (!error) fetchSummits();
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Summits CMS</h1>
                    <p className="text-slate-500">Manage upcoming summits displayed on the website.</p>
                </div>

                <Button onClick={openAddModal}><Plus className="h-4 w-4 mr-2" /> Add New Summit</Button>
            </div>

            {loading ? <div>Loading content...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summits.map((summit) => (
                        <Card key={summit.id} className={!summit.is_active ? 'opacity-60' : ''}>
                            <div className="h-48 w-full relative bg-slate-200">
                                <img src={summit.image_url} alt={summit.city} className="w-full h-full object-cover rounded-t-lg" />
                                {!summit.is_active && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold">
                                        HIDDEN
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg flex justify-between">
                                    {summit.city}
                                </CardTitle>
                                <p className="text-sm text-slate-500">{summit.dates}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 line-clamp-2">{summit.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive(summit.id, summit.is_active)}>
                                    {summit.is_active ? 'Hide' : 'Show'}
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => openEditModal(summit)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(summit.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white text-slate-900 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingSummit ? 'Edit Summit' : 'Add New Summit'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">City Name</label>
                            <Input
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="e.g. Cairo, Egypt"
                                className="bg-white text-slate-900 border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Dates</label>
                            <Input
                                value={dates}
                                onChange={e => setDates(e.target.value)}
                                placeholder="e.g. July 15-20, 2026"
                                className="bg-white text-slate-900 border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Image URL</label>
                            <Input
                                value={image}
                                onChange={e => setImage(e.target.value)}
                                placeholder="https://..."
                                className="bg-white text-slate-900 border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <Textarea
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="Short description..."
                                className="bg-white text-slate-900 border-slate-300"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                                Visible on website
                            </label>
                        </div>
                        <Button onClick={handleSave} className="w-full">
                            {editingSummit ? 'Update Summit' : 'Create Summit'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
